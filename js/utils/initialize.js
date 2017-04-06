/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";
module.exports = {
	initExpress: function() {
		var xsenv = require("@sap/xsenv");
		var passport = require("passport");
		var xssec = require("@sap/xssec");
		var xsHDBConn = require("@sap/hdbext");
		var express = require("express");

		//logging
		var logging = require("@sap/logging");
		var appContext = logging.createAppContext();
		
		//Initialize Express App for XS UAA and HDBEXT Middleware
		var app = express();
		passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
			uaa: {
				tag: "xsuaa"
			}
		}).uaa));
		app.use(logging.expressMiddleware(appContext));
		app.use(passport.initialize());
		var options = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		app.use(
			passport.authenticate("JWT", {
				session: false
			}),
			xsHDBConn.middleware(options.hana));
		return app;
	},

	pad: function(n, width, z) {
		z = z || "0";
		n = n + "";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
};