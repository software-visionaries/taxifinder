import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView, TextInput, Button } from 'react-native'
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker } from 'react-native-maps'
import { save, getValueFor } from './Utils';

function AddTrip({ user_id, question_id }) {

  const [price, setPrice] = useState('')
  const [selectImage, setSelectedImage] = useState<any>(null)
  const [note, setNote] = useState('')
  const [name, setName] = useState('')
  const [tripId, setTripId] = useState('')

  const imgDir = FileSystem.documentDirectory + 'images/';

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true })
    }
  }

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })

  const reset = () => {
    setPrice('')
    setSelectedImage(null)
    setNote('')
    setName('')
    setRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    })
    setTripId('')
  }

  const getLatAndLong = (data, details) => {
    if (details && details?.geometry && details?.geometry.location && details?.name) {
      const { name } = details
      const { lat, lng } = details?.geometry.location;
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
      setName(name)
    } else {
      console.log('Location details not available')
    }
  }

  const handlePrice = (event) => {
    setPrice(event.nativeEvent.text)
  }

  const handleNote = (event) => {
    setNote(event.nativeEvent.text)
  }

  const saveImage = async (uri: string) => {
    await ensureDirExists();
    const filename = new Date().getTime() + ".png"
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest })
    setSelectedImage(dest)
    console.log("completed save")
  }

  const uploadData = async (uri: string) => {

    const formData = new FormData()
    formData.append("note", note)
    formData.append("price", price)
    formData.append("name", name)
    formData.append("latitude", `${region.latitude}`)
    formData.append("longitude", `${region.longitude}`)

    fetch(`http://192.168.8.8:8080/add/trip/${user_id}/${question_id}`, {
      method: "POST",
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw Error("The network response was not okay")
        }
        return res.json()
      })
      .then(data => {
        console.log("My trip id", data.tripId)
        save("trip_id", `${data.tripId}`)
        return data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(async () => {
        console.log("getvaluefor()", getValueFor("trip_id"))
        await FileSystem.uploadAsync(`http://192.168.8.8:8080/add/trip/image/${getValueFor("trip_id")}`, uri, {
          httpMethod: 'PUT',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'multipartFile',
        })
      })
    console.log("completed upload")
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    })

    if (!result.canceled) {
      console.log(result.assets[0].uri)
      await saveImage(result.assets[0].uri)
    } else {
      alert('You did not select any image')
    }
  }

  const handleSubmit = async () => {
    await uploadData(selectImage)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2}
          onFail={(err) => console.log(err)}
          fetchDetails={true}
          listViewDisplayed={'auto'}
          onPress={(data, details = null) => getLatAndLong(data, details)}
          query={{
            key: `${process.env.API_GOOGLE_MAP_TOKEN}`,
            language: 'en',
          }}
        />
      </View>
      <View style={styles.secondContainer}>
        <View>
          <TextInput
            style={{ borderWidth: 1, padding: 10 }}
            keyboardType='numeric'
            maxLength={4}
            value={price.toString()}
            onChange={(event) => handlePrice(event)}
            placeholder='Enter a number'
          />
          <Button title='Select Image' onPress={pickImageAsync} />
        </View>
        <MapView
          style={styles.map}
          region={region}
          provider='google'
        >
          <Marker coordinate={region} />
        </MapView>
      </View>
      <TextInput
        style={{ borderWidth: 1, padding: 10 }}
        value={note}
        onChange={(event) => handleNote(event)}
      />
      <View>
        <Button title='submit' onPress={() => handleSubmit()} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    zIndex: 1,
    borderWidth: 1
  },
  secondContainer: {
    marginTop: 70,
    height: 300,
  },
  map: {
    flex: 1
  }
})

export default AddTrip