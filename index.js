const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.njebycd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    client.connect();
    const appoinmentOptionsCOllection = client
      .db("doc-portal")
      .collection("appoinmentOptions");
    const bookingsCOllection = client.db("doc-portal").collection("bookings");

    // appoinment options 
    // use aggregation to query multiple collections and then merge data  
    app.get("/appoinmentOptions", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const options = await appoinmentOptionsCOllection.find(query).toArray();    
      res.send(options);
    });

    // booking post
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCOllection.insertOne(booking);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("dOCTOR IS RUNNING");
});

app.listen(port, () => {
  console.log(`Doctor portal is running om ${port}`);
});
