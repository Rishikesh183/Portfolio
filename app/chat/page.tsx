'use client';
import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  user: string;
  bot: string;
}

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    setChatLog(prev => [...prev, { user: userMessage, bot: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const botMessage = typeof data.answer === 'string' ? data.answer : 'Sorry, I could not find an answer.';

      setChatLog(prev => {
        const updatedLog = [...prev];
        updatedLog[updatedLog.length - 1].bot = botMessage;
        return updatedLog;
      });
    } catch (err) {
      console.error(err);
      setChatLog(prev => {
        const updatedLog = [...prev];
        updatedLog[updatedLog.length - 1].bot = "Sorry, there was an error processing your request.";
        return updatedLog;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] p-2 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl mx-auto bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 border border-purple-800 shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            💬 Chat with Rishi&apos;s AI
          </span>
        </h1>

        <div className="space-y-4 h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-y-auto rounded-lg border border-purple-700 p-2 sm:p-3 md:p-4 bg-black bg-opacity-50">
          {chatLog.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-300 text-center text-sm sm:text-base px-2">Ask me anything about Rishikesh&apos;s skills, experience, or projects!</p>
            </div>
          ) : (
            chatLog.map((msg, i) => (
              <div key={i} className="mb-3 sm:mb-4">
                <div className="flex items-start mb-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                    You
                  </div>
                  <div className="ml-2 px-3 py-2 bg-blue-600 bg-opacity-30 rounded-lg border border-blue-700 text-white max-w-[80%] sm:max-w-[85%] text-sm sm:text-base break-words">
                    {msg.user}
                  </div>
                </div>
                
                {msg.bot && (
                  <div className="flex items-start mt-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                      AI
                    </div>
                    <div className="ml-2 px-3 py-2 bg-purple-900 bg-opacity-40 rounded-lg border border-purple-800 text-gray-100 whitespace-pre-wrap max-w-[80%] sm:max-w-[85%] text-sm sm:text-base break-words">
                      {msg.bot}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex items-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                AI
              </div>
              <div className="ml-2 px-3 py-2 bg-purple-900 bg-opacity-40 rounded-lg border border-purple-800 text-purple-300">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Ask about Rishikesh's skills..."
            className="w-full p-2 sm:p-3 rounded-lg bg-black bg-opacity-60 text-white border border-purple-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-purple-300 text-sm sm:text-base"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-sm sm:text-base flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wait
              </span>
            ) : (
              <span className="flex items-center">
                Send
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;