// ==UserScript==
// @name         Google Photos Show File Title
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.4
// @description  Display the title of file into header
// @icon         https://carry0987.github.io/favicon.png
// @match        https://photos.google.com/photo/*
// ==/UserScript==

var stop_title;
const debug = false;
const auto_copy = false;

(function() {
    'use strict';
    if (document.body.classList.contains('gped-handled')) {
        console.warn('Google Photos - Easy Delete : already loaded');
        return;
    }

    document.body.addEventListener('keypress', function(e) {
        if (e.key === '!') {
            console.log('PRESSED');
            //document.querySelector('[data-delete-origin] button').click();
            //setTimeout(function(){
            //    document.querySelector('button[autofocus]').click();
            //}, 200);
        } else {
            console.log(e.key);
        }
    });

    function checkTitle() {
        //Get value
        var get_title = getElem('div[aria-label]', 'all');
        var check_title
        let title_list = [];
        for (var i = 0; i < get_title.length; i++) {
            check_title = get_title[i].outerHTML;
            if (typeof check_title === 'string') {
                var res = check_title.match(/Filename: /g);
                if (res) {
                    title_list.push(get_title[i].innerHTML);
                }
            }
        }
        if (title_list.length > 1) {
            if (debug === true) {
                reportInfo(title_list[0]);
            }
            document.title = title_list[0];
            if (auto_copy === true) {
                autoCopy(title_list[0]);
            }
            stop_title = true;
        } else {
            stop_title = false;
        }
        return stop_title;
    }

    document.body.classList.add('gped-handled');
    checkNew();
    function checkNew() {
        var got_title;
        var recheck = setInterval(function() {
            got_title = checkTitle();
            if (got_title === true) {
                clearInterval(recheck);
            }
        }, 3000);
    }
})();

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

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}

//Copy to clipboard
function autoCopy(str) {
    var el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    //document.body.removeChild(el);
}
