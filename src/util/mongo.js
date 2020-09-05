const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbadmin:admindb@cluster0.6ihi0.mongodb.net/delish2go?retryWrites=true&w=majority";
let db = null;

const init = ()=>{

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        db = client.db("delish2go");//.collection("city");
        // perform actions on the collection object
        console.log("db connected");
        // client.close();
    });
      
};

const put = (collec, data)=>{
    const collection = db.collection(collec);
    return collection.insertOne(data).then(res=>{
        console.log("inserted data id: ", res.insertedId);
        return 0;
    }).catch(err=>{
        console.log("Failed to insert ", err);
        return 1;
    });
};

const  get =  (collec, query, fields)=>{
    const collection = db.collection(collec);

    return  fields ? collection.find(query, fields) : collection.find(query);  
};

const update = (collec, query, data)=>{
    const collection = db.collection(collec);

    return collection.updateOne(query, {$set:data}).then(res=>{
        console.log(res.matchedCount," data updated: ");
        if(res.matchedCount==1)
            return 0;
        return 2;
    }).catch(err=>{
        console.log("Failed to update ", err);
        return 1;
    });
};

module.exports ={
    RESTAURANT:'restaurant',
    CITY:'city',
    DISH:'dish',
    ORDER:'order',
    default: init,
    put: put,
    get: get,
    update: update
};
// export default mongo;