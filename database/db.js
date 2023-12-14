//import (if needed)

const mongoose = require('mongoose');

//list of funuctions
const connectToDB = () =>{

    mongoose.connect(process.env.DB_URL).then(()=>{

        console.log("Connected to database");

    })

}

//export

module.exports = connectToDB;