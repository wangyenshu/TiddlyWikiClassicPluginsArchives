/***
|Name|SaveFromWebConfig|
|Source|http://www.TiddlyTools.com/#SaveFromWebConfig|
|Documentation|http://www.TiddlyTools.com/#SaveFromWebPluginInfo|
|Version|1.3.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin|
|Description|configuration settings for SaveFromWebPlugin|
***/
/***
!!!!! URL for server-side 'reflector' script.
***/
//{{{
config.options.txtSaveFromWebScriptURL="savefromweb.php";
//}}}
/***
>Script can be hosted on ANY web server that supports PHP5.
***/
/***
!!!!! URL for TiddlyWiki core source
***/
//{{{
config.options.txtSaveFromWebSourceFile="http://www.TiddlyTools.com/empty.html";
//}}}
/***
>document URL for retrieving TiddlyWiki core source code. Using an *empty* TW minimizes data transfer for retrieving TW core. Can be on ANY domain... If blank, get core source code from current document URL.
***/
/***
!!!!! Target filename
***/
//{{{
config.options.txtSaveFromWebTargetFilename="";
//}}}
/***
>specifies the destination filename for the downloaded file. Can be any valid filename for local filesystem and appears as the default value when you are prompted to save the file.  If blank, the filename of the current document (or the domain name if there is no filename in the URL) is used.
***/
/***
!!!!! Pre-fetch option:
***/
//{{{
config.options.chkSaveFromWebPreFetch=false;
//}}}
/***
<<<
* true=get (and cache) TW core code when document is first loaded (i.e., when plugin is initialized)
* false=get and cache core code the first time the file is being saved
This option causes the plugin to retrieve the TiddlyWiki core source as soon as you load the document, instead of waiting for the first time you save.  This ensures that the TiddlyWiki core source can still be saved to the local filesystem even if your network connection is dropped before you save your changes.  Note that, even without pre-fetching, the core source is always cached after it is retrieved, so that subsequent saves don't do extra work to get it again.
<<<
***/
/***
!!!!! Local I/O option
***/
//{{{
config.options.chkSaveFromWebAttemptLocalIO=false;
//}}}
/***
<<<
(requires browser security permissions, i.e., "trusted site" settings).
The plugin will try to obtain security permission for direct filesystem I/O.  If you grant filesystem access to the script, then it writes the document directly to your filesystem, and doesn't use the server-side reflector script at all.  This allows you to save a remote file to your local filesystem, even if your net connection drops after you open the document. Note: if filesystem permissions are not granted, the plugin will automatically attempt to use the server-side reflector script as a fallback... even if no longer connected to the net.
<<<
***/
 