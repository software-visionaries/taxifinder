import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { router } from 'expo-router';

import Icon from 'react-native-vector-icons/FontAwesome';

import { TouchableOpacity } from 'react-native';
import AppButton from '../assets/Components/AppButton';

function NoResponseFoundScreen() {
    return (
        <View style={styles.container}>
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
                
            </View>

            <View>
                <Text style={styles.message}>
                    No Responses Found. We added your query to our community for the future.
                </Text>

                <View style={{alignItems: 'center', marginTop: 50}}>
                <AppButton 
                 title="Go Back To Search" 
                 onPress={() => { 
                   router.navigate("/components/HomeScreen"); 
                 }} 
                />

                </View>
                
               
            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
    
    },
    navigation: {
        backgroundColor: "#006C67",
        height: 100,
        padding: 20,
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
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
    },
    message: {
        fontSize: 35,
        textAlign: 'center',
        margin: 50,
        marginTop: 150,
    },

})

export default NoResponseFoundScreen;
