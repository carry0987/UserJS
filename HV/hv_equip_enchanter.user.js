// ==UserScript==
// @name         HV Equipment Enchanter
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.1
// @description  Enchant all equipments automatically
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/?s=Forge&ss=en*
// @include      http*://alt.hentaiverse.org/?s=Forge&ss=en*
// @run-at       document-end
// ==/UserScript==

//Set config
const DEBUG = false;
const check_battle = 60000;
const material = 'feath';

(function() {
    //Check if is not in shop
    if (!getElem('#filterbar')) return;
    var equipList = getElem('#forge_outer>#leftpane #item_pane>.nosel.equiplist .eqp', 'all');
    reportInfo(equipList);
    //Add button
    var enchantBox = document.getElementById('shopform');
    if (enchantBox) {
        const add_box = `
        <div style="padding: 5px">
            <span id="auto_enchant" style="color: #0382dc; cursor: pointer; font-size: medium">Auto Enchant All</span>
        </div>
        `;
        enchantBox.insertAdjacentHTML('afterend', add_box);
    }
    var getEnchant = document.getElementById('auto_enchant');
    if (getEnchant) {
        getEnchant.onclick = function() {
            var confirm_enchant = confirm('Featherweight All: 7 ?');
            if (confirm_enchant == true) {
                enchantEqupiment(material);
            } else {
                return;
            }
        }
    }
})()

//Purchase materials
function buyMaterial(code, amount, cost, token) {
    var xhr = 'xhr_Buy' + Math.random().toString();
    xhr = new window.XMLHttpRequest();
    xhr.open('POST', window.location.origin + '/?s=Bazaar&ss=is&filter=ma');
    //shop_pane: Buy, item_pane: Sell
    var parm = 'storetoken=' + token + '&select_mode=shop_pane&select_item=' + code + '&select_count=' + amount;
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(parm);
    xhr.onload = function() {}
}

//Enchant all equipment
function enchantEqupiment(material) {
    var materialsList = document.querySelectorAll('#repairall+div span');
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/?s=Bazaar&ss=is&filter=ma');
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'document';
    xhr.onload = function() {
        var token = xhr.response.querySelector('input[name="storetoken"]').value;
        if (materialsList.length > 0) {
            for (var i = 0; i < materialsList.length; i++) {
                var amount = materialsList[i].innerHTML.match(/\d+/)[0];
                var code = material[materialsName2Code(materialsList[i].innerHTML.match(/\d+x (.*)/)[1])].code;
                buyMaterial(code, amount, material[i].cost, token);
            }
            setTimeout(function() {
                document.querySelector('#repairall div').click();
            }, 1000);
        }
    }
    xhr.send(null);
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

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}
