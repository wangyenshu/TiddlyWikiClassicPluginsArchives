/%
!info
|Name|ScrollBox|
|Source|http://www.TiddlyTools.com/#ScrollBox|
|Version|1.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|show tiddler content in a fixed-height scrolling area|
Usage
<<<
{{{
<<tiddler ScrollBox with: TiddlerName height arg1 arg2 arg3 ... arg7>>
}}}
*''height'' is a CSS measurement (e.g., 10em, 200px, 3in, etc.)
*''arg1 - arg7'' (optional) parameters passed along to the specified tiddler
<<<
Example
>{{{<<tiddler ScrollBox with: StyleSheetLayout 15em>>}}}
><<tiddler ScrollBox##show with: StyleSheetLayout 15em>>
!end
!show
@@display:block;height:$2;overflow:auto;<<tiddler $1
	with: [[$3]] [[$4]] [[$5]] [[$6]] [[$7]] [[$8]] [[$9]]
>>@@@@display:block;text-align:right;^^scroll for more^^@@
!end
%/<<tiddler {{'ScrollBox##'+('$'+'1'=='$1'?'info':'show')}}
with: [[$1]] {{'$2'!='$'+'2'?'$2':'auto'}} {{'$3'!='$'+'3'?'$3':''}}
{{'$4'!='$'+'4'?'$4':''}} {{'$5'!='$'+'5'?'$5':''}} {{'$6'!='$'+'6'?'$6':''}}
{{'$7'!='$'+'7'?'$7':''}} {{'$8'!='$'+'8'?'$8':''}} {{'$9'!='$'+'9'?'$9':''}}>>