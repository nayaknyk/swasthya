function run() {
    var data = "";
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
                        
                    })
                })
            })
        }).catch(function(err){
            console.log(err);
        });

}
                      
                      
                    /*{
                       mmd=String((conditions.start_date));
                        if((mmd == mm) || (mmd+1 == mm)){//date difference
                            if(data.includes(conditions.data())){
                                data[data.indexOf(conditions.data())]
                            }
                            else{
                                var count=1;
                                data.push([conditions.data(),count]);
                                console.log(data);
                            }
                        }
                    } */