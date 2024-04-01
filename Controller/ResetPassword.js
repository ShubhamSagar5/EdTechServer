const User = require("../Models/User")
const mailSender = require("../Utilis/mailSender")
const bcrypt = require("bcrypt")

//reset password token 
exports.resetPasswordToken = async(req,res) => {
    try{

        const email = req.body.email 

        if(!email){
            return res.status(403).json({
                success:false,
                message:"Email is required please fill"
            })
        }

        const user = await User.findOne({email:email}) 

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your Email is not register with us"
            })
        }

        const token = crypto.randomUUID() 

        const updateDeatils = await User.findOneAndUpdate({email:email},
                                                            {token:token,
                                                            resetPasswordExpires:Date.now() + 5*60*1000},
                                                            {new:true}) 
        const url = `http://localhost:3000/update-password/${token}`


        await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`)

        return res.status(200).json({
            success:true,
            message:"Email sent successfully,Please check email and change pwd "
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went Wrong during generating the  resetPasswordToken : " + error
        })
    }
}

exports.resetPassword = async(req,res) => {
    try{

        const {password,confirmPassword,token} = req.body 

        if(!password || !confirmPassword){
            return res.status(403).json({
                success:false,
                message:"All fields Required"
            })
        }

        if(password !== confirmPassword) {
            return res.status(400).json({
                success:"Password and Confirm Password not match "
            })
        }

        const userDeatils = await User.findOne({token:token})

        if(!userDeatils){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }

        if(userDeatils.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success:false,
                message:"Token is expired,please regenerate token "
            })
        }

        const hashPassword = await bcrypt.hash(password,10) 

        await User.findOneAndUpdate({token:token},{password:hashPassword},{new:true})

        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong during reseting the password : "+error
        })
    }
}