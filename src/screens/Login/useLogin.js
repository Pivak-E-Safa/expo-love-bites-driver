import { useState, useContext, useEffect } from 'react';
import { auth, firestore } from "../../../firebaseConfig"
import { useNavigation } from '@react-navigation/native';
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import AuthContext from '../../context/Auth'
import { BackHandler } from 'react-native';

export const useLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState(false);
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme['Dark'];
  // const { setTokenAsync, setEmailAsync } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackButtonPressAndroid);
    };
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      if (!registeredEmail) {
        if (await checkUserExists(email)) {
          setRegisteredEmail(true);
        } else {
          setRegisteredEmail(false);
          navigation.navigate('Register', { email });
        }
      } else {
        try {
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          const token = await userCredential.user.getIdToken();
          setEmail(email);
          // await setTokenAsync(token);
          // await setEmailAsync(email);

          navigation.navigate('Main');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
              setPasswordError('Incorrect password.');
            } else {
              setPasswordError(error.message);
            }
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        setEmailError(error.message);
      }
  };

  const checkUserExists = async (email) => {
    try {
      // Try to sign in with the email
      await auth.signInWithEmailAndPassword(email, 'dummyPassword');
      // If it succeeds, user exists
      return true;
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        // Wrong password means the user exists
        return true;
      } else if (error.code === 'auth/user-not-found') {
        // User not found means the user does not exist
        return false;
      } else {
        // Handle other errors
        throw error;
      }
    } finally {
        setLoading(false);
      }
  };

  function onBackButtonPressAndroid() {
    navigation.navigate({
      name: 'Main',
      merge: true
    });
    return true;
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    emailError,
    passwordError,
    registeredEmail,
    currentTheme,
    loading,
    login,
  };
};
