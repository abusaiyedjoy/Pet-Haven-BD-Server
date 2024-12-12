const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

// const corsOptions = {
//   origin: [
//     'http://localhost:5173'
//   ],
//   credentials: true,
//   optionSuccessStatus: 200,
// };
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dgixmli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const petsCollection = client.db("petAdoption").collection("pets");
    const usersCollection = client.db("petAdoption").collection("users");
    const servicesCollection = client.db("petAdoption").collection("services");
    const blogsCollection = client.db("petAdoption").collection("blogs");
    const teamsCollection = client.db("petAdoption").collection("teams");

    app.get("/pets", async (req, res) => {
      const categoty = req.query.category;
      let query = {};
      if (categoty !== undefined && categoty !== "null") query = { categoty };
      console.log(categoty);
      const result = await petsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    });

    app.post("/pets", async (req, res) => {
      const {name,gender,age,vaccinated,breed,description,size,color,weight,healthStatus,neutered,adoptionFee,location,images,contactInfo,category} = req.body;
      const petData = {name,gender,age,
        vaccinated: vaccinated || false,
        breed: breed || "Unknown",
        description: description || "No description provided",
        size: size || "Unknown",
        color: color || "Unknown",
        weight: weight || "Unknown",
        healthStatus: healthStatus || "Unknown",
        neutered: neutered || false,
        adoptionFee: adoptionFee || "Not specified",
        location: location || "Unknown",
        images: images ,
        contactInfo: {
          phone: contactInfo?.phone || "Not provided",
          email: contactInfo?.email || "Not provided",
        },
        category: category || "Unknown",
        postedDate: new Date().toISOString().split('T')[0],
      };
      const result = await petsCollection.insertOne(petData);
      res.send(result);
    });


    app.delete("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const {name,gender,age,vaccinated,breed,description,size,color,weight,healthStatus,neutered,adoptionFee,location,images,contactInfo,category} = req.body;
      const petData = {name,gender,age,
        vaccinated: vaccinated || false,
        breed: breed || "Unknown",
        description: description || "No description provided",
        size: size || "Unknown",
        color: color || "Unknown",
        weight: weight || "Unknown",
        healthStatus: healthStatus || "Unknown",
        neutered: neutered || false,
        adoptionFee: adoptionFee || "Not specified",
        location: location || "Unknown",
        images: images || [],
        contactInfo: {
          phone: contactInfo?.phone || "Not provided",
          email: contactInfo?.email || "Not provided",
        },
        category: category || "Unknown",
        postedDate: new Date().toISOString().split('T')[0],
      };
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: petData,
      };
      const result = await petsCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });


    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });
    app.get("/teams", async (req, res) => {
      const result = await teamsCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
