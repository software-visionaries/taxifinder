import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native'
import { save, ip } from '../trip/Utils'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../AppButton';


function UserDetails({ expoPushToken, setNext }) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleName = (event: any) => {
        setName(event.nativeEvent.text)
    }

    const handleEmail = (event: any) => {
        setEmail(event.nativeEvent.text)
    }

    const handlePassword = (event: any) => {
        setPassword(event.nativeEvent.text)
    }

    const handleNext = () => {
        fetch(`http://${ip}:8080/sign-up`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "password": password,
                "role": "user",
                "pushToken": expoPushToken
            }),
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
                setNext(true)
                return data;
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
                    <View style={styles.registerHeadingContainer}>
                        <Text style={styles.registerHeading}>Sign Up</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.registerInputBox}
                            value={name}
                            onChange={(event) => handleName(event)}
                            placeholder='name'
                        />
                        <TextInput
                            style={styles.registerInputBox}
                            value={email}
                            onChange={(event) => handleEmail(event)}
                            placeholder='email'
                        />
                        <TextInput
                            style={styles.registerInputBox}
                            value={password}
                            onChange={(event) => handlePassword(event)}
                            placeholder='password'
                        />
                    </View>
                    <View style={styles.nextButton}>
                        <AppButton title={'Next'} onPress={handleNext} />
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
        marginTop: 15
    },
    logoImage: {
        width: 100,
        height: 80
    },
    registerHeadingContainer: {
        alignSelf: 'center',
        margin: 10
    },
    registerHeading: {
        fontSize: 20
    },
     inputContainer: {

    },
    registerInputBox: {
        padding: 10,
        borderWidth: .3,
        borderColor: 'black',
        margin: 10,
        borderRadius: 5
    },
    nextButton: {
        alignItems: 'center'
    }
})

export default UserDetails