/***
This patches should be executed after their original plugins has been loaded 
***/

//{{{
//hacking taggerPlugin externally to remove excluded tags from the list
if (config.macros.tagger) window.eval(store.getTiddlerText("TaggerPlugin").replace(/store.getTags\(\);/,"store.getTags('excludeLists');"));
//}}}
//{{{
//hacking LessBackupsPlugin externally to change configuration without editing the plugin code
if (window.getSpecialBackupPath) {
	window.getBackupModes = [
		["ddd",   7*24*60*60*1000],   // one per weekday
		["latest",0]         // always keep last version. (leave this).
	];

	window.eval(store.getTiddlerText("LessBackupsPlugin").match(/window.getSpecialBackupPath =(.*)\n(.*\n)*(?:\/\/ hijack)/m)[0].replace(/var now /,"var modes = window.getBackupModes;\nvar now "));
}
//}}}