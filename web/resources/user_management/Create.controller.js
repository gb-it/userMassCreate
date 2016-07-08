/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, no-undef: 0, dot-notation: 0 */
sap.ui.controller("user_management.Create", {

	onloadRoles: function(){
		var aUrl = '/rest/roles/';
		jQuery.ajax({
			url: aUrl,
			type: 'GET',
			dataType: 'json',
			success: this.onCompleteLoadRoles,
			error: this.onErrorCall });
	},    
	
	onCompleteLoadRoles: function(roles){
		var oRoles = sap.ui.getCore().byId("rolesList");
		for ( var i = 0; i < roles.RepositoryRoles.length; i++) {
			oRoles.addItem( new sap.ui.core.ListItem({ text:roles.RepositoryRoles[i].ROLE_NAME}));
		}

	},
	
	
	onCreateUsers: function(oController){

		sap.ui.commons.MessageBox.confirm('Are you sure you want to create these users?',
				 function(bResult){oController.createConfirm(bResult, oController); },
				 "Creation Confirmation" );   
	},
	
	 //Creation Confirmation Dialog Results
	 createConfirm: function(bResult,oController){
		 if(bResult){ 
			 var aUrl = '/rest/users/';
				var oRoles = sap.ui.getCore().byId("rolesList");
				
			 var jsonBody = {};
			 var items = {};
			 jsonBody["user"] = sap.ui.getCore().byId("UserNamePattern").getValue();
			 jsonBody["number"] = sap.ui.getCore().byId("numUsers").getValue();
			 jsonBody["password"] = sap.ui.getCore().byId("Password").getValue();	
			 
			 var roles = [];
			 jQuery.each(oRoles.getSelectedItems(), function(idx,item) {  var items = []; roles.push({"role_name": item.getText()}); });
			 //item["roles"] = roles;
			 jsonBody["roles"] = roles;
			 sap.ui.getCore().byId("txtLog").setValue("");	
			 sap.ui.core.BusyIndicator.show();			 
			 jQuery.ajax({
			       url: aUrl,
			       data: JSON.stringify(jsonBody),
			       processData: false,
			       type: 'POST',
			       dataType: 'text',
			       contentType: "application/json; charset=utf-8",
			       success: function(myTxt){
			          	  oController.onCreateSuccess(myTxt); },
			       error: oController.onErrorCall });
		 }
	 },
	 
	 //Creation Successful Event Handler
	 onCreateSuccess: function(myTxt){
	     sap.ui.core.BusyIndicator.hide();		 
		 sap.ui.getCore().byId("txtLog").setValue(myTxt);		
	 },
	 
     onErrorCall: function(jqXHR, textStatus, errorThrown){
    	 sap.ui.core.BusyIndicator.hide();	    	 
   	  if(jqXHR.status === '500'){
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