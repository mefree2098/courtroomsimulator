// src/components/PreTrial.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function PreTrial() {
  const { caseId } = useParams();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/case/${caseId}/agents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgents(res.data.agents);
      } catch (error) {
        console.error('Error fetching agents:', error.response.data.message);
      }
    };
    fetchAgents();
  }, [caseId]);

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setConversation(agent.conversationHistory || []);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/agent/interact',
        { agentId: selectedAgent._id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedConversation = [
        ...conversation,
        { role: 'user', content: message },
        { role: 'assistant', content: res.data.response },
      ];

      setConversation(updatedConversation);
      setMessage('');

      // Update the selected agent's conversation history
      setSelectedAgent({
        ...selectedAgent,
        conversationHistory: updatedConversation,
      });
    } catch (error) {
      console.error('Error interacting with agent:', error.response.data.message);
      alert(`${selectedAgent.characterName} refuses to talk.`);
    }
  };

  const handleIssueSubpoena = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/agent/subpoena',
        { agentId: selectedAgent._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Subpoena issued to ${selectedAgent.characterName} successfully.`);

      // Update the agent's subpoenaed status
      setSelectedAgent({
        ...selectedAgent,
        subpoenaed: true,
      });
    } catch (error) {
      console.error('Error issuing subpoena:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Pre-Trial Phase</h2>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%' }}>
          <h3>Agents</h3>
          <ul>
            {agents.map((agent) => (
              <li
                key={agent._id}
                onClick={() => handleAgentSelect(agent)}
                style={{
                  cursor: 'pointer',
                  fontWeight: selectedAgent?._id === agent._id ? 'bold' : 'normal',
                }}
              >
                {agent.characterName} ({agent.role})
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: '70%' }}>
          {selectedAgent ? (
            <div>
              <h3>Conversation with {selectedAgent.characterName}</h3>
              <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {conversation.map((entry, index) => (
                  <p key={index}>
                    <strong>{entry.role === 'user' ? 'You' : selectedAgent.characterName}:</strong> {entry.content}
                  </p>
                ))}
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question..."
                style={{ width: '80%', padding: '5px' }}
              />
              <button onClick={handleSendMessage} style={{ padding: '5px 10px' }}>
                Send
              </button>
              {!selectedAgent.subpoenaed && (
                <button onClick={handleIssueSubpoena} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                  Issue Subpoena
                </button>
              )}
            </div>
          ) : (
            <p>Select an agent to interact with.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreTrial;
