//{{{
//replaces toolbar buttons with icons.
//for each command that you want to use an icon, add a line like the following in a systemConfig tiddler, specifying the icon image location:
//config.commands.editTiddler.imgLoc= "jump.bmp";
//No need to edit the ViewTemplate! If an image location is specified, then the icon will be used for that command!

config.macros.toolbar.createCommand = function(place,commandName,tiddler,theClass)
{
	if(typeof commandName != "string")
		{
		var c = null;
		for(var t in config.commands)
			if(config.commands[t] == commandName)
				c = t;
		commandName = c;
		}
	if((tiddler instanceof Tiddler) && (typeof commandName == "string"))
		{
		var title = tiddler.title;
		var command = config.commands[commandName];
		var ro = tiddler.isReadOnly();
		var shadow = store.isShadowTiddler(title) && !store.tiddlerExists(title);
		var text = ro && command.readOnlyText ? command.readOnlyText : command.text;
		var tooltip = ro && command.readOnlyTooltip ? command.readOnlyTooltip : command.tooltip;
		if((!ro || (ro && !command.hideReadOnly)) && !(shadow && command.hideShadow))
		    {
			    var btn = createTiddlyButton(null,text,tooltip,this.onClickCommand);
			    btn.setAttribute("commandName", commandName);
			    btn.setAttribute("tiddler", title);
			    if(theClass)
				            addClass(btn,theClass);
                             place.appendChild(btn);
                            if(command.imgLoc)
                                   btn.innerHTML = "<img src='"+command.imgLoc+"'>";

		     }
       }
}

setStylesheet(".toolbarImg {vertical-align: middle; cursor:pointer;}\n","commandIconStyles"); 
//}}}