// ==UserScript==
// @name         Rutracker Auto Thanks
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.0
// @description  Auto thanks to the OP when download the torrent
// @icon         https://carry0987.github.io/favicon.png
// @match        http*://rutracker.org/forum/viewtopic.php*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    //Get value
    var current_thread = document.querySelector('.attach bordered med');
    var get_price = current_thread.nextSibling.wholeText;
    get_price = get_price.split(' ')[1].replace(/\,/g, '');
    get_price = parseInt(get_price);
    var ask_count = document.getElementById('ask_count');
    var ask_price = document.getElementById('ask_price');

    let init = function() {
        ask_count.onchange = function(e) {
            var get_count = parseInt(ask_count.value);
            if (get_count >= 1) {
                ask_price.value = get_price;
            }
        }
    }
    init()
})();
