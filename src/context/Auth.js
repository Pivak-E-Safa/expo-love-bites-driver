import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const [id, setId] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        setEmail(user.email)
        setId(user.uid)
        setToken(user.accessToken)
      } else {
        setEmail(null)
        setId(null)
        setToken(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const setTokenAsync = async token => {
    if (token) {
      await AsyncStorage.setItem('token', token)
      setToken(token);
    } else {
      await AsyncStorage.removeItem('token')
      setToken(null)
    }
  }

  const setEmailAsync = async email => {
    if (email) {
      await AsyncStorage.setItem('email', email)
      setEmail(email);
    } else {
      await AsyncStorage.removeItem('email')
      setEmail(null)
    }
  }

  const setIdAsync = async id => {
    if (id) {
      await AsyncStorage.setItem('id', id)
      setId(id);
    } else {
      await AsyncStorage.removeItem('id')
      setId(null)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      token, 
      setToken, 
      setTokenAsync, 
      email, 
      setEmail, 
      setEmailAsync, 
      id, 
      setId, 
      setIdAsync 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
