/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0*/
"use strict";

function getUsersInt(client, userName, callback) {
	if (typeof userName === "undefined" || userName === null || userName === "") {
		userName = "%";
	} else {
		userName += "%";
		userName.toUpperCase();
	}

	var query = "SELECT \"USER_NAME\", \"USER_ID\", \"USER_MODE\", \"EXTERNAL_IDENTITY\", \"CREATOR\", \"CREATE_TIME\", \"VALID_FROM\", " +
		"\"VALID_UNTIL\", \"LAST_SUCCESSFUL_CONNECT\", \"LAST_INVALID_CONNECT_ATTEMPT\", \"INVALID_CONNECT_ATTEMPTS\", \"ADMIN_GIVEN_PASSWORD\", " +
		"\"PASSWORD_CHANGE_TIME\", \"PASSWORD_CHANGE_NEEDED\", \"USER_DEACTIVATED\", \"DEACTIVATION_TIME\", \"IS_PASSWORD_ENABLED\", " +
		"\"IS_KERBEROS_ENABLED\", \"IS_SAML_ENABLED\", \"IS_X509_ENABLED\" " + "FROM \"USERS\" WHERE \"USER_NAME\" LIKE ?";
	client.prepare(
		query,
		function(err, statement) {
			if (err) {
				callback(err);
				return;
			}
			statement.exec([userName],
				function(err, results) {
					if (err) {
						callback(err);
					} else {
						callback(null, results);
					}
				});
		});
}

function createUsersInt(client, userJson, callback) {
	var ROLES = [];
	for (var x = 0; x < userJson.roles.length; x++) {
		var role = {};
		role.ROLE_NAME = userJson.roles[x].role_name;
		ROLES.push(role);
	}
	var userId = userJson.user;

	var hdbext = require("@sap/hdbext");
	//(Schema, Procedure, callback)
	hdbext.loadProcedure(client, null, "create_users_mass", function(err, sp) {
		if (err) {
			callback(err);
			return;
		}
		//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
		sp({
			IM_PREFIX: userId.toUpperCase(),
			IM_PASSWORD: userJson.password,
			IM_NUMBER: userJson.number,
			ROLES: ROLES
		}, function(err, parameters, results) {
			if (err) {
				callback(err);
				return;
			}
			var log = "";
			for (var i = 0; i < results.length; i++) {
				log += results[i].MESSAGE + '\n';
			}
			callback(null, log);
		});
	});
}

function deleteUsersInt(client, userJson, callback) {
	var log = "";
	var deleteItems = [];
    
    for ( var i = 0; i < userJson.number; i++) {
    	var localNum = i + 1;
    	deleteItems.push({ user: userJson.user + require(global.__base + "utils/initialize").pad(localNum, 2, 0) }); 
    }	
 
	require("async").each(deleteItems, function(item, callback) {
		var userId = item.user;
		userId = userId.toUpperCase();
		var query = "DROP USER " + userId
					+ " CASCADE ";
        client.prepare(
		query,
		function(err, statement) {
			if (err) {
				callback(err);
				return;
			}
			statement.exec([],
				function(err, results) {
					if (err) {
						callback(err);
					} else {
						log += "User: " + userId + " successfully dropped \n";
						callback(null);
					}
				});
		});					
		
	}, function(err) {
		if (err) {
			callback(err);
		} else {
			callback(null, log);
		}
	});
}

module.exports = {
	getUsers: function(client, userName, callback) {
		getUsersInt(client, userName, callback);
	},

	createUsers: function(client, userJson, callback) {
		createUsersInt(client, userJson, callback);
	},

	deleteUsers: function(client, userJson, callback) {
		deleteUsersInt(client, userJson, callback);
	},

	router: function() {
		var express = require("express");
		var bodyParser = require("body-parser");
		var app = express.Router();
		app.use(bodyParser.json());
		
		app.get("/:userName?", function(req, res) {
			getUsersInt(req.db, req.params.userName, function(err, results) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err);
				} else {
					var jsonOut = {
						"Users": []
					};
					for (var i = 0; i < results.length; i++) {
						jsonOut.Users.push(results[i]);
					}
					res.type("application/json").status(200).send(JSON.stringify(jsonOut));
				}
			});
		});

		app.post("/", function(req, res) {
			createUsersInt(req.db, req.body, function(err, results) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err);
				} else {
					res.type("text/plain").status(200).send(results);
				}
			});
		});

		app.delete("/", function(req, res) {
			deleteUsersInt(req.db, req.body, function(err, results) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err);
				} else {
					res.type("text/plain").status(200).send(results);
				}
			});
		});

		return app;
	}
};