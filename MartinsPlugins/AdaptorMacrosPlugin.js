/***
|''Name:''|AdaptorMacrosPlugin|
|''Description:''|Commands to access hosted TiddlyWiki data|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://www.martinswiki.com/#AdaptorMacrosPlugin |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/adaptors/AdaptorMacrosPlugin.js |
|''Version:''|0.3.8|
|''Date:''|Aug 23, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]] |
|''~CoreVersion:''|2.2.0|
***/

//{{{
// Ensure that the plugin is only installed once.
if(!version.extensions.AdaptorMacrosPlugin) {
version.extensions.AdaptorMacrosPlugin = {installed:true};

// Return an array of tiddler titles that are in the given workspace on the host
TiddlyWiki.prototype.getHostedTiddlers = function(host,workspace)
{
	var results = [];
	if(!this.hostedTiddlers || !this.hostedTiddlers[host])
		return results;
	var tiddlers = this.hostedTiddlers[host][workspace];
	if(tiddlers) {
		for(var i=0; i<tiddlers.length; i++) {
			results.push(tiddlers[i].title);
		}
	}
	return results;
};

config.macros.viewTiddlerFields = {};
config.macros.viewTiddlerFields.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(tiddler instanceof Tiddler) {
		var value = '';
		var comma = '';
		for(i in tiddler.fields) {
			if (!i.match(/^temp[\._]/)) {
				value += comma + i + '=' + tiddler.fields[i];
				comma = ', ';
			}
		}
		if(tiddler.created)
			value += comma + 'created=' + tiddler.created.convertToYYYYMMDDHHMM();
		if(tiddler.modified)
			value += ', modified=' + tiddler.modified.convertToYYYYMMDDHHMM();
		if(tiddler.modifier)
			value += ', modifier=' + tiddler.modifier;
		value += ', touched=' + (tiddler.isTouched() ? 'true' : 'false');
		highlightify(value,place,highlightHack,tiddler);
	}
};

config.macros.list.updatedOffline = {};
config.macros.list.updatedOffline.handler = function(params)
{
	var results = [];
	store.forEachTiddler(function(title,tiddler) {
		if(tiddler.fields['server.host'] && tiddler.isTouched())
			results.push(tiddler);
		});
	results.sort();
	return results;
};

config.macros.list.workspaceTiddlers = {};
config.macros.list.workspaceTiddlers.prompt = "List Tiddlers in the workspace";
config.macros.list.workspaceTiddlers.handler = function(params,wikifier,paramString,tiddler)
{
	var customFields = getParam(params,'fields',false);
	if(!customFields)
		customFields = config.defaultCustomFields;
	return store.getHostedTiddlers(customFields['server.host'],customFields['server.workspace']);
};

config.macros.updateWorkspaceTiddlerList = {};
merge(config.macros.updateWorkspaceTiddlerList,{
	label: "update tiddler list",
	prompt: "Update list of tiddlers in workspace",
	done: "List updated"});

config.macros.updateWorkspaceTiddlerList.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams('anon',null,true,false,false);
	var customFields = getParam(params,'fields',false);
	if(!customFields)
		customFields = String.encodeHashMap(config.defaultCustomFields);
	var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick);
	btn.setAttribute('customFields',customFields);
	btn.setAttribute('title',tiddler.title);
};

config.macros.updateWorkspaceTiddlerList.onClick = function(e)
{
	clearMessage();
	var customFields = this.getAttribute("customFields");
	var fields = customFields.decodeHashMap();
	var userParams = {host:fields['server.host'],workspace:fields['server.workspace'],title:this.getAttribute("title")};
	return invokeAdaptor('getTiddlerList',null,null,null,userParams,config.macros.updateWorkspaceTiddlerList.callback,fields);
};

config.macros.updateWorkspaceTiddlerList.callback = function(context,userParams)
{
	if(context.status) {
		if(!store.hostedTiddlers)
			store.hostedTiddlers = {};
		if(!store.hostedTiddlers[userParams.host])
			store.hostedTiddlers[userParams.host] = {};
		store.hostedTiddlers[userParams.host][userParams.workspace] = context.tiddlers;
		displayMessage(config.macros.updateWorkspaceTiddlerList.done);
		story.displayTiddler(null,userParams.title);
		story.refreshTiddler(userParams.title,1,true);
	} else {
		displayMessage(context.statusText);
	}
};


config.macros.updateWorkspaceList = {};
merge(config.macros.updateWorkspaceList,{
	label: "update workspace list",
	prompt: "Update list of workspaces",
	done: "List updated"});

config.macros.updateWorkspaceList.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams('anon',null,true,false,false);
	var customFields = getParam(params,'fields',false);
	if(!customFields)
		customFields = String.encodeHashMap(config.defaultCustomFields);
	var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick);
	btn.setAttribute('customFields',customFields);
	btn.setAttribute('title',tiddler.title);
};

config.macros.updateWorkspaceList.onClick = function(e)
{
	clearMessage();
	var customFields = this.getAttribute("customFields");
	var fields = customFields.decodeHashMap();
	var userParams = {host:fields['server.host'],callback:config.macros.updateWorkspaceList.callback};
	return invokeAdaptor('getWorkspaceList',context,fields);
};

config.macros.updateWorkspaceList.callback = function(context,userParams)
{
	if(context.status) {
		displayMessage(config.macros.updateWorkspaceList.done);
		for(var i=0; i<context.workspaces.length; i++) {
			displayMessage("workspace:"+context.workspaces[i]);
		}
	} else {
		displayMessage(context.statusText);
	}
};

} // end of 'install only once'
//}}}