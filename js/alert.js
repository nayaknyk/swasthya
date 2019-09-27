function run() {
    var data = "abc";
    var today = new Date();
    console.log(today);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    document.write(today);
    console.log(today);
    console.log(mm);
    if(document.title == "Swasthya | Patient History" )
    {
        var db = firebase.firestore().collection('user');
        db.get().then(function(users){
            users.forEach(function(ids){
                ids.collection('patient history').get().then(function(records){
                    records.forEach(function(conditions){
                        mmd=String((conditions.start_date));
                        if((mmd == mm) || (mmd+1 == mm)){//date difference
                            data.push(conditions.data());
                        }
                    });
                });
            });
        }).catch(function(err){
            console.log(err);
        });
    }
}