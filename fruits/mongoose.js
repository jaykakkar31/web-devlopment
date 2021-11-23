const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect("mongodb://localhost:27017/personsDb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const personsSchema = new mongoose.Schema({
  name: String,
  age: Number,
  // fruit: fruitSchema,
});

const fruitSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  rating: {
    type:Number,
    min:1,
    max:10
  },
  review: String,
  person:personsSchema
});



// COLLECTION NAME
//singular form of collection name and mongoose will create into pluralise form
const Fruit = mongoose.model("Fruit", fruitSchema);

const Person = mongoose.model("Person", personsSchema);

const fruit = new Fruit({
  name: "Apple",
  rating: 7,
  review: "Pretty solid.",
  person:{
    name:"mek",
    age:16
  }
});

const orange = new Fruit({
  name: "Orange",
  rating: 6,
  review: "Pretty solid.",
});

const kiwi = new Fruit({
  name: "Kiwi",
  rating: 6,
  review: "Pretty solid.",
});

const person = new Person({
  name: "Rocky",
  age: 24,
  fruit:orange
  // review: "Pretty solid.",
});

console.log(fruit);
// console.log(person);

// Fruit.insertMany([orange,kiwi],function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Succeess");
//   }
// });

// person.save();
fruit.save();

Fruit.find(function (err, fruits) {
  if (err) {
    console.log(err);
  } else {
    // close the connection after work is done
    mongoose.connection.close();

    fruits.forEach(function (fruit) {
      console.log(fruit.name);
    });
    // console.log(fruits);
  }
});

Fruit.updateOne({ _id: "6086ff6dbb8e372a207aad71" },{name:"Peach"},function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("Success");
  }
});

// Person.deleteOne({ _id: "6086cfeeaafe343340fcd23d" }, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Success");
//   }
// });

// Person.deleteMany({name:"JAy"},
//   function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Success deleted");
//     }
//   }
// );