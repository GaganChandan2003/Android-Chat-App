import axios from 'axios';
import React, {useState} from 'react';
import {
  Button,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar} from 'react-native-paper';
import {useAuthContext} from '../../context/AuthContext';

const Login = ({navigation: {navigate}}: any) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {setAuthUser} = useAuthContext();

  const onDismissSnackBar = () => setVisible(false);

  const handleLogin = async () => {
    if (userName && password) {
      setLoading(true);
      try {
        const res = await axios.post(
          'https://wavoo.onrender.com/api/auth/login',
          {
            userName: userName.trim(),
            password: password.trim(),
          },
        );
        setAuthUser(res.data);
        await AsyncStorage.setItem('chat-user', JSON.stringify(res.data));
      } catch (error) {
        setError('Login failed. Please try again.');
        setVisible(true);
      } finally {
        setLoading(false);
      }
    } else {
      setError('All fields are required!');
      setVisible(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../../assets/splashscreenbg.png')}
        resizeMode="cover"
        style={styles.image}>
        <StatusBar
          animated={true}
          backgroundColor="#192849"
          barStyle={'light-content'}
        />
        <View style={styles.containerWrapper}>
          <View style={styles.headerContainer}>
            <Text style={{fontSize: 26, fontWeight: '800', color: '#FFFFFF'}}>
              Hi, Welcome Back!
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: 'lightgrey',
                marginLeft: 3,
              }}>
              Hello again, you've been missed!
            </Text>
          </View>
          <View>
            <View style={styles.inputForm}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 2,
                  marginBottom: 6,
                }}>
                User Name
              </Text>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            <View style={styles.inputForm}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 2,
                  marginBottom: 6,
                }}>
                Password
              </Text>
              <TextInput
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.inputForm}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}>
                <Text
                  style={{color: '#FFFFFF', fontWeight: '600', fontSize: 16}}>
                  {loading ? 'Logging In...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.accountWrapper}>
            <Text style={styles.account}>
              Don't have an account?{' '}
              <Text
                style={{color: '#000000', fontWeight: '600'}}
                onPress={() => navigate('Signup')}>
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={{backgroundColor: 'grey', borderRadius: 25}}>
          {error}
        </Snackbar>
      </ImageBackground>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  account: {
    color: 'lightgrey',
    fontWeight: '400',
  },
  accountWrapper: {
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  containerWrapper: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 30,
  },
  inputForm: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1.5,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    color: '#FFFFFF',
    fontWeight: '600',
    borderColor: '#FFFFFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
});
