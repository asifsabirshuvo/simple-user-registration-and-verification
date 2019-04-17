		var express = require('express');
		var bodyParser = require('body-parser');
		var path = require('path');

		var crypto = require('crypto');	


		var mongojs =  require('mongojs')
		var db =  mongojs("mongodb://asifsabir4u:asif007@ds147797.mlab.com:47797/customerapp",['users']);
//		var db =  mongojs('customerapp',['users']);
		var ObjectId = mongojs.ObjectId; 

		


		var app = express();

		var nodemailer = require('nodemailer');

		// var transporter = nodemailer.createTransport({
		// 	service: 'mail.google.com',
		// 	auth: {
		// 		user: 'rmabd.official@gmail.com',
		// 		pass: 'you_know'
		// 	}
		// });


	    var transOptions = {
			host:  'in-v3.mailjet.com',
			port: 587,
			secure: false,
			ignoreTLS: true,
			auth: {
	 			   user: '311e2466974313680f865d15331bb0b8',
	 			   pass: '3d44aa618c4002916dfd07406708a58f'			}
		};
	
		var transporter = nodemailer.createTransport(transOptions);



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

		app.get('/all',function(req,res){
			db.users.find(function(err,docs){
				
				res.json(docs);

				})
		});




		app.post('/users/search',function(req,res){
			
			var search_name = req.body.search_first_name;
			res.redirect('/users/search/'+search_name);

		});

		//validating email address of the user

		app.get('/verify/:token',function(req,res){

			var token =  req.params.token;

			db.users.find({ token: token }).toArray(function(err, result) {
				console.log(result);
				if (err) throw err;

				if(result.length<1){
					res.render('error');
				}
				else{
					res.render('success');
					console.log(result[0]._id)

					 db.users.update({'_id':result[0]._id}, {$set:{'valid':'true'}});
					 	
					console.log(result[0])

				} //else closing


				});
			});


		
		//searching . . user..data...


		app.get('/users/search/:search_name',function(req,res){

			var user_name =  req.params.search_name.toLowerCase();
			db.users.find({ first_name: user_name }).toArray(function(err, result) {
				console.log(result);
				if (err) throw err;

				if(result.length<1){
					res.render('error');
				}
				else{
					res.render('search',{
						users: result
					});}

				});

		});





		app.post('/users/add',function(req,res){
	
			var token = crypto.randomBytes(64).toString('hex');
			var newUser = { 
				first_name:req.body.first_name.toLowerCase(),
				last_name:req.body.last_name,
				email:req.body.email,
				token:token,
				valid: false

			}


			db.users.insert(newUser,function(err,result){
				if(err){
					console.log(err);
				}
						


						//sending confirmation email
						var mailOptions = {
							from: 'asifsabir4u@gmail.com',
							to: req.body.email,
							subject: 'NodeJs Mailing sample',
							html: '<h1>Welcome </h1>'+ req.body.first_name +'<p>Click <a href="https://user-reg-sample.herokuapp.com/verify/' + token + '">here</a> to verify</p>'

						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});

					res.redirect('/');
					console.log(JSON.stringify(result));
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



		app.listen(process.env.PORT || 3000,function(){
			console.log('server running on port 3000...');
		});






