import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext<any>(null);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('chat-user');
      if (user) {
        setAuthUser(JSON.parse(user));
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{authUser, setAuthUser}}>
      {children}
    </AuthContext.Provider>
  );
};
