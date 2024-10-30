const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
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
  }
});

async function run() {

  try {
    
    // Connect the client to the server	(optional starting in v4.7)
    const petsCollection = client.db('petAdoption').collection('pets');
    const usersCollection = client.db('petAdoption').collection('users');
    const servicesCollection = client.db('petAdoption').collection('services');

    app.get('/pets', async (req, res) => {
      const result = await petsCollection.find().toArray();
      res.send(result);
    });

    app.get('/users', async (req, res) => { 
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
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