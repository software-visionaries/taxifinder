import React from 'react'
import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

function Modal() {
    const { message } = useLocalSearchParams()
    console.log(message)
  return (
    <View>
        <Text>Modal</Text>
    </View>
  )
}

export default Modal