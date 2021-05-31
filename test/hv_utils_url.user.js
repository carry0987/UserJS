// ==UserScript==
// @name           HV Utils URL
// @namespace      HVUT_URL
// @version        1.2.1
// @date           2021-03-10
// @author         sssss2
// @match          *://*.hentaiverse.org/?s=Battle
// @match          *://*.hentaiverse.org/isekai/?s=Battle
// @connect        hentaiverse.org
// @connect        e-hentai.org
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// ==/UserScript==

var settings = {

randomEncounter : true, // Random Encounter Notification
reIsekai : true, // use it in Isekai
reBeep : {volume:0.2, frequency:500, time:0.5, delay:1}, // beep when a RE is ready; set volume to 0 to disable
reBattleCSS : "top:10px;left:600px;position:absolute;cursor:pointer;font-size:10pt;font-weight:bold", // modify top and left to locate the timer
ajaxRound : true, // support Monsterbation

};

function $id(id,d){return (d||document).getElementById(id);}
function $element(t,p,a,f){var e;if(!t){if(arguments.length>1){e=document.createTextNode(a);a=null;}else{return document.createDocumentFragment();}}else{e=document.createElement(t);}if(a!==null&&a!==undefined){switch(a.constructor){case Number:e.textContent=a;break;case String:e.textContent=a;break;case Array:a.forEach(function(aa){var a0=({" ":"textContent","#":"id",".":"className","!":"style","/":"innerHTML"})[aa[0]];if(a0){e[a0]=aa.slice(1);}});break;case Object:var ai,av,es,esi;for(ai in a){av=a[ai];if(av&&av.constructor===Object){if(ai in e){es=e[ai];}else{es=e[ai]={};}for(esi in av){es[esi]=av[esi];}}else{if(ai==="style"){e.style.cssText=av;}else if(ai in e){e[ai]=av;}else{e.setAttribute(ai,av);}}}break;}}if(f){if(f.constructor===Function){e.addEventListener("click",f,false);}else if(f.constructor===Object){var fi;for(fi in f){e.addEventListener(fi,f[fi],false);}}}if(p){if(p.nodeType===1||p.nodeType===11){p.appendChild(e);}else if(Array.isArray(p)){if(["beforebegin","afterbegin","beforeend","afterend"].includes(p[1])){p[0].insertAdjacentElement(p[1],e);}else if(!isNaN(p[1])){p[0].insertBefore(e,p[0].childNodes[p[1]]);}else{p[0].insertBefore(e,p[1]);}}}return e;}
function time_format(t,o){t=Math.floor(t/1000);var h=Math.floor(t/3600).toString().padStart(2,"0"),m=Math.floor(t%3600/60).toString().padStart(2,"0"),s=(t%60).toString().padStart(2,"0");return !o?h+":"+m+":"+s:o===1?h+":"+m:o===2?m+":"+s:"";}
function play_beep(s={volume:0.2,frequency:500,time:0.5,delay:1}){if(!s.volume){return;}var c=new window.AudioContext(),o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=s.frequency;g.gain.value=s.volume;o.connect(g);g.connect(c.destination);o.start(s.delay);o.stop(s.delay+s.time);}
function popup(t,s){var r=function(e){e.stopImmediatePropagation();e.preventDefault();if(e.which===1||e.which===13||e.which===27||e.which===32){w.remove();document.removeEventListener("keydown",r);}},w=$element("div",document.body,["!position:fixed;top:0;left:0;width:1236px;height:702px;padding:3px 100% 100% 3px;background-color:rgba(0,0,0,.6);z-index:1001;display:flex;justify-content:center;align-items:center"]),d=$element("div",w,["/"+t,"!min-width:400px;min-height:100px;max-width:100%;max-height:100%;padding:10px;background-color:#fff;border:1px solid #333;cursor:pointer;display:flex;flex-direction:column;justify-content:center;font-size:10pt;color:#000;"+(s||"")],r);document.addEventListener("keydown",r);return d;}

function getValue(k,d,p=_ns+"_"){var v=localStorage.getItem(p+k);return v===null?d:JSON.parse(v);}
function setValue(k,v,p=_ns+"_"){localStorage.setItem(p+k,JSON.stringify(v));}
function deleteValue(k,p=_ns+"_"){localStorage.removeItem(p+k);}

