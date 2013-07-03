// ==UserScript==
// @name         Github Wiki file uploader
// @description  this is a file uploader for upload images in github wiki
// @namespace    yoshii
// @author       yoshii
// @include      https://github.com/*/*/wiki*
// ==/UserScript==

var style = "<style>"
    + "#gollum-editor-body.gollum-editor-body { background-color: #E0FFFF; }"
    + "#uploadprogress { height: 4px; border-width: 1px; display: inline-block;}"
    + "</style>"

var html = '<p id="upload" class="hidden"><label>Drag & drop not supported, but you can still upload via this input field:<br><input type="file"></label></p>'
    + '<p id="filereader">File API & FileReader API not supported</p>'
    + '<p id="formdata">XHR2\'s FormData is not supported</p>'
    + '<p id="progress">XHR2\'s upload progress isn\'t supported</p>'
var progress_html = '<progress id="uploadprogress" min="0" max="100" value="0">0</progress>'

var $githubElement = $('#gollum-editor-body')
var $githubElement2 = $('#gollum-editor-function-bar')

var a = document.getElementById('gollum-editor-body').className;
$githubElement.append(style + html);

var holder = document.getElementById('gollum-editor-body'),
tests = {
    filereader: typeof FileReader != 'undefined',
    dnd: 'draggable' in document.createElement('span'),
    formdata: !!window.FormData,
    progress: "upload" in new XMLHttpRequest
},
support = {
    filereader: document.getElementById('filereader'),
    formdata: document.getElementById('formdata'),
    progress: document.getElementById('progress')
},
fileupload = document.getElementById('upload');

"filereader formdata progress".split(' ').forEach(function (api) {
    if (tests[api] === false) {
        support[api].className = 'fail';
    } else {
        // FFS. I could have done el.hidden = true, but IE doesn't support
        // hidden, so I tried to create a polyfill that would extend the
        // Element.prototype, but then IE10 doesn't even give me access
        // to the Element object. Brilliant.
        support[api].className = 'hidden';
    }
});

function delete_object( id_name ){
    var dom_obj=document.getElementById(id_name);
    var dom_obj_parent=dom_obj.parentNode;

    dom_obj_parent.removeChild(dom_obj);
}

// collback
function callback(xhr)
{
    var textarea = document.getElementById('gollum-editor-body');
    var bun = document.getElementById('gollum-editor-body').value;
    var length = bun.length;
    var location = textarea.selectionStart;
    var head = bun.substr(0, location);
    var tail = bun.substr(location, length);
    document.getElementById('gollum-editor-body').value = head + xhr.responseText + tail;
    progress.value = progress.innerHTML = 100;
    // delete progress_bar
    delete_object("progress_bar");
}

function readfiles(files) {
    var formData = tests.formdata ? new FormData() : null;
    // print progress bar
    $githubElement2.after(progress_html);
    progress = document.getElementById('uploadprogress');

    for (var i = 0; i < files.length; i++) {
        if (tests.formdata) formData.append('file', files[i]);
    }
    progress.value = progress.innerHTML = 50;

    // now post a new XHR request
    if (tests.formdata) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://xxx/test.cgi');
        progress.value = progress.innerHTML = 80;

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr);
            }
        }

        xhr.send(formData);
    }
}

if (tests.dnd) { 
    holder.ondragover = function () { this.className = a + ' gollum-editor-body'; return false; };
    holder.ondragend = function () { this.className = a; return false; };
    holder.ondragleave = function () { this.className = a; return false; };
    holder.ondrop = function (e) {
        this.className = a;
        e.preventDefault();
        readfiles(e.dataTransfer.files);
    }
} else {
    fileupload.className = 'hidden';
    fileupload.querySelector('input').onchange = function () {
        readfiles(this.files);
    };
}
