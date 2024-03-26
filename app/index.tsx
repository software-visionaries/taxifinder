import React from 'react';
import { View } from 'react-native';
import MapComponent from './assets/Components/MapComponent';
import Trip from './assets/Components/trip';
import TripList from './assets/Components/TripList';
import{Provider} from "react-redux"

const Index = () => {
    return (
        // <Provider store={}>
             <View style={{ flex: 1 }}>
            {/* <Trip /> */}
            <TripList/>
            {/* <MapComponent/> */}
            {/* <ShareApp/> */}
        </View>
        // </Provider>       
    );
};

export default Index;