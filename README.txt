This repository archives tiddlywiki classic plugins from:

Server Name | URL | LegalStatements
AbegoSoftwareServer | https://tiddlywiki.abego-software.de/ | https://www.abego-software.de/legal/apl-v10.html
BidiXTWServer | https://web.archive.org/web/20130801155706/http://tiddlywiki.bidix.info/ | Unkown
BobsPluginsServer | https://web.archive.org/web/20171113084110/http://bob.mcelrath.org/plugins.html#tag:systemConfig | Unkown
MartinsPluginsServer | http://web.archive.org/web/20120321101358/http://www.martinswiki.com/ | http://creativecommons.org/licenses/by-sa/2.5/
MonkeyPirateTWServer | https://mptw.tiddlyspot.com/ | http://mptw.tiddlyspot.com/#TheBSDLicense
PeachTWServer | https://bradleymeck.tiddlyspot.com/ | Unkown
PrinceTiddlyWikiExtensionsServer | https://web.archive.org/web/20200224151452/https://ptw.sourceforge.net/ptwe.html | Creative Commons Attribution-ShareAlike 2.5 License
RedMountainVistaServer | http://solo.dc3.com/tw/ | http://creativecommons.org/licenses/by-sa/2.5/
TiddlyStylesServer | https://web.archive.org/web/20140127010925/http://tiddlystyles.com:80/ | Unkown
TiddlyToolsServer | https://tiddlytools.com/Classic/ | https://tiddlytools.com/Classic/#LegalStatements
VisualTWServer | https://yakovl.github.io/VisualTW2/VisualTW2.html | https://yakovl.github.io/VisualTW2/VisualTW2.html#License

and contains extension collections config txt that is compatible with ExtensionExplorerPlugin http://tiddlywiki.abego-software.de/#ForEachTiddlerPlugin.

The respective authors of these plugins retains all applicable rights.

How to Contribute?

1. Suppose you want to index the plugins of a tiddlywiki VisualTW2.html, import all the plugins of A into the base.html tiddlywiki;save it somewhere (eg. save it to VisualTW2.html in the subfolder VisualTW2).
2. Set the Firefox config security.fileuri.strict_origin_policy to false and open the saved wiki (VisualTW2.html) in Firefox.
3. Click the tiddler [[ExportAllPlugins]]. It should download all the tiddlers with systemConfig tag to file extension ".js".
4. Adjust the tiddler content (url) of [[installed_Plugins]]. Then click [[installed_Plugins]] to generate json description for all plugins. You should remove the last ",".

Credit:
https://github.com/YakovL/TiddlyWiki_TiddlerInFilePlugin/blob/master/TiddlerInFilePlugin.js
http://tiddlywiki.abego-software.de/#ForEachTiddlerPlugin
http://tiddlywiki.abego-software.de/#ForEachTiddlerPlugin