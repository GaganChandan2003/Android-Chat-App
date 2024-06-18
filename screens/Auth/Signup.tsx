import axios from 'axios';
import React, {useState} from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RadioButton, Snackbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../../context/AuthContext';

const Signup = ({navigation: {navigate}}: any) => {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('male');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {setAuthUser} = useAuthContext();

  const onDismissSnackBar = () => setVisible(false);

  const handleSubmit = async () => {
    if (fullName && userName && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        setVisible(true);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post(
          'https://wavoo.onrender.com/api/auth/signup',
          {
            fullName: fullName.trim(),
            userName: userName.trim(),
            password: password.trim(),
            confirmPassword: confirmPassword.trim(),
            gender,
          },
        );
        setAuthUser(res.data);
        await AsyncStorage.setItem('chat-user', JSON.stringify(res.data));
      } catch (error) {
        setError('Signup failed. Please try again.');
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ImageBackground
          source={require('../../assets/splashscreenbg.png')}
          resizeMode="cover"
          style={styles.image}>
          <ScrollView style={styles.wrapper}>
            <StatusBar
              animated={true}
              backgroundColor="#192849"
              barStyle={'light-content'}
            />
            <View style={styles.containerWrapper}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Create An Account</Text>
                <Text style={styles.subHeaderText}>Step into wavoo world</Text>
              </View>
              <View>
                <View style={styles.inputForm}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
                <View style={styles.inputForm}>
                  <Text style={styles.label}>User Name</Text>
                  <TextInput
                    style={styles.input}
                    value={userName}
                    onChangeText={setUserName}
                  />
                </View>

                <Text style={styles.label}>Gender</Text>
                <RadioButton.Group onValueChange={setGender} value={gender}>
                  <View style={styles.radioWrapper}>
                    <View style={styles.radioOption}>
                      <Text style={styles.radioLabel}>Male</Text>
                      <RadioButton value="male" color="lightblue" />
                    </View>
                    <View style={styles.radioOption}>
                      <Text style={styles.radioLabel}>Female</Text>
                      <RadioButton value="female" color="pink" />
                    </View>
                  </View>
                </RadioButton.Group>

                <View style={styles.inputForm}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                <View style={styles.inputForm}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    secureTextEntry
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
                <View style={styles.inputForm}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}>
                    <Text style={styles.buttonText}>
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.accountWrapper}>
                <Text style={styles.accountText}>
                  Already have an account ?{' '}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigate('Login')}>
                    Login
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            style={{backgroundColor: 'grey', borderRadius: 25}}>
            {error}
          </Snackbar>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  containerWrapper: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'flex-start',
    paddingVertical: 30,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'lightgrey',
    marginLeft: 3,
  },
  inputForm: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 2,
    marginBottom: 6,
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
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 80,
  },
  radioOption: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
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
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  accountWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  accountText: {
    color: 'lightgrey',
    fontWeight: '400',
  },
  loginLink: {
    color: '#000000',
    fontWeight: '600',
  },
});
