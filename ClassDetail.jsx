import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClassContext } from "./ClassContext";

export default function ClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { setCurrentClass } = useClassContext();
  const [activeTab, setActiveTab] = useState("stream");
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const classData = {
    1: {
      id: 1,
      subject: "MATH",
      grade: 88,
      color: "#b39ddb",
      teacher: "Ms. Shields",
      room: "Room 201",
      assignments: [
        { id: 1, title: "Multiplication Sheet", due: "Today", status: "pending", description: "Complete problems 1-50" },
        { id: 2, title: "Division Problems", due: "Tomorrow", status: "pending", description: "Chapter 4 exercises" },
        { id: 3, title: "Word Problems Quiz", due: "Friday", status: "completed", description: "Practice word problems" }
      ],
      syllabus: [
        { week: 1, topic: "Basic Operations", description: "Addition, subtraction, multiplication, division" },
        { week: 2, topic: "Fractions", description: "Understanding and working with fractions" },
        { week: 3, topic: "Decimals", description: "Decimal operations and conversions" },
        { week: 4, topic: "Geometry Basics", description: "Shapes, angles, and measurements" }
      ],
      announcements: [
        { id: 1, title: "Quiz Tomorrow", message: "Don't forget about the multiplication quiz tomorrow!", date: "2 hours ago" },
        { id: 2, title: "Extra Credit", message: "Complete the bonus problems for extra credit points.", date: "1 day ago" }
      ]
    },
    2: {
      id: 2,
      subject: "ENGLISH",
      grade: 88,
      color: "#a5d6a7",
      teacher: "Mr. Johnson",
      room: "Room 105",
      assignments: [
        { id: 1, title: "Essay: My Summer Vacation", due: "Wednesday", status: "pending", description: "Write a 500-word essay" },
        { id: 2, title: "Reading Comprehension", due: "Friday", status: "completed", description: "Answer questions about the story" },
        { id: 3, title: "Vocabulary Test", due: "Next Monday", status: "pending", description: "Study words from chapters 1-3" }
      ],
      syllabus: [
        { week: 1, topic: "Creative Writing", description: "Introduction to creative writing techniques" },
        { week: 2, topic: "Grammar Review", description: "Parts of speech and sentence structure" },
        { week: 3, topic: "Reading Analysis", description: "Analyzing literature and themes" },
        { week: 4, topic: "Research Skills", description: "How to research and cite sources" }
      ],
      announcements: [
        { id: 1, title: "Library Visit", message: "We'll be visiting the library next week for research.", date: "3 hours ago" },
        { id: 2, title: "Writing Contest", message: "Submit your creative writing for the school contest!", date: "2 days ago" }
      ]
    },
    3: {
      id: 3,
      subject: "SCIENCE",
      grade: 88,
      color: "#90caf9",
      teacher: "Dr. Smith",
      room: "Lab 3",
      assignments: [
        { id: 1, title: "Lab Report: Photosynthesis", due: "Friday", status: "pending", description: "Complete lab report with data analysis" },
        { id: 2, title: "Science Fair Project", due: "Next Week", status: "in-progress", description: "Work on your science fair presentation" },
        { id: 3, title: "Chapter 5 Quiz", due: "Monday", status: "completed", description: "Quiz on plant biology" }
      ],
      syllabus: [
        { week: 1, topic: "Plant Biology", description: "Understanding plant structure and function" },
        { week: 2, topic: "Photosynthesis", description: "How plants make food from sunlight" },
        { week: 3, topic: "Ecosystems", description: "Food chains and environmental relationships" },
        { week: 4, topic: "Human Body", description: "Basic anatomy and physiology" }
      ],
      announcements: [
        { id: 1, title: "Lab Safety", message: "Remember to follow all safety procedures in the lab.", date: "1 hour ago" },
        { id: 2, title: "Science Fair", message: "Science fair projects are due next week!", date: "3 days ago" }
      ]
    },
    4: {
      id: 4,
      subject: "HISTORY",
      grade: 98,
      color: "#ffcc80",
      teacher: "Prof. Williams",
      room: "Room 156",
      assignments: [
        { id: 1, title: "Timeline Project", due: "Monday", status: "completed", description: "Create a timeline of major events" },
        { id: 2, title: "Research Paper", due: "Next Friday", status: "pending", description: "Write about a historical figure" },
        { id: 3, title: "Chapter 3 Test", due: "Wednesday", status: "pending", description: "Test on ancient civilizations" }
      ],
      syllabus: [
        { week: 1, topic: "Ancient Civilizations", description: "Egypt, Greece, and Rome" },
        { week: 2, topic: "Middle Ages", description: "Feudalism and medieval life" },
        { week: 3, topic: "Renaissance", description: "Art, science, and cultural rebirth" },
        { week: 4, topic: "Modern History", description: "Industrial revolution and beyond" }
      ],
      announcements: [
        { id: 1, title: "Museum Trip", message: "We're planning a trip to the history museum next month.", date: "4 hours ago" },
        { id: 2, title: "Guest Speaker", message: "A historian will visit our class next week!", date: "1 day ago" }
      ]
    }
  };

  const currentClass = classData[classId];

  useEffect(() => {
    if (currentClass) {
      setCurrentClass(currentClass);
    }
    
    // Cleanup function to clear context when component unmounts
    return () => {
      setCurrentClass(null);
    };
  }, [classId]);

  if (!currentClass) {
    return (
      <div className="class-detail">
        <h1>Class Not Found</h1>
        <button className="btn" onClick={() => navigate("/classes")}>
          Back to Classes
        </button>
      </div>
    );
  }

  const sendChat = async () => {
    if (!question) return;
    setChatLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: `${question} (This is for ${currentClass.subject} class with ${currentClass.teacher})`
        })
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

  const tabs = [
    { id: "assignments", label: "Assignments", icon: "📝" },
    { id: "syllabus", label: "Syllabus", icon: "📚" },
    { id: "announcements", label: "Announcements", icon: "📢" }
  ];

  return (
    <div className="classroom-layout">
      {/* Class Banner - Full Width */}
      <div className="class-banner" style={{ backgroundColor: currentClass.color }}>
        <div className="banner-content">
          <h2>{currentClass.subject}</h2>
          <p>{currentClass.teacher} • {currentClass.room}</p>
        </div>
        <div className="banner-decoration">
          <div className="graduation-cap">🎓</div>
          <div className="graduation-cap">🎓</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="classroom-tabs-container">
        <div className="classroom-tabs">
          <button className={`tab-btn ${activeTab === "stream" ? "active" : ""}`} onClick={() => setActiveTab("stream")}>
            Stream
          </button>
          <button className={`tab-btn ${activeTab === "assignments" ? "active" : ""}`} onClick={() => setActiveTab("assignments")}>
            Classwork
          </button>
          <button className={`tab-btn ${activeTab === "syllabus" ? "active" : ""}`} onClick={() => setActiveTab("syllabus")}>
            Syllabus
          </button>
          <button className={`tab-btn ${activeTab === "announcements" ? "active" : ""}`} onClick={() => setActiveTab("announcements")}>
            Announcements
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="classroom-main">
        {/* Left Sidebar */}
        <div className="classroom-sidebar">
          {/* Progress Section */}
          <div className="sidebar-card progress-card">
            <div className="weekly-progress">
              <h4>This Week's Goals</h4>
              <div className="progress-cards">
                <div className="progress-card">
                  <div className="progress-icon">📝</div>
                  <div className="progress-info">
                    <h5>Assignments</h5>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "75%" }}></div>
                      </div>
                      <span className="progress-text">3/4</span>
                    </div>
                  </div>
                </div>
                
                <div className="progress-card">
                  <div className="progress-icon">📚</div>
                  <div className="progress-info">
                    <h5>Reading</h5>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "60%" }}></div>
                      </div>
                      <span className="progress-text">6/10</span>
                    </div>
                  </div>
                </div>
                
                <div className="progress-card">
                  <div className="progress-icon">🎯</div>
                  <div className="progress-info">
                    <h5>Practice</h5>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "90%" }}></div>
                      </div>
                      <span className="progress-text">18/20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Section - Full Width */}
          <div className="sidebar-card ai-chat-card">
            <h3>🤖 AI Assistant</h3>
            <div className="chat-input">
              <input
                type="text"
                className="input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Ask about ${currentClass.subject}...`}
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

        {/* Main Stream Area */}
        <div className="classroom-stream">
          {/* Stream Tab Content */}
          {activeTab === "stream" && (
            <div className="stream-content">
              {/* Announcement Input */}
              <div className="stream-card announcement-input">
                <div className="profile-avatar">👤</div>
                <div className="announcement-placeholder">
                  Announce something to your class
                </div>
              </div>

              {/* Assignments Feed */}
              {currentClass.assignments.map((assignment) => (
                <div key={assignment.id} className="stream-card assignment-post">
                  <div className="post-header">
                    <div className="post-icon">📝</div>
                    <div className="post-info">
                      <span className="post-author">{currentClass.teacher}</span>
                      <span className="post-time">Yesterday</span>
                    </div>
                    <div className="post-menu">⋯</div>
                  </div>
                  <div className="post-content">
                    <p><strong>{currentClass.teacher}</strong> posted a new assignment: <strong>{assignment.title}</strong></p>
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-due">Due: {assignment.due}</div>
                  </div>
                </div>
              ))}

              {/* Announcements Feed */}
              {currentClass.announcements.map((announcement) => (
                <div key={announcement.id} className="stream-card announcement-post">
                  <div className="post-header">
                    <div className="post-icon">👤</div>
                    <div className="post-info">
                      <span className="post-author">{currentClass.teacher}</span>
                      <span className="post-time">{announcement.date}</span>
                    </div>
                    <div className="post-menu">⋯</div>
                  </div>
                  <div className="post-content">
                    <p><strong>{announcement.title}</strong></p>
                    <p>{announcement.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Tab Content */}
          {activeTab === "assignments" && (
            <div className="assignments-tab">
              <h2>📝 Assignments</h2>
              <div className="assignments-list">
                {currentClass.assignments.map((assignment) => (
                  <div key={assignment.id} className={`assignment-card ${assignment.status}`}>
                    <div className="assignment-header">
                      <h3>{assignment.title}</h3>
                      <span className={`status-badge ${assignment.status}`}>
                        {assignment.status === "completed" ? "✅ Completed" : 
                         assignment.status === "in-progress" ? "🔄 In Progress" : "⏳ Pending"}
                      </span>
                    </div>
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-due">Due: {assignment.due}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "syllabus" && (
            <div className="syllabus-tab">
              <h2>📚 Syllabus</h2>
              <div className="syllabus-list">
                {currentClass.syllabus.map((item, index) => (
                  <div key={index} className="syllabus-item">
                    <div className="week-number">Week {item.week}</div>
                    <div className="syllabus-content">
                      <h3>{item.topic}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="announcements-tab">
              <h2>📢 Announcements</h2>
              <div className="announcements-list">
                {currentClass.announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-header">
                      <h3>{announcement.title}</h3>
                      <span className="announcement-date">{announcement.date}</span>
                    </div>
                    <p>{announcement.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
