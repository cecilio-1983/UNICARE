import { createContext, useContext } from "react";

const DoctorContext = createContext();

export function DoctorProvider({ value, children }) {
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
}

export const useDoctor = () => {
  return useContext(DoctorContext);
};
