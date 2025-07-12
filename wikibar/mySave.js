/***
|''Name:''|mySave|
|''Version:''|1.0.0 |
|''Source:''|AiddlyWiki|
|''Author:''|[[Arphen Lin]] |
|''Type:''|Plugin|
|''Requires:''|TiddlyWiki 1.2.35 or higher |
!Description
Save files in my way.
!Revision history
*v1.0.0 2005/10/22
**Initial release
!Code
***/
//{{{


//------------------------------------------------------------------------------------------------
// override saveChanges()
//------------------------------------------------------------------------------------------------
function saveChanges()
{
	clearMessage();
	// Get the URL of the document
	var originalPath = document.location.toString();
	// Check we were loaded from a file URL
	if(originalPath.substr(0,5) != "file:")
		{
		alert(config.messages.notFileUrlError);
		displayTiddler(null,"SaveChanges");
		return;
		}
	// Remove any location part of the URL
	var hashPos = originalPath.indexOf("#");
	if(hashPos != -1)
		originalPath = originalPath.substr(0,hashPos);
	// Convert to a native file format assuming
	// "file:///x:/path/path/path..." - pc local file --> "x:\path\path\path..."
	// "file://///server/share/path/path/path..." - FireFox pc network file --> "\\server\share\path\path\path..."
	// "file:///path/path/path..." - mac/unix local file --> "/path/path/path..."
	// "file://server/share/path/path/path..." - pc network file --> "\\server\share\path\path\path..."
	var localPath;
	if(originalPath.charAt(9) == ":") // pc local file
		localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file://///") == 0) // FireFox pc network file
		localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file:///") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(7));
	else if(originalPath.indexOf("file:/") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(5));
	else // pc network file
		localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
	// Load the original file
	var original = loadFile(localPath);
	if(original == null)
		{
		alert(config.messages.cantSaveError);
		displayTiddler(null,"SaveChanges");
		return;
		}
	// Locate the storeArea div's
	var posOpeningDiv = original.indexOf(startSaveArea);
	var posClosingDiv = original.lastIndexOf(endSaveArea);
	if((posOpeningDiv == -1) || (posClosingDiv == -1))
		{
		alert(config.messages.invalidFileError.format([localPath]));
		return;
		}
	// Save the backup
	if(config.options.chkSaveBackups)
		{
		//var backupPath = localPath.substr(0,localPath.lastIndexOf(".")) + "." + (new Date()).convertToYYYYMMDDHHMMSSMMM() + ".html";
    // arphen: 只儲存一個備份檔
    var backupPath = localPath.substr(0,localPath.lastIndexOf(".")) + ".backup.html";
		var backup = saveFile(backupPath,original);
		if(backup)
			displayMessage(config.messages.backupSaved,"file://" + backupPath);
		else
			alert(config.messages.backupFailed);
		}
	// Save Rss
	if(config.options.chkGenerateAnRssFeed)
		{
		var rssPath = localPath.substr(0,localPath.lastIndexOf(".")) + ".xml";
		var rssSave = saveFile(rssPath,convertUnicodeToUTF8(generateRss()));
		if(rssSave)
			displayMessage(config.messages.rssSaved,"file://" + rssPath);
		else
			alert(config.messages.rssFailed);
		}
	// Save empty template
	if(config.options.chkSaveEmptyTemplate)
		{
		var emptyPath,p;
		if((p = localPath.lastIndexOf("/")) != -1)
			emptyPath = localPath.substr(0,p) + "/empty.html";
		else if((p = localPath.lastIndexOf("\\")) != -1)
			emptyPath = localPath.substr(0,p) + "\\empty.html";
		else
			emptyPath = localPath + ".empty.html";
		var empty = original.substr(0,posOpeningDiv + startSaveArea.length) + convertUnicodeToUTF8(generateEmpty()) + original.substr(posClosingDiv);
		var emptySave = saveFile(emptyPath,empty);
		if(emptySave)
			displayMessage(config.messages.emptySaved,"file://" + emptyPath);
		else
			alert(config.messages.emptyFailed);
		}
	// Save new file
	var revised = original.substr(0,posOpeningDiv + startSaveArea.length) +
				convertUnicodeToUTF8(allTiddlersAsHtml()) + "\n\t\t" +
				original.substr(posClosingDiv);
	var newSiteTitle = convertUnicodeToUTF8((wikifyPlain("SiteTitle") + " - " + wikifyPlain("SiteSubtitle")).htmlEncode());
	revised = revised.replace(new RegExp("<title>[^<]*</title>", "im"),"<title>"+ newSiteTitle +"</title>");
	var save = saveFile(localPath,revised);
	if(save)
		{
		displayMessage(config.messages.mainSaved,"file://" + localPath);
		store.setDirty(false);
		}
	else
		alert(config.messages.mainFailed);
}

//}}}