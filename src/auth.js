
const JWT=require("jsonwebtoken");
const User=require('./models/user')

const userAuth=async(req,res,next)=>{
    try {
        const {token}=req.cookies;

        if(!token)
        {
            throw new Error("invalid token");
        }

        //verify token

        const decoded= await JWT.verify(token,"DevDocker@123");
        const {_id}=decoded;

        const user= await User.findById(_id);

        if(!user)
        {
            throw new Error("User not valid");
        }
        req.user=user;
        next()
    } catch (error) {
        res.send("error: "+error.message)
    }

}

const validateEdit=(req)=>{

    try {
        const editInputFeild=["firstName","lastName","emailId","photoUrl","gender","age", "about","skills"]

        console.log(Object.keys(req.body))


        const validationFeild=Object.keys(req.body).every((feild)=>{
          return editInputFeild.includes(feild);
        })
      
        return validationFeild;

    } catch (error) {
        
    }
}





module.exports={
    userAuth,
    validateEdit
}