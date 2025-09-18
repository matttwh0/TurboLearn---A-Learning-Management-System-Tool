import { useState } from "react";

export default function FloatingAI({ currentClass = null }) {
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sendChat = async () => {
    if (!question) return;
    setChatLoading(true);
    try {
      const context = currentClass 
        ? `${question} (This is for ${currentClass.subject} class with ${currentClass.teacher})`
        : question;
        
      const res = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: context })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setChatAnswer(data.answer || "");
    } catch (e) {
      console.error(e);
      setChatAnswer("Error: " + e.message);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="floating-ai">
        <button 
          className="ai-toggle-btn"
          onClick={() => setIsExpanded(true)}
          title={currentClass ? `Ask AI about ${currentClass.subject}` : "Ask AI Assistant"}
        >
          🤖
        </button>
      </div>
    );
  }

  return (
    <div className="floating-ai">
      <div className="ai-chat-window">
        <div className="ai-header">
          <h3>🤖 AI Assistant {currentClass && `- ${currentClass.subject}`}</h3>
          <button 
            className="ai-close-btn"
            onClick={() => setIsExpanded(false)}
            title="Close AI Assistant"
          >
            ✕
          </button>
        </div>
        
        <div className="ai-content">
          <div className="chat-input">
            <input
              type="text"
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={currentClass ? `Ask about ${currentClass.subject}...` : "Ask me anything..."}
              onKeyPress={(e) => e.key === 'Enter' && sendChat()}
            />
            <button 
              className="btn"
              onClick={sendChat} 
              disabled={chatLoading}
            >
              {chatLoading ? "..." : "Ask"}
            </button>
          </div>
          
          {chatAnswer && (
            <div className="chat-response">
              <div className="response-text">
                {chatAnswer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
