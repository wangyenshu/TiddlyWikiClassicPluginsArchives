/%
!info
|Name|ShowLocalDirectory|
|Source|http://www.TiddlyTools.com/#ShowLocalDirectory|
|Version|2.0.2|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|display local filesystem directory listings|
Usage
<<<
{{{
<<tiddler ShowLocalDirectory>>
<<tiddler ShowLocalDirectory with: localpath format>>
}}}
*''localpath'' uses system-specific file naming conventions (or keyword "here" for the current document directory).  Note: for Windows filesystem, use doubled backslashes and enclose the entire path in square brackets (e.g., {{{[[C:\\temp\\foo]]}}})
*''format'' determines the type of output produced:
**''plain''<br>show fully-qualified path/filenames ~AS-IS, without any additional formatting.
**''list''<br>show fully-qualified path/filenames, so that the local system-specific filename can be *displayed* while linking to a valid system-independent "file:" URL for browser navigation.
**''directory'' (default)<br>show header followed by a formatted table, containing links for filenames, filesizes (in bytes), and modification dates, plus a summary footer reporting the total file and byte counts.
<<<
Revisions
<<<
2011.02.14 2.0.2 fix OSX error: use picker.file.path
<<<
Example
<<<
{{{<<tiddler ShowLocalDirectory>>}}}
<<tiddler ShowLocalDirectory##show>>
<<<
!end

