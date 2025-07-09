config.macros.fileDrop.addEventListener("application/x-moz-file",function(nsiFile)
{
 var newDate = new Date();
 store.saveTiddler(null,nsiFile.path,loadFile(nsiFile.path),config.options.txtUserName,newDate,[]);
 story.displayTiddler(null,nsiFile.path)
})