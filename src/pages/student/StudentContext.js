import { createContext, useContext } from "react";

const StudentContext = createContext();

export function StudentProvider({ value, children }) {
  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export const useStudent = () => {
  return useContext(StudentContext);
};
