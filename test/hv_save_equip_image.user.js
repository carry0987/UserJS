// ==UserScript==
// @name         HV Save Equipment Image
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.0
// @description  Start training automatically and display process on top bar
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    if (document.getElementById('riddlecounter')) {
        var url = document.querySelector('#riddlebot>img').src
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(e) {
                /* global saveAs */
                saveAs(new window.Blob([e.response], {
                    type: 'image/jpeg'
                }), new Date().getTime() + '.jpg')
            }
        })
    }
})()
