import React, { useState } from 'react'
import Address from './Address'
import UserDetails from './UserDetails'
import { View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

function Register() {
  const [next, setNext] = useState(false)
  const { expoPushToken } = useLocalSearchParams()
  
  return (
    <>
      {
        next ? <Address /> : <UserDetails expoPushToken={expoPushToken} setNext={setNext} />
      }
    </>
  )
}

export default Register