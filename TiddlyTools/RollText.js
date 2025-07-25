/%
!info
|Name|RollText|
|Source|http://www.TiddlyTools.com/#RollText|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Requires|AnimationEffecsPlugin|
|Description|display text phrase a word-at-a-time, using AnimationEffectPlugin|
Usage
<<<
{{{
<<tiddler RollText with: "text" timing speed pause repeat>>
}}}
<<<
!end
!out
$1
!end
!msg
RollText uses AnimationEffectsPlugin, available for download and installation from http://www.TiddlyTools.com
!end
!show
<<tiddler RollText##out with: {{
	var out="";
	var txt="$1";
	var what="fontSize";
	var format="%0%";
	var start=0;
	var stop=100;
	var txt=store.getTiddlerText('RollText##msg');
	if ("$1"!="$"+"1") txt="$1";
	var timing=500; if ("$2"!="$"+"2") timing=$2; // time in between start of one word and the next (ms)
	var speed=800; if ("$3"!="$"+"3") speed=$3; // speed for word to zoom in/out (ms)
	var pause=1500; if ("$4"!="$"+"4") pause=$4; // delay between zoom in and zoom out
	var repeat=2; if ("$5"!="$"+"5") repeat=$5; // animation cycles
	var parts=txt.split(" ");
	var when=0;
	var item="<<animate [[%0 ]] %1 %2 %3 %4 %5 %6 %7 %8>\>";
	for (var p=0; p<parts.length; p++) {
		out+=item.format([parts[p],what,format,start,stop,when,speed,repeat,pause]);
		when+=timing;
	}
	if ("$1"=="$"+"1") out="{{center medium{\n"+out+"}\}\}";
	out;
}}>>
!end
%/<<tiddler {{var src='RollText'; src+(tiddler&&tiddler.title==src?'##show':'##show');}}
	with: [[$1]] [[$2]] [[$3]] [[$4]] [[$5]]>>