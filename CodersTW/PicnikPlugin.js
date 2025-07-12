/***
|Name|PicnikGalleryPlugin|
|Source|http://coderswiki.jenskillus.de/#PicnikPlugin|
|Version|0.1.9|
|Author|Jens Killus <jens(dot)killus(at)gmx(dot)de>|
|License|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|~CoreVersion|2.6|
|Type|plugin|
|Requires|Brantley Harris' JSON Plugin for jQuery <br>http://code.google.com/p/jquery-json/|
|Issues|composing a gallery works only in firefox <br>needs testing for linux and mac|
|Overrides||
|Description|image gallery inside wiki text|
!!Description
Picnik is a highly configurable image gallery plugin for sluggish nerds and programers. Picnik operates in two modes: When working locally you can add new images from your harddrive to the gallery, but you don't need to write down individual image names/~URLs or select files from a dialog box, simply tell picnik the directory where your images are and it will scan the directory and do the rest for you. You can add hundreds of images in a single batch. Information about found images (file name, location in subfolders) will be stored in a hidden tiddler. Then upload your tiddlywiki HTML file and your image folder to the web and picnik will use the hidden tiddler to display the gallery. Out of the box picnik will display your images similar to the thumbnail view in windows explorer (or other file managers) and link each image to an individual tiddler based on the image name. You may use a special tiddler as template for these idividual tiddlers for prefilling them with markup for displaying the image and information about it.
!!Notes
* ''Composing a gallery only works in firefox (I'm 100% firefox) up to version 14.x, but displaying (web) should work with all browsers. Unfortunately, as of version 15.0, firefox no longer allows requests to access the local file system, and produces an error instead. Please read this [[GoogleGroupsMessage|https://groups.google.com/d/msg/tiddlywikidev/1Em8cJviVKk/LVGKpu2LzeAJ]] for tweaking your firefox preferences to re-enable local file system access. You may also use a [[legacy firefox from protable apps|http://portableapps.com/apps/internet/firefox_portable/localization#legacy36]] for gallery composing.''
* When composing the gallery, picnik will update it each time you edit its tiddler or when you refresh your browser view.
* Individual image tiddlers are not created automatically but when you first click on the image link.
!!Installation
For starting your own gallery you may download my preconfigured demo package or installing picnik manually:
* Download [[Brantley Harris' JSON Plugin for jQuery|http://code.google.com/p/jquery-json/]], place the javascript file in a subdirectory {{{js}}} and add it to your tiddlywiki by adding following code to shaddow tiddler MarkupPostBody:
//{{{
<script type='text/javascript' src='js/jquery.json.js'></script>
//}}}
* Install this plugin.
!!Usage
You can define multiple galleries in one tiddler and mix gallery sections with sections containing other markup like wikitext or HTML. To define a gallery, place a paragraph {{{<picnik>YOUR_SETTINGS...</picnik>}}} in the tiddler. Settings may contain
* arguments like your image directory or wether to recurse into subdirectories or not
* HTML code with markers like {{{##src}}} for customizing the gallery, each marker (without hash keys) refers to a configuration setting or to the actual image (e.g. its name)
Picnik ships with a complete set of defaults, but you can override them by placing your own defaults in a tiddler named {{{PicnikSettings}}}. You can write down settings in two ways:
* ''Simple settings mode''. One setting per line in form of {{{key: value}}}. You can not use {{{{}}} characters in this mode because settings will be interpreted as javascript, but you may wrap your settings in @@<nowiki>//{{{YOUR_SETTINGS...//}}}</nowiki>@@. Do not use single quotes in HTML code but always double quotes. Be careful when defining own values like {{{values.prefix}}}, (sub-)keynames must always be a valid javascript variable name.
* When you need more power you can use the ''Javascript settings mode''. Your settings will be evaluated as javascript code. Here are picnik's default settings (slightly stripped down) with a modified {{{proc}}} function which will limit the gallery to the first 10 images:
//{{{
{
  dir: 'c:\\my_pictures\\best_pictures',
  img: '<img src="##src" alt="##src" style="float: left; width: 250px; padding: 5px; border: 1px solid #666666;" />',
  wrap: '<a href="javascript:;" onclick="onClickPicnikLink(event);" class="tiddlyLink" style="float: left;" refresh="link" tiddlylink="##prefix##basename">##img</a>',
  container: '<div class="picnikGallery">##wrap</div><div style="clear: both; height: 0; margin-bottom: 20px;">&nbsp;</div>',
  values: {
    prefix: 'BestImages'
  },
  proc: function(r) {
    return r.num < 10;
  }
}
//}}}
!!Configuration settings
|!Parameter|!Description|!Default|!Remarks|
|''dir''|the directory containing your images|c:\my_pictures|You can specify an absolute path or a relative path inside the directory where your tiddlywiki html file is. Web display will only work with relative paths, picnik will not store information for files lying outside tiddlywiki's directory. The plugin doesn't check if an absolute path resolves to a tiddlywiki subdirectory.|
|''recursive''|wether to process subdirectories or not|false||
|''img''|HTML code for an image|see code||
|''wrap''|HTML code wrapping arround each image|see code||
|''container''|HTML code wrapping arround a complete gallery section|see code|e.g. to clear a floating area|
|''values''|additional data values||In ''simple settings mode'' specify each value as {{{values.subkey: value}}}.|
|''values.prefix''|prefix for individual image tiddlers|||
|''proc''|an optional javascript function to decide wether an image should be added to the gallery or not, should return //true// or //false//||Only in ''javascript settings mode''.|
|''postproc''|executed as last step just before rendering the HTML output, an optional javascript function which will become passed in an array of all images, e.g. for shuffeling them by random||Only in ''javascript settings mode'', no return value, simply manipulate the passed in array.|
!!per image variables
|!Variable|!HTML attribute in gallery settings|!Description|!Remarks|
|''src''|src|image URL|__absolute__: file:///c:/my_pictures/picture_001.jpg <br>__relative__: images/image_001.jpg|
|''file''|picfile|image file name|picture_001.jpg|
|''basename''|picbasename|image file name without file type suffix|image_001|
|''prefix''|picprefix|values.prefix|specify only the subkey|
|''num''|picnum|actual image number|Starting with 0 when used in {{{proc}}} + {{{postproc}}}, starting with 1 when used in individual image tiddlers.|
|''max''|picmax|total number of images in gallery section|See {{{num}}}.|
|''chunk''|chunk|actual number of gallery section in tiddler|See {{{num}}}.|
|''mch''|chunkmax|total number of gallery sections|See {{{num}}}.|
|''tiddler''|tiddler|the tiddlers' name containing the gallery||
|''nbtiddler''|nbtiddler|tiddler name, spaces replaced by {{{-}}}||
!!Template for individual image tiddlers
Create a tiddler {{{PicnikTemplate}}}. If the individual image tiddler doesn't exist, picnik will create it any copy the template's content to the individual tiddler and replace the markers. Picnik will also copy the template's tags to the new tiddler. This code displays a table with the image on the left and various information about the image on the right:
//{{{
|[img[##src]]|''imgtiddler'' (tiddlylink)|##imgtiddler|
|~|''tiddler'' (gallery)|[[##tiddler]]|
|~|''nbtiddler''|##nbtiddler|
|~|''src''|##src|
|~|''file''|##file|
|~|''basename''|##basename|
|~|''num''|##num|
|~|''max''|##max|
|~|''chunk''|##chunk|
|~|''chunkmax''|##mch|
|~|''picprefix''|##picprefix|
//}}}
!!Example: complete settings for a gallery in form of simple settings
//{{{
dir: c:\my_pictures
recursive: 0
img: <img src="##src" alt="##src" title="##src" style="float: left; width: 250px; padding: 5px; border: 1px solid #666666;" picfile="##file" picbasename="##basename" picnum="##num" />
wrap: <a href="javascript:;" onclick="onClickPicnikLink(event);" class="tiddlyLink" title="##src" style="float: left; margin: 0 10px 10px 0;" refresh="link" tiddlylink="##prefix##basename">##img</a>
container: <div class="picnikGallery" nbtiddler="##nbtiddler" id="##nbtiddler-##chunk" picmax="##max" chunk="##chunk" chunkmax="##mch" picprefix="##prefix">##wrap</div><div style="clear: both; height: 0; margin-bottom: 20px;">&nbsp;</div>
values.prefix: MyPictures
//}}}
Only {{{dir}}} is needed, if the other settings are missing, picnik will use the settings from tiddler {{{PicnikSettings}}} or the plugin's internal defaults. Avoid using umlauts and special characters in tiddler names and file names if HTML attributes like {{{id}}} or {{{class}}} are based on them (see container {{{id="##nbtiddler-##chunk"}}}, this may evaluate to {{{id="MyImageGallery-0"}}}). Use {{{values.prefix}}} to bypass this limitation.
!!Example: complete settings for a gallery in form of javascript settings
//{{{
{
  dir: 'c:\\my_pictures',
  recursive: false,
  img: '<img src="##src" alt="##src" title="##src" style="float: left; width: 250px; padding: 5px; border: 1px solid #666666;" picfile="##file" picbasename="##basename" picnum="##num" />',
  wrap: '<a href="javascript:;" onclick="onClickPicnikLink(event);" class="tiddlyLink" title="##src" style="float: left; margin: 0 10px 10px 0;" refresh="link" tiddlylink="##prefix##basename">##img</a>',
  container: '<div class="picnikGallery" nbtiddler="##nbtiddler" id="##nbtiddler-##chunk" picmax="##max" chunk="##chunk" chunkmax="##mch" picprefix="##prefix">##wrap</div><div style="clear: both; height: 0; margin-bottom: 20px;">&nbsp;</div>',
  values: {
    prefix: ''
  }
}
//}}}
!!Example: postproc function for reverse image display
//{{{
{
  postproc: function(a) { a.reverse(); }
}
//}}}
!!Version History
|0.1.7|2012-04-27|first public release|
|0.1.8|2012-04-29|fixed perfomance problems creating individual image tiddlers in huge galleries (> 700 images)|
|0.1.9|2012-04-29|fixed javascript error with onClickPicnikLink in internet explorer|
!!Plugin Code
***/
//{{{
version.extensions.PicnikFormatting = {major: 0, minor: 1, revision: 9, date: new Date(2012, 4, 29)};
config.formatters.push(
  {
    name: 'picnikGallery',
    match: '<picnik>',
    lookaheadRegExp: /(?:<picnik>)((?:.|\n)*?)(?:<\/picnik>)/mg,
    defaultSettings:
    {
      dir: 'c:\\my_pictures',
      recursive: false,
      img: '<img src="##src" alt="##src" title="##src" style="float: left; width: 250px; padding: 5px; border: 1px solid #666666;" picfile="##file" picbasename="##basename" picnum="##num" />',
      wrap: '<a href="javascript:;" onclick="onClickPicnikLink(event);" class="tiddlyLink" title="##src" style="float: left; margin: 0 10px 10px 0;" refresh="link" tiddlylink="##prefix##basename">##img</a>',
      container: '<div class="picnikGallery" nbtiddler="##nbtiddler" id="##nbtiddler-##chunk" picmax="##max" chunk="##chunk" chunkmax="##mch" picprefix="##prefix">##wrap</div><div style="clear: both; height: 0; margin-bottom: 20px;">&nbsp;</div>',
      values: {
        prefix: ''
      },
      proc: function(r) {
        return true;
      },
      postproc: function(allpics) {
      }
    },
    parseSettings: function(str)
    {
      var settings = {};
      str = str.replace(/(\/\/)*\s*{{{/, '').replace(/(\/\/)*\s*}}}/, '');
      try {
        if (str.indexOf('{') != -1) {
          settings = eval('(' + str + ')');
        } else {
          str = str.replace(/\r/gm, '\n').replace(/\n+/gm, '\n');
          var lines = str.split('\n'), i, l, k, v, subkeys, j, path, d;
          for (i = 0; i < lines.length; i++) {
            l = jQuery.trim(lines[i]);
            if (l != '') {
              l += ' ';
              if (l.indexOf(':') == -1) {
                k = jQuery.trim(l);
                v = '';
              } else {
                k = jQuery.trim(l.slice(0, l.indexOf(':')));
                v = jQuery.trim(l.slice(l.indexOf(':') + 1));
              }
              if (k.indexOf('.') == -1) {
                settings[k] = v;
              } else {
                subkeys = k.split('.');
                for (j = 1; j <= subkeys.length - 1; j++) {
                  path = 'settings[\'' + subkeys.slice(0, j).join('\'][\'') + '\']';
                  d = eval('typeof ' + path);
                  if (d == 'undefined') {
                    eval(path + ' = {}');
                  }
                }
                path += '[\'' + subkeys.pop() + '\']';
                eval(path + ' = \'' + v + '\'');
              }
            }
          }
        }
      } catch(e) {}
      return settings;
    },
    readSettings: function(str)
    {
      var settings = this.parseSettings(str);
      if (store.tiddlerExists('PicnikSettings')) {
        var myDefaults = this.parseSettings(store.getTiddlerText('PicnikSettings'));
        this.settings = jQuery.extend(true, {}, this.defaultSettings, myDefaults, settings);
      } else {
        this.settings = jQuery.extend(true, {}, this.defaultSettings, settings);
      }
    },
    checkPlatform: function()
    {
      if (window.location.protocol == 'file:') {
        this.isLocal = true;
        return config.browser.isGecko;
      } else {
        this.isLocal = false;
        return true;
      }
    },
    replace: function(str, vals)
    {
      jQuery.each(vals, function(k, v){
        str = str.replace(new RegExp('##' + k, 'g'), v);
      });
      return str;
    },
    isImage: function(p)
    {
      var ok = p.split('.').pop().match(/^jpg|jpeg|gif|bmp|png|tif|tiff$/i);
      return ok ? true : false;
    },
    makeAbsPath: function()
    {
      this.imgDirRel = '';
      this.localScriptPath = '';
      if (config.browser.isWindows) {
        if (this.settings.dir.indexOf(':') == -1) {
          this.imgDirRel = this.settings.dir.replace(/\\+/g, '/');
          var p = window.location.pathname;
          this.localScriptPath = p.slice(1, p.lastIndexOf('/')).replace(/%20/g, ' ');
          this.settings.dir = this.localScriptPath.replace(/\//g, '\\') + '\\' + this.settings.dir;
        }
      } else {
        if (this.settings.dir.indexOf('/') != 0) {
          this.imgDirRel = this.settings.dir;
          var p = window.location.pathname;
          this.localScriptPath = p.slice(0, p.lastIndexOf('/')).replace(/%20/g, ' ');
          this.settings.dir = this.localScriptPath + '/' + this.settings.dir;
        }
      }
    },
    scanDir: function(dir)
    {
      var filesInDir = [], filesInSubdir = [], actualDirEntry;
      while (dir.hasMoreElements()) {
        actualDirEntry = dir.getNext().QueryInterface(Components.interfaces.nsILocalFile);
        if (actualDirEntry.isDirectory()) {
          if (this.settings.recursive) {
            filesInSubdir = this.scanDir(actualDirEntry.directoryEntries);
            filesInDir = filesInDir.concat(filesInSubdir);
          }
        } else {
          filesInDir.push(actualDirEntry);
        }
      }
      return filesInDir;
    },
    readImageDir: function()
    {
      this.makeAbsPath();
      var images = [];
      try {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var dir = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
        dir.initWithPath(this.settings.dir);
        if (dir.exists() && dir.isDirectory()) {
          var files = this.scanDir(dir.directoryEntries);
          for (var i = 0; i < files.length; i++) {
            if (this.isImage(files[i].path)) {
              images.push(files[i].path.replace(/\\+/g, '/').replace(/\/+/g, '/'));
            }
          }
        }
      } catch(e) {}
      return images;
    },
    getChunkInfo: function(wikifier)
    {
      var chunkIndex = wikifier.source.slice(0, wikifier.matchStart).match(/<picnik>/g);
      this.chunkIndex = chunkIndex === null ? 0 : chunkIndex.length;
      var chunkNums = wikifier.source.match(/<picnik>/g);
      this.chunkNums = chunkNums === null ? 0 : chunkNums.length;
    },
    storePics: function(p)
    {
      if (this.chunkIndex == 0) {
        this.picStore = [];
      }
      this.picStore[this.chunkIndex] = p;
      if (this.picStore.length == this.chunkNums) {
        var t = 'PicnikStore' + this.tiddler;
        var b = '//{{{\n' +  jQuery.toJSON(this.picStore) + '\n//}}}';
        store.removeTiddler(t);
        store.saveTiddler(t, t, b, null, null, this.storeTags);
        store.setDirty(true);
        saveChanges();
      }
    },
    fixPicsStore: function(reset)
    {
      if (typeof(reset) == 'boolean' && reset) {
        this.picStore = [];
      }
      if (!jQuery.isArray(this.picStore)) {
        this.picStore = [];
      }
      for (var i = 0; i < this.chunkNums; i++) {
        if (!jQuery.isArray(this.picStore[i])) {
          this.picStore[i] = [];
        }
      }
    },
    getPicsForWeb: function()
    {
      if (this.chunkIndex == 0) {
        var pics = store.getTiddlerText('PicnikStore' + this.tiddler);
        if (pics === null) {
          this.fixPicsStore(true);
        } else {
          pics = pics.replace('//{{{\n', '').replace('\n//}}}', '');
          this.picStore = jQuery.evalJSON(pics);
          this.fixPicsStore();
        }
      }
      return this.picStore[this.chunkIndex];
    },
    getPicsForLocal: function()
    {
      var pics = [], arr = this.readImageDir();
      if (arr.length) {
        var i, r, proc, srcRel;
        for (i = 0; i < arr.length; i++) {
          r = {
            src: this.imgDirRel ? arr[i].slice(this.localScriptPath.length + 1) : 'file:///' + arr[i],
            file: arr[i].split('/').pop(),
            basename: null,
            num: i,
            max: arr.length,
            chunk: this.chunkIndex,
            mch: this.chunkNums,
            tiddler: this.tiddler,
            nbtiddler: this.nbtiddler
          };
          r.basename = r.file.slice(0, r.file.lastIndexOf('.'));
          if (typeof(this.settings.values) == 'object') {
            jQuery.extend(r, this.settings.values);
          }
          proc = typeof(this.settings.proc) != 'function' ? true : this.settings.proc(r);
          if (proc) {
            pics.push(r);
          }
        }
        if (pics.length && typeof(this.settings.postproc) == 'function') {
          this.settings.postproc(pics);
        }
      }
      if (this.tiddler) {
        this.imgDirRel ? this.storePics(pics) : this.storePics([]);
      }
      return pics;
    },
    handler: function(w)
    {
      this.lookaheadRegExp.lastIndex = w.matchStart;
      var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
      if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
        this.readSettings(lookaheadMatch[1]);
        if (this.checkPlatform()) {
          this.tiddler = w.output.parentNode.getAttribute('tiddler');
          this.nbtiddler = this.tiddler.replace(/\s/g, '-');
          this.getChunkInfo(w);
          var pics = this.isLocal ? this.getPicsForLocal() : this.getPicsForWeb();
          if (pics.length) {
            var i, output = '', img, wrap, container;
            for (i = 0; i < pics.length; i++) {
              img = this.replace(this.settings.img, pics[i]);
              if (typeof(this.settings.wrap) == 'string' && this.settings.wrap != '') {
                wrap = this.replace(this.settings.wrap.replace('##img', img), pics[i]);
                output += wrap;
              } else {
                output += img;
              }
            }
            if (typeof(this.settings.container) == 'string' && this.settings.container != '') {
              jQuery(w.output).append(this.replace(this.settings.container.replace('##wrap', output), pics[0]));
            } else {
              jQuery(w.output).append(output);
            }
          }
        }
        w.nextMatch = this.lookaheadRegExp.lastIndex;
      }
    },
    settings: {},
    localScriptPath: '',
    imgDirRel: '',
    tiddler: '',
    nbtiddler: '',
    isLocal: false,
    chunkIndex: 0,
    chunkNums: 0,
    picStore: [],
    storeTags: ['excludeLists', 'excludeMissing'] // ['excludeLists', 'excludeMissing', 'excludeSearch']
  }
);

