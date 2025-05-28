const express=require('express');
const connectDB=require('./config/database')
const User=require('./models/user')
const app=express();


app.post('/signup',async(req,res)=>{

    const user=new User({
        firstName:'Aswathi',
        lastName:'Rajith',
        emailId:'aswathi@gmail.com',
        age:32
    })

    try {
        await user.save();
        res.send("user detailed saved")
    } catch (error) {
        res.status(400).send("something wrong"+error.message)
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

