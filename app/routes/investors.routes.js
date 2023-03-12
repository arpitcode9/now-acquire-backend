const  verifySignUp = require("../middlewares/verifySignUp_Inv.js");
const investorcontrollers = require("../controllers/auth/investor.js");
const transactionControllers = require("../controllers/transaction.js")
module.exports = function(app)
{
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    
    app.post("/investor/signup",
      [
        verifySignUp
    ],
      investorcontrollers.signup
      );

      app.post("/investor/transaction", transactionControllers.transaction)
      app.post("/investor/signin", investorcontrollers.signin);

      app.post("/investor/updateProfile/:id", investorcontrollers.updateProfile);

      app.get("/investor/getProfile/:id", investorcontrollers.getInvestorProfile);

}