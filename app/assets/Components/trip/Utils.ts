import * as SecureStore from 'expo-secure-store';

export const ip = `192.168.8.13`

export function save(key: string, value: string) {
    SecureStore.setItem(key, value);
}

export function getValueFor(key: string) {
    let result = SecureStore.getItem(key)
    if (result !== null) {
        return result
    }
}

export function getFileExtension(uri: String) {
    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1]
    const fileNameParts = fileName.split('.')
    const fileExtension = fileNameParts[fileNameParts.length - 1]
    return fileExtension;
}