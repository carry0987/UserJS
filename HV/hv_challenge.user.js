// ==UserScript==
// @name         HV Challenge
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.1.0
// @description  Easily change the challenge level
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @run-at       document-end
// ==/UserScript==

(function() {
    if (!getElem('#navbar')) return
    let challenges = ['Normal', 'Hard', 'Nightmare', 'Hell', 'Nintendo', 'IWBTH', 'PFUDOR']
    let options = challenges.map(function(i, j) {
        return '<option value="' + (j + 1) + '">' + i + '</option>'
    })
    let init = function() {
        getElem('#level_readout>div.fc4.far.fcb>div').onclick = function(e) {
            e.target.onclick = null
            let text = e.target.textContent.split(' ')
            e.target.innerHTML = '<select style="position:relative;top:-5px;">' + options + '</select> ' + text[1]
            e.target.querySelector('select').value = challenges.indexOf(text[0]) + 1
            e.target.querySelector('select').onchange = function(e1) {
                changeChallenge(e1.target.value, function() {
                    getElem('#level_readout>div.fc4.far.fcb>div').textContent = challenges[e1.target.value - 1] + ' ' + text[1]
                    init()
                })
            }
        }
    }
    init()

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

    //Post
    function post(href, func, parm, type) {
        let xhr = new window.XMLHttpRequest()
        xhr.open(parm ? 'POST' : 'GET', href)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        xhr.responseType = type || 'document'
        xhr.onerror = function() {
            xhr = null
            post(href, func, parm, type)
        }
        xhr.onload = function(e) {
            if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
                let data = e.target.response
                if (xhr.responseType === 'document' && getElem('#messagebox', data)) {
                    if (getElem('#messagebox')) {
                        getElem('#csp').replaceChild(getElem('#messagebox', data), getElem('#messagebox'))
                    } else {
                        getElem('#csp').appendChild(getElem('#messagebox', data))
                    }
                }
                func(data, e)
            }
            xhr = null
        }
        xhr.send(parm)
    }

    //Level:1-7
    function changeChallenge(level, func) {
        post('?s=Character&ss=se', function(data) {
            let settings = [...getElem('#settings_outer input,#settings_outer select', 'all', data)].map(function(i) {
                if (i.type === 'radio' || i.type === 'checkbox') {
                    return i.checked ? i.name + '=' + i.value : ''
                } else {
                    return i.name + '=' + i.value
                }
            }).filter(function(i) {
                return i
            }).join('&')
            post('?s=Character&ss=se', function() {
                func()
            }, settings.replace(/difflevel=\d+/, 'difflevel=' + level + 'ch'))
        })
    }
})()
