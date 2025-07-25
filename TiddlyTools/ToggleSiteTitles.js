/%
!info
|Name|ToggleSiteTitles|
|Source|http://www.TiddlyTools.com/#ToggleSiteTitles|
|Version|1.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.5|
|Type|transclusion|
|Description|show/hide document 'header' area (containing SiteTitle and SiteSubtitle content)|
Usage:
<<<
{{{
<<tiddler ToggleSiteTitles>> OR
<<tiddler ToggleSiteTitles with: label tip>>
}}}
<<<
!end

!show
<<option chkHideSiteTitles>><<tiddler {{
	var chk=place.lastChild;
	if (!chk.coreOnChange) { // only once
		chk.coreOnChange=chk.onchange;
		chk.onchange=function() {
			if (this.coreOnChange) this.coreOnChange.apply(this,arguments);
			var h=jQuery('#contentWrapper .header')[0];
			var opt=this.getAttribute('option');
			if (h) h.style.display=config.options[opt]?'none':'block';
		};
	}
'';}}>> $1
!end

%/<<tiddler {{'ToggleSiteTitles##'+(tiddler&&tiddler.title=='ToggleSiteTitles'?'info':'show')}} with:
{{"$1"=="$"+"1"?"hide site titles":"$1"}}
{{"$2"=="$"+"2"?"toggle site title display":"$2"}}
{{	// init header display
	var opt='chkHideSiteTitles';
	if (config.options[opt]==undefined) config.options[opt]=false;
	var h=jQuery('#contentWrapper .header')[0];
	if (h) h.style.display=config.options[opt]?'none':'block';
}}
>>