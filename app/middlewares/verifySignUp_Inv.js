const mongoose = require("mongoose");
const Investor = require("../models/investor.model.js");



const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // Username
  
    const investor = await Investor.findOne({
        userName: req.body.userName
    }).clone().catch(function(err){ return res.status(500).send({error: err})})

   
    if (investor) {
         console.log(investor);
        return res.status(400).send({ message: "Failed! Username is already in use!" });

    }

    // Email

    const investor1 = await Investor.findOne({
        email: req.body.email
    }).clone().catch(function(err){ return res.status(500).send({error: err})})

   
    if (investor1) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
    }

    next();
};


module.exports = checkDuplicateUsernameOrEmail;