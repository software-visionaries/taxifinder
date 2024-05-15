import { router } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { Pressable, TouchableOpacity } from 'react-native';
import { FlatList, StyleSheet, View, Text, ScrollView } from 'react-native';


import SecondHeader from '../assets/Components/trip/SecondHeader';


function Notifications() {

    const[unanswered,setUnanswered] = useState([]);

    const fetchUnanswered = async () => {
        try {
            const response = await fetch(`http://146.141.180.79:8080/get/unanswered-question/${1}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data == null) {
                console.log("fecth")
            }
            console.log(data);
            setUnanswered(data);
        } catch (error) {
            console.error("Network request error:", error.message);
        }
    }
    
    
    useEffect(() => {
        fetchUnanswered()
    },[])

   

    
  return (
    <View style={styles.container}>       
        <SecondHeader/>
           {
                unanswered != null ?
                <View style={styles.message}>
                <FlatList 
                    data={unanswered} 
                    renderItem= {({item})=>
                        <Pressable onPress={() => {
                            router.push({
                                pathname :"/assets/Components/Response/[responseid]",
                                params : {unansweredId : item.questionId}
                            })
                        }}>
                            <Text style={styles.messagebox}>{item.message}</Text>
                        </Pressable>
                    }
                    keyExtractor={(item, index) => index.toString()}
                /> 
             </View>
            : <Text>No Questions For Region To Answer</Text>
           }     

    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#006C67",
        // height: 220,
        
    },
    
    message: {
        padding: 20,
    },
    messagebox: {
        marginBottom: 30,
        fontSize: 15,
        backgroundColor: "#E0E0E0",
        padding: 15,
        borderRadius: 10,
    },
  
})

export default Notifications;