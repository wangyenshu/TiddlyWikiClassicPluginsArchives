/%
!info
|Name|SaveBreadcrumbs|
|Source|http://www.TiddlyTools.com/#SaveBreadcrumbs|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|write the current list of breadcrumbs to a 'story' tiddler|
Usage
<<<
{{{
<<tiddler SaveBreadcrumbs>>
<<tiddler SaveBreadcrumbs with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler SaveBreadcrumbs with: "click me">>}}}
<<tiddler SaveBreadcrumbs##show with: "click me">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="$2"
onclick="
	if (!config.macros.breadcrumbs) return; // not installed
	if (!config.macros.breadcrumbs.crumbs.length) return; // no crumbs
	var msg='Enter the name of a tiddler in which to save the current breadcrumbs';
	var tid=prompt(msg,'DefaultTiddlers'); if (!tid||!tid.length) return; // cancelled by user
	var t=store.getTiddler(tid);
	if(t && !confirm(config.messages.overwriteWarning.format([tid]))) return;
	var who=config.options.txtUserName;
	var when=new Date();
	var text='[['+config.macros.breadcrumbs.crumbs.join(']]\n[[')+']]';
	var tags=t?t.tags:[]; tags.pushUnique('story');
	var fields=t?t.fields:{};
	store.saveTiddler(tid,tid,text,who,when,tags,fields);
	story.displayTiddler(null,tid);
	story.refreshTiddler(tid,null,true);
	displayMessage(tid+' has been '+(t?'updated':'created'));
	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='SaveBreadcrumbs'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with:	{{'$1'!='$'+'1'?'$1':'save breadcrumbs'}}
		{{'$2'!='$'+'2'?'$2':'save breadcrumbs to tiddler'}}
>>