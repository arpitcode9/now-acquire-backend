const Investor = require("../models/investor.model");
const Startup = require("../models/startup.model")
const transaction = async(req,res) =>{ 
    try {
        let investor = await Investor.findOne({userName: req.body.userName})
        if (!investor) {
            return res.status(404).send({ message: "Transaction Failed." });
        }
        const index = investor.financials.investments.companies.findIndex(item => item.name === req.body.company)
        if(index === -1){
            investor.financials.investments.companies.push({
                "name" : req.body.company,
                "transactions" : []
            })
        }
        investor.financials.investments.companies = investor.financials.investments.companies.map( companyItem => {
            if(companyItem.name === req.body.company){
                companyItem.transactions.push({
                    "amount" : req.body.amount,
                    "equityPerc" : req.body.percentage,
                    "buy": req.body.transactionType === "BUY",
                    "sell": req.body.transactionType === "SELL",
                    "date": Date()
                })
            }
            var totalPortfolio = companyItem.transactions.map( transaction => transaction.buy ? transaction.amount : -transaction.amount).reduce((accum,item) => accum + item)
            var totalPercentage = companyItem.transactions.map ( transaction => transaction.buy ? transaction.equityPerc : - transaction.equityPerc).reduce( (accum,item) => accum + item)
            companyItem["currMarketValue"] = totalPortfolio
            companyItem["equityOwned"]=totalPercentage
            return companyItem
        })
        const statusResult = await Investor.replaceOne({userName:req.body.userName},investor);
        let startup = await  Startup.findOne({userName : req.body.company})
        if(!startup){
            return res.status(400).send({message : "Company Not Available"})
        }
        startup.financials.equityAvailableOnNA -= req.body.transactionType === "BUY" ? req.body.percentage : -req.body.percentage
        startup.financials.equitySoldOnNA -= req.body.transactionType === "BUY" ? -req.body.percentage : +req.body.percentage
        await Startup.replaceOne({userName:req.body.company},startup);
        res.status(200).json(statusResult)

    } catch (err) {
        res.status(400).json({ err });
    }
};
const transactionControllers = {
    transaction
}

module.exports = transactionControllers;