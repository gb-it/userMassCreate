/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, dot-notation: 0 */
sap.ui.controller("user_management.Shell", {

	 getSessionInfo: function(oController,oUserTxt){
			var aUrl = '/rest/sessionInfo/';
			
		    jQuery.ajax({
		       url: aUrl,
		       method: 'GET',
		       dataType: 'json',
		       success: function(myJSON){oController.onLoadSession(myJSON,oController,oUserTxt); },
		       error: oController.onErrorCall });
	 },
	 
	 onLoadSession: function(myJSON,oController,oUserTxt){
			for( var i = 0; i<myJSON.session.length; i++)
		     {
			   oUserTxt.setText(myJSON.session[i].UserName);	
		     }
	 },	 
		
	 handleExitShell: function(oEvent){
	        alert("Logout Button has been clicked.\nThe application can now do whatever is required.\nThis example page will just clear the screen.");
	        oEvent.getSource().forceInvalidation();
	        oEvent.getSource().destroy();
	        sap.ui.getCore().applyChanges();
	        jQuery(document.body).html("<span>Logout had been pressed, screen has been cleared.</span>");
	      },
	      
	      handlePersonalizeShell: function(oEvent){
	    	  sap.ui.getCore().byId("myShell").openPersonalizationDialog();
	      },
	      
	      handlePersonalizeShellChange: function(oEvent){
		        var data = oEvent.getParameter("settings"); // retrieve the personalization data object
		        // ...now persist this data on the server or wherever personalization data is stored
		        // (in-browser is not enough because the user wants his settings when logging in from another browser as well)
		        // browser-only:
		        if (JSON && window["localStorage"]) { // only in browsers with native JSON and offline storage support
		          var string = JSON.stringify(data);
		          localStorage.setItem("sapUiShellTestSettings", string);
		        }
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