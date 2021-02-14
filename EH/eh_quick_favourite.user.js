// ==UserScript==
// @name         EH Quick Favourite
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.2.6
// @description  Upgrades the gallery favourite button to allow quick favouriting of a gallery
// @icon         https://carry0987.github.io/favicon.png
// @include      /^https?://(ex|(?:g\.)?e-)hentai\.org/g/\d+?/\w{10}/?/
// @include      /^https?://(ex|(?:g\.)?e-)hentai\.org\/gallerypopups\.php\?.+&act=addfav/
// @grant        GM.xmlHttpRequest
// ==/UserScript==

/* ====================================== *\
                 Hotkey Map
                    ----
     Shift+F : Initiate Favouriting Mode
     [0-9]   : Favourite 0-9
     -       : Remove Favourite

                    ----
     Pressing any other key during act-
     ive favouriting mode will exit the
     active favving mode.
\* ====================================== */

// Config
const config = {
    'debug': false,
    'editor_size': 60, // Width of the favnotes input element in not-px unit
    'hotkeys': true, // Enable hotkeys
    'cheatsheet': false, // Show cheatsheet after pressing Shift+F
    'favnote': true,
    'archive_fav': false, // Auto add to default favourite while download archive
    'default_fav': 0 // Default favourite sort [0-9]
};

// Colors
var geh = {
    'border': '#5C0D12',
    'bg': '#E3E0D1',
    'bg_light': '#F8F6EE',
};
var exh = {
    'border': '#000000',
    'bg': '#4F535B',
    'bg_light': '#5F636B',
};
var color;
var hotkeyInit = false;

// Are we on fjords?
color = (location.host.substr(0, 2) == 'ex') ? color = exh : color = geh;

