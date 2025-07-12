//{{{

window.applyPageTemplate_orig_ads = window.applyPageTemplate;

window.applyPageTemplate = function(title) {

  applyPageTemplate_orig_ads(title);

  var box = document.getElementById('adsenseBox');
  var bar = document.getElementById('adsenseBar');

  var sidebar = document.getElementById('sidebar');
  var sidebarOptions = document.getElementById('sidebarOptions');
  var displayArea = document.getElementById('displayArea');
  var tiddlerDisplay = document.getElementById('tiddlerDisplay');

  if (false && sidebar && sidebarOptions && box) {
    sidebar.insertBefore(box,sidebarOptions.nextSibling);
    box.style.display = 'block';
  }
  else if (sidebar && box) {
    sidebar.insertBefore(box,sidebar.childNodes[0]);
    box.style.display = 'block';
  }

  if (displayArea && bar) {
    //displayArea.insertBefore(bar,displayArea.childNodes[0]);
    displayArea.appendChild(bar);
    bar.style.display = 'block';
  }

};
setStylesheet(
'#adsenseBox { background:#fff; }\n'+
'#adsenseBar { background:#fff; padding-left:1em; }\n'+
'',
'adsenseStyles');

//}}}