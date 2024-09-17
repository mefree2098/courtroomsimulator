// controllers/trialController.js

const openai = require('../services/openai');
const Case = require('../models/Case');

exports.handleObjection = async (req, res) => {
  try {
    const { caseId, objectionType } = req.body;

    const objectionTypes = ['relevance', 'hearsay', 'speculation', 'leading', 'asked and answered'];

    // Validate objection type
    if (!objectionTypes.includes(objectionType)) {
      return res.status(400).json({ message: 'Invalid objection type.' });
    }

    // Fetch case and verify user
    const userCase = await Case.findById(caseId);
    if (userCase.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    // Generate judge's ruling using OpenAI
    const prompt = `You are a judge in a courtroom. A lawyer has objected with "${objectionType}". Provide a ruling with reasoning.`;
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
    });
    const ruling = completion.data.choices[0].text.trim();

    // Save ruling to case trial data
    userCase.trialData.judgeRulings.push({ objectionType, ruling });
    await userCase.save();

    res.status(200).json({ ruling });
  } catch (error) {
    res.status(500).json({ message: 'Error handling objection.' });
  }
};
