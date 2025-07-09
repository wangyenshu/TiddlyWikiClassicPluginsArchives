/***
|''Name:''|settings|
|''Description:''|Set preferences|
|''~CoreVersion:''|2.1.0|
***/

/*{{{*/


if(config.backstageTasks.indexOf("sync")!=-1)
	config.backstageTasks.splice(config.backstageTasks.indexOf("sync"),1);
if(config.backstageTasks.indexOf("importTask")!=-1)
	config.backstageTasks.splice(config.backstageTasks.indexOf("importTask"),1);

//showBackstage = true;

config.views.editor.defaultText = '';
config.options.chkAnimate = false;
config.options.chkDisableWikiLinks = true;
config.options.txtMaxEditRows = 20;

/*}}}*/