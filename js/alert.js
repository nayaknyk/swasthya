
var data = [
{ 
    "condition": "",
    "count": "",
    "location": "",
}
];
var today = new Date();
console.log(today);
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
console.log(today);
console.log(mm);

var user_ref = firebase.firestore().collection('user');
user_ref.get().then(function(users){
    users.forEach(function(userdocs){
        var id = userdocs.id;
        user_ref.doc(id).collection('patient history').get().then(function(records){
            records.forEach(function(doc){
                var condition = doc.data();
                console.log(condition);
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
                            data[index].count=count;
                            data[index].location=condition.location;
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
                               
                                //button
                                dnode1 = document.createElement("TD"); 
                                var node = document.createElement("BUTTON");
                                var attr = document.createAttribute("class");
                                attr.value = "btn btn-outline-danger";
                                node.setAttributeNode(attr);
                                attr = document.createAttribute("onclick");
                                attr.value = "window.confirm('Are you certain that an epidemic is occuring?');";
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

                      
                      
                    