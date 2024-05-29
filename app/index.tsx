import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import LoginSignup from './assets/Components/loginSignup';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Notifications.addNotificationResponseReceivedListener(response => {
//     if (response.actionIdentifier === 'expo.modules.notifications.actions.DEFAULT') {
//         router.push({ pathname: '/components/Notifications' })
//     }
// })

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

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => console.log(notification));

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification is tapped", response);
            router.push({ pathname: '/components/Notifications' })
        })

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current,);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, []);

    return (
        <>
            <LoginSignup expoPushToken={expoPushToken} />
        </>
    );
};

export default Index;