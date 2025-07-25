/%
|Name|ToggleReadOnly|
|Source|http://www.TiddlyTools.com/#ToggleReadOnly|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.5|
|Type|transclusion|
|Description|enable/disable global read-only state without reloading your document|

Usage: 
	<<tiddler ToggleReadOnly>> OR
	<<tiddler ToggleReadOnly with: label tip>>

!show
<html><nowiki><span class='button' style='cursor:pointer'
	onclick="this.getElementsByTagName('input')[0].click();" title="$2">
<input type='checkbox' style="margin:0;padding:0;" onclick="
	window.readOnly=this.checked;
	window.showBackstage=!window.readOnly;
	config.macros.option.propagateOption('chkHttpReadOnly','checked',window.readOnly,'input');
	if(showBackstage && !backstage.area) backstage.init();
	backstage.button.style.display=showBackstage?'block':'none';
	backstage.hide();
	story.switchTheme(config.options.txtTheme);
	refreshAll(); story.refreshAllTiddlers(true); // FORCE RE-DISPLAY
	return false;
">$1</span></html><<tiddler {{
	var chk=place.lastChild.getElementsByTagName('input')[0];
	chk.checked=window.readOnly;
'';}}>>
!end

%/<<tiddler ToggleReadOnly##show with:
	{{"$1"=="$"+"1"?"read-only":"$1"}}
	{{"$2"=="$"+"2"?"enable/disable editing functions":"$2"}}
>>