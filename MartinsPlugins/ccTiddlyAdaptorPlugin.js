/***
|''Name:''|ccTiddlyAdaptorPlugin|
|''Description:''|Adaptor for moving and converting data to and from ccTiddly wikis|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://www.martinswiki.com/#ccTiddlyAdaptorPlugin|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/adaptors/ccTiddlyAdaptorPlugin.js|
|''Version:''|0.5.2|
|''Date:''|Feb 25, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.2.0|

''For debug:''
|''Default ccTiddly username''|<<option txtccTiddlyUsername>>|
|''Default ccTiddly password''|<<option txtccTiddlyPassword>>|


***/

//{{{
if(!config.options.txtccTiddlyUsername)
	{config.options.txtccTiddlyUsername = '';}
if(!config.options.txtccTiddlyPassword)
	{config.options.txtccTiddlyPassword = '';}
//}}}

// Ensure that the plugin is only installed once.
if(!version.extensions.ccTiddlyAdaptorPlugin) {
version.extensions.ccTiddlyAdaptorPlugin = {installed:true};

function ccTiddlyAdaptor()
{
	this.host = null;
	this.workspace = null;
	// for debug
	this.username = config.options.txtccTiddlyUsername;
	this.password = config.options.txtccTiddlyPassword;
	return this;
}

ccTiddlyAdaptor.serverType = 'cctiddly';
ccTiddlyAdaptor.serverParsingErrorMessage = "Error parsing result from server";
ccTiddlyAdaptor.errorInFunctionMessage = "Error in function ccTiddlyAdaptor.%0";

ccTiddlyAdaptor.doHttpGET = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('GET',uri,data,contentType,username,password,callback,params,headers);
};

ccTiddlyAdaptor.doHttpPOST = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('POST',uri,data,contentType,username,password,callback,params,headers);
};

ccTiddlyAdaptor.prototype.setContext = function(context,userParams,callback)
{
	if(!context) context = {};
	context.userParams = userParams;
	if(callback) context.callback = callback;
	context.adaptor = this;
	return context;
};

ccTiddlyAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	if(!host.match(/:\/\//))
		host = 'http://' + host;
	if(host.substr(-1) != '/')
		host = host + '/';
	return host;
};

ccTiddlyAdaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

ccTiddlyAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	this.host = ccTiddlyAdaptor.fullHostName(host);
	if(context.callback) {
		context.status = true;
		window.setTimeout(context.callback,0,context,userParams);
	}
	return true;
};

ccTiddlyAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	this.workspace = workspace;
	if(context.callback) {
		context.status = true;
		window.setTimeout(context.callback,0,context,userParams);
	}
	return true;
};

ccTiddlyAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var list = [];
	list.push({title:"Main",name:"Main"});
	context.workspaces = list;
	if(context.callback) {
		context.status = true;
		window.setTimeout(context.callback,0,context,userParams);
	}
	return true;
};

ccTiddlyAdaptor.prototype.getTiddlerList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	//var uriTemplate = '%0msghandle.php?action=content';
	var uriTemplate = '%0msghandle.php?action=content&username=%1&password=%2';
	var host = ccTiddlyAdaptor.fullHostName(this.host);
	var uri = uriTemplate.format([host,this.workspace,this.username,this.password]);
	var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerListCallback,context);
	return typeof req == 'string' ? req : true;
};

ccTiddlyAdaptor.getTiddlerListCallback = function(status,context,responseText,uri,xhr)
{
displayMessage('getTiddlerListCallback status:'+status);
displayMessage('rt:'+responseText.substr(0,80));
	context.status = false;
	context.statusText = ccTiddlyAdaptor.errorInFunctionMessage.format(['getTiddlerListCallback']);
	if(status) {
		try {
			list = [];
			/*var titles = responseText.split('\n');
			for(var i=0; i<titles.length; i++) {
				var tiddler = new Tiddler(titles[i]);
				list.push(tiddler);
			}*/
			if(list.length==0) {
				list.push(new Tiddler('About')); //kludge until get support for listTiddlers in ccTiddly
			}
			context.tiddlers = list;
		} catch (ex) {
			context.statusText = exceptionText(ex,ccTiddlyAdaptor.serverParsingErrorMessage);
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

ccTiddlyAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	var uriTemplate = '%0#%2';
	var host = ccTiddlyAdaptor.fullHostName(this.host);
	info.uri = uriTemplate.format([this.host,this.workspace,tiddler.title]);
	return info;
};

ccTiddlyAdaptor.prototype.getTiddlerRevision = function(title,revision,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.revision = revision;
	return this.getTiddler(title,null,context,userParams,callback);
};

ccTiddlyAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = title;
	//title = encodeURIComponent(title);
	var host = ccTiddlyAdaptor.fullHostName(this.host);
	context.tiddler = new Tiddler(title);
	context.tiddler.fields['server.host'] = ccTiddlyAdaptor.minHostName(host);
	context.tiddler.fields['server.type'] = ccTiddlyAdaptor.serverType;
	if(revision) {
		var uriTemplate = '%0msghandle.php?action=revisionDisplay&title=%1&revision=%2';
		var uri = uriTemplate.format([host,title,revision]);
		var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerCallback2,context);
	} else {
		// first get the revision list
		uriTemplate = '%0msghandle.php?action=revisionList&title=%1';
		uri = uriTemplate.format([host,title]);
		req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerCallback1,context);
	}
	return typeof req == 'string' ? req : true;
};



