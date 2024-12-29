import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const [id, setId] = useState(null)

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

  useEffect(() => {
    let isSubscribed = true
    ;(async() => {
      const token = await AsyncStorage.getItem('token')
      const email = await AsyncStorage.getItem('email')
      const id = await AsyncStorage.getItem('id')
      if (isSubscribed) {
        setToken(token);
        setEmail(email);
        setId(id);
      }
    })()
    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ token, setToken, setTokenAsync, email, setEmail, setEmailAsync, id, setId, setIdAsync }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
