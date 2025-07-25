/%
!info
|Name|AllThumbs|
|Source|http://www.TiddlyTools.com/#AllThumbs|
|Version|1.2.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Requires|ThumbThing|
|Description|display a set of thumbnails with full-sized popup images|
Usage:
<<<
{{{
<<tiddler AllThumbs with: TiddlerName thumbsPerRow thumbWidth>>
}}}
*{{{TiddlerName}}} is the title of a tiddler containing a space-separated list of images
*{{{thumbsPerRow}}} is the number of images to show on each row of output.  Omit or use 'auto' for a single row
*{{{thumbWidth, thumbHeight, fullHeight, fullWidth}}} applies CSS to scale thumbnails and popup images.  Omit or use 'auto' for stretch-to-fit/full-size images
See [[ThumbThing]] for additional details
<<<
Examples:
<<<
{{{
<<tiddler AllThumbs with: [[AllThumbs##SampleList]]>>
}}}
Sample List:
<<tiddler AllThumbs##show with:	{{
	'{{{\n'+store.getTiddlerText('AllThumbs##SampleList')+'\n}\}\}\n';
}}>>
<<tiddler AllThumbs with: [[AllThumbs##SampleList]]>>
<<<
!end info

!SampleList
images/california.gif
images/cool_illusion.gif
AttachFileSample2
images/fish.jpg
images/sunset.jpg
!end SampleList

!show
$1
!end show

%/<<tiddler {{'$1'=='$'+'1'?'AllThumbs##info':'AllThumbs##show'}} with: {{
	var list=store.getTiddlerText('$1','').readBracketedList(false);
	var rowsize='$2'; if (rowsize=='$'+'2' || rowsize=='auto') rowsize=list.length;
	var width='$3';	  if (  width=='$'+'3' || width=='auto')   width=95/rowsize+'%';
	var out=[];
	var thumb='<<tiddler ThumbThing with: [[%0]] [[%1]] [[%2] [[%3]] [[%4]]>\>';
	for (var i=0; i<list.length; i++) {
		if (i && i%rowsize==0) out.push('\n');
		out.push(thumb.format([list[i],width,'$4','$5','$6']));
	}
	!out.length||!store.tiddlerExists('ThumbThing')?'<<tiddler AllThumbs##info>\>':out.join('');
}}>>