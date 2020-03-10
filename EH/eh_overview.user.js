// ==UserScript==
// @name         EH Gallery Overview
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.0.0
// @description  Appends "Hath/GP Exchange" and "Credit Log" to "Overview" under the "My Home" tab
// @icon         https://carry0987.github.io/favicon.png
// @include      https://e-hentai.org/home.php
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if (!css) { css = e;
        e = doc }; return e.querySelector(css) }
var $$ = function(e, css) { if (!css) { css = e;
        e = doc }; return e.querySelectorAll(css) }

var add_iframe = function(url) {
    var homebox = $('.homebox')
    var stuffbox = $('.stuffbox')

    var frm = doc.createElement('IFRAME')
    frm.src = url
    frm.width = frm.height = frm.frameBorder = 0
    frm.addEventListener('load', function() {
        var frmdoc = this.contentDocument
        var tbl
        if (/\bt=(gp|hath)\b/.test(url)) {
            tbl = $(frmdoc, '.stuffbox')
        } else if (/\bt=credits\b/.test(url)) {
            //var tbl = $(frmdoc, 'BODY>DIV>TABLE')
            tbl = $(frmdoc, 'BODY>DIV')
        }
        homebox.parentNode.insertBefore(tbl.cloneNode(true), homebox.nextSibling)
        this.parentElement.removeChild(this)
    }, false)

    var div = doc.createElement('DIV')
    div.appendChild(frm)
    doc.body.appendChild(div)
}

add_iframe('https://e-hentai.org/exchange.php?t=hath')
add_iframe('https://e-hentai.org/logs.php?t=credits')
add_iframe('https://e-hentai.org/exchange.php?t=gp')