// Stylesheet
var stylesheet = `
#gdf {
    margin: 6px 0 !important;
    padding: 10px 5px !important;
    width: 160px !important;
    height: 18px;
    position: relative;
    border: 1px dashed ${color.border};
    left: -2px !important;
}

#gdf > div:nth-child(1),
#gdf > div:nth-child(2),
#gdf > div:nth-child(3) {
    display: inline !important;
    float: none !important;
}

#gdf > div:nth-child(2) > a {
    position: relative;
    top: -1px;
    line-height: 21px;
}

#gdf > #fav {
    padding-left: 5px;
}

#gdf > #fav > * {
    float: none !important;
    display: inline-block !important;
    margin: 0 !important;
    position: relative;
    top: 2px;
}

#gdf div.i {
    display: inline-block;
    margin: 0 !important;
}

#gdf a:hover {
    color: inherit !important;
}

.qf-top, .qf-bot {
    background: ${color.bg_light} !important;
    width: inherit;
    padding: 0 5px;
    position: absolute;
    left: -1px;
    visibility: hidden;
    border: 1px solid ${color.border};
}

.qf-top {
    border-bottom: none;
    padding-top: 5px;
    bottom: 33px;
}

.qf-bot {
    border-top: none;
    padding-bottom: 5px;
    top: 33px;
}

#gdf .fav {
    box-sizing: border-box;
    cursor: pointer;
    padding: 5px;
    text-align: left;
    width: 100%;
}

#gdf .fav:hover {
    background: ${color.bg};
}

#gdf:hover,
#gdf.hover {
    border: 1px solid ${color.border};
}

#gdf:hover > .qf-top,
#gdf:hover > .qf-bot,
#gdf.hover > .qf-top,
#gdf.hover > .qf-bot {
    visibility: visible;
}

#gdf > .favnote {
    float: right !important;
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    position: relative;
    top: 1px;
    z-index: 20;
    opacity: 0.5;
}

#gdf > .favnote:hover {
    opacity: 1;
}

#gdf > .favnote:after {
    opacity: 0;
}

#gdf > .favnote:hover:after {
    display: block;
    padding: 0 5px;
    height: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    background: #f4f4f4;
    color: #333;
    font-weight: 400;
    font-size: 11px;
    line-height: 20px;
    position: absolute;
    top: -20px;
    left: 0px;
    transition: opacity 300ms cubic-bezier(1, -1, 1, -1);
    opacity: 1
}

/* ========================================= *\
 *  Fugue Icons v3.5.6 by Yusuke Kamiyamane  *
 *  http://p.yusukekamiyamane.com/           *
\* ========================================= */
#gdf > .favnote             { background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQ0lEQVR4AcWONZoVURBGTxXusgrcIcMhw3dCjC/hxewB9wR3SXAYJGKS5zLW91bBK9wd/u6+2ud8P/89AnDjsOwBZvBjKS1a7xd4k+EAZsyav2zvFkst3A08Y1aQUz85D2C5AKC39ymdyhG9dlBkyUY/D6BvBIINYkUtvlw0sNTG8iCpSAwNFQwMDMS3eO2pLWZsvbJfln3YQEARkTdOi3nYsOG8TUpDNJtNzpzYDizZXHlxbQqwMv7IGRVRVBUz+6pk+vSFmGVGjx7N3XStCfCRQES+J4kmb5l3gpRRQhDQdyX6ah3Mxw0Euh/fkYRg1OcNBMWRcHxPosPHfNIgoUgXFtz5rkR1RDDvBH39PhKdiIwAcccxcCPWMVvA7hk3Q3RkMG8FU2/d4Vm7tHk0P5FHz3nWZQUYA0wI2c8lAS1+Ny8BF2m6Eor51N8AAAAASUVORK5CYII='); }
#gdf > .favnote.plus        { background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABl0lEQVR4AcWOA4xeQRRGz0xtM6gd1DbCmjFquw3qWGVUx6lt27Ztt+vdN3OnndWPddTv4frk479LAVzfp5YATcmfVrbu585HAK7uUTtadF03WEwszgk4i0iANYlYm4TYAIBPn14S/2P/TmBF2wHuHIAGEEEhyUjwy3/Y4A9i4hCbjAkMKSkBSUlJ+K9Nn6ODRZhxeZfqClA4E4BGKYWPIPhYqFBhMmRMCjExMZw+PB9oO+jHx6sVgB6FAaxFK6XRWiMiOUKaNGmFiKV48eI8MFdjACIASqk8Id5Jxk0mwPgiFaAByROi/+X+BkCT6UDhvzAnEbWPM15fpveTw8x6cx0bDvA0hQZyh9z6/Y3WHftx8/fXKAcGTbqD7CBT7p+m06VtYBx/7B+UgbGubHvWV1yjADav5MyIUbu6IjHgHA7BOfG5j7Q7soqy3RsRrVM7T95QQMW5Y1jWsDZNyEEbi5So81oVKglQcUSLUj+33IpPcSR9f+n2A5QAqgI18/wWl7pT81Uz52P6TQkKpClF1zChyHUfSddf7UXJLEn3VbsAAAAASUVORK5CYII='); }
#gdf > .favnote.arrow       { background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABnUlEQVR4Ac2QA6weURCFt7bduHZc27YV1bZt+9m2bdu2bRvn7Tz8ZthJvsXdPd+ducz/UeF2/V6zmMnIaiFBqE0/i7YqdbSU/URz6Xc0l3xBY9F71OU9Q3X2PVRm3ASR4L8H9C/LGj5BsFU/y7YKBTQVvkBjwTM05D9Ffd5j1GTfR3naLRQnXUFhwkVEuG8BGt1A/7Os5QgCLfpZtVUoobnopUSJl+UyDub/+nlxBH6m/WzaK1XQWvKaJFI7oXEowxF4G/Wz66hSQ1vpG5kkJKAMR+Cu38+ho1oD7WXvZJLQwVKGI3DR6efUWaOJjvL3UiUfnF1hF2YAynAEDpr9XFCjzQo+SJWc0Q/DWYMIvFE9HccR2Kr2c0OtDjorPgpJXlrY4JiqD4GjhIo3lAqAjV9saxa/jz7NUBn/ZnxQbwWSUCfd41Srgw527y83/MkDriQAZ2K43E0GZj72C6f8+AfnGW3190yIKHbcu1O65IZSPS/LA4B51zTKx+14dpEEw1gms0yXhVEn9WKIkQf+nO/NyleDD6irsJzue+8CGCvzmWahQigAAAAASUVORK5CYII='); }
#gdf > .favnote.pencil      { background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwElEQVR4Ac2QA4yYMQCF23nRfEMwe4sz27Zt297Ztm3btm3btt/+XnJmvJfU/b6C/B+JdKB8XLGYYNlFhibcjlp11GiirUIGreVSaC0TR3OJEBoKfqE29xOqs96ClaTA02B7ubJ7kCDUhlp3VCmhpfgPmot+oanwJxoLvqMu9zMqM96hNOUFipOeIsrzMNDsAbafK3v6BMFW1KajSgWtJX/HlPhYb+0rlorUp08QYE7tOqvV0F7GxyTj3oQ9hzF9Al8T6tBVo4GOcv4JSUqtriJlAy0NpnQfYfE0pE5dtVrorBAcV5IS+gqu4hcBXl7YUepHWNz0qEt3nTa6KoXGlBTF34KF3kO0tLTg64nZOTqEHCEsTtrUDXW6nEB4VElJ4h0EWq/m+t8hLXwZCrzTgvv+wF6deqBeD91VIiNKypLvI8hmDYNhpboM6eEvwZg+gakc8UOjDZiE3aTnObWaYB9bkf4OwbabGQwb9TXIinyD9kplMKaXn/vlMdHVFCJhQ4u2IImzUKC1DFb+S+tVeElq7xpjGMsVMpMrPFxZMrQIPKRSaEyD7Hca9PAiuTBknaeHHSd4dpZafL1Ld4+24R9mFfDtXW/67AAAAABJRU5ErkJggg=='); }
#gdf > .favnote.exclamation { background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB5ElEQVR4AcWQA4yfMQBHXzvbtm3b4RzNXow5mIPZWzTbtm3btre/1a/dXXN2uF9St6+v5b9HANw8IKYDNclYFjfuZi4mAlzfJ3Y1aLuit1YejNFgHLSO4KgAjhNEOxEAvnx5je/Xwd3AoqY9zAUACaA1Ah1CR/7Y4kRcaOVFOyFURBEORwgGg7Y06XK8t9aMvrpHtAXIHAdAIoSIYWrbZspkl22UCuN2uzl7dBLQtNevz9cLAB3sDsdBCiGRUqK1ThVSo0YjtHbInj07j9R1N9idcQBrIKVto0pcayEB33P+fD9J0PuC2DNxT1DRA3vA3pzUxPaDvs+UrT2eD48W233RZ5IYCGxJwcTneUuOfLXIlj0/uQrUIhT4FmcgYw2E7aYEAdfvF+QtXJ++Q7aTt2AtXH9eRgMyEWegkMQYJIV4XO/IlLUIRrnYsWMHfs9nNNkRgkJxf+APmKzIvIgsIIzBoMFoRFT5EfVxeYpW4fOf6xw6OJ4fwRtkypEVbSgxsJe9koITRrKganlqkCTZsoncJUsXKFupQf3cjnJRqdYtXj1qBAhe3Xv6bdUm32AB5ADyWJskWTlTLGzVrmKngkWyFsIYchfqhffXHgB+//T+vH/r0yFBGlk/l2Va05BUIiW3/wHmcuCUyEztWwAAAABJRU5ErkJggg=='); }

#gdf > .favnote:after             { width: 70px; content: "See your note"; }
#gdf > .favnote.plus:after        { width: 55px; content: "Add a note"; }
#gdf > .favnote.arrow:after       { width: 70px; content: "Save the note"; }
#gdf > .favnote.pencil:after      { width: 70px; content: "Edit your note"; }
#gdf > .favnote.exclamation:after { width: 300px; height: 60px !important; white-space: normal; content: "Note failed to load. Click to retry. WARNING: Changing favourite category while the note is not loaded will remove existing notes!"; }

#gdf > .favnote + .editor {
    position: absolute;
    height: 18px;
    background: ${color.bg_light} !important;
    padding: 10px;
    top: -1px;
    left: 132px;
    z-index: 10;
    border: 1px solid ${color.border};
    visibility: hidden;
}

#gdf > .favnote + .editor > input {
    margin: 0 0 0 30px;
    height: 12px;
}

#gdf > .favnote + .editor > input.notinput {
    border-color: transparent;
    background: none !important;
    color: inherit !important;
    cursor: default !important;
    outline: none !important;
    color: transparent !important;
    text-shadow: 0 0 0 ${color.border};
}

#gdf > .favnote + .editor.show { visibility: visible; }

#gdf.hover .fav {
    position: relative;
}

#gdf .hotkey-hint {
    position: absolute;
    top: 4px;
    right: 0;
    box-sizing: border-box;
    padding: 0 1px 0 2px;
    border: 1px solid #888;
    border-radius: 2px;
    background: #eee;
    color: #666 !important;
    font-family: monospace;
    font-size: 13px;
    box-shadow: -3px 0 2px 2px ${color.bg_light};
    visibility: hidden;
}

#gdf.hover .fav:hover .hotkey-hint {
    box-shadow: -3px 0 2px 2px ${color.bg};
}

#gdf.hover .hotkey-hint {
    visibility: visible;
}

`;

