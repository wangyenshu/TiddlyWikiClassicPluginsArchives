/%
|Name|QuickEditToolbar|
|Source|http://www.TiddlyTools.com/#QuickEditToolbar|
|Version|2.4.4|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.2|
|Type|transclusion|
|Requires|QuickEditPlugin|
|Optional|QuickEdit_*|
|Description|format/insert TiddlyWiki content using toolbar buttons|

Usage:
* install [[QuickEditPlugin]] (runtime support functions)

* add the toolbar to [[EditTemplate]]:
	<div macro='tiddler QuickEditToolbar with: show'></div>

* 'show' (optional) forces the toolbar to always be displayed or,
  omit keyword and use <<option chkShowQuickEdit>> setting

* selected QuickEdit buttons can also be added individually to the
  regular tiddler toolbar by adding references directly in [[EditTemplate]]:
	<span class='toolbar' macro='tiddler QuickEdit_...'></span>

* see [[QuickEditPackage]] for additional installation options

%/{{hidden fine center quickEdit{
<<tiddler {{ // show/hide toolbar
	var here=story.findContainingTiddler(place); if (here) var tid=here.getAttribute('tiddler');
	var show='$1'!='$'+'1'||config.options.chkShowQuickEdit||tid=='QuickEditToolbar'; 
	place.style.display=show?'block':'none';
'';}}>>/%

TOOLBAR DEFINITION - add, remove, or re-order items as desired:
= = = = = = = = = =
%/<<tiddler QuickEdit_format>>/%
%/<<tiddler QuickEdit_align>>/%
%/<<tiddler QuickEdit_color>>/%
%/<<tiddler QuickEdit_font>>/%
%/<<tiddler QuickEdit_custom>>/%
%/ &nbsp;/% (SPACER)
%/<<tiddler QuickEdit_replace>>/%
%/<<tiddler QuickEdit_split>>/%
%/<<tiddler QuickEdit_sort>>/%
%/<<tiddler QuickEdit_convert>>/%
%/ &nbsp;/% (SPACER)
%/<<tiddler QuickEdit_link>>/%
%/<<tiddler QuickEdit_insert>>/%
%/<<tiddler QuickEdit_macro>>/%
%/<<tiddler QuickEdit_image>>/%
%/}}}