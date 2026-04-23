const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

router.post('/', async (req, res, next) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'License Plate already exists' });
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate('customer', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('customer', 'name email phone');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone');
    if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json(updatedVehicle);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
