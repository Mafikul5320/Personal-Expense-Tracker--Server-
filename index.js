const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 3000

const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("Trackify")
        const expenseCollection = database.collection("Expense")

app.post("/expense", async (req, res) => {
    const data = req.body;

    try {
        const result = await expenseCollection.insertOne(data);

        if (result.insertedId) {
            res.status(201).json({
                message: "Expense added successfully",
                insertedId: result.insertedId
            });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error while adding expense" });
    }
});

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Trackify is C o o k i n g')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
