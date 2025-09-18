import { useState, useEffect } from "react";

export default function Dashboard() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      teacher: "Ms. Shields",
      message: "Hi everyone! Don't forget about the math quiz tomorrow. Study chapters 1-3!",
      time: "2 hours ago"
    },
    {
      id: 2,
      teacher: "Mr. Krabs",
      message: "Greetings students! The science project deadline has been extended to Friday.",
      time: "4 hours ago"
    }
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      subject: "MATH 101",
      title: "Multiplication Sheet",
      dueDate: "Today, September 16",
      status: "due-today"
    },
    {
      id: 2,
      subject: "ENGLISH",
      title: "Essay: My Summer Vacation",
      dueDate: "Wednesday, September 17",
      status: "upcoming"
    },
    {
      id: 3,
      subject: "SCIENCE",
      title: "Lab Report: Photosynthesis",
      dueDate: "Friday, September 19",
      status: "upcoming"
    }
  ]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Campus Image Banner */}
      <div className="campus-banner">
        <img 
          src="sdsu.png" 
          alt="San Diego State University Campus - Mission Revival Architecture with Library, East Commons, and Viejas Arena" 
          className="campus-image"
        />
      </div>

      <div className="grid grid-2">
        {/* Announcements Section */}
        <div className="card">
          <h2>📢 Announcements</h2>
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="announcement-item">
                <div className="announcement-header">
                  <strong>{announcement.teacher}</strong>
                  <span className="time">{announcement.time}</span>
                </div>
                <div className="announcement-message">
                  {announcement.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments Section */}
        <div className="card">
          <h2>📋 Upcoming Assignments</h2>
          <div className="assignments-list">
            {assignments.map((assignment) => (
              <div key={assignment.id} className={`assignment-item ${assignment.status}`}>
                <div className="assignment-date">{assignment.dueDate}</div>
                <div className="assignment-details">
                  <div className="subject">{assignment.subject}</div>
                  <div className="title">{assignment.title}</div>
                </div>
                {assignment.status === "due-today" && (
                  <div className="due-today-badge">Due Today!</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
