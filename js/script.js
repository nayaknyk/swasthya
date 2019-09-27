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
  password : $('#registerPassword').val(),
  username : $("#registerUsername").val()
};

firebase
  .auth()
  .createUserWithEmailAndPassword(data.email, data.password)
  .then(function(){
    alert("User account created!Add your info");
    document.cookie = "user="+data.username;
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
 firebase.firestore().collection('user').doc(data.username).get().then(function(doc){
     if(doc.exists)
            auth = user;
    });
    firebase.auth().onAuthStateChanged(user => {
        if(auth){
            window.location.replace("home.html");
        }
        else{ console.log("error");}
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
    var user_ref = db.collection("user");
    
    var userdata = {
        name : $('#name').val(),
        dob : $('#dob').val(),
        btype : $('#btype').val()
    }
    console.log(userdata);
    var user = getCookieValue("user");
    user_ref.doc(user).set(userdata).then(function(){
        window.alert("User details Added"),
        window.location.replace("home.html");
    }).catch(function(error){
        window.alert("Error Adding Info");
    });
    return false;
}

function getCookieValue(a) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

//populate fields
var db = firebase.firestore();
var user_ref = db.collection("user");
var username = getCookieValue("user");

//populate table and fields
if(document.title == "Swasthya | Patient History"){
    var flag = 0;
    user_ref.get().then(function(docs){
    docs.forEach(function(doc){
        if(doc.id == username){
            flag = 1;
            var user = doc.data();
            document.getElementById("lname").innerHTML = "Name: "+user.name;
            document.getElementById("ldob").innerHTML = "DOB: "+user.dob;
            document.getElementById("lbtype").innerHTML = "Blood Type: "+user.btype;
            
            user_ref.doc(username).collection('patient history').get().then(function(obj){
        obj.forEach(function(doc){
            var medhistory = doc.data();
            var rownode = document.createElement("TR");
            //cond
            var dnode1 = document.createElement("TD"); 
            var d1 = document.createTextNode(medhistory.cond);
            dnode1.appendChild(d1);
            rownode.appendChild(dnode1);
            document.getElementById("tbody").appendChild(rownode);
            //start date
            dnode1 = document.createElement("TD"); 
            d1 = document.createTextNode(medhistory.start_date);
            dnode1.appendChild(d1);
            rownode.appendChild(dnode1);
            document.getElementById("tbody").appendChild(rownode);
            //medication
            dnode1 = document.createElement("TD"); 
            d1 = document.createTextNode(medhistory.med);
            dnode1.appendChild(d1);
            rownode.appendChild(dnode1);
            document.getElementById("tbody").appendChild(rownode);
            //end date
            dnode1 = document.createElement("TD"); 
            d1 = document.createTextNode(medhistory.end_date);
            dnode1.appendChild(d1);
            rownode.appendChild(dnode1);
            document.getElementById("tbody").appendChild(rownode);
            //physician
            dnode1 = document.createElement("TD"); 
            d1 = document.createTextNode(medhistory.phy);
            dnode1.appendChild(d1);
            rownode.appendChild(dnode1);
            document.getElementById("tbody").appendChild(rownode);
        });
        
    }).catch(function(error){
        window.alert(error.toString());
    });
        }    
  });
  if(flag == 0){
      window.alert("User not found.");
  }
});
}

//add medical history
function addRecords(){
    var data = {
        cond : $('#cond').val(),
        start_date : $('#de').val(),
        end_date : $('#ds').val(),
        med : $('#med').val(),
        phy : $('#phy').val()
        
    }
    var db = firebase.firestore();
    var i = (Math.random()*1000).toString();
    
    user_ref.get().then(function(docs){
    docs.forEach(function(doc){
        if(doc.id == username){
            firebase.firestore().collection('user').doc(username).collection("patient history").doc('condition'+i).set(data).then(function(){
                window.alert("Record Added");
                location.reload();
                }).catch(function(error){
                    window.alert(error.toString);
                });
        }
    });
    });
    return false;
}