ccTiddlyAdaptor.getTiddlerCallback1 = function(status,context,responseText,xhr)
{
	context.status = false;
	context.statusText = ccTiddlyAdaptor.errorInFunctionMessage.format(['getTiddlerCallback']);
	if(status) {
		var revs = responseText.split('\n');
		var parts = revs[0].split(' ');
		var tiddlerRevision = parts[1];
		// now get the latest revision
		var uriTemplate = '%0msghandle.php?action=revisionDisplay&title=%1&revision=%2';
		var host = ccTiddlyAdaptor.fullHostName(context.adaptor.host);
		var uri = uriTemplate.format([host,context.tiddler.title,tiddlerRevision]);
		var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerCallback2,context);
	} else {
		context.statusText = xhr.statusText;
	if(context.callback)
		context.callback(context,context.userParams);
	}
};


ccTiddlyAdaptor.getTiddlerCallback2 = function(status,context,responseText,xhr)
{
	context.status = false;
	if(status) {
		var x = responseText.split('\n');
		try {
			context.tiddler.text = x[2] ? x[2].unescapeLineBreaks().htmlDecode() : '';
			context.tiddler.modifier = x[3];
			if(x[4])
				context.tiddler.created = Date.convertFromYYYYMMDDHHMM(x[4]);
			if(x[5])
				context.tiddler.modified = Date.convertFromYYYYMMDDHHMM(x[5]);
			//context.tiddler.tags = x[6].join(' ');
		} catch(ex) {
			context.statusText = exceptionText(ex,ccTiddlyAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};


ccTiddlyAdaptor.prototype.getTiddlerRevisionList = function(title,context,userParams,callback)
// get a list of the revisions for a page
{
	context = this.setContext(context,userParams,callback);
	title = encodeURIComponent(title);
	var uriTemplate = '%0handle.revisionlist.php?XXX&workspace=%1&title=%2';
	var host = ccTiddlyAdaptor.fullHostName(this.host);
	var uri = uriTemplate.format([host,workspace,title]);
	context.tiddler = new Tiddler(title);
	context.tiddler.fields['server.host'] = ccTiddlyAdaptor.minHostName(host);
	context.tiddler.fields['server.type'] = ccTiddlyAdaptor.serverType;
	var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerRevisionListCallback,context);
};

ccTiddlyAdaptor.getTiddlerRevisionListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	if(status) {
		list = [];
		var r =  responseText;
		if(r != '-') {
			var revs = r.split('\n');
			var list = [];
			for(var i=0; i<revs.length; i++) {
				var parts = revs[i].split(' ');
				if(parts.length>1) {
					var tiddler = new Tiddler(context.tiddler.title);
					tiddler.modified = Date.convertFromYYYYMMDDHHMM(parts[0]);
					tiddler.fields['server.page.revision'] = String(parts[1]);
					list.push(tiddler);
				}
			}
		}
		context.revisions = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

ccTiddlyAdaptor.prototype.putTiddler = function(tiddler,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = tiddler.title;
	var title = encodeURIComponent(tiddler.title);
	var host = this && this.host ? this.host : ccTiddlyAdaptor.fullHostName(tiddler.fields['server.host']);
	var uriTemplate = '%0handle/save.php?XXX&workspace=%1&title=%2';
	var uri = uriTemplate.format([host,title]);

	context.tiddler = tiddler;
	context.tiddler.fields['server.host'] = ccTiddlyAdaptor.minHostName(host);
	context.tiddler.fields['server.type'] = ccTiddlyAdaptor.serverType;
/*	doHttp('POST'
		,serverside.url + '/handle/save.php?' + serverside.queryString + '&workspace=' + serverside.workspace
		,'tiddler=' + encodeURIComponent(store.getSaver().externalizeTiddler(store,tiddler))
			+ '&otitle=' + encodeURIComponent(title.htmlDecode())
			+ ((omodified!==null)?'&omodified=' + encodeURIComponent(omodified.convertToYYYYMMDDHHMM()):"")
			+ ((ochangecount!==null)?'&ochangecount=' + encodeURIComponent(ochangecount):"")
		,null, null, null
		,serverside.fn.genericCallback
	);
*/
	var req = ccTiddlyAdaptor.doHttpPOST(uri,ccTiddlyAdaptor.putTiddlerCallback,tiddler.text,null,payload)
	return typeof req == 'string' ? req : true;
};

ccTiddlyAdaptor.putTiddlerCallback = function(status,context,responseText,uri,xhr)
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

ccTiddlyAdaptor.prototype.deleteTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = title;
	var title = encodeURIComponent(tiddler.title);
	var host = this && this.host ? this.host : ccTiddlyAdaptor.fullHostName(tiddler.fields['server.host']);
	var uriTemplate = '%0handle/delete.php?XXX&workspace=%1&title=%2';
	var uri = uriTemplate.format([host,workspace,title]);

	var req = ccTiddlyAdaptor.doHttpPOST(uri,ccTiddlyAdaptor.deleteTiddlerCallback,title)
	return typeof req == 'string' ? req : true;
};

ccTiddlyAdaptor.deleteTiddlerCallback = function(status,context,responseText,uri,xhr)
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

ccTiddlyAdaptor.prototype.close = function() {return true;};

config.adaptors[ccTiddlyAdaptor.serverType] = ccTiddlyAdaptor;
} // end of 'install only once'
//}}}