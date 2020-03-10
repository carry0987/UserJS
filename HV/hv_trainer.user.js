// ==UserScript==
// @name         HV Trainer
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.4.6
// @description  Start training automatically and display process on top bar
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @run-at       document-end
// ==/UserScript==

(function() {
    if (!getElem('#navbar')) return
    var countdownBox = getElem('body>#csp>#navbar>div:nth-child(5)>div').appendChild(createElem('a'))
    countdownBox.href = '?s=Character&ss=tr'
    countdownBox.style.cssText = 'font-weight:bold;font-size:large;position:relative;bottom:21px;left:84px'
    //If you don't want to start training automatically, set it to false
    const TrainID = 50
    var timeLast
    var trainList = {
        'Adept Learner': {
            'id': 50,
            'time': 1
        },
        'Assimilator': {
            'id': 51,
            'time': 24
        },
        'Ability Boost': {
            'id': 80,
            'time': 2
        },
        'Manifest Destiny': {
            'id': 81,
            'time': 24
        },
        'Scavenger': {
            'id': 70,
            'time': 4
        },
        'Luck of the Draw': {
            'id': 71,
            'time': 8
        },
        'Quartermaster': {
            'id': 72,
            'time': 12
        },
        'Archaeologist': {
            'id': 73,
            'time': 24
        },
        'Metabolism': {
            'id': 84,
            'time': 24
        },
        'Inspiration': {
            'id': 85,
            'time': 24
        },
        'Scholar of War': {
            'id': 90,
            'time': 0
        },
        'Tincture': {
            'id': 91,
            'time': 0
        },
        'Pack Rat': {
            'id': 98,
            'time': 0
        },
        'Dissociation': {
            'id': 88,
            'time': 24
        },
        'Set Collector': {
            'id': 96,
            'time': 12
        }
    }
    var trainList2 = {
        '50': 1,
        '51': 24,
        '70': 4,
        '71': 8,
        '72': 12,
        '80': 2,
        '81': 24,
        '84': 24,
        '85': 24,
        '88': 24,
        '90': 0,
        '91': 0,
        '96': 12,
        '98': 0,
        '': 24
    }
    var lang = navigator.language
    var timeOption = { hour12: false }
    post('?s=Character&ss=tr', function(data) {
        if (getElem('#train_progcnt', data)) {
            var nowTraining = getElem('#train_progress>div>strong', data).innerText
            var nowTrainingProcess = getElem('#train_progcnt', data).innerText
            var timeAll = trainList[nowTraining].time
            timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60)
            var timeEnd = new Date(new Date().getTime() + timeLast * 1000)
            var nextTrain = getTraining(trainList, 'id', TrainID)
            countdownBox.title = 'Now Train: ' + nowTraining + '\nTrain End: ' + timeEnd.toLocaleString(lang, timeOption) + '\nNext Train: ' + nextTrain
            countdownBox.value = timeEnd.getTime()
            timeUpdate()
        } else {
            if (getValue('trainTask') && getValue('trainTask') !== '[]') {
                var trainTask = getValue('trainTask', true)
                if (trainTask[0].freq <= 0) trainTask.splice(0, 1)
                if (trainTask.length > 0) {
                    trainTask[0].freq--
                    startTraining(trainTask[0].id)
                }
                setValue('trainTask', trainTask)
            }
            countdownBox.style.cssText = 'font-weight:bold;font-size:medium;position:relative;bottom:20px;left:84px'
            countdownBox.innerHTML = 'Completed'
            document.title = 'Completed'
            //Auto start training
            startTraining(TrainID)
        }
    })

    function timeUpdate() {
        var h, m, s
        setInterval(function() {
            timeLast--
            if (timeLast <= 0) {
                window.location.href = window.location.href
            } else {
                s = Math.floor(timeLast % 60)
                if (s < 10) s = '0' + s.toString()
                m = Math.floor((timeLast / 60) % 60)
                if (m < 10) m = '0' + m.toString()
                h = Math.floor((timeLast / 3600) % 24)
                if (h < 10) h = '0' + h.toString()
                countdownBox.innerText = h + ':' + m + ':' + s
            }
        }, 1000)
        setTimeout(function() {
            window.location.href = window.location.href
        }, 1000 * 60 * 10)
    }
})()

function setValue(item, value) {
    window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value)
}

function getValue(item, toJSON) {
    return (window.localStorage[item]) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null
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

//Create element
function createElem(name) {
    return document.createElement(name)
}

//Post
function post(href, func, parm) {
    var xhr = new window.XMLHttpRequest()
    xhr.open(parm ? 'POST' : 'GET', href)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    xhr.responseType = 'document'
    xhr.onerror = function() {
        xhr = null
        post(href, func, parm)
    }
    xhr.onload = function(e) {
        if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
            var data = e.target.response
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

//Start Training
function startTraining(train_id) {
    if (train_id !== false) {
        post('?s=Character&ss=tr', function() {
            window.location.href = window.location.href
        }, 'start_train=' + train_id)
    }
}

//Get Training name
function getTraining(arr, keys, val) {
    var array_key = Object.keys(arr);
    for (var j = 0; j < array_key.length; j++) {
        for (var i = 0; i < array_key[j].length; i++) {
            if (arr[array_key[j]][keys] === 80) {
                return array_key[j];
            }
        }
    }
    return false;
}
