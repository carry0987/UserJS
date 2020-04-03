// ==UserScript==
// @name         Google Photos Show File Title
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.0
// @description  Display the title of file into header
// @icon         https://carry0987.github.io/favicon.png
// @match        https://photos.google.com/photo/*
// ==/UserScript==

(function() {
    'use strict';
    if (document.body.classList.contains('gped-handled')) {
        console.warn('Google Photos - Easy Delete : already loaded');
        return;
    }

    function checkTitle() {
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
    }

    document.body.classList.add('gped-handled');
    checkNew();
    function checkNew() {
        setInterval(function() {
            checkTitle();
        }, 1000)
    }
})();
