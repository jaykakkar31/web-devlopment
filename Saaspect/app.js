require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
const jwt = require("jsonwebtoken");
var nJwt = require("njwt");
var signingKey = require("crypto").randomBytes(64).toString("hex");
const { RSA_NO_PADDING } = require("constants");
const secret = require("crypto").randomBytes(64).toString("hex");
// var token;
var customer1 = [];
var customer = [];
var totalAmountOfPurchase = 0;
var date = new Date();
var currentDate = date.toLocaleDateString();
var secureRandom = require("secure-random");
// var signingKey = secureRandom(256, { type: "Buffer" });
app.set("view engine", "ejs");
// var total = 0;
var arrOfEdible = [];
mongoose.connect("mongodb://localhost:27017/userCredDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

mongoose.set("useFindAndModify", false);

const edibleSchema = new mongoose.Schema({
	name: "",
	type: "",
	price: Number,
	update: "",
	quantity: Number,
});

const purchasesSchema = new mongoose.Schema({
	edible_id: "",
	quantity: "",
	date: "",
});
const Purchase = mongoose.model("Purchase", purchasesSchema);

// var claims = {
//   iss: `http://localhost:${port}/`, // The URL of your service
//   sub: "users/user1234", // The UID of the user in your system
//   scope: "self, admins",
// };
// var claims = {
//   iss: "http://myapp.com/", // The URL of your service
//   sub: "users/user1234", // The UID of the user in your system
//   scope: "self, admins",
// };
// var token = nJwt.create(claims, signingKey);
function generateAccessToken(id) {
	//   return nJwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: "1200s" });
	return jwt.sign(id, signingKey, { expiresIn: "12000s" });
}

function addVal(price) {
	return total + price;
}
const Edible = mongoose.model("Edible", edibleSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	res.redirect("/signIn");
});

app.get("/createEdibles", (req, res) => {
	res.render("createEdible");
});

app.post("/createEdibles", (req, res) => {
	console.log(req.body);

	const edibles = new Edible({
		name: req.body.name,
		type: req.body.type,
		price: req.body.price,
		quantity: req.body.quantity,
	});

	edibles.save((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.status(200).send("SUCCESS");
		}
	});
});

app.get("/fetchEdibles", (req, res) => {
	Edible.find({}, (err, foundEdible) => {
		if (err) {
			console.log(err);
		} else {
			var newArr = foundEdible.map((ediblesData) => {
				console.log(ediblesData);
				const { name, quantity } = ediblesData;
				if (quantity > 0) {
					return { name: name, quantity: quantity };
				}
			});
			arrOfEdible.push(newArr);
			res.send(newArr);
		}
	});
});

app.get("/updateEdibles", (req, res) => {
	res.render("updateEdibles");
});
app.post("/updateEdibles", (req, res) => {
	console.log(req.body.Id + " ID:");
	Edible.findByIdAndUpdate(
		req.body.Id,
		{ quantity: req.body.quantity },
		(err) => {
			if (err) {
				res.status(404).send("ERROR");
			} else {
				res.status(200).send("Quantity Updated");
			}
		}
	);
});

app.get("/purchaseEdibles", (req, res) => {
	//   if (token === null) {
	//     res.redirect("/signIn");
	//   } else {
	res.render("purchaseEdibles");
	//   }
});
app.post("/purchaseEdibles", (req, res) => {
	//   if (token === null) {
	//     res.redirect("/signIn");
	//   } else {
	// nJwt.verify(token, signingKey, (err, verifiedJwt) => {
	if (err) {
		console.log(err);
		res.redirect("/signIn");
	} else {
		console.log("Token Available");
		console.log(JSON.stringify(req.body) + " PUrchase");

		Edible.findById(req.body.id, (err, edibleData) => {
			if (err) {
				console.log(err);
			} else {
				console.log(edibleData);
				if (edibleData) {
					if (edibleData.quantity >= req.body.quantity) {
						const newPurchase = new Purchase({
							edible_id: req.body.id,
							quantity: req.body.quantity,
							date: currentDate,
						});
						// customer.push(newPurchase);
						newPurchase.save();
						// res.redirect(`/purchaseDetails/${req.body.id}`);
						let total = 0;
						Purchase.find({}, (err, foundata) => {
							customer = foundata.map((data) => {
								Edible.findOne({ _id: data.edible_id }, (err, found) => {
									total = total + found.price * req.body.quantity;
									console.log(total);
								});

								return customer1.push(total);
							});
							console.log(customer);
							//    console.log(customer1);
							//    res.status(200).send({ totalPrice: total });
						});
					} else {
						res.status(404).send("Sufficient Quantity is not available");
					}
				}
				console.log(customer + "Ar");

				// else{
				//     res.status(404).send("DAta not available");
				// }
			}
		});
	}
	// });
	//   }
});

app.get("/price/:id", (res, req) => {
	Purchase.findById(req.params.id, (err, data) => {
		// Edible.findByIdAndUpdate(req.params.id,{quantity:})
	});
});

// app.get("/purchaseDetails/:id", (req, res) => {
//   if (customer1.length !== 0) {
//     res.status(200).send({ totalPrice: customer1.pop() });
//   } else {
//     Purchase.find({}, (err, foundata) => {
//       foundata.map((data) => {
//         return Edible.findOne({ _id: data.edible_id }, (err, found) => {
//           console.log(found.price);
//           total = addVal(found.price);
//           customer1.push(total);
//           console.log(total);
//         });
//       });
//     });
//   }
// });

// app.get("/signIn", (req, res) => {
//   customer1 = [];
//   res.render("signIn");
// });
// app.post("/signIn", function (req, res) {
//   User.findOne({ email: req.body.email }, (err, foundUser) => {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         console.log(foundUser);
//         console.log(req.body);
//         if (foundUser.password === req.body.password) {
//           console.log("Success");
//           token = generateAccessToken({ _id: foundUser._id });
//           //   token = generateAccessToken({ _id: foundUser._id });
//           //   res.status(200).send({ auth: true, token: token });
//           res.status(200).redirect("/purchaseEdibles");
//         } else {
//           console.log("Failed");
//         }
//       } else {
//         console.log("User doesn't exist");
//       }
//     }
//   });
//   //   res.redirect("/signIn");
// });

// app.get("/signUp", (req, res) => {
//   res.render("signUp");
// });
// app.post("/signUp", (req, res) => {
//   console.log(req.body);
//   console.log(req.body.password);
//   const newUser = new User({
//     email: req.body.email,
//     password: req.body.password,
//   });
//   newUser.save();
// });

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
