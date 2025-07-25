/%
!info
|Name|ThumbThing|
|Source|http://www.TiddlyTools.com/#ThumbThing|
|Version|1.2.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|display a scaled 'thumbnail' image with popup for full-sized image|

Usage:
<<<
{{{
<<tiddler ThumbThing with: image thumbWidth thumbHeight fullWidth fullHeight>>
}}}
*{{{image}}} is one of:
**a local path/file
**a remote URL reference
**the title of a tiddler containing an attached image (see [[AttachFilePlugin]])
*{{{thumbWidth, thumbHeight, fullWidth, fullHeight}}} are CSS measurements.  Use 'auto' (or omit values) for default (full-sized) image height and/or width. For proportional scaling, specify a fixed-width OR fixed-height and use 'auto' for the other dimension.
<<<
Example:
<<<
{{{
<<tiddler ThumbThing with: images/meow2.jpg 100px>>
}}}
<<tiddler ThumbThing with: images/meow2.jpg 100px>>
<<<
See also:
>[[AllThumbs]]
!end

!show
<html><hide linebreaks>
<img src="$1" style="border=0;width:$2;height:$3;" title="$1" onclick="
	var p=Popup.create(this); if (!p) return; var s=p.style; s.border=s.padding='0'; s.background='none';
	p.innerHTML='<img src=\x22$1\x22 style=\x22border:1px solid #999;background:#eee;width:$4;height:$5\x22>';
	Popup.show(); event.cancelBubble=true; if(event.stopPropagation)event.stopPropagation(); return(false);
"></html>
!end
%/<<tiddler {{'ThumbThing##'+('$1'=='$'+'1'?'info':'show')}} with:
	{{var cma=config.macros.attach; (cma&&cma.isAttachment('$1'))?cma.getAttachment('$1'):'$1';}}
	[[$2]] [[$3]] [[$4]] [[$5]]>>