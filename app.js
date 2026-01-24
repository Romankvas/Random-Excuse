const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/excusesDB';

mongoose.connect(
  'mongodb+srv://admin:0tvvf6wf6Ed232Xw@cluster0.orpj3od.mongodb.net/?appName=Cluster0'
)
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});


const excuseSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, required: true }, 
  lie_level: { type: Number, default: 5 }
});

const Excuse = mongoose.model('Excuse', excuseSchema);


app.get('/api/excuses', async (req, res) => {
  try {
    const all = await Excuse.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/excuse', async (req, res) => {
  try {
    const count = await Excuse.countDocuments();
    if (count === 0) return res.status(404).json({ message: "База порожня. Додай дані через POST!" });
    
    const random = Math.floor(Math.random() * count);
    const result = await Excuse.findOne().skip(random);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/excuses/clear', async (req, res) => {
  try {
    await Excuse.deleteMany({});
    res.json({ message: "База повністю очищена!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/excuse/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const count = await Excuse.countDocuments({ category });
    
    if (count === 0) return res.status(404).json({ message: `Відмазок для категорії ${category} не знайдено` });
    
    const random = Math.floor(Math.random() * count);
    const result = await Excuse.findOne({ category }).skip(random);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/excuse', async (req, res) => {
  try {
    const newExcuse = new Excuse(req.body);
    const saved = await newExcuse.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Неправильний формат даних" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Battle server running on http://localhost:${PORT}`);
  console.log(`📝 Test GET: http://localhost:${PORT}/api/excuse`);
});