/%
!info
|Name|ShowImage|
|Source|http://www.TiddlyTools.com/#ShowImage|
|Version|1.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|display attached tiddler image without supporting plugin|
Usage:
<<<
# First, use [[AttachFilePlugin]] to create tiddlers containing base64-encoded image data with a fallback remote URL reference.
# You can then discard the plugin and associated supporting tiddlers ([[AttachFileMIMETypes]], [[AttachFilePluginFormatters]]), leaving only the attachment tiddlers (plus this tiddler, ShowImage, of course).
# Use the following syntax to display the attached images without any plugins:
{{{
<<tiddler ShowImage with: [[TiddlerName]] "tooltip" "width">>
}}}
where:
*''~TiddlerName''<br>title of the attachment tiddler to be displayed
*''tooltip'' //(optional)//<br>mouseover help text for the image (default=attachment title)
*''width'' //(optional)//<br>CSS width measurement - resizes image height proportionally (default=auto)
Note: the fallback remote URL will be used if encoded data is not attached or you are using InternetExplorer, which does not currently support the data:// URI. 
<<<
Example:
<<<
{{{
<<tiddler ShowImage with: [[AttachFileSample]] "meow!" "30px">>
}}}
<<tiddler ShowImage with: [[AttachFileSample]] "meow!" "30px">>
<<<
!end

!show
<html><img src="missing.jpg" title="$2" style="width:$3" /></html><<tiddler {{
	var src=store.getTiddlerText("$1##data");
	if (!src||config.browser.isIE)
		src=store.getTiddlerText("$1##url","missing.jpg");
	place.lastChild.firstChild.src=src;
}}>>
!end

%/<<tiddler {{"ShowImage##"+("$1"=="$"+"1"?"info":"show")}} with:
	[[$1]]
	{{"$2"=="$"+"2"?"$1"  :"$2"}}
	{{"$3"=="$"+"3"?"auto":"$3"}}
>>