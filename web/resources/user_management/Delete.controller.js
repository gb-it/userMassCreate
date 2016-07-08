/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, no-undef: 0, dot-notation: 0 */
sap.ui.controller("user_management.Delete", {
	onDeleteUsers: function(oController){

		sap.ui.commons.MessageBox.confirm('Are you sure you want to delete these users?',
				 function(bResult){oController.deleteConfirm(bResult, oController); },
				 "Deletion Confirmation" );   
	},
	
	 //Creation Confirmation Dialog Results
	 deleteConfirm: function(bResult,oController){
		 if(bResult){ 
			 var aUrl = '/rest/users/';
				var oRoles = sap.ui.getCore().byId("rolesList");
				
			 var jsonBody = {};
			 var items = {};
			 jsonBody["user"] = sap.ui.getCore().byId("DUserNamePattern").getValue();
			 jsonBody["number"] = sap.ui.getCore().byId("DnumUsers").getValue();
			 
			
			 sap.ui.getCore().byId("txtDLog").setValue("");	
			 sap.ui.core.BusyIndicator.show();			 
			 jQuery.ajax({
			       url: aUrl,
			       data: JSON.stringify(jsonBody),
			       processData: false,
			       type: 'DELETE',
			       dataType: 'text',
			       contentType: "application/json; charset=utf-8",
			       success: function(myTxt){
			          	  oController.onDeleteSuccess(myTxt); },
			       error: oController.onErrorCall });
		 }
	 },
	 
	 //Deletion Successful Event Handler
	 onDeleteSuccess: function(myTxt){
	     sap.ui.core.BusyIndicator.hide();		 
		 sap.ui.getCore().byId("txtDLog").setValue(myTxt);		
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