const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {

    const {fullName: {firstName, lastName}, email, password} = req.body;

   try {
     const isUserExist = await userModel.findOne({email});
     if(isUserExist) return res.status(400).json({msg: 'user already exist'});
 
 
     const hashPassword = await bcrypt.hash(password, 10);
 
     const user = await userModel.create({
         fullName: {firstName, lastName},
         email,
         password: hashPassword
     });
 
     const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
     res.cookie("token", token, {
        sameSite: "None",
        secure: true,
    });
 
     res.status(201).json({
         msg: 'okkkk',
         user: {
             fullName: user.fullName , email: user.email
         }
     })
   } catch (e) {
    // console.log(e.response.data);
    alert('Problem in registeration');
   }

};

async function loginUser(req, res) {
    try {
        const {email, password} = req.body;
    
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).json({msg:'invaild creadientials'});
    
        const isPdvaild = await bcrypt.compare(password, user.password);
        if(!isPdvaild) return res.status(400).json({msg:"invalid creadientials"});
    
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
        res.cookie('token', token, {
            sameSite: "None",
            secure: true,
        });
    
        res.status(200).json({msg:'okay', email: user.email, id:user._id, fullName: user.fullName});
    } catch (error) {
        alert('Problem in login');
    }
}


module.exports = {
    registerUser, loginUser
}