/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, no-undef: 0, dot-notation: 0 */
sap.ui.jsview("user_management.Delete", {

	getControllerName : function() {
		return "user_management.Delete";
	},

	createContent : function(oController) {
		  //Filter By Panel
	      var searchPanel = new sap.ui.commons.Panel().setText('Delete');
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      searchPanel.addContent(layoutNew);

	      var oName = new sap.ui.commons.TextField("DUserNamePattern",{tooltip: "User Name Pattern", editable:true, width: '400px'});
	      var oDeleteButton = new sap.ui.commons.Button({
	          text : "Delete Users",
	          icon : "./images/Delete.gif",
	          press : function(){ oController.onDeleteUsers(oController);} 
	      });
	      layoutNew.createRow(new sap.ui.commons.Label({text: "User Name Pattern: "}), oName, oDeleteButton );
	      
      
	      var oNum = new sap.ui.commons.Slider({
	    		id : 'DnumUsers',
	    		tooltip: 'Number of Users to Delete',
	    		width: '100%',
	    		min: 1,
	    		max: 200,
	    		value: 200,
	    		totalUnits: 5,
	    		smallStepWidth: 10,
	    		stepLabels : true
	    		});
	      layoutNew.createRow(new sap.ui.commons.Label({text: "Number of Users: "}), oNum );
	      

	     //Log Panel
	 	 var oLogPanel = new sap.ui.commons.Panel().setText("Deletion Log");   
		 var layoutTwo = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
		 oLogPanel.addContent(layoutTwo);
	 
		 otxtDLog = new sap.ui.commons.TextArea('txtDLog',{
			 	cols : 100,
				rows : 8});	 
		 var oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan: 2});
	     oCell.addContent(otxtDLog);	 
	     layoutTwo.createRow(oCell);	 
		 
		 
		 var oLayout = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
		 oLayout.createRow(searchPanel);
		 oLayout.createRow(oLogPanel);
		return oLayout;
		
	}
});