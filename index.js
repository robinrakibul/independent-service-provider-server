const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { query } = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running')
})

// mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        // collection in mongodb
        const itemsCollection = client.db('famousWriter').collection('books');

        // Products API
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // searchId
        app.get('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const itemSearch = await itemsCollection.findOne(query);
            res.send(itemSearch);
        });
    }
    finally {

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log('Listening to port', port);
})