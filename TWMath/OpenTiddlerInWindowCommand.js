config.commands.openInWindow = 
{
	text: "new window",
	tooltip: "Open Tiddler in A new Window"
}
config.commands.openInWindow.handler = function(event,src,title)
{
	var myWin = window.open("",title,"resizable=1,scrollbars=1,toolbar=1,width=400,height=400");
	myWin.document.write('<head><style type="text/css">'+store.getTiddlerText('StyleSheetLayout')+store.getTiddlerText('StyleSheetColors')+store.getTiddlerText('StyleSheet')+'</style></head><body class="selected" style="height: 100%;" onhelp="alert(123)"><div id="popupDisplayArea" class="viewer" style="width: 100%"></div></body>');
	myWin.document.close();
	myWin.document.title = title;
	var e = createTiddlyElement(document.body,"div")
	wikify(store.getTiddlerText(title),e,highlightHack,store.getTiddler(title));
	var text= e.innerHTML;
	myWin.document.getElementById("popupDisplayArea").innerHTML = text;
	document.body.removeChild(e);
	myWin.focus();
	return false;
}