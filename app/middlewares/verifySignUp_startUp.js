const mongoose = require("mongoose");
const Startup = require("../models/startup.model.js");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  var startUp = await Startup.findOne({
    userName: req.body.userName
  }).clone().catch(function(err){ return res.status(500).send({error: err})})

  if (startUp) {
    return res.status(400).send({ message: "Failed! Username is already in use!" });
  }
  // Email

  startUp = await Startup.findOne({
    email: req.body.email
  }).clone().catch(function(err){ return res.status(500).send({error: err})})


  if (startUp) {
    res.status(400).send({ message: "Failed! Email is already in use!" });
    return;
  }

  startUp = await Startup.findOne({
    registrationNo: req.body.registrationNo
  }).clone().catch(function(err){ return res.status(500).send({error: err})})


  if (startUp) {
    res.status(400).send({ message: "Failed! This registration number is already registered with NowAcquire" });
    return;
  }
  if(req.body.modeOfReach === 'now-acquire-agent'){
    if(!req.body.agentName){
      res.status(400).send({ message: "Failed! Please enter Now-Acquire-Agent Name"});
      return;
    }
  }
  next();
}

module.exports = checkDuplicateUsernameOrEmail;