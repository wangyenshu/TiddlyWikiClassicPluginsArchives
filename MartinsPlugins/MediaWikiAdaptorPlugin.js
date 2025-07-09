/***
|''Name:''|MediaWikiAdaptorPlugin|
|''Description:''|Adaptor for moving and converting data from MediaWikis|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://www.martinswiki.com/#MediaWikiAdaptorPlugin |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/adaptors/MediaWikiAdaptorPlugin.js |
|''Version:''|0.5.8|
|''Date:''|Jul 27, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]] |
|''~CoreVersion:''|2.2.0|

|''Max number of tiddlers to download''|<<option txtMediaAdaptorLimit>>|


MediaWiki REST documentation is at:
http://meta.wikimedia.org/w/api.php
http://meta.wikimedia.org/w/query.php

***/

//{{{
if(!version.extensions.MediaWikiAdaptorPlugin) {
version.extensions.MediaWikiAdaptorPlugin = {installed:true};

if(config.options.txtMediaAdaptorLimit == undefined)
	{config.options.txtMediaAdaptorLimit = '500';}
	
function MediaWikiAdaptor()
{
	this.host = null;
	this.workspace = null;
	return this;
}

MediaWikiAdaptor.serverType = 'mediawiki';
MediaWikiAdaptor.serverParsingErrorMessage = "Error parsing result from server";
MediaWikiAdaptor.errorInFunctionMessage = "Error in function MediaWikiAdaptor.%0";

MediaWikiAdaptor.doHttpGET = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('GET',uri,data,contentType,username,password,callback,params,headers);
};

MediaWikiAdaptor.prototype.setContext = function(context,userParams,callback)
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

MediaWikiAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	if(!host.match(/:\/\//))
		host = 'http://' + host;
	if(host.substr(host.length-1) != '/')
		host = host + '/';
	return host;
};

MediaWikiAdaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

MediaWikiAdaptor.normalizedTitle = function(title)
{
	var n = title.charAt(0).toUpperCase() + title.substr(1);
	return n.replace(/\s/g,'_');
};

// Convert a MediaWiki timestamp in YYYY-MM-DDThh:mm:ssZ  format into a JavaScript Date object
MediaWikiAdaptor.dateFromTimestamp = function(timestamp)
{
	var dt = timestamp;
	return new Date(Date.UTC(dt.substr(0,4),dt.substr(5,2)-1,dt.substr(8,2),dt.substr(11,2),dt.substr(14,2)));
};

MediaWikiAdaptor.anyChild = function(obj)
{
	for(var key in obj) {
		return obj[key];
	}
	return null;
};

MediaWikiAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	this.host = MediaWikiAdaptor.fullHostName(host);
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

MediaWikiAdaptor.getWorkspaceId = function(workspace)
{
	var workspaces = {
		"media": -2, "special":-1,
		"":0, "talk":1,"user":2,"user talk":3,"meta":4,"meta talk":5,"image":6,"image talk":7,
		"mediawiki":8,"mediawiki talk":9,"template":10,"template talk":11,"help":12,"help talk":13,
		"category":14,"category talk":15};
	workspace = workspace.toLowerCase();
	var id = workspaces[workspace];
	if(!id) {
		if(workspace=="" || workspace=="main")
			id = 0;
		else if(workspace.lastIndexOf("talk") != -1)
			id = 5;
		else
			id = 4;
	}
	return id;
};

MediaWikiAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	if(!workspace)
		workspace = "";
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	if(workspace) {
		if(context.workspaces) {
			for(var i=0;i<context.workspaces.length;i++) {
				if(context.workspaces[i].name == workspace) {
					this.workspaceId = context.workspaces[i].id;
					break;
				}
			}
		} else {
			workspace = workspace.toLowerCase();
			this.workspaceId = MediaWikiAdaptor.getWorkspaceId(workspace);
		}
	}
	if(!this.workspaceId) {
		if(workspace=="" || workspace.toLowerCase()=="main")
			this.workspaceId = 0;
		else if(workspace.lastIndexOf("talk") != -1)
			this.workspaceId = 5;
		else
			this.workspaceId = 4;
	}
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

MediaWikiAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	if(context.workspace) {
		context.status = true;
		context.workspaces = [{name:context.workspace,title:context.workspace}];
		if(context.callback)
			window.setTimeout(function() {callback(context,userParams);},0);
		return true;
	}
	var uriTemplate = '%0api.php?format=json&action=query&meta=siteinfo&siprop=namespaces';
	var uri = uriTemplate.format([context.host]);
	var req = MediaWikiAdaptor.doHttpGET(uri,MediaWikiAdaptor.getWorkspaceListCallback,context);
	return typeof req == 'string' ? req : true;
};


