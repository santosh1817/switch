const express=require('express')
const router=express.Router()
const {User}=require('../models/User')
const { authenticateUser}=require('../middleware/authentication')
const _=require('lodash')

router.post('/register',(req,res)=>{
    const body=req.body
   
    const user =new User(body)
    console.log(body)
    user.save()
    .then(user=>res.send(user))
    .catch(err=>res.send(err))
})
router.post('/login',(req,res)=>{
    const body=req.body
    User.findByCredentials(body.email,body.password)
    
        .then((user)=>{
            return user.generateToken()
        })
        .then((token)=>{

            console.log(token)
            res.send({token})
        })
        .catch((err)=>{
            res.send(err)
        })    
})

router.get('/account',(req,res)=>{
    const {user}=req
  
    console.log('in account')
    //res.send(JSON.stringify({ message: 'Every message requires an author' }));
    res.send(user)
})

router.delete('/logout', authenticateUser,function(req,res){
    const {user,token}=req
    
  
    
    User.findByIdAndUpdate(user._id,{$pull:{tokens:{token:token}}})
    .then(function(user){
        res.send({notice:'successfully logout...'})
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/allUsers', authenticateUser,async function(req,res){
    
   
    let users =await User.find()
    
    return res.send(users)

})

router.get('/loggedinuser', authenticateUser,async function(req,res){

    const {user,token}=req
    //console.log(token)

    try{
    let users=await User.find()

    users.forEach((user)=>{
        
        user.tokens.forEach((token)=>{
            //console.log(token.token)
            if(token.token===req.token){
                return res.send(user)
            }
        })
        
    })
    }catch(e){
        return res.send(e,{msg:'error'})
    }

})

// router.get('/allUsers',authenticateUser,async function(req,res){
    
//     let users=[]
//     let allUsers =await User.find()
//     return res.send(allUsers)

// })

module.exports={
    usersRouter:router
}
