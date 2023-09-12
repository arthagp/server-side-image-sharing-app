const express = require("express");
const app = express();
const PORT = 8000;
const morgan = require("morgan");
const router = require("./routes/index");
const cors = require("cors");
const path = require('path')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(morgan("tiny"));
app.use(router);

app.get('/get', (req, res) => {
  res.status(200).send('Berhasil Masuk')
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
