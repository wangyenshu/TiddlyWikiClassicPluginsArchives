/*{{{*/

// may be required for mikes comments plugi
//window.saveChanges = function(){};

setStylesheet(
	"label {width:8em; float:left; text-align:right; width:9em; font-size:1.1em; padding:3px;  height:1.5em: top:-20px; margin: 0px -2px 0 0;}"+ 
//	"div.wizardFooter {padding-left:0em}"+ 
	"div.wizardStep > input {display:fixed; padding:3px; margin-bottom:5px; margin-top:0px; margin-right:0px}",
'labelStyles');




config.backstageTasks.remove("upgrade");
config.backstageTasks.remove("save");
config.backstageTasks.remove("sync");


//  ccAutoSave config//

config.options.chkAutoSave = true;

if(!config.extensions) { config.extensions = {}; } //# obsolete from v2.4.2
config.extensions.ServerSideSavingPlugin = {
	adaptor: config.adaptors.cctiddly
};


window.ccTiddlyVersion = '1.8.2';
window.workspacePermission= {};
window.url = "http://wiki.osmosoft.com/alpha";
window.url= 'http://wiki.osmosoft.com/alpha/';
window.workspace = "";
window.fullUrl = window.url;	
window.useModRewrite = 1;
//if (config.options.txtTheme == "")
//config.options.txtTheme = 'purpleTheme';
workspacePermission.upload = 1;workspacePermission.anonC = 0 ;
workspacePermission.anonR = 1; 
workspacePermission.anonU = 0;
workspacePermission.anonD = 0;

workspacePermission.userC = 1 ;
workspacePermission.userR = 1; 
workspacePermission.userU = 1;
workspacePermission.userD = 1;
workspacePermission.canCreateWorkspace = 1;


window.workspace_delete = "A";
window.workspace_udate = "A";

var serverside={
	url:"http://wiki.osmosoft.com/alpha",		//server url, for use in local TW or TW hosted elsewhere
	workspace:"",
	queryString:"",
	debug:0,		//debug mode, display alert box for each action
	passwordTime:0,		//defines how long password variable store in cookie. 0 = indefinite
	messageDuration:5000,				//displayMessage autoclose duration (in milliseconds), 0=leave open
	loggedIn:0,
	can_create_account:"1",
	openId:"1"
};

config.defaultCustomFields = {"server.host":window.url, "server.type":"cctiddly", "server.workspace":window.workspace};
config.shadowTiddlers.OptionsPanel = "[[help|Help]] <br />[[settings|AdvancedOptions]]<br /><<ccOptions>>";

readOnly =false;
config.options.chkHttpReadOnly = false;		//make it HTTP writable by default
config.options.chkSaveBackups = false;		//disable save backup
//config.options.chkAutoSave = true;			//disable autosave
config.options.chkUsePreForStorage = false;

/*}}}*/