/* ========================================================================= *\
* *  UTILITY FUNCTIONS
\* ========================================================================= */
// Debug msg
function dlog(...msg) {
    if (config.debug) {
        console.log('EHGQF:', ...msg);
    }
}

// Get the actual/current favourite category of the current gallery
function getPageFavId() {
    let idElement = document.querySelector('#fav .i');
    if (!idElement) return 10;
    return (idElement.style.backgroundPositionY.match(/\d+/)[0] - 2) / 19;
}


/* ========================================================================= *\
* *  UI INJECTIONS
\* ========================================================================= */
// Inject CSS
function injectStylesheet() {
    dlog('Injecting stylesheet');
    var stylesheetEl = document.createElement('style');
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
}

// Build and inject FavNote UI
function injectFavnoteElements() {
    dlog('Injecting Favnote UI elements');

    // Fetch the FavID of the current gallery
    var curFavID = getPageFavId();

    // Fetch favnotes if current gallery was already in a fav category
    if (curFavID != 10) {
        fetchFavouriteNotes(favnote => {
            // Determine icon type
            var favnoteStatus = '';
            if (favnote === false) favnoteStatus = 'exclamation';
            if (favnote === '') favnoteStatus = 'plus';

            // Build elements for Favnotes
            var favnoteEl = `
            <div class='favnote ${favnoteStatus}'></div>
            <div class="editor">
                <input type="text" size="${config.editor_size}" class="stdinput" value="${favnote}">
            </div>
            `;

            // Inject
            var gdf = document.getElementById('gdf');
            gdf.insertAdjacentHTML('beforeend', favnoteEl);

            // Add event listeners
            document.querySelector('#gdf > .favnote').addEventListener('click', favnoteClick);

            dlog('Successfully injected Favnote UI');
            return;
        });
    }
    dlog('FavID = 10: No notes to inject!');
}

