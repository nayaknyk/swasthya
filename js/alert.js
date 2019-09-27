function run() {
    var data = [
        { 
            "condition": "",
            "count": "",
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
                                    console.log(data);
                                }
                                else{
                                    var count=1;
                                    data.push({"condition": condition.cond, "count": count});
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

}
                      
                      
                    