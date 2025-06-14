const validator=require('validator');

const validation=(req)=>{
    
    const{firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName)
    {
        throw new Error("name is not valid")
    }else if(!validator.isEmail(emailId))
    {
        throw new Error("email is not valid");
    }else if(!validator.isStrongPassword(password)){
       throw new Error("enter a strong password")
    }
}

module.exports=validation