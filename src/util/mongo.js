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
    collection.insertOne(data).then(res=>console.log("inserted data id: ", res.insertedId)).catch(err=>console.log("Failed to insert ", err));
};

const  get =  (collec, query)=>{
    const collection = db.collection(collec);
    // let cities = collection.find();
    //  collection.find({}).sort({ name: 1 }).forEach((city)=>{
    //     console.log(city.name);
    // });
    return  collection.find(query);//.then(()=>{});
    
}

module.exports ={
    RESTAURANT:'restaurant',
    CITY:'city',
    default: init,
    put: put,
    get: get
};
// export default mongo;