const mongoose=require('mongoose');

const connectDB=async ()=>  {
    await mongoose.connect("mongodb+srv://aswathirajith02:Nqm5gsbWf77Oh47g@cluster0.aorgg5l.mongodb.net/devDock")
}

module.exports=connectDB;


