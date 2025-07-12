/***
<<tiddler UploadPluginDoc>>
!Code
***/
//{{{
version.extensions.UploadPlugin = {
	major: 3, minor: 3, revision: 3, 
	date: new Date(2006,6,30),
	type: 'macro',
	source: 'http://tiddlywiki.bidix.info/#UploadPlugin',
	docs: 'http://tiddlywiki.bidix.info/#UploadPluginDoc'
};
//}}}

////+++!![config.lib.file]

//{{{
if (!config.lib) config.lib = {};
if (!config.lib.file) config.lib.file= {
	author: 'BidiX',
	version: {major: 0, minor: 1, revision: 0}, 
	date: new Date(2006,3,9)
};
config.lib.file.dirname = function (filePath) {
	var lastpos;
	if ((lastpos = filePath.lastIndexOf("/")) != -1) {
		return filePath.substring(0, lastpos);
	} else {
		return filePath.substring(0, filePath.lastIndexOf("\\"));
	}
};
config.lib.file.basename = function (filePath) {
	var lastpos;
	if ((lastpos = filePath.lastIndexOf("#")) != -1) 
		filePath = filePath.substring(0, lastpos);
	if ((lastpos = filePath.lastIndexOf("/")) != -1) {
		return filePath.substring(lastpos + 1);
	} else
		return filePath.substring(filePath.lastIndexOf("\\")+1);
};
window.basename = function() {return "@@deprecated@@";};
//}}}
////===

////+++!![config.lib.log]

//{{{
if (!config.lib) config.lib = {};
if (!config.lib.log) config.lib.log= {
	author: 'BidiX',
	version: {major: 0, minor: 1, revision: 0}, 
	date: new Date(2006,3,9)
};
config.lib.Log = function(tiddlerTitle, logHeader) {
	if (version.major < 2)
		this.tiddler = store.tiddlers[tiddlerTitle];
	else
		this.tiddler = store.getTiddler(tiddlerTitle);
	if (!this.tiddler) {
		this.tiddler = new Tiddler();
		this.tiddler.title = tiddlerTitle;
		this.tiddler.text = "| !date | !user | !location |" + logHeader;
		this.tiddler.created = new Date();
		this.tiddler.modifier = config.options.txtUserName;
		this.tiddler.modified = new Date();
	if (version.major < 2)
		store.tiddlers[tiddlerTitle] = this.tiddler;
	else
		store.addTiddler(this.tiddler);
	}
	return this;
};

config.lib.Log.prototype.newLine = function (line) {
	var now = new Date();
	var newText = "| ";
	newText += now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear() + " ";
	newText += now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+" | ";
	newText += config.options.txtUserName + " | ";
	var location = document.location.toString();
	var filename = config.lib.file.basename(location);
	if (!filename) filename = '/';
	newText += "[["+filename+"|"+location + "]] |";
	this.tiddler.text = this.tiddler.text + "\n" + newText;
	this.addToLine(line);
};

config.lib.Log.prototype.addToLine = function (text) {
	this.tiddler.text = this.tiddler.text + text;
	this.tiddler.modifier = config.options.txtUserName;
	this.tiddler.modified = new Date();
	if (version.major < 2)
	store.tiddlers[this.tiddler.tittle] = this.tiddler;
	else {
		store.addTiddler(this.tiddler);
		story.refreshTiddler(this.tiddler.title);
		store.notify(this.tiddler.title, true);
	}
	if (version.major < 2)
		store.notifyAll(); 
};
//}}}
////===

////+++!![config.lib.options]

//{{{
if (!config.lib) config.lib = {};
if (!config.lib.options) config.lib.options = {
	author: 'BidiX',
	version: {major: 0, minor: 1, revision: 0}, 
	date: new Date(2006,3,9)
};

config.lib.options.init = function (name, defaultValue) {
	if (!config.options[name]) {
		config.options[name] = defaultValue;
		saveOptionCookie(name);
	}
};
//}}}
////===

////+++!![PasswordTweak]

