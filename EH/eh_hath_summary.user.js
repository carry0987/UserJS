// ==UserScript==
// @name         EH Hath Summary
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.0.0
// @description  Add extra summary table row on Hath page
// @icon         https://carry0987.github.io/favicon.png
// @match        https://e-hentai.org/hentaiathome.php
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    //Initialize vars
    let client = '',
        id = '',
        status = '',
        created = '',
        lastSeen = '',
        filesServed = '',
        clientIP = '',
        port = '',
        version = '',
        maxSpeed = 0,
        trust = '',
        quality = '',
        hitrate = 0,
        hathrate = 0,
        country = '';

    //Max Speed
    let maxSpeeds = document.querySelectorAll('.hct > tbody > tr > td:nth-child(10)');
    for (let item of maxSpeeds) {
        try {
            maxSpeed += parseInt(item.textContent.match(/^\d+/g));
        } catch (e) {
            throw new Error('Failed parsing max speed');
        }
    }
    if (maxSpeed < 100000) {
        maxSpeed = `${maxSpeed} KB/s`;
    } else {
        maxSpeed = `${Math.round(maxSpeed/100)/10} MB/s`;
    }


    //Hit Rate
    let hitrates = document.querySelectorAll('.hct > tbody > tr > td:nth-child(13)');
    for (let item of hitrates) {
        try {
            hitrate += parseFloat(item.textContent.match(/^[\d.]+/g));
        } catch (e) {
            throw new Error('Failed parsing hitrate');
        }
    }
    hitrate = `${hitrate} / min`;

    //Hath Rate
    let hathrates = document.querySelectorAll('.hct > tbody > tr > td:nth-child(14)');
    for (let item of hathrates) {
        try {
            hathrate += parseFloat(item.textContent.match(/^[\d.]+/g));
        } catch (e) {
            throw new Error('Failed parsing hathrate');
        }
    }
    hathrate = `${hathrate} / day`;


    //Build row
    let el = `<tr>
    <td>${client}</td>
    <td>${id}</td>
    <td>${status}</td>
    <td>${created}</td>
    <td>${lastSeen}</td>
    <td>${filesServed}</td>
    <td>${clientIP}</td>
    <td>${port}</td>
    <td>${version}</td>
    <td>${maxSpeed}</td>
    <td>${trust}</td>
    <td>${quality}</td>
    <td>${hitrate}</td>
    <td>${hathrate}</td>
    <td>${country}</td>
    </tr>`;

    //Inject row
    let lastrow = document.querySelector('.hct > tbody > tr:last-child');
    lastrow.insertAdjacentHTML('afterend', el);

    //Inject stylesheet
    let stylesheet = `
        .hct tr:last-child > td {
            padding-top: 1px;
            border-top: 1px solid #5C0D11;
            background: none transparent !important;
        }
    `;

    let stylesheetEl = document.createElement('style');
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
})();
