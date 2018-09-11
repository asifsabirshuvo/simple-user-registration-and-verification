var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var mongojs =  require('mongojs')
var db =  mongojs('customerapp',['users']);
var ObjectId = mongojs.ObjectId;
var app = express();


//View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static path
app.use(express.static(path.join(__dirname,'public')));



app.get('/',function(req,res){
	db.users.find(function(err,docs){
		res.render('index',{
			title: 'customers',
			users: docs
		});
	})


});




app.post('/users/search',function(req,res){
	
	var search_name = req.body.search_first_name;
	res.redirect('/users/search/'+search_name);

});


app.get('/users/search/:search_name',function(req,res){

	var user_name =  req.params.search_name.toLowerCase();

	db.users.find({ first_name: user_name }).toArray(function(err, result) {
		console.log(result);
    		if (err) throw err;
		res.render('search',{
			users: result
		});
    // console.log(result);
    // db.close();
  
  });



	// db.users.find({ first_name: user_name } ,function(err,docs){
	// 	res.render('search',{
	// 		users: docs
	// 	});
	// });

});





app.post('/users/add',function(req,res){
	var newUser = { 
		first_name:req.body.first_name.toLowerCase(),
		last_name:req.body.last_name,
		email:req.body.email
	}

		db.users.insert(newUser,function(err,result){
				if(err){
					console.log(err);
				}
				res.redirect('/');
				console.log(result);
			
		});
})

app.delete('/users/delete/:id',function(req,res){
db.users.remove({_id: ObjectId(req.params.id)},function(err,result){
	if(err){
		console.log(err);
	}
	res.redirect('/');
})
});

app.listen(3000,function(){
	console.log('server running on port 3000...');
});