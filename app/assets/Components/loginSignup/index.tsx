import React from 'react'
import { Button, View, StyleSheet, Image, Text } from 'react-native';
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../AppButton';


function LoginSignup({ expoPushToken }) {

    const handleLogin = () => {
        router.push({ pathname: '/assets/Components/login/' })
    }

    const handleRegister = () => {
        router.push({ pathname: '/assets/Components/register/', params: { expoPushToken } })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.firstContainer}>
                <View style={styles.secondContainer}>
                    <View style={styles.logoImageContainer}>
                        <Image source={require('/Users/cash/Desktop/taxifinder/app/assets/icons/logo.png')} style={styles.logoImage} />
                    </View>
                    <View style={styles.welcomeHeadingContainer}>
                        <Text style={styles.welcomeHeading}>Welcome</Text>
                    </View>
                    <View style={styles.authButton}>
                        <AppButton title={'Login'} onPress={handleLogin} />
                    </View>
                    <View style={styles.authButton}>
                        <AppButton title={'Register'} onPress={handleRegister} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#006C67',
        justifyContent: 'center',
        alignItems: 'center',
    },
    firstContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        width: '92%',
        borderRadius: 5,
        backgroundColor: '#F5F6F7',
    },
    welcomeHeadingContainer: {
        alignSelf: 'center',
        margin: 10
    },
    welcomeHeading: {
        fontSize: 20
    },
    secondContainer: {
        borderColor: 'black',
        padding: 10,
        height: '80%',
        width: '92%',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    logoImageContainer: {
        width: 160,
        backgroundColor: '#F5F6F7',
        borderRadius: 100,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 60
    },
    logoImage: {
        width: 100,
        height: 80
    },
    authButton: {
        alignItems: 'center'
    }

})

export default LoginSignup;