const config = require("../../config/auth.config");
const StartUp = require("../../models/startup.model.js")
//const db = require("../models");

//const User = db.user;
//const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    const saltRounds = 10;
    const startUp = new StartUp({
        name: req.body.name,
        userName: req.body.userName,
        password: req.body.password,
        registrationNo: req.body.registrationNo,
        email: req.body.email,
        contactNo: req.body.contactNo,
        address: req.body.address,
        industry: req.body.industry,
        dateOfIncorp: req.body.dateOfIncorp,
    }) 

    startUp.password = await bcrypt.genSalt(saltRounds)
    .then(salt => {
       return bcrypt.hash(startUp.password, salt)
    }).catch(err => {return res.status(500).send(err.message)})


    const savedStartup = await startUp.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        else {
            res.status(200).send("Startup has been registered succesfully!!!");
        }
    });

};

const signin = async (req, res) => {
    try {
        
        const startUp = await StartUp.findOne({
            userName: req.body.userName
        })
    
        if (!startUp) {
            return res.status(404).send({ message: "User Not found." });
        }
      
        await bcrypt.compare(req.body.password, startUp.password, function(err, res) {
             if(err)
             {
                res.status(500).send({error : err.message})
             }

             if(!res)
             {  
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                })
             }
          })

       
        var token = jwt.sign({ id: startUp._id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
       
        res.status(200).send({
            user1 : {...startUp},            
            id: startUp._id,
            role: startUp.role,
            userName: startUp.userName,
            email: startUp.email,
            accessToken: token
        });

    } catch (err) {
        res.status(400).json( err.message);
    }
};

const updateProfile = async(req, res) =>{
    try{
        const startUp = await StartUp.findOneAndUpdate({
            _id: req.params.id
        }, req.body)

        if(!startUp){
            return res.status(404).send({ message: "StartUp Not found." });
        }

        const savedStartUp = await startUp.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            else
            {   
                res.status(200).send("Profile has been updated");
            }
        })

    } catch(err){
        res.status(400).json({err})
    }
}

const getStartUpProfile = async(req, res) => {
    try{

        const startUp =  await StartUp.findOne({_id: req.params.id})
 
        if(!startUp)
        {
             return res.status(404).send({ message: "StartUp Not found." });
        }
        
        const {password, ...respStartUp} = startUp._doc
        res.status(200).send(respStartUp);
 
     } catch(err){
         res.status(400).json({err})
     }       
}

const getAllStartUpInfos = async(req, res) =>{
    try{
        const startUps = await StartUp.find();

        if(!startUps)
        {
            return res.status(404).send({ message: "StartUps Not found." });
        }

        const respStartUps =  [];

        startUps.forEach(startUp => {
            const {password, ...respStartUp} = startUp._doc
            respStartUps.push(respStartUp)
        })

        res.status(200).send(respStartUps);
    } catch(err){
        res.status(400).json({err})
    }
}

const startUpcontrollers = {
    signup,
    signin,
    updateProfile,
    getStartUpProfile,
    getAllStartUpInfos
}

module.exports = startUpcontrollers;