
const  mongoose  = require("mongoose")
const User = require("../Models/User")
const Course = require("../Models/course") 
const mailSender = require("../Utilis/mailSender")
const { instance } = require("../Config/Razorpay")
const {courseTemplate } = "" 

const crypto = require('crypto')

exports.capturePayment = async(req,res) => {

    try{

        const {course_id} = req.body 
        const userId = req.user.id 

        if(!course_id){
            return res.status(401).json({
                success:false,
                message:"Please provide valid course id"
            })
        }

        let course
        try{

            course = await Course.findById(course_id) 
            if(!course){
                return res.status(401).json({
                    success:false,
                    message:"Could not find the course"
                })
            }

            const uid = new mongoose.Types.ObjectId(userId)
            if(course.studentEnrolled.includes(uid)){
                return res.status(401).json({
                    success:false,
                    message:"Student is enrolled already"
                })
            }

        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }

        const amount = course.price 
        const currency = "INR" 

        const option = {
            amount : amount * 100,
            currency,
            recipet: Math.random(Date.now()).toString(), 
            notes:{
                courseId : course_id, 
                userId
            }

        }

        try{

            const paymentResponse = await instance.orders.create(option)

            return res.status(200).json({
                succcess:true,
                message:"Order created successfully",
                courseName:course.courseName,
                courseDescripion:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount
            })

        }catch(error){
            return res.status(500).json({
                success:false,
                message:"Could not initiate order"
            })
        }


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something error occur during capturing the payment : "+error.message
        })
    }
}

exports.verifySignature = async(req,res) => {
    try{

        const webhookSecret = "12345678"

        const signature = req.headers["x-razoray-signature"] 

        const shasum = crypto.createHmac("sha256",webhookSecret) 
        shasum.update(JSON.stringify(req.body)) 
        const digest = shasum.digest("hex")

        if(signature === digest){
            console.log("Payment is Authorized")
            
            const {courseId, userId} = req.body.payload.payment.entity.notes 
            
            try{

                const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},{$push:{studentEnrolled:userId}},{new:true})

                if(!enrolledCourse){
                    return res.status(401).json({
                        success:false,
                        message:"Course not found"
                    })
                }

                console.log(enrolledCourse)

                const enrolledStudent = await User.findOneAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true}) 

                console.log(enrolledStudent) 

                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulation",
                    "Congratulation,you are onboarded into new codehelp course",
                    
                )

                console.log(emailResponse)

                return res.status(200).json({
                    success:true,
                    message:"Signature is verified and course added"
                })

            }catch(error){
                return res.status(500).json({
                    success:false,
                    message:error.message
                })
            }
            
        
        }else{
            return res.status(401).json({
                success:false,
                message:"Signature not match and verified"
            })
        }


    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}