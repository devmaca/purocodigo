var User=require('../models/user').User;

module.exports = function(req,res,next){
	if(!req.session.user_id){
		res.redirect("/login")
	}
	else{
		User.findById(req.session.user_id,function (err,user) {
			if(err){
				console.log(err);
				res.redirect("/login");
			}
			else{
				console.log("usuario inicio sesion...");
				console.log(user);
				res.locals={user1: user};
				next();
			}
		});
		 
	}
}