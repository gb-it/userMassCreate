"use strict";

module.exports = function(app) {

	app.use("/rest/sessionInfo", require("./routes/sessionInfo").router());
	app.use("/rest/roles", require("./routes/roles").router());
	app.use("/rest/users", require("./routes/users").router());
};