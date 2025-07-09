/***
!CTRL+S
Saving
***/
//{{{
if(location.href.indexOf("file://")==0){window.captureKey(document,saveChanges,"S",false,false,true);}
if(location.href.indexOf("http://")==0)window.captureKey(document,function()
{
config.macros.upload.upload("http://bradleymeck.tiddlyspot.com/store.php", "index.html", ".", ".", "BradleyMeck")
},"S",false,false,true);
//}}}