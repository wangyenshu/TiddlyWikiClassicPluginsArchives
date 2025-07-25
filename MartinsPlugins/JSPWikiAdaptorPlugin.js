/***
|''Name:''|JSPWikiAdaptorPlugin|
|''Description:''|Adaptor for moving and converting data to and from JSP Wikis|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://www.martinswiki.com/#JSPWikiAdaptorPlugin |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/adaptors/JSPWikiAdaptorPlugin.js |
|''Version:''|0.5.2|
|''Date:''|May 7, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.2.0|

JSPWiki RPC documentation is at:
http://www.JSPWiki.org/wiki/WikiRPCInterface2
http://www.JSPWiki.org/RPC2/

''For debug:''
|''Default JSPWiki Server''|<<option txtJSPWikiDefaultServer>>|
|''Default JSPWiki username''|<<option txtJSPWikiUsername>>|
|''Default JSPWiki password''|<<option txtJSPWikiPassword>>|

***/

//{{{
if(!config.options.txtJSPWikiDefaultServer)
	{config.options.txtJSPWikiDefaultServer = 'www.jspwiki.org';}
if(!config.options.txtJSPWikiUsername)
	{config.options.txtJSPWikiUsername = '';}
if(!config.options.txtJSPWikiPassword)
	{config.options.txtJSPWikiPassword = '';}
if(!config.options.chkJSPWikiPasswordRequired)
	{config.options.chkJSPWikiPasswordRequired = true;}
//}}}

//{{{
if(!version.extensions.JSPWikiAdaptorPlugin) {
version.extensions.JSPWikiAdaptorPlugin = {installed:true};

function JSPWikiAdaptor()
{
	this.host = null;
	this.workspace = null;
	return this;
}

JSPWikiAdaptor.serverType = 'jspwiki';
JSPWikiAdaptor.serverParsingErrorMessage = "Error parsing result from server";
JSPWikiAdaptor.errorInFunctionMessage = "Error in function JSPWikiAdaptor.%0";

JSPWikiAdaptor.prototype.setContext = function(context,userParams,callback)
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

JSPWikiAdaptor.doHttpGET = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('GET',uri,data,contentType,username,password,callback,params,headers);
};

JSPWikiAdaptor.doHttpPOST = function(uri,callback,params,headers,data,contentType,username,password)
{
	return doHttp('POST',uri,data,contentType,username,password,callback,params,headers);
};

JSPWikiAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	if(!host.match(/:\/\//))
		host = 'http://' + host;
	if(host.substr(host.length-1) != '/')
		host = host + '/';
	return host;
};

JSPWikiAdaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

JSPWikiAdaptor.normalizedTitle = function(title)
{
	return title;
};

JSPWikiAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	this.host = JSPWikiAdaptor.fullHostName(host);
	context = this.setContext(context,userParams,callback);
	this.username = config.options.txttwikiUsername;
	this.password = config.options.txttwikiPassword;
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

JSPWikiAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

JSPWikiAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var list = [];
	list.push({title:"Main",name:"Main"});
	context.workspaces = list;
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

JSPWikiAdaptor.prototype.getTiddlerList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0RPCU/';
	var uri = uriTemplate.format([context.host]);

	var fn = 'wiki.getAllPages';
	var fnTemplate = '<?xml version="1.0"?><methodCall><methodName>%0</methodName></methodCall>';
	var payload = fnTemplate.format([fn]);
	var req =doHttp('POST',uri,payload,null,null,null,JSPWikiAdaptor.getTiddlerListCallback,context);
	return typeof req == 'string' ? req : true;
};

//*<?xml version="1.0" encoding="UTF-8"?><methodResponse><params><param><value><array><data>

JSPWikiAdaptor.getTiddlerListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = JSPWikiAdaptor.errorInFunctionMessage.format(['getTiddlerListCallback']);
	if(status) {
		try {
			var text = responseText;
			text = text.replace('<?xml version="1.0" encoding="UTF-8"?><methodResponse><params><param><value><array><data>','');
			text = text.replace('</data></array></value></param></params></methodResponse>','');
			var list = [];
			var matchRegExp = /<value>([^<]*)<\/value>/mg;
			matchRegExp.lastIndex = 0;
			var match = matchRegExp.exec(text);
			while(match) {
				var tiddler = new Tiddler(match[1]);
				list.push(tiddler);
				match = matchRegExp.exec(text);
			}
		} catch (ex) {
			context.statusText = exceptionText(ex,config.messages.serverParsingError);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.tiddlers = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

JSPWikiAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	var host = this && this.host ? this.host : JSPWikiAdaptor.fullHostName(tiddler.fields['server.host']);
	var workspace = this && this.workspace ? this.workspace : tiddler.fields['server.workspace'];
	uriTemplate = '%0wiki/%2';
	info.uri = uriTemplate.format([host,workspace,tiddler.title]);
	return info;
};

JSPWikiAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);

	var uriTemplate = '%0RPCU/';
	var uri = uriTemplate.format([context.host]);

	var fn = 'wiki.getPage';
	var fnParamsTemplate ='<params><param><value><string>%0</string></value></param></params>';
	var fnParams = fnParamsTemplate.format([title]);
	var fnTemplate = '<?xml version="1.0"?><methodCall><methodName>%0</methodName>%1</methodCall>';
	var payload = fnTemplate.format([fn,fnParams]);

	context.tiddler = new Tiddler(title);
	context.tiddler.fields.wikiformat = 'jspwiki';
	context.tiddler.fields['server.host'] = JSPWikiAdaptor.minHostName(context.host);
	//context.tiddler.fields['server.workspace'] = workspace;
	var req =doHttp('POST',uri,payload,null,null,null,JSPWikiAdaptor.getTiddlerCallback,context);
	return typeof req == 'string' ? req : true;
};

JSPWikiAdaptor.getTiddlerCallback = function(status,context,responseText,uri,xhr)
{
	if(status) {
		var text = responseText;
		text = text.replace('<?xml version="1.0" encoding="UTF-8"?><methodResponse><params><param><value>','');
		text = text.replace('</value></param></params></methodResponse>','');
		context.tiddler.text = text;
		context.status = true;
	} else {
		context.status = false;
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

JSPWikiAdaptor.prototype.putTiddler = function(tiddler,context,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = tiddler.title;

	var fn = 'wiki.putPage';
	var uriTemplate = '%0RPC2/';
	var host = context.host ? context.host : JSPWikiAdaptor.fullHostName(context.tiddler.fields['server.host']);
	var workspace = context.workspace ? context.workspace : context.tiddler.fields['server.workspace'];
	var uri = uriTemplate.format([host,workspace,tiddler.title]);

	var fnParamsTemplate ='<params>';
	fnParamsTemplate += '<param><value><string>%0</string></value></param>';
	fnParamsTemplate += '<param><value><string>%1</string></value></param>';
	fnParamsTemplate += '</params>';
	var fnParams = fnParamsTemplate.format([tiddler.title,tiddler.text]);
	var fnTemplate = '<?xml version="1.0"?><methodCall><methodName>%0</methodName>%1</methodCall>';
	var payload = fnTemplate.format([fn,fnParams]);

	var req = doHttp('POST',uri,payload,null,this.username,this.password,JSPWikiAdaptor.putTiddlerCallback,tiddler);
	return typeof req == 'string' ? req : true;
};

JSPWikiAdaptor.putTiddlerCallback = function(status,context,responseText,uri,xhr)
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

JSPWikiAdaptor.prototype.close = function() {return true;};

config.adaptors[JSPWikiAdaptor.serverType] = JSPWikiAdaptor;
} // end of 'install only once'
//}}}