
const User = require("../Models/User")
const Profile = require("../Models/profile") 

exports.updateProfile = async(req,res) => {
    try{

        const {dateOfBirth="" ,about="",gender,contactNo} = req.body

        const userId = req.user.id 

        if(!gender || !contactNo || !userId){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        const userDetails = await User.findById(userId) 
        const profileId = await userDetails.additionalDetails 

        const profileDeatils = await Profile.findById(profileId)

        profileDeatils.dateOfBirth = dateOfBirth,
        profileDeatils.gender = gender,
        profileDeatils.about = about,
        profileDeatils.contactNo = contactNo 

        await profileDeatils.save() 

        return res.status(200).json({
            succcess:true,
            message:"Profile updated successfully"
        })

        

    }catch(error){
        return rs.status(500).json({
            success:false,
            message:"Unable to update profile :" + error.message
        })
}
}

exports.deleteAccount = async(req,res) => {
    try{

        const userId = req.user.id 

        const userDeatils = await User.findById(userId)

        if(!userDeatils){
            return res.status(401).json({
                success:false,
                message:"User Not Found "
            })
        }

        await Profile.findByIdAndDelete({_id:userDeatils.additionalDetails})
///dleedte user student enrolled
        await User.findByIdAndDelete({_id:userId})

        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:""+error.message
        })
    }
}