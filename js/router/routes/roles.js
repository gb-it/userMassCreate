/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0*/
"use strict";

function getRepoRolesInt(client, callback) {
	var query = "SELECT \"ROLE_NAME\", \"ROLE_ID\", \"ROLE_MODE\", \"GLOBAL_IDENTITY\", \"CREATOR\", \"CREATE_TIME\" " +
		" FROM \"ROLES\" WHERE \"CREATOR\" = ? ORDER BY \"ROLE_NAME\"  ";
	client.prepare(
		query,
		function(err, statement) {
			if (err) {
				callback(err);
				return;
			}
			statement.exec(["_SYS_REPO"],
				function(err, results) {
					if (err) {
						callback(err);
					} else {
						callback(null, results);
					}
				});
		});
}

function getCatalogRolesInt(client, callback) {
	var query = "SELECT \"ROLE_NAME\", \"ROLE_ID\", \"ROLE_MODE\", \"GLOBAL_IDENTITY\", \"CREATOR\", \"CREATE_TIME\" " +
		" FROM \"ROLES\" WHERE \"CREATOR\" != ? ORDER BY \"ROLE_NAME\"  ";
	client.prepare(
		query,
		function(err, statement) {
			if (err) {
				callback(err);
				return;
			}
			statement.exec(["_SYS_REPO"],
				function(err, results) {
					if (err) {
						callback(err);
					} else {
						callback(null, results);
					}
				});
		});
}

function getAssignedRolesInt(client, userName, callback) {
	var query = "SELECT * FROM \"GRANTED_ROLES\" WHERE \"GRANTEE\" = ?";
	client.prepare(
		query,
		function(err, statement) {
			if (err) {
				callback(err);
				return;
			}
			statement.exec([userName.toUpperCase()],
				function(err, results) {
					if (err) {
						callback(err);
					} else {
						callback(null, results);
					}
				});
		});
}

module.exports = {
	getRepoRoles: function(client, callback) {
		getRepoRolesInt(client, callback);
	},

	getCatlogRoles: function(client, callback) {
		getCatalogRolesInt(client, callback);
	},

	getAssignedRoles: function(client, userName, callback) {
		getAssignedRolesInt(client, userName, callback);
	},

	router: function() {
		var express = require("express");
		var app = express.Router();

		app.get("/", function(req, res) {
			getRepoRolesInt(req.db, function(err, results) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err);
				} else {
					var jsonOut = {
						"RepositoryRoles": []
					};
					for (var i = 0; i < results.length; i++) {
						jsonOut.RepositoryRoles.push(results[i]);
					}
				}
				getCatalogRolesInt(req.db, function(err, results) {
					if (err) {
						res.type("text/plain").status(500).send("ERROR: " + err);
					} else {
						jsonOut.CatalogRoles = [];
						for (var i = 0; i < results.length; i++) {
							jsonOut.CatalogRoles.push(results[i]);
						}

						res.type("application/json").status(200).send(JSON.stringify(jsonOut));
					}
				});
			});
		});

		app.get("/assigned/:userName?", function(req, res) {
			var userName = req.params.userName;
			if (typeof userName === "undefined" || userName === null || userName === "") {
				res.type("text/plain").status(500).send("ERROR: " + "No User Name Supplied");
				return;
			}
			getAssignedRolesInt(req.db, userName, function(err, results) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err);
				} else {
					var jsonOut = {
						"AssignedRoles": []
					};
					for (var i = 0; i < results.length; i++) {
						jsonOut.AssignedRoles.push(results[i]);
					}
					res.type("application/json").status(200).send(JSON.stringify(jsonOut));
				}
			});
		});

		return app;
	}
};