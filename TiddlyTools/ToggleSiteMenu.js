/%
!info
|Name|ToggleSiteMenu|
|Source|http://www.TiddlyTools.com/#ToggleSiteMenu|
|Version|1.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.5|
|Type|transclusion|
|Description|show/hide horizontal SiteMenu using checkbox or double-click on background|
Usage:
<<<
{{{
<<tiddler ToggleSiteMenu>> OR
<<tiddler ToggleSiteMenu with: label tip>>
}}}
<<<
!end
!show
<<option chkHideSiteMenu>><<tiddler {{
	var chk=place.lastChild;
	if (!chk.coreOnChange) { // only once
		chk.coreOnChange=chk.onchange;
		chk.onchange=function() {
			if (this.coreOnChange) this.coreOnChange.apply(this,arguments);
			var opt=this.getAttribute('option');
			var m=document.getElementById('siteMenu');
			if (m) m.style.display=config.options[opt]?'none':'block';
		};
	}
'';}}>> $1
!end

%/<<tiddler {{'ToggleSiteMenu##'+(tiddler&&tiddler.title=='ToggleSiteMenu'?'info':'show')}} with:
{{"$1"=="$"+"1"?"hide site menubar":"$1"}}
{{"$2"=="$"+"2"?"toggle horizontal site menu display":"$2"}}
{{
	// init header display
	var opt='chkHideSiteMenu';
	if (config.options[opt]==undefined) config.options[opt]=false;
	var m=document.getElementById('siteMenu'); 
	if (m) m.style.display=config.options[opt]?'none':'block';

	// add double-click trigger to page background
	document.ondblclick=function(event){
		if (!event) event=window.event; // IE fixup
		var target=resolveTarget(event);
		// ignore double-clicks that bubble through from input fields and listboxes
		if (target.nodeName.toUpperCase()=="TEXTAREA") return true;
		if (target.nodeName.toUpperCase()=="SELECT") return true;
		if (target.nodeName.toUpperCase()=="INPUT"&&target.type.toUpperCase()=="TEXT") return true;
		window.toggleSiteMenu();
		// consume the event
		if (event) { event.cancelBubble=true; if (event.stopPropagation) event.stopPropagation(); }
		return false;
	};
	// onclick side-effect: show/hide site menu and sync checkboxes for this option
	window.toggleSiteMenu=function() {
		var opt="chkHideSiteMenu";
		var m=document.getElementById('siteMenu'); if (!m) return true;
		var show=(m.style.display=='none');
		m.style.display=show?'block':'none';
		config.options[opt]=!show;
		saveOptionCookie(opt);
		config.macros.option.propagateOption(opt,"checked", config.options[opt],"input");
	};
'';}}>>