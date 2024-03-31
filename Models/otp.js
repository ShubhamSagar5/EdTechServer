const mongoose = require('mongoose')
const mailSender = require('../Utilis/mailSender')

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})

const sendVerificationOnEmail = async(email,otp) => {
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",otp)
        console.log("Email sent Successfully: " , mailResponse)
    }catch(error){
        console.log("Error occured while sending mails: ", error)
        throw error
    }
}


otpSchema.pre('save',async function(next) {
    await sendVerificationOnEmail(this.email,this.otp)
    next()
})

module.exports = mongoose.model("OTP",otpSchema)