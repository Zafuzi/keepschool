import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCxw281wwiHesXFh2wHiTb25XPU4PVYj4A",
    authDomain: "keepschool-001.firebaseapp.com",
    databaseURL: "https://keepschool-001.firebaseio.com",
    projectId: "keepschool-001",
    storageBucket: "keepschool-001.appspot.com",
    messagingSenderId: "452385383926"
  };
firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
