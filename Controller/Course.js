const User = require("../Models/User")
const Course = require("../Models/course")
const Category = require("../Models/category")
const {uploadImageToCloudinary} = require("../Utilis/imageUploder")
require('dotenv').config()

exports.createCourse = async(req,res) => {

    try{

        const {courseName,courseDescription,whatYouWillLearn,price,category} = req.body 

        const thumbnail = req.files.thumbnailImage

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category){
            return res.status(401).json({
                success:false,
                message:"All Fields Required"
            })
        }

        const userId = req.user.id 
        const instructorDeatils  = await User.findById(userId)

        console.log(instructorDeatils) 

        if(!instructorDeatils){
            return res.status(404).json({
                success:false,
                message:"Instructor Deatils Not Found "
            })
        }

        const categoryDeatils = await Category.findById(category) 
        if(!categoryDeatils){
            return res.status(404).json({
                success:false,
                message:"Category Deatils Not Found "
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
 
        const newCourse = await Course.create({
            courseName:courseName,
            courseDescription:courseDescription,
            instructor:instructorDeatils._id,
            whatYouWillLearn:whatYouWillLearn,
            price:price,
            category:categoryDeatils._id,
            thumbnail:thumbnailImage.secure_url
        })

        await User.findByIdAndUpdate({id:instructorDeatils._id},{$push:{courses:newCourse._id}},{new:true})
        //HOMEWORK
        await Category.findByIdAndUpdate({id:categoryDeatils._id},{$push:{course:newCourse._id}},{new:true})

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something error occur during creating new course "+error.message
        })
    }

}

exports.showAllCourse = async(req,res) => {

    try{

        const allCourses = await Course.find({},{
                                            courseName:true,
                                            price:true,
                                            thumbnail:true,
                                            instructor:true,
                                            ratingAndReview:true,
                                            studentEnrolled:true,})
                                            .populate("instructor").exec()

            return res.status(200).json({
                success:true,
                message:"Data for all courses fetched successfully",
                data:allCourses
            })


    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Cannot Fetch Course Data "+error.message
        })
    }
}