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
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [tripPlus, setTripPlus] = useState<number | null>(null);;
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]); 
  const [showModal, setShowModal] = useState<boolean>(false);
  const [likeAction, setLikeAction] = useState<string | null>(null);
  console.log();
  // console.log(dataTrip[].fromTownName);
  // setTrips(JSON.parse(dataTrip))
  const tripjson = JSON.parse(dataTrip);
  
  console.log(tripjson)
  
  function tripNumber (number) {
    return number;
  }
  
  useEffect(() => {   
    fetch(`http://146.141.180.63:8080/trip/direction/${tripjson[0].fromTownName}/${tripjson[0].fromAreaName}/${tripjson[0].fromSectionName}/${tripjson[0].toTownName}/${tripjson[0].toAreaName}/${tripjson[0].toSectionName}`)
    .then(res => {
      if(!res.ok) {
        throw new Error("Network response was not okay")
      }
      return res.json();
    })
    .then(data => {
      // console.log(data);
      setTrips(data);
      const tripNum = tripNumber(tripjson[0].questionId);
        setTripPlus(tripNum); // Set the value of tripPlus using setState
        console.log(tripNum);
    })
    .catch(error => {
      console.log(error);
    })
  }, [comments]);



  

  const toggleExpand = (tripId: number) => {
    if (expandedItems.includes(tripId)) {
      setExpandedItems(expandedItems.filter(id => id !== tripId));
    } else {
      setExpandedItems([...expandedItems, tripId]);
    }
  };
  

  const handleCommentSubmit = (tripId: number) => {
    const userId = 8; 
    fetch(`http://146.141.180.63:8080/create-comment/${tripId}/${1}?message=${commentText}`, {
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
    const userId = 1;
    fetch(`http://146.141.180.63:8080/rating/vote/${userId}/${tripId}?action=upvote`, {
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
    const userId = 1;
    fetch(`http://146.141.180.63:8080/rating/vote/${userId}/${tripId}?action=downvote`, {
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
    <View>
      <View >
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
          <AntDesign name="like2" size={24} color="white" />
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
        <TouchableOpacity onPress={() => toggleExpand(item.tripId)} style={styles.iconTitle}>
          <FontAwesome name="comment-o" size={24} color="white" />
          <Text style={styles.textInIcons}>Comment</Text>
        </TouchableOpacity>       
      </View>
      {expandedItems.includes(item.tripId) && (
          <View style={styles.commentContainer}>
            <View style = {styles.sendAndCommentInput}>
              <TextInput
                placeholder="Write your comment..."
                value={commentText}
                onChangeText={text => setCommentText(text)}
                style={styles.commentInput}
                
              />    
               
            <TouchableOpacity onPress={() => handleCommentSubmit(item.tripId)} style = {styles.sendIcon} >
              {/* <Text style={styles.commentButtonText}>Submit</Text> */}
              {/* <FontAwesome name="send" size={21} color="#006C67" />    */}
              <MaterialCommunityIcons name="send" size={24} color="#006C67" />  
            </TouchableOpacity>
           
            </View>
            <CommentComponent tripId={item.tripId} />
            
          </View>
        )}
         
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
            contentContainerStyle={{ flexDirection: 'column',gap:10 }}
            refreshing={true}
          />
      </View>
      <View style ={styles.plusIcon}>
        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname :"/assets/Components/Response/[responseid]",
                                params : {unansweredId : tripPlus}
                               
                            })
                        }}>
            <Icon name='plus' size={25} color={"#fff"}></Icon>
        </TouchableOpacity>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  plusIcon :{
    position :'absolute',
    top:"92%",
    right:30,
    zIndex:52555,
    backgroundColor:"#006C67",
    padding:"27%",
    borderRadius:25,
    height:50,
    width:50,
    justifyContent: 'center',
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
    
  },
  sendAndCommentInput :{
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 28,
    height:50, 
    position:'relative',
    marginBottom: 10,
  },
  sendIcon :{
    position:'absolute',
    top:12.5,
    right:15,
    // transform: [{ rotate: '65deg' }]
  },
  titleHeader : {
    color: '#000',
    textAlign:'center',
    fontFamily: 'Roboto_700Bold',
    paddingTop:25,
    paddingBottom:8,        
    textTransform:'uppercase',
    fontSize:20,       
    letterSpacing:0.9
  },
  responseWrapper :{
    backgroundColor: '#F5F6F7',
    margin:10,
    padding:10,
    paddingVertical:40,
    height:"75%",
    borderRadius:11,
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
  },  

  container: {
    backgroundColor: '#FFF',
    height:'100%',
    position: 'relative',
    fontFamily : "Roboto_300Light",
    marginBottom:10
    
  },
  tripContainer :{
    // height: 1,
    // backgroundColor: '#ccc',
    marginEnd:100
  },
  tagTextbackground :{
    flexDirection:'row',
    flexWrap:'wrap',
    backgroundColor: '#006C67', 
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    padding:10,
    justifyContent:'center',
    gap:5,
  },
  tagText :{
    color:"#fff",   
    fontFamily: 'Roboto_500Medium',
    fontSize:11,
    letterSpacing:0.8
  },
  responseBody :{
    padding:10,
    height:140,
    backgroundColor:"#fff",
  },
  textInIcons:{
    color:"#fff",   
    fontFamily: 'Roboto_500Medium',
    fontSize:10,
    letterSpacing:0.8
  },
  actionSection :{
    flexDirection:'row',
    flexWrap:'wrap',
    height:50,
    backgroundColor: '#006C67', 
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
    padding:10,
    justifyContent:'space-between',
    paddingVertical:10,
    alignItems:'center',
    gap:10,    
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
  commentContainer: {
    marginTop: 10,
  },
  commentInput: {
    // width:"190%",
  
    padding: 10,
    paddingRight:50,
    paddingLeft:20
    // marginBottom: 10,
  },
  commentButton: {
    backgroundColor: '#006C67',
    // width:"190%",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  commentButtonText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: 'blue',
  },
  taxiLocation :{
    marginVertical:10,
    fontFamily: "Roboto_400Regular",
    fontSize:12,       
    letterSpacing:0.5
  },
  taxiNavigate :{
    // fontFamily: "Roboto_300Light",
    fontSize:30,
    fontWeight:'100',
  }
  
});

export default TripList;
