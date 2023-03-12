const config = require("../../config/auth.config");
const Investor = require("../../models/investor.model.js")


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup =  async(req, res) => {

    const saltRounds = 10;
    const investor = new Investor({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        contactNo: req.body.contactNo,
        countryCode: req.body.countryCode,
        panNo: req.body.panNo,
        aadharNo: req.body.aadharNo,
        address: req.body.address
    })

    investor.password = await bcrypt.genSalt(saltRounds)
    .then(salt => {
       return bcrypt.hash(investor.password, salt)
    }).catch(err => {return res.status(500).send(err.message)});


     
     const savedInvestor = await investor.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        else
        {   
            //res.send({ message: "User was registered successfully!" });
            res.status(200).send({ message: "Investor has been registered succesfully. Please go to Login page. "});
        }
    });


};

const signin = async (req, res) => {
    try {
        
        const investor = await Investor.findOne({
            userName: req.body.userName
        })

        if (!investor) {
            return res.status(404).send({ message: "Investor Not found." });
        }
        
        await bcrypt.compare(req.body.password, investor.password, function(err, res) {
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

        var token = jwt.sign({ id: investor._id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            user1 : {...investor},
            id: investor._id,
            role:investor.role,
            userName: investor.userName,
            email: investor.email,
            accessToken: token
        });

    } catch (err) {
        res.status(400).json({ err });
    }
}

const updateProfile = async(req, res) =>{
     try{
        const investor = await Investor.findOneAndUpdate({
            _id: req.params.id
        }, req.body)

        if(!investor){
            return res.status(404).send({ message: "Investor Not found." });
        }

        const savedInvestor = await investor.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            else
            {   
                res.status(200).send({ message:"Investor Profile has been updated successfully"});
            }
        })


     } catch(err){
         res.status(400).json({err})
     }
}
const getInvestorProfile = async (req, res) => {
    try{

       const investor =  await Investor.findOne({_id: req.params.id})

       if(!investor)
       {
            return res.status(404).send({ message: "Investor Not found." });
       }
       
       const {password, ...respInvestor} = investor._doc
       res.status(200).send(respInvestor);

    } catch(err){
        res.status(400).json({err})
    }
}
const investorcontrollers = {
    signup,
    signin,
    updateProfile,
    getInvestorProfile
}

module.exports = investorcontrollers;
