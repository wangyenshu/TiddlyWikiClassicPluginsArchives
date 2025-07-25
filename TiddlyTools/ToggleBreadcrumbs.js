/%
!info
|Name|ToggleBreadcrumbs|
|Source|http://www.TiddlyTools.com/#ToggleBreadcrumbs|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|enable/disable display of breadcrumbs (uses BreadcrumbsPlugin)|
Usage
<<<
{{{
<<tiddler ToggleBreadcrumbs>>
<<tiddler ToggleBreadcrumbs with: label tip>>
}}}
<<<
Example
<<<
{{{<<tiddler ToggleBreadcrumbs>>}}}
<<tiddler ToggleBreadcrumbs##show with: "show breadcrumbs">>
<<<
!end
!show
<<tiddler {{
	if (config.options.chkShowBreadcrumbs===undefined) config.options.chkShowBreadcrumbs=true;
'';}}>><<option chkShowBreadcrumbs>><<tiddler {{
	var chk=place.lastChild;
	if (!chk.coreOnChange) { // only once
		chk.coreOnChange=chk.onchange;
		chk.onchange=function() {
			if (this.coreOnChange) this.coreOnChange.apply(this,arguments);
			this.checked=config.options.chkShowBreadcrumbs;
			if (config.macros.breadcrumbs) config.macros.breadcrumbs.refresh();
		};
	}
'';}}>> $1
!end

%/<<tiddler {{var src='ToggleBreadcrumbs'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
with:	{{'$1'!='$'+'1'?'$1':'show breadcrumbs'}}
	{{'$2'!='$'+'2'?'$2':'toggle breadcrumbs display'}}>>