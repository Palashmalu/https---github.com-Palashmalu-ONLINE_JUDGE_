const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/compilerapp";

const { generateFile } = require('./generateFile');  
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { Job } = require("./models/Job");

mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

.then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    return res.json({Hello : "World"});
});


app.post("/run", async (req, res) => {
    const {language = "cpp", code} = req.body;
    console.log(language);
    if(code === undefined) {
        return res.status(400).json({ success :false , error :"Code is empty"});
    }

    try {

    const filepath = await  generateFile(language , code);

        let output;


    if(language == "cpp"){
     output = await executeCpp(filepath);
    } else {
     output = await executePy(filepath); 
    }

    return res.json({ filepath , output });
    } catch (err) {
        res.status(500).json({err});
    }
});

app.listen(3003, () => {
    console.log("Listening on port 3003");
})  