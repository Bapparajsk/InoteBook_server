require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(cors());

// all API path
app.use("/api/user/register", require("./routes/register"));
app.use("/api/user/login", require("./routes/login"));
app.use("/api/get", require("./routes/adddata"));
app.listen(port, () => {
    console.log(`app in listens in http://127.0.0.1:${port}`);
})