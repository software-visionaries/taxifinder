import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

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
        const response = await fetch(`http://146.141.180.79:8080/comments/${tripId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (tripId) {
      fetchComments();
    }
  }, [tripId]);

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => (
        <View style={styles.commentContainer}>
          <Text>{item.commentDto.commentMessage}</Text>
          <Text>{item.commentDto.commentOwner}</Text>
          <Text>{item.commentDto.duration}</Text>
          <FlatList
            data={item.commentDtoList}
            renderItem={({ item: reply }) => (
              <View style={styles.replyContainer}>
                <Text>{reply.replayCommentMessage}</Text>
                <Text>{reply.replayCommentOwner}</Text>
                <Text>{reply.replyCommentDuration}</Text>
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
  },
  replyContainer: {
  },
});

export default CommentComponent;
