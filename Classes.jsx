import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([
    {
      id: 1,
      subject: "MATH",
      grade: 88,
      color: "#9c27b0",
      assignments: [
        { title: "Multiplication Sheet", due: "Today", status: "pending" },
        { title: "Division Problems", due: "Tomorrow", status: "pending" }
      ],
      teacher: "Ms. Shields",
      room: "Room 201"
    },
    {
      id: 2,
      subject: "ENGLISH",
      grade: 88,
      color: "#4caf50",
      assignments: [
        { title: "Essay: My Summer Vacation", due: "Wednesday", status: "pending" },
        { title: "Reading Comprehension", due: "Friday", status: "completed" }
      ],
      teacher: "Mr. Johnson",
      room: "Room 105"
    },
    {
      id: 3,
      subject: "SCIENCE",
      grade: 88,
      color: "#2196f3",
      assignments: [
        { title: "Lab Report: Photosynthesis", due: "Friday", status: "pending" },
        { title: "Science Fair Project", due: "Next Week", status: "in-progress" }
      ],
      teacher: "Dr. Smith",
      room: "Lab 3"
    },
    {
      id: 4,
      subject: "HISTORY",
      grade: 98,
      color: "#ff9800",
      assignments: [
        { title: "Timeline Project", due: "Monday", status: "completed" },
        { title: "Research Paper", due: "Next Friday", status: "pending" }
      ],
      teacher: "Prof. Williams",
      room: "Room 156"
    }
  ]);

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "#4caf50";
    if (grade >= 80) return "#ff9800";
    if (grade >= 70) return "#ff5722";
    return "#f44336";
  };

  const getGradeStatus = (grade) => {
    if (grade >= 90) return "Excellent";
    if (grade >= 80) return "Good";
    if (grade >= 70) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="classes">
      <h1>Classes</h1>
      
      <div className="grid grid-3">
        {classes.map((classItem) => (
          <div 
            key={classItem.id} 
            className="class-card"
            style={{ borderColor: classItem.color }}
            onClick={() => handleClassClick(classItem.id)}
          >
            <div className="class-header">
              <h3 style={{ color: classItem.color }}>{classItem.subject}</h3>
              <div className="grade-display">
                <span 
                  className="grade-percentage"
                  style={{ color: getGradeColor(classItem.grade) }}
                >
                  {classItem.grade}%
                </span>
                <span className="grade-status">{getGradeStatus(classItem.grade)}</span>
              </div>
            </div>
            
            <div className="class-info">
              <div className="teacher-info">
                <span className="teacher">👨‍🏫 {classItem.teacher}</span>
                <span className="room">📍 {classItem.room}</span>
              </div>
            </div>

            <div className="class-preview">
              <div className="assignments-preview">
                <h4>📝 Recent Assignments</h4>
                {classItem.assignments.slice(0, 2).map((assignment, index) => (
                  <div key={index} className={`assignment ${assignment.status}`}>
                    <div className="assignment-title">{assignment.title}</div>
                    <div className="assignment-due">Due: {assignment.due}</div>
                    <div className={`assignment-status ${assignment.status}`}>
                      {assignment.status === "completed" ? "✅" : 
                       assignment.status === "in-progress" ? "🔄" : "⏳"}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="class-actions">
                <button className="btn" style={{ backgroundColor: classItem.color }}>
                  View Class
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