//{{{
version.extensions.PasswordTweak = {
	major: 1, minor: 0, revision: 2, date: new Date(2006,3,11),
	type: 'tweak',
	source: 'http://tiddlywiki.bidix.info/#PasswordTweak'
};
//}}}
/***
!!config.macros.option
***/
//{{{
config.macros.option.passwordCheckboxLabel = "Save this password on this computer";
config.macros.option.passwordType = "password"; // password | text

config.macros.option.onChangeOption = function(e)
{
	var opt = this.getAttribute("option");
	var elementType,valueField;
	if(opt) {
		switch(opt.substr(0,3)) {
			case "txt":
				elementType = "input";
				valueField = "value";
				break;
			case "pas":
				elementType = "input";
				valueField = "value";
				break;
			case "chk":
				elementType = "input";
				valueField = "checked";
				break;
		}
		config.options[opt] = this[valueField];
		saveOptionCookie(opt);
		var nodes = document.getElementsByTagName(elementType);
		for(var t=0; t<nodes.length; t++) {
			var optNode = nodes[t].getAttribute("option");
			if (opt == optNode) 
				nodes[t][valueField] = this[valueField];
		}
	}
	return(true);
};

config.macros.option.handler = function(place,macroName,params)
{
    var opt = params[0];
	var size = 15;
	if (params[1])
		size = params[1];
    if(config.options[opt] === undefined) {
        return;}
    var c;
    switch(opt.substr(0,3)) {
		case "txt":
			c = document.createElement("input");
			c.onkeyup = this.onChangeOption;
			c.setAttribute ("option",opt);
			c.size = size;
			c.value = config.options[opt];
			place.appendChild(c);
			break;
		case "pas":
			// input password
			c = document.createElement ("input");
			c.setAttribute("type",config.macros.option.passwordType);
			c.onkeyup = this.onChangeOption;
			c.setAttribute("option",opt);
			c.size = size;
			c.value = config.options[opt];
			place.appendChild(c);
			// checkbox link with this password "save this password on this computer"
			c = document.createElement("input");
			c.setAttribute("type","checkbox");
			c.onclick = this.onChangeOption;
			c.setAttribute("option","chk"+opt);
			place.appendChild(c);
			c.checked = config.options["chk"+opt];
			// text savePasswordCheckboxLabel
			place.appendChild(document.createTextNode(config.macros.option.passwordCheckboxLabel));
			break;
		case "chk":
			c = document.createElement("input");
			c.setAttribute("type","checkbox");
			c.onclick = this.onChangeOption;
			c.setAttribute("option",opt);
			place.appendChild(c);
			c.checked = config.options[opt];
			break;
	}
};
//}}}
/***
!! Option cookie stuff
***/
//{{{
window.loadOptionsCookie_orig_PasswordTweak = window.loadOptionsCookie;
window.loadOptionsCookie = function()
{
	var cookies = document.cookie.split(";");
	for(var c=0; c<cookies.length; c++) {
		var p = cookies[c].indexOf("=");
		if(p != -1) {
			var name = cookies[c].substr(0,p).trim();
			var value = cookies[c].substr(p+1).trim();
			switch(name.substr(0,3)) {
				case "txt":
					config.options[name] = unescape(value);
					break;
				case "pas":
					config.options[name] = unescape(value);
					break;
				case "chk":
					config.options[name] = value == "true";
					break;
			}
		}
	}
};

window.saveOptionCookie_orig_PasswordTweak = window.saveOptionCookie;
window.saveOptionCookie = function(name)
{
	var c = name + "=";
	switch(name.substr(0,3)) {
		case "txt":
			c += escape(config.options[name].toString());
			break;
		case "chk":
			c += config.options[name] ? "true" : "false";
			// is there an option link with this chk ?
			if (config.options[name.substr(3)]) {
				saveOptionCookie(name.substr(3));
			}
			break;
		case "pas":
			if (config.options["chk"+name]) {
				c += escape(config.options[name].toString());
			} else {
				c += "";
			}
			break;
	}
	c += "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/";
	document.cookie = c;
};
//}}}
/***
!! Initializations
***/
//{{{
// define config.options.pasPassword
if (!config.options.pasPassword) {
	config.options.pasPassword = 'defaultPassword';
	window.saveOptionCookie('pasPassword');
}
// since loadCookies is first called befor password definition
// we need to reload cookies
window.loadOptionsCookie();
//}}}
////===

