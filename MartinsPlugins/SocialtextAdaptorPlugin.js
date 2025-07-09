/***
|''Name:''|SocialtextAdaptorPlugin|
|''Description:''|Adaptor for moving and converting data to and from Socialtext Wikis|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com) and JeremyRuston (jeremy (at) osmosoft (dot) com)|
|''Source:''|http://www.martinswiki.com/#SocialtextAdaptorPlugin|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/adaptors/SocialtextAdaptorPlugin.js|
|''Version:''|0.5.1|
|''Date:''|Feb 25, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.2.0|

Socialtext REST documentation is at:
http://www.eu.socialtext.net/st-rest-docs/index.cgi?socialtext_rest_documentation

***/

//{{{
if(!version.extensions.SocialtextAdaptorPlugin) {
version.extensions.SocialtextAdaptorPlugin = {installed:true};

function SocialtextAdaptor()
{
	this.host = null;
	this.workspace = null;
	return this;
}

SocialtextAdaptor.mimeType = 'text/x.socialtext-wiki';
SocialtextAdaptor.serverType = 'socialtext';
SocialtextAdaptor.serverParsingErrorMessage = "Error parsing result from server";
SocialtextAdaptor.errorInFunctionMessage = "Error in function SocialtextAdaptor.%0";

SocialtextAdaptor.prototype.setContext = function(context,userParams,callback)
{
	if(!context) context = {};
	context.userParams = userParams;
	if(callback) context.callback = callback;
	context.adaptor = this;
	if(!context.host)
		context.host = this.host;
	if(!context.workspace && this.workspace)
		context.workspace = this.workspace;
	return context;
};

SocialtextAdaptor.doHttpGET = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('GET',uri,data,contentType,username,password,callback,params,headers);
};

SocialtextAdaptor.doHttpPOST = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('POST',uri,data,contentType,username,password,callback,params,headers);
};

SocialtextAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	if(!host.match(/:\/\//))
		host = 'http://' + host;
	if(host.substr(host.length-1) != '/')
		host = host + '/';
	return host;
};

SocialtextAdaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

// Convert a page title to the normalized form used in uris
SocialtextAdaptor.normalizedTitle = function(title)
{
	var n = title.toLowerCase();
	n = n.replace(/\s/g,'_').replace(/\//g,'_').replace(/\./g,'_').replace(/:/g,'').replace(/\?/g,'');
	if(n.charAt(0)=='_')
		n = n.substr(1);
	return String(n);
};

// Convert a Socialtext date in YYYY-MM-DD hh:mm format into a JavaScript Date object
SocialtextAdaptor.dateFromEditTime = function(editTime)
{
	var dt = editTime;
	return new Date(Date.UTC(dt.substr(0,4),dt.substr(5,2)-1,dt.substr(8,2),dt.substr(11,2),dt.substr(14,2)));
};

SocialtextAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	this.host = SocialtextAdaptor.fullHostName(host);
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

SocialtextAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};


SocialtextAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0data/workspaces';
	var uri = uriTemplate.format([context.host]);
	var req = SocialtextAdaptor.doHttpGET(uri,SocialtextAdaptor.getWorkspaceListCallback,context,{'accept':'application/json'});
	return typeof req == 'string' ? req : true;
};

