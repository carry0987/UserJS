// ==UserScript==
// @name         EH Viewer
// @author       Illya
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @description  Manage your favorite tags, enhance searching, improve comic page
// @icon         https://e-hentai.org/favicon.ico
// @include      *://exhentai.org/*
// @include      *://e-hentai.org/*
// @run-at       document-end
// ==/UserScript==

var custom_filter = getValue('custom_filter', -1);
initScript();
(function(){
    getElem('#img').style.width = getValue('user_width');
})
if (window.location.href.includes('/s/')) {
    // Handle comic page
    EhViewer('s');
} else if (window.location.href.includes('/mpv/')) {
    // Handle multi page mode
    EhViewer('mpv');
} else if (window.location.href.includes('/g/')) {
    // Handle gallery page
    addNewStyle('input{margin:2px 2px!important;}');
    filterForGallery();
} else if (document.getElementById('searchbox') !== null) {
    // Add tag management feature to searchbox
    addNewStyle('input{margin:2px 2px!important;}');
    addFilter(document.getElementsByClassName("nopm")[0]);
}

function initScript() {
    setValue('custom_filter', custom_filter);
    if (getValue('user_width') || getValue('user_height')) {
        addNewStyle('width: ' + getValue('user_width')+';', 'img');
        addNewStyle('height: ' + getValue('user_height')+';', 'img');
    }
}

// Add style to current page
function addNewStyle(newStyle, target) {
    if (target == undefined) {
        target = 'new-styles';
    }
    var styleElement = document.getElementById(target);
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = target;
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(newStyle));
    } else {
        styleElement.innerText = newStyle;
    }
}

// Add tag management and searchbox to gallery page
function filterForGallery() {
    var galleryFilter = document.body.insertBefore(document.createElement('form'), document.getElementsByClassName('gm')[0]);
    galleryFilter.innerHTML = '<p id="galleryFilter" class="nopm"><input type="text" name="f_search" placeholder="Search Keywords" value="" size="50"><input type="submit" name="f_apply" value="Apply Filter"></p>';
    galleryFilter.setAttribute('style', 'display: none; width: 30%; text-align: center; margin: 10px auto; border: 2px ridge black; padding: 10px;');
    galleryFilter.setAttribute('action', 'https://exhentai.org/');
    galleryFilter.setAttribute('method', 'get');
    addFilter(document.getElementById('galleryFilter'));
    var tb = document.getElementById('taglist').firstElementChild.firstElementChild;
    tb.innerHTML += '<tr><td class="tc">EHV:</td><td><div id="show_filter" class="gt" style="cursor:pointer">show filter</div></td></tr>';
    document.getElementById('show_filter').addEventListener('click', function(e) {
        if (e.target.innerText === 'show filter') {
            galleryFilter.style.display = "block";
            e.target.innerText = 'hide filter'
        } else {
            galleryFilter.style.display = "none";
            e.target.innerText = 'show filter'
        }
    })
    var i;
    for (i = 0; i < document.all.length; i++) {
        if (document.all[i].id.slice(0, 3) === 'ta_') {
            document.all[i].addEventListener('contextmenu', addGalleryTag, false);
        }
    }

    // Allow you to add tags of this gallery to searchbox
    function addGalleryTag(e) {
        e.preventDefault();
        var searchBox = galleryFilter.firstElementChild.firstElementChild;
        var tagValue = '"' + e.target.innerText + '"';
        if (searchBox.value.includes(tagValue)) {
            // console.log('del?');
            searchBox.value = searchBox.value.replace(tagValue, '');
        } else {
            searchBox.value += tagValue;
        }
    }
}

