//{{{
config.macros.version.handler = function(place)
{
	createTiddlyElement(place,"span",null,null,version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : "") + (version.build ? " (build #" + version.build + ")" : ""));
};
readOnly = false;
config.options.chkBackstage = true;
config.macros.changeMode.lingo.modeName[''] = 'Admin';
config.options.txtRssTag = 'toRSS';
config.options.chkGenerateAnRssFeed = true;

//}}}