////+++!![config.macros.upload]

//{{{
config.macros.upload = {
	accessKey: "U",
	formName: "UploadPlugin",
	contentType: "text/html;charset=UTF-8",
	defaultStoreScript: "store.php"
};

// only this two configs need to be translated
config.macros.upload.messages = {
	aboutToUpload: "About to upload TiddlyWiki to %0",
	errorDownloading: "Error downloading",
	errorUploadingContent: "Error uploading content",
	fileNotFound: "file to upload not found",
	fileNotUploaded: "File %0 NOT uploaded",
	mainFileUploaded: "Main TiddlyWiki file uploaded to %0",
	urlParamMissing: "url param missing",
	rssFileNotUploaded: "RssFile %0 NOT uploaded",
	rssFileUploaded: "Rss File uploaded to %0"
};

config.macros.upload.label = {
	promptOption: "Save and Upload this TiddlyWiki with UploadOptions",
	promptParamMacro: "Save and Upload this TiddlyWiki in %0",
	saveLabel: "save to web", 
	saveToDisk: "save to disk",
	uploadLabel: "upload"	
};

config.macros.upload.handler = function(place,macroName,params){
	// parameters initialization
	var storeUrl = params[0];
	var toFilename = params[1];
	var backupDir = params[2];
	var uploadDir = params[3];
	var username = params[4];
	var password; // for security reason no password as macro parameter
	var label;
	if (document.location.toString().substr(0,4) == "http")
		label = this.label.saveLabel;
	else
		label = this.label.uploadLabel;
	var prompt;
	if (storeUrl) {
		prompt = this.label.promptParamMacro.toString().format([this.dirname(storeUrl)]);
	}
	else {
		prompt = this.label.promptOption;
	}
	createTiddlyButton(place, label, prompt, 
						function () {
							config.macros.upload.upload(storeUrl, toFilename, uploadDir, backupDir, username, password); 
							return false;}, 
						null, null, this.accessKey);
};
config.macros.upload.UploadLog = function() {
	return new config.lib.Log('UploadLog', " !storeUrl | !uploadDir | !toFilename | !backupdir | !origin |" );
};
config.macros.upload.UploadLog.prototype = config.lib.Log.prototype;
config.macros.upload.UploadLog.prototype.startUpload = function(storeUrl, toFilename, uploadDir,  backupDir) {
	var line = " [[" + config.lib.file.basename(storeUrl) + "|" + storeUrl + "]] | ";
	line += uploadDir + " | " + toFilename + " | " + backupDir + " |";
	this.newLine(line);
};
config.macros.upload.UploadLog.prototype.endUpload = function() {
	this.addToLine(" Ok |");
};
config.macros.upload.basename = config.lib.file.basename;
config.macros.upload.dirname = config.lib.file.dirname;
config.macros.upload.upload = function(storeUrl, toFilename, uploadDir, backupDir, username, password)
{
	// parameters initialization
	storeUrl = (storeUrl ? storeUrl : config.options.txtUploadStoreUrl);
	toFilename = (toFilename ? toFilename : config.options.txtUploadFilename);
	backupDir = (backupDir ? backupDir : config.options.txtUploadBackupDir);
	uploadDir = (uploadDir ? uploadDir : config.options.txtUploadDir);
	username = (username ? username : config.options.txtUploadUserName);
	password = config.options.pasUploadPassword; // for security reason no password as macro parameter
	if (storeUrl === '') {
		config.macros.upload.defaultStoreScript;
	}
	if (config.lib.file.dirname(storeUrl) === '') {
		storeUrl = config.lib.file.dirname(document.location.toString())+'/'+storeUrl;
	}
	if (toFilename === '') {
		toFilename = config.lib.file.basename(document.location.toString());
	}

	clearMessage();
	// only for forcing the message to display
	 if (version.major < 2)
		store.notifyAll();
	if (!storeUrl) {
		alert(config.macros.upload.messages.urlParamMissing);
		return;
	}
	
	var log = new this.UploadLog();
	log.startUpload(storeUrl, toFilename, uploadDir,  backupDir);
	if (document.location.toString().substr(0,5) == "file:") {
		saveChanges();
	}
	displayMessage(config.macros.upload.messages.aboutToUpload.format([this.dirname(storeUrl)]), this.dirname(storeUrl));
	this.uploadChanges(storeUrl, toFilename, uploadDir, backupDir, username, password);
	if(config.options.chkGenerateAnRssFeed) {
		//var rssContent = convertUnicodeToUTF8(generateRss());
		var rssContent = generateRss();
		var rssPath = toFilename.substr(0,toFilename.lastIndexOf(".")) + ".xml";
		this.uploadContent(rssContent, storeUrl, rssPath, uploadDir, '', username, password, 
			function (responseText) {
				if (responseText.substring(0,1) != '0') {
					displayMessage(config.macros.upload.messages.rssFileNotUploaded.format([rssPath]));
				}
				else {
					if (uploadDir) {
						rssPath = uploadDir + "/" + config.macros.upload.basename(rssPath);
					} else {
						rssPath = config.macros.upload.basename(rssPath);
					}
					displayMessage(config.macros.upload.messages.rssFileUploaded.format(
						[config.macros.upload.dirname(storeUrl)+"/"+rssPath]), config.macros.upload.dirname(storeUrl)+"/"+rssPath);
				}
				// for debugging store.php uncomment last line
				//DEBUG alert(responseText);
			});
	}
	return;
};

