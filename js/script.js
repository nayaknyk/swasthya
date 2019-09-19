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

//create user
function createAccount(){
  var data = {
  email: $('#registerEmail').val(),
  password : $('#registerPassword').val()
};

firebase
  .auth()
  .createUserWithEmailAndPassword(data.email, data.password)
  .then(function(){
    alert("User account created!Add your info");
    window.location.replace("signin2.html")
  })
  .catch(function(error){
    alert("Error creating user:", error);
  });
    return false;
}

//login
function loginAccount(){
  var data = {
  email    : $('#loginEmail').val(),
  password : $('#loginPassword').val()
};

var auth = null;
firebase
  .auth()
  .signInWithEmailAndPassword(data.email, data.password)
  .then( function(user){
    console.log("Authenticated successfully with payload:", user);
    auth = user;
    firebase.auth().onAuthStateChanged(user => {
        if(auth){
            window.location.replace("home.html");
        }
    })
  })
  .catch(function(error){
    window.alert("Login Failed!", error);
  });
    return false;
}

//add details
function addDetails(){
    var db = firebase.firestore();
    var user_ref = db.collection("user").doc("001");

              
    var userdata = {
        name : $('#name').val(),
        dob : $('#dob').val(),
        btype : $('#btype').val()
    }
    console.log(userdata);
    user_ref.set(userdata).then(function(){
        window.alert("User details Added"),
        window.location.replace("home.html");
    }).catch(function(error){
        window.alert("Error Adding Info");
    });
    return false;
}