// Add tag management feature to specific position (i.e. boxPos)
function addFilter(boxPos) {
    var ipColor1;
    var ipColor2;
    if (window.location.host === 'e-hentai.org') {
        ipColor1 = 0xedeada;
        ipColor2 = ipColor1 - 0x202020;
    } else {
        ipColor1 = 0x34353b;
        ipColor2 = ipColor1 + 0x202020;
    }
    ipColor1 = '#' + ipColor1.toString('16');
    ipColor2 = '#' + ipColor2.toString('16');
    var search_box = boxPos.firstElementChild;
    var p = document.getElementById('custom_filter');
    if (p == undefined) {
        boxPos.appendChild(document.createElement('br'));
        boxPos.appendChild(document.createElement('br'));
        p = boxPos.appendChild(document.createElement('p'));
        boxPos.appendChild(document.createElement('br'));
        p.setAttribute('class', 'nopm');
        p.setAttribute('id', 'custom_filter');
    } else {
        p.innerHTML = '';
    }
    for (var tagName in custom_filter) {
        var t = p.appendChild(document.createElement('input'));
        t.setAttribute('type', 'button');
        t.setAttribute('value', tagName);
        // t.setAttribute('tag', filter.tag);
        t.addEventListener('click', searchTags, false);
        t.addEventListener('contextmenu', delTags, false);
        if (tagsExist(custom_filter[tagName])) {
            t.style.backgroundColor = ipColor2;
        } else {
            t.style.backgroundColor = ipColor1;
        }
    }
    t = p.appendChild(document.createElement('input'));
    t.setAttribute('type', 'button');
    t.setAttribute('value', "+");
    t.addEventListener('click', newTag, false);

    function tagsExist(tags) {
        var exist = true;
        var i;
        for (i = 0; i < tags.length; i++) {
            if (search_box.value.includes(tags[i])) {;
            } else {
                exist = false;
                break;
            }
        }
        return exist;
    }

    function searchTags(e) {
        // get tags
        var tagName = e.target.value;
        var tags = custom_filter[tagName];
        // handle searchbox value and btn color
        if (tagsExist(tags)) {
            tags.forEach(function(tag) {
                search_box.value = search_box.value.replace(('"' + tag + '"'), "");
            });
            e.target.style.backgroundColor = ipColor1;
        } else {
            tags.forEach(function(tag) {
                if (search_box.value.includes(tag)) {;
                } else {
                    search_box.value += ('"' + tag + '"');
                }
            });
            e.target.style.backgroundColor = ipColor2;
        }
    }

    function delTags(e) {
        e.preventDefault();
        if (window.confirm('Delete this tag?') == true) {
            var tagName = e.target.value;
            delete custom_filter[tagName];
            setValue('custom_filter', custom_filter);
            addFilter(e.target.parentElement.parentElement);
        }
    }

    function newTag(e) {
        var tagStr = window.prompt('Add filter like format below', '[tag] or [name@tag] or [name@tag+tag+tag+tag]').split('@');
        if (tagStr.length == 1 && tagStr[0] != '') {
            // custom_filter.push({'name':tagStr[0], 'tags':tagStr});
            custom_filter[tagStr[0]] = tagStr;
        } else if (tagStr.length == 2) {
            var tags = tagStr[1].split('+');
            // custom_filter.push({'name':tagStr[0], 'tag':tags}); 
            custom_filter[tagStr[0]] = tags;
        } else {
            window.alert('Invalid input... :(');
        }
        setValue('custom_filter', custom_filter);
        addFilter(e.target.parentElement.parentElement);
    }
}

