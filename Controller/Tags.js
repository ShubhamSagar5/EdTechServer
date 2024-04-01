

const Tag = require("../Models/tags")


exports.createTag = async(req,res) => {
    try{

        const {name,description} = req.body 

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"All fields required"
            })
        }

        const tagDeatils = await Tag.create({name:name,description:description})

        return res.status(200).json({
            success:true,
            message:"Tags created successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating tag " + error.message
        })
    }
}


exports.showAllTags = async(req,res) => {
    try{

        const allTags = await Tag.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All tags retrun successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching tag " + error.message
        })
    }
}