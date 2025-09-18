import { createContext, useContext, useState } from "react";

const ClassContext = createContext();

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};

export const ClassProvider = ({ children }) => {
  const [currentClass, setCurrentClass] = useState(null);

  return (
    <ClassContext.Provider value={{ currentClass, setCurrentClass }}>
      {children}
    </ClassContext.Provider>
  );
};
