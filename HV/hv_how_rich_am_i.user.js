// ==UserScript==
// @name         HV How Rich Am I ?
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.4.7
// @description  Show how many Credits you have
// @icon         https://carry0987.github.io/favicon.png
// @include      https://hentaiverse.org/?s=Character&ss=ch
// @include      https://hentaiverse.org/
// @include      http*://alt.hentaiverse.org/
// @include      http*://alt.hentaiverse.org/?s=Character&ss=ch
// ==/UserScript==

//Check if is not in battle
if (!getElem('#navbar')) return

//Set varible
var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if (!css) { css = e;
        e = doc }; return e.querySelector(css) }
var $$ = function(e, css) { if (!css) { css = e;
        e = doc }; return e.querySelectorAll(css) }

//Generate chart
function generateChart(chartContainer, perChart, text) {
    var container = document.createElement('div');
    //Used in the for loop
    var blockDiv, textSpan;
    container.setAttribute('id', 'networth');
    container.setAttribute('width', '148px')
    document.getElementById(chartContainer.replace('#', '')).appendChild(container);
    for (var i = 0; i < perChart; i++) {
        blockDiv = document.createElement('div');
        blockDiv.className = 'fc4 fal fcb';
        blockDiv.setAttribute('width', '138px');
        blockDiv.setAttribute('style', 'font-weight: bold; position: relative; top: -2px; right: 5px;');
        //textSpan = document.createElement('span');
        //See note about browser compatibility
        //textSpan.append(text);
        blockDiv.append(text);
        //blockDiv.append(textSpan);
        container.append(blockDiv);
    }
}

//Get Credit
var getCredit = function() {
    var frm = doc.createElement('IFRAME')
    frm.src = '/?s=Bazaar&ss=es'
    frm.width = frm.height = frm.frameBorder = 0
    frm.addEventListener('load', function() {
        var doc = this.contentDocument
        var cell = doc.getElementById('networth')
        var credit = cell.innerHTML.match(/Credits:\s*([,0-9]*)\s*/i)[1]
        credit = parseInt(credit.replace(/,/g, ''))
        //credit = credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        var credit_box = document.getElementById('mainpane')
        if (credit_box !== null) {
            generateChart('mainpane', 1, 'Credits: ' + credit)
        }
        //if (credit != '0') { generateChart('mainpane', 1, 'Credits: ' + credit) }
        this.parentElement.removeChild(this)
    }, false)
    doc.body.appendChild(frm)
}
getCredit()

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
