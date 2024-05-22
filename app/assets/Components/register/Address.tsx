import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native'
import { getValueFor, ip, save } from '../trip/Utils'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { API_GOOGLE_MAP_TOKEN } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import { sectionName } from '@/app/components/HomeScreen';

save("user_id", "1")

function Address() {

  const [town, setTown] = useState("")
  const [area, setArea] = useState("")
  const [section, setSection] = useState("")
  const [sectionClassificationNumber, setToSectionClassificationNumber] = useState('')
  const fSection = section + " " + sectionClassificationNumber;

  const handleTown = (data, details) => {
    const { name } = details
    console.log(name)
    setTown(name)
  }

  const handleArea = (data, details) => {
    const { name } = details
    console.log(name)
    setArea(name)
  }

  const handleSubmit = () => {
    console.log(town, area, fSection)
    fetch(`http://${ip}:8080/add/address/${getValueFor("user_id")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "town": town,
        "area": area,
        "section": fSection
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
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.autocompleteTown}>
          <GooglePlacesAutocomplete
            placeholder='e.g Soweto or Johannesburg'
            minLength={2}
            onFail={(err) => console.log(err)}
            fetchDetails={true}
            listViewDisplayed={'auto'}
            onPress={(data, details = null) => handleTown(data, details)}
            query={{
              key: process.env.API_GOOGLE_MAP_TOKEN,
              language: 'en',
            }}
          />
        </View>

        <View style={styles.autocompleteArea}>
          <GooglePlacesAutocomplete
            placeholder='e.g Diepkloof or Braamfontein'
            minLength={2}
            onFail={(err) => console.log(err)}
            fetchDetails={true}
            listViewDisplayed={'auto'}
            onPress={(data, details = null) => handleArea(data, details)}
            query={{
              key: process.env.API_GOOGLE_MAP_TOKEN,
              language: 'en',
            }}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.townOrCityTitle}>Section</Text>
          <View style={styles.sectionWrapper}>
            <Dropdown
              data={sectionName}
              labelField="label"
              valueField="value"
              placeholder='e.g Extension'
              value={section}
              style={
                styles.sectionName
              }
              placeholderStyle={styles.placeholderStyle}
              onChange={item => setSection(item.value)} />
            <TextInput style={styles.sectionNumber}
              placeholder="e.g 4 / 2B"
              onChangeText={(text) => setToSectionClassificationNumber(text)} />
          </View>
        </View>

        <View style={styles.submitContainer}>
          <Button title='submit' onPress={() => handleSubmit()} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F6F7",
    flex: 1
  },
  submitContainer: {
    position: 'absolute',
    top: 225,
    left: 5,
    right: 5,
  },
  sectionContainer: {
    position: 'absolute',
    top: 140,
    left: 5,
    right: 5,
  },
  autocompleteTown: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 4,
    // borderWidth: 1
  },
  autocompleteArea: {
    position: 'absolute',
    top: 90,
    left: 10,
    right: 10,
    zIndex: 3
    // borderWidth: 1
  },
  searchButton: {
    position: 'relative',
    bottom: 15,
    alignItems: 'center'
    // left:"28%",

  },
  searchOrAddQuestionTitle: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold',
    paddingTop: 10,
    paddingBottom: 8,
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 0.9
  },
  townOrCityTitle: {
    marginHorizontal: 12,
    paddingVertical: 3.5,
    fontFamily: 'Roboto_500Medium',
    letterSpacing: 0.9,
    textTransform: 'capitalize',

  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: '200',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 11,
    marginHorizontal: 10,
    borderColor: "#0129701a",
    width: "35%",
    height: 45
  },
  sectionName: {
    fontSize: 14,
    fontWeight: '200',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 11,
    marginHorizontal: 10,
    borderColor: "#0129701a",
    width: "55%",
    height: 45,
    marginBottom: 10

  },
  sectionWrapper: {
    flexDirection: 'row',

  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Roboto_300Light"
  },
  fieldset: {
    marginBottom: 10,
    marginHorizontal: 8,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc5e',
    borderRadius: 18,
  },
  legend: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})

export default Address