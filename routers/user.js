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

    // User default
    router
      .route("/")
      .get(function (req, res) {
        res.json(req.user);
      })
      .put(async (req, res) => {
        const { name, email } = req.body;

        const filter = {
          email,
        };

        const options = {
          upsert: true,
        };

        const updateDoc = {
          $set: { name, email },
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
      })
      .post(function (req, res, next) {
        next(new Error("not implemented"));
      })
      .delete(function (req, res, next) {
        next(new Error("not implemented"));
      });

    // Add review
    router.route("/review").post(async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);

      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = router;
