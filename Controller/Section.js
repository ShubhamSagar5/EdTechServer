

const Course = require("../Models/course")
const Section = require("../Models/section")

exports.createSection = async(req,res) => {
    try{

        const {sectionName,courseId} = req.body 

        if(!sectionName,!courseId) {
            return res.status(400).json({
                success:false,
                message:"Misssing Properties"
            })
        }

        const newSection = await Section.create({sectionName})

        const updateCourseDetails = await Course.findByIdAndUpdate({courseId},
                                                                    {$push:
                                                                        {courseContent:newSection._id}
                                                                    },
                                                                    {new:true}).populate("courseContent").exec()

        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            data:updateCourseDetails
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to Create Section Please Try Again",
            error:error.message
        })
    }
}

exports.updateSection = async(req,res) => {
    try{
        const {sectionName,sectionId} = req.body 

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:" Missing Properties"
            })
        }

        const updateSection = await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true})

        return res.status(200).json({
            success:true,
            message:"Section Update Successfully "
        })

    }catch(error){
        return res.status(500).json({
             success:false,
             message:"Unable To Update Section",
             error:error.message
        })
       
    }
}

exports.deleteSection = async(req,res) => {
    try{

        const {sectionId} = req.params 

        await Section.findByIdAndDelete(sectionId)

        return res.status(200).json({
            success:true,
            message:"Delete Section Successfully",
            error:error.message
        })

    }catch(error){
       return res.status(500).json({
        success:false,
        message:"unable to delete section "
       })
        
    }
}