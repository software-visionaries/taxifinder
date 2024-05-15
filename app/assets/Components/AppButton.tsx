import React from 'react'
import { Platform, TouchableOpacity } from 'react-native';
import { StyleSheet, Text } from 'react-native';

function AppButton({ title, onPress}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        backgroundColor: '#006C67',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal:20,
        width: 180,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
              elevation: 1,
            },
          }),
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    }
})

export default AppButton;
