const express=require('express');
const mongoose=require('mongoose');
const axios=require('axios');

const port=3003
const app = express();
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/airindia', {useNewUrlParser: true, useUnifiedTopology: true});

// const Flight = mongoose.model('Flight', {
//     noofflights: String,
//     station: String,
    
//  });

app.get('/flights', async(req, res)=>{
    try{
      const flights=await axios.get('http://localhost:3002/flights')
      res.send(flights.data)
    }
    catch(err){
      console.log(err)
      res.json({message:err})
    }
  })

  app.get('/passanger', async(req, res)=>{
    try{
      const flights=await axios.get('http://localhost:3001/passanger')
      res.send(flights.data)
    }
    catch(err){
      console.log(err)
      res.json({message:err})
    }
  })

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
})