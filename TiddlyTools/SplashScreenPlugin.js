/***

''Inspired by [[TiddlyPom|http://www.warwick.ac.uk/~tuspam/tiddlypom.html]]''

|Name|SplashScreenPlugin|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#SplashScreenPlugin|
|Version|0.21 |
|Requires|~TW2.08+|
!Description:
Provides a simple splash screen that is visible while the TW is loading.

!Installation
Copy the source text of this tiddler to your TW in a new tiddler, tag it with systemConfig and save and reload. The SplashScreen will now be installed and will be visible the next time you reload your TW.

!Customizing
Once the SplashScreen has been installed and you have reloaded your TW, the splash screen html will be present in the MarkupPreHead tiddler. You can edit it and customize to your needs.

!History
* 20-07-06 : version 0.21, modified to hide contentWrapper while SplashScreen is displayed.
* 26-06-06 : version 0.2, first release

!Code
***/
//{{{
window.old_lewcid_splash_restart=window.restart;

window.restart = function()
{   if (document.getElementById("SplashScreen"))
        document.getElementById("SplashScreen").style.display = "none";
      if (document.getElementById("contentWrapper"))
        document.getElementById("contentWrapper").style.display = "block";
    
    window.old_lewcid_splash_restart();
   
    if (splashScreenInstall)
       {if(config.options.chkAutoSave)
			{saveChanges();}
        displayMessage("TW SplashScreen has been installed, please save and refresh your TW.");
        }
}


var oldText = store.getTiddlerText("MarkupPreHead");
if (oldText.indexOf("SplashScreen")==-1)
   {var siteTitle = store.getTiddlerText("SiteTitle");
   var splasher='\n\n<style type="text/css">#contentWrapper {display:none;}</style><div id="SplashScreen" style="border: 3px solid #ccc; display: block; text-align: center; width: 320px; margin: 100px auto; padding: 50px; color:#000; font-size: 28px; font-family:Tahoma; background-color:#eee;"><b>'+siteTitle +'</b> is loading<blink> ...</blink><br><br><span style="font-size: 14px; color:red;">Requires Javascript.</span></div>';
   if (! store.tiddlerExists("MarkupPreHead"))
       {var myTiddler = store.createTiddler("MarkupPreHead");}
   else
      {var myTiddler = store.getTiddler("MarkupPreHead");}
      myTiddler.set(myTiddler.title,oldText+splasher,config.options.txtUserName,null,null);
      store.setDirty(true);
      var splashScreenInstall = true;
}
//}}}