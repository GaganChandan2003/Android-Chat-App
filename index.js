import * as React from 'react';
import {AppRegistry} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './App';
import {SocketContextProvider} from './context/SocketContext';
import {AuthProvider} from './context/AuthContext';

export default function Main() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </PaperProvider>
    </AuthProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
