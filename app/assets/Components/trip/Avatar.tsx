import React from 'react';
import { View, Text, StyleSheet, Image, StyleProp, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';

const generateInitials = (name: string): string => {
  const words = name.trim().split(' ');
  let initials = '';

  for (let i = 0; i < words.length && initials.length < 2; i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

interface AvatarProps {
  commentOwner: string;
  image?: ImageSourcePropType | null;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Avatar: React.FC<AvatarProps> = ({ commentOwner, image, containerStyle, textStyle }) => {
  const initials = generateInitials(commentOwner);

  return (
    <View style={[styles.container, containerStyle]}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <Text style={[styles.text, textStyle]}>{initials}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Avatar;
