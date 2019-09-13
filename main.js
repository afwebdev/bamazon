/* ## Homework: Bamazon
* In this activity, you'll be creating an Amazon-like storefront with the MySQL skills 
you learned in this unit. 

THE APP WILL TAKE IN ORDERS FROM CUSTOMERS AND DEPLETE 
STOCK FROM THE STORE'S INVENTORY. 

As a bonus task, you can programs your app to track 
product sales across your store's departments,
and then provide a summary of the highest-grossing departments in the store. */

const mysql = require("mysql");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "andrew123",
	database: "bamazon"
});
const getAllFromDB = prompt => {
	connection.query("SELECT * FROM inventory", (err, res) => {
		let promptResults = [];
		if (err) {
			console.error(err);
		}

		for (item of res) {
			promptResults.push({
				value: item.id,
				name: `${item.item_name} - $${item.item_price}`
			});
		}
		prompt(promptResults);
		// connection.end();
	});
};

const displayTop = results => {
	// console.log(results);
	let department = "";
	results.forEach(dept => {
		switch (dept.department) {
			case 1:
				department = "Automotive";
				break;
			case 2:
				department = "Beauty";
				break;
			case 3:
				department = "Electronics";
				break;
			case 4:
				department = "Home Decor";
				break;
			case 5:
				department = "Food";
				break;
			case 6:
				department = "Fitness";
				break;
			case 7:
				department = "Garden";
				break;
			case 8:
				department = "Clothing";
				break;
			default:
				break;
		}
		console.log(`Dept: ${department} -- Sales: $${dept.total_sales}`);
	});
	getAllFromDB(generatePrompt);
};

const getTopDepartments = cbResults => {
	let topDepts;
	connection.query(
		`
		SELECT inventory.department,
		SUM(total_sale) as total_sales
		FROM sales
		INNER JOIN bamazon.inventory
		on sales.item_id = inventory.id
		GROUP BY department
		ORDER BY total_sales DESC
		`,
		(err, res) => {
			// console.log(res);
			if (err) {
				console.error(err);
			}

			cbResults(res);
		}
	); //end query
};

const generatePrompt = items => {
	// console.clear();
	inquirer
		.prompt([
			{
				name: "intro",
				type: "list",
				choices: ["Top Departments", "Purchase Items"],
				message: "Hello! Welcome to Bamazon, What would you like to do today?"
			},
			{
				when: answers => {
					if (answers.intro === "Purchase Items") {
						return true;
					}
				},
				message: "Welcome to bamazon, what would you like to purchase?",
				type: "list",
				name: "purchase",
				choices: items
			},
			{
				when: answer => {
					if (answer.purchase) {
						return true;
					}
				},
				message: "How many would you like to purchase?",
				type: "number",
				name: "amount"
			}
		])
		.then(async answers => {
			console.clear();
			console.log(answers);
			if (answers.purchase) {
				let id = answers.purchase;

				await connection.query(`
				UPDATE inventory
				SET quantity = quantity - ${answers.amount}
				WHERE id = ${id}`);

				// console.clear();
				console.log("***************************************");
				console.log("\nPurchase Success! Thank You!\n");
				console.log("***************************************");
				getAllFromDB(generatePrompt);
			} else if (answers.intro === "Top Departments") {
				getTopDepartments(displayTop);
			}
		});
};
console.clear();
getAllFromDB(generatePrompt);
