/***
|Name|DeleteAllTaggedCustom|
|Source|http://ido-xp.tiddlyspot.com/#DeleteAllTaggedCustom|
|Version|1.0|

An adaptation of DeleteDoneTasks (Simon Baird) by Ido Magal
To use this insert {{{<<DeleteAllTaggedCustom>>}}} into the desired tiddler.

/***
Example usage:
{{{<<DeleteAllTaggedCustom>>}}}
<<DeleteAllTaggedCustom>>
***/
//{{{

config.macros.DeleteAllTaggedCustom= {
	handler: function ( place,macroName,params,wikifier,paramString,tiddler ) {
		var buttonTitle = "REPLACE_WITH_BUTTON_NAME";
		createTiddlyButton( place, buttonTitle, "REPLACE_WITH_TOOLTIP", this.DeleteAllTaggedCustom( "REPLACE_WITH_TAG_TO_DELETE" ));
	},

	DeleteAllTaggedCustom: function(tag) {
		return function() {
			var collected = [];
			store.forEachTiddler( function ( title,tiddler ) {
				if ( tiddler.tags.contains( tag ))
				{
					collected.push( title );
				}
			});
			if ( collected.length == 0 )
			{
				alert( "No tiddlers found tagged with '"+tag+"'." );
			}
			else
			{
				if ( confirm( "These tiddlers are tagged with '"+tag+"'\n'"
						+ collected.join( "', '" ) + "'\n\n\n"
						+ "Are you sure you want to delete these?" ))
				{
					for ( var i=0;i<collected.length;i++ )
					{
						store.deleteTiddler( collected[i] );
						displayMessage( "Deleted '"+collected[i]+"'" );
					}
				}
			}
		}
	}
};

//}}}