const jwt = require("jsonwebtoken")
const User = require("../Models/User")

require('dotenv').config() 


//auth 
exports.auth = async(req,res,next) => {
    try{

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","") 

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing"
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)

            console.log(decode) 

            req.user = decode
        
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }

        next()

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}
//student "Admin","Student","Instructor"
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Student only"
            })
        } 
        next()
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User Cannot be verified, please try again"
        })
    }
}

//instructor 
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor only"
            })
        } 
        next()
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User Cannot be verified, please try again"
        })
    }
}


//isAdmin
exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only"
            })
        } 
        next()
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User Cannot be verified, please try again"
        })
    }
}
