// null logger : no more UploadLog and no upload logging
// BidiX - 2006/11/8
//{{{
config.macros.upload.UploadLog = function() {return this;};
config.macros.upload.UploadLog.prototype.startUpload = function(storeUrl, toFilename, uploadDir,  backupDir) {};
config.macros.upload.UploadLog.prototype.endUpload = function() {};
//}}}
