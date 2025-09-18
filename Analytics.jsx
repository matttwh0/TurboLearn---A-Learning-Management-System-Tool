import { useState, useEffect } from "react";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("MATH"); // Default to MATH class with JSON data
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch Analytics from AI backend
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const insightsPrompt = "JSON only: {student: {topics: {Math: 8, English: 6, Science: 9}}, class: {topics: {Math: 7, English: 8, Science: 6}}}. Score 1-10 per topic. No explanations.";
      
      const res = await fetch("http://127.0.0.1:5001/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: insightsPrompt,
          requestType: "student_insights"
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
      setAnalytics({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  // Generate Quiz from AI backend
  const generateQuiz = async () => {
    setQuizLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: selectedClass,
          difficulty: "intermediate",
          numQuestions: 5,
          classContext: `Generate a quiz tailored for ${selectedClass} class students`
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setQuiz(data.quiz || "");
    } catch (e) {
      console.error(e);
      setQuiz("Error: " + e.message);
    } finally {
      setQuizLoading(false);
    }
  };

  // Download text as file
  const downloadText = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Chat with AI assistant
  const sendChat = async () => {
    if (!question) return;
    setChatLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
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


  return (
    <div className="analytics">
      <h1>Analytics & AI Assistant</h1>
      
      <div className="analytics-grid">
        {/* AI Analytics Section */}
        <div className="card analytics-card">
          <h2>🤖 AI Analysis</h2>
          <button 
            className="btn" 
            onClick={fetchAnalytics} 
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Generate Analysis"}
          </button>
          
          <div className="analysis-placeholder">
            <p>Click "Generate Analysis" to get AI-powered insights about student performance and learning patterns.</p>
          </div>
          
          {analytics && (
            <div className="ai-analysis">
              {analytics.error ? (
                <div className="error-message">
                  <p>❌ Error: {analytics.error}</p>
                </div>
              ) : (
                <div className="analysis-content">
                  <div className="analysis-header">
                    <h3>📊 AI Insights</h3>
                    {analytics.analytics && (
                      <button 
                        className="download-btn"
                        onClick={() => downloadText(analytics.analytics, 'ai-analysis.txt')}
                        title="Download Analysis"
                      >
                        📥 Download
                      </button>
                    )}
                  </div>
                  <div className="analysis-text scrollable-content">
                    {analytics.analytics ? (
                      (() => {
                        try {
                          const data = typeof analytics.analytics === 'string' 
                            ? JSON.parse(analytics.analytics) 
                            : analytics.analytics;
                          
                          return (
                            <div className="progress-analysis">
                              {/* Student Progress */}
                              {data.student && data.student.topics && (
                                <div className="progress-section">
                                  <h4>🎓 Student Performance</h4>
                                  <div className="topic-bars">
                                    {Object.entries(data.student.topics).map(([topic, score]) => (
                                      <div key={topic} className="topic-bar">
                                        <div className="topic-label">{topic}</div>
                                        <div className="progress-container">
                                          <div 
                                            className="progress-bar-fill" 
                                            style={{ width: `${(score / 10) * 100}%` }}
                                          ></div>
                                        </div>
                                        <div className="topic-score">{score}/10</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Class Progress */}
                              {data.class && data.class.topics && (
                                <div className="progress-section">
                                  <h4>👥 Class Performance</h4>
                                  <div className="topic-bars">
                                    {Object.entries(data.class.topics).map(([topic, score]) => (
                                      <div key={topic} className="topic-bar">
                                        <div className="topic-label">{topic}</div>
                                        <div className="progress-container">
                                          <div 
                                            className="progress-bar-fill class-bar" 
                                            style={{ width: `${(score / 10) * 100}%` }}
                                          ></div>
                                        </div>
                                        <div className="topic-score">{score}/10</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } catch (e) {
                          // Fallback to text display if JSON parsing fails
                          return (
                            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                              {analytics.analytics}
                            </pre>
                          );
                        }
                      })()
                    ) : (
                      <p>No analysis data available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Quiz Generator */}
        <div className="card analytics-card">
          <h2>📝 Quiz Generator</h2>
          <div className="quiz-controls">
            <div className="class-selector">
              <label htmlFor="class-select">Select Class:</label>
              <select 
                id="class-select"
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="class-select"
              >
                <option value="MATH">MATH</option>
                <option value="ENGLISH">ENGLISH</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="HISTORY">HISTORY</option>
              </select>
            </div>
            <button 
              className="btn" 
              onClick={generateQuiz} 
              disabled={quizLoading}
            >
              {quizLoading ? "Generating..." : `Generate ${selectedClass} Quiz`}
            </button>
          </div>
          
          {!quiz && (
            <div className="quiz-placeholder">
              <p>Select a class and click "Generate Quiz" to create a personalized quiz for your students.</p>
            </div>
          )}
          
          {quiz && (
            <div className="quiz-content">
              <div className="quiz-header">
                <h3>🎯 {selectedClass} Quiz</h3>
                <button 
                  className="download-btn"
                  onClick={() => downloadText(quiz, `${selectedClass.toLowerCase()}-quiz.txt`)}
                  title="Download Quiz"
                >
                  📥 Download
                </button>
              </div>
              <div className="quiz-text scrollable-content">
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                  {quiz}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="card analytics-card">
          <h2>📈 Performance</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon">📊</div>
              <div className="metric-value">88%</div>
              <div className="metric-label">Average</div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">📈</div>
              <div className="metric-value">+5%</div>
              <div className="metric-label">Improvement</div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">🎯</div>
              <div className="metric-value">12</div>
              <div className="metric-label">Assignments</div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">⭐</div>
              <div className="metric-value">4.2</div>
              <div className="metric-label">Engagement</div>
            </div>
          </div>
        </div>

        {/* Subject Performance Chart */}
        <div className="card analytics-card">
          <h2>📊 Subject Performance</h2>
          <div className="performance-chart">
            <div className="chart-item">
              <div className="chart-label">Math</div>
              <div className="chart-bar">
                <div className="bar-fill" style={{ width: "88%", backgroundColor: "#9c27b0" }}></div>
              </div>
              <div className="chart-value">88%</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">English</div>
              <div className="chart-bar">
                <div className="bar-fill" style={{ width: "88%", backgroundColor: "#4caf50" }}></div>
              </div>
              <div className="chart-value">88%</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">Science</div>
              <div className="chart-bar">
                <div className="bar-fill" style={{ width: "88%", backgroundColor: "#2196f3" }}></div>
              </div>
              <div className="chart-value">88%</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">History</div>
              <div className="chart-bar">
                <div className="bar-fill" style={{ width: "98%", backgroundColor: "#ff9800" }}></div>
              </div>
              <div className="chart-value">98%</div>
            </div>
          </div>
        </div>

        {/* Learning Recommendations */}
        <div className="card analytics-card">
          <h2>💡 Recommendations</h2>
          <div className="recommendations">
            <div className="recommendation-item">
              <div className="rec-icon">🔢</div>
              <div className="rec-content">
                <h4>Word Problems</h4>
                <p>Practice breaking down problems step by step.</p>
              </div>
            </div>
            <div className="recommendation-item">
              <div className="rec-icon">📚</div>
              <div className="rec-content">
                <h4>Division</h4>
                <p>Strengthen division skills with practice.</p>
              </div>
            </div>
            <div className="recommendation-item">
              <div className="rec-icon">🎯</div>
              <div className="rec-content">
                <h4>Keep Strong</h4>
                <p>Maintain excellent work in addition!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics Cards */}
        <div className="card analytics-card">
          <h2>📅 Study Schedule</h2>
          <div className="schedule-content">
            <div className="schedule-item">
              <span className="day">Mon</span>
              <span className="subject">Math</span>
            </div>
            <div className="schedule-item">
              <span className="day">Tue</span>
              <span className="subject">English</span>
            </div>
            <div className="schedule-item">
              <span className="day">Wed</span>
              <span className="subject">Science</span>
            </div>
            <div className="schedule-item">
              <span className="day">Thu</span>
              <span className="subject">History</span>
            </div>
          </div>
        </div>

        <div className="card analytics-card">
          <h2>🎯 Goals</h2>
          <div className="goals-content">
            <div className="goal-item">
              <span className="goal-text">Complete 5 assignments</span>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
            <div className="goal-item">
              <span className="goal-text">Study 2 hours daily</span>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card analytics-card">
          <h2>🏆 Achievements</h2>
          <div className="achievements-content">
            <div className="achievement-badge">
              <span className="badge-icon">⭐</span>
              <span className="badge-text">Perfect Week</span>
            </div>
            <div className="achievement-badge">
              <span className="badge-icon">🔥</span>
              <span className="badge-text">5 Day Streak</span>
            </div>
            <div className="achievement-badge">
              <span className="badge-icon">🎯</span>
              <span className="badge-text">Quiz Master</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
