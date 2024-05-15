import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
// import ShareApp from './ShareApp';  
import {  router } from 'expo-router'; 
import CommentComponent from '../trip/CommentComponent';
import { useLocalSearchParams } from 'expo-router';

import SecondHeader from '../trip/SecondHeader';
import { Platform } from 'react-native';

interface Trip {
  tripId: number;
  fromTownName: string;
  fromAreaName: string;
  fromSectionName: string;
  toTownName: string;
  toAreaName: string;
  toSectionName: string;
  taxiRankLocation: string;
  farePrice: number;
  attachment: string;
  locationId: number;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const { dataTrip } = useLocalSearchParams<{ dataTrip :string}>();
  console.log();
  // console.log(dataTrip[].fromTownName);
  // setTrips(JSON.parse(dataTrip))
  const tripjson = JSON.parse(dataTrip);
  
  console.log(tripjson[0].fromSectionName)

  useEffect(() => {   
    fetch(`http://146.141.180.79:8080/trip/direction/tripjson[0].fromTownName/tripjson[0].fromSectionName/tripjson[0].fromSectionName/tripjson[0].toTownName/tripjson[0].toAreaName/tripjson[0].toSectionName`)
    .then(res => {
      if(!res.ok) {
        throw new Error("Network response was not okay")
      }
      return res.json();
    })
    .then(data => {
      // console.log(data);
      setTrips(data);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  const [expanded, setExpanded] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]); 
  const [showModal, setShowModal] = useState<boolean>(false);
  const [likeAction, setLikeAction] = useState<string | null>(null);

  

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCommentSubmit = (tripId: number) => {
    const userId = 8; 
    fetch(`http://146.141.180.79:8080/create-comment/${tripId}/${userId}?message=${commentText}`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          console.log('Comment created successfully');
          setCommentText('');
        } else {
          console.error('Failed to create comment:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error while creating comment:', error);
      });
  };

  useEffect(() => {
   
  }, []);

  const handleLikePress = (tripId: number) => {
    setShowModal(false);
    setLikeAction('upvote');
    const userId = 8;
    fetch(`http://146.141.180.79:8080/rating/vote/${userId}/${tripId}?action=upvote`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          console.log('Upvoted successfully');
        } else {
          console.error('Failed to upvote:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error while upvoting:', error);
      });
  };

  const handleDislikePress = (tripId: number) => {
    setShowModal(false);
    setLikeAction('downvote');
    const userId = 8;
    fetch(`http://146.141.180.79:8080/rating/vote/${userId}/${tripId}?action=downvote`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          console.log('Downvoted successfully');
        } else {
          console.error('Failed to downvote:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error while downvoting:', error);
      });
  };

  const handleLikeHold = () => {
    setShowModal(true);
  };

  const renderItem = ({ item }: { item: Trip }) => (
    <View style = {styles.displayresponseConatiner}>
      <View style={styles.tags}>
      <View style ={styles.tagTextbackground}>
      <Text style={styles.tagText}>To: {item.fromTownName}, {item.fromAreaName}, {item.fromSectionName}</Text>
        <Text style={styles.tagText}>From: {item.toTownName}, {item.toAreaName}, {item.toSectionName}</Text>
      </View>
        
      </View>
      <View style={styles.responseBody}>
        <Text style ={styles.taxiLocation}>Taxi Location: {item.taxiRankLocation}</Text>
        <Text style = {styles.taxiLocation}>Price: R{item.farePrice}</Text>
        <View style={styles.signAndMap}>
          <Text style = {styles.taxiLocation}>Attachment: {item.attachment}</Text>
          <Pressable onPress={() => {
            router.push({
              pathname: "/assets/Components/Navigate/[id]",
              params: { id: item.locationId }
            })
          }}>
            <MaterialCommunityIcons name="map-marker-outline" size={36} color="black" style ={styles.taxiNavigate} />
          </Pressable>
        </View>
      </View>
      <View style={styles.actionSection}>
        <TouchableOpacity onPress={() => handleLikePress(item.tripId)} onLongPress={handleLikeHold} style={styles.iconTitle}>
          <AntDesign name="like2" size={24} color="white" style= {styles. taxiNavigate}/>
          <Text style={styles.textInIcons}>Like</Text>
        </TouchableOpacity>
        <Modal visible={showModal} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => handleLikePress(item.tripId)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislikePress(item.tripId)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Dislike</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <TouchableOpacity onPress={toggleExpand} style={styles.iconTitle}>
          <FontAwesome name="comment-o" size={24} color="white" style={styles. taxiNavigate}/>
          <Text style={styles.textInIcons}>Comment</Text>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.commentContainer}>
            <TextInput
              placeholder="Write your comment..."
              value={commentText}
              onChangeText={text => setCommentText(text)}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={() => handleCommentSubmit(item.tripId)} style={styles.commentButton}>
              <Text style={styles.commentButtonText}>Submit</Text>
            </TouchableOpacity>
            <CommentComponent tripId={item.tripId} />
          </View>
        )}
        <TouchableOpacity onPress={() => {}} style={styles.iconTitle}> 
          <AntDesign name="sharealt" size={14} color="white"  style= {styles. taxiNavigate}/>
          <Text style={styles.textInIcons}>Share</Text>
          {/* <ShareApp /> */}
        </TouchableOpacity>
        <View style={styles.iconTitle}> 
          <MaterialCommunityIcons name="plus" size={24} color="white" style= {styles. taxiNavigate} />
          <Text style={styles.textInIcons}>Add</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SecondHeader/>
      <Text style = {styles.titleHeader}>Responses</Text>
      <View style ={styles.responseWrapper}>
          <FlatList
            data={trips}
            renderItem={renderItem}
            keyExtractor={item => item.tripId.toString()}
            style ={styles.tripContainer}
          />
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  titleHeader : {
    color: '#000',
    textAlign:'center',
    fontFamily: 'Roboto_700Bold',
    paddingTop:10,
    paddingBottom:8,        
    textTransform:'uppercase',
    fontSize:20,       
    letterSpacing:0.9
  },
  responseWrapper :{
    backgroundColor: '#F5F6F7',
    margin:10,
    padding:10,
    height:"75%",
    borderRadius:11,
  },

  container: {
    backgroundColor: '#FFF',
    height:'100%',
    position: 'relative',
    fontFamily : "Roboto_300Light",
    
  },
  tripContainer :{
    flex:1,
    gap:20,
    // padding:10,
  },
  tagTextbackground :{
    flexDirection:'row',
    flexWrap:'wrap',
    backgroundColor: '#006C67', 
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    padding:10,
    justifyContent:'center',
    gap:10
  },
  tagText :{
    color:"#fff",
    fontFamily: "Roboto_300Light", 
    fontSize:14,
    letterSpacing:0.7
  },
  responseBody :{
    padding:10,
    height:150,
    backgroundColor:"#fff",
  },
  textInIcons:{
    color:"#fff",
    fontFamily: "Roboto_300Light", 
    fontSize:14,
    letterSpacing:0.7
  },
  actionSection :{
    flexDirection:'row',
    flexWrap:'wrap',
    backgroundColor: '#006C67', 
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
    padding:10,
    justifyContent:'space-between',
    paddingVertical:20,
    alignItems:'center',
    gap:10
  },
  iconTitle:{
    flexDirection:'row',
    gap:5,
    alignItems:'center'
  },
  signAndMap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
