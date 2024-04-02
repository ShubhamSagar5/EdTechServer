
const Section = require("../Models/section")
const Subsection = require("../Models/subSection")
const { uploadImageToCloudinary } = require("../Utilis/imageUploder")

require('dotenv').config() 

exports.createSubsection = async(req,res) => {

    try{

        const {sectionId,title,timeDuration,description} = req.body 

        const video = req.files.videoFile 

        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        const uploadVideoDeatils = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        const subSectionDetails = await Subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadVideoDeatils.secure_url
        }) 

        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                            {$push:{subSection:subSectionDetails._id}},
                                                            {new:true}).populate("subSection").exec()

        return res.status(200).json({
            success:true,
            message:"SubSection Created Successfully",
            data:updateSection
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to Create SubSection :"+error.message
        })
    }
}

exports.updateSubSection = async(req,res) => {
    try{

        const {subSectionId,title,timeDuration,description} = req.body 
        const video = req.files.videoFile 

        if(!subSectionId || !title || !timeDuration || !description){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        const uploadVideoFile = await uploadImageToCloudinary(video,process.env,FOLDER_NAME)

        const updateSubSectionDetails = await Subsection.findByIdAndUpdate(subSectionId,
                                                                            {title:title,
                                                                            timeDuration:timeDuration,
                                                                        description:description,
                                                                    videoUrl:uploadVideoFile.secure_url},
                                                                    {new:true})
            return res.status(200).json({
                success:true,
                message:"SubSection Update Successfully",
                data:updateSubSectionDetails
            })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update the Subsection" + error.message
        })
    }
}


exports.deleteSubSection = async(req,res) => {
    try{


        const {subSectionId}  = req.params

        if(!subSectionId){
            return res.status(401).json({
                success:false,
                message:"SubSection Id Missing"
            })
        }

        const deleteSubSection = await Subsection.findByIdAndDelete(subSectionId) 

        return res.status(200).json({
            success:true,
            message:"SubScetion Delete Successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete subsection :"+error.message
        })
    }
}