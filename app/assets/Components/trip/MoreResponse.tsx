import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

function MoreResponse({ tripId }) {
  return (
    <View style={styles.plusIcon}>
      <TouchableOpacity onPress={() => {
        router.push({
          pathname: "/assets/Components/Response/[responseid]",
          params: { unansweredId: tripId }
        })
      }}>
        <Icon name='plus' size={25} color={"#fff"}></Icon>
      </TouchableOpacity>
    </View>

  )
}
const styles = StyleSheet.create({
  plusIcon: {

  }
})
export default MoreResponse