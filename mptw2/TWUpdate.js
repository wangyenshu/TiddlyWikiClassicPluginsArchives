/***
''Name:'' TWUpdate
''Author:'' Tom Otvos
''Version:'' 0.2
<<twupdate>>
***/
//{{{

version.extensions.twupdate = {major: 0, minor: 2, revision: 0, date: new Date(2006,3,13,0,0,0,0), source: ""};

config.macros.twupdate = { 
	label: "update",
	sourceUrl: "http://www.tiddlywiki.com/empty.html", 
	lingo: {
		prompt: "Update this TiddlyWiki from TiddlyWiki.com", 
		warning: "Are you sure you want to update this document with the latest version of TiddlyWiki?\n\nIf you want to continue, your document will first be saved with a backup.",
		success: "Update was successful. Click on 'OK' to reload the document",
		errNoHttp: "Unable to allocate an HTTP request object for the update",
		progressLoading: "Getting update from TiddlyWiki.com...",
		progressLoadSuccess: "File successfully loaded",
		progressLoadFailure: "File was not loaded successfully (%0)",
		progressMerging: "Merging with existing document..."
	}
}

config.macros.twupdate.handler = function(place)
{
	if(!readOnly)
		createTiddlyButton(place, this.label, this.prompt, this.onClick, null, null, null);
}

config.macros.twupdate.onClick = function(e)
{
	if (!confirm(config.macros.twupdate.lingo.warning)) return;

	try {
		// force a save with backup
		var saveBackups = config.options.chkSaveBackups;
		config.options.chkSaveBackups = true;
		saveChanges();
		config.options.chkSaveBackups = saveBackups;
		
		var ajax = new AjaxHelper();
		displayMessage(config.macros.twupdate.lingo.progressLoading);
		ajax.getText(config.macros.twupdate.sourceUrl, config.macros.twupdate.performUpdate);		
	}
	catch (e) {
		alert(e);
	}

	return false;
}

config.macros.twupdate.performUpdate = function(emptyHtml, status, statusText)
{
	// note that this is begin called from a callback from an event handler, so
	// "this" is most definitely not defined!
	
	if (status == 200)
		displayMessage(config.macros.twupdate.lingo.progressLoadSuccess);
	else {
		displayMessage(config.macros.twupdate.lingo.progressLoadFailure.format([statusText]));
		return;
	}
	displayMessage(config.macros.twupdate.lingo.progressMerging);
	
	// the bulk of this is cribbed from saveChanges()...
	var originalPath = document.location.toString();
	// Check we were loaded from a file URL
	if (originalPath.substr(0,5) != "file:") {
		alert(config.messages.notFileUrlError);
		if (store.tiddlerExists(config.messages.saveInstructions))
			displayTiddler(null,config.messages.saveInstructions);
		return;
	}
	var localPath = getLocalPath(originalPath);

	// Locate the storeArea div's
	var posOpeningDiv = emptyHtml.indexOf(startSaveArea);
	var posClosingDiv = emptyHtml.lastIndexOf(endSaveArea);
	if ((posOpeningDiv == -1) || (posClosingDiv == -1)) {
		alert(config.messages.invalidFileError.format(['empty.html']));
		return;
	}

	// Save new file
	var revised = emptyHtml.substr(0,posOpeningDiv + startSaveArea.length) + 
				convertUnicodeToUTF8(allTiddlersAsHtml()) + "\n\t\t" +
				emptyHtml.substr(posClosingDiv);
	var newSiteTitle = convertUnicodeToUTF8((wikifyPlain("SiteTitle") + " - " + wikifyPlain("SiteSubtitle")).htmlEncode());
	revised = revised.replaceChunk("<title"+">","</title"+">"," " + newSiteTitle + " ");
	revised = revised.replaceChunk("<!--PRE-HEAD-START--"+">","<!--PRE-HEAD-END--"+">","\n" + store.getTiddlerText("MarkupPreHead","") + "\n");
	revised = revised.replaceChunk("<!--POST-HEAD-START--"+">","<!--POST-HEAD-END--"+">","\n" + store.getTiddlerText("MarkupPostHead","") + "\n");
	revised = revised.replaceChunk("<!--PRE-BODY-START--"+">","<!--PRE-BODY-END--"+">","\n" + store.getTiddlerText("MarkupPreBody","") + "\n");
	revised = revised.replaceChunk("<!--POST-BODY-START--"+">","<!--POST-BODY-END--"+">","\n" + store.getTiddlerText("MarkupPostBody","") + "\n");
	var save = saveFile(localPath, revised);
	if (save) {
		displayMessage(config.messages.mainSaved, "file://" + localPath);
		store.setDirty(false);
		alert(config.macros.twupdate.lingo.success);
		document.location.reload();
	}
	else
		alert(config.messages.mainFailed);
}

