/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, no-undef: 0, dot-notation: 0 */
sap.ui.jsview("user_management.Create", {

	getControllerName : function() {
		return "user_management.Create";
	},

	createContent : function(oController) {
		  //Filter By Panel
	      var searchPanel = new sap.ui.commons.Panel().setText('Create Workshop Users');
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      searchPanel.addContent(layoutNew);

	      var oName = new sap.ui.commons.TextField("UserNamePattern",{tooltip: "User Name Pattern", editable:true, width: '400px'});
	      var oCreateButton = new sap.ui.commons.Button({
	          text : "Create Users",
	          icon : "./images/save-icon.gif",
	          press : function(){ oController.onCreateUsers(oController);} 
	      });
	      layoutNew.createRow(new sap.ui.commons.Label({text: "User Name Pattern: "}), oName, oCreateButton );
	      
	      var oPassword = new sap.ui.commons.TextField("Password",{tooltip: "Initial Password", editable:true, width: '400px'});
	      layoutNew.createRow(new sap.ui.commons.Label({text: "Initial Password: "}), oPassword );
	      
	   // create 2 simple RadioButtons
	      var oLayoutRB = new sap.ui.commons.layout.MatrixLayout("matrix1");
	      	oLayoutRB.setLayoutFixed(false);
	      	oLayoutRB.setColumns(2);

	      var oRB1 = new sap.ui.commons.RadioButton({
	    	id : 'rbTwo',
	      	text : 'Two Digit',
	      	tooltip : '0-99 Users',
	      	groupName : 'Group1',
	      	selected : true,
	      		select : function() { 
	      	     var oNum = sap.ui.getCore().byId("numUsers");
	      	     oNum.setMax(99);
	      	     oNum.setValue(99);
	      		} 
	      	});

	      var oRB2 = new sap.ui.commons.RadioButton({
	      	text : 'Three Digit',
	      	tooltip : '0-200 Users',
	      	groupName : 'Group1',
	      	select : function() {
	      	     var oNum = sap.ui.getCore().byId("numUsers");
	      	     oNum.setMax(200);
	      	     oNum.setValue(200);
	      		} 
	      	});

	      oLayoutRB.createRow(oRB1, oRB2);
	      layoutNew.createRow(new sap.ui.commons.Label({text: "Number of Users: "}), oLayoutRB );
          
	      var oNum = new sap.ui.commons.Slider({
	    		id : 'numUsers',
	    		tooltip: 'Number of Users to Generate',
	    		width: '100%',
	    		min: 1,
	    		max: 99,
	    		value: 99,
	    		totalUnits: 5,
	    		smallStepWidth: 10,
	    		stepLabels : true
	    		});
	      layoutNew.createRow(new sap.ui.commons.Label({text: "Number of Users: "}), oNum );
	      
	      var oRoles = new sap.ui.commons.ListBox({
	    	  id: 'rolesList',
	    	  visibleItems: 10,
	    	  minWidth: '400px',
	    	  allowMultiSelect: true  
	      });
	      layoutNew.createRow(new sap.ui.commons.Label({text: "Assigned Roles: "}), oRoles );
	      oController.onloadRoles();
	    
	     //Log Panel
	 	 var oLogPanel = new sap.ui.commons.Panel().setText("Creation Log");   
		 var layoutTwo = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
		 oLogPanel.addContent(layoutTwo);
	 
		 otxtLog = new sap.ui.commons.TextArea('txtLog',{
			 	cols : 100,
				rows : 8});	 
		 var oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan: 2});
	     oCell.addContent(otxtLog);	 
	     layoutTwo.createRow(oCell);	 
		 
		 
		 var oLayout = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
		 oLayout.createRow(searchPanel);
		 oLayout.createRow(oLogPanel);
		return oLayout;

	}
});