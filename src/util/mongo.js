const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbadmin:admindb@cluster0.6ihi0.mongodb.net/delish2go?retryWrites=true&w=majority";
let db = null;

// const RESTAURANT = "restaurant";
// const CITY = "city";

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
    collection.insertOne(data).then(res=>console.log("inserted data id: ", res.insertedId)).catch(err=>console.log("Failed to insert ", err));
};

module.exports ={
    default: init,
    put: put,
    RESTAURANT:'restaurant',
    CITY:'city'
};
// export default mongo;