// Build & Inject QF UI
function injectQFElements() {
    var i;
    dlog('Injecting Quick Fav UI elements');

    // Fetch the FavID of the current gallery
    var curFavID = getPageFavId();

    // Fetch the Labels of the 10 Fav items
    var favLabels = [];
    for (i = 0; i < 10; i++) {
        var label = localStorage.getItem(`EHGQF-fav${i}`);
        if (!label) label = `Favorites ${i+1}`;
        favLabels.push(label);
    }

    // Build fav item elements
    var favEl = [];
    for (i = 0; i < 10; i++) {
        var offset = 2 + (i * 19);
        var el = `
        <div qfid='${i}' class='fav'>
            <div class="i" style="background-image:url(https://ehgt.org/g/fav.png); background-position:0px -${offset}px;"></div>
            &nbsp; <a id="favoritelink" href="#">${favLabels[i]}</a>
            <div class="hotkey-hint">${i}</div>
        </div>
        `;
        favEl.push(el);
    }

    // Add the `remove favorites` fav item
    favEl.push(`
    <div qfid='favdel' class='fav'>
        <a id="favoritelink" href="#">Remove from Favorites</a>
        <div class="hotkey-hint">-</div>
    </div>
    `);

    // Build top list
    var qfTopElContent = '';
    for (i = 0; i < curFavID; i++) { qfTopElContent += favEl[i]; }
    var qfTopEl = `<div class='qf-top'>${qfTopElContent}</div>`;

    // Build bottom list
    var qfBotElContent = "";
    for (i = curFavID + 1; i < favEl.length; i++) { qfBotElContent += favEl[i]; }
    var qfBotEl = `<div class='qf-bot'>${qfBotElContent}</div>`;

    // Inject Elements! Finally
    var gdf = document.getElementById('gdf');
    gdf.insertAdjacentHTML('beforeend', qfTopEl);
    gdf.insertAdjacentHTML('beforeend', qfBotEl);

    // Add Event Listeners
    var favDOMEl = document.querySelectorAll('#gdf .fav');
    for (i = 0; i < favDOMEl.length; i++) {
        favDOMEl[i].addEventListener('click', quickFavourite);
    }

    // Disable `#gdf` click event; move it to its child element;
    gdf.children[0].onclick = gdf.onclick;
    gdf.children[1].onclick = gdf.onclick;
    gdf.onclick = '';

    dlog('UI Injection successful!');
}


