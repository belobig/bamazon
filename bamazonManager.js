const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
require("dotenv").config();

// Connection information to my database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: process.env.PASSWORD,
	database: "bamazon"
});

connection.connect(function (err) {
	if (err) throw err;
	optionsList();
});

function optionsList() {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product",
				"Exit"
			]
		})
		.then(function (answer) {
			switch (answer.action) {
				case "View Products for Sale":
					viewProducts();
					break;

				case "View Low Inventory":
					viewLowInv();
					break;

				case "Add to Inventory":
					addInv();
					break;

				case "Add New Product":
					addNewProd();
					break;

				case "Exit":
					connection.end();
					break;
			}
		});
}


function viewProducts() {
	var query = "SELECT * FROM products ORDER BY products.department_name";
	var table = [];
	connection.query(query, function (err, res) {
		if (err) throw err;
		for (let i = 0; i < res.length; i++) {
			table.push(
				[res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				"$" + res[i].price,
				res[i].stock_quantity]
			);
		}
		console.table(['ID', 'Product', 'Department', 'Price', 'In Stock'], table);
		setTimeout(optionsList, 3000);
	});

}


function viewLowInv() {
	var query = "SELECT * FROM products WHERE stock_quantity < 5 ORDER BY products.department_name";
	var table = [];
	connection.query(query, function (err, res) {
		if (err) throw err;
		if (res.length === 0) {
			console.log(chalk.blue("\nLook like you're all stocked up."));
		}
		for (let i = 0; i < res.length; i++) {
			table.push(
				[res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				"$" + res[i].price,
				res[i].stock_quantity]
			);
		}
		console.table(['ID', 'Product', 'Department', 'Price', 'In Stock'], table);
		setTimeout(optionsList, 3000);
	});
}


function addInv() {
	inquirer
		.prompt([
			{
				name: "pickItem",
				type: "input",
				message: "Which item would you like to restock? ",
				validate: function (value) {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				}
			},
			{
				name: "pickQuantity",
				type: "input",
				message: "How many would you like to add? ",
				validate: function (value) {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				}
			}
		]).then(function (answer) {
			var query = "SELECT * FROM products WHERE item_id = ?";
			connection.query(query, [answer.pickItem], function (err, res) {
				if (err) throw err;

				console.log("Restocking...");

				query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
				connection.query(query, [answer.pickQuantity, answer.pickItem], function (err, res) {
					if (err) throw err;
					console.log(chalk.black.bgWhite.bold("\n*****************************\nAdded " + answer.pickQuantity + " units of Item ID " + answer.pickItem + "\n*****************************\n"));

					setTimeout(optionsList, 3000);
				});

			});
		});
}


function addNewProd() {
	inquirer
	.prompt([
		{
			name: "newItem",
			type: "input",
			message: "What's the name of the new product? ",
		},
		{
			name: "pickDept",
			type: "input",
			message: "What department does that belong to? ",
		},
		{
			name: "setPrice",
			type: "input",
			message: "What's the unit price of this item? ",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},
		{
			name: "pickQuantity",
			type: "input",
			message: "How many would you like to add? ",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function (answer) {
		var query = "INSERT INTO products(product_name, department_name, price, stock_quantity)VALUES (?, ?, ?, ?)";
		connection.query(query, [answer.newItem, answer.pickDept, answer.setPrice, answer.pickQuantity], function (err, res) {
			if (err) throw err;

			console.log(chalk.blue("\nAdding new item to inventory...\n"));

			setTimeout(viewProducts, 1500);

		});
	});
}