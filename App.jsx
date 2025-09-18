import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Classes from "./components/Classes";
import ClassDetail from "./components/ClassDetail";
import Grades from "./components/Grades";
import Analytics from "./components/Analytics";
import FloatingAI from "./components/FloatingAI";
import { ClassProvider, useClassContext } from "./components/ClassContext";
import "./App.css";

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "DASHBOARD" },
    { path: "/classes", label: "CLASSES" },
    { path: "/grades", label: "GRADES" },
    { path: "/analytics", label: "ANALYTICS" }
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AppContent() {
  const { currentClass } = useClassContext();
  const location = useLocation();
  
  // Only show chatbot on class detail pages
  const showChatbot = location.pathname.startsWith('/class/');
  
  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/class/:classId" element={<ClassDetail />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      {showChatbot && <FloatingAI currentClass={currentClass} />}
    </div>
  );
}

export default function App() {
  return (
    <ClassProvider>
      <Router>
        <AppContent />
      </Router>
    </ClassProvider>
  );
}
