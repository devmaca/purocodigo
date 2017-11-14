var mongoose=require("mongoose");
var Schema=mongoose.Schema;


//creando esquema
var img_schema=new Schema({
	title:{type:String,required:true}

});

var Imagen=mongoose.model("Imagen",img_schema);

//exportar modulo
module.exports=Imagen;