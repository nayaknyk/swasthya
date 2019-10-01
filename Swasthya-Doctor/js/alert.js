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

var data = [
{ 
    "condition": "",
    "count": "",
    "location": "",
}
];

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

var user_ref = firebase.firestore().collection('user');
user_ref.get().then(function(users){
    users.forEach(function(userdocs){
        var id = userdocs.id;
        user_ref.doc(id).collection('patient history').get().then(function(records){
            records.forEach(function(doc){
                var condition = doc.data();

                var mmd= String(condition.start_date).split('-');
                if(mmd[0] == yyyy){
                    if((mmd[1] == mm) || (mmd[1]+1 == mm)){//date difference
                        var found = false;
                        for(var i = 0; i < data.length; i++) {
                            if (data[i].condition == condition.cond) {
                                found = true;
                                var index= i;
                                break;
                            }
                        }
                        console.log(found);
                        if(found){
                            var count=data[index].count+1;
                            data[index].count = count;
                            var location = [condition.location.latitude, condition.location.longitude];
                            //
                            //TODO: make array of locations for each disease, so all locations with 1 disease are stored
                            //
                            data[index].location = location;
                            if(count>2){
                                var rownode = document.createElement("TR");
                                //condition
                                var dnode1 = document.createElement("TD"); 
                                var d1 = document.createTextNode(data[index].condition);
                                dnode1.appendChild(d1);
                                rownode.appendChild(dnode1);
                                
                                //count
                                dnode1 = document.createElement("TD"); 
                                d1 = document.createTextNode(data[index].count);
                                dnode1.appendChild(d1);
                                rownode.appendChild(dnode1);
                                
                                //location
                                dnode1 = document.createElement("TD"); 
                                d1 = document.createTextNode(data[index].location);
                                dnode1.appendChild(d1);
                                rownode.appendChild(dnode1);
                               
                                //view location
                                dnode1 = document.createElement("TD");
                                d1 = document.createElement("A");
                                var attr = document.createAttribute("href");
                                attr.value = "https://www.google.com/maps/place/"+data[index].location;
                                d1.setAttributeNode(attr);
                                dnode1.appendChild(d1);
                                var d2 = document.createTextNode("View in Map");
                                d1.appendChild(d2);
                                dnode1.appendChild(d1);
                                rownode.appendChild(dnode1);

                                //button
                                dnode1 = document.createElement("TD"); 
                                var node = document.createElement("BUTTON");
                                var attr = document.createAttribute("class");
                                attr.value = "btn btn-outline-danger";
                                node.setAttributeNode(attr);
                                attr = document.createAttribute("onclick");
                                attr.value = "return confirm('Are you sure you wish to raise an alert?')?addAlert(data):''";
                                node.setAttributeNode(attr);
                                attr = document.createTextNode("Verify");
                                node.appendChild(attr);
                                dnode1.appendChild(node);
                                rownode.appendChild(dnode1);
                                //add all to row
                                document.getElementById('tbody').appendChild(rownode);
                            }
                            console.log(data);
                        }
                        else{
                            var count=1;
                            data.push({"condition": condition.cond, "count": count, "location":condition.location});
                            console.log(data);
                        }
                    }
                }
            })
        })
    })
}).catch(function(err){
    console.log(err);
});

function addAlert(data){
    var doc_ref = firebase.firestore().collection('doctor');
    var i = (Math.random()*1000).toString();
    data.forEach(function(record){    
        if(record.count>2){
            //prepare data
            var latitude = record.location[0];
            var longitude = record.location[1]; 
            var rec = {
                condition : record.condition,
                count : record.count,
                location : new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
                verified : false
            }
            //
            //TODO:check if alert has already been raised, if so, do nothing
            //
            doc_ref.doc('alert'+i).set(rec).then(function(){
                window.alert('Alert has been raised!');
            }).catch(function(err){
                console.log(err);
            })
                
        }
    })
}                      
                      
                    