window.picnikReplace = function(str, vals)
{
  jQuery.each(vals, function(k, v){
    str = str.replace(new RegExp('##' + k, 'g'), v);
  });
  return str;
};

window.picnikFindAttr = function(node, attr)
{
  var attrVal = null;
  node = jQuery(node);
  while (attrVal == null) {
    attrVal = node.attr(attr);
    if (node.hasClass('tiddler')) {
      break;
    }
    node = node.parent();
  }
  if (attrVal == null) {
    attrVal = '';
  }
  return attrVal;
};

window.onClickPicnikLink = function(ev)
{
  var e = ev || window.event;
  var target = resolveTarget(e);
  var title = picnikFindAttr(target, 'tiddlylink');
  if (title) {
    if (!store.tiddlerExists(title) && store.tiddlerExists('PicnikTemplate')) {
      var r = {
        tiddler: picnikFindAttr(target, 'tiddler'),
        imgtiddler: title,
        nbtiddler: picnikFindAttr(target, 'nbtiddler'),
        src: picnikFindAttr(target, 'src'),
        file: picnikFindAttr(target, 'picfile'),
        basename: picnikFindAttr(target, 'picbasename'),
        num: picnikFindAttr(target, 'picnum'),
        max: picnikFindAttr(target, 'picmax'),
        chunk: picnikFindAttr(target, 'chunk'),
        mch: picnikFindAttr(target, 'chunkmax'),
        picprefix: picnikFindAttr(target, 'picprefix')
      };
      if (r.num) {
        r.num = parseInt(r.num) + 1;
      }
      if (r.chunk) {
        r.chunk = parseInt(r.chunk) + 1;
      }
      var body = picnikReplace(store.getTiddlerText('PicnikTemplate'), r);
      var tiddler = store.fetchTiddler('PicnikTemplate');
      store.saveTiddler(title, title, body, null, null, tiddler.tags);
      if (window.location.protocol == 'file:') {
        store.setDirty(true);
        saveChanges();
      }
    }
    onClickTiddlerLink(e);
  }
  return false;
};

//}}}