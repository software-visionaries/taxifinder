import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';



function TopMenu() {
  return (
    <View style ={styles.container}>
        <View style={styles.navigation}>
                <View style={styles.LeftIcon}>
                    <TouchableOpacity>
                        <Icon name="home" size={35} color={"#FFFFFF"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.RightIcons}>
                    <TouchableOpacity>
                        <Icon name="bell" size={30} color={"#FFFFFF"} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity>
                        <Icon name="user-circle" size={30} color={"#FFFFFF"} />
                    </TouchableOpacity>
                </View>
                
            </View >
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        // // height: 220,
        // flex:1
    },
    navigation: {
        backgroundColor: "#006C67",
        height: 250,
        padding: 20,
        width: "100%",
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'absolute',
        zIndex: 10,
    },
    LeftIcon: {
        marginTop: 25,
    },
    RightIcons: {
        marginTop: 25,
        gap: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
    }})
export default TopMenu