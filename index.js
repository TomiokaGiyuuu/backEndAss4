const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const route = require('./routes/index');
////////////////////////////////////////

dotenv.config();
const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URL,
    (err) => {
    if(err)
        console.log(err);
    else
        console.log("Succesfully connected to MongoDB");
});

//////////////////////////

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use('/api', route);

//////////////////////////

app.get("/", (req, res) => {
    res.send("Welcome to homepage!");
})

app.listen(PORT, () =>
    console.log("Server is running on port: http://localhost:" + PORT)
)