config.macros.upload.uploadChanges = function(storeUrl, toFilename, uploadDir, backupDir, 
		username, password) {
	var original;
	if (document.location.toString().substr(0,4) == "http") {
		original =  this.download(storeUrl, toFilename, uploadDir, backupDir, username, password);
		return;
	}
	else {
		// standard way : Local file
		
		original = loadFile(getLocalPath(document.location.toString()));
		if(window.Components) {
			// it's a mozilla browser
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
									.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				converter.charset = "UTF-8";
				original = converter.ConvertToUnicode(original);
			}
			catch(e) {
			}
		}
	}
	//DEBUG alert(original);
	this.uploadChangesFrom(original, storeUrl, toFilename, uploadDir, backupDir, 
		username, password);
};

config.macros.upload.uploadChangesFrom = function(original, storeUrl, toFilename, uploadDir, backupDir, 
		username, password) {
	var startSaveArea = '<div id="' + 'storeArea">'; // Split up into two so that indexOf() of this source doesn't find it
	var endSaveArea = '</d' + 'iv>';
	// Locate the storeArea div's
	var posOpeningDiv = original.indexOf(startSaveArea);
	var posClosingDiv = original.lastIndexOf(endSaveArea);
	if((posOpeningDiv == -1) || (posClosingDiv == -1))
		{
		alert(config.messages.invalidFileError.format([document.location.toString()]));
		return;
		}
	var revised = original.substr(0,posOpeningDiv + startSaveArea.length) + 
				allTiddlersAsHtml() + "\n\t\t" +
				original.substr(posClosingDiv);
	var newSiteTitle;
	if(version.major < 2){
		newSiteTitle = (getElementText("siteTitle") + " - " + getElementText("siteSubtitle")).htmlEncode();
	} else {
		newSiteTitle = (wikifyPlain ("SiteTitle") + " - " + wikifyPlain ("SiteSubtitle")).htmlEncode();
	}
	revised = revised.replace(new RegExp("<title>[^<]*</title>", "im"),"<title>"+ newSiteTitle +"</title>");
	var response = this.uploadContent(revised, storeUrl, toFilename, uploadDir, backupDir, 
		username, password, function (responseText) {
					if (responseText.substring(0,1) != '0') {
						alert(responseText);
						displayMessage(config.macros.upload.messages.fileNotUploaded.format([getLocalPath(document.location.toString())]));
					}
					else {
						if (uploadDir !== '') {
							toFilename = uploadDir + "/" + config.macros.upload.basename(toFilename);
						} else {
							toFilename = config.macros.upload.basename(toFilename);
						}
						displayMessage(config.macros.upload.messages.mainFileUploaded.format(
							[config.macros.upload.dirname(storeUrl)+"/"+toFilename]), config.macros.upload.dirname(storeUrl)+"/"+toFilename);
						var log = new config.macros.upload.UploadLog();
						log.endUpload();
						store.setDirty(false);
					}
					// for debugging store.php uncomment last line
					//DEBUG alert(responseText);
				}
			);
};

