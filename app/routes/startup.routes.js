const  verifySignUp  = require("../middlewares/verifySignUp_startUp.js");
const startUpcontrollers = require("../controllers/auth/startup.js");


module.exports = function(app)
{
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    
      app.post("/startup/signup",
      
        verifySignUp
      ,
      startUpcontrollers.signup
      );

      app.post("/startup/signin", startUpcontrollers.signin);

      app.post("/startup/updateProfile/:id", startUpcontrollers.updateProfile);

      app.get("/startup/getProfile/:id", startUpcontrollers.getStartUpProfile);

      app.get("/startup/getAll", startUpcontrollers.getAllStartUpInfos);
}