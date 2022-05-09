const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

var corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/minor",require("./routes/app"));

app.use("/admin",require("./routes/admin"));

app.use("/president",require("./routes/president"));

app.use("/dataHandler",require("./routes/dataHandler"));

app.use("/owner",require("./routes/owner"));

app.use("/user",require("./routes/users"));

app.use("/parking",require("./routes/parking"));

app.use("/tenant",require("./routes/tenant"));

app.use("/",express.static("public"));

app.use('/assets',express.static('assets'));

var port = process.env.PORT || 5000;
app.listen( port, function(){
	console.log(`Server has started at the port ${port}`);
});

