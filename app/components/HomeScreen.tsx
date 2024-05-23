import React, { useState } from 'react'
import TopMenu from '../assets/Components/TopMenu'
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { API_GOOGLE_MAP_TOKEN } from '@env';
import AppButton from '../assets/Components/AppButton';
import {  useFonts, Inter_900Black,Inter_500Medium,Inter_600SemiBold } from '@expo-google-fonts/inter'
import {Roboto_100Thin,Roboto_300Light,Roboto_400Regular,Roboto_500Medium,Roboto_700Bold,Roboto_900Black  } from '@expo-google-fonts/roboto'
import { Dropdown } from 'react-native-element-dropdown';
import { router } from 'expo-router';
import TripList from './TripList';



interface LocationData {
  location: any; // You can replace 'any' with the appropriate type for location data
  description: string;
}

function HomeScreen() {

    const[selectedSectionNameTo , setSelectedSectionNameTo] = useState('');
    const [selectedSectionNameFrom,setSelectedSectionNameForm] = useState('')
    const [toTown, settoTown] = useState('');
    const [toArea, setToArea] = useState('');
    const [fromArea,setFromArea] = useState('');
    const [fromTown, setFromTown] = useState('');
    const [toSectionClassificationNumber, setToSectionClassificationNumber] = useState('')    
    const [fromSectionClassificationNumber, setFromSectionClassificationNumber] = useState('')

    const[isTripAvailable,setIsTripAvailable] = useState(false);
    const fromSection =  selectedSectionNameFrom + " " + fromSectionClassificationNumber;
    const toSection = selectedSectionNameTo + " " + toSectionClassificationNumber;

    const [trips, setTrips] = useState([]);
    const [getParticularTrip,setGetParticularTrip] = useState();

    const fetchTrips = async () => {
      try {
        const response = await fetch(`http://146.141.180.63:8080/trip/direction/${fromTown.trim()}/${fromArea.trim()}/${fromSection.trim()}/${toTown.trim()}/${toArea.trim()}/${toSection.trim()}`);
        const data = await response.json();
    
        // console.log("Fetched trips:", data);
        // setGetParticularTrip(data.tripId);
    
        if (data.length > 0) {
          setIsTripAvailable(true);
          setTrips(data)
          router.push({
            pathname:"/assets/Components/TripQuestion/[tripid]",
            params : {dataTrip : await JSON.stringify( data)}
           })
        } else {
          setIsTripAvailable(false);
            await addQuestion();         
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    

    //   const findOutSearchOrAddQuestion = () => {
    //     fetchTrips();
    //     console.log(isTripAvailable)
    //     if(isTripAvailable) {
    //       addQuestion();
         
    //     }   
    // }

    const addQuestion = async () => {
        try {
            const response = await fetch(`http://146.141.180.63:8080/add/question/1`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    fromTown : fromTown.trim(),
                    fromArea : fromArea.trim(),
                    fromSection : fromSection.trim(),
                    toTown : toTown.trim(),
                    toArea :toArea.trim(),
                    toSection : toSection.trim()
                }),
            });
            router.navigate("/components/NoResponseFoundScreen");
            if(!response.ok) {
                console.log("error");
            }
            else {
                const data = await response.text();
                console.log('successful added', data);
            }            
            
        } catch (error) {
            console.error(error);
        }      

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


    //   data for dropdown
    const sectionName = [
        { label: 'Extension', value: 'Extension'},
        { label: 'Phase', value: 'Phase'},
        { label: 'Unit', value: 'Unit'},
        { label: 'Block', value: 'Block'},
        { label: 'Zone', value: 'Zone'},
    ]

  return (
   <KeyboardAvoidingView behavior= {Platform.OS === "ios" ? "padding" :"height"
    
   }>
     <View style = {styles.container}>
         <TopMenu/>
         <View style = {styles.searchOrAddQuestion}>
            <View style={styles.fieldset}>                
            <Text style = {styles.searchOrAddQuestionTitle}>From</Text>
            <Text style = {styles.townOrCityTitle}>Township or City</Text>
            <GooglePlacesAutocomplete
            placeholder="e.g Soweto or Johannesburg"
            query={{
              key: API_GOOGLE_MAP_TOKEN,
              language: 'en',
            }}
            styles={{
              container: {
                flex: 0,
                paddingTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
                // display:'none'
              },
              textInput: {
                  fontSize: 14,
                  fontWeight: '200',
                  paddingHorizontal:20,
                  borderWidth: 1,
                  borderRadius: 11,
                  marginHorizontal:10,
                  borderColor:"#0129701a",
                  // fontFamily : " Roboto_400Regular",
              },
            }}
            onPress={(data) => {
             setFromTown(data.description)            
            }}/>

            <Text style = {styles.townOrCityTitle }>Area</Text>
            <GooglePlacesAutocomplete
          placeholder="e.g Diepkloof or Braamfontein"
          query={{
            key: API_GOOGLE_MAP_TOKEN,
            language: 'en',
          }}
          styles={{
            container: {
              flex: 0,
              paddingTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
            },
            textInput: {
                fontSize: 14,
                fontWeight: '200',
                paddingHorizontal:20,
                borderWidth: 1,
                borderRadius: 11,
                marginHorizontal:10,
                borderColor:"#0129701a",
                // fontFamily : " Roboto_400Regular",
            },
          }}
          onPress={(data) => {
            setFromArea(data.description);            
          }}
          />
          
            <Text style = {styles.townOrCityTitle }>Section</Text>
            <View style = {styles.sectionWrapper}>
            <Dropdown 
            data ={sectionName}
            labelField="label"
            valueField="value" 
            placeholder='e.g Extension'
            placeholderStyle={styles.placeholderStyle}
            value={selectedSectionNameFrom}
            style = {
                styles.sectionName
            }
            onChange={ item => setSelectedSectionNameForm(item.value)}/>            
            <TextInput style= {styles.sectionNumber} placeholder="e.g 4 / 2B" onChangeText={(text) => setFromSectionClassificationNumber(text)} />
            </View>
            </View>

            <View style={styles.fieldset} >
            <Text style = {styles.searchOrAddQuestionTitle}>To</Text>
            <Text style = {styles.townOrCityTitle}>Town or City</Text>
            <GooglePlacesAutocomplete
            placeholder="e.g Soweto or Johannesburg"
            query={{
              key: API_GOOGLE_MAP_TOKEN,
              language: 'en',
            }}
            styles={{
              container: {
                flex: 0,
                paddingTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
                // display:'none'
              },
              textInput: {
                  fontSize: 14,
                  fontWeight: '200',
                  paddingHorizontal:20,
                  borderWidth: 1,
                  borderRadius: 11,
                  marginHorizontal:10,
                  borderColor:"#0129701a",
                  // fontFamily : " Roboto_400Regular",
              },
            }}
            onPress={(data) => {
              settoTown(data.description);            
            }}/>
              <Text style = {styles.townOrCityTitle }>Area</Text>
              <GooglePlacesAutocomplete
            placeholder="e.g Diepkloof or Braamfontein"
            query={{
              key: API_GOOGLE_MAP_TOKEN,
              language: 'en',
            }}
            styles={{
              container: {
                flex: 0,
                paddingTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              },
              textInput: {
                  fontSize: 14,
                  fontWeight: '200',
                  paddingHorizontal:20,
                  borderWidth: 1,
                  borderRadius: 11,
                  marginHorizontal:10,
                  borderColor:"#0129701a",
                  // fontFamily : " Roboto_400Regular",
              },
            }}
              onPress={(data) => {
              setToArea(data.description);            
            }}/>
            <Text style = {styles.townOrCityTitle }>Section</Text>
            <View style = {styles.sectionWrapper}>
            <Dropdown 
            data ={sectionName}
            labelField="label"
            valueField="value" 
            placeholder='e.g Extension'
            value={selectedSectionNameTo}
            style = {
                styles.sectionName
            }
            placeholderStyle={styles.placeholderStyle}
            onChange={ item => setSelectedSectionNameTo(item.value)}/>            
            <TextInput style= {styles.sectionNumber} 
            placeholder="e.g 4 / 2B" 
            onChangeText={(text) => setToSectionClassificationNumber(text)}/>
            </View>
            </View>            
            <View style = {styles.searchButton}>
              <AppButton title= "Search"  onPress={() =>  {
                 fetchTrips()
              }}/>
            </View>

         </View>
    </View>
   </KeyboardAvoidingView>
   
  )
}
const styles = StyleSheet.create({
    container : {
        backgroundColor: '#F5F6F7',
        height:'100%',
        position: 'relative',
        fontFamily : "Roboto_300Light"
    },
    searchButton : {
    position : 'relative',
    bottom: 15,
    alignItems: 'center'
    // left:"28%",
    
    },
    searchOrAddQuestion : {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
              elevation: 1,
            },
          }),
        backgroundColor: '#fff',
        height: '85%',
        position: 'absolute',
        top: 100, 
        left: 15,
        right: 15,
        bottom:'30%',
        borderRadius:18,
        zIndex: 100,
    },
    searchOrAddQuestionTitle :{
        color: '#000',
        textAlign:'center',
        fontFamily: 'Roboto_700Bold',
        paddingTop:10,
        paddingBottom:8,        
        textTransform:'uppercase',
        fontSize:20,       
        letterSpacing:0.9
    },
    townOrCityTitle : {
        marginHorizontal:12,
        paddingVertical:3.5,       
        fontFamily:'Roboto_500Medium',
        letterSpacing:0.9,
        textTransform:'capitalize',

    },
    sectionNumber : {
        fontSize: 14,
        fontWeight: '200',
        paddingHorizontal:20,
        paddingVertical:10,
        borderWidth: 1,
        borderRadius: 11,
        marginHorizontal:10,
        borderColor:"#0129701a",
        width:"35%",
        height:45
    },
    sectionName : {
        fontSize: 14,
        fontWeight: '200',
        paddingHorizontal:20,
        paddingVertical:10,
        borderWidth: 1,
        borderRadius: 11,
        marginHorizontal:10,
        borderColor:"#0129701a",
        width:"55%",
        height:45,
        marginBottom:10
        
    },
    sectionWrapper : {
        flexDirection:'row',

    },
    placeholderStyle: {
        fontSize: 14,
        color : "#999",
        fontFamily : "Roboto_300Light"
    }, 
    fieldset: {
        marginBottom: 10,
        marginHorizontal:8,
        marginTop:10,
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
export default HomeScreen