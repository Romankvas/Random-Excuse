const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect(
  'mongodb+srv://admin:0tvvf6wf6Ed232Xw@cluster0.orpj3od.mongodb.net/?appName=Cluster0'
)
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});