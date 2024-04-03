const  mongoose = require("mongoose")
const Course = require("../Models/course")
const RatingAndReview = require("../Models/ratingAndReview")


exports.createRating = async(req,res) => {
    try{

        const userId = req.user.id 
        const {rating,review,courseId} = req.body 

        const courseDetails = await Course.findOne(
                                               {_id:courseId,
                                                studentEnrolled:{$eleMatch:{$eq:userId}}
                                            })
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        
        }

        const alreadyReview = await RatingAndReview.findOne({user:userId,course:courseId}) 

        if(alreadyReview){
            return res.status(403).json({
                success:false,
                message:"Course is already review by User"
            })
        }

        const ratingAndReview = await RatingAndReview.create({rating:rating,review:review,user:userId,course:courseId})


       const updatedCourseDeatils = await Course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReview:ratingAndReview._id}},{new:true})

        return res.status(200).json({
            success:false,
            message:"Rating And Review Created Successfully",
            data:ratingAndReview
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getAvgragerating = async(req,res) => {
    try{

        const courseId = req.body.courseId 

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating : {$avg:"$rating"}
                }
            }  
        ])

        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }

        return res.status(200).json({
            success:true,
            message:"Average is 0 , no rating given till now",
            averageRating:0
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }

}

exports.getAllRating = async(req,res) => {
    try{

        const allReviews = await RatingAndReview.find({})
                                                .sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                })
                                                .exec()

    return res.status(200).json({
        success:true,
        message:"All reiews fetched successfully"
    })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
}
}