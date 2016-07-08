/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, consistent-return: 0, new-cap: 0, no-use-before-define: 0, dot-notation: 0 */
sap.ui.jsview("user_management.Shell", {

	getControllerName : function() {
		return "user_management.Shell";
	},

	createContent : function(oController) {
		
		oController.oShell = new sap.ui.ux3.Shell("myShell", {
			appIcon : "./images/sap_18.png",
			appIconTooltip : "SAP",
			appTitle : "Workshop User Management",
			showInspectorTool : false,
			showFeederTool : false,
			showSearchTool : false
		});

		oController.oShell.attachLogout(oController.handleExitShell);

		createShell(oController);
		buildShellPersonalization(oController);
		buildShellNavigation(oController);

		var oLayout = new sap.ui.commons.layout.MatrixLayout();		
		
		oController.oEntryView = sap.ui.view({id:"details_view", viewName:"user_management.Details", type:sap.ui.core.mvc.ViewType.JS});
		oController.oCreateView = sap.ui.view({id:"create_view", viewName:"user_management.Create", type:sap.ui.core.mvc.ViewType.JS});
		oController.oDeleteView = sap.ui.view({id:"delete_view", viewName:"user_management.Delete", type:sap.ui.core.mvc.ViewType.JS});
		
		
		oLayout.createRow(oController.oEntryView);   		
		oController.oShell.setContent(oLayout);		
		
		return oController.oShell;
	}
});


function createShell(oController) {

	var oUserTxt = new sap.ui.commons.TextView({
		tooltip : "Welcome" 
	});
	oController.oShell.addHeaderItem(oUserTxt);
	oController.getSessionInfo(oController,oUserTxt);
	oController.oShell.addHeaderItem(new sap.ui.commons.Button({
		text : "Personalize",
		tooltip : "Personalize",
		press : oController.handlePersonalizeShell
	}));

	oController.oShell.addHeaderItem(new sap.ui.commons.MenuButton({
		text : "Help",
		tooltip : "Help Menu",
		menu : new sap.ui.commons.Menu("menu1", {
			items : [ new sap.ui.commons.MenuItem("menuitem1", {
				text : "Help"
			}), new sap.ui.commons.MenuItem("menuitem2", {
				text : "Report Incident"
			}), new sap.ui.commons.MenuItem("menuitem3", {
				text : "About"
			}) ]
		})
	})); 
}

function buildShellPersonalization(oController) {
	// EXPERIMENTAL - THIS WILL CHANGE!!
	oController.oShell._getPersonalization().attachPersonalizationChange(
			oController.handlePersonalizeShellChange);
	// initialize settings
	if (JSON && window["localStorage"]) { // only in browsers with native JSON
		// and offline storage support
		var sSettings = localStorage.getItem("sapUiShellTestSettings");
		if (sSettings) {
			oController.oShell.initializePersonalization(JSON.parse(sSettings));
		}
	}
}

function buildShellNavigation(oController) {
	var WI = sap.ui.ux3.NavigationItem;
	oController.oShell.addWorksetItem(new WI("wi_home", {
		key : "wi_home",
		text : 'Details' }));
	oController.oShell.addWorksetItem(new WI("wi_create", {
		key : "wi_create",
		text : 'Creation' }));	
	oController.oShell.addWorksetItem(new WI("wi_delete", {
		key : "wi_delete",
		text : 'Deletion' }));	
	
	oController.oShell.attachEvent("worksetItemSelected", function(oEvent){
		var oLayout = new sap.ui.commons.layout.MatrixLayout();	
    	var sId = oEvent.getParameter("id");
		switch (sId) {
		case "wi_home":
			oController.oShell.setContent(oLayout.createRow(oController.oEntryView));
			break;
		case "wi_create":
			oController.oShell.setContent(oLayout.createRow(oController.oCreateView));
			break;	
		case "wi_delete":
			oController.oShell.setContent(oLayout.createRow(oController.oDeleteView));
			break;				
		}
	});  
	

			
}
