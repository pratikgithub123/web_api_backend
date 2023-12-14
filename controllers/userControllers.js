const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//making all the required functions
const createUser = async (req,res) => {
    //step 1: Check if data is coming or not
    console.log(req.body);

    //step 2 : Destructure the data
    const {firstName, lastName, email, password} = req.body;

    //step 3 : validate the incomming data
    if(!firstName || !lastName || !email || !password){
        return res.json({
            sucess : false,
            message : "Please enter all fields."
        })
    }
    
    //step 4: try catch block
    try {
        //step 5 : check existing user
        const existingUser = await Users.findOne({email:email})
        if(existingUser){
            return res.json({
                sucess : false,
                message : "User already exists."
            })
        }

        //password encryption
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password,randomSalt)

        //step 6 : create new user
        const newUser = new Users({
            // fieldname : incomming data name
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : encryptedPassword,
        })

        //step 7 : save user and response
        await newUser.save();
        res.status(200).json({
            sucess : true,
            message : "User creaated sucessfully."
        })

    } catch (error) {
        res.status(500).json("Server Error")
    }
}
const loginUser =async(req,res) => {
    //step 1 : Check incomming data
    console.log(req.body);

    //destructuring
    const{email,password} = req.body;

    //validation
    if(!email || !password){
        return res.json({
            sucess: false,
            message: "Please enter all fields"
        })
    }

    //try catch block
    try {

    //finding user
    const user = await Users.findOne({email: email})
    if(!user){
        return res.json({
            sucess: false,
            message: "User does not exists."
        })
    }

    //user exists: {FirstName, LastName, Email, Password} user.password
    //Comparing password
    const databasePassword = user.password;
    const isMatched = await bcrypt.compare(password,databasePassword);

    if(!isMatched){
        return res.json({
            sucess: false,
            message: "Invalid Credentials"
        })
    }
    //create token
    const token = await jwt.sign({id:user._id},process.env.JWT_SECRET)
    //response
    res.status(200).json({
        sucess: true,
        message: "User logged in sucessfully",
        token : token,
        userData : user
    })

    }catch(error){
        red.json({
            sucess: false,
            message: "Server Error",
            error: error
        })
    }
}

module.exports = {
    createUser,
    loginUser
}