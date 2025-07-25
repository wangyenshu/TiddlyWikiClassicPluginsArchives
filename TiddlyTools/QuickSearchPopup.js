/%
!info
|Name|QuickSearchPopup|
|Source|http://www.TiddlyTools.com/#QuickSearchPopup|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Requires|SearchOptionsPlugin, StickyPopupPlugin|
|Description|popup list of tiddlers containing text matching specified text or current tiddler title|
Usage
<<<
{{{
<<tiddler QuickSearchPopup>>
<<tiddler QuickSearchPopup with: "searchtext" "label">>
}}}
*''searchtext'' (optional, default=current tiddler title)
*''label'' (optional) text for popup command link
*''tip'' (optional) tooltip for popup command link
<<<
Example
<<<
{{{<<tiddler QuickSearchPopup with: {{tiddler.title}} "click me">>}}}
<<tiddler QuickSearchPopup##show with: {{tiddler.title}} "click me">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="$3"
	onmouseover="var t='$1';
		this.title=t.length?('list tiddlers containing text: \''+t+'\''):'disabled: no text to match';
	"
	onclick="var t='$1'; if (!t.length) return;
		var p=Popup.create(this); if (!p) return;
		addClass(p,'sticky');
		var d=createTiddlyElement(p,'div');
		d.style.whiteSpace='normal';
		d.style.width='auto';
		d.style.padding='2px';
		wikify('\<\<search [['+t+']] report=summary+list [[$2\n----\n]]\>\>',d);
		Popup.show();
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
		return(false);
">$2</a></html>
!end
%/<<tiddler {{var src='QuickSearchPopup'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
with:	{{'$1'!='$'+'1'?'$1':(story.findContainingTiddler(place)||place).getAttribute('tiddler')||'';}}
	{{'$2'!='$'+'2'?'$2':'see also'}}
	{{'$3'!='$'+'3'?'$3':'list tiddlers containing matching text'}}
>>