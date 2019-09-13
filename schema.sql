DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;


create TABLE inventory(
	id INT AUTO_INCREMENT PRIMARY KEY,
	item_name VARCHAR(100) NOT NULL,
	item_price DECIMAL(10, 2) NOT NULL,
	quantity INT NOT NULL,
	department INT NOT NULL,
	FOREIGN KEY(department) REFERENCES departments(id)
)

CREATE TABLE departments(
	id INT AUTO_INCREMENT PRIMARY KEY,
	department_name VARCHAR(100),
)

CREATE TABLE sales(
	id INT AUTO_INCREMENT PRIMARY KEY,
	item_id INT NOT NULL,
	dept_id INT NOT NULL,
	quantity INT NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	date_sold TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	total_sale DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY(item_id) REFERENCES inventory(id),
	FOREIGN KEY (dept_id) REFERENCES departments(id)
)