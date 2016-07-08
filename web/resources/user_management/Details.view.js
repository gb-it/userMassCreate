/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, no-undef: 0, dot-notation: 0 */
sap.ui.jsview("user_management.Details", {

	getControllerName : function() {
		return "user_management.Details";
	},

	createContent : function(oController) {
		  var oLayout = new sap.ui.commons.layout.MatrixLayout("mainLayout");		
		  
		  //Filter By Panel
	      var searchPanel = new sap.ui.commons.Panel().setText('Filter by User ID');
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      searchPanel.addContent(layoutNew);

	      var oVal1 = new sap.ui.commons.TextField("val1",{tooltip: "User", editable:true});
	      layoutNew.createRow(new sap.ui.commons.Label({text: "User: "}), oVal1 );

	      //Attach a controller event handler to Value 1 Input Field
		  oVal1.attachEvent("liveChange", function(oEvent){
	        	oController.onLiveChangeV1(oEvent); });  
	      oLayout.createRow(searchPanel);
		  
	    //Table Panel
	      var tablePanel = new sap.ui.commons.Panel().setText('Search Results');
	      var layoutTbl = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      tablePanel.addContent(layoutTbl);
	      var oControl; 
	      var oTable = new sap.ui.table.Table("tblUsers",{tableId: "tableID", 
    	    visibleRowCount: 15}); 
    	  
	      var oContent = new sap.ui.commons.layout.MatrixLayout("content1",{layoutFixed:false});
	      var ocalloutContent = new sap.ui.commons.TextView("calloutContent",{text:"Initializing...."});
	      var oCallout = new sap.ui.commons.Callout("callout1",{ content: ocalloutContent, open: fillCallout, close: onClose, beforeOpen: onBeforeOpen });
	      var message = "";
	      var nAttempts = 0;

	      function onBeforeOpen(oEvent){
	    	  if(bDone){

	    	  }
	    	  else{
		    	  oEvent.preventDefault(); // do not show the Callout	   
		    	 // oController.onRoleSearch(oEvent);	
		    	  var aUrl = '/rest/roles/assigned/'+escape(sap.ui.getCore().byId(oEvent.oSource.oParent.sId).getValue());
		  		var response = jQuery.ajax({
		  			type: 'GET',
		  			url: aUrl,
		  			async: false
		  		}).responseText;
		  		var assignedRoles = JSON.parse(response);
		  		var roleDtls = 'Roles for ' + assignedRoles.AssignedRoles[0].GRANTEE + '\n';
		  		for ( var i = 0; i < assignedRoles.AssignedRoles.length; i++) {
		  			roleDtls = roleDtls + assignedRoles.AssignedRoles[i].ROLE_NAME + '\n';
		  		}
		  		sap.ui.getCore().byId("calloutContent").setText(roleDtls);  
		  		sap.ui.getCore().byId("calloutContent").rerender();
		  		bDone = true;
		    	oCallout.attachEvent("open", fillCallout); // first time only
	    	  }


		      //	oLayout.invalidate();	    	  
	    	}
	      
	    //fill the Callout after opening
	      function fillCallout(oEvent){
	    	oCallout.detachEvent("open", fillCallout); // first time only
         	oCallout.adjustPosition();
	      	oLayout.invalidate();
	      }
	      
	      function onClose(event){
	    	bDone = false;
		   	oLayout.invalidate();

	      }
	      oContent.addEventDelegate({ onAfterRendering:function(){ oCallout.adjustPosition(); } });
	      
       	  oControl = new sap.ui.commons.TextField("txt1").bindProperty("value","USER_NAME"); 
       	  oControl.setTooltip(oCallout);
       	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"User Name"}), template: oControl, width: "125px" })); 
    	  
       	  oControl = new sap.ui.commons.TextField().bindProperty("value","CREATE_TIME"); 
      	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Create Time"}), template: oControl, width: "125px" })); 

      	  oControl = new sap.ui.commons.TextField().bindProperty("value","CREATOR"); 
      	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Creator"}), template: oControl, width: "125px" })); 

      	  oControl = new sap.ui.commons.TextField().bindProperty("value","USER_DEACTIVATED"); 
      	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"User Deactivated"}), template: oControl, width: "125px" })); 

      	  oControl = new sap.ui.commons.TextField().bindProperty("value","VALID_FROM"); 
      	  oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text:"Valid From"}), template: oControl, width: "125px" })); 
      	  
    	  layoutTbl.createRow(oTable);
      
	      oLayout.createRow(tablePanel);
	      
		return oLayout;

	}
});