import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Image } from 'react-native'
import { getValueFor, ip, save } from '../trip/Utils'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { API_GOOGLE_MAP_TOKEN } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import { sectionName } from '@/app/components/HomeScreen';
import AppButton from '../AppButton';
import { router } from 'expo-router';

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
        router.push({ pathname: "/components/HomeScreen" })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <SafeAreaView style={styles.firstContainer}>
      <View style={styles.secondContainer}>
        <View style={styles.thirdContainer}>
          <View style={styles.logoImageContainer}>
            <Image source={require('/Users/cash/Desktop/taxifinder/app/assets/icons/logo.png')} style={styles.logoImage} />
          </View>
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
            styles={{
              container: {
                marginTop: 10,
                flex: 0,
                paddingTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: .3,
                borderRadius: 11
              },
              textInput: {
              },
            }}
          />

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
            styles={{
              container: {
                marginTop: 10,
                flex: 0,
                paddingTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: .3,
                borderRadius: 11
              },
              textInput: {
              },
            }}
          />

          <View>
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
              <TextInput
                style={styles.sectionNumber}
                placeholder="e.g 4 / 2B"
                onChangeText={(text) => setToSectionClassificationNumber(text)} />
            </View>
          </View>

          <View style={styles.submitButton}>
            <AppButton title={'Submit'} onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  firstContainer: {
    flex: 1,
    backgroundColor: '#006C67',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: .3,
    borderColor: 'black',
    width: '92%',
    height: '80%',
    backgroundColor: '#F5F6F7',
    borderRadius: 5,
  },
  thirdContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
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
  autoCompleteInput: {
    borderWidth: .3,
    borderColor: 'black'
  },
  registerHeadingContainer: {
    alignSelf: 'center',
    margin: 10
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
  registerHeading: {
    fontSize: 20
  },
  submitButton: {
    alignItems: 'center'
  }
})

export default Address