const mongoose = require('mongoose');
const StartUp = require('./startup.model');


const Schema = mongoose.Schema;

const  InvestorSchema = new Schema({
    role:{type:String , default:"investor"},
    firstName: {type:String, required: true},
    lastName:  {type: String, required: true},
    userName:  {type: String, required: true, unique: true}, 
    password:  {type: String, required: true},
    email: {
        type: String,
        match: /.+\@.+\..+/,
        required: true,
        unique: true
    },
    contactNo: {type: Number, required: true}, 
    countryCode: Number,
    panNo: String,
    aadharNo: Number,
    address: String, 
    financials:{
        currentPortfolioValue : Number,
        investments:{
           companies: [
                {
                    name: String,
                    uniqueId: mongoose.Schema.Types.ObjectId,
                    equityOwned : Number,
                    currMarketValue: Number,
                    transactions: [
                        {
                            buy: {type : Boolean, default : false},
                            sell:{type: Boolean, default : false},
                            date : Date,
                            amount: Number,
                            equityPerc: Number
                        }
                    ]
                }
            ]
        },
        graphdatapoints: []
        
    }
});

const Investor = mongoose.model("InvestorModel", InvestorSchema);
module.exports = Investor