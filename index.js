const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 3000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const userCollection = database.collection("User")

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

        app.post("/user", async (req, res) => {
            const { email, displayName, photoURL, login_at } = req.body;
            const User = { email, displayName, photoURL, login_at };
            try {
                const existingUser = await userCollection.findOne({ email });
                console.log(existingUser)
                if (existingUser) {
                    return res.status(200).send({ message: "user already register", inserted: false });
                }
                const result = await userCollection.insertOne(User);
                res.status(200).send(result)
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get("/expenses", async (req, res) => {
            const { id } = req.query;

            try {
                if (id) {
                    const expense = await expenseCollection.findOne({ _id: new ObjectId(id) });
                    res.send(expense);
                }
                else {
                    const expenses = await expenseCollection.find().toArray();
                    res.status(200).send(expenses)
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Server error while fetching expenses",
                });
            }
        });

        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const { title, amount, date, category } = req.body;
            console.log(id)
            console.log(title, amount, date, category)
            try {

                const updateDoc = {
                    $set: { title, amount, date, category },
                };

                const result = await expenseCollection.updateOne(
                    { _id: new ObjectId(id) },
                    updateDoc
                );

                res.send(result);
            } catch (error) {
                res.status(500).json({ message: "Update failed", error: error.message });
            }
        });

        app.delete("/delete/:id", async (req, res) => {
            try {
                const id = req.params.id;

                const result = await expenseCollection.deleteOne({
                    _id: new ObjectId(id),
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: "Expense not found!" });
                }

                res.json({ message: "Expense deleted successfully!", result });
            } catch (error) {
                res.status(500).json({ message: " Delete failed", error: error.message });
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