config.macros.upload.uploadContent = function(content, storeUrl, toFilename, uploadDir, backupDir, 
		username, password, callbackFn) {
	var boundary = "---------------------------"+"AaB03x";		
	var request;
	try {
		request = new XMLHttpRequest();
		} 
	catch (e) { 
		request = new ActiveXObject("Msxml2.XMLHTTP"); 
		}
	if (window.netscape){
			try {
				if (document.location.toString().substr(0,4) != "http") {
					netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');}
			}
			catch (e) { }
		}		
	//DEBUG alert("user["+config.options.txtUploadUserName+"] password[" + config.options.pasUploadPassword + "]");
	// compose headers data
	var sheader = "";
	sheader += "--" + boundary + "\r\nContent-disposition: form-data; name=\"";
	sheader += config.macros.upload.formName +"\"\r\n\r\n";
	sheader += "backupDir="+backupDir
				+";user=" + username 
				+";password=" + password
				+";uploaddir=" + uploadDir
				+ ";;\r\n"; 
	sheader += "\r\n" + "--" + boundary + "\r\n";
	sheader += "Content-disposition: form-data; name=\"userfile\"; filename=\""+toFilename+"\"\r\n";
	sheader += "Content-Type: " + config.macros.upload.contentType + "\r\n";
	sheader += "Content-Length: " + content.length + "\r\n\r\n";
	// compose trailer data
	var strailer = new String();
	strailer = "\r\n--" + boundary + "--\r\n";
	var data;
	data = sheader + content + strailer;
	//request.open("POST", storeUrl, true, username, password);
	request.open("POST", storeUrl, true);
	request.onreadystatechange = function () {
				if (request.readyState == 4) {
				     if (request.status == 200)
						callbackFn(request.responseText);
					else
						alert(config.macros.upload.messages.errorUploadingContent);
				}
		};
	request.setRequestHeader("Content-Length",data.length);
	request.setRequestHeader("Content-Type","multipart/form-data; boundary="+boundary);
	request.send(data); 
};


config.macros.upload.download = function(uploadUrl, uploadToFilename, uploadDir, uploadBackupDir, 
	username, password) {
	var request;
	try {
		request = new XMLHttpRequest();
	} 
	catch (e) { 
		request = new ActiveXObject("Msxml2.XMLHTTP"); 
	}
	try {
		if (uploadUrl.substr(0,4) == "http") {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			}
		else {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
	} catch (e) { }
	//request.open("GET", document.location.toString(), true, username, password);
	request.open("GET", document.location.toString(), true);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if(request.status == 200) {
				config.macros.upload.uploadChangesFrom(request.responseText, uploadUrl, 
					uploadToFilename, uploadDir, uploadBackupDir, username, password);
			}
			else
				alert(config.macros.upload.messages.errorDownloading.format(
					[document.location.toString()]));
		}
	};
	request.send(null);
};

//}}}
////===

////+++!![Initializations]

//{{{
config.lib.options.init('txtUploadStoreUrl','store.php');
config.lib.options.init('txtUploadFilename','');
config.lib.options.init('txtUploadDir','');
config.lib.options.init('txtUploadBackupDir','');
config.lib.options.init('txtUploadUserName',config.options.txtUserName);
config.lib.options.init('pasUploadPassword','');
config.shadowTiddlers.UploadPluginDoc = "[[Full Documentation|http://tiddlywiki.bidix.info/l#UploadPluginDoc ]]\n"; 


//}}}
////===

////+++!![Core Hijacking]

//{{{
config.macros.saveChanges.label_orig_UploadPlugin = config.macros.saveChanges.label;
config.macros.saveChanges.label = config.macros.upload.label.saveToDisk;

config.macros.saveChanges.handler_orig_UploadPlugin = config.macros.saveChanges.handler;

config.macros.saveChanges.handler = function(place)
{
	if ((!readOnly) && (document.location.toString().substr(0,4) != "http"))
		createTiddlyButton(place,this.label,this.prompt,this.onClick,null,null,this.accessKey);
}

//}}}
////===