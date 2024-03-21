import * as SecureStore from 'expo-secure-store';


export function save(key: string, value: string) {
    SecureStore.setItem(key, value);
}

export function getValueFor(key: string) {
    let result = SecureStore.getItem(key)
    if (result !== null) {
        return result
    }
}