// Optimize the comic page style, add functional buttons
function EhViewer(mode) {
    console.log('EhV start...');
    var isFirstRun = true;
    var current_scale = 1;
    var zoomInterval;
    var setScale;
    var float_list = document.createElement('ul');
    float_list.setAttribute('class', 'float_list');
    document.body.appendChild(float_list);
    var float_btn = new Array([]);
    var i;
    for (i = 0; i < 2; i++) {
        float_btn[i] = document.createElement('li');
        float_list.appendChild(float_btn[i]);
    }
    float_btn[0].setAttribute('class', "float_btn zoom_in");
    float_btn[1].setAttribute('class', "float_btn zoom_out");
    float_btn[0].innerText = '+';
    float_btn[1].innerText = '-';
    // zoomIn/Out -> setScale -> s/mpv
    float_btn[0].addEventListener('mousedown', zoomIn, false);
    float_btn[1].addEventListener('mousedown', zoomOut, false);
    document.addEventListener('mouseup', function() { clearInterval(zoomInterval); });
    if (mode == 's') {
        var oldSi;
        if (typeof si !== 'undefined') {
            oldSi = si;
        } else {
            var si;
            oldSi = false;
        }
        var firstPage = document.getElementsByClassName("sn")[0].firstChild.href;
        var lastPage = document.getElementsByClassName("sn")[0].lastChild.href;
        setScale = s;
        // add extra btn for this mode
        for (i = 2; i < 5; i++) {
            float_btn[i] = document.createElement("li");
            float_list.appendChild(float_btn[i]);
        }
        float_btn[2].setAttribute("class", "float_btn prev_page");
        float_btn[3].setAttribute("class", "float_btn next_page");
        float_btn[4].setAttribute("class", "float_btn gallery");
        float_btn[2].innerText = "👈";
        float_btn[3].innerText = "👉";
        float_btn[4].innerText = "📚";
        float_btn[2].addEventListener('click', prevPage, false);
        float_btn[3].addEventListener('click', nextPage, false);
        float_btn[4].setAttribute("onclick", "window.open(document.getElementsByClassName('sb')[0].firstChild.href,'_self');");
        document.addEventListener("keydown", keyDown);
        //Initial when user enter comic page from elsewhere
        setNewPage();
    } else if (mode == 'mpv') {
        setScale = mpv;
        addNewStyle("#pane_images_inner>div{margin:auto;}", "img-center-align");
        document.addEventListener("keydown", function(e) {
            var keycode = e.which;
            switch (keycode) {
                case 187:
                    {
                        setScale("zoomIn");
                        break;
                    }
                case 189:
                    {
                        setScale("zoomOut");
                        break;
                    }
                default:
                    {;
                    }
            }
        })
    }
    setBtnStyle();

    function setBtnStyle() {
        var btnStyle = '.float_list{display:block; position:fixed; bottom:10px; right:10px; list-style:none;z-index:1005;}' +
            '.float_btn{position:relative; user-select:none;background-color:btColor1; margin:5px; width:50px; height:50px; line-height:50px; font-size:12px; border-radius:50%; cursor:pointer;}' +
            '.float_btn:hover{transition-duration:250ms; background-color:btColor2; box-shadow:0 0 3px 1px shadowColor;}' +
            '.float_btn:active{transition-duration:250ms; top:1px; box-shadow:0 0 3px 0px shadowColor;}';
        var btColor1;
        var btColor2;
        var shadowColor;
        if (window.location.host === 'e-hentai.org') {
            btColor1 = 0xe3e0d1 - 0x101010;
            btColor2 = btColor1 - 0x050505;
            shadowColor = btColor1 + 0x080808;
        } else {
            btColor1 = 0x34353b + 0x101010;
            btColor2 = btColor1 + 0x050505;
            shadowColor = btColor1 - 0x080808;
        }
        btnStyle = btnStyle.replace('btColor1', '#' + btColor1.toString('16'));
        btnStyle = btnStyle.replace('btColor2', '#' + btColor2.toString('16'));
        btnStyle = btnStyle.replace('shadowColor', '#' + shadowColor.toString('16'));
        btnStyle = btnStyle.replace('shadowColor', '#' + shadowColor.toString('16'));
        addNewStyle(btnStyle, 'btn-style');
    }

    function keyDown(e) {
        var keycode = e.which;
        switch (keycode) {
            case 37:
                {
                    setNewPage();
                    break;
                }
            case 39:
                {
                    setNewPage();
                    break;
                }
            case 187:
                {
                    setScale("zoomIn");
                    break;
                }
            case 189:
                {
                    setScale("zoomOut");
                    break;
                }
            case 188:
                {
                    window.scrollBy(0, -window.innerHeight);
                    break;
                }
            case 190:
                {
                    window.scrollBy(0, window.innerHeight);
                    break;
                }
            case 219:
                {
                    window.scrollBy(0, -window.innerHeight * 0.3);
                    break;
                }
            case 221:
                {
                    window.scrollBy(0, window.innerHeight * 0.3);
                    break;
                }
            default:
                {
                    // console.log(keycode);
                }
        }
    }

    function setNewPage() {
        var listenChange = setInterval(function() {
            if ((oldSi == false) || isFirstRun) {
                isFirstRun = false;
                var newStyle = 'h1, #i2, #i5, #i6, #i7, .ip, .sn{display:none!important;} ::-webkit-scrollbar{display:none;}';
                addNewStyle(newStyle);
                var pic = document.getElementById("img");
                var width = Number(pic.style.width.replace('px', ""));
                var height = Number(pic.style.height.replace('px', ""));
                var page = document.getElementsByTagName('span');
                var footMark = document.getElementById('i4').firstChild;
                var currentPage = page[0].innerText;
                var totalPage = page[1].innerText;
                footMark.innerHTML = currentPage + "P / " + totalPage + "P :: " + footMark.innerText + " :: ";
                var originDlLink = document.getElementById('i7').lastChild;
                if (originDlLink != null) {
                    var dlLink = document.createElement('a');
                    dlLink.href = originDlLink.href;
                    dlLink.innerText = originDlLink.innerText;
                    footMark.appendChild(dlLink);
                } else {
                    footMark.innerHTML += 'No download';
                }
                if (getValue('user_width')) {
                    width = getValue('user_width');
                } else {
                    width *= current_scale;
                    width += 'px';
                }
                if (getValue('user_height')) {
                    height = getValue('user_height');
                } else {
                    height *= current_scale;
                    height += 'px';
                }
                pic.style.width = width;
                pic.style.height = height;
                var oldSi;
                if (typeof si !== 'undefined') {
                    oldSi = si;
                } else {
                    oldSi = false;
                }
                clearInterval(listenChange);
            }
        }, 500);
    }

    function prevPage(e) {
        e.preventDefault();
        if (window.location.href !== firstPage) {
            document.getElementById('prev').onclick();
        } else {
            window.alert('The first page (⊙_⊙)')
        }
        setNewPage();
    }

    function nextPage(e) {
        e.preventDefault();
        if (window.location.href !== lastPage) {
            document.getElementById('next').onclick();
        } else {
            window.alert('The last page (⊙ω⊙)')
        }
        setNewPage();
    }

    function zoomIn(e) {
        e.preventDefault();
        setScale('zoomIn');
        zoomInterval = setInterval(function() {
            setScale('zoomIn');
        }, 300);
    }

    function zoomOut(e) {
        e.preventDefault();
        setScale('zoomOut');
        zoomInterval = setInterval(function() {
            setScale('zoomOut');
        }, 300);
    }

    function s(cmd) {
        var pic = document.getElementById('img');
        var width = Number(pic.style.width.replace('px', ""));
        var height = Number(pic.style.height.replace('px', ""));
        switch (cmd) {
            case 'zoomIn':
                {
                    var max_width = Number(pic.style.maxWidth.replace('px', ""));
                    if (width < max_width) {
                        width *= 1.1;
                        height *= 1.1;
                        current_scale *= 1.1;
                    }
                    break;
                }
            case 'zoomOut':
                {
                    if (height >= window.innerHeight) {
                        width /= 1.1;
                        height /= 1.1;
                        current_scale /= 1.1;
                    }
                    break;
                }
        }
        pic.style.width = Math.round(width) + 'px';
        pic.style.height = Math.round(height) + 'px';
        setValue('user_width', pic.style.width, true);
        setValue('user_height', pic.style.height, true);
    }

    function mpv(cmd) {
        var mpvStyle = 'img[id^="imgsrc"], div[id^="image"]{width:mpvWidth!important;height:auto!important; max-width:100%!important;}"';
        var max_width = Number(document.getElementById('pane_images').style.width.replace('px', "")) - 20;
        var min_width = 200;
        var original_width = Number(document.getElementById('image_1').style.maxWidth.replace('px', ""));
        var current_width = original_width * current_scale;
        switch (cmd) {
            case 'zoomIn':
                {
                    if (current_width * 1.1 < max_width) {
                        current_scale *= 1.1;
                        current_width = Math.round(original_width * current_scale);
                    }
                    break;
                }
            case 'zoomOut':
                {
                    if (current_width / 1.1 > min_width) {
                        current_scale /= 1.1;
                        current_width = Math.round(original_width * current_scale);
                    }
                    break;
                }
        }
        addNewStyle(mpvStyle.replace('mpvWidth', current_width + 'px'));
    }
}

