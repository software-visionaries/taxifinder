import React, { useState } from 'react'
import Address from './Address'
import UserDetails from './UserDetails'
import { View } from 'react-native'

function Register({ pushToken }) {
  const [next, setNext] = useState(false)
  return (
    <View>
      {
        next ? <Address /> : <UserDetails pushToken={pushToken} setNext={setNext} />
      }
    </View>
  )
}

export default Register