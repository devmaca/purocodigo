var mongoose=require("mongoose");
var Schema=mongoose.Schema;

mongoose.connect("mongodb://192.168.237.145:27017/admin");
var posibles_valores=["M","F"];

var user_schema= new Schema({
	name:String,
	last_name:String,
	username:{type:String,required:true,maxlength:[15,"Username muy largo"]},
	password:{
		type:String,
		minlength:[8,'password muy corto'],
		validate:{
			validator: function(p){
				return this.password_confirmation==p;
			},
			message:"Las contrasenas no son iguales"
		}},
	age:{type:Number, min:[5,'la edad no puede ser menor que 5'],max:[100,"la edad no puede ser mayor a 100"]},
	email:{type: String,require: "El correo es obligatorio"},
	date_of_birth:Date,
	sex:{type:String,enum:{values:posibles_valores,message:"Opcion no valida"} }
});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c=password;
});

var User=mongoose.model("User",user_schema);

module.exports.User=User;