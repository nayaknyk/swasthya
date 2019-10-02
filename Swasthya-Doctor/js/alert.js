var data = [
{
    "condition": "",
    "count": "",
    "location": [],
}
];
var index = '';
var rec = '';
var cmp = ' ';
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
                                index= i;
                                break;
                            }
                        }
                        console.log(found);
                        if(found){
                            var count=data[index].count+1;
                            data[index].count = count;
                            data[index].location.push(condition.location);
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

                                //view location
                                dnode1 = document.createElement("TD");
                                d1 = document.createElement("A");
                                var attr = document.createAttribute("href");
                                attr.value = createMapURL(data[index]);
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
                                attr = document.createAttribute("id");
                                attr.value = "btn"+index;
                                node.setAttributeNode(attr);
                                attr = document.createAttribute("onclick");
                                rec = data[index];
                                attr.value = "return confirm('Are you sure you wish to raise an alert?')?addAlert(rec, index):''";
                                node.setAttributeNode(attr);
                                attr = document.createTextNode("Verify");
                                node.appendChild(attr);
                                dnode1.appendChild(node);
                                rownode.appendChild(dnode1);
                                //add all to row
                                document.getElementById('tbody').appendChild(rownode);
                            }
                        }
                        else{
                            count=1;
                            data.push({"condition": condition.cond, "count": count, "location":[condition.location]});
                        }
                    }
                }
            })
        })
    })
}).catch(function(err){
    console.log(err);
});

function addAlert(data, index){   //receive individual record instead of entire array
    var doc_ref = firebase.firestore().collection('alerts');
    var i = (Math.random()*1000).toString();
    var avgLocation = {
        lat : 0,
        long : 0,
    }
    var length = data.location.length;
    data.location.forEach(function(value){
        avgLocation.lat += value._lat;
        avgLocation.long +=value._long;
    })
    avgLocation.lat /= length;
    avgLocation.long /= length;
    //prepare data
    var record = {
        disease : data.condition,
        count : data.count,
        location : new firebase.firestore.GeoPoint(avgLocation.lat, avgLocation.long),
        date : new firebase.firestore.Timestamp.now().toMillis()
    }
    //check if alert has already been raised
    doc_ref.get().then(function(alert){
        alert.forEach(function(entry){
            var tmp = entry.data();
            var currTime = new Date().getTime();
            var dbTime = tmp.date;
            //eliminate records later than 30 days from current date
            if(diffdays(currTime, dbTime)<30){
                if(tmp.disease == record.disease && tmp.location === record.location){
                    window.alert('Alert has already been raised.');
                    $('#btn'+index).hide();
                    cmp = true;
                }
            }
            
        })
    })
    //alert does not exist, create new alert
    if(cmp != true){
    doc_ref.doc('alert'+i).set(record).then(function(){
        $('#btn'+index).hide();
    }).catch(function(err){
        console.log(err);
    })
    }
}

function createMapURL(record){
    var disease = record.condition;
    var locations = record.location;
    var url = 'testleflet.html?disease='+disease;
    locations.forEach(function(value){
        var lat = value._lat.toString();
        var long = value._long.toString();
        var locstring = long+','+lat;
        url += '&location='+locstring;
    })
    console.log(url);
    return url;
}

function diffdays(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);
    return daysDifference;
}