import firebase from 'firebase'

export const appName = "advreact-fox"
export const firebaseConfig = {
    apiKey: "AIzaSyAzBwKwLcmxbqfWN5nMWNOAuRedy9TJcao",
    authDomain: `${appName}.firebaseapp.com`,
    databaseURL: `https://${appName}.firebaseio.com`,
    projectId: appName,
    storageBucket: `${appName}.appspot.com`,
    messagingSenderId: "93522348572"
}

firebase.initializeApp(firebaseConfig)