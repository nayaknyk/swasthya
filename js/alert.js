var data = "";
if(document.title == "Swasthya | Patient History" || document.title="Swasthya")
{
    var db = firebase.firestore().collection('user');
    db.get().then(function(users){
        users.forEach(function(ids){
            ids.collection('patient history').get().then(function(records){
                records.forEach(function(conditions){
                    if(conditions.start_date) //date difference
                    data.push(conditions.data());
                });
            });
        });
    }).catch(function(err){
        console.log(err);
    });
}