// controllers/agentController.js

const openai = require('../services/openai');
const Agent = require('../models/Agent');
const Case = require('../models/Case');

exports.interactWithAgent = async (req, res) => {
  try {
    const { agentId, message } = req.body;

    // Fetch agent from database
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found.' });
    }

    // Fetch case and verify user
    const userCase = await Case.findById(agent.caseId);
    if (userCase.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    // Check if the agent can legally respond
    const canRespond = checkLegalConstraints(agent, userCase);
    if (!canRespond) {
      return res.status(403).json({ message: `${agent.characterName} refuses to talk.` });
    }

    // Add user's message to conversation history
    agent.conversationHistory.push({ role: 'user', content: message });

    // Generate agent's response using Chat Completion API
    const messages = generateChatMessages(agent, userCase);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available
      messages,
    });

    const agentResponse = completion.data.choices[0].message.content.trim();

    // Add agent's response to conversation history
    agent.conversationHistory.push({ role: 'assistant', content: agentResponse });
    await agent.save();

    res.status(200).json({ response: agentResponse });
  } catch (error) {
    console.error('Error interacting with agent:', error);
    res.status(500).json({ message: 'Error interacting with agent.' });
  }
};

function generateChatMessages(agent, userCase) {
  // Start with a system prompt to set the context
  const messages = [
    {
      role: 'system',
      content: `You are ${agent.characterName}, a ${agent.role} in a courtroom simulation game. Answer questions and respond appropriately based on your role, knowledge, and the legal context.`,
    },
  ];

  // Add conversation history
  agent.conversationHistory.forEach((entry) => {
    messages.push({
      role: entry.role, // 'user' or 'assistant'
      content: entry.content,
    });
  });

  return messages;
}

function checkLegalConstraints(agent, userCase) {
  // Implement logic based on agent's role, user's role, and subpoena status
  // The user is either 'prosecutor' or 'defense'

  const userRole = userCase.role; // 'prosecutor' or 'defense'
  const agentRole = agent.role;   // e.g., 'victim', 'witness', 'accused'

  // Define legal constraints
  const constraints = {
    // Accused will not talk unless subpoenaed by defense
    accused: () => agent.subpoenaed && userRole === 'defense',
    // Victim will talk to prosecutor; needs subpoena for defense
    victim: () => agent.subpoenaed || userRole === 'prosecutor',
    // Witness will talk if subpoenaed
    witness: () => agent.subpoenaed,
    // Defense attorney and prosecutor (AI opponent) will interact during trial
    'defense attorney': () => userRole === 'prosecutor',
    prosecutor: () => userRole === 'defense',
    // Judge and jury are accessible during the trial phase
    judge: () => true,
    jury: () => false, // Jury does not interact directly
    // Police officer will talk to prosecutor; needs subpoena for defense
    'police officer': () => agent.subpoenaed || userRole === 'prosecutor',
    // Default case: allow interaction
    default: () => true,
  };

  const canInteract = constraints[agentRole] || constraints['default'];
  return canInteract();
}

exports.issueSubpoena = async (req, res) => {
  try {
    const { agentId } = req.body;

    // Fetch agent and case
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found.' });
    }

    const userCase = await Case.findById(agent.caseId);
    if (userCase.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    // Update agent's status to reflect subpoena
    agent.subpoenaed = true;
    await agent.save();

    res.status(200).json({ message: `Subpoena issued to ${agent.characterName} successfully.` });
  } catch (error) {
    console.error('Error issuing subpoena:', error);
    res.status(500).json({ message: 'Error issuing subpoena.' });
  }
};
