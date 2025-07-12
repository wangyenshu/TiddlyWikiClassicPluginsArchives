config.macros.top={};
config.macros.top.handler=function(place,macroName)
{
               createTiddlyButton(place,"^","jump to top",this.onclick);
}
config.macros.top.onclick=function()
{
               window.scrollTo(0,0);
};