//   // tripList: {
//   //   flex: 1,
//   //   marginHorizontal: 10,
//   // },
//   tripContainer: {
//     ...Platform.select({
//       ios: {
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.25,
//           shadowRadius: 3.84,
//       },
//       android: {
//         elevation: 0.3,
//       },
//     }),
//     backgroundColor: '#F5F6F7',
//     height: '85%',
//     position: 'absolute',
//     top: 110, 
//     left: 10,
//     right: 10,
//     // bottom:'20%',
//     borderRadius:18,
//     zIndex: 100,
//   },
//   displayresponseConatiner :{
//     marginHorizontal:10,
//     position: "relative",
//         marginVertical:20,
//         backgroundColor:"#fff", 
//         height:"100%",
//         borderRadius :11,
//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.25,
//                 shadowRadius: 3.84,
//             },
//             android: {
//               elevation: 0.5,
//             },
//           }),        
//   },
//   tagTextbackground :{
//     flex:1,       
//     flexDirection:'row',
//     gap:20,
//     justifyContent:'space-between',        
//     alignItems:'center',
    
// },
//   tags: {
//     height : 50,
//         padding: 5,
//         backgroundColor: '#006C67', 
//         borderTopRightRadius :11,
//         borderTopLeftRadius: 11,
//         gap:20,
//         flexWrap:'wrap',
//   },
//   tagText: {
//     height: "100%",
//         backgroundColor: "#fff",
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal:5,
//         paddingVertical:10,
//         fontFamily: "Roboto_300Light",       
//         fontSize: 10,
//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.25,
//                 shadowRadius: 3.84,
//             },
//             android: {
//                 elevation: 0.8,
//             },
//         }),
//         borderRadius: 8,
//   },
//   responseBody : {
//       height:150,
//       padding:10,
//       backgroundColor: '#fff',
      
//   },
//   actionSection: {
//     flex:1,
//     height : 50,
//     padding: 5,
//     backgroundColor: '#006C67', 
//     borderBottomRightRadius :11,
//     borderBottomLeftRadius: 11,
//     gap:20,
//     flexWrap:'wrap', 
//     position: 'absolute',
//     top:170,
//     left:0,
//     right:0,
//     zIndex:444,
    
//   },

//   iconTitle: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 5,
//     alignItems: 'center'
//     , fontFamily: "Roboto_300Light"
//   },
//   textInIcons: {
//     color: '#fff',
//     alignItems: 'center'
//   },
//   commentContainer: {
//     marginTop: 10,
//   },
//   commentInput: {
//     borderWidth: 1,
//     borderColor: 'lightgray',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   commentButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   commentButtonText: {
//     color: 'white',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//   },
//   modalButton: {
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     fontSize: 18,
//     color: 'blue',
//   },,
  taxiLocation :{
    marginVertical:10,
    fontFamily: "Roboto_300Light",
    fontSize:14,       
    letterSpacing:0.5
  },
  taxiNavigate :{
    // fontFamily: "Roboto_300Light",
    fontSize:20,
    fontWeight:'100',
  }
  
});

export default TripList;
