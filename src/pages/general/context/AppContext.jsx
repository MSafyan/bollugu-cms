/*
  Imports
*/
import { createContext } from 'react';

export const AppContext = createContext();

/*
    Main Working
*/
export const AppProvider = ({ children }) => {
  return <AppContext.Provider value={true}>{children}</AppContext.Provider>;
};
