import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView, TextInput, Button, Modal, Text, TouchableOpacity, ScrollView } from 'react-native'
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker } from 'react-native-maps'
import { save, getValueFor, getFileExtension } from '../trip/Utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SecondHeader from '../trip/SecondHeader';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ip } from '../trip/Utils';

import {  useFonts, Inter_900Black,Inter_500Medium,Inter_600SemiBold } from '@expo-google-fonts/inter'
import {Roboto_100Thin,Roboto_300Light,Roboto_400Regular,Roboto_500Medium,Roboto_700Bold,Roboto_900Black  } from '@expo-google-fonts/roboto'

function Question({ user_id, fromLocation }) {

    const [price, setPrice] = useState('')
    const [selectImage, setSelectedImage] = useState<any>(null)
    const [note, setNote] = useState('')
    const [name, setName] = useState('')
    const [tripId, setTripId] = useState('')
    const [selectedPlace, setSelectedPlace] = useState(false)
    const [latitudeDelta, setLatitudeDelta] = useState(0.0922)
    const [longitudeDelta, setLongitudeDelta] = useState(0.0421)
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const  question_id = useLocalSearchParams<{unansweredId : string}>(); 
    const userId = getValueFor("user_id");

    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta
    })

    const imgDir = FileSystem.documentDirectory + 'images/';

    const handleYes = () => {
        reset()
        setModalVisible(false);
    };

    const handleNo = () => {
        console.log('User canceled');
        router.push({ pathname: "/assets/Components/trip/Modal", params: { message: "Hello" } })
        setModalVisible(false);
    };

    const ensureDirExists = async () => {
        const dirInfo = await FileSystem.getInfoAsync(imgDir);
        if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true })
        }
    }

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

    const handleRegionChangeComplete = (newRegion: any) => {
        setLatitudeDelta(newRegion.latitudeDelta)
        setLongitudeDelta(newRegion.longitudeDelta)
    }

    const handleMapPress = (event: any) => {
        const { coordinate } = event.nativeEvent;
        setRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta,
        longitudeDelta
        })
        setName(`${fromLocation} location:lat-${coordinate.latitude.toFixed(2)}, long-${coordinate.longitude.toFixed(2)}`)
        console.log("selected", coordinate, name)
    }

    const saveImage = async (uri: string) => {
        await ensureDirExists();
        const filename = new Date().getTime() + "." + getFileExtension(uri)
        console.log(filename)
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
        console.log(question_id.unansweredId)

        fetch(`http://${ip}:8080/add/trip/${userId}/${question_id.unansweredId}`, {
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
            await FileSystem.uploadAsync(`http://${ip}:8080/add/trip/image/${getValueFor("trip_id")}`, uri, {
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
        setModalVisible(true)
    }


    let [fontsLoaded] = useFonts({
        Inter_900Black,
        Inter_500Medium , 
    
        Roboto_100Thin,
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
        Roboto_900Black,
      });
    
      if (!fontsLoaded) {
        return null;
      }
  return (
   <View style = {styles.container}>
    <SecondHeader />
    <View style = {styles.addResponse}>
        <View style ={styles.addResponseContainer}>
            <View style ={styles.addResponseTags}>
                <View style ={styles.tagTextbackground}>
                    <Text style = {styles.tagsText} >Katlehong Moleleki ext 1</Text>            
                    <Text style = {styles.tagsText} >Johannesburg Braamfontein</Text>
                </View>           
            </View>
            <View >
                <GooglePlacesAutocomplete
                placeholder='Taxi Location'
                minLength={2}
                onFail={(err) => console.log(err)}
                fetchDetails={true}
                listViewDisplayed={'auto'}
                onPress={(data, details = null) => getLatAndLong(data, details)}
                query={{
                    key: `${process.env.API_GOOGLE_MAP_TOKEN}`,
                    language: 'en',
                }}
                styles={{
                    container: {
                    flex: 0,
                    paddingTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    },
                    textInput: {
                        fontSize: 14,
                        fontWeight: '200',
                        paddingHorizontal:10,
                        marginHorizontal:10,
                        elevation: 1,
                        height:40,
                        backgroundColor: '#eef3f8',
                    },
                }}
                />
                
            </View>
            <MapView
                style={styles.map}
                region={region}
                provider='google'
                onPress={(event) => handleMapPress(event)}
                onRegionChangeComplete={handleRegionChangeComplete}
                >
            <Marker coordinate={region} />
            </MapView>
            <View style ={styles.taxiPriceAndSign}>
                <TextInput  placeholder='Taxi Price'
                keyboardType='numeric'
                maxLength={4}
                value={price.toString()}
                onChange={(event) => handlePrice(event)}
                style= {styles.priceInput}/>
                <TouchableOpacity  onPress={pickImageAsync} >
                    <View style ={styles.sign}>
                    <Icon name='paperclip' size={24} color={"grey"} ></Icon> 
                    <Text style={{fontSize: 10,marginLeft:10}}>Please attach a sign</Text>
                    </View>                
                </TouchableOpacity>                 
            </View>
            <TextInput  placeholder='Add a note'
                value={note}
                onChange={(event) => handleNote(event)}
                style= {styles.noteInput}
            />
        <View style ={styles.addResponseSubmit}>        
            <TouchableOpacity>
                <Icon name='plus' size={15} color={"#FFFFFF"}> Add</Icon>
            </TouchableOpacity>                
            <TouchableOpacity onPress={() => handleSubmit()}>
                <Icon name='save' size={15} color={"#FFFFFF"}> Submit</Icon>
            </TouchableOpacity>
        </View>     
        </View>
        {/* <Text>Responses</Text> */}
        
    </View>
   </View>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: '#FFF',
        height:'100%',
        position: 'relative',
        fontFamily : "Roboto_300Light"
    },
    addResponse : {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
              elevation: 0.3,
            },
          }),
        backgroundColor: '#F5F6F7',
        height: '85%',
        position: 'absolute',
        top: 110, 
        left: 10,
        right: 10,
        // bottom:'20%',
        borderRadius:18,
        zIndex: 100,
    },
    addResponseContainer:{
        marginHorizontal:10,
        marginVertical:20,
        backgroundColor:"#fff", 
        height:"95%",
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
              elevation: 0.5,
            },
          }),
          borderTopRightRadius :11,
          borderTopLeftRadius: 11,
          borderBottomRightRadius :11,
          borderBottomLeftRadius: 11,
    },
    addResponseTags : {
        height : 50,
        padding: 5,
        backgroundColor: '#006C67', 
        borderTopRightRadius :11,
        borderTopLeftRadius: 11,
        gap:20,
        flexWrap:'wrap'
    },
    tagTextbackground :{
        flex:1,       
        flexDirection:'row',
        gap:20,
        justifyContent:'space-between',        
        alignItems:'center',
        
    },
    tagsText: {
        height: "100%",
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:20,
        paddingVertical:10,
        fontFamily: "Roboto_300Light",
        fontSize: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 0.8,
            },
        }),
        borderRadius: 8,
    },    
    taxiStand : {
      marginHorizontal:10,
      marginVertical:10,
      elevation: 1,     
    },
    map: {
        // flex: 1,
        marginTop:5,
        marginHorizontal:10,
        height:"51%",
        
      },
      priceInput : {
        backgroundColor: '#eef3f8',
        marginTop:10,
        marginHorizontal:10,
        height:40,
        fontSize: 14,
        fontWeight: '200',
        paddingHorizontal:20,
        borderRadius: 11,
        elevation: 1,  
        width:170,
       
      },
      taxiPriceAndSign : {
            flex: 1,
            flexDirection:'row',  
            justifyContent: 'space-between',
             position:'relative' ,
              paddingVertical:20,   
      },
      sign :{
        flexDirection:'row',
        alignItems: 'center',
        paddingVertical:20, 
        paddingHorizontal:20,
      },
      noteInput:{
        backgroundColor: '#eef3f8',
        marginTop:10,
        marginHorizontal:10,
        height:40,
        fontSize: 14,
        fontWeight: '200',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius: 11,
        borderColor:"#0129701a",
        position:'absolute',
        top:"81%",
        right:0,
        left:0,
        elevation: 1, 
      },addResponseSubmit :{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10,      
        backgroundColor: '#006C67',  
        height : 60,
        borderBottomRightRadius :11,
        borderBottomLeftRadius: 11,
        position:'absolute',
        bottom:"-1%",
        right:0,
        left:0
    }
})

export default Question;
