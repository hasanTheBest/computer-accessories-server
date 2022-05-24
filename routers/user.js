const express = require("express");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const router = express.Router();

router.use(express.json());

// middleware that is specific to this router
/* router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}) */

/**
 * DB Connection
 * */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wlxry.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("computerAccessories").collection("users");
    const reviewCollection = client
      .db("computerAccessories")
      .collection("reviews");
    const purchaseCollection = client
      .db("computerAccessories")
      .collection("purchases");

    // User default
    router
      .route("/")
      .get(async (req, res) => {
        const { user } = req.query;

        const result = await userCollection.findOne({ email: user });

        res.send(result);
      })
      .put(async (req, res) => {
        const { email } = req.body;

        const filter = {
          email,
        };

        const options = {
          upsert: true,
        };

        const updateDoc = {
          $set: req.body,
        };

        const result = await userCollection.updateOne(
          filter,
          updateDoc,
          options
        );

        const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
          expiresIn: "5h",
        });

        res.send({ result, token });
      });

    // Add review
    router.route("/review").post(async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);

      res.send(result);
    });

    // Get all purchases
    router.route("/purchases").get(async (req, res) => {
      const result = await purchaseCollection.find().toArray();

      res.send(result);
    });

    // Add purchase
    router.route("/purchase").post(async (req, res) => {
      const result = await purchaseCollection.insertOne(req.body);

      res.send(result);
    });

    router
      .route("/purchases/:id")
      .get(async (req, res) => {
        const { id } = req.params;

        const result = await purchaseCollection.find({ email: id }).toArray();

        res.send(result);
      })
      .delete(async (req, res) => {
        const { id } = req.params;

        const result = await purchaseCollection.deleteOne({
          _id: ObjectId(id),
        });

        res.send(result);
      });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = router;
