

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

exports.categoryPageDetails = async(req,res) => {
    try{

        const {categoryId} = req.body 

        const selectedCategory = await Category.findById(categoryId)
                                                        .populate("course")
                                                        .exec()

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not foud"
            })
        }

        const differentCategries = await Category.find({_id:{$ne:categoryId}}).populate("course").exec()

        return res.status(200).json({
            success:true,
            message:"Data fetched successfully",
            data:{
                selectedCategory,
                differentCategries
            }
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}