/* ========================================================================= *\
* *  QUICK FAVOURITE
\* ========================================================================= */
// Send Favouriting XHR request to EH server
function quickFavourite(id) {
    dlog('quickFavourite() triggered!');

    // Gather and build things
    let favnoteEl = document.querySelector('.favnote + .editor > input');
    let favnote = (favnoteEl) ? favnoteEl.value : '';
    let favID;
    try { favID = this.attributes.qfid.value; } catch (e) {
        favID = id;
    }
    let galID = location.pathname.match(/^\/\w\/(\d+)\//)[1];
    let token = location.pathname.match(/\/(\w+)\/$/)[1];
    let prot = location.protocol;
    let host = location.host;
    let url = `${prot}//${host}/gallerypopups.php?gid=${galID}&t=${token}&act=addfav`;
    let dat = `apply=Add to Favorites&favcat=${favID}&favnote=${favnote}&update=1`;

    // Remove Quick Favourite Elements to prevent sending multiple XHR
    document.querySelector('.qf-top').remove();
    document.querySelector('.qf-bot').remove();
    if (favnoteEl) document.querySelector('.favnote').remove();
    if (favnoteEl) document.querySelector('.editor').remove();

    // Send XHR
    GM.xmlHttpRequest({
        method: 'POST',
        url: url,
        data: dat,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        onload: function(response) {
            if (response.status == 200) {
                updateCurrentFav(favID); // Update #gdf
            } else {
                dlog('Error occurred! Favorite was not updated!');
                alert('Error occurred! Favorite was not updated!');
            }

            injectQFElements(); // Reinject Quick Favourite UI
            if (config.favnote === true) {
                injectFavnoteElements(); // and Favnote UI
            }
            disableHotkeys();
            dlog('quickFavourite() done!'); // Done!
        },
    });
}

// Update the current/actual Favourite Category of the current Gallery
function updateCurrentFav(favID) {
    dlog('Updating current fav with favID ' + favID);

    // If id is not specified, refresh
    if (typeof favID == 'undefined') {
        favID = getPageFavId();
        dlog('FavID set to ' + favID);
    }

    var el;

    if (favID == 'favdel' || favID === 10) {
        el = `
        <div style="float:left">
            &nbsp; <a onclick="return false" href="#" id="favoritelink"><img src="https://ehgt.org/g/mr.gif"> Add to Favorites</a>
                   <div class="hotkey-hint"></div>
        </div>
        `;
    } else {
        // Fetch the Labels of the 10 Fav items
        var favLabels = [];
        for (let i = 0; i < 10; i++) {
            var label = localStorage.getItem(`EHGQF-fav${i}`);
            if (!label) label = `Favorites ${i}`;
            favLabels.push(label);
        }

        // Calculate bg offset
        var offset = 2 + (favID * 19);

        // Build
        el = `
        <div id="fav" style="float:left; cursor:pointer">
            <div title="Read Later" style="background-image:url(https://ehgt.org/g/fav.png); background-position:0px -${offset}px;" class="i"></div>
        </div>
        <div style="float:left">&nbsp;
            <a onclick="return false" href="#" id="favoritelink">${favLabels[favID]}</a>
        </div>
        `;
    }

    document.getElementById('gdf').innerHTML = el;
}

/* ========================================================================= *\
* *  FAVOURITE NOTES
\* ========================================================================= */
// Get Favourite Notes remotely from the popup
function fetchFavouriteNotes(cb) {
    dlog('Beginning to check favnotes');

    // Send XHR to Favourite Page
    var galID = location.pathname.match(/^\/\w\/(\d+)\//)[1];
    var token = location.pathname.match(/\/(\w+)\/$/)[1];
    var prot = location.protocol;
    var host = location.host;
    var url = `${prot}//${host}/gallerypopups.php?gid=${galID}&t=${token}&act=addfav`;


    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        timeout: config.timeout,
        onload: function(response) {
            if (response.status === 200) {
                const responseXML = new DOMParser().parseFromString(response.responseText, 'text/xml');
                var favnoteEl = responseXML.querySelector('textarea[name=\'favnote\']');
                dlog('Favnotes successfully found');
                cb(favnoteEl.value); // Fire callback function
            } else {
                dlog('XHR failed; notes not found');
            }
        },
        ontimeout: function() {
            dlog('XHR timed out; notes not found');
            return false;
        },
    });
}

