function setFooter() {
         if (document.getElementById && document.getElementById("contentFooter") ) {
            var windowHeight=findWindowHeight();
         if (windowHeight>0) {
            var contentHeight= document.getElementById('mainMenu').offsetHeight + document.getElementById("header").offsetHeight + document.getElementById("contentFooter").offsetHeight;
            var menu= document.getElementById('mainMenu');
            //var footerHeight=footerElement.offsetHeight;
            if (windowHeight-(contentHeight)>=0) {
               menu.style.position='relative';
               menu.style.marginBottom=(windowHeight-(contentHeight))+'px';
               }
            else {
                 menu.style.position='';
                 menu.style.marginBottom='';
                 }
            }
         }
}
window.onresize = function() {
  setFooter();
}

Story.prototype.refreshTiddler_footerhack=Story.prototype.refreshTiddler;
Story.prototype.refreshTiddler = function (title,template,force)
{    
var theTiddler = Story.prototype.refreshTiddler_footerhack.apply(this,arguments);
setFooter();
   return theTiddler;}