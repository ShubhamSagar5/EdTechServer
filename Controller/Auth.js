
const User = require("../Models/User")
const OTP = require("../Models/otp")
const Profile = require("../Models/profile")

const otpGenerator  = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt  = require("jsonwebtoken")

require('dotenv').config()

//sendOtP

exports.sendOTP = async(req,res) => {
    try{

        const {email} = req.body 

        const checkUserPresent = await User.findOne({email})

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Register"
            })
        }

        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        console.log("OTP Generated : "+ otp)

        let result = await OTP.findOne({otp:otp})

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })

            result = await OTP.findOne({otp:otp})
        }

        const otpPayload = {
            email:email,
            otp:otp
        }

        const otpBody = await OTP.create(otpPayload)

        console.log(otpBody)

        res.status(200).json({
            success:true,
            message:"OTP Sent Successfully"
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something Error Occur During OTP Sending"
        })
    }

}


//signUp

exports.signUp = async(req,res) => {
    try{

        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body 

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All Fields Required"
            })
        } 

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password And Confirm Password Values Does Not Match Please Try Again "
            })
        }

        const existingUser = await User.findOne({email}) 

        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User Already Register Please Login "
            })
        }

        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1)
        console.log(recentOTP) 

        if(recentOTP.length == 0){
            return res.status(400).json({
                success:false,
                message:"OTP Not Found"
            })
        }else if(otp !== recentOTP.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const hashPassword = await bcrypt.hash(password,10) 

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null
        })

        const userObjSaved = await User.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            contactNumber:contactNumber,
            password:hashPassword,
            accountType:accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully"
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Cannot Registered.Please Try again"
        })
    }
}

//Login


exports.logIn = async(req,res)=>{

    try{

        const {email,password} = req.body 

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields Required"
            })
        }

        const user = await User.findOne({email}).populate("additionalDetails")

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Not Register Please SignUp First"
            })
        }

        
        if(await bcrypt.compare(password,user.password)){
            
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
    

            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })

            user.token = token
            user.password = undefined 

            const option = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token",token,option).json({
                success:true,
                message:"LogIn Successfully",
                token:token,
                user:user
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Password Is Incorrect"
            })
        }

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Login Failure Please try again"
        })
    }
}

//changePassword

