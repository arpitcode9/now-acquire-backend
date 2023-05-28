const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const StartUpSchema = new Schema({
    role:{type:String , default:"startup"},
    name: String,
    userName: { type: String, unique: true, required: true },
    password: { type: String },
    promoterList: [
        {
            name: String,
            ContactNo: Number,
        }
    ],
    registrationNo: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    modeOfReach: { type: String, required: true, unique: true },
    agentName: { type: String, required: true, unique: true },
    videoLink: { type: String },
    contactNo: { type: Number, required: true },
    address: String,
    industry: String,
    dateOfIncorp: Date,

    financials: {
        companyValuation: Number,
        promoterStake: Number,
        angelStake: Number,
        institutionalStake: Number,
        equityOnNA: Number,
        equitySoldOnNA: Number,
        equityAvailableOnNA: Number
    }
})

const StartUp = mongoose.model("StartupModel", StartUpSchema);
module.exports = StartUp;

