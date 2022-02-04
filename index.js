const { areCookiesEnabled } = require("@firebase/util");
const { profile } = require("console");
const express = require("express");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const credentials = require("./credentials.json");

const app = express();
//PORT = 3001;
const PORT = process.env.PORT || 3000;
const db = connectToFirestore();

function connectToFirestore() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(credentials),
    });
  }
  return getFirestore();
}

app.get("/", (req, res) => {
  db.collection("product")
    .get()
    .then((snapshot) => {
      const product = snapshot.docs.map((doc) => {
        let product = doc.data();
        product.id = doc.id;
        return product;
      });
      res.status(200).send(product);
    })
    .catch(console.error);
});
//reading a single doc
app.get("/prod/:productId", (req, res) => {
  console.log("my param request", req.params);
  const { productId } = req.params; // getting product Id from the params from browser or req (prod Id on FS)

  db.collection("product") // from firestore collection > product - connect to collection
    .doc(productId) //we are asking FS to find this product Id
    .get() // getting that productId
    .then((productFound) => {
      //after we get the productId we receive the entire productId object
      res.send(productFound.data()); //set up a function which brings back data (product information) to the requestor
    });
});
//adding a doc to collection
app.post("/addprod", (req, res) => {
  const newProd = {
    SKU: 12326,
    description: "lightweight",
    inventory: 300,
    Brand: "Newy",
    price: "$5.99",
  };

  db.collection("product")
    .add(newProd)
    .then(() => res.send("Product Added"));
});

//update a doc
app.patch("/updatename", (req, res) => {
  db.collection("customer")
    .doc("XsAEsYNogxL7lXU1IdxS")
    .update({ name: "Joel" })
    .then(() => res.send("Customer Updated"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
