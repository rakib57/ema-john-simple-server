const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;
const env = require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=>{res.send('hellow world')})

const uri = "mongodb+srv://emaWatson:q0ggErt4cvvQGNDf@cluster0.aea4t.mongodb.net/emaJohndb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

client.connect(err => {
  const productsCollection= client.db("emaJohndb").collection("products");
  
  app.post('/addProduct',(req,res)=>{
    const products = req.body
    productsCollection.insertMany(products)
    .then(result => {
        res.send(result.insertedCount)
    })
  })
  app.get('/products',(req,res) =>{
    productsCollection.find({})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

  app.get('/product/:key',(req,res) =>{
    productsCollection.find({key:req.params.key})
    .toArray((err,documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys',(req,res) =>{
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

});

app.listen(5000)