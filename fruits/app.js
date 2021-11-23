const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Replace the uri string with your MongoDB deployment's connection string.
const url = "mongodb://localhost:27017";

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const dbName = "fruitsDb";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(function (err) {
  assert.equal(null, err);
  console.log("connected");

  const db = client.db(dbName);

  insertDocument(db, function () {
    client.close();
  });
  findDocuments(db,function(){
      client.close()
  })
});

const insertDocument = function (db, callback) {
  const collection = db.collection("fruits");

  collection.insertMany([{ a: 1 }, { b: 2 }, { c: 3 }], function (err, result) {
    assert.equal(err, null);
    assert.equal(3,result.result.n)//checking 3 insertions
    console.log("Inserted 3 document");
    console.log(callback(result));//no idea
  });
};

const findDocuments=function(db,callback){
    const collection=db.collection("fruits")

    
    collection.find({}).toArray(function(err,fruits){
        assert.equal(err,null);
        console.log(fruits);

    })
}