const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
app.use(express.json())

const PORT=3001

mongoose.connect('mongodb://127.0.0.1:27017/passangerdb', {useNewUrlParser: true, useUnifiedTopology: true})

const passanger = mongoose.model('passanger', {
    name: String,
    bookeddate: String,
    destination: String,
    phone: Number,
    gender: String,
    email: String,
    passportno: String,
    bookedflight:[String]
    
  });


  app.get('/passanger',async(req,res)=>{
    try{
      const passangers=await passanger.find()
      res.json(passangers)
    }catch(err){
      res.json({message:err})
    }
  })
  app.get('/passanger/:id',async(req,res)=>{
    try{
      const passangers=await passanger.findById(req.params.id)
      res.json(passangers)
    }catch(err){
      res.json({message:err})
    }
  })

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

app.put('/passanger/:id/bookflight', async (req, res) => {
  const flightId = req.params.id;
  const { passengerId } = req.body; // Expecting flightId in the request body

  try {
    // Step 1: Update the passenger's bookedflight array
    const updatedPassenger = await passanger.findByIdAndUpdate(
      passengerId,
      { $addToSet: { bookedflight: flightId } }, // Add flightId to bookedflight array
      { new: true } // Return the updated document
    );
    

    if (!updatedPassenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Step 2: Update the flight's passengerid array
    await axios.put(`http://localhost:3002/flights/${flightId}/addPassenger`, {
      passengerid: passengerId,
    });

    res.json(updatedPassenger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


  app.post('/passanger', async(req,res)=>{
    const now = new Date();
    const newPassanger=new passanger({
      name:req.body.name,
      bookeddate:now.toLocaleString(),
      destination:req.body.destination,
      phone:req.body.phone,
      gender:req.body.gender,
      email:req.body.email,
      passportno:req.body.passportno
    })
    try{
      const savedPassanger=await newPassanger.save()
      res.json(savedPassanger)
    }catch(err){
      res.json({message:err})
    }
  })

  app.put('/passanger/:id',async(req,res) =>{
    const passangerId=req.params.id
    try{
      const updatedPassanger=await passanger.findByIdAndUpdate(passangerId, req.body, {new:true})
      res.json(updatedPassanger)
    }catch(err){
      res.json({message:err})
    }
  })

  app.delete('/passanger/:id', async (req, res) => {
    const passengerId = req.params.id;
    try {
      const removedPassenger = await passanger.findByIdAndDelete(passengerId);
      // console.log(removedPassenger)
      if (!removedPassenger) {
        return res.status(404).json({ message: 'Passenger not found' });
      }
      res.json(removedPassenger);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
  });