import React from 'react';
import { Button, Share, View } from 'react-native';
import Constants from 'expo-constants';

function ShareApp() {
  
  const onShare = async () => {
    try {
     

      const result = await Share.share({
        message: shareUrl,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ marginTop: 50, flex: 1 ,alignItems: 'flex-end',height: 12}}>
      <Button onPress={onShare} title="Share" />
    </View>
  );
}

export default ShareApp;