MediaWikiAdaptor.getWorkspaceListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	if(status) {
		try {
			eval('var info=' + responseText);
		} catch (ex) {
			context.statusText = exceptionText(ex,MediaWikiAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		var namespaces = info.query.namespaces;
		var list = [];
		for(var i in namespaces) {
			item = {};
			item.id = namespaces[i]['id'];
			item.title = namespaces[i]['*'];
			item.name = item.title;
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

// get a list of the tiddlers in the current workspace
MediaWikiAdaptor.prototype.getTiddlerList = function(context,userParams,callback,filter)
{
	context = this.setContext(context,userParams,callback);
	if(!context.tiddlerLimit)
		context.tiddlerLimit = config.options.txtMediaAdaptorLimit==0 ? null : config.options.txtMediaAdaptorLimit;

	var limit = context.tiddlerLimit;
	if(filter) {
		var re = /\[(\w+)\[([ \w]+)\]\]/;
		var match = re.exec(filter);
		if(match) {
			var filterParams = MediaWikiAdaptor.normalizedTitle(match[2]);
			switch(match[1]) {
			case 'tag':
				context.responseType = 'pages';
				var uriTemplate = '%0query.php?format=json&what=category&cpnamespace=%1&cplimit=%2&cptitle=%3';
				break;
			case 'template':
				context.responseType = 'query.embeddedin';
				uriTemplate = '%0api.php?format=json&action=query&list=embeddedin&einamespace=0&eititle=Template:%3';
				if(limit)
					uriTemplate += '&eilimit=%2';
				break;
			default:
				break;
			}
		} else {
			var list = [];
			var params = filter.parseParams('anon',null,false);
			for(var i=1; i<params.length; i++) {
				var tiddler = new Tiddler(params[i].value);
				tiddler.fields.workspaceId = this.workspaceId;
				list.push(tiddler);
			}
			context.tiddlers = list;
			context.status = true;
			if(context.callback)
				window.setTimeout(function() {callback(context,userParams);},0);
			return true;
		}
	} else {
		context.responseType = 'query.allpages';
		uriTemplate = '%0api.php?format=json&action=query&list=allpages';
		if(this.workspaceId != 0)
			uriTemplate += '&apnamespace=%1';
		if(limit)
			uriTemplate += '&aplimit=%2';
	}
	var host = MediaWikiAdaptor.fullHostName(this.host);
	var uri = uriTemplate.format([host,this.workspaceId,limit,filterParams]);
	var req = MediaWikiAdaptor.doHttpGET(uri,MediaWikiAdaptor.getTiddlerListCallback,context);
	return typeof req == 'string' ? req : true;
};



MediaWikiAdaptor.getTiddlerListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = MediaWikiAdaptor.errorInFunctionMessage.format(['getTiddlerListCallback']);
	if(status) {
		try {
			eval('var info=' + responseText);
			var pages;
			if(context.responseType == 'query.embeddedin')
				pages = info.query.embeddedin;
			else if(context.responseType == 'query.allpages')
				pages = info.query.allpages;
			else
				pages = info.pages;
			var list = [];
			for(i in pages) {
				var title = pages[i].title;
				if(title && !store.isShadowTiddler(title)) {
					tiddler = new Tiddler(title);
					tiddler.fields.workspaceId = pages[i].ns;
					list.push(tiddler);
				}
			}
			context.tiddlers = list;
		} catch (ex) {
			context.statusText = exceptionText(ex,MediaWikiAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

MediaWikiAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	var host = this && this.host ? this.host : MediaWikiAdaptor.fullHostName(tiddler.fields['server.host']);
	if(host.match(/w\/$/)) {
		host = host.replace(/w\/$/,'');
		var uriTemplate = '%0wiki/%2';
	} else {
		uriTemplate = '%0index.php?title=%2';
	}
	info.uri = uriTemplate.format([host,this.workspace,tiddler.title]);
	return info;
};

MediaWikiAdaptor.prototype.getTiddlerRevision = function(title,revision,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.revision = revision;
	return this.getTiddlerInternal(title,context,userParams,callback);
};

MediaWikiAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = title;
	var host = MediaWikiAdaptor.fullHostName(context.host);
	var uriTemplate = '%0api.php?format=json&action=query&prop=revisions&titles=%1&rvprop=content|timestamp|user';
	if(context.revision)
		uriTemplate += '&rvstartid=%2&rvlimit=1';
	uri = uriTemplate.format([host,MediaWikiAdaptor.normalizedTitle(context.title),context.revision]);
	context.tiddler = new Tiddler(context.title);
	context.tiddler.fields.wikiformat = 'mediawiki';
	context.tiddler.fields['server.host'] = MediaWikiAdaptor.minHostName(host);
	var req = MediaWikiAdaptor.doHttpGET(uri,MediaWikiAdaptor.getTiddlerCallback,context);
	return typeof req == 'string' ? req : true;
};


MediaWikiAdaptor.prototype.getTiddlerPostProcess = function(context)
{
	return context.tiddler;
};

MediaWikiAdaptor.getTiddlerCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	if(status) {
		var content = null;
		try {
			eval('var info=' + responseText);
			var page = MediaWikiAdaptor.anyChild(info.query.pages);
			var revision = MediaWikiAdaptor.anyChild(page.revisions);
			var text = revision['*'];
			context.tiddler.fields['server.page.revision'] = String(revision['revid']);
			var host = context.tiddler.fields['server.host'];
			if(host.indexOf('wikipedia')==-1) {
				context.tiddler.modified = MediaWikiAdaptor.dateFromTimestamp(revision['timestamp']);
				context.tiddler.modifier = revision['user'];
			} else {
				// content is from wikipedia
				context.tiddler.created = version.date;
				context.tiddler.modified= version.date;
				// remove links to other language articles
				text = text.replace(/\[\[[a-z\-]{2,12}:(?:.*?)\]\](?:\r?)(?:\n?)/g,'');
			}
			context.tiddler.text = text;
			var catRegExp = /\[\[(Category:[^|\]]*?)\]\]/mg;
			var tags = '';
			var delim = '';
			catRegExp.lastIndex = 0;
			var match = catRegExp.exec(text);
			while(match) {
				tags += delim;
				if(match[1].indexOf(' ')==-1)
					tags += match[1];
				else
					tags += '[[' + match[1] + ']]';
				delim = ' ';
				match = catRegExp.exec(text);
			}
			context.tiddler.tags = tags;
			context.tiddler = context.adaptor.getTiddlerPostProcess.call(context.adaptor,context);
		} catch (ex) {
			context.statusText = exceptionText(ex,MediaWikiAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};


MediaWikiAdaptor.prototype.getTiddlerRevisionList = function(title,limit,context,userParams,callback)
// get a list of the revisions for a tiddler
{
	context = this.setContext(context,userParams,callback);

	var uriTemplate = '%0api.php?format=json&action=query&prop=revisions&titles=%1&rvlimit=%2&rvprop=timestamp|user|comment';
	if(!limit)
		limit = 5;
	var host = MediaWikiAdaptor.fullHostName(context.host);
	var uri = uriTemplate.format([host,MediaWikiAdaptor.normalizedTitle(title),limit]);

	var req = MediaWikiAdaptor.doHttpGET(uri,MediaWikiAdaptor.getTiddlerRevisionListCallback,context);
	return typeof req == 'string' ? req : true;
};

MediaWikiAdaptor.getTiddlerRevisionListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	if(status) {
		var content = null;
		try {
			eval('var info=' + responseText);
			var page = MediaWikiAdaptor.anyChild(info.query.pages);
			var title = page.title;
			var revisions = page.revisions;
			var list = [];
			for(var i in revisions) {
				var tiddler = new Tiddler(title);
				tiddler.modified = MediaWikiAdaptor.dateFromTimestamp(revisions[i].timestamp);
				tiddler.modifier = revisions[i].user;
//�displayMessage("tm"+tiddler.modifier);
				tiddler.fields.comment = revisions[i].comment;
				tiddler.fields['server.page.id'] = MediaWikiAdaptor.normalizedTitle(title);
				tiddler.fields['server.page.name'] = title;
				//tiddler.fields['server.page.revision'] = String(revisions[i].revid);
				list.push(tiddler);
			}
			context.revisions = list;
		} catch (ex) {
			context.statusText = exceptionText(ex,MediaWikiAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

// MediaWikiAdaptor.prototype.putTiddler not supported
MediaWikiAdaptor.prototype.close = function()
{
	return true;
};

config.adaptors[MediaWikiAdaptor.serverType] = MediaWikiAdaptor;
} // end of 'install only once'
//}}}