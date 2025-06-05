const express=require('express');
const connectDB=require('./config/database')
const app=express();
const cookirParser=require('cookie-parser');
const authRouter=require('../src/routes/auth');
const profileRouter=require('../src/routes/profile')
const userRouter=require('../src/routes/user')



app.use(express.json());
app.use(cookirParser())

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',userRouter);


connectDB().then(()=>{
    console.log('database connected succefully');
    app.listen(3000,()=>{
    console.log("server is running in port 3000");
})
}).catch((err)=>{
    console.error('database cannot connected');
})

