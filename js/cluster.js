var config = {
apiKey: "AIzaSyANmurEOUZf2PniMmV_iI2zBm4c7o56sKw",
authDomain: "swasthya-88454.firebaseapp.com",
databaseURL: "https://swasthya-88454.firebaseio.com",
projectId: "swasthya-88454",
storageBucket: "swasthya-88454.appspot.com",
messagingSenderId: "374829257847",
appId: "1:374829257847:web:12e1bb9b95415a8f00a272"
};


firebase.initializeApp(config);
var latlong;
var db = firebase.firestore();
var loc = db.collection("location");
console.log(loc);
loc.get().then(function(docs){
docs.forEach(function(doc){
   latlong=doc.data();
console.log(latlong.latlng);

})

})
function retdata(){
  return latlong;
}
