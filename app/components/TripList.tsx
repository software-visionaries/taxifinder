// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import ShareApp from '../assets/Components/ShareApp';
// import { Link, router } from 'expo-router';

// const TripList = () => {
//   const [trips, setTrips] = useState([]);


//   useEffect(() => {   
//     fetch(`http://146.141.180.79:8080/trip/direction?fromTown=Soweto&fromArea=Diepkloof&fromSection=Zone 4&toTown=Johannesburg&toArea=Braamfontein&toSection=Phase 4`)
//     .then(res => {
//       if(!res.ok) {
//         throw new Error("Network response was not okay")
//       }
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       setTrips(data);
//     })
//     .catch(error => {
//       console.log(error);
//     })
//   }, []);


//   const renderItem = ({ item }) => (
//     <View style={styles.tripContainer}>
//       {/* <Text>Trip ID: {item.tripId}</Text> */}
//       <View style = {styles.tags}>
//         <Text style = {styles.tagText}>{item.fromTownName}, {item.fromAreaName}, {item.fromSectionName}</Text>
//         <Text style = {styles.tagText}>{item.toTownName}, {item.toAreaName}, {item.toSectionName}</Text>        
//       </View>
//       <View style = {styles.responseBody}>
//         <Text>Taxi Location: {item.taxiRankLocation}</Text>
//         <Text>Price: R{item.farePrice}</Text>
//         <View style = {styles.signAndMap}>
//           <Text>Attachment: {item.attachment}</Text>
          
          
                    
//           {/* <Link href={`/assets/Components/Navigate/${item.LocationId}`}></Link> */}
//           <Pressable onPress={() => {
//             router.push({
//               pathname:"/assets/Components/Navigate/[id]",
//               params: {id : item.locationId}
//             })
//           }}>
//              <MaterialCommunityIcons name="map-marker-outline" size={24} color="black" /> 
//           </Pressable>
//         </View>

//         {/* ccv */}
//       </View >
//       <View style = {styles.actionSection}>
//         <View style = {styles.iconTitle}>
//           <AntDesign name="like2" size={24} color="white" />
//           <Text style = {styles.textInIcons}>Like</Text>
//         </View>
//         <View style = {styles.iconTitle}>
//           <FontAwesome name="comment-o" size={24} color="white" />
//           <Text style = {styles.textInIcons}>Comment</Text>
//         </View>
//         <View style = {styles.iconTitle}>
//           <AntDesign name="sharealt" size={24} color="white" />
//           <Text style = {styles.textInIcons}>Share</Text>
//           <ShareApp/>
//         </View>
//         <View style = {styles.iconTitle}>
//           <MaterialCommunityIcons name="plus" size={24} color="white" />
//           <Text style = {styles.textInIcons}>Add</Text>
//         </View>
     
//       </View>
      
//       {/* <Text>Up Votes: {item.upVote}</Text>
//       <Text>Down Votes: {item.downVote}</Text> */}
      
//       {/* <MapComponent/> */}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={trips}
//         renderItem={renderItem}
//         keyExtractor={item => item.tripId.toString()}
//       />
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f5f6f7',
//   },
//   tripContainer: {
//     backgroundColor: '#fff',
//     borderEndEndRadius:10,
//     marginBottom: 30,
//     borderRadius: 8,
//     color: '#ffffff',
//     shadowColor: 'black',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   tags : {
//       flex:1,
//       flexDirection:'row',
//       justifyContent:'space-between',
//       borderTopRightRadius:8,
//       borderTopLeftRadius:8,
//       backgroundColor:'#006C67',
//       paddingHorizontal:10,
//       paddingVertical:15,   
//       gap:20  
//   },
//   tagText : {
    
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal:8,
//     paddingVertical:10,
//     borderRadius:8,
//     textTransform:'capitalize',
//     // lineHeight:12,
//     // letterSpacing:-0.2,
    
    
//   },
//   responseBody: {
//     flex:1,
//     paddingHorizontal:10,
//     paddingVertical:15,
//     gap:20
//   },
//   actionSection : {
//     flex:1,
//       flexDirection:'row',
//       justifyContent:'space-between',
//       borderBottomRightRadius:8,
//       borderBottomLeftRadius:8,
//       backgroundColor:'#006C67',
//       paddingHorizontal:5,
//       paddingVertical:5,   
//       // gap:20  
//   },
//   signAndMap : {
//     flex: 1,
//     flexDirection:'row',
//     justifyContent:'space-between'
//   },
//   iconTitle : {
//     flexDirection: 'row',
//     justifyContent:'center',
//     gap:5,
//     alignItems: 'center'
//   },
//   textInIcons : {
//     color: '#fff',
//     alignItems: 'center'
//   }
// });

// export default TripList;
