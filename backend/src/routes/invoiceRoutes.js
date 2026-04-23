const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

router.post('/', async (req, res, next) => {
  try {
    const invoice = new Invoice(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: 'booking',
        populate: [
          { path: 'customer', select: 'name email' },
          { path: 'services', select: 'name price' }
        ]
      })
      .sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: [
          { path: 'customer', select: 'name email phone address' },
          { path: 'vehicle', select: 'make model licensePlate' },
          { path: 'services', select: 'name price' }
        ]
      });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
      .populate({
        path: 'booking',
        populate: { path: 'customer', select: 'name email' }
      });
    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json(updatedInvoice);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