// Update favnote icon status
function updateFavnoteIcon(status) {
    dlog(`Updating favnote icon to ${status}`);
    var favnoteEl = document.querySelector('#gdf > .favnote');

    // Clear all classes but .favnote
    favnoteEl.className = 'favnote';

    // Add status
    favnoteEl.classList.add(status);
}

// FavNote click event handler
function favnoteClick() {
    var favnoteEl = this;
    var editorEl = document.querySelector('#gdf > .favnote + .editor');
    var inputEl = document.querySelector('#gdf > .favnote + .editor > input');

    // Determine mode
    var mode;
    if (favnoteEl.classList.length === 1) mode = 'show';
    else if (favnoteEl.classList.contains('arrow')) mode = 'save';
    else if (favnoteEl.classList.contains('exclamation')) mode = 'reload';
    else mode = 'edit';

    // Behave accordingly
    switch (mode) {
        case 'show':
            updateFavnoteIcon('pencil'); // marks the next action to edit
            editorEl.classList.add('show');
            inputEl.classList.add('notinput');
            break;
        case 'edit':
            updateFavnoteIcon('arrow'); // marks the next action to save
            editorEl.classList.add('show');
            inputEl.classList.remove('notinput');
            break;
        case 'save':
            var favID = getPageFavId();
            quickFavourite(favID);
            break;
        case 'reload':
            // An error occurred, attempt to reload favnotes
            document.querySelector('.favnote').remove();
            document.querySelector('.editor').remove();
            if (config.favnote === true) {
                injectFavnoteElements();
            }
            break;
        default:
            dlog('What is happening?');
            alert('A really strange error occurred. This part of code should be reached.');
            return;
    }
}


/* ========================================================================= *\
* *  FAVOURITE HOTKEYS
\* ========================================================================= */
// Adds keypress event listener
function injectHotkeyListener() {
    document.addEventListener('keypress', hotkeyHandler);
    var archive = document.getElementsByClassName('g2');
    archive[0].children[1].addEventListener('click', touchHandler);
    //document.getElementById("div").addEventListener("touchmove", touchHandler, false);
    //document.getElementById("div").addEventListener("touchend", touchHandler, false);
    dlog('Listening to keypress events now');
}

