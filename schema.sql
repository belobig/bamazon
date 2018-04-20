DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price FLOAT(10,2) NOT NULL,
	stock_quantity INT NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Chimichanga", "Comida Mexicana", 6.99, 60), 
("Arroz e feijão", "Comida Brasileira", 4.95, 50), 
("Salsiccia", "Cibo Italiano", 11.12, 10), 
("Tamale", "Comida Mexicana", 2.50, 100), 
("Coxinha", "Comida Brasileira", 1.99, 150), 
("Bruschetta", "Cibo Italiano", 3.25, 20), 
("Chile Relleno", "Comida Mexicana", 5.79, 40), 
("Guaraná", "Comida Brasileira", 0.99, 200), 
("Insalata Caprese", "Cibo Italiano", 6.34, 25), 
("Cocada", "Comida Brasileira", 0.50, 200);

SELECT * FROM products;