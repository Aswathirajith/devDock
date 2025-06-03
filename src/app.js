const express=require('express');
const connectDB=require('./config/database')
const User=require('./models/user')
const validation=require('./utils/validation')
const app=express();
const bcrypt=require('bcrypt')
const JWT=require('jsonwebtoken');
const cookirParser=require('cookie-parser');

app.use(express.json());
app.use(cookirParser())


app.post('/signup',async(req,res)=>{

    try {

        //validation of data

        validation(req);

        //encript password
        const password=req.body.password;
        const paswwordHash=await bcrypt.hash(password,10);

  
         const user=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            emailId:req.body.emailId,
            password:paswwordHash
         })


        await user.save({

        });

        res.send("user detailed saved")
    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }

})

app.post('/login',async(req,res)=>{
  try {
    
    const {emailId,password}=req.body;

    const user=await User.findOne({emailId:emailId});

    if(!user)
    {
        throw new Error("Invalid credential")
    }

    const passwordConform=await bcrypt.compare(password,user.password);
    if(passwordConform)
    {

        //jwt

        const token= await JWT.sign({_id:user._id},"DevDocker@123")
        //cookie

        res.cookie('token',token);
        res.send("login successfull")
    }else{
         throw new Error("Invalid credential");
    }
  } catch (error) {
    res.send('error: '+error.message)
  }
})


app.get('/profile',async(req,res)=>{
    
   try {
    const {token}=req.cookies;

    if(!token)
    {
        throw new Error("invalid token");
    }
    
    //validate token

   const decoded=await JWT.verify(token,"DevDocker@123")
 
  const {_id}=decoded;

  const logedUser=await User.findById(_id)

  if(!logedUser)
  {
    throw new Error("user not found");
  }
  
   res.send(logedUser)

   } catch (error) {
    res.send("Error: "+error.message)
   }
   

})

app.get('/user', async(req,res)=>{
    const userEmail=req.body.emailId;
  
    try {
        const user=await User.find({emailId:userEmail});
        if(user.length==0)
        {
            res.send("no user");
        }else{
            res.send(user);
        }
    } catch (error) {
        res.send("something wrong");
    }
})


app.delete('/user',async(req,res)=>{
    const userId=req.body.userId

    try {
        const user=await User.findByIdAndDelete(userId)

        res.send("delete user")
        
    } catch (error) {
        res.send("something wrong")
    }
})

app.patch('/user/:userId',async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;

    
    try {

        const allowedFeild=["age","gender","lastName"];
        const isUpdatedAllowed=Object.keys(data).every((key)=>{
          return  allowedFeild.includes(key);
        })

        if(!isUpdatedAllowed)
        {
            throw new Error("update not allowed")
        }
        const user=await User.findByIdAndUpdate({_id:userId},data)
        res.send("updated")
        
    } catch (err) {
        res.send(err.message)
    }

})







connectDB().then(()=>{
    console.log('database connected succefully');
    app.listen(3000,()=>{
    console.log("server is running in port 3000");
})
}).catch((err)=>{
    console.error('database cannot connected');
})

