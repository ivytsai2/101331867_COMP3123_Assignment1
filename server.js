const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const mongoose = require('mongoose');
const auth = require("./middleware/auth");

const app = express();
const SERVER_PORT = 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const DB_CONNECTION_STRING = "mongodb+srv://Ivy:SpyFamily0725*@cluster0.4qege3x.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority"
mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.route('/').get((req, res) => {
    res.send('<h1>COMP3123 - Assignment1</h1>');
})

app.use('/api/user', userRoutes);
app.use('/api/emp', employeeRoutes, auth);

app.listen(process.env.PORT || SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}/`);
})