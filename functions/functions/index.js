const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyCgp9exo0FjnrgVRT0JXhuR1c4bPLZMLhw",
    authDomain: "social-media-app-2157b.firebaseapp.com",
    databaseURL: "https://social-media-app-2157b.firebaseio.com",
    projectId: "social-media-app-2157b",
    storageBucket: "social-media-app-2157b.appspot.com",
    messagingSenderId: "355708306312",
    appId: "1:355708306312:web:483c92480edadf21bb703d",
    measurementId: "G-HV4Z3W0TVK"
};
firebase.initializeApp(firebaseConfig);
admin.initializeApp();


 app.get("/screams", (req, res) => {
    admin
        .firestore()
        .collection('screams')
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                })
            });
            return res.json(screams)
        })
        .catch(err => console.error(err))
});



app.post("/scream",(req, res) => {

 const newScream = {
  body: req.body.body,
  userHandle: req.body.userHandle,
  createdAt: new Date().toISOString()
 };

 admin.firestore()
     .collection("screams")
     .add(newScream)
     .then(doc => {
      res.json({mesage: `Document ${doc.id} created successfully`})
     })
     .catch(err => {
      res.status(500).json({error: "Something went wrong..."});
      console.error(err);
     })
});

/**
 * Signup
 */

app.post("/signup", (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    //todo: walidacja danych

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data =>{
            return res.status(201).json({messege: `User ${data.user.uid} signed upsuccesfully`})
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error: err.code})
        })
});


exports.api = functions.region("europe-west1").https.onRequest(app);