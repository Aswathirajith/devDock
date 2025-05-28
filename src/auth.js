const adminAuth=(req,res,next)=>{
    console.log('admin auth called')
    const token='xyz';
    const autherized=token==='xyz';
    if(!autherized)
    {
        res.send('not autherized');
    }else{
        next();
    }
}

const userAuth=(req,res,next)=>{
    console.log('user auth called')
    const token='xyz';
    const autherized=token==='xyz';
    if(!autherized)
    {
        res.send('not autherized');
    }else{
        next();
    }
}

module.exports={
    adminAuth,
    userAuth
}