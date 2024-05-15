import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { save } from '../trip/Utils'

const ip = `192.168.8.13`


function UserDetails({ pushToken, setNext }) {

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
        fetch(`http://${ip}:8080/add/user`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "password": password,
                "pushToken": pushToken
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
                setNext(true)
                return data;
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }

    return (
        <View>
            <Text>Sign Up</Text>
            <TextInput
                style={{ borderWidth: 1, padding: 10 }}
                value={name}
                onChange={(event) => handleName(event)}
                placeholder='name'
            />
            <TextInput
                style={{ borderWidth: 1, padding: 10 }}
                value={email}
                onChange={(event) => handleEmail(event)}
                placeholder='email'
            />
            <TextInput
                style={{ borderWidth: 1, padding: 10 }}
                value={password}
                onChange={(event) => handlePassword(event)}
                placeholder='password'
            />
            <Button title='submit' onPress={() => handleNext()} />

        </View>
    )
}

export default UserDetails