function AjaxHelper()
{
	this.http = null;
	
	try
	{
		this.http = new XMLHttpRequest()
	}
	
	catch(e)
	{
		// if we don't get an internal object, try allocating it using ActiveX, with successive
		// fallbacks to earlier MSXML versions as necessary
		try
		{
			this.http = new ActiveXObject("Msxml2.XMLHTTP.4.0")
		} 
		catch(e) 
		{
			try
			{
				this.http = new ActiveXObject("MSXML2.XMLHTTP")
			} 
			catch(e) 
			{
				try
				{
					this.http = new ActiveXObject("Microsoft.XMLHTTP")
				} 
				catch(e) 
				{
					this.http = null
				}
			}
		}
	}
		
	if (!this.http) throw 'Unable to allocate an HTTP request object';
}

AjaxHelper.prototype.getText = function(url, callback, async, force)
{
	if (!this.http) return;
	if (async == undefined) async = true;
	if (force == undefined) force = false;
	// ??? right now, we are not handling "forced" requests
	this._request("GET", url, callback, async, true, false);
}

AjaxHelper.prototype.getXML = function(url, callback, async, force)
{
	if (!this.http) return;
	if (async == undefined) async = true;
	if (force == undefined) force = false;
	// ??? right now, we are not handling "forced" requests
	this._request("GET", url, callback, async, true, true);
}

AjaxHelper.prototype.getHead = function(url, callback, async, force)
{
	if (!this.http) return;
	if (async == undefined) async = true;
	if (force == undefined) force = false;
	// ??? right now, we are not handling "forced" requests
	this._request("HEAD", url, callback, async, false, false);
}

AjaxHelper.prototype.abort = function()
{
	if (this.http) this.http.abort();
}

AjaxHelper.prototype.setRequestHeader = function(name, value)
{
	if (this.http) this.http.setRequestHeader(name, value);
}

AjaxHelper.prototype._request = function(method, url, callback, async, hasResponse, hasResponseXML)
{
	if (!this.http) return;
	
	// get reference to request object so we can use it in closure
	var xmlHttp = this.http, helper = this;
	xmlHttp.onreadystatechange = function()
	{
		if (!async) return;
		if (xmlHttp.readyState == 4)
			callback((hasResponse ? (hasResponseXML ? xmlHttp.responseXML : xmlHttp.responseText) : null), xmlHttp.status, xmlHttp.statusText, helper._parsedResponseHeaders());
	}
	
	try {
		// need some cross-domain privileges for Firefox
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		} 
		catch (e) 
		{
		}
		
		xmlHttp.open(method, url, async);
		xmlHttp.send(null);
		if (!async) callback((hasResponse ? (hasResponseXML ? xmlHttp.responseXML : xmlHttp.responseText) : null), xmlHttp.status, xmlHttp.statusText, this._parsedResponseHeaders());
	}
	
	catch (e)
	{
		alert(e);
	}
}

AjaxHelper.prototype._parsedResponseHeaders = function()
{
	if (this.http) {
		var headersArray = new Array();
		var headers = this.http.getAllResponseHeaders().split("\n");
		for (var i = 0; i < headers.length; i++) {
			var h = headers[i].trim();
			if (h.length == 0) continue;
			// value can have ':' so do not use split here!
			var sep = h.indexOf(':');
			headersArray[h.substring(0, sep).trim()] = h.substr(sep + 1).trim();
		}
		return headersArray;
	}
	else
		return null;
}

//}}}
