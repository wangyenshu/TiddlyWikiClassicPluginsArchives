/%
!info
|Name|SlideshowTimer|
|Source|http://www.TiddlyTools.com/#SlideshowTimer|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|slideshow countdown timer closes current tiddler and opens another one in its place|
Usage
<<<
{{{
<<tiddler SlideshowTimer with: NextTiddlerTitle delay close fold>>
}}}
*''NextTiddlerTitle''<br>the title of any existing tiddler
*''delay'' (optional, default=15 seconds)<br>the number of seconds before switching to the next tiddler
*''close'' //or// ''fold'' (optional)<br>close/fold the current tiddler when the next tiddler is opened
Notes:
*Moving the mouse over the timer pauses the countdown, moving away resumes the countdown.
*Click the timer to immediately advance to the next tiddler.
*When the timer shows "0:00", clicking will reset the countdown
<<<
Example
<<<
{{{<<tiddler SlideshowTimer with: About 15>>}}}
<<tiddler SlideshowTimer##show with: About 15>>
<<<
!end

!show
{{span{}}}<<tiddler {{
	var tid='$1';
	var delay='$'+'2'!='$2'?'$2'*1000:15000;
	var mode='$3';
	var now=new Date().getTime();
	var target=place.lastChild;
	if (!target.timer) {
		target.id=now+Math.random(); // unique ID
		target.title="timer is paused... click for next tiddler: '"+this.tid+"'";
		target.style.cursor='pointer';
		target.tid=tid;
		target.delay=delay;
		target.mode=mode;
		target.stopTime=now+delay;
		target.innerHTML=delay/1000;
		target.tick = function() {
			var remaining=Math.floor((this.stopTime-new Date().getTime())/1000);
			if (remaining||this.paused) {
				if (!this.paused) this.innerHTML='0:'+String.zeroPad(remaining,2);
				var code="var e=document.getElementById('"+this.id+"'); if(e)e.tick()";
				target.timer=setTimeout(code,500);
			} else this.onclick();
		};
		target.onmouseover=function()
			{ var remaining=this.stopTime-new Date().getTime(); this.paused=Math.max(remaining,0); };
		target.onmouseout=function()
			{ this.stopTime=new Date().getTime()+this.paused; this.paused=0; };
		target.onclick = function() {
			if (!this.timer) {
				this.paused=this.delay;
				this.innerHTML='0:'+String.zeroPad(Math.floor(this.delay/1000),2);
				var code="var e=document.getElementById('"+this.id+"'); if(e)e.tick()";
				this.title="timer is paused... click for next tiddler: '"+this.tid+"'";
				this.timer=setTimeout(code,500);
				return false;
			}
			this.timer=clearTimeout(this.timer);
			this.title='click to reset timer to '+Math.floor(this.delay/1000)+' seconds';
			this.innerHTML='0:00';
			var here=story.findContainingTiddler(this);
			if (store.getTiddlerText(this.tid)) story.displayTiddler(here,this.tid);
			if (mode=='close') story.closeTiddler(here.getAttribute('tiddler'));
			if (mode=='fold' && config.commands.collapseTiddler) // see CollapseTiddlerPlugin
				config.commands.collapseTiddler.handler(null,here,here.getAttribute('tiddler'));
			return false;
		};
		var code="var e=document.getElementById('"+target.id+"'); if(e)e.tick()";
		target.timer=setTimeout(code,500);
	}
'';}}>>
!end
%/<<tiddler {{var src='SlideshowTimer'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]] [[$2]] {{'$3'.toLowerCase()}}>>