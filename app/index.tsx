import React from 'react';
import { View } from 'react-native';
import MapComponent from './assets/Components/MapComponent';
import Trip from './assets/Components/trip';
// import TripList from './screens/TripList';
import{Provider} from "react-redux"
import TopMenu from './assets/Components/TopMenu';
import HomeScreen from './components/HomeScreen';
import NoResponseFoundScreen from './components/NoResponseFoundScreen';
import TripList from './components/TripList';
import Notifications from './components/Notifications';
import AddTrip from './assets/Components/trip/AddTrip';

const Index = () => {
    return (
        // <Provider store={}>
             <View style={{ flex: 1 }}>
            {/* <Trip /> */}
            {/* <TopMenu/>
             */}
            {/* <TripList/> */}
            {/* <MapComponent/> */}
            {/* <ShareApp/> */}
            <HomeScreen/>
            {/* <Notifications/> */}
            {/* <index/> */}
            {/* <NoResponseFoundScreen/> */}
            {/* <AddTrip/> */}
        </View>
        // </Provider>       
    );
};

export default Index;