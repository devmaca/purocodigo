var express=require('express');
var bodyParser=require('body-parser');
var User=require('./models/user').User;
var session=require('express-session');
var router_app=require("./routes_app");
var session_middleware=require('./middlewares/sessions')
var formidable=require('express-form-data');
var methodOverride=require("method-override");

var app=express();
var http = require('http').createServer(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,
    publicDir = `${__dirname}/public`

//servir archivos estaticos
app.use("/public",express.static('public'));
//console.log(app);

app.use(methodOverride("_method"))
//esto para leer parametros
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
	secret:"123byuhbsdash12ub",
	resave: false,
	saveUninitialized: false
}));

//app.use(formidable({encoding:'utf8', uploadDir:'./images', multiples:true}));
app.use(formidable.parse({ keepExtensions:true}));

app.set('view engine', 'jade')
// 
//inicio del codigo streaming

http.listen(port,() => {
	console.log('Iniciando express y socket.io en localhost:%d', port)
})


app.get('/receptor', function(req,res){
	res.sendFile(`${publicDir}/client.html`);
})
app.get('/transmitir', function(req,res){
	res.sendFile(`${publicDir}/server.html`);
})

io.on('connection', (socket) => {
    socket.on('streaming',(image) =>{
        io.emit('play stream', image)
        //console.log(image)
    })

})
//fin del codigo del streming

app.get('/', function (req,res) {
	//console.log(req.session.user_id);
	res.render('index');
});
//ruta para el registro del login
app.get('/signup', function (req,res) {
	console.log("los datos guardados son : ")
	User.find(function(err,doc) {
		console.log(doc);
	});
	res.render('signup');

});

app.get('/login', function (req,res) {
	
	res.render('login');

});
app.post("/users", function(req,res){
	var user =new User({email: req.body.email, 
						password:req.body.password, 
						password_confirmation: req.body.password_confirmation,
						username:req.body.username});
	console.log("password de confirmacion es : "+user.password_confirmation)
	console.log("contrasena "+ req.body.password); 
	console.log("email "+ req.body.email);

	//usando el el metodo promises en lugar de callback
	//usando el metod then
	user.save().then(function(us){
		res.send("Guardamos tus datos exitosamente!");
	},function(err) {
		if(err){
		console.log(String(err));
		res.send("No pudimos guardadr tus datos");
		}
	})
	//res.send("recibimos tus datos")
});

app.post("/sessions", function(req,res){

	User.findOne({email:req.body.email,password:req.body.password},"",function (err,user) {
		
		req.session.user_id=user.id;
		res.redirect("/app");
	})		
	
	//res.send("recibimos tus datos")
});


app.use("/app",session_middleware);
app.use('/app',router_app);



//app.listen(3000,'localhost');
console.log('servidor en linea...');
