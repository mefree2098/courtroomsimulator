// controllers/caseController.js

const openai = require('../services/openai');
const Case = require('../models/Case');
const Agent = require('../models/Agent');
const User = require('../models/User');
const CaseSummary = require('../models/CaseSummary');

exports.generateCase = async (req, res) => {
  try {
    const { role } = req.body; // 'prosecutor' or 'defense'

    // Generate case details using OpenAI
    const generateCasePrompt = `
You are a legal case generator for a courtroom simulator game. Generate a detailed criminal case involving a crime, including:

- Type of crime (e.g., theft, assault, fraud)
- Description of the incident
- Details about the victim(s)
- Details about the suspect(s)
- Evidence available
- Who the police arrested

Ensure the case is coherent and legally plausible.
`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generateCasePrompt,
      max_tokens: 500,
    });

    const caseDetailsText = completion.data.choices[0].text.trim();
    // For this example, we'll store the case details text as is
    const caseDetails = { description: caseDetailsText };

    // Create new case in the database
    const newCase = new Case({
      userId: req.user,
      role,
      caseDetails,
    });
    await newCase.save();

    // Generate AI agents for characters (simplified)
    const characters = [
      { name: 'Victim', role: 'victim' },
      { name: 'Witness', role: 'witness' },
      { name: 'Accused', role: 'accused' },
      { name: 'Judge', role: 'judge' },
      { name: 'Police Officer', role: 'police officer' },
    ];

    for (const character of characters) {
      const agent = new Agent({
        caseId: newCase._id,
        characterName: character.name,
        role: character.role,
        conversationHistory: [],
        subpoenaed: false,
      });
      await agent.save();
    }

    res.status(200).json({ caseId: newCase._id, caseDetails });
  } catch (error) {
    console.error('Error generating case:', error);
    res.status(500).json({ message: 'Error generating case.' });
  }
};

exports.concludeCase = async (req, res) => {
  try {
    const { caseId, verdict } = req.body;

    // Fetch case and user
    const userCase = await Case.findById(caseId);
    if (!userCase) {
      return res.status(404).json({ message: 'Case not found.' });
    }

    if (userCase.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const user = await User.findById(req.user);

    // Update case verdict
    userCase.verdict = verdict;
    await userCase.save();

    // Update user's win/loss record
    if (
      (verdict === 'guilty' && userCase.role === 'prosecutor') ||
      (verdict === 'not guilty' && userCase.role === 'defense')
    ) {
      user.winLossRecord.wins += 1;
    } else {
      user.winLossRecord.losses += 1;
    }
    await user.save();

    // Create a case summary
    const caseSummary = new CaseSummary({
      caseId,
      userId: req.user,
      verdict,
      actualOutcome: 'Outcome based on AI simulation',
      summaryText: 'Summary of the case proceedings and verdict.',
    });
    await caseSummary.save();

    res.status(200).json({ message: 'Case concluded.' });
  } catch (error) {
    console.error('Error concluding case:', error);
    res.status(500).json({ message: 'Error concluding case.' });
  }
};

exports.getCaseAgents = async (req, res) => {
  try {
    const { caseId } = req.params;
    const userCase = await Case.findById(caseId);
    if (!userCase) {
      return res.status(404).json({ message: 'Case not found.' });
    }

    if (userCase.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const agents = await Agent.find({ caseId }, '-conversationHistory');
    res.status(200).json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Error fetching agents.' });
  }
};

exports.getCaseSummaries = async (req, res) => {
  try {
    const caseSummaries = await CaseSummary.find({ userId: req.user });
    res.status(200).json({ caseSummaries });
  } catch (error) {
    console.error('Error fetching case summaries:', error);
    res.status(500).json({ message: 'Error fetching case summaries.' });
  }
};
