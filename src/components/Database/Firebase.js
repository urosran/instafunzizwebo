/* eslint-disable prettier/prettier */
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const collectionName = "issues";

class Fire {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyBoaH9huGPD_ab8dtp1bu0uX8okD7z3Eso",
      authDomain: "cityapp-858ea.firebaseapp.com",
      databaseURL: "https://cityapp-858ea.firebaseio.com",
      projectId: "cityapp-858ea",
      storageBucket: "cityapp-858ea.appspot.com",
      messagingSenderId: "649846420860",
      appId: "1:649846420860:web:2366b9c7a86f1e69"
    });
    // Some nonsense...
    firebase.firestore().settings({ timestampsInSnapshots: true });

    // Listen for auth
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    });
  }

  // Download Data
  getPaged = async ({ size, start }) => {
    let ref = this.collection.orderBy("timestamp", "desc").limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const post = doc.data() || {};

          // Reduce the name
          const user = post.user || {};

          const name = user.deviceName;
          const reduced = {
            key: doc.id,
            name: (name || "Secret Duck").trim(),
            ...post
          };
          data.push(reduced);
        }
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { data, cursor: lastVisible };
    } catch ({ message }) {
      alert(message);
    }
  };

//   // Upload Data
//   uploadPhotoAsync = async uri => {
//     const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
//     return uploadPhoto(uri, path);
//   };

//   post = async ({ text, image: localUri, issueType, coords }) => {
//     try {
//       const { uri: reducedImage, width, height } = await shrinkImageAsync(
//         localUri
//       );

//       const remoteUri = await this.uploadPhotoAsync(reducedImage);
//       this.collection.add({
//         text,
//         uid: this.uid,
//         timestamp: this.timestamp,
//         imageWidth: width,
//         imageHeight: height,
//         image: remoteUri,
//         user: getUserInfo(),
//         issueType: issueType,
//         coords: coords
//       });
//     } catch ({ message }) {
//       alert(message);
//     }
//   };

  // Helpers
  get collection() {
    return firebase.firestore().collection(collectionName);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
