const express=require('express');
const mongoose=require('mongoose');
const axios=require('axios');
const port=3002
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/flightsdb', {useNewUrlParser: true, useUnifiedTopology: true});

const Flight = mongoose.model('Flight', {
    flightNumber: String,
    departureCity: String,
    arrivalCity: String,
    departureDate: Date,
    arrivalDate: Date,
    duration: Number,
    price: Number,
    passengerid: [String]
 });

 app.post('/flights', async (req, res) => {
    const flight = new Flight(req.body);
    await flight.save();
    res.send(flight);
});

app.get('/flights',async(req, res) => {
    const flights = await Flight.find({});
    res.send(flights);
})

app.get('/flights/:id', async(req, res) => {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).send('The flight with the given ID was not found.');
    res.send(flight);
})

app.put('/flights/:id/addPassenger', async (req, res) => {
    const flightId = req.params.id;
    const { passengerid } = req.body; 
    console.log(passengerid, passengerid)
    try {
      // Update the flight's passengerid array
      const updatedFlight = await Flight.findByIdAndUpdate(
        flightId,
        { $addToSet: { passengerid: passengerid } }, 
        { new: true } 
      );
  
      if (!updatedFlight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      res.json(updatedFlight);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

app.put('/flights/:id', async(req, res) => {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!flight) return res.status(404).send('The flight with the given ID was not found.');
    res.send(flight);
})

app.delete('/flights/:id', async(req, res) => {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).send('The flight with the given ID was not found.');
    res.send(flight);
})

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
})