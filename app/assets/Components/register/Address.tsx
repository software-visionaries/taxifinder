import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { getValueFor } from '../trip/Utils'

const ip = `192.168.8.13`

function Address() {

  const [town, setTown] = useState("")
  const [area, setArea] = useState("")
  const [section, setSection] = useState("")

  const handleTown = (event: any) => {
    setTown(event.nativeEvent.text)
  }

  const handleArea = (event: any) => {
    setArea(event.nativeEvent.text)
  }

  const handleSection = (event: any) => {
    setSection(event.nativeEvent.text)
  }

  const handleSubmit = () => {
    fetch(`http://${ip}:8080/add/address/${getValueFor("user_id")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "town": town,
        "area": area,
        "section": section
      })
    })
      .then(res => {
        if (!res.ok) {
          throw Error("The network response was not okay")
        }
        return res.text()
      })
      .then(data => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <View>
      <View>
        <TextInput
          style={{ borderWidth: 1, padding: 10 }}
          value={town}
          onChange={(event) => handleTown(event)}
          placeholder='Town'
        />
      </View>

      <View>
        <TextInput
          style={{ borderWidth: 1, padding: 10 }}
          value={area}
          onChange={(event) => handleArea(event)}
          placeholder='Area'
        />
      </View>

      <View>
        <TextInput
          style={{ borderWidth: 1, padding: 10 }}
          value={section}
          onChange={(event) => handleSection(event)}
          placeholder='Section'
        />
      </View>
      <Button title='submit' onPress={() => handleSubmit()} />
    </View>
  )
}

export default Address