//Set value
function setValue(item, value, local = false) {
    if (typeof GM_setValue === 'undefined' || local === true) {
        window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
    } else {
        GM_setValue(item, value);
    }
}

//Get value
function getValue(item, toJSON, local = false) {
    if (typeof GM_getValue === 'undefined' || ! GM_getValue(item, null) || local === true) {
        return (item in window.localStorage) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
    } else {
        return GM_getValue(item, null);
    }
}

//Delete value
function deleteValue(item) {
    if (typeof item === 'string') {
        if (typeof GM_deleteValue === 'undefined') {
            window.localStorage.removeItem(item);
        } else {
            GM_deleteValue(item);
        }
    } else if (typeof item === 'number') {
        if (item === 0) {
            deleteValue('disabled');
        } else if (item === 1) {
            deleteValue('roundNow');
            deleteValue('roundAll');
            deleteValue('monsterStatus');
        } else if (item === 2) {
            deleteValue('roundType');
            deleteValue('battleCode');
            deleteValue(0);
            deleteValue(1);
        }
    }
}

//Get element
function getElem(ele, mode, parent) {
    if (typeof ele === 'object') {
        return ele
    } else if (mode === undefined && parent === undefined) {
        return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele)
    } else if (mode === 'all') {
        return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele)
    } else if (typeof mode === 'object' && parent === undefined) {
        return mode.querySelector(ele)
    }
}