var _ns = "hvut";
var _isekai = location.pathname.includes("/isekai/");
if(_isekai) {
    _ns = "hvuti";
    if(!settings.reIsekai) {
        settings.randomEncounter = false;
    }
}


/***** [MODULE] ajax *****/
var $ajax = {

interval : 300, // DO NOT DECREASE THIS NUMBER, OR IT MAY TRIGGER THE SERVER'S LIMITER AND YOU WILL GET BANNED
max : 4,
tid : null,
conn : 0,
index : 0,
queue : [],

add : function(method,url,data,onload,onerror,context={},headers={}) {
    if(method === "GET") {
    } else if(method === "POST") {
        if(!headers["Content-Type"]) {
            headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(data && typeof data === "object") {
            data = Object.keys(data).map(k=>encodeURIComponent(k)+"="+encodeURIComponent(data[k])).join("&");
        }
    } else if(method === "JSON") {
        method = "POST";
        if(!headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }
        if(data && typeof data === "object") {
            data = JSON.stringify(data);
        }
    }
    context.onload = onload;
    context.onerror = onerror;
    $ajax.queue.push({method:method,url:url,data:data,headers:headers,onload:$ajax.onload,onerror:$ajax.onerror,context:context});
    $ajax.next();
},
next : function() {
    if(!$ajax.queue[$ajax.index] || $ajax.error) {
        return;
    }
    if($ajax.tid) {
        if(!$ajax.conn) {
            clearTimeout($ajax.tid);
            $ajax.timer();
            $ajax.send();
        }
    } else {
        if($ajax.conn < $ajax.max) {
            $ajax.timer();
            $ajax.send();
        }
    }
},
timer : function() {
    $ajax.tid = setTimeout(function(){
        $ajax.tid = null;
        $ajax.next();
    },$ajax.interval);
},
send : function() {
    GM_xmlhttpRequest($ajax.queue[$ajax.index]);
    $ajax.index++;
    $ajax.conn++;
},
onload : function(r) {
    $ajax.conn--;
    var text = r.responseText.trim();
    if(text === "state lock limiter in effect") {
        if($ajax.error !== text) {
            popup("<span style='color:#f00;font-weight:bold'>"+text+"</span><br><span>Your connection speed is so fast that <br>you have reached the maximum connection limit.</span><br><span>Try again later.</span>");
        }
        $ajax.error = text;
        if(r.context.onerror) {
            r.context.onerror(r);
        }
    } else {
        if(r.context.onload) {
            r.context.onload(r);
        }
        $ajax.next();
    }
},
onerror : function(r) {
    $ajax.conn--;
    if(r.context.onerror) {
        r.context.onerror(r);
    }
    $ajax.next();
}

};
/***** [MODULE] ajax *****/


/***** [MODULE] Random Encounter *****/
var $re = {

init : function() {
    if($re.inited) {
        return;
    }
    $re.inited = true;
    $re.type = !location.hostname.includes("hentaiverse.org")||_isekai?0 : $id("navbar")?1 : $id("battle_top")?2 : false;
    $re.get();
},
get : function() {
    $re.json = getValue("re",{date:0,key:"",count:0,clear:true},"hvut_");
    var gm_json = JSON.parse(GM_getValue("re",null)) || {date:-1};
    if($re.json.date === gm_json.date) {
        if($re.json.clear !== gm_json.clear) {
            $re.json.clear = true;
            $re.set();
        }
    } else {
        if($re.json.date < gm_json.date) {
            $re.json = gm_json;
        }
        $re.set();
    }
},
set : function() {
    setValue("re",$re.json,"hvut_");
    GM_setValue("re",JSON.stringify($re.json));
},
reset : function() {
    $re.json.date = Date.now();
    $re.json.count = 0;
    $re.json.clear = true;
    $re.set();
    $re.start();
},
check : function() {
    $re.init();
    if(/\?s=Battle&ss=ba&encounter=([A-Za-z0-9=]+)(?:&date=(\d+))?/.test(location.search)) {
        var key = RegExp.$1,
            date = parseInt(RegExp.$2),
            now = Date.now();
        if($re.json.key === key) {
            if(!$re.json.clear) {
                $re.json.clear = true;
                $re.set();
            }
        } else if(date) {
            if($re.json.date < date) {
                $re.json.date = date;
                $re.json.key = key;
                $re.json.count++;
                $re.json.clear = true;
                $re.set();
            }
        } else if($re.json.date + 1800000 < now) {
            $re.json.date = now;
            $re.json.key = key;
            $re.json.count++;
            $re.json.clear = true;
            $re.set();
        }
    }
},
clock : function(button) {
    $re.init();
    $re.button = button;
    $re.button.addEventListener("click",function(e){$re.run(e.ctrlKey);});
    var date = new Date($re.json.date),
        now = new Date();
    if(date.getUTCDate()!==now.getUTCDate() || date.getUTCMonth()!==now.getUTCMonth() || date.getUTCFullYear()!==now.getUTCFullYear()) {
        $re.reset();
        $re.load();
    }
    $re.check();
    $re.start();
},
refresh : function() {
    var remain = $re.json.date + 1800000 - Date.now();
    if(remain > 0) {
        $re.button.textContent = time_format(remain,2) + " ["+$re.json.count+"]";
        $re.beep = true;
    } else {
        $re.button.textContent = (!$re.json.clear?"Expired":"Ready") + " ["+$re.json.count+"]";
        if($re.beep) {
            $re.beep = false;
            play_beep(settings.reBeep);
        }
        $re.stop();
    }
},
run : function(engage) {
    if($re.type === 2) {
        $re.load();
    } else if($re.type === 1) {
        if(!$re.json.clear || engage) {
            $re.engage();
        } else {
            $re.load(true);
        }
    } else if($re.type === 0) {
        $re.stop();
        $re.button.textContent = "Checking...";
        $ajax.add("GET","https://hentaiverse.org/",null,function(r){
            var html = r.responseText;
            if(html.includes('<div id="navbar">')) {
                if(!$re.json.clear || engage) {
                    $re.engage();
                } else {
                    $re.load(true);
                }
            } else {
                $re.load();
            }
        });
    }
},
load : function(engage) {
    $re.stop();
    $re.get();
    $re.button.textContent = "Loading...";
    $ajax.add("GET","https://e-hentai.org/news.php",null,function(r){
        var html = r.responseText,
            doc = (new DOMParser()).parseFromString(html,"text/html"),
            eventpane = $id("eventpane",doc);
        if(eventpane && /\?s=Battle&amp;ss=ba&amp;encounter=([A-Za-z0-9=]+)/.test(eventpane.innerHTML)) {
            $re.json.date = Date.now();
            $re.json.key = RegExp.$1;
            $re.json.count++;
            $re.json.clear = false;
            $re.set();
            if(engage) {
                $re.engage();
                return;
            }
        } else if(eventpane && /It is the dawn of a new day/.test(eventpane.innerHTML)) {
            popup(eventpane.innerHTML);
            $re.reset();
        } else {
            popup("Failed to get a new Random Encounter key");
        }
        $re.start();
    },function(){
        popup("Failed to read the news page");
        $re.start();
    });
},
engage : function() {
    if(!$re.json.key) {
        return;
    }
    var href = "?s=Battle&ss=ba&encounter="+$re.json.key+"&date="+$re.json.date;
    if($re.type === 2) {
        return;
    } else if($re.type === 1) {
        location.href = href;
    } else if($re.type === 0) {
        window.open((settings.reGalleryAlt?"http://alt.hentaiverse.org/":"https://hentaiverse.org/")+href,"_hentaiverse");
        $re.json.clear = true;
        $re.start();
    }
},
start : function() {
    $re.stop();
    if(!$re.json.clear) {
        $re.button.style.color = "#e00";
    } else {
        $re.button.style.color = "";
    }
    $re.tid = setInterval($re.refresh,1000);
    $re.refresh();
},
stop : function() {
    if($re.tid) {
        clearInterval($re.tid);
        $re.tid = 0;
    }
}

};
/***** [MODULE] Random Encounter *****/


if($id("battle_top")) {

    if(settings.randomEncounter) {
        if($id("textlog").tBodies[0].lastElementChild.textContent === "Initializing random encounter ...") {
            $re.check();
        }
        let button = $element("div",$id("csp"),[" RE","!"+(settings.reBattleCSS||"position:absolute;top:0px;left:0px;cursor:pointer")]);
        $re.clock(button);
        if(settings.ajaxRound) {
            (new MutationObserver(()=>{if(!button.parentNode.parentNode&&$id("csp")){$id("csp").appendChild(button);}$re.start();})).observe(document.body,{childList:true});
        }
    }

} else if($id("navbar")) {

    let url = getValue("url",".");
    location.href = url.endsWith("/?s=Battle") ? "." : url;

}
