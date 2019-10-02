var config = {
  apiKey: "AIzaSyANmurEOUZf2PniMmV_iI2zBm4c7o56sKw",
  authDomain: "swasthya-88454.firebaseapp.com",
  databaseURL: "https://swasthya-88454.firebaseio.com",
  projectId: "swasthya-88454",
  storageBucket: "swasthya-88454.appspot.com",
  messagingSenderId: "374829257847",
  appId: "1:374829257847:web:e3d1184d1ae43e2f00a272",
  measurementId: "G-HXKQQQLSZY"
};


firebase.initializeApp(config);
var db = firebase.firestore();

//read cookie
function getCookieValue(a) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

//create user
function createAccount(){
  var data = {
  email: $('#registerEmail').val(),
  password : $('#registerPassword').val(),
  username : $("#registerUsername").val()
};

firebase
  .auth()
  .createUserWithEmailAndPassword(data.email, data.password)
  .then(function(){
    alert("User account created!Add your info");
    document.cookie = "doctor="+data.username;
    window.location.replace("signin2.html");
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
  password : $('#loginPassword').val(),
  username : $('#loginUsername').val()
};

var auth = null;
firebase
  .auth()
  .signInWithEmailAndPassword(data.email, data.password)
  .then( function(user){
    console.log("Authenticated successfully with payload:", user);
    auth = user;
    firebase.auth().onAuthStateChanged(function(user){
        if(auth){ firebase.firestore().collection('doctor').doc(data.username).get().then(function(doc){
                if(doc.exists){
                    document.cookie = "doctor="+data.username;
                    window.location.replace("home.html");
                    }
            })
            
        }
    });
  })
  .catch(function(error){
    window.alert("Login Failed!", error);
  });
    return false;
}

//add details
function addDetails(){
    var user_ref = db.collection("doctor");
    var userdata = {
        name : $('#name').val(),
        address : $('#address').val(),
        regno : $('#regno').val(),
        regdate : $("#regdate").val()
    }

    var user = getCookieValue("doctor");
    user_ref.doc(user).set(userdata).then(function(){
        window.alert("Doctor details Added"),
        window.location.replace("home.html");
    }).catch(function(error){
        window.alert("Error Adding Info");
    });
    return false;
}

//logout
function logout(){
    firebase.auth().signOut().then(function(){
        document.cookie = "doctor= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"; //del cookie as well as auth
    }).catch(function(err){
        console.log(err);
    })
}