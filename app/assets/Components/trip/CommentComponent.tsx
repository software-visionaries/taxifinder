import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { MaterialIcons } from '@expo/vector-icons';

interface Comment {
  commentDto: {
    commentMessage: string;
    commentOwner: string;
    duration: string;
  };
  commentDtoList: {
    replayCommentMessage: string;
    replayCommentOwner: string;
    replyCommentDuration: string;
  }[];
}

interface Props {
  tripId: number;
}

const CommentComponent: React.FC<Props> = ({ tripId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://146.141.180.63:8080/comments/${tripId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (tripId) {
      fetchComments();
    }
  }, [comments]);

  const createReplyComment = (message:string, commentId:number) => {
    fetch(`/create-replay-comment/${1}/${commentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle success if needed
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  return (
    <FlatList
    data={comments}
    renderItem={({ item }) => (
      <View style={styles.commentContainer}>
        <View style={styles.commentWrapper}>            
            <Avatar commentOwner={item.commentDto.commentOwner} />          
          <View style={styles.commentOwnerMessage}>
            <Text style={styles.commentOwner}>{item.commentDto.commentOwner}</Text>
            <Text style={styles.commentMessage}>{item.commentDto.commentMessage}</Text>
          </View>           
        </View>
        <View style={styles.commentDetails}>
            <Text style={styles.duration}>{item.commentDto.duration}</Text>
            <MaterialIcons name="reply" size={28} color="black" />
        </View>        
        <FlatList
          data={item.commentDtoList}
          renderItem={({ item: reply }) => (      
            
          <View style={styles.replayCommentContainer}>  
            <View style={styles.commentWrapper}>
              <Avatar commentOwner={reply.replyCommentDuration} />
              <View style={styles.commentOwnerMessage}>
                  <Text style={styles.commentOwner}>{reply.replyCommentDuration}</Text>
                  <Text style={styles.commentMessage}>{reply.replayCommentMessage}</Text>
              </View>  
            </View>            
            <View style={styles.commentDetails}>
                  <Text style={styles.duration}>{reply.replayCommentOwner}</Text>
                </View>
          </View>
          )}
          keyExtractor={(reply, index) => index.toString()}
        />
      </View>
    )}
    keyExtractor={(item, index) => index.toString()}
  />
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    rowGap:1
  },
  replayCommentContainer: {
    flex:1,
    marginLeft: 30,
    marginTop: 10,
  },
  commentMessage: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight:25,
    marginTop:10,
    gap:9
  
  },
  commentWrapper: {
    flex:1,
    flexDirection: 'row',
    // justifyContent: 'space-between', 
    gap:20,
    alignItems:'center', 
  },
  commentOwner: {
    fontWeight: 'bold',
  },
  duration: {
    color: '#777',
  },
  replyContainer: {
    flex:1,
    flexDirection:'row',
    marginLeft: 20,
    marginTop: 10,
    padding: 5,    
    borderRadius: 5,
  },
  commentOwnerMessage : {
    backgroundColor: '#E1E6E1',
    padding:10,
    width:"75%",
    borderRadius: 15,
  },
  replyMessage: {
    fontSize: 14,
    marginBottom: 5,
  },
  replyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyOwner: {
    fontWeight: 'bold',
  },
  replyDuration: {
    color: '#777',
  },
});

export default CommentComponent;
