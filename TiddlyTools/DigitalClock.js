/%
!info
|Name|DigitalClock|
|Source|http://www.TiddlyTools.com/#DigitalClock|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|display current time with automatic update|
Usage
<<<
{{{
<<tiddler DigitalClock with: format tick>>
}}}
*''format'' is any TiddlyWiki date/time formatting string
*''tick'' is the time in seconds between display updates (default=1sec)
<<<
Example
<<<
show hours, minutes and seconds, updated once per second:
{{{<<tiddler DigitalClock with: "hh:0mm:0ss" 1>>}}}
<<tiddler DigitalClock##show with: "hh:0mm:0ss" 1>>
<<<
!end
!show
<html><a href='javascript:;'></a></html><<tiddler {{
	window.DigitalClock_tick=function(id){
		var e=document.getElementById(id); if (!e) return;
		e.title='click to '+(e.paused?'RESUME':'PAUSE')+' clock display';
		if (e.paused) return;
		e.innerHTML=new Date().formatString(e.fmt);
		e.timer=setTimeout('window.DigitalClock_tick('+id+')',e.tick*1000);
	}
	var e=place.lastChild.firstChild;
	e.id=new Date().getTime()+Math.random();
	e.onclick=function(){this.paused=!this.paused;window.DigitalClock_tick(this.id);}
	e.style.cursor='pointer';
	e.fmt=('$1'=='$'+'1')?'hh12:0mm:0ss am':'$1';
	e.tick=('$2'=='$'+'2')?'1':'$2';
	if (e.timer===undefined) window.DigitalClock_tick(e.id);
'';}}>>
!end
%/<<tiddler {{'DigitalClock##'+(tiddler&&tiddler.title=='DigitalClock'?'info':'show');}}
	with: [[$1]] [[$2]]>>