// ==UserScript==
// @name         HV Equipment Repairer
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.1.5
// @description  Repair equipments automatically
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/?s=Forge&ss=re*
// @include      http*://alt.hentaiverse.org/?s=Forge&ss=re*
// @run-at       document-end
// ==/UserScript==

(function() {
    //Check if is not in shop
    if (!getElem('#filterbar')) return
    var material = [{
            'name': 'Scrap Cloth',
            'code': '60051',
            'cost': '100'
        },
        {
            'name': 'Scrap Leather',
            'code': '60052',
            'cost': '100'
        },
        {
            'name': 'Scrap Metal',
            'code': '60053',
            'cost': '100'
        },
        {
            'name': 'Scrap Wood',
            'code': '60054',
            'cost': '100'
        },
        {
            'name': 'Energy Cell',
            'code': '60071',
            'cost': '200'
        }
    ]
    var materialBox = document.getElementById('repairall')
    if (materialBox) {
        const add_box = `
        <div style="padding: 5px">
            <span id="auto_buy" style="color: #0382dc; cursor: pointer">Auto Purchase Material And Repair All</span>
        </div>
        `
        materialBox.parentElement.insertAdjacentHTML('afterbegin', add_box);
    }
    var getBox = document.getElementById('auto_buy')
    if (getBox) {
        getBox.onclick = function() {
            repairEqupiment(material)
        }
    }
})()

//Get material name
function materialsName2Code(name) {
    switch (name) {
        case 'Scrap Cloth':
            return '0'
        case 'Scrap Leather':
            return '1'
        case 'Scrap Metal':
            return '2'
        case 'Scrap Wood':
            return '3'
        case 'Energy Cell':
            return '4'
    }
}

//Purchase materials
function buyMaterial(code, amount, cost, token) {
    var xhr = 'xhr_Buy' + Math.random().toString()
    xhr = new window.XMLHttpRequest()
    xhr.open('POST', window.location.origin + '/?s=Bazaar&ss=is&filter=ma')
    //shop_pane: Buy, item_pane: Sell
    var parm = 'storetoken=' + token + '&select_mode=shop_pane&select_item=' + code + '&select_count=' + amount
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(parm)
    xhr.onload = function() {}
}

//Repair all equipment
function repairEqupiment(material) {
    var materialsList = document.querySelectorAll('#repairall+div span')
    var xhr = new window.XMLHttpRequest()
    xhr.open('GET', window.location.origin + '/?s=Bazaar&ss=is&filter=ma')
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'document'
    xhr.onload = function() {
        var token = xhr.response.querySelector('input[name="storetoken"]').value
        if (materialsList.length > 0) {
            for (var i = 0; i < materialsList.length; i++) {
                var amount = materialsList[i].innerHTML.match(/\d+/)[0]
                var code = material[materialsName2Code(materialsList[i].innerHTML.match(/\d+x (.*)/)[1])].code
                buyMaterial(code, amount, material[i].cost, token)
            }
            setTimeout(function() {
                document.querySelector('#repairall div').click()
            }, 3000)
        }
    }
    xhr.send(null)
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
