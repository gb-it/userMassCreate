/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, no-undef: 0, dot-notation: 0 */

sap.ui.controller("user_management.Details", {

	onLiveChangeV1: function(oEvent){
		var aUrl = '/rest/users/'+escape(oEvent.getParameters().liveValue);
		jQuery.ajax({
			url: aUrl,
			method: 'GET',
			dataType: 'json',
			success: this.onCompleteUserSearch,
			error: this.onErrorCall });
	},    	
onCompleteUserSearch: function(users){
	
	//Create a model and bind the table rows to this model
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(users);
	var oTable = sap.ui.getCore().byId("tblUsers");
	
	oTable.setModel(oModel);
	oTable.bindRows("/Users");

},

	onRoleSearch: function(oEvent){
		

		var aUrl = '/rest/roles/assigned/'+escape(sap.ui.getCore().byId(oEvent.oSource.oParent.sId).getValue());
		var response = jQuery.ajax({
			type: 'GET',
			url: aUrl,
			async: false
		}).responseText;
		//alert(assignedRoles);
		var assignedRoles = JSON.parse(response);
		var roleDtls = 'Roles for ' + assignedRoles.AssignedRoles[0].GRANTEE + '\n';
		for ( var i = 0; i < assignedRoles.AssignedRoles.length; i++) {
			roleDtls = roleDtls + assignedRoles.AssignedRoles[i].ROLE_NAME + '\n';
		}
		sap.ui.getCore().byId("calloutContent").setText(roleDtls);  
		sap.ui.getCore().byId("calloutContent").rerender();
		bDone = true;
		
	},
	
    onErrorCall: function(jqXHR, textStatus, errorThrown){
  	  if(jqXHR.status == '500'){
	    		 sap.ui.commons.MessageBox.show(jqXHR.responseText, 
	    				 "ERROR",
	    				 "Service Call Error" );	
	    		return;	
  	  }
  	  else{
		         sap.ui.commons.MessageBox.show(jqXHR.statusText, 
	    				 "ERROR",
	    				 "Service Call Error" );	
	    		return;	
  	  }
  	}	
});