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
    },
    about:{
        type:String,
        default:"this is a default about"

    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
    }
},{
    timestamps:true
})

userSchema.index({firstName:1,lastName:1});

const User=mongoose.model('User',userSchema);

module.exports=User;