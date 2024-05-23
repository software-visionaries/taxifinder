import React, { useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet, Image } from 'react-native';
import { ip, save } from '../trip/Utils';
import '../../../base64Polyfill'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../AppButton';


function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleEmail = (event: any) => {
        setEmail(event.nativeEvent.text)
    }

    const handlePassword = (event: any) => {
        setPassword(event.nativeEvent.text)
    }

    const handleNext = async () => {

        const credentials = `${email}:${password}`;
        const Buffer = require("buffer").Buffer
        let encodedCred = new Buffer(credentials).toString("base64")

        fetch(`http://${ip}:8080/sign-in`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCred}`
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("The network response was not okay")
                }
                return res.json()
            })
            .then(data => {
                console.log("Data: ", data)
                console.log("My user id", data.user_id)
                save("user_id", `${data.user_id}`)
                save("access_token", `${data.access_token}`)
                save("user_name", `${data.user_name}`)
                router.push({
                    pathname: "/components/HomeScreen"
                })
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.firstContainer}>
                <View style={styles.secondContainer}>
                    <View style={styles.logoImageContainer}>
                        <Image source={require('/Users/User/Pictures/half done taxi finder/taxifinder/app/assets/icons/logo.png')} style={styles.logoImage} />
                    </View>
                    <View style={styles.loginHeadingContainer}>
                        <Text style={styles.loginHeading}>Login</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.loginInputBox}
                            value={email}
                            onChange={(event) => handleEmail(event)}
                            placeholder='email'
                        />
                        <TextInput
                            style={styles.loginInputBox}
                            value={password}
                            onChange={(event) => handlePassword(event)}
                            placeholder='password'
                        />
                    </View>
                    <View style={styles.loginButton}>
                        <AppButton title={'Login'} onPress={handleNext} />
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
        marginTop: 40
    },
    logoImage: {
        width: 100,
        height: 80
    },
    loginHeadingContainer: {
        alignSelf: 'center',
        margin: 10
    },
    loginHeading: {
        fontSize: 20
    },
    inputContainer: {

    },
    loginInputBox: {
        padding: 10,
        borderWidth: .3,
        borderColor: 'black',
        margin: 10,
        borderRadius: 5
    },
    loginButton: {
        alignItems: 'center'
    }
})

export default Login;