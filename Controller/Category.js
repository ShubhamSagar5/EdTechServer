

const Category = require("../Models/category")


exports.createCategory = async(req,res) => {
    try{

        const {name,description} = req.body 

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"All fields required"
            })
        }

        const categoryDeatils = await Category.create({name:name,description:description})

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating Category " + error.message
        })
    }
}


exports.showAllCategory = async(req,res) => {
    try{

        const allCategory = await Category.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All Category retrun successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching Category " + error.message
        })
    }
}