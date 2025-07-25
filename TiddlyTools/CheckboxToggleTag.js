/%
!info
|Name|CheckboxToggleTag|
|Source|http://www.TiddlyTools.com/#CheckboxToggleTag|
|Version|1.3.6|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|toggle between two tag values using an HTML checkbox (no plugins)|
Usage:
<<<
{{{
in tiddler content:
   <<tiddler CheckboxToggleTag with: tag1 tag2 TiddlerName>> label
in ViewTemplate or EditTemplate:
   <span macro='CheckboxToggleTag with: tag1 tag2 TiddlerName'></span> label
}}}
where:
*''tag1'' is the tag to use when the checkbox is set
*''tag2'' //(optional)// is the tag to use when the checkbox is cleared (default=remove ''tag1'')
*''~TiddlerName'' //(optional)// is the tiddler to be tagged (default=current tiddler)
*''label'' //(optional)// is any text you want to display next to the checkbox
//note: to specify a ''~TiddlerName'' while omitting ''tag2'', use {{{""}}} (empty quotes) as a placeholder for ''tag2''//
<<<
Examples:
<<<
{{{
<<tiddler CheckboxToggleTag with: sometag>> set/clear 'sometag'
<<tiddler CheckboxToggleTag with: tagA tagB>> toggle tagA (checked) and tagB (unchecked)
}}}
<<tiddler CheckboxToggleTag with: sometag>> set/clear 'sometag'
<<tiddler CheckboxToggleTag with: tagA tagB>> toggle tagA (checked) and tagB (unchecked)
<<<
Notes:
<<<
*Clicking a checkbox immediately changes the corresponding tag value in the tiddler. This can, in some cases, trigger additional 'side-effect' processing, such as refreshing of page elements, or autosaving of the document (if that option is enabled).
*If you are currently editing the tiddler being tagged, any //unsaved// changes you have made to the contents of the ''tags'' input field will be discarded when the checkbox is clicked.
<<<
!end info
!show
<html><input type="checkbox" onclick="
	store.suspendNotifications();
	var tid=this.getAttribute('tid');
	var ontag=this.getAttribute('onTag');
	var offtag=this.getAttribute('offTag');
	if (ontag && ontag.length)  store.setTiddlerTag(tid,this.checked,ontag);
	if (offtag && offtag.length) store.setTiddlerTag(tid,!this.checked,offtag);
	store.resumeNotifications();
	store.notify(tid,true);
	var here=story.findContainingTiddler(this);
	if (here) { /* refresh current tiddler */
		var title=here.getAttribute('tiddler');
		var template=story.chooseTemplateForTiddler(title,story.isDirty(title)?2:1);
		story.refreshTiddler(title,template,true);
	}
	return false;
"><nowiki></html><<tiddler {{
	var tid="$3";
	if (tid=="$"+"3") {
		var here=story.findContainingTiddler(place);
		if (here) tid=here.getAttribute('tiddler');
	}
	if (store.tiddlerExists(tid)) {
		var c=place.lastChild.firstChild;
		c.setAttribute('onTag','$1');
		c.setAttribute('offTag','$2'!='$'+'2'&&'$2'!='undefined'?'$2':'');
		c.setAttribute('tid',tid);
		c.checked=store.getTiddler(tid).isTagged(c.getAttribute('onTag'));
	}
'';}}>>
!end show

%/<<tiddler {{'CheckboxToggleTag##'+('$1'=='$'+'1'?'info':'show')}} with: [[$1]] [[$2]] [[$3]]>>