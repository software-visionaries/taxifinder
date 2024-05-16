import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import MapComponent from './assets/Components/MapComponent';
import Trip from './assets/Components/trip';
import { Provider } from "react-redux"
import Register from './assets/Components/register';
import TopMenu from './assets/Components/TopMenu';
import HomeScreen from './components/HomeScreen';
import NoResponseFoundScreen from './components/NoResponseFoundScreen';
import AddTrip from './assets/Components/trip/AddTrip';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotifications() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C'
        })
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!')
            return;
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }

        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId, })).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError("Must use physical device for push notifications")
    }
}

const Index = () => {
    
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotifications()
            .then((token) => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`))

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => setNotification(notification));

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
        })

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current,);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, []);

    return (
        // <Provider store={}>
        <View style={{ flex: 1 }}>
            {/* <Trip /> */}
            {<Register pushToken={expoPushToken} />}
            {/* <TripList /> */}
            {/* <MapComponent/> */}
            {/* <ShareApp/> */}
            {/* <HomeScreen/> */}
            {/* <Notifications/> */}
            {/* <index/> */}
            {/* <NoResponseFoundScreen/> */}
            {/* <AddTrip/> */}
        </View>
        // </Provider>       
    );
};

export default Index;