// Handles keypresses
function hotkeyHandler(e) {
    let key = e.which;
    let char = String.fromCharCode(key);
    if (hotkeyInit) {
        if (e.keyCode == 27) {
            return;
        }
        // 0-9 and '-'
        let favID;
        switch (char) {
            case ('0'):
                favID = 0;
                break;
            case ('1'):
                favID = 1;
                break;
            case ('2'):
                favID = 2;
                break;
            case ('3'):
                favID = 3;
                break;
            case ('4'):
                favID = 4;
                break;
            case ('5'):
                favID = 5;
                break;
            case ('6'):
                favID = 6;
                break;
            case ('7'):
                favID = 7;
                break;
            case ('8'):
                favID = 8;
                break;
            case ('9'):
                favID = 9;
                break;
            case ('-'):
                favID = 'favdel';
                break;
            default:
                disableHotkeys();
                break;
        }
        if (typeof favID != 'undefined') quickFavourite(favID);
    } else {
        if (char == 'F') {
            enableHotkeys();
        }
    }
}

// Handles Archive Download Click
function touchHandler(e) {
    if (config.archive_fav === true) {
        quickFavourite(config.default_fav);
    }
}
/*
function touchHandler(e) {
    if (e.type == "touchstart") {
        alert("You touched the screen!");
    } else if (e.type == "touchmove") {
        alert("You moved your finger!");
    } else if (e.type == "touchend" || e.type == "touchcancel") {
        alert("You removed your finger from the screen!");
    }
}
*/

function enableHotkeys() {
    hotkeyInit = true;
    if (config.cheatsheet) showCheatSheet();
    dlog('Entering active hotkey favouriting mode');
}

function disableHotkeys() {
    if (config.cheatsheet) hideCheatSheet();
    hotkeyInit = false;
    dlog('Quitting active hotkey favouriting mode');
}

function showCheatSheet() {
    dlog('Showing Cheat Sheet');
    document.getElementById('gdf').classList.add('hover');
}

function hideCheatSheet() {
    dlog('Hiding Cheat Sheet');
    document.getElementById('gdf').classList.remove('hover');
}


/* ========================================================================= *\
* *  CORE LOGICS
\* ========================================================================= */
function checkSyncNecessity() {
    // >1w = stale
    let currentTime = new Date().getTime();
    let lastSyncTime = localStorage.getItem('EHGQF-lastSyncTime');
    let timeDelta = currentTime - lastSyncTime;
    if (timeDelta > 1000 * 60 * 60 * 24 * 7) return true;

    // setup
    let x = localStorage.getItem('EHGQF-setup');
    if (typeof x == 'undefined') return true;

    // constant page check
    let labelId = getPageFavId();
    if (labelId == 10) return false; // can't check if page isn't favourited yet

    let pageLabel = document.querySelector('#favoritelink').textContent;
    let storedLabel = localStorage.getItem(`EHGQF-fav${labelId}`);
    if (pageLabel != storedLabel) return true;

    dlog('No reason found to sync favourite labels');
    return false;
}

function syncFavouriteLabels() {
    dlog('Fetching fresh Favourite Labels!');

    // Send XHR to Favourite Page
    var galID = location.pathname.match(/^\/\w\/(\d+)\//)[1];
    var token = location.pathname.match(/\/(\w+)\/$/)[1];
    var prot = location.protocol;
    var host = location.host;
    var url = `${prot}//${host}/gallerypopups.php?gid=${galID}&t=${token}&act=addfav`;

    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            const responseXML = new DOMParser().parseFromString(response.responseText, 'text/xml');

            for (let i = 0; i <= 9; i++) {
                let label = responseXML.querySelector(`div + div + div[onclick*='fav${i}']`).textContent;
                localStorage.setItem(`EHGQF-fav${i}`, label);
            }

            dlog('Favourite Labels Updated!');
            let time = new Date().getTime();
            localStorage.setItem('EHGQF-setup', 1);
            localStorage.setItem('EHGQF-lastSyncTime', time);
            updateCurrentFav();
            injectQFElements();
        }
    });
}

function init() {
    dlog('Initialization start!');
    if (checkSyncNecessity()) syncFavouriteLabels();
    injectStylesheet();
    injectQFElements();
    if (config.favnote === true) {
        injectFavnoteElements();
    }
    if (config.hotkeys) injectHotkeyListener();

    dlog('Initialization finished!');
}

init();
