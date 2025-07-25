/%
|Name|DailyChecklist|
|Source|http://www.TiddlyTools.com/#DailyChecklist|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.4|
|Type|transclusion|
|Description|example of self-contained tag-based daily checklist|

----- EDIT THIS SECTION ONLY ----- %/
Five things to do every day:
<<<
<<tiddler DailyChecklist##toggletag with: questions>> Ask questions
<<tiddler DailyChecklist##toggletag with: answers>> Seek Answers
<<tiddler DailyChecklist##toggletag with: fun>> Have Fun
<<tiddler DailyChecklist##toggletag with: difference>> Make A Difference
<<tiddler DailyChecklist##toggletag with: smile>> Smile
----
<<tiddler DailyChecklist##toggleall with: "questions answers fun difference smile">> //toggle all checkboxes//
<<<
<<tiddler DailyChecklist##resetall with: "reset all items" "questions answers fun difference smile">>
/% ----- DO NOT EDIT BELOW THIS LINE -----

!toggletag
<html><nowiki><form style="display:inline">
	<input type="checkbox" name='c' onclick="
		var tid=story.findContainingTiddler(this).getAttribute('tiddler');
	 	store.setTiddlerTag(tid,this.checked,'$1');
	">
</form></html><<tiddler {{
	var t=store.getTiddler(story.findContainingTiddler(place).getAttribute('tiddler'));
	place.lastChild.getElementsByTagName('form')[0].c.checked=t.isTagged('$1');
'';}}>>
!end toggletag

!toggleall
<html><nowiki><form style="display:inline">
	<input type="checkbox" name="c" onclick="
		var tid=story.findContainingTiddler(this).getAttribute('tiddler');
		var tags='$1'.readBracketedList();
		store.suspendNotifications();
		for (var t=0; t<tags.length; t++)
			store.setTiddlerTag(tid,this.checked,tags[t]);
		store.resumeNotifications();
		story.refreshTiddler(tid,null,true);
	">
</form></html><<tiddler {{
	var t=store.getTiddler(story.findContainingTiddler(place).getAttribute('tiddler'));
	var tags='$1'.readBracketedList(); 
	place.lastChild.getElementsByTagName('form')[0].c.checked=t.tags.containsAll(tags);
'';}}>>
!end toggleall

!resetall
<html><nowiki><form style="display:inline">
	<input type="button" value="$1" onclick="
		var tid=story.findContainingTiddler(this).getAttribute('tiddler');
		var tags='$2'.readBracketedList();
		store.suspendNotifications();
		for (var t=0; t<tags.length; t++)
			store.setTiddlerTag(tid,false,tags[t]);
		store.resumeNotifications();
		story.refreshTiddler(tid,null,true);
"></form></html>
!end resetall
%/