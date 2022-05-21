const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

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
    // const carCollection = client.db("carDB").collection("carCollection");
    console.log("db is connected");

    // get a car for banner
    /* app.get("/banner", async (req, res) => {
      const query = {};
      const options = {
        sort: { price: -1 },
      };
      const cursor = carCollection.find(query, options).limit(1);
      const car = await cursor.toArray();

      // send data
      res.send(car);
    }); */
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// base url
app.get("/", (req, res) => {
  res.send("Computer Accessories Server running");
});

// listen to the port
app.listen(port, () => {
  console.log("Computer Accessories  listening to the port", port);
});
