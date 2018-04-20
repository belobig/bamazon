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
	getProducts();
});

function getProducts() {
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
		buyPrompt();
	});

}

function buyPrompt() {
	inquirer
		.prompt([
			{
				name: "pickItem",
				type: "input",
				message: "Please enter the ID of your desired Item: ",
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
				message: "Please enter the desired quantity: ",
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
				if (answer.pickQuantity > res[0].stock_quantity) {
					console.log(chalk.blue.bgRed.bold("Can't you read? We don't have that many."));
					buyPrompt();
				} else {
					console.log("Lemme get that wrapped up for you...");
					var totalPrice = answer.pickQuantity * res[0].price;
					query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
					connection.query(query, [answer.pickQuantity, answer.pickItem], function (err, res) {
						if (err) throw err;
						console.log(chalk.black.bgWhite.bold("\n*******************\nThat'll be $" + totalPrice + " ...\n*******************\n"));
						console.log(chalk.blue.bold("What else can I get for you?\n"));
						getProducts();
					});
				}
			});
			// connection.end(); // Move this to where I want it to end
		});
}