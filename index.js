const express = require('express')
const app = express()
const port = process.env.PORT || 5200
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@t-shirt-web-store-clust.e8shw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const TShirtCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_NAME}`)
    const OrderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER_COLLECTION_NAME}`)


app.get('/products',(req, res) => {
TShirtCollection.find({})
.toArray((err,documents) => {
    res.send(documents)
})
})

app.post('/AddProduct',(req, res) => {
const newProduct = req.body
TShirtCollection.insertOne(newProduct)
.then(result => {
res.send(result.insertedCount>0)
})
})

app.get('/products/:code' ,(req,res) => {
    TShirtCollection.find({code: req.params.code})
    .toArray((err,docs)=>{
      res.send(docs[0])
    })
  })

  app.post("/addOrder",(req,res) => {
    const order =req.body;
    //console.log(order);
    OrderCollection.insertOne(order)
    .then(result=>{
    res.send(result.insertedCount >0)
    })
    })

    app.get('/ordered',(req, res)=>{
      OrderCollection.find({email:req.query.email})
      .toArray((err,docs) => {
        //console.log(docs);
        res.send(docs)
      })
    })

    app.delete('/delete/:code' , (req, res) => {
      TShirtCollection.deleteOne({code: req.params.code})
      .then((result) => {
        res.send(result.deletedCount >0);
      })
      })
      

})
//mongodb closed



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`${port}`, 'server connected')
})