SocialtextAdaptor.getWorkspaceListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = SocialtextAdaptor.errorInFunctionMessage.format(['getWorkspaceListCallback']);
	if(status) {
		try {
			eval('var info=' + responseText);
		} catch (ex) {
			context.statusText = exceptionText(ex,SocialtextAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		var list = [];
		for(var i=0; i<info.length; i++) {
			var item = {
				title:info[i].title,
				name:info[i].name,
				modified:SocialtextAdaptor.dateFromEditTime(info[i].modified_time)
				};
			list.push(item);
		}
		context.workspaces = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

SocialtextAdaptor.prototype.getTiddlerList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0data/workspaces/%1/pages?order=newest';//!! ? or ;
	var uri = uriTemplate.format([context.host,context.workspace]);
	var req = SocialtextAdaptor.doHttpGET(uri,SocialtextAdaptor.getTiddlerListCallback,context,{'accept':'application/json'});
	return typeof req == 'string' ? req : true;
};


SocialtextAdaptor.getTiddlerListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = SocialtextAdaptor.errorInFunctionMessage.format(['getTiddlerListCallback']);
	if(status) {
		try {
			eval('var info=' + responseText);
		} catch (ex) {
			context.statusText = exceptionText(ex,SocialtextAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		var list = [];
		for(var i=0; i<info.length; i++) {
			var tiddler = new Tiddler(info[i].name);
			tiddler.modified = SocialtextAdaptor.dateFromEditTime(info[i].last_edit_time);
			tiddler.modifier = info[i].last_editor;
			tiddler.tags = info[i].tags;
			tiddler.fields['server.page.id'] = info[i].page_id;
			tiddler.fields['server.page.name'] = info[i].name;
			tiddler.fields['server.page.revision'] = String(info[i].revision_id);
			list.push(tiddler);
		}
		context.tiddlers = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

SocialtextAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	var host = this && this.host ? this.host : SocialtextAdaptor.fullHostName(tiddler.fields['server.host']);
	var workspace = this && this.workspace ? this.workspace : tiddler.fields['server.workspace'];
	uriTemplate = '%0%1/index.cgi?%2';
	info.uri = uriTemplate.format([host,workspace,SocialtextAdaptor.normalizedTitle(tiddler.title)]);
	return info;
};

SocialtextAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	return this.getTiddlerRevision(title,null,context,userParams,callback);
};

SocialtextAdaptor.prototype.getTiddlerRevision = function(title,revision,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);

	// request the page in json format to get the page attributes
	if(revision) {
		var uriTemplate = '%0data/workspaces/%1/pages/%2/revisions/%3';
		context.revision = revision;
	} else {
		uriTemplate = '%0data/workspaces/%1/pages/%2';
		context.revision = null;
	}
	uri = uriTemplate.format([context.host,context.workspace,SocialtextAdaptor.normalizedTitle(title),revision]);

	context.tiddler = new Tiddler(title);
	context.tiddler.fields.wikiformat = 'socialtext';
	context.tiddler.fields['server.host'] = SocialtextAdaptor.minHostName(context.host);
	context.tiddler.fields['server.workspace'] = context.workspace;
	var req = SocialtextAdaptor.doHttpGET(uri,SocialtextAdaptor.getTiddlerCallback,context,{'accept':'application/json'});
	return typeof req == 'string' ? req : true;
};


SocialtextAdaptor.getTiddlerCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = SocialtextAdaptor.errorInFunctionMessage.format(['getTiddlerCallback']);
	if(status) {
		try {
			eval('var info=' + responseText);
			context.tiddler.tags = info.tags;
			context.tiddler.fields['server.page.id'] = info.page_id;
			context.tiddler.fields['server.page.name'] = info.name;
			context.tiddler.fields['server.page.revision'] = String(info.revision_id);
			context.tiddler.modifier = info.last_editor;
			context.tiddler.modified = SocialtextAdaptor.dateFromEditTime(info.last_edit_time);
		} catch (ex) {
			context.statusText = exceptionText(ex,SocialtextAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
		if(context.callback)
			context.callback(context,context.userParams);
		return;
	}
	var uriTemplate = context.revision ? '%0data/workspaces/%1/pages/%2/revisions/%3' : '%0data/workspaces/%1/pages/%2';
	var host = SocialtextAdaptor.fullHostName(context.tiddler.fields['server.host']);
	var workspace = context.workspace ? context.workspace : context.tiddler.fields['server.workspace'];
	uri = uriTemplate.format([host,workspace,SocialtextAdaptor.normalizedTitle(context.tiddler.title),context.revision]);
	var req = SocialtextAdaptor.doHttpGET(uri,SocialtextAdaptor.getTiddlerCallback2,context,{'accept':SocialtextAdaptor.mimeType});
};

SocialtextAdaptor.getTiddlerCallback2 = function(status,context,responseText,uri,xhr)
{
	context.tiddler.text = responseText;
	if(status) {
		context.status = true;
	} else {
		context.status = false;
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

SocialtextAdaptor.prototype.getTiddlerRevisionList = function(title,limit,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);

	var uriTemplate = '%0data/workspaces/%1/pages/%2/revisions?accept=application/json';
	if(!limit)
		limit = 5;
	var uri = uriTemplate.format([context.host,context.workspace,SocialtextAdaptor.normalizedTitle(title),limit]);

	var req = SocialtextAdaptor.doHttpGET(uri,SocialtextAdaptor.getTiddlerRevisionListCallback,context);
	return typeof req == 'string' ? req : true;
};

SocialtextAdaptor.getTiddlerRevisionListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	if(status) {
		var content = null;
		try {
			eval('var info=' + responseText);
		} catch (ex) {
			context.statusText = exceptionText(ex,SocialtextAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		list = [];
		for(var i=0; i<info.length; i++) {
			var tiddler = new Tiddler(info[i].name);
			tiddler.modified = SocialtextAdaptor.dateFromEditTime(info[i].last_edit_time);
			tiddler.modifier = info[i].last_editor;
			tiddler.tags = info[i].tags;
			tiddler.fields['server.page.id'] = info[i].page_id;
			tiddler.fields['server.page.name'] = info[i].name;
			tiddler.fields['server.page.revision'] = info[i].revision_id;
			list.push(tiddler);
		}
		var sortField = 'server.page.revision';
		list.sort(function(a,b) {return a.fields[sortField] < b.fields[sortField] ? +1 : (a.fields[sortField] == b.fields[sortField] ? 0 : -1);});
		context.revisions = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

SocialtextAdaptor.prototype.putTiddler = function(tiddler,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.tiddler = tiddler;
	context.title = tiddler.title;
	var uriTemplate = '%0data/workspaces/%1/pages/%2';
	var host = context.host ? context.host : SocialtextAdaptor.fullHostName(tiddler.fields['server.host']);
	var workspace = context.workspace ? context.workspace : tiddler.fields['server.workspace'];
	var uri = uriTemplate.format([host,workspace,tiddler.title,tiddler.text]);
	//var req = doHttp('POST',uri,tiddler.text,SocialtextAdaptor.mimeType,null,null,SocialtextAdaptor.putTiddlerCallback,context,{"X-Http-Method": "PUT"});
	var req = SocialtextAdaptor.doHttpPOST(uri,SocialtextAdaptor.putTiddlerCallback,context,{"X-Http-Method": "PUT"},tiddler.text,SocialtextAdaptor.mimeType);
	return typeof req == 'string' ? req : true;
};

SocialtextAdaptor.putTiddlerCallback = function(status,context,responseText,uri,xhr)
{
	if(status) {
		context.status = true;
	} else {
		context.status = false;
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

SocialtextAdaptor.prototype.close = function()
{
	return true;
};

config.adaptors[SocialtextAdaptor.serverType] = SocialtextAdaptor;
} //# end of 'install only once'
//}}}