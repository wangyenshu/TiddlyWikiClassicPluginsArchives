/%
!info
|Name|BreadcrumbsCommand|
|Source|http://www.TiddlyTools.com/#BreadcrumbsCommand|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Requires|BreadcrumbsPlugin|
|Description|"crumbs" command displays current breadcrumbs list in a popup|
Usage
<<<
{{{
<<tiddler BreadcrumbsCommand>>
<<tiddler BreadcrumbsCommand with: label tip>>
}}}
<<<
Example
<<<
{{{<<tiddler BreadcrumbsCommand with: "crumbs">>}}}
<<tiddler BreadcrumbsCommand##show with: "crumbs">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" class="TiddlyLink" title="$2"
	onclick="var p=Popup.create(this); if (!p) return;
		var d=createTiddlyElement(p,'div');
		d.style.whiteSpace='normal'; d.style.width='auto'; d.style.padding='2px';
		wikify('\<\<breadcrumbs [[\<html\>\<hr\>\</html\>]] [[<br>]]\>\>',d);
		Popup.show();
		event.cancelBubble=true;if(event.stopPropagation)event.stopPropagation();
		return false;
">$1</a></html>
!end
%/<<tiddler {{ var src='BreadcrumbsCommand'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with:	{{'$1'!='$'+'1'?'$1':'crumbs'}}
		{{'$2'!='$'+'2'?'$2':'tiddlers viewed during this session'}}>>