!init
<<tiddler {{
	window.getCurrentFolder=function() {
		var h=document.location.href;
		return getLocalPath(decodeURIComponent(h.substr(0,h.lastIndexOf("/")+1)));
	}
	window.getParentFolder=function(cwd) {
		var lastchar=cwd.substr(cwd.length-1,1);
		if (lastchar=="/" || lastchar=="\\") cwd=cwd.substr(0,cwd.length-1);
		var pos=cwd.lastIndexOf("/"); if (pos==-1) pos=cwd.lastIndexOf("\\");
		return pos!=-1?cwd.substr(0,pos+1):null;
	}
	window.askForFolder=function(cwd) {
		if (config.browser.isIE) {
			try { // XPSP2 IE only
				var s = new ActiveXObject('UserAccounts.CommonDialog');
				s.InitialDir=cwd.replace(/\//g,"\\");
				s.FileName=''; s.Filter='All files|*.*|'; s.FilterIndex=1;
				var path=s.showOpen()?s.FileName.substr(0,s.FileName.lastIndexOf("\\")+1):null;
			}
			catch(e) { var path=prompt("Enter a directory path:",cwd.replace(/\//g,"\\"));	}
		} else { // FireFox
			if(!window.Components) return;
			try { netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); }
			catch(e) { alert(e.description?e.description:e.toString()); return; }
			var nsIFilePicker = window.Components.interfaces.nsIFilePicker;
			var picker = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
			picker.init(window, "Select a folder", nsIFilePicker.modeGetFolder);
			var thispath = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
			try { thispath.initWithPath(cwd.replace(/\\/g,"/")); }
			catch(e) { thispath.initWithPath(getLocalPath(decodeURIComponent(document.location.href.substr(0,document.location.href.lastIndexOf("/")+1)))); }
			picker.displayDirectory=thispath;
			picker.appendFilters(nsIFilePicker.filterAll); picker.defaultString=''; picker.defaultExtension=''; 
			var path=picker.show()!=nsIFilePicker.returnCancel?picker.file.path:null;
		}
		return path;
	}
	window.getFileList=function(cwd) { // returns array of file info (path,name,size,isFolder,url,modified)
		var files=[];
		if (config.browser.isIE) {
			cwd=cwd.replace(/\//g,"\\");
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			if(!fso.FolderExists(cwd)) return [];
			var dir=fso.GetFolder(cwd);
			for(var f=new Enumerator(dir.SubFolders); !f.atEnd(); f.moveNext())
				files.push({ path:f.item().path, name:f.item().name, size:f.item().size,
					url:"file:///"+f.item().path.replace(/\\/g,"/"), isFolder:fso.FolderExists(f.item().path),
					modified:new Date(f.item().DateLastModified).formatString("YYYY.0MM.0DD 0hh:0mm:0ss")});
			for(var f=new Enumerator(dir.Files); !f.atEnd(); f.moveNext())
				files.push({ path:f.item().path, name:f.item().name, size:f.item().size,
					url:"file:///"+f.item().path.replace(/\\/g,"/"), isFolder:fso.FolderExists(f.item().path),
					modified:new Date(f.item().DateLastModified).formatString("YYYY.0MM.0DD 0hh:0mm:0ss")});
		} else { // FF
			if(!window.Components) return;
			try { netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); }
			catch(e) { alert(e.description?e.description:e.toString()); return null; }
			var file=Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			try { file.initWithPath(cwd); } catch(e) { return []; }
			if (!file.exists() || !file.isDirectory()) { return []; }
			var folder=file.directoryEntries;
			while (folder.hasMoreElements()) {
				var f=folder.getNext().QueryInterface(Components.interfaces.nsILocalFile);
				if (f instanceof Components.interfaces.nsILocalFile)
					files.push({path:f.path, name:f.leafName, size:f.fileSize,
						isFolder:f.isDirectory(), url:"file:///"+f.path.replace(/\\/g,"/"),
						modified:new Date(f.lastModifiedTime).formatString("YYYY.0MM.0DD 0hh:0mm:0ss")});
			}
		}
		return files;
	}

	window.renderDirectoryList=function(target,cwd,fmt) {
		var files=getFileList(cwd);
		if (!files||!files.length) { // maybe relative directory... fixup and try again...
			var fixup=getCurrentFolder()+cwd;
			var files=getFileList(fixup);
			if (!files||!files.length) {
				var out="{{errorButton{error reading "+cwd+"}\}\}";
				removeChildren(target); wikify(out,target);
				target.style.display="block";
				return false;
			} else cwd=fixup;
		}
		if (!cwd||!cwd.length) cwd=config.options.txtLocalDirectory;
		if (!cwd||!cwd.length) cwd=getCurrentFolder();
		config.options.txtLocalDirectory=cwd;
		var header=""; var item=""; var folderitem=""; var folderlink=""; var footer="";
		switch (fmt) {
			case "plain": item=folderitem="<nowiki>%0</nowiki>\n"; break;
			case "list": item=folderitem="[[%1|file:///%0]]\n"; break;
			default:
				var header="Index of {{{%0}\}\}\n^^(as of %1)^^\n|filename&nbsp;&nbsp;| size&nbsp;&nbsp;|modified|h\n";
				var item="|[[%1|%2]]&nbsp;&nbsp;| %3&nbsp;&nbsp;|%4|\n";
				var folderlink='<html><a href="javascript:;" title="open %1..." onclick="';
				folderlink+='	var t=this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;';
				folderlink+="	window.renderDirectoryList(t,'%0','');";
				folderlink+='	return false;';
				folderlink+='">%1</a></html>';
				var folderitem='|'+folderlink+'&nbsp;&nbsp;| |%4|\n';
				var footer="|>|>|>| !Total of %0 bytes in %1 files |f\n|borderless sortable|k\n";
				var showDirectory=true;
				break;
		}
		var out=header.format([cwd,new Date().toLocaleString()]);
		if (showDirectory) {
			var p=getParentFolder(cwd);
			if (p) files.unshift({path:p, name:"(parent folder)", size:0, isFolder:true, url:"file:///"+p.replace(/\\/g,"/"),
				modified:new Date().formatString("YYYY.0MM.0DD 0hh:0mm:0ss")});
		}
		var total=0;
		for (var i=0; i<files.length; i++) {
			var line=(files[i].isFolder?folderitem:item).format([files[i].path,files[i].name,files[i].url,files[i].size,files[i].modified]);
			if (showDirectory) line=line.replace(/\\/g,"\\\\"); // fixup for PC-style file paths embedded in 'folderlink'
			if (!files[i].isFolder) total+=files[i].size;
			out+=line;
		}
		out+=footer.format([total,files.length]);
		removeChildren(target); wikify(out,target); target.style.display="block";

		// make table sortable (code adapted from [[TableSortingPlugin]]
		var c = config.tableSorting; if (!c) return; // no sortable tables
		var table = target.getElementsByTagName("table")[0];
		if (table) {
			var x=null, rev,
				thead=table.getElementsByTagName('thead')[0],
				headers=thead.rows[thead.rows.length-1].cells;
			for (var j=0; j<headers.length; j++){
				var h = headers[j];
				if (hasClass(h,"nosort")) continue;
				h.setAttribute("index",j);
				h.onclick = function(){c.sortTable(this); return false;};
				h.ondblclick = stopEvent;
				if(h.getElementsByTagName("span").length == 0)
					createTiddlyElement(h,"span",null,"hidden",c.uarrow); 
				if(!x && hasClass(h,"autosort"))
					{ x = j; rev = hasClass(h,"reverse"); }
			}
			if(x) c.sortTable(headers[x],rev);
		}
	}
'';}}>>
!end

!selectFolder
<html><a href='javascript:;' onclick='
	var path=askForFolder(getCurrentFolder());
	var target=this.parentNode.parentNode.parentNode.nextSibling;
	if (path) window.renderDirectoryList(target,path,"");
	return false;
'>select a folder</a>
| <a href='javascript:;' onclick='
	var target=this.parentNode.parentNode.parentNode.nextSibling;
	window.renderDirectoryList(target,getCurrentFolder(),"");
	return false;
'>use document location...</a>
| <a href='javascript:;' onclick='
	var target=this.parentNode.parentNode.parentNode.nextSibling;
	window.renderDirectoryList(target,config.options.txtLocalDirectory,"");
	return false;
'>refresh list...</a>
<nowiki></html>
!end

!show
<<tiddler ShowLocalDirectory##init>>{{hidden small{
<<tiddler ShowLocalDirectory##selectFolder>>
----
}}}@@display:none;content automatically replaced@@<<tiddler {{
	var cwd=getCurrentFolder(); // default to current folder
	if ("$1"=="$"+"1") // show 'select a folder' command
		place.lastChild.previousSibling.style.display="block";
	else if ("$1".toLowerCase()=="here") // use document directory
		cwd=getCurrentFolder();
	else // use path param as specified
		cwd="$1";
	window.renderDirectoryList(place.lastChild,cwd,"$2");
'';}}>>
!end

%/<<tiddler {{ var src='ShowLocalDirectory'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: [[$1]] [[$2]]>>