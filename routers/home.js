const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const router = express.Router();

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

    // Collections
    const accessoryCollection = client
      .db("computerAccessories")
      .collection("accessories");
    const reviewCollection = client
      .db("computerAccessories")
      .collection("reviews");

    // get banner accessory
    router.get("/banner", async (req, res) => {
      const accessory = await accessoryCollection.findOne();
      res.send(accessory);
    });

    // get all accessories
    router.get("/accessories", async (req, res) => {
      const accessories = await accessoryCollection.find().toArray();
      res.send(accessories);
    });

    router.get("/accessories/:id", async (req, res) => {
      const { id } = req.params;

      const query = {
        _id: ObjectId(id),
      };

      const accessory = await accessoryCollection.findOne(query);

      // send data
      res.send(accessory);
    });

    // Get all review
    router.get("/reviews", async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = router;
