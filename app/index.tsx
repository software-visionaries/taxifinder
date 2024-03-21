import React from 'react';
import { View } from 'react-native';
import MapComponent from './assets/Components/MapComponent';
import Trip from './assets/Components/trip';

const Index = () => {
    return (
        <View style={{ flex: 1 }}>
            <Trip />
            {/* <MapComponent/> */}
            {/* <ShareApp/> */}
        </View>
    );
};

export default Index;