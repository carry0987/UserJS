// ==UserScript==
// @name         HV Trainer
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.6.1
// @description  Start training automatically and display process on top bar
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @run-at       document-end
// ==/UserScript==

(function() {
    if (!getElem('#navbar')) return
    var countdownBox = getElem('body>#csp>#navbar>div:nth-child(5)>div').appendChild(createElem('span', 'trainer'))
    //countdownBox.href = '?s=Character&ss=tr'
    //countdownBox.href = ''
    countdownBox.style.cssText = 'font-weight:bold;font-size:large;position:relative;bottom:21px;left:84px;cursor:pointer'
    //Default Auto Training ID
    var TrainID = false
    //Open Training Task setting window
    countdownBox.onclick = function() {
        setTrainerTask()
    }
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
    //Set CSS
    addStyle()
    //Set Trainer Task
    function setTrainerTask() {
        var time = countdownBox.value || new Date().getTime()
        var trainTask
        var doc = document
        var hv_trainer_box
        var buttonNew
        var buttonSave
        var buttonCancel
        var table
        var tbody
        var tr
        if (!getElem('#hv_trainer_box')) {
            hv_trainer_box = getElem('body', doc).appendChild(createElem('div', 'hv_trainer_box'))
            hv_trainer_box.appendChild(createElem('div'))
            table = getElem('#hv_trainer_box>div').appendChild(createElem('table'))
            tbody = table.appendChild(createElem('tbody'))
            tr = tbody.appendChild(createElem('tr'))
            tr.innerHTML = '<td></td><td>Project</td><td>Freq</td><td>Start Time - End Time</td>'
            buttonNew = getElem('#hv_trainer_box>div').appendChild(createElem('button', 'btn_new'))
            buttonNew.textContent = 'New Task'
            buttonSave = getElem('#hv_trainer_box>div').appendChild(createElem('button', 'btn_save'))
            buttonSave.textContent = 'Save Task'
            buttonCancel = getElem('#hv_trainer_box>div').appendChild(createElem('button', 'btn_cancel'))
            buttonCancel.textContent = 'Cancel'
        } else {
            hv_trainer_box = getElem('#hv_trainer_box')
            hv_trainer_box.style.display = 'block'
            buttonNew = getElem('#hv_trainer_box #btn_new')
            buttonSave = getElem('#hv_trainer_box #btn_save')
            buttonCancel = getElem('#hv_trainer_box #btn_cancel')
            table = getElem('#hv_trainer_box>div>table')
            tbody = getElem('#hv_trainer_box>div>table>tbody')
            tr = getElem('#hv_trainer_box>div>table>tbody>tr')
        }
        var select = [
            '<select>',
            '<option value="-1"></option>',
            '<option value="50">Adept Learner</option>',
            '<option value="51">Assimilator</option>',
            '<option value="80">Ability Boost</option>',
            '<option value="81">Manifest Destiny</option>',
            '<option value="70">Scavenger</option>',
            '<option value="71">Luck of the Draw</option>',
            '<option value="72">Quartermaster</option>',
            '<option value="">Archaeologist</option>',
            '<option value="84">Metabolism</option>',
            '<option value="85">Inspiration</option>',
            '<option value="90">Scholar of War</option>',
            '<option value="91">Tincture</option>',
            '<option value="98">Pack Rat</option>',
            '<option value="88">Dissociation</option>',
            '<option value="96">Set Collector</option>',
            '</select>'
        ].join('')
        var order = 1
        var i, elem_time, elem_select, elem_input
        buttonNew.onclick = function() {
            tr = tbody.appendChild(createElem('tr', false, 'train_task'))
            tr.innerHTML = '<td>' + (order++) + '</td><td>' + select + '</td><td><input type="number" value="1" placeholder="1" min="1"></td><td></td>'
            getElem('select', tr).value = '-1'
        }
        buttonSave.onclick = function() {
            var input = getElem('#hv_trainer_box select,input', 'all', tbody)
            trainTask = []
            for (i = 0; i < input.length; i = i + 2) {
                if (input[i].value !== '-1') {
                    trainTask.push({
                        id: input[i].value,
                        freq: (input[i + 1].value || input[i + 1].placeholder) * 1
                    })
                }
            }
            setValue('trainTask', trainTask)
            window.location.href = window.location.href
        }
        buttonCancel.onclick = function() {
            hv_trainer_box.style.display = 'none'
        }
        if (getValue('trainTask') && getValue('trainTask') !== '[]') {
            trainTask = getValue('trainTask', true)
            var clear_chart = getElem('#hv_trainer_box .train_task', 'all')
            for (i = 0; i < clear_chart.length; i++) {
                clear_chart[i].remove()
            }
            for (i = 0; i < trainTask.length; i++) {
                tr = tbody.appendChild(createElem('tr', false, 'train_task'))
                tr.innerHTML = '<td>' + (order++) + '</td><td>' + select + '</td><td><input type="number" value="' + trainTask[i].freq + '" placeholder="1" min="1"></td><td></td>'
                getElem('#hv_trainer_box select', tr).value = trainTask[i].id
            }
            timeChange()
        } else {
            if (!getElem('#hv_trainer_box .train_task')) { buttonNew.click() }
        }
        tbody.onclick = changeEvent
        tbody.onkeyup = changeEvent

        function timeChange() {
            elem_time = getElem('#hv_trainer_box tr>td:nth-child(4)', 'all', tbody)
            elem_select = getElem('#hv_trainer_box select', 'all', tbody)
            elem_input = getElem('#hv_trainer_box input', 'all', tbody)
            for (i = 0; i < elem_select.length; i++) {
                elem_time[i + 1].textContent = elem_select[i].value === '-1' ? '' : timeStr(elem_input[i].value * 1 * trainList2[elem_select[i].value])
            }
        }

        function timeStr(hour) {
            var start = time
            time = start + hour * 60 * 60 * 1000
            return new Date(start).toLocaleString(lang, timeOption) + ' - ' + new Date(time).toLocaleString(lang, timeOption)
        }

        function changeEvent(e) {
            if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT') return
            time = countdownBox.value || new Date().getTime()
            timeChange()
        }
    }
    //Update training time
    var trainTask
    post('?s=Character&ss=tr', function(data) {
        if (getElem('#train_progcnt', data)) {
            var nowTraining = getElem('#train_progress>div>strong', data).innerText
            var nowTrainingProcess = getElem('#train_progcnt', data).innerText
            var timeAll = trainList[nowTraining].time
            timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60)
            var timeEnd = new Date(new Date().getTime() + timeLast * 1000)
            if (getValue('trainTask') && getValue('trainTask') !== '[]') {
                trainTask = getValue('trainTask', true)
                if (trainTask[0].freq <= 0) trainTask.splice(0, 1)
                if (trainTask.length > 0) {
                    TrainID = trainTask[0].id
                }
            }
            var nextTrain = getTraining(trainList, 'id', TrainID)
            countdownBox.title = 'Now Train: ' + nowTraining + '\nTrain End: ' + timeEnd.toLocaleString(lang, timeOption) + '\nNext Train: ' + nextTrain
            countdownBox.value = timeEnd.getTime()
            timeUpdate()
        } else {
            if (getValue('trainTask') && getValue('trainTask') !== '[]') {
                trainTask = getValue('trainTask', true)
                if (trainTask[0].freq <= 0) trainTask.splice(0, 1)
                if (trainTask.length > 0) {
                    trainTask[0].freq--
                    startTraining(trainTask[0].id)
                }
                setValue('trainTask', trainTask)
            } else {
                //Auto start training
                startTraining(TrainID)
            }
            countdownBox.style.cssText = 'font-weight:bold;font-size:medium;position:relative;bottom:20px;left:84px;cursor:pointer'
            countdownBox.innerHTML = 'Completed'
            //document.title = 'Completed'
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
    window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

function getValue(item, toJSON) {
    return (window.localStorage[item]) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
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
function createElem(name, elemID = false, elemClass = false) {
    var elem = document.createElement(name);
    if (elemID != false) {
        elem.setAttribute('id', elemID);
    }
    if (elemClass != false) {
        elem.className = elemClass;
    }
    return elem
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
            if (arr[array_key[j]][keys] == val) {
                return array_key[j];
            }
        }
    }
    return false;
}

//Add CSS
function addStyle() {
    var globalStyle = getElem('head').appendChild(createElem('style'))
    var cssContent = [
        '#hv_trainer_box{left:calc(50% - 200px);top:50px;font-size:16px!important;z-index:4;width:400px;height:440px;position:absolute;text-align:left;background-color:#E3E0D1;border:1px solid #000;border-radius:10px;font-family:"Microsoft Yahei";}',
        '#hv_trainer_box>div{margin:15px;text-align:center;}#hv_trainer_box>div>table{border:2px solid #000;border-collapse:collapse;margin:0 auto;margin-bottom: 0.25em;}#hv_trainer_box>div>table>tbody>tr>td{border:1px solid #000;}#hv_trainer_box>div input{text-align:right;width:60px;}'
    ].join('')
    globalStyle.textContent = cssContent
}
