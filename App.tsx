import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/Auth/Login';
import Signup from './screens/Auth/Signup';
import Conversation from './screens/Chats/Conversation';
import Messages from './screens/Chats/Messages';
import {useAuthContext, AuthProvider} from './context/AuthContext';
import SplashScreen from './screens/SplashScreen/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Conversation"
      component={Conversation}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Messages"
      component={Messages}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const {authUser} = useAuthContext();

  const [loading, setloading] = useState(true);

  setTimeout(() => {
    setloading(false);
  }, 3000);

  return (
    <NavigationContainer>
      {loading ? <SplashScreen /> : authUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return <RootNavigator />;
}
