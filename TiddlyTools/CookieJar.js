/***
<<tiddler CookieManager>>
***/
/***
!!![[Portable cookies:|CookieSaverPlugin]] {{fine{<<option chkPortableCookies>>enable <<option chkMonitorCookieJar>>monitor}}}
^^This section is ''//__automatically maintained__//'' by [[CookieSaverPlugin]].  To block specific cookies, see [[CookieSaverPluginConfig]].^^
***/
// // /% end portable cookies %/
/***
!!![[Baked cookies:|CookieManagerPlugin]]
^^Press {{smallform{<<cookieManager button>>}}} to save the current browser cookies... then hand-edit this section to customize the results.^^
***/

// 5 cookies saved on Tuesday, April 8th 2008 at 17:30:05 by ELSDesignStudios//
//^^(edit/remove username check and/or individual option settings as desired)^^//
//{{{
if (["ELSDesignStudios","ELS","Eric"].contains(config.options.txtUserName)) {
	config.options["chkInsertTabs"]=true;
	config.options["chkSearchByDate"]=true;
	config.options["chkTOCIncludeHidden"]=true;
	config.options["txtUploadUserName"]="ELSDesignStudios";
	config.options["txtUploadBackupDir"]="backup";
	config.options["txtUploadStoreUrl"]="http://www.tiddlytools.com/store.php";
	config.options["txtPrivWizardDefaultStep"]="2";
	config.options["txtSliderunsaved"]=true;
}
//}}}
// The following settings are applied as defaults for all users:           //
//{{{
	config.options["txtMaxEditRows"]=25;
	config.options["txtTiddlerLinkTootip"]="%0 - %2 (%3 bytes) - %4";

	if (!config.options.txtTheme.length) config.options.txtTheme='StyleSheet';

	// Make sure FAQ panels are *always* closed on startup (so load-on-demand can be used later on):
	config.options.chkSliderWelcomeShowFAQ=false;
	saveOptionCookie('chkSliderWelcomeShowFAQ');
	config.options.chkSliderMainMenu_faq=false;
	saveOptionCookie('chkSliderMainMenu_faq');
	config.options.chkSliderSiteMenu_faq=false;
	saveOptionCookie('chkSliderSiteMenu_faq');
//}}}
