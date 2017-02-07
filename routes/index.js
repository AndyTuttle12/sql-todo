var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');
var connection = mysql.createConnection({
 host     : config.host,
 user     : config.username,
 password : config.password,
 database : config.database
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	var taskArray = [];
	var selectQuery = "SELECT * FROM tasks";
	var msg = req.query.msg;
	if(msg === 'updated'){
		msg = "Updated task!";
	}else if(msg === 'added'){
		msg = "Added task!";
	}else if(msg === 'deleted'){
		msg = "Deleted task!";
	}
	// res.send(msg);
	connection.query(selectQuery, (error, results, fields)=> {
		// res.json(results);
		res.render('index', { title: 'To Do App', taskArray: results, msg: msg });
	});
});

router.post('/addNew', (req, res, next)=>{
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var queryString = "INSERT INTO tasks (task_name, task_date) VALUES ('"+newTask+"','"+taskDate+"')";
	connection.query(queryString, (error, results, fields)=> {
		if (error) throw error;
		res.redirect('/?msg=added');
	});
});

router.get('/edit/:id', (req, res, next)=>{
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(selectQuery);
	connection.query(selectQuery, (error, results, fields)=>{
		// res.json(results);
		var days = results[0].task_date.getDate();
		if(days < 10){
			days = "0"+days;
		}
		var months = results[0].task_date.getMonth() + 1;
		if(months < 10){
			months = "0"+months;
		}		
		var years = results[0].task_date.getFullYear();
		var mysqlDate = years + '-' + months + '-' + days;
		results[0].task_date = mysqlDate;

		res.render('edit', { task: results[0] });
	});
});

router.post('/edit/:id', (req, res, next)=>{
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var taskId = req.params.id;
	var updateQuery = "UPDATE tasks SET task_name='" + newTask + "', task_date='"+taskDate+"' WHERE id = "+taskId;
	// res.send(req.params.id);
	connection.query(updateQuery, (error, results, fields)=>{
		if (error) throw error;
		res.redirect('/?msg=updated');
	});
});

router.get('/confirm-delete/:id', (req, res, next)=>{
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(selectQuery);
	connection.query(selectQuery, (error, results, fields)=>{
		// res.json(results);
		var days = results[0].task_date.getDate();
		if(days < 10){
			days = "0"+days;
		}
		var months = results[0].task_date.getMonth() + 1;
		if(months < 10){
			months = "0"+months;
		}		
		var years = results[0].task_date.getFullYear();
		var mysqlDate = years + '-' + months + '-' + days;
		results[0].task_date = mysqlDate;

		res.render('confirm-delete', { task: results[0] });
	});
	// res.send(req.params.id);
});

router.post('/delete/:id', (req, res, next)=>{
	var deleteQuery = "DELETE FROM tasks WHERE id ="+req.params.id;
	connection.query(deleteQuery, (error, results, fields)=>{
		if (error) throw error;
		res.redirect('/?msg=deleted');
	});
	// res.send(req.params.id);
});

module.exports = router;
