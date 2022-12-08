/*
  Imports
*/
import { createContext } from 'react';
import { Offline, Online } from 'react-detect-offline';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import { BackendURL } from 'src/config/settings';

export const AppContext = createContext();

/*
    Main Working
*/
export const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={true}>
      {children}
      <Offline polling={{ interval: 20000 }}>
        <AlertSnackbar severity="warning" open>
          You are offline!
        </AlertSnackbar>
      </Offline>
      <Online>
        <Offline polling={{ url: BackendURL, interval: 5000 }}>
          <AlertSnackbar severity="error" open>
            Server is offline
          </AlertSnackbar>
        </Offline>
      </Online>
    </AppContext.Provider>
  );
};
