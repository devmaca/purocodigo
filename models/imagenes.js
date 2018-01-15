var mongoose=require("mongoose");
var Schema=mongoose.Schema;


//creando esquema
var img_schema=new Schema({
	title:{type:String,required:true},
	creator:{type: Schema.Types.ObjectId, ref:"User"},
	extension:{type:String, require:true}
});

var Imagen=mongoose.model("Imagen",img_schema);

//exportar modulo
module.exports=Imagen;