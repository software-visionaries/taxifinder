import React from 'react'
import { Text, View } from 'react-native'


function Question({question_id, fromLocation, toLocation}) {
  
  return (
    <View>
        <Text>{fromLocation} {toLocation}</Text>
    </View>
  )
}

export default Question