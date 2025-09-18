import { useState } from "react";

export default function Grades() {
  const [selectedSubject, setSelectedSubject] = useState("MATH");
  
  const gradeData = {
    MATH: {
      overall: 88,
      breakdown: [
        { assignment: "Multiplication Quiz", grade: 92, date: "Sep 10", weight: 20 },
        { assignment: "Division Test", grade: 85, date: "Sep 8", weight: 25 },
        { assignment: "Word Problems", grade: 78, date: "Sep 5", weight: 30 },
        { assignment: "Homework 1-5", grade: 95, date: "Sep 3", weight: 25 }
      ]
    },
    ENGLISH: {
      overall: 88,
      breakdown: [
        { assignment: "Essay: Summer Vacation", grade: 90, date: "Sep 12", weight: 30 },
        { assignment: "Reading Comprehension", grade: 85, date: "Sep 9", weight: 25 },
        { assignment: "Grammar Quiz", grade: 88, date: "Sep 7", weight: 20 },
        { assignment: "Vocabulary Test", grade: 89, date: "Sep 4", weight: 25 }
      ]
    },
    SCIENCE: {
      overall: 88,
      breakdown: [
        { assignment: "Lab Report: Photosynthesis", grade: 85, date: "Sep 11", weight: 35 },
        { assignment: "Chapter 3 Quiz", grade: 90, date: "Sep 8", weight: 25 },
        { assignment: "Science Fair Project", grade: 88, date: "Sep 6", weight: 40 }
      ]
    },
    HISTORY: {
      overall: 98,
      breakdown: [
        { assignment: "Timeline Project", grade: 100, date: "Sep 13", weight: 30 },
        { assignment: "Chapter 2 Test", grade: 96, date: "Sep 10", weight: 35 },
        { assignment: "Research Paper", grade: 98, date: "Sep 7", weight: 35 }
      ]
    }
  };

  const subjects = Object.keys(gradeData);

  const getGradeColor = (grade) => {
    if (grade >= 90) return "#4caf50";
    if (grade >= 80) return "#ff9800";
    if (grade >= 70) return "#ff5722";
    return "#f44336";
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  const currentData = gradeData[selectedSubject];

  return (
    <div className="grades">
      <h1>Grades</h1>
      
      {/* Grade Statistics */}
      <div className="card">
        <h2>📊 Grade Overview</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{subjects.length}</div>
            <div className="stat-label">Total Subjects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {Math.round(Object.values(gradeData).reduce((sum, subject) => sum + subject.overall, 0) / subjects.length)}%
            </div>
            <div className="stat-label">Overall Average</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {Object.values(gradeData).reduce((sum, subject) => sum + subject.breakdown.length, 0)}
            </div>
            <div className="stat-label">Total Assignments</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {Object.values(gradeData).reduce((sum, subject) => 
                sum + subject.breakdown.filter(assignment => assignment.grade >= 90).length, 0
              )}
            </div>
            <div className="stat-label">A Grades</div>
          </div>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="subject-selection">
        <h2>📚 Select Subject</h2>
        <div className="subject-buttons">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`subject-btn ${selectedSubject === subject ? "active" : ""}`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Grade Cards - Using Classes Layout Structure */}
      <div className="grid grid-3">
        {/* Overall Grade Card */}
        <div className="card grade-square-card">
          <div className="grade-circle-square">
            <div 
              className="grade-percentage"
              style={{ color: getGradeColor(currentData.overall) }}
            >
              {currentData.overall}%
            </div>
            <div className="grade-letter">{getGradeLetter(currentData.overall)}</div>
          </div>
          <h3>{selectedSubject} Grade</h3>
          <p>Current average</p>
          <div className="grade-trend">
            <span className="trend-indicator">📈</span>
            <span>Trending up</span>
          </div>
        </div>

        {/* Grade Breakdown Card */}
        <div className="card grade-square-card">
          <h3>📊 Breakdown</h3>
          <div className="grade-breakdown-compact">
            {currentData.breakdown.slice(0, 3).map((item, index) => (
              <div key={index} className="grade-item-compact">
                <div className="assignment-name-compact">{item.assignment}</div>
                <div 
                  className="grade-score-compact"
                  style={{ color: getGradeColor(item.grade) }}
                >
                  {item.grade}%
                </div>
              </div>
            ))}
            {currentData.breakdown.length < 3 && (
              <div className="breakdown-placeholder">
                <p>More assignments coming soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Assignments Card */}
        <div className="card grade-square-card">
          <h3>📝 Recent</h3>
          <div className="recent-assignments">
            {currentData.breakdown.slice(0, 4).map((item, index) => (
              <div key={index} className="recent-item">
                <div className="recent-name">{item.assignment}</div>
                <div 
                  className="recent-grade"
                  style={{ color: getGradeColor(item.grade) }}
                >
                  {item.grade}%
                </div>
              </div>
            ))}
            {currentData.breakdown.length < 4 && (
              <div className="recent-placeholder">
                <p>Keep up the great work!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
