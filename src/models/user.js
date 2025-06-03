const validator=require('validator');
const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:30
    },
    lastName:{
      type:String,
      minLength:4,
      maxLength:30

    },
    emailId:{
       type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
              throw new Error("invalid emailid"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:4,
        maxLength:130,
        validate(value){
            if(!validator.isStrongPassword(value))
            {
                throw new Error("your password is not strong enough"+value)
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String
    }
},{
    timestamps:true
})


const User=mongoose.model('User',userSchema);

module.exports=User;