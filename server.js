const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const server = express();
const router = express.Router();
const utils = require('./utils');
const questions = require('./config/question.js');
const result = require('./output_data/result');
const _ = require('lodash');

console.log(questions);

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.get('/users', (req, res, next) => {
	// utils.readDirectory().then(function (data) {
	// 	return res.send(data);
	// });
	console.log('Working');
});

router.get('/users/:userId', (req, res, next) => {
	utils.readFile(req.params.metamodel).then(function (data) {
		return res.send({metadata:req.params.metamodel,data:data});
	});
});

router.post('/users/:userId', (req, res, next) => {
	if(req.headers['content-type'] && req.headers['content-type'] === 'application/json'){
		utils.saveFile(req.params.metamodel, req.body).then(function (data) {
		return res.send({metadata:req.params.metamodel,data:data});
	});
	}else{
		return res.send('please send application/json content with correct request headers.');
	}
	
});

router.delete('/test', (req, res, next) => {
	console.log('delete called');
	res.json({message: 'hi test'});
});

router.post('/authenticate', (req, res, next) => {	
	utils.readFile('./config/users.json').then(function (response) {
		var data = JSON.parse(response) || [];
		var authenticate = false;
		var users = data.users;
		var user;
		for(i=0; i<users.length; i++){
			if(users[i].userName === req.body.username && users[i].password === req.body.password){
				authenticate = true;
				user = users[i];
			}
		}
		if(authenticate)
			return res.send({message:'Successfull',user})
		else{
			return res.send({message:'Failed'})
		}
		// return res.send({metadata:req.params.metamodel,data:data});
	});
	
});

router.get('/questions', (req, res, next) => {
	console.log('questions',questions);	
	return res.send(questions);
		// return res.send({metadata:req.params.metamodel,data:data});
	});

router.put('/questions',(req,res,next) => {
	var questionData = req.body.content;
	var marks = 0;
	questionData.forEach(questionItem => {
		if(questionItem.userans === questionItem.ans){
			marks++;
		}
	});
	utils.readFile('./output_data/result.json').then(function (response) {
		var userData = JSON.parse(response);
		console.log(userData);
		userData.results.push({ name: req.body.user, result: marks*10});
		console.log(userData);
		utils.saveFile('result.json',userData);
	});

	return res.send({messsage:"Answer Submitted Successfully",result:marks*10});
});

router.get('/usersresult', (req, res, next) => {
	utils.readFile('./output_data/result.json').then(function (response) {
		var userData = JSON.parse(response);
		return res.send(userData);
	});	
	
		// return res.send({metadata:req.params.metamodel,data:data});
	});


server.use(router);
server.use(express.static('./test-app/dist/test-app'));

server.listen(config.port, function () {
	console.log('test application is running on PORT: ' + config.port);
});

