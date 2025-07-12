//{{{
config.macros.jtab = {
  handler: function (place, macroName, params, wikifier, paramString, tiddler)
  {
      var tokens = params[0];
      var el = createTiddlyElement( place, 'div', '', 'jtab', tokens );
      jtab.render(el, tokens );
  }
};
//}}}
