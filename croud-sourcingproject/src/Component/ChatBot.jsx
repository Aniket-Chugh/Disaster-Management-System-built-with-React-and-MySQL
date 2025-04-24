import React, { useState } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiX } from 'react-icons/fi';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: input,
      });

      const botMessage = { role: 'bot', text: res.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = { role: 'bot', text: 'Error! Try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="mt-2 w-80 h-[500px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden border">
          <div className="p-3 bg-blue-600 text-white font-semibold">
            Gemini Chatbot
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex items-center border-t p-2 gap-2">
            <input
              className="flex-1 p-2 border rounded-lg text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
