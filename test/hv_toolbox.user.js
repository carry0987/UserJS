// ==UserScript==
// @name         HV ToolBox
// @namespace    hentaiverse.org
// @description  Multi-bazaaring, salvaging, repairing, moogling, filter, tweaks and extra features. Based on holy_demon's Item Manager script and Superlatanium's Percentile Ranges script.
// @match        *://*.hentaiverse.org/*
// @start-at     document-end
// @version      1.0.6
// @grant        none
// @author       f4tal (forums.e-hentai.org/index.php?showuser=1237490)
// ==/UserScript==
(function() {
    var $d = document,
        $w = window,
        $lc = localStorage,
        $l = $d.location.href,
        $url = document.location.protocol + "//" + document.location.host;

    function $r() { $w.location.href = $l; }

    function $i(n, p) { return ((p || $d).getElementById(n)); }

    function $q(n, p) { return ((p || $d).querySelector(n)); }

    function $qa(n, p) { return ((p || $d).querySelectorAll(n)); }

    function $e(n, a, p) {
        var e = $d.createElement(n);
        if (p !== undefined) {
            if (p.id) { e.id = p.id; }
            if (p.type) { e.type = p.type; }
            if (p.html) { e.innerHTML = p.html; }
            if (p.style) { e.style.cssText = p.style; }
            if (p.class) { e.className = p.class; }
            if (p.value) { e.value = p.value; }
            if (p.name) { e.name = p.name; }
            if (p.place) { e.placeholder = p.place; }
            if (p.check) { e.checked = p.check; }
            if (p.func) { e.setAttribute("func", p.func); }
        }
        if (a) { a.appendChild(e); }
        return e;
    }

    var newCSS = $e("style", $d.head);

    function $css(n) { newCSS.innerHTML += n; }

    var $switch = false;
    var $eventReload = new CustomEvent("reloadPage");
    $d.addEventListener("reloadPage", function() { $r(); }, false);

    var taskDone = 0;
    var forms = [];
    var lastIter = 0;
    var lastSent = -1;
    var mtrv = 0;
    var t;

    function $g(u, d, t) {
        var r = new XMLHttpRequest();
        r.open("GET", u, true);
        r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        if (!/dynjs/.test(u)) {
            r.responseType = "document";
        }
        r.onreadystatechange = function() {
            if (r.readyState == 4 && r.status == 200) {
                d(r.response);
            }
        };
        r.send(null);
    }

    function $f(u, d, o) {
        var f = $e("iframe", $d.body, { style: "display:none" });
        f.addEventListener("load", function() {
            if (o) {
                if ($switch !== true) {
                    $switch = true;
                } else {
                    $d.dispatchEvent($eventReload);
                }
            }
            d(f.contentDocument.body);
        }, false);
        f.src = u;
    }
    var $m = {
        show: function(h, t, f) {
            var m = $d.createElement("div");
            m.id = "modal";
            if (t === "big") {
                m = $q(".modal_big") || $i("csp").appendChild(m);
                m.className = "modal_big";
            } else {
                m = $q(".modal_imb") || $i("imb").appendChild(m);
                m.className = "modal_imb";
            }
            m.innerHTML = "<div class='modal_inner'>" + h + "<div>";
            if (f) { f(); }
        },
        but: function(h, f, v, c) {
            var b = $d.createElement("button");
            b.type = "button";
            b.id = "modal_b";
            if (v === "big") {
                b = $q(".modal_big").appendChild(b);
            } else {
                b = $q(".modal_imb").appendChild(b);
            }
            b.innerHTML = h;
            if (b.innerHTML === "OK") {
                b.id = "modal_b_ok";
                b.focus();
            }
            if (b.innerHTML === "Calculator") {
                b.id = "modal_b_calc";
            }
            if (b.innerHTML === "Reload") {
                b.focus();
            }
            b.onclick = function() {
                if (f) { f(); }
                if (!c) { this.parentNode.parentNode.removeChild(this.parentNode); }
            };
            if (t) {
                t.hider();
            }
        }
    };
    var $a = {
        query: function(form) {
            var line = "";
            for (var name in form) {
                if (form.hasOwnProperty(name)) {
                    line += ((line.length > 1) ? "&" : "") + name + "=" + encodeURIComponent(form[name]);
                }
            }
            return line;
        },
        post: function(iter) {
            var a = new XMLHttpRequest();
            var param = typeof forms[iter].param === "string" ? forms[iter].param : $a.query(forms[iter].param);
            a.open("POST", forms[iter].path, true);
            a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            a.responseType = "document";
            a.timeout = 10000;
            a.onreadystatechange = function() {
                if (a.status === 200) {
                    lastSent = Math.max(lastSent, iter);
                    if (a.readyState === 2) {
                        if (iter === lastIter) {
                            lastIter++;
                            if (lastIter < forms.length) {
                                $a.post(lastIter);
                            }
                        }
                    } else if (a.readyState === 4 && a.response) {
                        var id = forms[iter].id || false;
                        var answer;
                        if (id) {
                            if (!$q("#battle_main", a.response)) {
                                answer = ($q("#messagebox", a.response)) ? $q("#messagebox", a.response).textContent.replace(/System Message|Salvaged|Received:?|Snowflake has blessed you with (an item|some of her power)!|Hit Space Bar to offer another item like this.|\s\s/gi, "").trim() : "Done";
                            } else {
                                answer = "You are in Battle! Finish it first.";
                            }
                            var resMod = new CustomEvent("resMod", { "detail": { "id": id, "message": answer } });
                            if ($i("results")) { $i("results").dispatchEvent(resMod); }
                        }
                        var cntMod;
                        if (forms[iter].type === "iw") {
                            $r();
                        } else if (forms[iter].type === "shrine") {
                            var m = answer,
                                regex;
                            if (!$tb.log[id]) { // todo:split in two
                                $tb.log[id] = { na: forms[iter].name, c: 0, pab: 0, hath: 0, ed: 0, le: 0, cr: { tot: 0, vig: 0, fin: 0, swi: 0, fort: 0, cun: 0, kno: 0, fla: 0, fro: 0, lig: 0, tem: 0, dev: 0, cor: 0 }, ave: 0, sup: 0, exq: 0, mag: 0, leg: 0, pee: 0 };
                            }
                            if (/Average|Superior|Exquisite|Magnificent|Legendary|Peerless/i.test(m)) {
                                $tb.log[id].t = "tro";
                                $tb.log[id].c += 1;
                                var mapTrophy = [
                                    { q: "Average", s: "ave" },
                                    { q: "Superior", s: "sup" },
                                    { q: "Exquisite", s: "exq" },
                                    { q: "Magnificent", s: "mag" },
                                    { q: "Legendary", s: "leg" },
                                    { q: "Peerless", s: "pee" }
                                ];
                                for (var i = 0; i < 6; i++) {
                                    regex = new RegExp(mapTrophy[i].q, "i");
                                    if (regex.test(m)) {
                                        $tb.log[id][mapTrophy[i].s] += 1;
                                        break;
                                    }
                                }
                            } else {
                                $tb.log[id].t = "art";
                                $tb.log[id].c += 1;
                                var mapArtifact = [
                                    { q: "Crystal", s: "tot" },
                                    { q: "Elixir", s: "le" },
                                    { q: "Hath", s: "hath" },
                                    { q: "Energy", s: "ed" },
                                    { q: "One|By|Increased", s: "pab" }
                                ];
                                var mapArtifactCr = [
                                    { q: "Vigor", s: "vig" },
                                    { q: "Finesse", s: "fin" },
                                    { q: "Swiftness", s: "swi" },
                                    { q: "Fortitude", s: "fort" },
                                    { q: "Cunning", s: "cun" },
                                    { q: "Knowledge", s: "kno" },
                                    { q: "Flames", s: "fla" },
                                    { q: "Frost", s: "fro" },
                                    { q: "Lightning", s: "lig" },
                                    { q: "Tempest", s: "tem" },
                                    { q: "Devotion", s: "dev" },
                                    { q: "Corruption", s: "cor" }
                                ];
                                for (var o = 0; o < 5; o++) {
                                    regex = new RegExp(mapArtifact[o].q, "i");
                                    if (regex.test(m)) {
                                        if (o === 0) {
                                            $tb.log[id].cr[mapArtifact[o].s] += 1;
                                        } else {
                                            $tb.log[id][mapArtifact[o].s] += 1;
                                        }
                                        break;
                                    }
                                }
                                for (var p = 0; p < 12; p++) {
                                    regex = new RegExp(mapArtifactCr[p].q, "i");
                                    if (regex.test(m)) {
                                        $tb.log[id].cr[mapArtifactCr[p].s] += 1;
                                        break;
                                    }
                                }

                            }
                            $tb.sync();
                        } else if (forms[iter].type === "moogle") {
                            if (mtrv === "COD") {
                                mtrv = "CODdone";
                            } else if (mtrv === "SEND") {
                                mtrv = "SENDdone";
                                cntMod = new CustomEvent("cntMod", { "detail": { "count": taskDone } });
                                $i("resultsST").dispatchEvent(cntMod);
                            } else if (typeof mtrv === "number") {
                                taskDone += 1;
                                mtrv += 1;
                            }
                            return true;
                        }
                        taskDone += 1;
                        cntMod = new CustomEvent("cntMod", { "detail": { "count": taskDone } });
                        $i("resultsST").dispatchEvent(cntMod);
                    }
                } else if (a.readyState === 2) {
                    a.abort();
                    $w.setTimeout(function() {
                        $a.post(iter);
                    }, +$tb.set.ajaxwait);
                }
            };
            $w.setTimeout(function() {
                a.send(param);
            }, +$tb.set.ajaxwait);
            if (iter === lastIter && lastIter < forms.length - 1 && !forms[iter].sync && lastIter - lastSent < +$tb.set.ajaxnum) {
                lastIter++;
                $a.post(lastIter);
            }
        },
        form: function(param, path, id, type, name) {
            forms.push({ param: param, path: path, id: id, type: type, name: name });
            if (lastIter === forms.length - 1) {
                $a.post(lastIter);
            }
        },
        call: function(param, path, id, type, name) {
            $a.form(param, path, id, type, name);
            return true;
        }
    };

    function $t(v, u) {
        var temp = "input[name=" + v + "]";
        if ($q(temp)) {
            t[v] = $q(temp).value;
        } else {
            $g(u, function(r) { t[v] = $q(temp, r).value; });
        }
    }

    var $tb;

    function createToolBox() {
        $tb = ($lc.getItem("HVtoolBox") !== null) ? JSON.parse($lc.getItem("HVtoolBox")) : {
            lastRE: "",
            prices: {},
            names: {},
            log: {},
            mon: { gift: 0, bind: 0, sla: 0, bal: 0, isa: 0, des: 0, foc: 0, fri: 0, pro: 0, fle: 0, bar: 0, num: 0, ele: 0, hea: 0, dem: 0, cur: 0, ear: 0, sur: 0, nif: 0, mjo: 0, fre: 0, hei: 0, fen: 0, dam: 0, sto: 0, def: 0, eat: 0, bor: 0, chi: 0, wak: 0, ble: 0, war: 0, rac: 0, che: 0, tur: 0, fox: 0, ox: 0, owl: 0, wardin: 0, neg: 0, cp: 0, sf: 0, ra: 0, dmm: 0, low: 0, lc: 0, ll: 0, lm: 0, lw: 0, mid: 0, mc: 0, ml: 0, mm: 0, mw: 0, high: 0, hc: 0, hl: 0, hm: 0, hw: 0 },
            set: {
                wide: false,
                pos: true,
                posget: [0, 96],
                done: "none",
                drag: true,

                locked: true,
                sellall: false,
                rename: "big",
                showprice: true,
                showpabs: true,
                jenga: false,

                figure: true,
                rare: true,

                inldif: true,
                inlset: true,
                inlper: true,
                inlre: true,

                cred: true,
                equip: true,
                lotshow: true,
                lotweapon: "",
                lotarmor: "",

                mmcod: true,
                mmpr: true,
                mmalert: true,

                arena: true,

                prold: true,
                pralert: true,

                hiover: false,
                hi: ["leg,mag", "slau,radia,heimda", "shade|actua|matrix|phazon", "", "", "", "", "", "", ""],
                hic: ["red", "", "", "", "", "", "", "", "", ""],
                hib: ["", "#ddddFF", "", "", "", "", "", "", "", ""],
                his: ["", "", "rgba(250,150,80,1)", "", "", "", "", "", "", ""],
                css: ""
            },
            templates: {
                shrine: 1,
                filter: "",
                mailto: "",
                mailsub: "",
                mailbody: "",
                mailbodydesc: "",
                mailmode: 1,
                listbody: "",
                listmode: "node",
            }
        };
        $lc.setItem("HVtoolBox", JSON.stringify($tb));
        $tb.sync = function() { $lc.setItem("HVtoolBox", JSON.stringify($tb)); };
        $tb.version = "1.0.4";

        function restoreDefaults(n, d) {
            if ($tb.set[n] == "0" || $tb.set[n] === undefined || $tb.set[n] == "" || $tb.set[n] == "undefined") {
                $tb.set[n] = d;
            }
        }
        var hashMapSet = [
            { n: "butequip", d: ["moogle", "bazaar", "salvage", "repair", "reforge", "iw", "unlock", "storage", "list"] },
            { n: "butitem", d: ["moogle", "bazaar", "shrine", "list"] },
            { n: "ajaxnum", d: 5 },
            { n: "ajaxwait", d: 1500 },
            { n: "ajaxmoogle", d: 250 },
            { n: "lastRE", d: Date.now() + 1830000 },
            { n: "corcheck", d: 600 },
            { n: "sal0", d: 850 },
            { n: "sal1", d: 400 },
            { n: "sal2", d: 100 },
            { n: "sal3", d: 80 },
            { n: "sal4", d: 7000 },
            { n: "sal5", d: 350 },
            { n: "sal6", d: 90 },
            { n: "sal7", d: 75 },
            { n: "sal8", d: 350 },
            { n: "sal9", d: 300 },
            { n: "sal10", d: 60 },
            { n: "sal11", d: 75 },
            { n: "sal12", d: 17000 },
            { n: "sal13", d: 450 },
            { n: "sal14", d: 100 },
            { n: "sal15", d: 88 },
            { n: "sal16", d: 180 }
        ];
        for (var r in hashMapSet) {
            restoreDefaults(hashMapSet[r].n, hashMapSet[r].d);
        }
        if ($lc.getItem("HVItemHelper") !== null) {
            var oldData = JSON.parse($lc.getItem("HVItemHelper"));
            for (var i in oldData.price) {
                if (oldData.price.hasOwnProperty(i)) {
                    $tb.prices[i] = oldData.price[i];
                }
            }
            $lc.removeItem("HVItemHelper");
        }
        $tb.sync();
    }
    createToolBox();

    if ($q(".c5s")) {
        $m.show("<h3>You are using Default Font</h3><h4>HVtoolBox will not work with Default Font Engine</h4><h4>Visit the <a href='" + $url + "?s=Character&ss=se'>in-game settings</a> and activate custom font</h4>", "big");
        $m.but("Got it", undefined, "big");
    }

    function itemManager() {
        t = {
            salv: [],
            sela: [],
            sel: {},
            sell: 0,
            selc: 0,
            gr: "",
            p: "",
            c: "",
            cl: "",
            cm: "",
            cml: "",
            mmtoken: "",
            storetoken: "",
            ids: {},
            i: {},
            hider: function() {
                if (!t.sell) {
                    if ($i("note")) { $i("note").textContent = "You have selected nothing"; }
                    if ($i("modal_b_ok")) { $i("modal_b_ok").style.display = "none"; }
                    if ($i("modal_b_calc")) { $i("modal_b_calc").style.display = "none"; }
                }
            },
            uprcon: function(v) {
                if (v === undefined) {
                    return 0;
                }
                var m = v.replace(",", ".").toLowerCase().match(/^([\d\.]*)(\w*)/);
                if (m[2] === "k") {
                    return m[1] *= 1000;
                } else if (m[2] === "m") {
                    return m[1] *= 1000000;
                } else {
                    return +m[1];
                }
            },
            uidelem: function(e) {
                var m = e.getAttribute("onmouseover");
                var id;
                if (/equips\.set/.test(m)) {
                    id = m.match(/\d+/)[0];
                } else {
                    var c = e.getAttribute("onclick");
                    if (c) {
                        id = c.match(/\d+/)[0];
                    } else {
                        for (var key in t.ids) {
                            if (e.innerHTML === t.ids[key].t) {
                                id = key;
                            }
                        }
                    }
                }
                return +id;
            },
            uformtext: function(v, e) {
                var tv, tag, result = [],
                    resultn = [],
                    resultdiv = [];
                if (!Array.isArray(e)) {
                    var temp = [];
                    for (var o in e) {
                        if (e.hasOwnProperty(o)) {
                            temp.push(t.i[t.sel[o].id]);
                        }
                    }
                    e = temp;
                }

                function parser(i) {
                    var cur = e[i];
                    tv = v.replace(/\$[a-zA-Z0-9]+/gi, function(match) {
                        tag = match.replace(/[\$\s]/gi, "").toLowerCase();
                        if (tag === "num") {
                            return (i < 9) ? ("0" + (i + 1)).slice(-2) : i + 1;
                        }
                        if (cur.hasOwnProperty(tag)) {
                            if (typeof cur[tag] === "function") {
                                return cur[tag]();
                            } else {
                                return cur[tag];
                            }
                        }
                    });
                    if (/\$info|\$badinfo/.test(tv)) {
                        $g("/equip/" + cur.id + "/" + cur.key, function(r) {
                            parseEquip(r.body, {}, function(item) {
                                tv = tv.replace("$badinfo", item.badinfo);
                                tv = tv.replace("$info", item.info);
                                finisher(i);
                            });
                        });
                    } else {
                        finisher(i);
                    }
                }

                function finisher(i) {
                    result[i] = tv;
                    resultn[i] = tv + "\n";
                    resultdiv[i] = "<div>" + tv + "</div>";
                    if (i === e.length - 1) {
                        var eventListReady = new CustomEvent("listReady", { "detail": { "text": result.join(""), "textn": resultn.join(""), "textdiv": resultdiv.join("") } });
                        $d.dispatchEvent(eventListReady);
                    } else {
                        parser(i + 1);
                    }
                }
                parser(0);
            },
            ustart: function() {
                var salvtemp = [];
                if (typeof $tb.set.sal0 !== "undefined") {
                    for (var i = 0; i < 17; i++) {
                        salvtemp.push(+$tb.set["sal" + i]);
                    }
                    while (salvtemp.length) {
                        t.salv.push(salvtemp.splice(0, 4));
                    }
                }
                if (/Bazaar&ss=es|Battle&ss=iw|Forge|Character&ss=in|&equip_slot=/i.test($l)) {
                    t.gr = "equip";
                    t.p = $q(".equiplist");
                    t.c = $qa(".eqp");
                    t.cm = $qa(".eqp", t.p);
                } else if (/Bazaar&ss=is|Bazaar&ss=ss|Character&ss=it/i.test($l)) {
                    t.gr = "item";
                    t.p = $q(".itemlist");
                    t.c = $qa(".itemlist tr");
                    t.cm = $qa("tr", t.p);
                } else if (/Bazaar&ss=mm/i.test($l)) {
                    t.gr = "moogle";
                    t.p = $i("mmail_attachlist");
                    t.c = $qa("#mmail_attachlist > div > div:first-child");
                    t.cm = $qa("#mmail_attachlist > div > div:first-child");
                } else {
                    t.gr = "none";
                }
                t.cl = t.c.length;
                t.cml = t.cm.length;

                function getIdsItem() {
                    $g("/?s=Bazaar&ss=mm&filter=new", function(r) {
                        var its = $qa(".itemlist tr", r);
                        for (var i = 0, len = its.length; i < len; i++) {
                            var w = its[i];
                            var we = $q("div[onmouseover]", w);
                            t.ids[we.getAttribute("onclick").match(/set_mooglemail_item\((\d+),/)[1]] = { t: we.textContent, c: $q("td:last-child", w).textContent };
                        }
                        t.ids["9315"] = { t: "Chaos Token", c: "none" };
                        t.ids["9316"] = { t: "Token of Blood", c: "none" };
                        t.ids["48001"] = { t: "Soul Fragment", c: "none" };
                        t.ids["9317"] = { t: "Soul Fragment", c: "none" };
                        t.ids["9318"] = { t: "Caffeinated Candy", c: "none" };
                        t.ids["9319"] = { t: "Golden Lottery Ticket", c: "none" };
                        getI();
                    });
                }

                function getIdsEquip() {
                    var h = $q("script[src^='/dynjs']");
                    $g(h.src, function(r) {
                        var e = JSON.parse(r.substr(16, r.length - 17));
                        if (typeof dynjs_eqstore !== "undefined") {
                            Object.assign(e, dynjs_eqstore);
                        }
                        for (var i in e) {
                            if (e.hasOwnProperty(i)) {
                                t.ids[i] = { d: e[i].d, k: e[i].k, t: e[i].t };
                            }
                        }
                        getI();
                    }, true);
                }

                function getI() {
                    var elem, name, elemname, id, ido, uniq, jenga = [];
                    for (var i = 0; i < t.cl; i++) {
                        elem = t.c[i];
                        elemname = $q("[onmouseover]", elem);
                        id = +t.uidelem(elemname);
                        ido = id;
                        name = elemname.textContent;
                        if ($tb.names[id]) { elemname.innerHTML = $tb.names[id]; }

                        if (id in t.i) {
                            var newid = id += "0";
                            id = +newid;
                        }

                        t.i[id] = {
                            name: name,
                            myname: "",
                            label: "",
                            elem: elem,
                            elemname: elemname,
                            id: ido,
                            mycount: 0,
                            mypricea: "",
                            myprice: "",
                            high: (function() {
                                var tr;
                                (function() {
                                    for (var i = 0; i < 10; i++) {
                                        var h = $tb.set.hi[i];
                                        if (h.length === 0) {
                                            continue;
                                        }
                                        var r = new RegExp(h, "i");
                                        if (name.match(r)) {
                                            tr = true;
                                            elemname.classList.add("styleHigh" + i);
                                            if (!$tb.set.hiover) {
                                                break;
                                            }
                                        }
                                    }
                                })();
                                return (tr) ? true : false;
                            })(),
                            num: "$num",
                            cod: function() { return Math.ceil(this.mycount * this.myprice); },
                            setformpool: function(f_id) {
                                if (this.mycount !== 0) {
                                    t.sel[f_id] = {
                                        id: t.i[f_id].id,
                                        n: t.i[f_id].name,
                                        p: t.i[f_id].myprice,
                                        c: t.i[f_id].mycount,
                                        l: (function() {
                                            if (t.i[f_id].locked === "true") {
                                                return "true";
                                            } else {
                                                return "";
                                            }
                                        })(),
                                        tp: t.i[f_id].typepage,
                                        kd: t.i[f_id].kind
                                    };
                                } else {
                                    delete t.sel[f_id];
                                }
                                t.sela = [];
                                var j = 0;
                                for (var i in t.sel) {
                                    t.sela[j] = t.sel[i];
                                    j++;
                                }
                                t.sell = Object.keys(t.sel).length;
                                t.selc = 0;
                                for (var ii in t.sel) {
                                    if (t.sel.hasOwnProperty(ii)) {
                                        t.selc += t.sel[ii].c;
                                    }
                                }
                                if ($i("cntr")) {
                                    $i("cntr").innerHTML = "Selected: " + t.sell;
                                }
                                $tb.sync();
                            },
                            setcount: function(f_count) {
                                if (!f_count) {
                                    delete t.sel[this.id];
                                    this.mycount = 0;
                                } else {
                                    this.mycount = f_count;
                                }
                                this.setformpool(this.id);
                            },
                            setprices: function(f_price) {
                                if (!f_price) {
                                    delete $tb.prices[this.id];
                                    this.mypricea = "";
                                } else {
                                    $tb.prices[this.id] = f_price;
                                    this.mypricea = f_price;
                                }
                                this.myprice = t.uprcon(this.mypricea);
                                this.setformpool(this.id);
                            },
                            setnames: function(f_name) {
                                if (f_name === this.name || !f_name) {
                                    delete $tb.names[this.id];
                                    this.elemname.textContent = this.name;
                                    this.myname = "";
                                    this.label = "";
                                } else {
                                    $tb.names[this.id] = f_name;
                                    this.elemname.textContent = f_name;
                                    this.myname = f_name;
                                    this.label = f_name;
                                }
                                this.setformpool(this.id);
                            }
                        };
                        if (elem.parentNode.parentNode.id !== "shop_pane" && elem.parentNode.parentNode.parentNode.id !== "shop_pane") {
                            t.i[id].setcount(0);
                            t.i[id].setprices($tb.prices[id]);
                            t.i[id].setnames($tb.names[id]);
                        }

                        if (t.gr === "equip") {
                            var matchD = t.ids[id].d.match(/<div>([^&]+)\s(?:&nbsp; ){2}(?:Level\s([0-9]+|Unassigned)\s)?.+(Soulbound|Tradeable|Untradeable).+Condition\:.+\((\d+)%.+Tier:\s(\d+)\s(?:\((\d+)\s\/\s(\d+))?/i);
                            var matchN = t.ids[id].t.match(/([\w-]+) ([\w-]*?) ?(Axe|Club|Rapier|Shortsword|Wakizashi|Dagger|Sword Chucks|Estoc|Longsword|Mace|Katana|Scythe|Oak|Redwood|Willow|Katalox|Ebony|Buckler|Kite|Force|Tower|Cotton|Phase|Gossamer|Silk|Leather|Shade|Kevlar|Dragon Hide|Plate|Power|Shield|Chainmail|Gold|Silver|Bronze|Diamond|Emerald|Prism|Platinum|Steel|Titanium|Iron) ?((?!of)\w*) ?((?=of)[\w- ]*|$)/i);
                            var matchP = t.ids[id].d.match(/Strength|Dexterity|Endurance|Agility|Wisdom|Intelligence/gi) || [];
                            var matchO = /Flimsy|Fine|Bronze|Iron|Silver|Steel|Gold|Platinum|Titanium|Emerald|Sapphire|Diamond|Prism|trimmed|adorned|tipped|the Ox|the Raccoon|the Cheetah|the Turtle|the Fox|the Owl|Chucks|Ebony|Scythe|Dagger|Astral|Quintessential|Silk|Hide|Buckler of the Fleet|Cloth of the Fleet|Hulk|Aura|Stone-Skinned|Fire-eater|Frost-born|Thunder-child|Wind-waker|Thrice-blessed|Spirit-ward|Chainmail|Coif|Mitons|Hauberk|Chausses|Kevlar|Gossamer|Tower/i;
                            var mapRare = { "Force": "true", "Phase": "true", "Shade": "true", "Power": "true" };
                            var mapPart = { "Cap": "Head", "Helmet": "Head", "Robe": "Body", "Breastplate": "Body", "Cuirass": "Body", "Gloves": "Hands", "Gauntlets": "Hands", "Pants": "Legs", "Leggings": "Legs", "Greaves": "Legs", "Shoes": "Feet", "Sabatons": "Feet", "Boots": "Feet" };
                            var mapPage = { "One-handed Weapon": "1handed", "Two-handed Weapon": "2handed", "Staff": "staff", "Shield": "shield", "Cloth Armor": "acloth", "Light Armor": "alight", "Heavy Armor": "aheavy" };
                            if (matchN === null || matchN.length !== 6) { matchN = ["%%%", "%%%", "%%%", "%%%", "%%%", "%%%"]; }

                            uniq = {
                                type: matchD[1],
                                level: +matchD[2] || 0,
                                trade: matchD[3] === "Tradeable" ? "true" : "false",
                                cond: +matchD[4],
                                tier: +matchD[5],
                                pxpl: +matchD[6] || 0,
                                pxpr: +matchD[7] || 0,
                                pxp: +matchD[7] || 0,
                                quality: matchN[1],
                                prefix: matchN[2],
                                subtype: matchN[3],
                                parta: matchN[4],
                                suffix: matchN[5],
                                pabn: matchP.length || 0,
                                pab: matchP.join(" ") || "",
                                obsolete: name.match(matchO) ? "true" : "false",
                                typepage: mapPage[matchD[1]],
                                rare: mapRare[matchN[3]] || "false",
                                part: mapPart[matchN[4]] || "",
                                key: t.ids[id].k,
                                url: $url + "/equip/" + id + "/" + t.ids[id].k,
                                count: 1,
                                locked: $q(".il", elem) ? "true" : "false",
                                kind: "equip",
                                info: "$info",
                                badinfo: "$badinfo"
                            };
                            var formPrices = function() {
                                var priceBaz = 0,
                                    priceSal = 0;

                                function getPrice() {
                                    elemname.click();
                                    var s = $qa("#sum_field div div");
                                    if (s.length === 1 && s[0].innerHTML === "0") {
                                        return 0;
                                    }
                                    var r = [];
                                    for (var i = 0, len = s.length; i < len; i++) {
                                        var p = s[i].getAttribute("style").match(/-(\d+)/)[0] / -12 + "";
                                        if (p !== "11") {
                                            r.push(p);
                                        }
                                    }
                                    elemname.click();
                                    priceBaz = +r.reverse().join("");
                                    getPriceS();
                                }

                                function getPriceS() {
                                    if (typeof $tb.set.sal0 !== "undefined") {
                                        var price = 0,
                                            q = uniq.quality,
                                            p = uniq.typepage,
                                            r, b;
                                        if (p === "alight") {
                                            r = 2;
                                        } else if (p === "staff" || p === "shield") {
                                            r = 1;
                                        } else if (p === "acloth") {
                                            r = 3;
                                        } else {
                                            r = 0;
                                        }
                                        if (q === "Superior") {
                                            b = 2;
                                        } else if (q === "Exquisite") {
                                            b = 1;
                                        } else if (q === "Magnificent" || q === "Legendary" || q === "Peerless") {
                                            b = 0;
                                        }
                                        if (b !== undefined) {
                                            price += +t.salv[r][b];
                                            price += (Math.ceil(priceBaz / 500)) * +t.salv[r][3];
                                        } else {
                                            price += Math.ceil(priceBaz / 100) * +t.salv[r][3];
                                        }
                                        if (uniq.rare === "true") {
                                            price += +$tb.set.sal16;
                                        }
                                        priceSal = price;
                                    }
                                    finisher();
                                }

                                function finisher() {
                                    uniq.price = priceBaz;
                                    uniq.prices = priceSal;
                                    uniq.salvage = (priceSal > priceBaz) ? "true" : "false";
                                    uniq.worthsal = (priceSal > priceBaz) ? "true" : "false";
                                    return;
                                }
                                if (!$i("sum_field")) {
                                    finisher();
                                } else {
                                    getPrice();
                                }
                            };
                            formPrices();

                            if ($tb.set.jenga) {
                                jenga.push({ "eid": id.toString(), "key": t.ids[id].k });
                            }
                        } else {
                            var matchOi = /"Ming Vase|Grue|Clover|Rabbit|Vorpal|Jiggy|Chainsaw|Wirt|Shark-Mounted|BFG9000|Railgun|Flame Thrower|Nuke|ASHPD|Smart Bomb|Tesla Coil|Pony Sled|Lantern|Mayan|Fiber-Optic|Snowman|Annoying Dog|Iridium Sprinkler|Ponyfeather|Snowflake|Altcoin|Ancient|Chicken|Mysterious Box|Solstice|Stuffers|Shimmering|Tenbora's Box|Battery|RealPervert|Raptor|Egg|Gift Pony|Faux|Pegasopolis|Keeper|Crystalline|Self-Satisfaction|Six-Lock Box|One-Bit|ASIC|Reindeer|VPS|Heart Locket|Rainbow Projector| Pot$|Smoothie|Smoothie/i;
                            var matchF = /"Health|Spirit|Mana|Soul|Crystal|Monster|Happy|Scrap|Energy|Catalyst/i;
                            uniq = {
                                locked: "false",
                                obsolete: name.match(matchOi) ? "true" : "false",
                                finite: name.match(matchF) ? "false" : "true",
                                count: (t.ids[id] && t.ids[id].c !== "none") ? +t.ids[id].c : +$q("td:last-child", elem).textContent,
                                kind: "item"
                            };
                        }
                        Object.assign(t.i[id], uniq);
                    }

                    if ($tb.set.jenga && jenga.length > 0) {
                        var ht = new XMLHttpRequest();
                        var d = new FormData();
                        d.append('action', 'store');
                        d.append('equipment', JSON.stringify(jenga));
                        ht.open("POST", "https://hvitems.niblseed.com/");
                        ht.send(d);
                    }
                    createIMB();
                }
                if (t.gr === "equip") {
                    getIdsEquip();
                } else if (t.gr === "item") {
                    getIdsItem();
                } else {
                    createIMB();
                }
            }
        };
        t.ustart();

        function createIMB() {
            function createIMBbuttons() {
                function showResults(type) {
                    var table = "<table id='results'><thead><tr><th>Name</th><th class='se'>ID</th><th class='si'>Count</th><th>Price</th><th class='se'>Locked</th><th>Result</th></tr></thead><tbody id='resultst'></tbody></table>";
                    if (type) {
                        $m.show("<h3 id='resultsT'>Processing...</h3><h4 id='resultsST'><span id='lefthand'>0</span> <span>/</span> <span>" + type + "</span></h4>" + table, "big");
                    } else {
                        $m.show("<h3 id='resultsT'>You have selected the following...</h3><h4 id='resultsST'>" + t.sell + " equipment / items</h4>" + table, "big");
                    }
                    $m.but("Close", undefined, "big");

                    if (t.sell > 0) {
                        for (var i = 0; i < t.sell; i++) {
                            $e("tr", $i("resultst"), { html: "<td>" + t.sela[i].n + "</td><td class='se'>" + t.sela[i].id + "</td><td class='si'>" + t.sela[i].c + "</td><td>" + t.sela[i].p + "</td><td class='se'>" + t.sela[i].l + "</td><td id='pars" + t.sela[i].id + "'> </td>" });
                        }
                    } else {
                        $i("results").innerHTML = "";
                    }

                    $i("results").addEventListener("resMod", function(e) {
                        $i("pars" + e.detail.id).innerHTML += e.detail.message + "<br>";
                    }, true);

                    $i("resultsST").addEventListener("cntMod", function(e) {
                        $i("lefthand").textContent = e.detail.count;
                        if ($i("lefthand").textContent == type) {
                            taskDone = 0;
                            $i("resultsT").textContent = "Done. Please, reload the page.";
                            $m.but("Reload", function() { $r(); }, "big");

                            if ($tb.set.done === "sound") {
                                var audio = new Audio("data:audio/x-wav;base64, //OEZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAWAAAQ+AABAQEBDQ0NDQ0nJycnQkJCQkJRUVFRY2NjY2N0dHR0g4ODg4OSkpKSnJycnJyoqKiotLS0tLTAwMDAwMzMzMzY2NjY2OPj4+Pv7+/v7/r6+vr7+/v7+/39/f3+/v7+/v////8AAAA5TEFNRTMuOThyAm4AAAAALksAABRGJAKgTgAARgAAEPhsH+CVAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAKAAAAAAA0gBQAAA54KD//OEZAMJ9hNiAMUUAJQCbsABgigAd6P5q8hIwRX/VEFv7bMIp//utf+/eIiAuJBEYX/5Pu5SjjaE//+f8ynIZjen////9LLfymVHR////tvn33O6n8oijiSuiO6iRziQdheP///QpP7MLjhX/7p//oWzG/nRmO5zCwiAoCBoV/1c76MQRCimOZBo//+59yMQjREYQWiQuCsPDrv9PuliwVBRQeKhH///0hUEWJExUIBsmmIGEJIelmsn49Hm632+//PUZA4cYhN7f8w8Aa48HtZfjVgDkpo6LQMK+34FhalX7BRhid6UbuDuHyIk5N9o0+jnNQUJiNyIe6mxPOeCy5pRg3XGMvIL1ngK4mBNAMhCFYxbYfRhd+FHgR1IcD1LzspptUPUln3cLaZL4jK+HCiZMjWD8tv61nVcVhw2yI4Mc+HlaW+ZZ9etPnP+fj6/zfPzM/6srHsnE4r3CKacsOCrl2un0ZjZN53v7x/n31v7eZcL0tE3V/ePJNTJxoWu1wkls8jsYDpIYeKfQsoSaq4hQ9X///////vn/VNf/39LavqmrQKUmzMPgEAaDAYEQhEIREBZMACEHkbpoMogV1MpyfWTFX63F4gCeXMRr3/KReTChpqzpr4hmSDcuIc2J9U5tx3b3HEyHLjo6xu5Zb2c2w4uyX26U7XuW05rXdVwynwbEynomhDGooGY9oDk+Tkvj4v9m6jdxMSNTc3QktdrMWpqzj8S2TjevmL+I5+i80SWt/L2Z03NCccMjRh0pP0aj2ZuNyg4IxQPY8gd///j/2R9zf9vjmDhoVrnzjZPwC07TmZB06pDbBkEFyx8//PUZA0bbhdWAMy8AC7sLrClj1gA2vQFK2cwy5DZaGsP5wfIU4JtItvev1IjXN7Abt2e5YXr5DjdiSt0ONTUPOIsWkOG3O8wrxYLWxIQqItnq6R6mUrQqe+iy31JmatMYuqn8DSmeRkyro9LWkxfWNYr92lZ2d/vsLCni3IU+opntvvG/v51J6X3beM63X9dO7oapGVuaX0FEwWJVp5hx/vOrbx751D39//4z/9a+f3a7cI7cnz6NFuGFBUKqJCEmHUX40yk/8uK4juGJmd9CkbaMzjEgQP/u95f7VxvVLe0b2fCIAIATF9R+hGrQ9Pc99Dhw/KkWDwnUtYjCZWPzDxqqbRXmzShLaqld9I6xtZAGZ5rnnXKW7qswKRsAFDwIIEaLNpNZ72fwTUHE0yebD0CCsbHzF7kHGrpc6mwgsTBtksNpMCDqlUn03Y5B9XHcS1stbH6p1VYvPKFRKTUNi0Mtea+76llwxS5niJb03bMHraWwPJxUiEcbjUCpSsCUbBiOygPCP/EW2n1TGtm1zpWSU0v9kRHVt7tvMwiSQpSnElIcKMxuFd3mFv78XS9//OUZBEPkelk2+ZIAJr8DucfwzgBSGv1inv6NnEVqSdSknnD5p1UUrro7uOaJ1BPBSpFSKsii3f1PZbLSZfb7rUjRX/fdnRLrCEAhIMImTyv//sv/3+qpfapVk1qWggbo31Opf1M+36///r1UkVLOLUs3PGxqkYmR04qZYZ+m4e0iJl3doCrSje6DCBHecDMY02LHjPIUOOdWdlGlzT//9jVMGw1Mf9dzWoc7Jv/9D0PMQ9HZW1mnGFygrA8BpA5///0VFQ5Ttf/966eezvt6fvsv///6Kiuzs7OqDh7OyGnGmoqOimKqOxMgcDKIFAJ//OkZAMTCglQam5lxpvEGupeMpc+VKLkwaWabPZbvVhrGV/Wp6OXX+RXHK1YoaSxVpdY1d9xq/ruX4/rXf//t27cqmcr8ygmMAMjqj0iBHWsU+NNz/XqX1oe9FbJK7a9LZNBqq0z9cvCbQP4hcA4muv1P73qo5VLQ2ZGb60VWM22SMAQJC2pj1vaqtrZF/btov5lUpbKxkMExczmehSjaGFh6oXD0VKJB6Mft1ktqEEA2xJZE0JIO0wc7DS5Njyj8tVV43Ht5Lx31tHNv+nJf+manS3//77/m7K7KBoQjf///////9v6T0XDXR90fP7ZvZdNpj66+2udcQ53XzF1udDjariKo+KYBRqy49LWc32xe2VnGznOPIuqECgOOnkQ//OkRAYRlflMc2U1Hp0EDrG+wag8GKxm5HWjny5e2UBzT2pjspqWeQHoWnG9ihuSVt+ut6vZ0WIcNUDAJgA0KLwueMyHJpoPWr9dtdJK1Oz//6XtWeMRKgBQOTpBkD9dL/9d0mur0Vav6t6kFu6BqiM0Q869qM/qZnU1DRT3dS311V6rVa+yD03WGIRMy+XUUOfVQP0EGmitPcRAcoNgQAgDuDMJ8ynVWShxYO6PKtHXVrN1ZpfX1QebFJ7lRb9dSnRLp8Z0CpYAKeQJFLZT/////9SlKZKs+yKZ1yDC2gSuDiM1N///////+y3cxH2lQ3X//6v1dqSt7vUrZka0EFFgljRkUU23o1rV0lbmq00fgmUzgy81K5CwCsTku9+b//OUZBARadVKAmU1OhTTquZWKBuGhLE7QjISbkWTNlUISNOzNrqJu/ySGmtdV1JqWgOcF1AGIQyAyygRAMaI9lQwTpWSVbdHXrVvVb//XdbopMgRUEwMBjsZjkjnEiZLSX9X0/o2q7Kt22/TqppGYzQYkLJocXXUvs6DsrU6aP6tu9ddJ+jSUqpFQzynbPfmVbdbLqASG2YylGlmmjTgkhlVWEFIx2mlGuEzgxqhjSdV/9////+LoGApn////////WgqYEqI8kD53pVU+tX99f17bd6uq1F3TOBMD49CXOdln0GlMFNAOMpOBLMKUek1//OUZAwOjdNQE2TULBFrrr4uKCWEiVqKlA7GLQJxTTgBJRjpZP6KrzNV0vtupxGAAvkD5phKZcL6kFs3/b7N////dOYpkwBUSBpyQzBEDyFv//////V9FabEUD40XVVSTdld1+qbVJ1s3ZdO9BmrUiy6aKeyhlxSrG9aACKBh4d4EDfgUj2X6Ir920QjurK7T3ZLf/9Y0DP///9SBuMoAyJXTf////////UzF8axshdX//dtf7W1f/6kH0RvlWeuWO+OEfw19f7QpDZi8C3MMO3KIzIx3yEGlHp1r7p6Ttb6rJIpJEyNYCm0DrFBcpgT//N0RC0LXdVOEmDUKBZrquZeQBsiOv//9///+rWqyzRMhggqpzD///1K/1f9q/6lkVW6v0N+v26v///ej9RBU11/0FuSSSigAAb4Ln2OU82NCmphWqMmvTOZnrT5G1LxF2SRScxGMI8ZH////////+VjIt////////0EzxfCuc8pD9trfdFr1sg6r6Dqd1d62nHnTdhrEGmn5a/ShSc5ZJRALUN+BALH//OEZAsNWdNzLyGlvQ87qsGWOCOG+NFhGN7HPAsLoe9cQgjnzTK/Pajc2P//jWJhkABDSDI3///Z2u2/X/f6k0kUDpgUwDYAXTZf///////6uyQ5wq7rRZnavV+reWiPydnklolEVJFKyKMCwUPAdDFoZZUkOCOADAcblvn5qfnX5mafN3ak7//8KAVb//9HPl90S6FvwVR1VX////////YmRcySCX/////61f/61jlKQg0AVhkiTPV/D1Wy0KWT//OEZA4M4dNQI2DVLBAbpuJWEBuHIZIlTqIlgzE8fAIpKK8vUY2Zr5WYo9aF0KqAuMBwEA0YBRcBEzA1Vr7f/////Vremoh4JBgAIIjTIVrf///////tQLolBlf//91a7dO9f2V6G6FnP1L6dhYCzCOVgERPfxjzTg3N7Pz/S6yvImn/+CF////6Adwjot////////91C1b///pI0l9DZGp6kEKq02TdB3dkjgwuFQ/o7AhIQL8zroKoR1q58iC1//OEZBEL1dNy3xRqwRM7pvL2OBuHmdXuNam7SOv//MODwCoUXJ8S1ImsqHxD2dv///djzFQ0QQnOz////////0VSAZgKiwPyQ9vf/9Lu9EuitmOznKtjnfyphONRDUAVd91aKEO+uwAJjfIpmvIEAkZjTTTz1Z3UcSqI6pNdi7P//9C////oJoGZkOEMSjpgtX//////+tS+iMYhGpkdSX//+1uv+m3fta7OpaKi8PUJAiBs59pzxqMjxbddibtc//OERBAKiO9GCmGQDhVavqTWeM5cdYb1d7v0Qad19/so6Paiz0W9FFyAlgqERHKFpHagtutJVJS0urU+q/7//MTUxNTI+aC7BtUXONEPGmf//+uIv////KqKGHou2Bn3VW5ncSDLMEWSoZMZZik7Y3tn3jF256/NnmiodMHRaio9VV7+b3+x3//bU4dImlBKC4BRUipv//////87fWhxJYCtLHvbkrUa0V6Lke53SgwJsSQGkzexKmlzP35lNDVq//OERBEKwWFAH2EFThWiwqD2YM5eyWYxt2eeWNxYoWVTNHuD6tOtapEiPOu2gpdxCAAiLEN//vTpvXmpuv9NN6GEjFAYHAc0z/////+30K35uI/V7bNny2jrIRufRJIAEpzLJz1nb2EeddSbZSJTRjOImpKkDr8M3s+VYMlk/6O1LKbVJtO01jLf/9dBOMO3///uh2lKTqP//9xqavF2yrjC0qEo2WDv551s9OrlvQJaFqKkmlte1AAois9KdVdi//OEZA8L/V9S3yFCsRJB2mg0YNrsIh/9UdfqfEsioPsVRrL9VYbaquLayHrCwggYAoiyS/0QyblKyGRjOVFurJmlX/fqxQ4FAXm///5WdkeX0Yp6sbOnNoZBT0zwOgJFAaKafp/eGJywCY2rS89ubn7T2VNZOb64ye1dNSsFNSk86DSFmFig/WwiBmSsvS0qqt9+pH6Pr6lt11Oo4ZOo2MCWBCi6Q//9/794d37MSwHxkwgABriI7SpPeZ9G6XlW//OERBEKiOsuL2DLPhWp3lg+wlB8zJVGjT5QN1LDh8/K2cnK+Z5Z4dpnJm5NPhiYYUgafEO/+v3fTndubTmth2bN6dFy3ltU6odfKzj46TUBUSnv/boyuoNLaEAAN0NbVug+iW1D8Zwq2YLMpuR7SFHLDguhxa7q2c8q9K5kpyu4aZREyMZLQFTwmACtS1v/es9Sq91ErSzXtwfVXx9f/NetMyh+DYpg1//kqHsqLApQlQcrSnM3AiYTsuFD1JD0//N0ZBEK7O8aGGTLaQ6Z3jgSYM7cM3H2a9DUfh1wnjYLwjAkIDkn8920jZGHVsloKSefL4cp0BuAmNzvFe7daT3mvSVuyknOfD65JL2udMJf/////YfQJUzpHWFEEYHe67ttr8+z1VtPSk3GQQrCtNtmNQyGGPJjb4fz2qk4Cpa//rxqqr5Kqr/eVdf//5s0BQJHEp2upkxBTUUzLjk4LjSqqqqqqqqq//MUZBIAGAEqAARAAIAAAjwACAAAqqqq//MUZBQAAAGkAAAAAAAAA0gAAAAAqqqq//MUZBcAAAGkAAAAAAAAA0gAAAAAqqqq//MUZBoAAAGkAAAAAAAAA0gAAAAAqqqq");
                                audio.volume = 0.6;
                                audio.play();
                            } else if ($tb.set.done === "reload") {
                                $r();
                            }

                            t.sel = {};
                            t.sela = [];
                            t.selc = 0;
                            t.sell = 0;
                            if ($i("cntr")) {
                                ($i("cntr").textContent = "Selected: " + t.sell);
                            }
                            for (var b = 0, tb = $qa(".equip_select_one, .item_select_one"), lb = tb.length; b < lb; tb[b++].checked = false);
                            for (var a = 0, ta = $qa(".equip_count_one, .item_count_one"), la = ta.length; a < la; ta[a++].value = "");
                        }
                    });
                }

                function showTags() {
                    var mapTagEquip = [{ n: "name", d: "In-game name" }, { n: "myname ($label)", d: "You custom names/labels" }, { n: "id", d: "ID" }, { n: "key", d: "Key-code" }, { n: "url", d: "URL [will be generated according to protocol/domain you are using]" }, { n: "suffix", d: "Suffix" }, { n: "prefix", d: "Prefix" }, { n: "quality", d: "Quality" }, { n: "parta", d: "Name of part (for armor only) [Cuirass, Helmet]" }, { n: "part", d: "Type of part (for armor only) [Head, Body, Hands, Legs, Feet]" }, { n: "type", d: "Type [One-handed Weapon, Shield, Light Armor]" }, { n: "subtype", d: "Subtype [Leather, Shade, Rapier, Redwood]" }, { n: "pab", d: "PABs [Strength, Dexterity, Endurance, Agility, Inteligence, Wisdom]" }, { n: "pabn", d: "Number of PABs" }, { n: "level", d: "Level [will be 0 for unassigned]" }, { n: "tier", d: "IW tier" }, { n: "pxpl", d: "Left-handed PXP [>>100<< / 320]" }, { n: "pxpr ($pxp)", d: "Right-handed PXP [100 / >>320<<]" }, { n: "cond", d: "Condition (In Percent)" }, { n: "price", d: "Bazaar price [Works only at bazaar page]" }, { n: "prices", d: "Salvage price" }, { n: "mypricea", d: "Your custom price in original format [1.3m, 2.5k, 8500]" }, { n: "myprice", d: "Your custom price in converted format [1300000, 2500, 8500]" }, { n: "cod", d: "Price * Count" }, { n: "info", d: "Info from Percentile Ranges Script" }, { n: "badinfo", d: "Badinfo from Percentile Ranges Script" }, { n: "num", d: "Numerator for lists and moogleMail [01, 02, 03]" }, { n: "worthsal", d: "Is worthy to salvage?" }, { n: "locked", d: "Is locked?" }, { n: "rare", d: "Is rare [Power, Force, Phase, Shade]?" }, { n: "trade", d: "Is tradeably?" }, { n: "high", d: "Is highlighted?" }, { n: "obsolete", d: "Is obsolete?" }];
                    var mapTagItem = [{ n: "name", d: "In-game name" }, { n: "myname ($label)", d: "You custom names/labels" }, { n: "id", d: "ID" }, { n: "count", d: "How many of this type you have" }, { n: "mycount", d: "How many of this type you have selected" }, { n: "mypricea", d: "Your custom price in original format [1.3m, 2.5k, 8500]" }, { n: "myprice", d: "Your custom price in converted format [1300000, 2500, 8500]" }, { n: "cod", d: "Price * Count" }, { n: "num", d: "Numerator for lists and moogleMail [01, 02, 03]" }, { n: "high", d: "Is highlighted?" }, { n: "obsolete", d: "Is obsolete?" }, { n: "finite", d: "Is finite?" }];

                    function createTags(type) {
                        var output = "";
                        if (type === "equipment") {
                            for (var i = 0, len = mapTagEquip.length; i < len; output += "<div><span>$" + mapTagEquip[i].n + "</span><span>" + mapTagEquip[i++].d + "</span></div>");
                        } else {
                            for (var j = 0, lenj = mapTagItem.length; j < lenj; output += "<div><span>$" + mapTagItem[j].n + "</span><span>" + mapTagItem[j++].d + "</span></div>");
                        }
                        return "<div><div> Tags for " + type + "</div>" + output + "</div>";
                    }
                    $m.show("<h3>Help</h3><div id='tagshelp'></div>", "big", function() {
                        $e("div", $i("tagshelp"), { html: createTags("equipment") });
                        $e("div", $i("tagshelp"), { html: createTags("items") });
                    });
                    $m.but("Close", undefined, "big");
                }

                function butPreview() {
                    showResults();
                }

                function butMoogle() {
                    $t("mmtoken", "/?s=Bazaar&ss=mm&filter=new");
                    $m.show("<h3>Moogle Form</h3><h4 id='note'>You are going to send " + t.sell + " things, are you sure?</h4>" +
                        "<textarea rows='1' cols='30' id='moogle_recipient' placeholder='Recipient'>" + $tb.templates.mailto + "</textarea>" +
                        "<textarea rows='1' cols='30' id='moogle_subject' placeholder='Subject'>" + $tb.templates.mailsub + "</textarea>" +
                        "<textarea rows='4' cols='30' id='moogle_bodymain' placeholder='Message'>" + $tb.templates.mailbody + "</textarea>" +
                        "<textarea rows='4' cols='30' id='moogle_bodydesc' placeholder='Tags'>" + $tb.templates.mailbodydesc + "</textarea>" +
                        "<select id='moogle_mode'><option value='1'>1 message - 1 attachement</option><option  " + ($tb.templates.mailmode === 10 ? 'selected' : '') + " value='10'>1 message - up to 10 attachements</option></select>" +
                        "<div id='label_check'><label for='auto_unlock'>Automatically unlock equipment</label><input id='auto_unlock' type='checkbox' /></div>");
                    $m.but("OK", function() {
                        var mO = {
                            all: {
                                attach: (function() {
                                    var temp = [];
                                    var selacopy = JSON.parse(JSON.stringify(t.sela));
                                    while (selacopy.length) {
                                        temp.push(selacopy.splice(0, +$i("moogle_mode").value));
                                    }
                                    return temp;
                                })(),
                                recipient: $i("moogle_recipient").value,
                                recipientS: $i("moogle_recipient").value.split(/\s*[,;]+\s*/),
                                subject: $i("moogle_subject").value,
                                bodymain: $i("moogle_bodymain").value,
                                bodydesc: $i("moogle_bodydesc").value,
                                unlock: $i("auto_unlock").checked
                            },
                            one: {
                                attach: "",
                                recipient: "",
                                subject: "",
                                bodydesc: "",
                                bodyfull: "",
                                cod: ""
                            },
                            i: 0,
                            j: 0,
                            init: function() {
                                var stepOneCreate = function() {
                                    if (typeof waitForStepThree !== "undefined") { clearInterval(waitForStepThree); }
                                    if (typeof waitForStepFour !== "undefined") { clearInterval(waitForStepFour); }
                                    if (typeof waitForStepFive !== "undefined") { clearInterval(waitForStepFive); }
                                    mO.one.attach = mO.all.attach[mO.i];
                                    mO.one.recipient = mO.all.recipientS[mO.j];

                                    function one() {
                                        function event(e) {
                                            $d.removeEventListener("listReady", event, false);
                                            mO.one.subject = e.detail.text;
                                            two();
                                        }
                                        $d.addEventListener("listReady", event, false);
                                        var temp = [];
                                        temp.push(t.i[mO.one.attach[0].id]);
                                        t.uformtext(mO.all.subject, temp);
                                    }

                                    function two() {
                                        function event(e) {
                                            $d.removeEventListener("listReady", event, false);
                                            mO.one.bodydesc = e.detail.textn;
                                            three();
                                        }
                                        $d.addEventListener("listReady", event, false);
                                        var temp = [];
                                        for (var n = 0, len = mO.one.attach.length; n < len; n++) {
                                            temp.push(t.i[mO.one.attach[n].id]);
                                        }
                                        t.uformtext(mO.all.bodydesc, temp);
                                    }

                                    function three() {
                                        mO.one.bodyfull = mO.all.bodymain + "\n\n" + mO.one.bodydesc;
                                        var cod = 0;
                                        for (var j = 0, len = mO.one.attach.length; j < len; j++) {
                                            cod += Math.ceil(mO.one.attach[j].c * mO.one.attach[j].p);
                                        }
                                        mO.one.cod = cod;
                                        stepTwoAttach();
                                    }
                                    one();
                                };
                                var stepTwoAttach = function() {
                                    for (var j = 0, len = mO.one.attach.length; j < len; j++) {
                                        if (mO.all.unlock === true && mO.one.attach[j].l === "true") {
                                            t.i[mO.one.attach[j].id].elem.children[0].click();
                                        }
                                        $a.call({ mmtoken: t.mmtoken, action: "attach_add", select_item: mO.one.attach[j].id, select_count: mO.one.attach[j].c, select_pane: mO.one.attach[j].kd }, "?s=Bazaar&ss=mm&filter=new", mO.one.attach[j].id, "moogle");
                                    }
                                    var waitForStepThree = setInterval(function() {
                                        if (mtrv === mO.one.attach.length) {
                                            clearInterval(waitForStepThree);
                                            stepThreeCod();
                                        }
                                    }, +$tb.set.ajaxmoogle);
                                };
                                var stepThreeCod = function() {
                                    mtrv = "COD";
                                    $a.call({ mmtoken: t.mmtoken, action: "attach_cod", action_value: mO.one.cod }, "?s=Bazaar&ss=mm&filter=new", undefined, "moogle");
                                    var waitForStepFour = setInterval(function() {
                                        if (mtrv === "CODdone") {
                                            clearInterval(waitForStepFour);
                                            stepFourSend();
                                        }
                                    }, +$tb.set.ajaxmoogle);
                                };
                                var stepFourSend = function() {
                                    mtrv = "SEND";
                                    $a.call({ mmtoken: t.mmtoken, action: "send", message_to_name: mO.one.recipient, message_subject: mO.one.subject, message_body: mO.one.bodyfull }, "?s=Bazaar&ss=mm&filter=new", undefined, "moogle");
                                    var waitForStepFive = setInterval(function() {
                                        if (mtrv === "SENDdone") {
                                            clearInterval(waitForStepFive);
                                            stepFiveEnd();
                                        }
                                    }, +$tb.set.ajaxmoogle);
                                };
                                var stepFiveEnd = function() {
                                    mtrv = 0;
                                    mO.i = mO.i + 1;
                                    if (mO.i < mO.all.attach.length) {
                                        mO.init();
                                    } else {
                                        mO.j = mO.j + 1;
                                        if (mO.j < mO.all.recipientS.length) {
                                            mO.i = 0;
                                            mO.init();
                                        } else {
                                            return true;
                                        }
                                    }
                                };
                                stepOneCreate();
                            }
                        };

                        $tb.templates.mailto = $i("moogle_recipient").value;
                        $tb.templates.mailsub = $i("moogle_subject").value;
                        $tb.templates.mailbody = $i("moogle_bodymain").value;
                        $tb.templates.mailbodydesc = $i("moogle_bodydesc").value;
                        $tb.templates.mailmode = +$i("moogle_mode").value;
                        $tb.sync();

                        showResults(t.sell * mO.all.recipientS.length);
                        var waitForToken = setInterval(function() {
                            if (t.mmtoken !== "") {
                                clearInterval(waitForToken);
                                mO.init();
                            }
                        }, 150);
                    });
                    $m.but("Help", showTags, "imb", true);
                    $m.but("Cancel");
                }

                function butBazaar() {
                    $t("storetoken", "/?s=Bazaar&ss=es");
                    $m.show("<h3>Bazaar</h3><h4 id='note'>You are going to bazaar " + t.sell + " things, are you sure?</h4>");
                    $m.but("OK", function() {
                        showResults(t.sell);

                        function start() {
                            for (var i = 0; i < t.sell; i++) {
                                var cur = t.sela[i];
                                if (t.gr === "equip") {
                                    $a.call({ storetoken: t.storetoken, select_group: "item_pane", select_eids: cur.id }, "?s=Bazaar&ss=es", cur.id);
                                } else {
                                    $a.call({ storetoken: t.storetoken, select_mode: "item_pane", select_item: cur.id, select_count: cur.c }, "?s=Bazaar&ss=is", cur.id);
                                }
                            }
                        }
                        var waitForToken = setInterval(function() {
                            if (t.storetoken !== "") {
                                clearInterval(waitForToken);
                                start();
                            }
                        }, 150);
                    });
                    $m.but("Cancel");
                }

                function butSalvage() {
                    $m.show("<h3>Salvage</h3><h4 id='note'>You are going to salvage " + t.sell + " equipment, are you sure?</h4>");
                    $m.but("OK", function() {
                        showResults(t.sell);
                        for (var i = 0; i < t.sell; i++) {
                            var cur = t.sela[i];
                            $a.call({ select_item: cur.id }, "?s=Forge&ss=sa&filter=" + cur.tp, cur.id);
                        }
                    });
                    $m.but("Cancel");
                }

                function butRepair() {
                    $m.show("<h3>Repair</h3><h4 id='note'>You are going to repair " + t.sell + " equipment, are you sure?</h4>");
                    $m.but("OK", function() {
                        showResults(t.sell);
                        for (var i = 0; i < t.sell; i++) {
                            var cur = t.sela[i];
                            $a.call({ select_item: cur.id }, "?s=Forge&ss=re&filter=" + cur.tp, cur.id);
                        }
                    });
                    $m.but("Cancel");
                }

                function butReforge() {
                    $m.show("<h3>Reforge</h3><h4 id='note'>You are going to reforge " + t.sell + " equipment, are you sure?</h4>");
                    $m.but("OK", function() {
                        showResults(t.sell);
                        for (var i = 0; i < t.sell; i++) {
                            var cur = t.sela[i];
                            $a.call({ select_item: cur.id }, "?s=Forge&ss=fo&filter=" + cur.tp, cur.id);
                        }
                    });
                    $m.but("Cancel");
                }

                function butIW() {
                    $m.show("<h3>Item World</h3><h4 id='note'>You are going to enter into Item World of <span id='iwequip'></span>, are you sure?</h4><div id='iwnote'></div>");
                    $m.but("Calculator", function() {
                        var id = t.sela[0].id;
                        var tier = t.i[id].tier;
                        var pxp = t.i[id].pxpr;
                        var pxpnow = t.i[id].pxpl;
                        var basepxp, rounds;
                        if (tier === 0) {
                            basepxp = pxp;
                            rounds = Math.floor(75 * Math.pow(((basepxp - 100) / 250), 3));
                            rounds = (rounds < 20) ? 20 : rounds;
                        } else {
                            rounds = prompt("Sorry, but that equipment has Tier more than zero. Manually input the amount of rounds in the field below");
                            basepxp = Math.floor(Math.pow(rounds / 75, (1 / 3)) * 250 + 100);
                        }
                        var a = [0];
                        for (i = 1; i < 11; i++) {
                            var b = Math.ceil(1000 * (Math.pow((1 + basepxp / 1000), i) - 1));
                            a.push(b);
                        }
                        var c = [];
                        for (i = 0; i < 10; i++) {
                            var d = a[i + 1] - a[i];
                            c.push(d);
                        }
                        var pxpperiw = [2, 2, 4, 7, 10, 15, 20];
                        for (var r = 0; r < 7; r += 1) {
                            pxpperiw[r] = rounds * pxpperiw[r];
                        }
                        $m.show(
                            "<h3>Item World Calculator</h3>" +
                            "<h4>" + t.i[id].name + "</h4>" +
                            "<div id='butIW_modal_warning'>Data may be incorrect (+/- 20 pxp), especially if that equipment has Tier more than 0</div>" +
                            "<div id='butIW_modal'>" +
                            "<div>" +
                            "<table>" +
                            "<tr><td></td><th>PXP to next Tier</th><th>Total PXP to this Tier</th></tr>" +
                            "<tr><td>Tier 0</td><td>" + c[0] + "</td><td>" + a[0] + "</td></tr>" +
                            "<tr><td>Tier 1</td><td>" + c[1] + "</td><td>" + a[1] + "</td></tr>" +
                            "<tr><td>Tier 2</td><td>" + c[2] + "</td><td>" + a[2] + "</td></tr>" +
                            "<tr><td>Tier 3</td><td>" + c[3] + "</td><td>" + a[3] + "</td></tr>" +
                            "<tr><td>Tier 4</td><td>" + c[4] + "</td><td>" + a[4] + "</td></tr>" +
                            "<tr><td>Tier 5</td><td>" + c[5] + "</td><td>" + a[5] + "</td></tr>" +
                            "<tr><td>Tier 6</td><td>" + c[6] + "</td><td>" + a[6] + "</td></tr>" +
                            "<tr><td>Tier 7</td><td>" + c[7] + "</td><td>" + a[7] + "</td></tr>" +
                            "<tr><td>Tier 8</td><td>" + c[8] + "</td><td>" + a[8] + "</td></tr>" +
                            "<tr><td>Tier 9</td><td>" + c[9] + "</td><td>" + a[9] + "</td></tr>" +
                            "<tr><td>Tier 10</td><td>MAX</td><td>" + a[10] + "</td>" +
                            "</tr>" +
                            "</table>" +
                            "</div>" +

                            "<div>" +
                            "<table>" +
                            "<tr><th colspan='3'>Calculator</th></tr>" +
                            "<tr><td>From Tier:</td><td>To Tier:</td><td>Difficulty:</td>  </tr>" +
                            "<tr><td><select id='butIW_from'><option value=" + a[0] + ">Tier 0</option><option value=" + a[1] + ">Tier 1</option><option value=" + a[2] + ">Tier 2</option><option value=" + a[3] + ">Tier 3</option><option value=" + a[4] + ">Tier 4</option><option value=" + a[5] + ">Tier 5</option><option value=" + a[6] + ">Tier 6</option><option value=" + a[7] + ">Tier 7</option><option value=" + a[8] + ">Tier 8</option><option value=" + a[9] + ">Tier 9</option><option value=" + a[10] + ">Tier 10</option></select></td>" +
                            "<td><select id='butIW_to'><option value=" + a[0] + ">Tier 0</option><option value=" + a[1] + ">Tier 1</option><option value=" + a[2] + ">Tier 2</option><option value=" + a[3] + ">Tier 3</option><option value=" + a[4] + ">Tier 4</option><option value=" + a[5] + ">Tier 5</option><option value=" + a[6] + ">Tier 6</option><option value=" + a[7] + ">Tier 7</option><option value=" + a[8] + ">Tier 8</option><option value=" + a[9] + ">Tier 9</option><option value=" + a[10] + ">Tier 10</option></select></td>" +
                            "<td><select id='butIW_dif'><option value=" + pxpperiw[0] + ">Normal</option><option value=" + pxpperiw[1] + ">Hard</option><option value=" + pxpperiw[2] + ">Nightmare</option><option value=" + pxpperiw[3] + ">Hell</option><option value=" + pxpperiw[4] + ">Nintendo</option><option value=" + pxpperiw[5] + ">IWBTH</option><option value=" + pxpperiw[6] + ">PFUDOR</option></select></td>" +
                            "<tr><td></td><td></td><td></td></tr>" +
                            "<tr><td>Soulfused?</td><td><input id='butIW_soulf' type='checkbox'></input></td><td></td></tr>" +
                            "<tr><td>Add current PXP?</td><td><input id='butIW_addcur' type='checkbox'></input></td><td></td></tr>" +
                            "<tr><td>IW service cost per pxp?</td><td><input id='butIW_cost' type='text'></input></td><td></td></tr>" +
                            "<tr><td></td><td></td><td></td></tr>" +
                            "<tr><td style='border-top: 1px solid #5C0D11; font-weight: bold;'>PXP:</td><td id='calcpxp'></td><td></td>  </tr>" +
                            "<tr><td style='font-weight: bold;'>Runs:</td><td id='calcruns'></td><td></td>  </tr>" +
                            "<tr><td style='font-weight: bold;'>Cost:</td><td id='calccost'></td> <td></td></tr>" +
                            "</table>" +
                            "</div>" +

                            "<div><table>" +
                            "<tr><td></td><th colspan='2'>Stats</th></tr>" +
                            "<tr><td></td><td>Base PXP: " + basepxp + "</td><td>Rounds per IW: " + rounds + "</td></tr>" +
                            "<tr><td></td><td>Current PXP: " + pxpnow + " / " + pxp + "</td><td>Current Tier: " + tier + "</td></tr>" +
                            "<tr><td></td><th colspan='2'>PXP per run:</th></tr>" +
                            "<tr><td></td><td>Non Soulfused</td><td>Soulfused</td></tr>" +
                            "<tr><td>Normal</td><td>" + pxpperiw[0] + "</td><td>" + pxpperiw[0] * 2 + "</td></tr>" +
                            "<tr><td>Hard</td><td>" + pxpperiw[1] + "</td><td>" + pxpperiw[1] * 2 + "</td></tr>" +
                            "<tr><td>Nightmare</td><td>" + pxpperiw[2] + "</td><td>" + pxpperiw[2] * 2 + "</td></tr>" +
                            "<tr><td>Hell</td><td>" + pxpperiw[3] + "</td><td>" + pxpperiw[3] * 2 + "</td></tr>" +
                            "<tr><td>Nintendo</td><td>" + pxpperiw[4] + "</td><td>" + pxpperiw[4] * 2 + "</td></tr>" +
                            "<tr><td>IWBTH</td><td>" + pxpperiw[5] + "</td><td>" + pxpperiw[5] * 2 + "</td></tr>" +
                            "<tr><td>PFUDOR</td><td>" + pxpperiw[6] + "</td><td>" + pxpperiw[6] * 2 + "</td></tr>" +
                            "</table></div>" +
                            "</div>", "big");
                        $m.but("Calculate", function() {
                            var calcaddcur = 0,
                                calcmod = 1;

                            if ($i("butIW_addcur").checked) {
                                calcaddcur = pxpnow;
                            }
                            if ($i("butIW_soulf").checked) {
                                calcmod = 2;
                            }

                            var calcpxp = +$i("butIW_to").value - (+($i("butIW_from").value) + calcaddcur);

                            var calcruns = Math.ceil(calcpxp / ($i("butIW_dif").value * calcmod));

                            var calccost = calcruns * +($i("butIW_cost").value || 0) * rounds * 16;
                            $i("calcpxp").innerHTML = calcpxp;
                            $i("calcruns").innerHTML = calcruns;
                            $i("calccost").innerHTML = calccost;

                        }, "big", true);
                        $m.but("Close", undefined, "big");
                    }, "imd", true); // todo:rebuild
                    $m.but("OK", function() {
                        $m.show("<h3>Please, wait for a few seconds</h3>", "big");
                        var idToMatch = new RegExp(t.sela[0].id);
                        $g("/?s=Battle&ss=iw&filter=" + t.sela[0].tp, function(r) {
                            for (var i = 0, p = $qa(".eqp div:last-child", r), len = p.length; i < len; i++) {
                                var onclickToTest = p[i].getAttribute("onclick");
                                if (idToMatch.test(onclickToTest)) {
                                    $a.call({ initid: t.sela[0].id, inittoken: onclickToTest.match(/'(.+)'/)[1] }, "?s=Battle&ss=iw&filter=" + t.sela[0].tp, t.sela[0].id, "iw");
                                    break;
                                }
                            }
                        });
                    });
                    $m.but("Cancel");
                    if (t.sell > 0) { $i("iwequip").textContent = t.sela[0].n; }
                    if (t.sell > 1) { $i("iwnote").textContent = "Warning! You have selected more than 1 equipment! Please check the information above to be sure that you are going into Item World of the right equipment"; }
                }

                function butLock() {
                    $m.show("<h3>Lock/Unlock</h3><h4 id='note'>You are going to Lock/Unlock " + t.sell + " equipment, are you sure?</h4>");
                    $m.but("OK", function() {
                        for (var i = 0; i < t.sell; i++) {
                            var cur = t.sela[i].id;
                            $q("div:first-child", t.i[cur].elem).click();
                        }
                    });
                    $m.but("Cancel");
                }

                function butStorage() {
                    $m.show("<h3>Storage</h3><h4 id='note'>You are going to send to storage " + t.sell + " equipment, are you sure?</h4>");
                    $m.but("OK", function() {
                        showResults(t.sell);
                        for (var i = 0; i < t.sell; i++) {
                            var cur = t.sela[i];
                            $a.call({ equiplist: cur.id, equipgroup: "inv_equip" }, "?s=Character&ss=in&filter=" + cur.tp, cur.id);
                        }
                    });
                    $m.but("Cancel");
                }

                function butList() {
                    $m.show("<h3>List</h3><h4 id='note'>You are going to create list for " + t.sell + " things, are you sure?</h4>" +
                        "<textarea rows='4' cols='30' placeholder='Put here tags you want to create list with' id='list_body'>" + $tb.templates.listbody + "</textarea>" +
                        "<select id='list_mode'><option value='id'>Sort by ID</option><option  " + ($tb.templates.listmode === "node" ? 'selected' : '') + " value='node'>Sort by type</option></select>");
                    $m.but("OK", function() {
                        $tb.templates.listbody = $i("list_body").value;
                        $tb.templates.listmode = $i("list_mode").value;
                        $tb.sync();

                        var orderedList = [],
                            v;

                        if ($tb.templates.listmode === "node") {
                            for (var n = 0; n < t.cml; n++) {
                                v = t.i[t.uidelem($q("[onmouseover]", t.cm[n]))];
                                if (v.mycount > 0) {
                                    orderedList.push(v);
                                }
                            }
                        } else {
                            orderedList = t.sel;
                        }

                        function event(e) {
                            $d.removeEventListener("listReady", event, false);
                            $m.show("<h3>Here is your list</h3><textarea rows='20' cols='30' id='list_full'>" + e.detail.textn + "</textarea>", "big");
                            $m.but("Copy", function() {
                                var copyTextarea = $i("list_full");
                                copyTextarea.select();
                                $d.execCommand('copy');
                                $q("#modal_b").innerHTML = "Copied";
                            }, "big", true);
                            $m.but("Close", undefined, "big");
                        }
                        $d.addEventListener("listReady", event, false);
                        $m.show("<h3>Your list is under creating. Please wait for a few seconds</h3>", "big");
                        t.uformtext($tb.templates.listbody, orderedList);
                    });
                    $m.but("Help", showTags, "imb", true);
                    $m.but("Cancel");
                }

                function butShrine() {
                    $m.show("<h3>Shrine</h3><h4 id='note'>You are going to shrine " + t.sell + " items, with total count is " + t.selc + ", are you sure?</h4>" +
                        "<div><label>What you want to receive back?</label><select id='shrine_body'>" +
                        "<option " + ($tb.templates.shrine === 1 ? 'selected' : '') + " value='1'>Weapon : One-handed</option><option " + ($tb.templates.shrine == 2 ? 'selected' : '') + " value='2'>Weapon : Two-handed</option><option " + ($tb.templates.shrine === 3 ? 'selected' : '') + " value='3'>Weapon : Staff</option>" +
                        "<option " + ($tb.templates.shrine === 4 ? 'selected' : '') + " value='4'>Armor : Shield</option><option " + ($tb.templates.shrine === 5 ? 'selected' : '') + " value='5'>Armor : Cloth</option><option " + ($tb.templates.shrine === 6 ? 'selected' : '') + " value='6'>Armor : Ligth</option>" +
                        "<option " + ($tb.templates.shrine === 7 ? 'selected' : '') + " value='7'>Armor : Heavy</option><option " + ($tb.templates.shrine === 0 ? 'selected' : '') + " value='0'>Shrine an Artifact</option></select></div>");
                    $m.but("OK", function() {
                        $tb.templates.shrine = +$i('shrine_body').value;
                        $tb.sync();
                        showResults(t.selc);
                        for (var i = 0; i < t.sell; i++) {
                            var cur = t.sela[i];
                            for (var u = 0; u < cur.c; u++) {
                                $a.call({ select_item: cur.id, select_reward: $tb.templates.shrine }, "?s=Bazaar&ss=ss", cur.id, "shrine", cur.n);
                            }
                        }
                    });
                    $m.but("Cancel");
                }

                function butLog() { // todo:rebuild
                    $m.show("<h3>Log</h3><h4>What log you want to check?</h4>");
                    $m.but("Trophies", function() {
                        $m.show("<h3>Trophies</h3><div id='logs'></div>", "big", function() {
                            for (var d in $tb.log) {
                                var cur = $tb.log[d];
                                var p = function(x) { return Math.floor(x * 100 / cur.c) + "%"; };
                                if (cur.t === "tro") {
                                    var table = document.createElement("div");
                                    table.innerHTML = "<table><tbody>" +
                                        "<tr><th colspan='3'>" + cur.na + "</th></tr>" +
                                        "<tr><th>Total shrined</th><th>" + cur.c + "</th><td>100%</td></tr>" +
                                        "<tr><td>Average</td><td>" + cur.ave + "</td><td>" + p(cur.ave) + "</td></tr>" +
                                        "<tr><td>Superior</td><td>" + cur.sup + "</td><td>" + p(cur.sup) + "</td></tr>" +
                                        "<tr><td>Exquisite</td><td>" + cur.exq + "</td><td>" + p(cur.exq) + "</td></tr>" +
                                        "<tr><td>Magnificent</td><td>" + cur.mag + "</td><td>" + p(cur.mag) + "</td></tr>" +
                                        "<tr><td>Legendary</td><td>" + cur.leg + "</td><td>" + p(cur.leg) + "</td></tr>" +
                                        "<tr><td>Peerless</td><td>" + cur.pee + "</td><td>" + p(cur.pee) + "</td></tr>" +
                                        "</tbody></table>";
                                    $i("logs").appendChild(table);
                                }
                            }
                        });
                        $m.but("Close", undefined, "big");
                    }, "imb", true);
                    $m.but("Artifacts", function() {
                        $m.show("<h3>Artifacts</h3><div class='art' id='logs'></div>", "big", function() {
                            for (var d in $tb.log) {
                                var cur = $tb.log[d];
                                var p = function(x) { return Math.floor(x * 100 / cur.c) + "%"; };
                                var c = function(x) { return Math.floor(x * 100 / cur.cr.tot) + "%"; };
                                if (cur.t === "art") {
                                    var table = document.createElement("div");
                                    table.innerHTML = "<table><tbody>" +
                                        "<tr><th colspan='9'>" + cur.na + "</th></tr>" +
                                        "<tr><th>Total shrined</th><th>" + cur.c + "</th><td>100%</td><th>Total Crystals:</th><th>" + cur.cr.tot + "</th><td></td><td></td><td></td><td></td></tr>" +
                                        "<tr><td>Hath</td><td>" + cur.hath + "</td><td>" + p(cur.hath) + "</td><td>...Vigor </td><td>" + cur.cr.vig + "</td><td>" + c(cur.cr.vig) + "</td><td>...Flames</td><td>" + cur.cr.fla + "</td><td>" + c(cur.cr.fla) + "</td></tr>" +
                                        "<tr><td>Crystals</td><td>" + cur.cr.tot + "</td><td>" + p(cur.cr.tot) + "</td><td>...Finesse </td><td>" + cur.cr.fin + "</td><td>" + c(cur.cr.fin) + "</td><td>...Frost</td><td>" + cur.cr.fro + "</td><td>" + c(cur.cr.fro) + "</td></tr>" +
                                        "<tr><td>Energy Drink</td><td>" + cur.ed + "</td><td>" + p(cur.ed) + "</td><td>...Swiftness</td><td>" + cur.cr.swi + "</td><td>" + c(cur.cr.swi) + "</td><td>...Lightning</td><td>" + cur.cr.lig + "</td><td>" + c(cur.cr.lig) + "</td></tr>" +
                                        "<tr><td>Last Elixir</td><td>" + cur.le + "</td><td>" + p(cur.le) + "</td><td>...Fortitude</td><td>" + cur.cr.fort + "</td><td>" + c(cur.cr.fort) + "</td><td>...Tempest</td><td>" + cur.cr.tem + "</td><td>" + c(cur.cr.tem) + "</td></tr>" +
                                        "<tr><td>PAB</td><td>" + cur.pab + "</td><td>" + p(cur.pab) + "</td><td>...Cunning </td><td>" + cur.cr.cun + "</td><td>" + c(cur.cr.cun) + "</td><td>...Devotion</td><td>" + cur.cr.dev + "</td><td>" + c(cur.cr.dev) + "</td></tr>" +
                                        "<tr><td></td><td></td><td></td><td>...Knowledge</td><td>" + cur.cr.kno + "</td><td>" + c(cur.cr.kno) + "</td><td>...Corruption</td><td>" + cur.cr.cor + "</td><td>" + c(cur.cr.cor) + "</td></tr>" +
                                        "</tbody></table>";
                                    $i("logs").appendChild(table);
                                }
                            }
                        });
                        $m.but("Close", undefined, "big");
                    }, "imb", true);
                    $m.but("Gifts", function() {
                        $m.show("<h3>Gifts</h3><div class='art' id='logs'></div>", "big", function() {
                            var c = $tb.mon;

                            function p(x) { return (Math.floor(x * 100 / c.gift) + "%").replace("NaN", "0"); }

                            function l(x) { return (Math.floor(x * 100 / c.low) + "%").replace("NaN", "0"); }

                            function m(x) { return (Math.floor(x * 100 / c.mid) + "%").replace("NaN", "0"); }

                            function h(x) { return (Math.floor(x * 100 / c.high) + "%").replace("NaN", "0"); }

                            function b(x) { return (Math.floor(x * 100 / c.bind) + "%").replace("NaN", "0"); }
                            var table = document.createElement("div");
                            table.innerHTML = "<table><tbody>" +
                                "<tr><th>Total                  </th><th>" + c.gift + " </th></td><td>100%</td><td></td><td></td><td></td><td></td><td></td><td></tr>" +
                                "<tr><td>Low-Grade...           </td><td>" + c.low + "  </td><td>" + p(c.low) + "   </td><td>Binding of...      </td><td>" + c.bind + "     </td><td>" + p(c.bind) + "</td><td></td><td></td><td></tr>" +
                                "<tr><td>...Cloth               </td><td>" + c.lc + "   </td><td>" + l(c.lc) + "    </td><td>...Slaughter       </td><td>" + c.sla + "      </td><td>" + b(c.sla) + "</td><td>...Surtr</td>             <td>" + c.sur + "</td><td>" + b(c.sur) + "</td></tr>" +
                                "<tr><td>...Leather             </td><td>" + c.ll + "   </td><td>" + l(c.ll) + "    </td><td>...Balance         </td><td>" + c.bal + "      </td><td>" + b(c.bal) + "</td><td>...Niflheim</td>          <td>" + c.nif + "</td><td>" + b(c.nif) + "</td></tr>" +
                                "<tr><td>...Metals              </td><td>" + c.lm + "   </td><td>" + l(c.lm) + "    </td><td>...Isaac           </td><td>" + c.isa + "      </td><td>" + b(c.isa) + "</td><td>...Mjolnir</td>           <td>" + c.mjo + "</td><td>" + b(c.mjo) + "</td></tr>" +
                                "<tr><td>...Wood                </td><td>" + c.lw + "   </td><td>" + l(c.lw) + "    </td><td>...Destruction     </td><td>" + c.des + "      </td><td>" + b(c.des) + "</td><td>...Freyr</td>             <td>" + c.fre + "</td><td>" + b(c.fre) + "</td></tr>" +
                                "<tr><td>Mid-Grade...           </td><td>" + c.mid + "  </td><td>" + p(c.mid) + "   </td><td>...Focus           </td><td>" + c.foc + "      </td><td>" + b(c.foc) + "</td><td>...Heimdall</td>          <td>" + c.hei + "</td><td>" + b(c.hei) + "</td></tr>" +
                                "<tr><td>...Cloth               </td><td>" + c.mc + "   </td><td>" + m(c.mc) + "    </td><td>...Friendship      </td><td>" + c.fri + "      </td><td>" + b(c.fri) + "</td><td>...Fenrir</td>            <td>" + c.fen + "</td><td>" + b(c.fen) + "</td></tr>" +
                                "<tr><td>...Leather             </td><td>" + c.ml + "   </td><td>" + m(c.ml) + "    </td><td>...Protection      </td><td>" + c.pro + "      </td><td>" + b(c.pro) + "</td><td>...the Fire-eater</td>    <td>" + c.eat + "</td><td>" + b(c.eat) + "</td></tr>" +
                                "<tr><td>...Metals              </td><td>" + c.mm + "   </td><td>" + m(c.mm) + "    </td><td>...the Fleet       </td><td>" + c.fle + "      </td><td>" + b(c.fle) + "</td><td>...the Frost-born</td>    <td>" + c.bor + "</td><td>" + b(c.bor) + "</td></tr>" +
                                "<tr><td>...Wood                </td><td>" + c.mw + "   </td><td>" + m(c.mw) + "    </td><td>...the Barrier     </td><td>" + c.bar + "      </td><td>" + b(c.bar) + "</td><td>...the Thunder-child</td> <td>" + c.chi + "</td><td>" + b(c.chi) + "</td></tr>" +
                                "<tr><td>High-Grade...          </td><td>" + c.high + " </td><td>" + p(c.high) + "  </td><td>...the Nimble      </td><td>" + c.num + "      </td><td>" + b(c.num) + "</td><td>...the Wind-waker</td>    <td>" + c.wak + "</td><td>" + b(c.wak) + "</td></tr>" +
                                "<tr><td>...Cloth               </td><td>" + c.hc + "   </td><td>" + h(c.hc) + "    </td><td>...the Elementalist</td><td>" + c.ele + "      </td><td>" + b(c.ele) + "</td><td>...the Thrice-blessed</td><td>" + c.ble + "</td><td>" + b(c.ble) + "</td></tr>" +
                                "<tr><td>...Leather             </td><td>" + c.hl + "   </td><td>" + h(c.hl) + "    </td><td>...the Heaven-sent </td><td>" + c.hea + "      </td><td>" + b(c.hea) + "</td><td>...the Spirit-ward</td>   <td>" + c.war + "</td><td>" + b(c.war) + "</td></tr>" +
                                "<tr><td>...Metals              </td><td>" + c.hm + "   </td><td>" + h(c.hm) + "    </td><td>...the Demon-fiend </td><td>" + c.dem + "      </td><td>" + b(c.dem) + "</td><td>...the Ox</td>            <td>" + c.ox + "</td><td>" + b(c.ox) + "</td></tr>" +
                                "<tr><td>...Wood                </td><td>" + c.hw + "   </td><td>" + h(c.hw) + "    </td><td>...the Curse-weaver</td><td>" + c.cur + "      </td><td>" + b(c.cur) + "</td><td>...the Raccoon</td>       <td>" + c.rac + "</td><td>" + b(c.rac) + "</td></tr>" +
                                "<tr><td>Crystallized Phazon    </td><td>" + c.cp + "   </td><td>" + p(c.cp) + "    </td><td>...the Earth-walker</td><td>" + c.ear + "      </td><td>" + b(c.ear) + "</td><td>...the Cheetah</td>       <td>" + c.che + "</td><td>" + b(c.che) + "</td></tr>" +
                                "<tr><td>Shade Fragment         </td><td>" + c.sf + "   </td><td>" + p(c.sf) + "    </td><td>...Dampening       </td><td>" + c.dam + "      </td><td>" + b(c.dam) + "</td><td>...the Turtle</td>        <td>" + c.tur + "</td><td>" + b(c.tur) + "</td></tr>" +
                                "<tr><td>Repurposed Actuator    </td><td>" + c.ra + "   </td><td>" + p(c.ra) + "    </td><td>...Stone-skin      </td><td>" + c.sto + "      </td><td>" + b(c.sto) + "</td><td>...the Fox</td>           <td>" + c.fox + "</td><td>" + b(c.fox) + "</td></tr>" +
                                "<tr><td>Defense Matrix Modulator</td><td>" + c.dmm + " </td><td>" + p(c.dmm) + "   </td><td>...Deflection      </td><td>" + c.def + "      </td><td>" + b(c.def) + "</td><td>...the Owl</td>           <td>" + c.owl + "</td><td>" + b(c.owl) + "</td></tr>" +
                                "<tr><td>                       </td><td>           </td><td>               </td><td>...Warding         </td><td>" + c.wardin + "   </td><td>" + b(c.wardin) + "</td><td>...Negation</td>       <td>" + c.neg + "</td><td>" + b(c.neg) + "</td></tr>" +
                                "</tbody></table>";
                            $i("logs").appendChild(table);
                        });
                        $m.but("Close", undefined, "big");
                    }, "imb", true);
                    $m.but("Cancel");
                }

                function butSetting() {
                    function createSelectTwo(descr, set) {
                        return "<div><label>" + descr + "</label><select par='" + set + "'>" +
                            "<option value='false'>No</option>" +
                            "<option " + ($tb.set[set] ? 'selected' : '') + " value='true'>Yes</option></select></div>";
                    }

                    function createSelectMore(descr, set, opt) {
                        var line = "";
                        for (var i = 0, len = opt.length; i < len; i++) {
                            if ($tb.set[set] === opt[i][0]) {
                                line += "<option selected value='" + opt[i][0] + "'>" + opt[i][1] + "</option>";
                            } else {
                                line += "<option value='" + opt[i][0] + "'>" + opt[i][1] + "</option>";
                            }
                        }
                        return "<div><label>" + descr + "</label><select par='" + set + "'>" + line + "</select></div>";
                    }

                    function createInput(descr, set) {
                        return "<div><label>" + descr + "</label><input par='" + set + "' type='text' value='" + $tb.set[set] + "' /></div>";
                    }

                    function createHighlight() {
                        var line = "";
                        for (var i = 0; i < 10; i++) {
                            line += "<div>" +
                                "<span>Things: </span><input type='text' id='setHigh" + i + "' value='" + $tb.set.hi[i] + "' />" +
                                "<span>color of text:</span><input type='text' id='setHigh" + i + "C' value='" + $tb.set.hic[i] + "' />" +
                                "<span>background:</span><input type='text' id='setHigh" + i + "B' value='" + $tb.set.hib[i] + "' />" +
                                "<span>color of text shadow:</span><input type='text' id='setHigh" + i + "S' value='" + $tb.set.his[i] + "' />" +
                                "</div>";
                        }
                        return line;
                    }

                    $m.show("<h3>Settings</h3>" +
                        "<div id='setting'>" +

                        "<h4>HVtoolBox</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("HVtoolBox's wide mode", "wide") +
                        createSelectTwo("Use drag'n'drop mechanism to move HVtoolBox", "drag") +
                        createSelectTwo("Remember the position of HVtoolBox", "pos") +
                        createInput("Number of requests per call <span style='color:red'>Do not <span style='font-weight:bold'>increase</span> that number if you unsure what you are doing</span>", "ajaxnum") +
                        createInput("Delay between each call (in ms) <span style='color:red'>Do not <span style='font-weight:bold'>decrease</span> that number if you unsure what you are doing</span>", "ajaxwait") +
                        createInput("Delay between attaching/coding/sending the moogleMail (in ms)", "ajaxmoogle") +
                        createSelectMore("HVtoolBox's action when task is done", "done", [
                            ["none", "Nothing"],
                            ["sound", "Play sound"],
                            ["reload", "Reload page"]
                        ]) +
                        createInput("Correct the align of checkboxes", "corcheck") +
                        "</div>" +
                        "<div class='c12'>" +
                        createInput("Buttons to be displayed on equipment pages", "butequip") +
                        createInput("Buttons to be displayed on item pages", "butitem") +
                        "</div>" +

                        "<h4>Pages with equipment</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Hide locked equipment on Bazaar page", "locked") +
                        createSelectTwo("Hide \'Sell all\' button on Bazaar page", "sellall") +
                        createSelectMore("Size of \'Label\' buttons", "rename", [
                            ["big", "Big"],
                            ["small", "Small"],
                            ["hover", "On hover"],
                            ["hide", "Hide"]
                        ]) +
                        createSelectTwo("Show current bazaar and approx. prices of salvaged materials", "showprice") +
                        createSelectTwo("Show PABs", "showpabs") +
                        createSelectTwo("Automatically send information to Jenga's database", "jenga") +
                        "</div>" +

                        "<h4>Pages with items</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Hide Figurines on Bazaar and Shrine pages", "figure") +
                        createSelectTwo("Hide obsolete and rare items on Bazaar and Shrine pages", "rare") +
                        "</div>" +

                        "<h4>Prices of materials</h4>" +
                        "<div class='c14'>" +
                        createInput("High-Grade Metal price", "sal0") +
                        createInput("Mid-Grade Metal price", "sal1") +
                        createInput("Low-Grade Metal price", "sal2") +
                        createInput("Scrap Metal price", "sal3") +
                        createInput("High-Grade Wood price", "sal4") +
                        createInput("Mid-Grade Wood price", "sal5") +
                        createInput("Low-Grade Wood price", "sal6") +
                        createInput("Scrap Wood price", "sal7") +
                        createInput("High-Grade Leather price", "sal8") +
                        createInput("Mid-Grade Leather price", "sal9") +
                        createInput("Low-Grade Leather price", "sal10") +
                        createInput("Scrap Leather price", "sal11") +
                        createInput("High-Grade Cloth price", "sal12") +
                        createInput("Mid-Grade Cloth price", "sal13") +
                        createInput("Low-Grade Cloth price", "sal14") +
                        createInput("Scrap Cloth price", "sal15") +
                        createInput("Energy Cell price", "sal16") +
                        "</div>" +

                        "<h4>Top</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Show inline difficulty changer", "inldif") +
                        createSelectTwo("Show inline set changer", "inlset") +
                        createSelectTwo("Show inline persona changer", "inlper") +
                        "</div>" +

                        "<h4>Bottom</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Show the number of credits on every page", "cred") +
                        createSelectTwo("Show equipment counters on every page", "equip") +
                        createSelectTwo("Show current lotteries' prizes on every page", "lotshow") +
                        "</div>" +
                        "<div class='c12'>" +
                        createInput("Show the lottery bar when these weapon are in Weapon Lottery", "lotweapon") +
                        createInput("Show the lottery bar when these weapon are in Armor Lottery", "lotarmor") +
                        "</div>" +

                        "<h4>MoogleMail</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Show COD for items according to your prices", "mmcod") +
                        createSelectTwo("Show Percentile Ranges's data for attached equipment", "mmpr") +
                        createSelectTwo("Do not display in-game alert/confirm messages", "mmalert") +
                        "</div>" +

                        "<h4>Percentile Ranges Script</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Original mode of displaying data (below the box)", "prold") +
                        createSelectTwo("Do not display alert messages when data is not found", "pralert") +
                        "</div>" +

                        "<h4>Misc</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Display all arenas on single page", "arena") +
                        createSelectTwo("Show time until next Random Encounter", "inlre") +
                        //createSelectTwo("Remind current difficulty, set, persona and title before entering arenas", "arenarem")+
                        "</div>" +

                        "<h4>Highlights</h4>" +
                        "<div class='c13'>" +
                        createSelectTwo("Overlaying of highlight", "hiover") +
                        "</div>" +

                        "<div class='high'>" +
                        createHighlight() +
                        "</div>" +

                        "<h4>Custom CSS</h4>" +
                        "<div class='css'>" +
                        "<textarea rows='15' cols='20' id='setCustomCss'>" + $tb.set.css + "</textarea>" +
                        "</div>" +

                        "<div class='end'>" +
                        "<div>" +
                        "<h4>Backup / Restore</h4>" +
                        "<div class='backup'>" +
                        "<div id='set_backup'>Backup local.storage</div>" +
                        "<label id='set_restore' for='set_file'>Restore local.storage</label>" +
                        "<input id='set_file' style='display:none' type='file'>" +
                        "</div>" +
                        "</div>" +
                        "<div class='set_info'>" +
                        "<div><span>Version: " + $tb.version + "</span> | Author: <a href='https://forums.e-hentai.org/index.php?showuser=1237490'>f4tal</a></div>" +
                        "<div>Item Manager Script by <a href='https://forums.e-hentai.org/index.php?showuser=304927'>holy_demon</a> | Percentile Range Script by <a href='https://forums.e-hentai.org/index.php?showuser=1647739'>Superlatanium</a></div>" +
                        "<div>Need help? Then visit <a href='https://forums.e-hentai.org/index.php?showtopic=209070'>that thread</a></span>" +
                        "</div>" +
                        "</div>", "big",
                        function() {
                            $i("set_backup").onclick = function() {
                                var a = $e("a", $i("setting"), { style: "display:none" });
                                a.download = "localStorage.json";
                                a.href = "data:application/octet-stream;base64," + $w.btoa(unescape(encodeURIComponent(JSON.stringify($lc))));
                                a.click();
                            };
                            $i("set_file").onchange = function() {
                                var file = this.files[0];
                                var read = new FileReader();
                                read.readAsText(file);
                                read.onloadend = function() {
                                    var data = JSON.parse(read.result);
                                    for (var key in data) {
                                        $lc[key] = data[key];
                                    }
                                    $r();
                                };
                            };
                        });

                    $m.but("Save", function() {
                        var array = $qa("select[par], input[par]", $i("setting"));
                        for (var i = 0, len = array.length; i < len; i++) {
                            var set = array[i].getAttribute("par");
                            var value = array[i].value.toLowerCase().replace(/\s+/, "");
                            if (set === "butequip" || set === "butitem") {
                                value = value.split(",");
                            }
                            $tb.set[set] = (value === "true" || value === "false") ? array[i].value === "true" : value;
                        }

                        $tb.set.hi = [];
                        $tb.set.hic = [];
                        $tb.set.hib = [];
                        $tb.set.his = [];
                        for (var ii = 0; ii < 10; ii++) {
                            $tb.set.hi.push($i("setHigh" + ii).value.replace(/\,(\s+)?/gi, "|"));
                            $tb.set.hic.push($i("setHigh" + ii + "C").value);
                            $tb.set.hib.push($i("setHigh" + ii + "B").value);
                            $tb.set.his.push($i("setHigh" + ii + "S").value);
                        }

                        $tb.set.css = $i("setCustomCss").value;
                        $tb.sync();
                        $r();
                    }, "big");
                    $m.but("Cancel", undefined, "big");
                }

                function butFilter(filter) {
                    $tb.templates.filter = filter;
                    var test = /([a-zA-Z\s\$]+)([><\=\-\!]{0,2})([^><\=\-\!\$\&\|\)\(]+)?/;
                    var testgi = new RegExp(test, "gi");
                    var testi = new RegExp(test, "i");
                    var filterNoSpace = filter.replace(/(\s+)?([\&\|\(\)\-\!\=\><])(\s+)?/gi, "$2");
                    for (var o in t.i) {
                        var temp = t.i[o];
                        var line = filterNoSpace.replace(testgi, function(arg) {
                            if (/\$/.test(arg)) {
                                var array = arg.match(testi);
                                var tag = array[1].replace("$", "");
                                var con = array[2];
                                var oper = array[3];
                                if (temp.hasOwnProperty(tag)) {
                                    var t = temp[tag];
                                    if (/[0-9]/.test(oper)) {
                                        if (con == "<=" || con == "=<") { return (t <= oper) ? true : false; } else if (con == ">=" || con == "=>") { return (t >= oper) ? true : false; } else if (con == "==" || con == "=") { return (t == oper) ? true : false; } else if (con == "!=" || con == "-") { return (t != oper) ? true : false; } else if (con == "<") { return (t < oper) ? true : false; } else if (con == ">") { return (t > oper) ? true : false; }
                                    } else {
                                        var par = new RegExp(oper, "i");
                                        if (con == "==" || con == "=") { return (par.test(t)) ? true : false; } else if (con == "!=" || con == "-") { return (par.test(t)) ? false : true; }
                                    }
                                }
                            } else {
                                var argR = new RegExp(arg, "i");
                                return (argR.test(temp.name)) ? true : false;
                            }
                        });
                        var answer = eval(line);
                        if (answer === false) {
                            temp.elem.classList.add("hidden");
                        } else {
                            temp.elem.classList.remove("hidden");
                        }
                        $tb.sync();
                    }
                }

                var imb = $e("div", $d.body, { id: "imb" });
                var imbD;
                if ($tb.set.drag) {
                    imbD = $e("div", imb, { html: "drag & drop", id: "imb_D" });
                }
                var imbF = $e("input", imb, { type: "search", id: "imb_F", name: "filter", place: "filter", value: $tb.templates.filter });

                imbF.oninput = function() {
                    imbF.style.cssText = "width: 20em";
                    butFilter(imbF.value);
                };
                imbF.onfocus = function() {
                    imbF.style.cssText = "width: 20em";
                    butFilter(imbF.value);
                };
                imbF.onblur = function() {
                    imbF.style.cssText = "";
                    butFilter(imbF.value);
                };
                imbF.addEventListener("keyup", function(e) { e.stopPropagation(); }, true);
                imbF.addEventListener("keydown", function(e) { e.stopPropagation(); }, true);
                imbF.addEventListener("keypress", function(e) { e.stopPropagation(); }, true);

                var imbBs = {},
                    imbBsMap = {
                        "moogle": { n: "Moogle", f: butMoogle },
                        "bazaar": { n: "Bazaar", f: butBazaar },
                        "salvage": { n: "Salvage", f: butSalvage },
                        "repair": { n: "Repair", f: butRepair },
                        "reforge": { n: "Reforge", f: butReforge },
                        "iw": { n: "Item World", f: butIW },
                        "unlock": { n: "(Un)lock", f: butLock },
                        "storage": { n: "Storage", f: butStorage },
                        "list": { n: "List", f: butList },
                        "shrine": { n: "Shrine", f: butShrine },
                        "": { n: "", f: butSetting },
                    };
                if (t.gr !== "none" && t.gr !== "moogle") {
                    imbBs["<div id='cntr'>Selected: 0</div>"] = butPreview;
                    var row = (t.gr === "equip") ? $tb.set.butequip : $tb.set.butitem;
                    for (var i = 0, len = row.length; i < len; i++) {
                        if (imbBsMap.hasOwnProperty(row[i])) {
                            imbBs[imbBsMap[row[i]].n] = imbBsMap[row[i]].f;
                        }
                    }
                }
                imbBs.Logs = butLog;
                imbBs.Settings = butSetting;
                for (var b in imbBs) {
                    var imbB = $e("button", $i("imb"), { html: b, name: b, type: "button" });
                    imbB.onclick = imbBs[b];
                }
                document.addEventListener("keydown", function(e) {
                    if (e.ctrlKey && e.keyCode === 70) {
                        e.preventDefault();
                        imbF.onfocus();
                    } else if (e.keyCode === 27) {
                        imbF.value = "";
                        for (var i in t.c) {
                            t.c[i].classList.remove("hidden");
                        }
                    } else if ((e.keyCode === 13 || e.keyCode === 32) && e.target.type === "button") {
                        e.target.click();
                    }
                }, true);
                document.addEventListener("contextmenu", function(e) {
                    if (e.button === 2 && (e.shiftKey || e.altKey || e.ctrlKey)) {
                        e.preventDefault();
                        imb.style.cssText = "left: " + e.clientX + "px; top : " + e.clientY + "px";
                        if ($tb.set.pos) {
                            $tb.set.posget[0] = e.clientX;
                            $tb.set.posget[1] = e.clientY;
                        }
                        $tb.sync();
                    }
                }, true);
                if (t.gr === "moogle") {
                    createStyles();
                } else {
                    createIMBall();
                }

                imb.ondragstart = function() { return false; };
                if (imbD) {
                    imbD.onmousedown = function(e) {
                        e.stopPropagation();
                        e.preventDefault();

                        function drag(e) {
                            imb.style.cssText = "left: " + e.clientX + "px; top : " + e.clientY + "px";
                        }
                        $d.addEventListener("mousemove", drag, true);
                        $d.onmouseup = function(e) {
                            if ($tb.set.pos) {
                                $tb.set.posget[0] = e.clientX;
                                $tb.set.posget[1] = e.clientY;
                            }
                            $tb.sync();
                            $d.removeEventListener("mousemove", drag, true);
                            $d.onmouseup = null;
                        };
                    };
                }
            }

            function createIMBall() {
                if (t.gr === "equip") {
                    if ($q(".equiplist")) {
                        if ($q(".equiplist").hasChildNodes()) {
                            $q(".equiplist").insertBefore($e("div", false, { class: "eqp", id: "equip_header" }), $q(".equiplist div:first-child"));
                        } else {
                            $e("div", $q(".equiplist"), { class: "eqp", id: "equip_header" });
                        }
                    }
                } else if (t.gr === "item") {
                    $e("thead", $q("table"), { html: "<tr><td></td><td></td><td id='tq'></td><td id='tw'></td><td id='te'></td></tr>" });
                }

                if ($tb.set.rename !== "hide" && t.gr === "equip") {
                    var rA = $e("button", $i("equip_header"), { type: "button", id: "rename_all", html: "show names", class: "equip_rename_all" });
                    rA.onclick = function() {
                        var inner = this.innerHTML;
                        for (var i = 0; i < t.cml; i++) {
                            var elemInner = $q("[onmouseover]", t.cm[i]);
                            var elemOuter = t.i[t.uidelem(elemInner)];
                            if (t.i[t.uidelem(elemInner)].myname !== "") {
                                elemInner.innerHTML = (inner === "show names") ? elemOuter.name : elemOuter.myname;
                            }
                        }
                        this.innerHTML = (inner === "show names") ? "show labels" : "show names";
                    };
                }

                var cbA = $e("input", (t.gr === "equip") ? $i("equip_header") : $i("tq"), { type: "checkbox", id: "checkbox_all", check: false, class: (t.gr === "equip") ? "equip_select_all" : "item_select_all" });
                cbA.onchange = function() {
                    for (var i = 0; i < t.cml; i++) {
                        var a = t.cm[i];
                        if (!a.classList.contains("hidden") && !a.classList.contains("hiddenIM")) {
                            $q("[func='check']", a).checked = this.checked;
                            $q("[func='check']", a).onchange();
                        }
                    }
                };

                if (t.gr === "item") {
                    var cnA = $e("input", $i("tw"), { type: "text", id: "count_all", value: "", place: "count all", class: (t.gr === "equip") ? "equip_count_all" : "item_count_all" });
                    cnA.oninput = function() {
                        for (var i = 0; i < t.cml; i++) {
                            var a = t.cm[i];
                            if (!a.classList.contains("hidden") && !a.classList.contains("hiddenIM")) {
                                $q("[func='count']", a).value = this.value;
                                $q("[func='count']", a).oninput();
                            }
                        }
                    };
                }

                var pA = $e("input", (t.gr === "equip") ? $i("equip_header") : $i("te"), { type: "text", id: "price_all", value: "", place: "price all", class: (t.gr === "equip") ? "equip_price_all" : "item_price_all" });
                pA.oninput = function() {
                    for (var i = 0; i < t.cml; i++) {
                        var a = t.cm[i];
                        if (!a.classList.contains("hidden") && !a.classList.contains("hiddenIM")) {
                            $q("[func='price']", a).value = this.value;
                            $q("[func='price']", a).oninput();
                        }
                    }
                };
                createIMBone();
            }

            function createIMBone() {
                for (var i = 0; i < t.cml; i++) {
                    var elem = t.cm[i];
                    var id = t.uidelem($q("[onmouseover]", elem));
                    var cnO, cbO, pO, rO;
                    if ($tb.set.rename !== "hide" && t.gr === "equip") {
                        rO = $e("button", elem, { func: "rename", type: "button", id: id, html: ($tb.set.rename === 'small') ? "L" : "label", class: "equip_rename_one" });
                        if ($tb.set.rename === 'small') { rO.classList.add("rensm"); } else if ($tb.set.rename === 'hover') { rO.classList.add("renho"); }

                        rO.onclick = function() {
                            var i = this.id;
                            var c = t.i[i];
                            var name = c.name;
                            var eleminner = c.elem;
                            var elemnamenew = $q(".equip_rename_this", eleminner);
                            if (!elemnamenew) {
                                $e("input", eleminner, { type: "text", id: i, value: $tb.names[i] || name, place: name, class: "equip_rename_this", html: "" });
                            } else {
                                t.i[this.id].setnames(elemnamenew.value);
                                t.i[this.id].elem.removeChild(elemnamenew);
                            }
                        };
                    }

                    cbO = $e("input", (t.gr === "equip") ? elem : $e("td", t.cm[i]), { func: "check", type: "checkbox", id: id, check: false, class: (t.gr === "equip") ? "equip_select_one" : "item_select_one" });
                    cbO.onchange = function() {
                        var countInput = $q("[placeholder='count']", t.i[this.id].elem);
                        if (this.checked) {
                            //countInput.value = t.i[this.id].count;
                            countInput.value = "1";
                        } else {
                            countInput.value = "";
                        }
                        countInput.oninput();
                    };

                    $q("[onmouseover]", elem).addEventListener("click", function() {
                        if (t.gr === "equip") {
                            $q(".equip_select_one", this.parentNode).click();
                        } else {
                            $q(".item_select_one", this.parentNode.parentNode).click();
                        }
                    }, true);

                    cnO = $e("input", (t.gr === "equip") ? elem : $e("td", t.cm[i]), { func: "count", type: "text", id: id, value: "", place: "count", class: (t.gr === "equip") ? "equip_count_one" : "item_count_one" });
                    cnO.oninput = function() {
                        t.i[this.id].setcount(+this.value);
                    };

                    pO = $e("input", (t.gr === "equip") ? elem : $e("td", t.cm[i]), { func: "price", type: "text", id: id, value: t.i[id].mypricea, place: "price", class: (t.gr === "equip") ? "equip_price_one" : "item_price_one" });
                    pO.oninput = function() {
                        t.i[this.id].setprices(this.value);
                    };

                    var l = $q("div:first-child", elem);
                    l.id = id;
                    l.addEventListener("click", function() {
                        var c = this.id;
                        t.i[c].locked = (t.i[c].locked === "true") ? t.i[c].locked = "false" : t.i[c].locked = "true";
                        t.i[c].setformpool(c);
                    }, true);

                }
                createStyles();
            }

            function createStyles() {
                $css(".eqp {display: flex; justify-content: flex-end; flex-wrap: wrap; align-items: flex-start; width: inherit; height: inherit; margin-bottom: .3em;}" +
                    ".il, .iu {margin: 0 5px 0 0; position: relative; top: 0;}" +
                    ".eqp>div[onmouseover] {margin-right: auto;}" +
                    ".eqp>div:last-child {position: relative !important; top: 0; left: 0;}" +
                    ".eqp button, .eqp input {margin: 0 3px; padding: 0 3px; font-size: .75rem !important; height: 18px;}" +

                    "#price_all, .equip_price_one, #count_all, .item_count_one, .item_price_one {width: 5em}" +

                    "#eqshop_outer, #eqinv_outer, #itemworld_outer, #forge_outer {margin: 0 0 0 10em;}" +
                    ".eqshop_pane:nth-child(1), .eqinv_pane:nth-child(1) {width: 620px;}" +
                    ".eqshop_pane:nth-child(1)>div:last-child, .eqinv_pane:nth-child(1)>div:last-child {width: " + $tb.set.corcheck + "px;}" +
                    ".eqshop_pane:nth-child(2), .eqinv_pane:nth-child(2) {width: 480px;}" +
                    ".eqshop_pane:nth-child(2)>div:last-child, .eqinv_pane:nth-child(2)>div:last-child {width: 480px;}" +

                    "#imb {position:fixed; display:block; border:1px solid #5C0D11; padding:.3em; background:inherit; width:" + ($tb.set.wide ? "19" : "9.5") + "em; top:" + $tb.set.posget[1] + "px; left:" + $tb.set.posget[0] + "px; z-index:10;}" +
                    "#imb button, #modal button {width:7.5em; padding:.2em; margin-top:.3em; cursor:pointer; z-index:inherit; font-weight:bold;}" +
                    "#imb_F {width:" + ($tb.set.wide ? '15' : '7.5') + "em; font-weight: bold; z-index: 700; position: relative;}" +
                    "#imb_D {padding: 0.2em; margin-bottom: 0.3em; cursor: move; font-weight: bold; font-size: .8em;}" +

                    "#modal {position:absolute; display:block; border:inherit; padding:1em; background:inherit; z-index:300; font-size:1rem;}" +
                    "#modal button {margin:.8em .6em 0 .6em;}" +
                    "#modal input:not([type='checkbox']), #modal select, #modal option, #modal textarea {color: black; border: 1px solid #5C0D11; background: white !important; font-size: .9rem; padding: .3em; font-family: inherit; width: 96%; margin: 0 .3em; box-sizing: border-box;}" +
                    "#modal h3, #modal h4 {margin:.3em 0 .7em 0;}" +
                    "#modal h3 {border-bottom: inherit;}" +
                    "#modal .modal_inner {max-height: 36em; overflow: auto;}" +
                    ".modal_imb .modal_inner {overflow: visible !important;}" +
                    ".modal_imb {width:22em; top:0; left:" + ($tb.set.wide ? "13.5" : "7") + "em;}" +
                    ".modal_big {width:70em; top: 4em; left: 2em;}" +
                    "#label_check {color: black;font-size: .9rem;font-family: inherit;margin: 0.5em .3em;}" +

                    "#shrine_outer, #itshop_outer {width: 1000px;}" +
                    "#shrine_left {width: 530px;}" +
                    "#shrine_right {width: 470px;}" +

                    "#item_left {width: 530px;}" +
                    "#item_right {width: 370px;}" +
                    "#item_slots > div {width: 180px;}" +

                    "#itshop_outer > div:nth-child(1) {width: 530px;}" +
                    "#itshop_outer > div:nth-child(2) {width: 470px;}" +
                    "#itshop_outer > div:nth-child(1) > div:last-child {width: 530px;}" +
                    "#itshop_outer > div:nth-child(2) > div:last-child {width: 470px;}" +

                    ".eqp .renho {display: none;}" +
                    ".eqp:hover .renho {display: inline-table;}" +
                    ".rensm {font-size: 10px; right: 14em;}" +
                    ".equip_rename_this {width: 20em; background: white !important; position: absolute; top: 0; margin: 0 auto 0 20px !important; left: 0;}" +

                    "#results td:nth-child(1), #results td:nth-child(5) {font-weight: bold; text-align: left;}" +
                    "#results td {padding: 0 2em; vertical-align: top;}" +
                    "#results thead th {padding-bottom: .5em;}" +
                    "#results td:last-child {text-align: left;}" +

                    "#butIW_modal {font-size: .9em !important; display: flex; justify-content: space-between;}" +
                    "#butIW_modal table {border: solid 1px #5C0D11; background: whitesmoke; padding: 0.1em; text-align: left;}" +
                    "#butIW_modal th {padding: .6em 0;text-align: center;border-bottom: 1px black solid;font-size: 1.1em;}" +

                    "#tagshelp {display: flex; justify-content: space-between;}" +
                    "#tagshelp > div {flex-basis: 49%;}" +
                    "#tagshelp > div > div > div:first-child {font-weight: bold;font-size: 1.2em;}" +
                    "#tagshelp > div > div > div {display: flex;justify-content: space-around;margin-bottom: .5em;}" +
                    "#tagshelp > div > div > div > span:first-child {flex-basis: 25%;text-align: right;font-weight: bold;}" +
                    "#tagshelp > div > div > div > span:last-child {flex-basis: 70%;text-align: left;}" +

                    "#logs {display: flex;text-align: left; flex-wrap: wrap;}" +
                    "#logs td, #logs th {padding: 0 1em; vertical-align: top;}" +
                    "#logs div {width: 30%; padding: 1em 0;}" +
                    "#logs tr:first-child th {height: 2em;}" +
                    ".art div {width: 100% !important;}" +

                    "#equipworth {background: #EDEBDF; left: 0; position: absolute; top: 648px; height: 19px; padding: 7px 5px 0 10px; border: 1px solid #5C0D12; border-left: none;}" +

                    "#setting {color: black; text-align: left; font-size: .8rem; width: 98%;}" +
                    "#setting h4 {text-align: center; font-size: .9rem; margin-top: 1em;}" +
                    "#setting > div {display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: flex-start;}" +
                    "#setting input:not([type='checkbox']), #setting select, #setting option, #setting textarea {padding: .2em; font-size: 1em;}" +

                    ".c14 > div, .c13 > div, .c12 > div {margin-right: auto; display: flex; align-items: flex-start; padding-bottom: .7em; justify-content: space-between;}" +
                    ".c13 > div {margin-right: 1em !important;}" +
                    ".c11 {flex-basis: 100%;}" +
                    ".c14 > div {flex-basis: 24%;}" +
                    ".c13 > div {flex-basis: 32%;}" +
                    ".c12 > div {flex-basis: 49%;}" +
                    ".c14 label {flex-basis: 68%;}" +
                    ".c14 div *:not(label) {flex-basis: 25%;} " +
                    ".c13 label {flex-basis: 68%;}" +
                    ".c13 div *:not(label) {flex-basis: 25%;} " +
                    ".c12 label {flex-basis: 45%;}" +
                    ".c12 div *:not(label) {flex-basis: 51%;}" +

                    ".high > div {align-items: center; display: flex; justify-content: space-around; flex-basis: 100%; padding-bottom: .7em;}" +
                    ".high > div > input, #setting .high > div > select {flex-basis: 16%;}" +
                    ".css textarea {width: 100% !important;}" +
                    ".end {margin-top: 1em; justify-content: space-between !important;}" +
                    ".end > div {flex-basis: 40%;}" +
                    ".end h4 {margin-top: 0 !important;}" +
                    ".backup {display: flex; justify-content: space-around}" +
                    ".set_info, #set_backup, #set_restore {border: 1px solid #5C0D11; border-radius: 5px; background: whitesmoke; padding: .8em;}" +
                    "#set_backup, #set_restore {cursor: pointer;}" +
                    ".set_info > div {padding-bottom: 1em;}" +
                    ".set_info span {font-weight: bold;}" +

                    ".pabs {width: 1.5em; text-align: center; display: inline-block; margin-left: .3em; border: black 1px solid; padding: .1em; color: initial; text-shadow: initial; background: initial; font-size: .6rem;}" +
                    ".pabs-outer {margin-right: .3em;}" +
                    ".pab-S {background: #FA8072;}" +
                    ".pab-D {background: #FFDEAD;}" +
                    ".pab-E {background: #FF69B4;}" +
                    ".pab-A {background: #9ACD32;}" +
                    ".pab-I {background: #E0FFFF;}" +
                    ".pab-W {background: #00CED1;}" +
                    ".hidden, .hiddenIM, .si, .equip_count_one {display:none; !important;}"
                );
                if ($l.indexOf("equip_slot=") > -1) {
                    $css("#eqch_left {width: 620px}" +
                        "#eqch_left {margin: 0 0 0 10em}" +
                        "#eqch_stats {float: right}" +
                        "#compare_pane {left:55em}");
                }
                if (t.gr === "item") {
                    $css(".se {display: none;}" +
                        ".si {display: block;}");
                }

                var customStyles = "",
                    shadow;
                for (var i = 0; i < 10; i++) {
                    shadow = ($tb.set.his[i]) ? "text-shadow: 1px 1px 1px " + $tb.set.his[i] : "";
                    customStyles += ".styleHigh" + [i] + " {color: " + $tb.set.hic[i] + "; background: " + $tb.set.hib[i] + "; " + shadow + "}";
                }
                $css(customStyles);
                $css($tb.set.css);
                createEXTRAS();
            }
            createIMBbuttons();
        }

        function createEXTRAS() {
            var sa = $q("img[src$='sellall.png']");
            if ($tb.set.sellall && sa) {
                $i("eqshop_sellall").removeChild(sa);
            }
            if ($tb.set.inlre) {
                var wrapper_re = $e("button", $i("imb"), { id: "counter_re" });
                wrapper_re.textContent = "RE: ";
                setInterval(function() {
                    var dif = $tb.lastRE - Date.now();
                    var min = Math.floor(dif / 60000);
                    var sec = Math.floor(dif / 1000 % 60);
                    if (dif > 0) {
                        wrapper_re.textContent = "RE: " + min + ":" + ((sec < 10) ? '0' : '') + sec;
                    } else {
                        wrapper_re.textContent = "RE: READY";
                        wrapper_re.style.cssText = "color: red";
                    }
                }, 1000);
                wrapper_re.onclick = function() {
                    wrapper_re.style.cssText = "";
                    $tb.lastRE = Date.now() + 1830000;
                    $tb.sync();
                    $d.location.href = "https://e-hentai.org/news.php";
                };
            }
            if ($tb.set.inldif || $tb.set.inlset || $tb.set.inlper) {
                $css("#set_change_wrapper > div > div > div, #per_change_wrapper > div > div > div {text-decoration: underline; cursor: pointer;}" +
                    "#navbar>div {float: none; width: 0; height: 0; margin-left: 0;}" +
                    "#navbar {display: flex;}" +
                    "#navbar>div:nth-child(1), #navbar>div:nth-child(2), #navbar>div:nth-child(3), #navbar>div:nth-child(4) {flex-basis: 12%;}" +
                    "#navbar>div:nth-child(5) {flex-basis: 8%}" +
                    "#navbar>div:nth-child(6) {flex-basis: 14%;}" +
                    "#nav_mail {flex-basis: 5%;}" +
                    "#dif_change_wrapper {flex-basis: 9%;}" +
                    "#set_change_wrapper {flex-basis: 5%;}" +
                    "#per_change_wrapper {flex-basis: 15%;}" +
                    "#level_details {left: 700px !important;}" +
                    ".inline_change {position: relative;z-index: 70000}" +
                    ".inline_change select {width: 100%;background: white}" +
                    ".inline_change option {color: black; margin: 0;border: none;font-size: 0.8rem;background: white}" +
                    ".inline_change option:hover {background: lightgrey}");
                $i("level_readout").parentNode.id = "dif_change_wrapper";

                if ($tb.set.inldif) {
                    $css("#dif_change_wrapper > div > div > div {text-decoration: underline; cursor: pointer;}");
                    $i("dif_change_wrapper").onclick = function() {
                        if (!$i("dif_change_inner")) {
                            var mapDif = [
                                { n: "Normal", v: "1ch" },
                                { n: "Hard", v: "2ch" },
                                { n: "Nightmare", v: "3ch" },
                                { n: "Hell", v: "4ch" },
                                { n: "Nintendo", v: "5ch" },
                                { n: "IWBTH", v: "6ch" },
                                { n: "PFUDOR", v: "7ch" }
                            ];
                            var textDif = "";
                            for (var i = 0, len = mapDif.length; i < len; i++) {
                                textDif += "<option value='" + mapDif[i].v + "'>" + mapDif[i].n + "</option>";
                            }
                            $e("div", $i("dif_change_wrapper"), { class: "inline_change", id: "dif_change_inner", html: "<select id='dif_change' size='7'>" + textDif + "<select>" });

                            $i("dif_change").onchange = function() {
                                var difnew = this.value;
                                $q("#level_readout div div").textContent = "Wait...";
                                $f("?s=Character&ss=se", function(r) {
                                    $q("[value='" + difnew + "']", r).click();
                                    $q("[type='submit']", r).click();
                                }, true);
                            };
                        } else {
                            $i("dif_change_wrapper").removeChild($i("dif_change_inner"));
                        }
                    };
                }
                if ($tb.set.inlset) {
                    $g("?s=Character&ss=eq", function(r) {
                        var setcur = $qa("#eqsl [src]", r);
                        var text = "";
                        for (var i = 0; i < setcur.length; i++) {
                            var match = setcur[i].src.match(/set(\d+)_(on|off)/);
                            if (match[2] === "on") {
                                var htmlof = "<div style='padding: 5px 2px 0 0'><div class='fc4 far fcb'><div>Set: " + match[1] + "</div></div></div>";
                                if (!$i("per_change_wrapper")) {
                                    $e("div", $i("navbar"), { html: htmlof, id: "set_change_wrapper" });
                                } else {
                                    var a = $e("div", false, { html: htmlof, id: "set_change_wrapper" });
                                    $i("navbar").insertBefore(a, $i("per_change_wrapper"));
                                }
                            }
                            text += "<option value='" + match[1] + "'>Set " + match[1] + "</option>";
                        }
                        $i("set_change_wrapper").onclick = function() {
                            if (!$i("set_change_inner")) {
                                $e("div", $i("set_change_wrapper"), { class: "inline_change", id: "set_change_inner", html: "<select id='set_change' size='" + setcur.length + "'>" + text + "<select>" });
                                $i("set_change").onchange = function() {
                                    var setnew = this.value;
                                    $q("#set_change_wrapper div div div").textContent = "Wait...";
                                    $f("?s=Character&ss=eq", function(r) {
                                        $q("#eqsl [src^='/y/equip/set" + setnew + "']", r).click();
                                    }, true);
                                };
                            } else {
                                $i("set_change_wrapper").removeChild($i("set_change_inner"));
                            }
                        };
                    });
                }
                if ($tb.set.inlper) {
                    $g("?s=Character&ss=ch", function(r) {
                        var percur = $qa("[name='persona_set'] option", r);
                        var text = "";
                        for (var i = 0; i < percur.length; i++) {
                            if (percur[i].hasAttribute("selected")) {
                                $e("div", $i("navbar"), { html: "<div style='padding: 5px 2px 0 0'><div class='fc4 far fcb'><div>Persona: " + percur[i].textContent + "</div></div></div>", id: "per_change_wrapper" });
                            }
                            text += percur[i].outerHTML;
                        }
                        $i("per_change_wrapper").onclick = function() {
                            if (!$i("per_change_inner")) {
                                $e("div", $i("per_change_wrapper"), { class: "inline_change", id: "per_change_inner", html: "<select id='per_change' size='" + percur.length + "'>" + text + "<select>" });
                                $i("per_change").onchange = function() {
                                    var pernew = this.value;
                                    $q("#per_change_wrapper div div div").textContent = "Wait...";
                                    $f("?s=Character&ss=ch", function(r) {
                                        $q("[name='persona_set']", r).value = pernew;
                                        $q("[name='persona_set']", r).onchange();
                                    }, true);
                                };
                            } else {
                                $i("per_change_wrapper").removeChild($i("per_change_inner"));
                            }
                        };
                    });
                }

            }

            if (!$i("networth") && $tb.set.cred) {
                $g("/?s=Bazaar&ss=mm&filter=new", function(r) {
                    $e("div", $i("mainpane"), { id: "networth", style: "width: 148px", html: "<div class='fc4 fal fcb' style='width:138px'><div>Credits: " + $q("#mmail_attachcredits", r).textContent.match(/(\d[\d,]+)\sC/)[1] + "</div></div>" });
                });
            }

            if ($tb.set.equip && !$i("eqinv_bot")) {
                $g("/?s=Character&ss=in", function(r) {
                    $e("div", $i("mainpane"), { id: "equipworth", html: "<div class='fc4 fal fcb'><div>" + $q("#eqinv_bot div", r).textContent + "</div></div>" });
                });
            }

            if ($tb.set.lotshow) {
                $css("#lottery_inline {font-size: 10pt;text-align: left;background: #EDEBDF;width: 50%;}" +
                    "#lottery_inline div {border: solid 1px #5C0D11; border-top: none; padding: 7px 0 4px 10px; display: flex;justify-content: flex-start;}" +
                    "#lottery_inline div span:nth-child(1) {flex-basis: 16%;}" +
                    "#lottery_inline div span:nth-child(2) {flex-basis: 52%;}" +
                    "#lottery_inline div span {margin-right: 1em;}"
                );
                var createDiv = function(type) {
                    var name, tickets, array, regex, url, pool;
                    if (type === "Weapon") {
                        url = "/?s=Bazaar&ss=lt";
                        pool = $tb.set.lotweapon;
                    } else {
                        url = "/?s=Bazaar&ss=la";
                        pool = $tb.set.lotarmor;
                    }

                    function createLine() {
                        $i("lottery_inline").innerHTML += "<div><span><a href=" + $url + "/" + url + ">" + type + " Lottery:</a></span><span>" + name + "</span><span>Tickets: " + tickets[0] + " out of " + tickets[1] + "</span></div>";
                    }
                    $g(url, function(r) {
                        name = $i("lottery_eqname", r).textContent;
                        tickets = $i("rightpane", r).children[4].textContent.match(/\d+/gi);
                        if (typeof pool !== "undefined" && pool !== "") {
                            array = pool.split(/\s*[,;]+\s*/);
                            for (var i = 0, len = array.length; i < len; i++) {
                                regex = new RegExp(array[i], "i");
                                if (regex.test(name)) {
                                    createLine();
                                    break;
                                }
                            }
                        } else {
                            createLine();
                        }
                    });
                };
                $e("div", $d.body, { id: "lottery_inline" });
                createDiv("Weapon");
                createDiv("Armor");
            }

            if (t.gr === "equip") {
                for (var i = 0; i < t.cl; i++) {
                    var elem = t.c[i];
                    var id = t.uidelem($q("[onmouseover]", elem));
                    if ($tb.set.showpabs) {
                        if ($tb.set.rename !== "hide") {
                            elem.insertBefore($e("div", false, { class: "pabs-outer" }), $qa(".equip_rename_one")[i]);
                        } else {
                            elem.insertBefore($e("div", false, { class: "pabs-outer" }), $qa(".equip_select_one")[i]);
                        }
                        var pabs = t.i[id].pab;
                        var map = [{ n: "Strength", a: "S" }, { n: "Dexterity", a: "D" }, { n: "Agility", a: "A" }, { n: "Endurance", a: "E" }, { n: "Intelligence", a: "I" }, { n: "Wisdom", a: "W" }];
                        for (var p = 0; p < 6; p++) {
                            if (pabs.indexOf(map[p].n) !== -1) {
                                $e("div", $qa(".pabs-outer")[i], { class: "pabs pab-" + map[p].a + "", html: map[p].a });
                            }
                        }
                    }

                    if ($tb.set.showprice) {
                        var text;
                        var pb = t.i[id].price;
                        var ps = t.i[id].prices;
                        if ($l.indexOf("Bazaar&ss=es") > -1) {
                            $css(".eqp {border-bottom: 1px solid lightgrey; margin-bottom: .5em;}");
                            text = (pb > ps) ? "<span style='color: brown;'>Bazaar price : " + t.i[id].price + "</span>  /  <span style='color: grey;'>Salvage price : " + t.i[id].prices + "</span>" : "<span style='color: grey;'>Bazaar price : " + t.i[id].price + "</span>  /  <span  style='color: brown;'>Salvage price : " + t.i[id].prices + "</span>";
                        }
                        $e("div", elem, { html: text, class: "c11" });
                    }

                    if ($tb.set.locked && $q("div:first-child", elem).classList.contains("il") && $l.indexOf("?s=Bazaar&ss=es") !== -1) {
                        elem.classList.add("hiddenIM");
                    }
                }
            }

            if (t.gr === "item") {
                for (var ii = 0; ii < t.cl; ii++) {
                    var elemi = t.c[ii];
                    if ($tb.set.figure && elemi.textContent.indexOf("igurin") > -1 && $l.indexOf("Character&ss=it") === -1) {
                        elemi.classList.add("hiddenIM");
                    }
                    if ($tb.set.rare && t.i[t.uidelem($q("[onmouseover]", elemi))].obsolete === "true" && $l.indexOf("Character&ss=it") === -1) {
                        elemi.classList.add("hiddenIM");
                    }
                }
            }

            if ($i("mmail_attachpanes")) {
                if ($tb.set.mmalert) {
                    window.confirm = function(arg) { return true; };
                }

                if ($tb.set.mmcod || $tb.set.mmpr) {
                    var cur, attachText;
                    $css("#mmail_attachlist > div {display: flex;}" +
                        "#mmail_attachlist > div > div:first-child {padding: 0;margin: 0;}" +
                        ".moogle_price, .moogle_pr {flex-basis: 35%}" +
                        "#mmail_attachlist>div>div:last-child {margin: 0; height: initial;padding: 0;}");
                    var attachs = $qa("div[onmouseover]"),
                        totalCod = 0;
                    var lenm = attachs.length;
                    if ($tb.set.mmcod) {
                        for (var ia = 0; ia < lenm; ia++) {
                            cur = attachs[ia];
                            attachText = cur.textContent;
                            if (attachText.match(/\d+/gi) === null) {
                                continue;
                            } else {
                                var codcur = Math.ceil((+attachText.match(/\d+/gi)[0] * +t.uprcon($tb.prices[cur.getAttribute("onmouseover").match(/\d{4,99}/gi)[0]]))) || 0;
                                totalCod += codcur;
                                $e("div", cur.parentNode.parentNode, { class: "moogle_price", html: codcur });
                            }
                        }
                        totalCod = totalCod.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $e("div", $i("mmail_attachinfo"), { style: "text-align: center; padding-top: 1em", html: "According to your prices, COD should be " + totalCod + " credits" });
                    }
                    if ($tb.set.mmpr) {
                        var dy = dynjs_eqstore;
                        for (var ib = 0; ib < lenm; ib++) {
                            cur = attachs[ib];
                            attachText = cur.textContent;
                            for (var pr in dy) {
                                if (dy[pr].t === attachText) {
                                    var curID = cur.getAttribute("onmouseover").match(/\d+/)[0];
                                    $g("/equip/" + curID + "/" + dy[pr].k, function(r) {
                                        var thisID = "e" + r.documentURI.match(/\d+/);
                                        parseEquip(r.body, {}, function(item) {
                                            $e("div", $i(thisID).parentNode.parentNode, { class: "moogle_pr", html: item.info + item.badinfo });
                                        });
                                    });
                                }
                            }
                        }
                    }
                }
            }

            if ($i("arena_pages")) {
                if ($tb.set.arena) {
                    $g("/?s=Battle&ss=ar&page=2", function(r) {
                        var div = document.createElement("div");
                        div.style.cssText = "display: flex;";
                        $i("mainpane").insertBefore(div, $i("initform"));
                        div.appendChild($i("arena_list"));
                        div.appendChild($i("arena_list", r));
                        $css("#arena_list {margin: 20px auto 0;border-collapse: collapse;flex-basis: 45%;width: 44%;");
                        $i("mainpane").removeChild($i("arena_pages"));
                    });
                }
            }

            if ($i("monster_outer")) {
                var mes = $qa("#messagebox .fc2");
                if (mes.length > 0) {
                    for (var g = 0; g < mes.length; g++) {
                        if (/Received/gi.test(mes[g].textContent)) {
                            $tb.mon.gift += 1;
                            var a = mes[g].textContent;
                            if (/Binding/i.test(a)) {
                                $tb.mon.bind += 1;
                                if (/Slaughter/i.test(a)) { $tb.mon.sla += 1; } else if (/Balance/i.test(a)) { $tb.mon.bal += 1; } else if (/Isaac/i.test(a)) { $tb.mon.isa += 1; } else if (/Destruction/i.test(a)) { $tb.mon.des += 1; } else if (/Focus/i.test(a)) { $tb.mon.foc += 1; } else if (/Friendship/i.test(a)) { $tb.mon.fri += 1; } else if (/Protection/i.test(a)) { $tb.mon.pro += 1; } else if (/Fleet/i.test(a)) { $tb.mon.fle += 1; } else if (/Barrier/i.test(a)) { $tb.mon.bar += 1; } else if (/Nimble/i.test(a)) { $tb.mon.num += 1; } else if (/Elementalist/i.test(a)) { $tb.mon.ele += 1; } else if (/Heaven/i.test(a)) { $tb.mon.hea += 1; } else if (/Demon/i.test(a)) { $tb.mon.dem += 1; } else if (/Curse/i.test(a)) { $tb.mon.cur += 1; } else if (/Earth/i.test(a)) { $tb.mon.ear += 1; } else if (/Surtr/i.test(a)) { $tb.mon.sur += 1; } else if (/Niflheim/i.test(a)) { $tb.mon.nif += 1; } else if (/Mjolnir/i.test(a)) { $tb.mon.mjo += 1; } else if (/Freyr/i.test(a)) { $tb.mon.fre += 1; } else if (/Heimdall/i.test(a)) { $tb.mon.hei += 1; } else if (/Fenrir/i.test(a)) { $tb.mon.fen += 1; } else if (/Dampening/i.test(a)) { $tb.mon.dam += 1; } else if (/Stone/i.test(a)) { $tb.mon.sto += 1; } else if (/Deflection/i.test(a)) { $tb.mon.def += 1; } else if (/eater/i.test(a)) { $tb.mon.eat += 1; } else if (/born/i.test(a)) { $tb.mon.bor += 1; } else if (/child/i.test(a)) { $tb.mon.chi += 1; } else if (/waker/i.test(a)) { $tb.mon.wak += 1; } else if (/blessed/i.test(a)) { $tb.mon.ble += 1; } else if (/ward/i.test(a)) { $tb.mon.war += 1; } else if (/Raccoon/i.test(a)) { $tb.mon.rac += 1; } else if (/Cheetah/i.test(a)) { $tb.mon.che += 1; } else if (/Turtle/i.test(a)) { $tb.mon.tur += 1; } else if (/Fox/i.test(a)) { $tb.mon.fox += 1; } else if (/Ox/i.test(a)) { $tb.mon.ox += 1; } else if (/Owl/i.test(a)) { $tb.mon.owl += 1; } else if (/Warding/i.test(a)) { $tb.mon.wardin += 1; } else if (/Negation/i.test(a)) { $tb.mon.neg += 1; }
                            }
                            if (/Phazon/i.test(a)) { $tb.mon.cp += 1; }
                            if (/Shade/i.test(a)) { $tb.mon.sf += 1; }
                            if (/Actuator/i.test(a)) { $tb.mon.ra += 1; }
                            if (/Modulator/i.test(a)) { $tb.mon.dmm += 1; }
                            if (/Low/i.test(a)) {
                                $tb.mon.low += 1;
                                if (/Cloth/i.test(a)) { $tb.mon.lc += 1; } else if (/Leather/i.test(a)) { $tb.mon.ll += 1; } else if (/Metal/i.test(a)) { $tb.mon.lm += 1; } else if (/Wood/i.test(a)) { $tb.mon.lw += 1; }
                            }
                            if (/Mid/i.test(a)) {
                                $tb.mon.mid += 1;
                                if (/Cloth/i.test(a)) { $tb.mon.mc += 1; } else if (/Leather/i.test(a)) { $tb.mon.ml += 1; } else if (/Metal/i.test(a)) { $tb.mon.mm += 1; } else if (/Wood/i.test(a)) { $tb.mon.mw += 1; }
                            }
                            if (/High/i.test(a)) {
                                $tb.mon.high += 1;
                                if (/Cloth/i.test(a)) { $tb.mon.hc += 1; } else if (/Leather/i.test(a)) { $tb.mon.hl += 1; } else if (/Metal/i.test(a)) { $tb.mon.hm += 1; } else if (/Wood/i.test(a)) { $tb.mon.hw += 1; }
                            }
                        }
                    }
                }
                $tb.sync();
            }

        }
    }
    if ($i("showequip")) {
        parseEquip(document.body, {}, function(item) {
            if ($tb.set.prold) {
                $e("div", $d.body, { html: "<br>" + item.info + (item.badinfo ? ' ' + item.badinfo : '') });
            } else {
                $css("#equip_extended > div:last-child, #equip_extended > div:nth-child(2) {margin: 7px auto 2px; text-align: center;}" +
                    "#equip_extended > div:nth-child(2) > div {font-weight: bold;}");
                $e("div", $i("equip_extended"), { style: "block", id: "info", html: "<div style='margin: 7px auto 2px; text-align: center;'>Percentile Ranges\'s information: </div><p>" + item.info + (item.badinfo ? ' ' + item.badinfo : '') + "</p>" });
                var s = false;
                var f = $e("button", $i("showequip"));
                f.innerHTML = "Expand Box";
                f.onclick = function() {
                    if (!s) {
                        $i("equip_extended").style.cssText = "height: 500px !important";
                        s = true;
                        f.innerHTML = "Reduce Box";
                    } else {
                        $i("equip_extended").style.cssText = "";
                        s = false;
                        f.innerHTML = "Expand Box";
                    }
                };
            }
        });
    } else if (!$i("riddlemaster") && !$i("textlog")) {
        itemManager();
    }

    function parseEquip(data, item, done) {
        if ($tb.set.pralert) { $w.alert = function(e) { return true; }; }
        var ranges = [
            ['ADB', 67.72, 75.92, ['axe', 'slaughter']],
            ['ADB', 53.39, 59.87, ['axe'],
                ['slaughter']
            ],
            ['ADB', 59.02, 67.72, ['club', 'slaughter']],
            ['ADB', 46.12, 53.04, ['club'],
                ['slaughter']
            ],
            ['Parry', 8.13, 9.04, ['club', 'nimble']],
            ['PCrit Chc', 8.85, 10.41, ['club', 'balance']],
            ['ADB', 44.08, 51.33, ['rapier', 'slaughter']],
            ['ADB', 33.65, 39.38, ['rapier'],
                ['slaughter']
            ],
            ['Parry', 23.64, 26.94, ['rapier', 'nimble']],
            ['Parry', 16.29, 18.89, ['rapier'],
                ['nimble']
            ],
            ['PCrit Chc', 8.85, 10.41, ['rapier', 'balance']],
            ['ADB', 53.22, 61.58, ['shortsword', 'slaughter']],
            ['ADB', 41.25, 47.92, ['shortsword'],
                ['slaughter']
            ],
            ['Parry', 16.29, 18.89, ['shortsword']],
            ['PCrit Chc', 8.85, 10.41, ['shortsword', 'balance']],
            ['AS', 5.68, 6.54, ['shortsword', 'swiftness']],
            ['ADB', 40.25, 46.21, ['wakizashi', 'slaughter']],
            ['ADB', 30.49, 35.11, ['wakizashi'],
                ['slaughter']
            ],
            ['Parry', 27.31, 30.53, ['wakizashi', 'nimble']],
            ['Parry', 19.97, 22.48, ['wakizashi'],
                ['nimble']
            ],
            ['PCrit Chc', 8.85, 10.41, ['wakizashi', 'balance']],
            ['AS', 15.88, 18.57, ['wakizashi', 'swiftness']],

            ['ADB', 73.01, 82.07, ['estoc', 'slaughter']],
            ['ADB', 57.83, 64.99, ['estoc'],
                ['slaughter']
            ],
            ['PCrit Chc', 11.98, 13.56, ['estoc', 'balance']],
            ['ADB', 86.35, 98.47, ['longsword', 'slaughter']],
            ['ADB', 68.92, 78.66, ['longsword'],
                ['slaughter']
            ],
            ['PCrit Chc', 12.56, 14.19, ['longsword', 'balance']],
            ['ADB', 73.02, 82.07, ['mace', 'slaughter']],
            ['ADB', 57.82, 64.99, ['mace'],
                ['slaughter']
            ],
            ['PCrit Chc', 11.98, 13.59, ['mace', 'balance']],
            ['ADB', 72.50, 82.07, ['katana', 'slaughter']],
            ['ADB', 57.38, 64.99, ['katana'],
                ['slaughter']
            ],
            ['PCrit Chc', 12.56, 14.19, ['katana', 'balance']],

            ['MDB', 45.85, 52.2, ['katalox', 'destruction']],
            ['MDB', 28.09, 32.4, ['katalox'],
                ['destruction']
            ],
            ['MDB', 45.08, 51.71, ['redwood', 'destruction']],
            ['MDB', 27.76, 31.99, ['redwood'],
                ['destruction']
            ],
            ['MDB', 44.93, 51.71, ['willow', 'destruction']],
            ['MDB', 27.76, 31.99, ['willow'],
                ['destruction']
            ],
            ['MDB', 27.76, 31.99, ['oak']],

            ['EDB', 33.84, 36.91, ['hallowed katalox', 'heimdall']],
            ['EDB', 19.27, 21.77, ['hallowed katalox'],
                ['heimdall']
            ],
            ['EDB', 34.07, 36.52, ['demonic katalox', 'fenrir']],
            ['EDB', 18.97, 21.77, ['demonic katalox'],
                ['fenrir']
            ],
            ['DProf', 14.41, 16.24, ['hallowed katalox', 'heaven-sent']],
            ['DProf', 7.10, 8.29, ['hallowed katalox'],
                ['heaven-sent']
            ],
            ['FProf', 14.41, 16.24, ['demonic katalox', 'demon-fiend']],
            ['FProf', 7.10, 8.29, ['demonic katalox'],
                ['demon-fiend']
            ],

            ['EDB', 37.70, 42.68, ['hallowed oak', 'heimdall']],
            ['EDB', 23.00, 26.60, ['hallowed oak'],
                ['heimdall']
            ],
            ['DProf', 5.58, 6.45, ['hallowed oak']],
            ['EProf', 5.57, 6.45, ['fiery oak']],
            ['EProf', 5.57, 6.45, ['arctic oak']],

            ['EDB', 34.18, 37.32, ['tempestuous redwood', 'freyr']],
            ['EDB', 18.98, 21.78, ['tempestuous redwood'],
                ['freyr']
            ],
            ['EDB', 34.42, 37.85, ['shocking redwood', 'mjolnir']],
            ['EDB', 18.97, 21.78, ['shocking redwood'],
                ['mjolnir']
            ],
            ['EDB', 33.52, 37.85, ['arctic redwood', 'niflheim']],
            ['EDB', 19.22, 21.77, ['arctic redwood'],
                ['niflheim']
            ],
            ['EDB', 34.44, 37.4, ['fiery redwood', 'surtr']],
            ['EDB', 18.87, 21.77, ['fiery redwood'],
                ['surtr']
            ],
            ['EProf', 14.60, 16.24, ['redwood', 'elementalist']],
            ['EProf', 7.19, 8.29, ['redwood'],
                ['elementalist']
            ],

            ['EDB', 16.33, 18.56, ['tempestuous willow']],
            ['EDB', 16.47, 18.56, ['shocking willow']],
            ['EDB', 22.92, 26.60, ['demonic willow']],
            ['EDB', 10.20, 11.33, ['fiery willow']],
            ['EDB', 10.20, 11.33, ['arctic willow']],
            ['EDB', 10.20, 11.33, ['hallowed willow']],
            ['EProf', 5.26, 6.15, ['tempestuous willow']],
            ['EProf', 5.26, 6.15, ['shocking willow']],
            ['FProf', 5.26, 6.15, ['demonic willow']],
            ['EProf', 5.26, 6.15, ['fiery willow']],
            ['EProf', 5.26, 6.15, ['arctic willow']],

            // ['Int', 6.11, 7.22, ['katalox']],
            // ['Wis', 4.13, 4.82, ['katalox']],
            // ['Int', 5.46, 6.33, ['redwood']],
            // ['Wis', 5.46, 6.33, ['redwood']],
            // ['Int', 4.13, 4.83, ['willow']],
            // ['Wis', 6.12, 7.23, ['willow']],
            // ['Int', 4.14, 4.83, ['oak']],
            // ['Wis', 6.12, 7.23, ['oak']],

            ['BLK', 33.55, 37.52, ['buckler', 'barrier']],
            ['BLK', 27.64, 31.03, ['buckler'],
                ['barrier']
            ],
            ['Parry', 8.15, 9.04, ['buckler', 'nimble']],
            ['BLK', 32.63, 36.02, ['kite']],
            ['BLK', 35.63, 38.52, [' force']],

            ['EDB', 15.12, 16.97, ['phase cap']],
            // ['Int', 6.00, 7.08, ['phase cap']],
            // ['Wis', 6.00, 7.08, ['phase cap']],
            // ['Agi', 5.07, 6.03, ['phase cap']],
            ['Evd', 4.7, 5.28, ['phase cap']],
            // ['PMit', 3.01, 3.38, ['phase cap']],
            ['CS', 2.99, 3.47, ['phase cap', 'charged']],
            ['MDB', 3.68, 4.23, ['phase cap', 'radiant']],
            ['MCrit Dmg', 3.49, 3.90, ['phase cap', 'mystic']],
            ['Mana C', 3.31, 3.61, ['phase cap', 'frugal']],

            ['EDB', 18.02, 20.18, ['phase robe']],
            // ['Int', 7.14, 8.43, ['phase robe']],
            // ['Wis', 7.14, 8.43, ['phase robe']],
            // ['Agi', 6.03, 7.17, ['phase robe']],
            ['Evd', 5.60, 6.28, ['phase robe']],
            // ['PMit', 3.57, 4.01, ['phase robe']],
            ['CS', 3.48, 4.06, ['phase robe', 'charged']],
            ['MDB', 4.25, 4.90, ['phase robe', 'radiant']],
            ['MCrit Dmg', 4.16, 4.61, ['phase robe', 'mystic']],
            ['Mana C', 3.61, 4.11, ['phase robe', 'frugal']],

            ['EDB', 13.66, 15.36, ['phase gloves']],
            // ['Int', 5.43, 6.42, ['phase gloves']],
            // ['Wis', 5.43, 6.42, ['phase gloves']],
            // ['Agi', 4.59, 5.46, ['phase gloves']],
            ['Evd', 4.25, 4.78, ['phase gloves']],
            // ['PMit', 2.73, 3.07, ['phase gloves']],
            ['CS', 2.75, 3.18, ['phase gloves', 'charged']],
            ['MDB', 3.42, 3.90, ['phase gloves', 'radiant']],
            ['MCrit Dmg', 3.14, 3.51, ['phase gloves', 'mystic']],
            ['Mana C', 3.10, 3.41, ['phase gloves', 'frugal']],

            ['EDB', 16.57, 18.58, ['phase pants']],
            // ['Int', 6.57, 7.77, ['phase pants']],
            // ['Wis', 6.57, 7.77, ['phase pants']],
            // ['Agi', 5.55, 6.6, ['phase pants']],
            ['Evd', 5.15, 5.78, ['phase pants']],
            // ['PMit', 3.28, 3.7, ['phase pants']],
            ['CS', 3.23, 3.77, ['phase pants', 'charged']],
            ['MDB', 3.91, 4.53, ['phase pants', 'radiant']],
            ['MCrit Dmg', 3.82, 4.28, ['phase pants', 'mystic']],
            ['Mana C', 3.50, 4.91, ['phase pants', 'frugal']],

            ['EDB', 12.22, 13.75, ['phase shoes']],
            // ['Int', 4.86, 5.73, ['phase shoes']],
            // ['Wis', 4.86, 5.73, ['phase shoes']],
            // ['Agi', 4.11, 4.89, ['phase shoes']],
            ['Evd', 3.8, 4.28, ['phase shoes']],
            // ['PMit', 2.44, 2.75, ['phase shoes']],
            ['CS', 2.50, 2.89, ['phase shoes', 'charged']],
            ['MDB', 3.10, 3.57, ['phase shoes', 'radiant']],
            ['MCrit Dmg', 2.80, 3.14, ['phase shoes', 'mystic']],
            ['Mana C', 2.81, 3.11, ['phase shoes', 'frugal']],

            ['DProf', 7.38, 8.29, ['cotton cap', 'heaven-sent']],
            ['DProf', 8.79, 9.89, ['cotton robe', 'heaven-sent']],
            ['DProf', 6.68, 7.50, ['cotton gloves', 'heaven-sent']],
            ['DProf', 8.08, 9.09, ['cotton pants', 'heaven-sent']],
            ['DProf', 5.97, 6.70, ['cotton shoes', 'heaven-sent']],

            ['EProf', 7.38, 8.29, ['cotton cap', 'elementalist']],
            ['EProf', 8.79, 9.89, ['cotton robe', 'elementalist']],
            ['EProf', 6.68, 7.50, ['cotton gloves', 'elementalist']],
            ['EProf', 8.08, 9.09, ['cotton pants', 'elementalist']],
            ['EProf', 5.97, 6.70, ['cotton shoes', 'elementalist']],

            ['FProf', 7.38, 8.29, ['cotton cap', 'demon-fiend']],
            ['FProf', 8.79, 9.89, ['cotton robe', 'demon-fiend']],
            ['FProf', 6.68, 7.50, ['cotton gloves', 'demon-fiend']],
            ['FProf', 8.08, 9.09, ['cotton pants', 'demon-fiend']],
            ['FProf', 5.97, 6.70, ['cotton shoes', 'demon-fiend']],

            // ['Int', 5.31, 6.33, ['cotton cap']],
            // ['Wis', 5.31, 6.33, ['cotton cap']],
            // ['Agi', 4.08, 4.83, ['cotton cap']],
            ['Evd', 3.45, 4.03, ['cotton cap']],
            // ['PMit', 6.03, 6.74, ['cotton cap', 'protection']],
            // ['PMit', 3.95, 4.43, ['cotton cap'], ['protection']],
            ['CS', 2.99, 3.47, ['cotton cap', 'charged']],
            ['Mana C', 3.31, 3.61, ['cotton cap', 'frugal']],

            // ['Int', 6.3, 7.53, ['cotton robe']],
            // ['Wis', 6.3, 7.53, ['cotton robe']],
            // ['Agi', 4.83, 5.73, ['cotton robe']],
            ['Evd', 4.10, 4.78, ['cotton robe']],
            // ['PMit', 7.21, 8.04, ['cotton robe', 'protection']],
            // ['PMit', 4.71, 5.27, ['cotton robe'], ['protection']],
            ['CS', 3.49, 4.06, ['cotton robe', 'charged']],
            ['Mana C', 3.81, 4.11, ['cotton robe', 'frugal']],

            // ['Int', 4.80, 5.73, ['cotton gloves']],
            // ['Wis', 4.80, 5.73, ['cotton gloves']],
            // ['Agi', 3.69, 4.38, ['cotton gloves']],
            ['Evd', 3.13, 3.65, ['cotton gloves']],
            // ['PMit', 5.37, 6.09, ['cotton gloves', 'protection']],
            // ['PMit', 3.57, 4.01, ['cotton gloves'], ['protection']],
            ['CS', 2.74, 3.18, ['cotton gloves', 'charged']],
            ['Mana C', 3.11, 3.41, ['cotton gloves', 'frugal']],

            // ['Int', 5.82, 6.93, ['cotton pants']],
            // ['Wis', 5.82, 6.93, ['cotton pants']],
            // ['Agi', 4.47, 5.28, ['cotton pants']],
            ['Evd', 3.78, 4.4, ['cotton pants']],
            // ['PMit', 6.56, 7.39, ['cotton pants', 'protection']],
            // ['PMit', 4.33, 4.85, ['cotton pants'], ['protection']],
            ['CS', 3.23, 3.77, ['cotton pants', 'charged']],
            ['Mana C', 3.51, 3.91, ['cotton pants', 'frugal']],

            // ['Int', 4.32, 5.13, ['cotton shoes']],
            // ['Wis', 4.32, 5.13, ['cotton shoes']],
            // ['Agi', 3.33, 3.93, ['cotton shoes']],
            ['Evd', 2.80, 3.28, ['cotton shoes']],
            // ['PMit', 4.86, 5.38, ['cotton shoes', 'protection']],
            // ['PMit', 3.19, 3.59, ['cotton shoes'], ['protection']],
            ['CS', 2.51, 2.85, ['cotton shoes', 'charged']],
            ['Mana C', 2.81, 3.05, ['cotton shoes', 'frugal']],

            ['Evd', 5.79, 6.67, ['shade helmet', 'shadowdancer']],
            ['Evd', 5.79, 6.67, ['shade helmet', 'fleet']],
            ['Evd', 3.77, 4.42, ['shade helmet', 'negation']],
            ['Evd', 3.85, 4.45, ['shade helmet', 'arcanist']],
            ['ADB', 9.44, 11.33, ['shade helmet', 'arcanist']],
            ['ADB', 9.37, 11.25, ['shade helmet'],
                ['arcanist']
            ],
            ['AS', 3.14, 3.72, ['shade helmet', 'agile', 'arcanist']],
            ['AS', 3.12, 3.69, ['shade helmet', 'agile'],
                ['arcanist']
            ],
            ['PCrit Dmg', 2.80, 3.14, ['shade helmet', 'savage', 'arcanist']],
            ['PCrit Dmg', 2.78, 3.12, ['shade helmet', 'savage'],
                ['arcanist']
            ],

            ['Evd', 6.88, 7.94, ['shade breastplate', 'shadowdancer']],
            ['Evd', 6.88, 7.94, ['shade breastplate', 'fleet']],
            ['Evd', 4.47, 5.24, ['shade breastplate', 'negation']],
            ['Evd', 4.50, 5.27, ['shade breastplate', 'arcanist']],
            ['ADB', 11.16, 13.39, ['shade breastplate', 'arcanist']],
            ['ADB', 11.08, 13.30, ['shade breastplate'],
                ['arcanist']
            ],
            ['AS', 3.68, 4.34, ['shade breastplate', 'agile', 'arcanist']],
            ['AS', 3.65, 4.31, ['shade breastplate', 'agile'],
                ['arcanist']
            ],
            ['PCrit Dmg', 3.32, 3.75, ['shade breastplate', 'savage', 'arcanist']],
            ['PCrit Dmg', 3.31, 3.72, ['shade breastplate', 'savage'],
                ['arcanist']
            ],

            ['Evd', 5.27, 6.04, ['shade gauntlets', 'shadowdancer']],
            ['Evd', 5.27, 6.04, ['shade gauntlets', 'fleet']],
            ['Evd', 3.42, 4.02, ['shade gauntlets', 'negation']],
            ['Evd', 3.44, 4.05, ['shade gauntlets', 'arcanist']],
            ['ADB', 8.57, 10.32, ['shade gauntlets', 'arcanist']],
            ['ADB', 8.51, 10.23, ['shade gauntlets'],
                ['arcanist']
            ],
            ['AS', 2.90, 3.42, ['shade gauntlets', 'agile', 'arcanist']],
            ['AS', 2.88, 3.40, ['shade gauntlets', 'agile'],
                ['arcanist']
            ],
            ['PCrit Dmg', 2.53, 2.84, ['shade gauntlets', 'savage', 'arcanist']],
            ['PCrit Dmg', 2.51, 2.82, ['shade gauntlets', 'savage'],
                ['arcanist']
            ],

            ['Evd', 6.35, 7.32, ['shade leggings', 'shadowdancer']],
            ['Evd', 6.35, 7.32, ['shade leggings', 'fleet']],
            ['Evd', 4.12, 4.84, ['shade leggings', 'negation']],
            ['Evd', 4.15, 4.87, ['shade leggings', 'arcanist']],
            ['ADB', 10.30, 12.37, ['shade leggings', 'arcanist']],
            ['ADB', 10.23, 12.28, ['shade leggings'],
                ['arcanist']
            ],
            ['AS', 3.39, 4.06, ['shade leggings', 'agile', 'arcanist']],
            ['AS', 3.37, 4.03, ['shade leggings', 'agile'],
                ['arcanist']
            ],
            ['PCrit Dmg', 3.07, 3.44, ['shade leggings', 'savage', 'arcanist']],
            ['PCrit Dmg', 3.05, 3.42, ['shade leggings', 'savage'],
                ['arcanist']
            ],

            ['Evd', 4.67, 5.39, ['shade boots', 'shadowdancer']],
            ['Evd', 4.67, 5.33, ['shade boots', 'fleet']],
            ['Evd', 3.07, 3.59, ['shade boots', 'negation']],
            ['Evd', 3.10, 3.62, ['shade boots', 'arcanist']],
            ['ADB', 7.72, 9.29, ['shade boots', 'arcanist']],
            ['ADB', 7.67, 9.20, ['shade boots'],
                ['arcanist']
            ],
            ['AS', 2.61, 3.09, ['shade boots', 'agile']],
            ['AS', 2.59, 3.07, ['shade boots', 'agile'],
                ['arcanist']
            ],
            ['PCrit Dmg', 2.27, 2.54, ['shade boots', 'savage', 'arcanist']],
            ['PCrit Dmg', 2.25, 2.52, ['shade boots', 'savage'],
                ['arcanist']
            ],

            ['BLK', 5.20, 6.09, ['plate helmet', 'shielding']],
            ['PMit', 13.32, 14.30, ['plate helmet', 'protection']],
            ['PMit', 10.12, 12.73, ['plate helmet'],
                ['protection']
            ],
            ['MMit', 11.80, 13.29, ['plate helmet', 'warding']],
            ['MMit', 6.91, 7.76, ['plate helmet'],
                ['warding']
            ],

            ['BLK', 6.02, 7.09, ['plate cuirass', 'shielding']],
            ['PMit', 15.96, 17.12, ['plate cuirass', 'protection']],
            ['PMit', 12.10, 12.83, ['plate cuirass'],
                ['protection']
            ],
            ['MMit', 14.01, 15.90, ['plate cuirass', 'warding']],
            ['MMit', 8.26, 9.27, ['plate cuirass'],
                ['warding']
            ],

            ['BLK', 4.81, 5.59, ['plate gauntlets', 'shielding']],
            ['PMit', 12.04, 12.90, ['plate gauntlets', 'protection']],
            ['PMit', 9.14, 9.68, ['plate gauntlets'],
                ['protection']
            ],
            ['MMit', 10.60, 12.00, ['plate gauntlets', 'warding']],
            ['MMit', 6.25, 7.02, ['plate gauntlets'],
                ['warding']
            ],

            ['BLK', 5.60, 6.59, ['plate greaves', 'shielding']],
            ['PMit', 14.69, 15.71, ['plate greaves', 'protection']],
            ['PMit', 11.11, 11.78, ['plate greaves'],
                ['protection']
            ],
            ['MMit', 12.88, 14.61, ['plate greaves', 'warding']],
            ['MMit', 7.58, 8.52, ['plate greaves'],
                ['warding']
            ],

            ['BLK', 4.38, 5.03, ['plate sabatons', 'shielding']],
            ['PMit', 10.71, 11.49, ['plate sabatons', 'protection']],
            ['PMit', 8.14, 8.63, ['plate sabatons'],
                ['protection']
            ],
            ['MMit', 9.41, 10.67, ['plate sabatons', 'warding']],
            ['MMit', 5.57, 6.25, ['plate sabatons'],
                ['warding']
            ],

            ['ADB', 21.89, 25.73, ['power helmet', 'slaughter']],
            ['ADB', 15.14, 18.04, ['power helmet'],
                ['slaughter']
            ],
            ['PCrit Chc', 4.92, 5.63, ['power helmet', 'balance']],
            ['PCrit Dmg', 3.94, 4.36, ['power helmet', 'savage']],
            ['PMit', 10.17, 11.16, ['power helmet', 'protection']],
            ['PMit', 7.50, 8.11, ['power helmet'],
                ['protection']
            ],
            ['MMit', 10.16, 11.48, ['power helmet', 'warding']],
            ['MMit', 5.57, 6.26, ['power helmet'],
                ['warding']
            ],

            ['ADB', 25.99, 30.68, ['power armor', 'slaughter']],
            ['ADB', 17.96, 21.46, ['power armor'],
                ['slaughter']
            ],
            ['PCrit Chc', 5.90, 6.80, ['power armor', 'balance']],
            ['PCrit Dmg', 4.68, 5.21, ['power armor', 'savage']],
            ['PMit', 12.17, 13.34, ['power armor', 'protection']],
            ['PMit', 8.95, 9.69, ['power armor'],
                ['protection']
            ],
            ['MMit', 12.11, 13.73, ['power armor', 'warding']],
            ['MMit', 6.64, 7.46, ['power armor'],
                ['warding']
            ],

            ['ADB', 19.86, 23.25, ['power gauntlets', 'slaughter']],
            ['ADB', 13.69, 16.33, ['power gauntlets'],
                ['slaughter']
            ],
            ['PCrit Chc', 4.47, 5.10, ['power gauntlets', 'balance']],
            ['PCrit Dmg', 3.55, 3.94, ['power gauntlets', 'savage']],
            ['PMit', 9.23, 10.09, ['power gauntlets', 'protection']],
            ['PMit', 6.77, 7.33, ['power gauntlets'],
                ['protection']
            ],
            ['MMit', 9.11, 10.36, ['power gauntlets', 'warding']],
            ['MMit', 5.03, 5.65, ['power gauntlets'],
                ['warding']
            ],

            ['ADB', 23.94, 28.20, ['power leggings', 'slaughter']],
            ['ADB', 16.59, 19.75, ['power leggings'],
                ['slaughter']
            ],
            ['PCrit Chc', 5.39, 6.25, ['power leggings', 'balance']],
            ['PCrit Dmg', 4.29, 4.72, ['power leggings', 'savage']],
            ['PMit', 11.18, 12.27, ['power leggings', 'protection']],
            ['PMit', 8.24, 8.91, ['power leggings'],
                ['protection']
            ],
            ['MMit', 11.12, 12.61, ['power leggings', 'warding']],
            ['MMit', 6.12, 6.86, ['power leggings'],
                ['warding']
            ],

            ['ADB', 17.73, 20.77, ['power boots', 'slaughter']],
            ['ADB', 12.32, 14.62, ['power boots'],
                ['slaughter']
            ],
            ['PCrit Chc', 3.94, 4.54, ['power boots', 'balance']],
            ['PCrit Dmg', 3.14, 3.51, ['power boots', 'savage']],
            ['PMit', 8.22, 8.97, ['power boots', 'protection']],
            ['PMit', 6.06, 6.54, ['power boots'],
                ['protection']
            ],
            ['MMit', 8.15, 9.23, ['power boots', 'warding']],
            ['MMit', 4.51, 5.05, ['power boots'],
                ['warding']
            ]

        ];

        function getName(body) {
            var nameDiv;
            if (typeof body.children[1] == 'undefined')
                return 'No such item';
            var showequip = body.children[1];
            if (showequip.children.length == 3)
                nameDiv = showequip.children[0].children[0];
            else
                nameDiv = showequip.children[1].children[0];
            var name = nameDiv.children[0].textContent;
            if (nameDiv.children.length == 3)
                name += ' ' + nameDiv.children[2].textContent;
            return name;
        }

        item.name = getName(data);
        if (item.name == 'No such item') {
            item.level = 'No such item';
            return item;
        }
        var dataText = data.innerHTML;
        if (/Soulbound/.test(dataText))
            item.level = 'Soulbound';
        else
            item.level = dataText.match(/Level\s([^\s]+)/)[1];
        item.info = item.level;
        if (/(Shield\s)|(Buckler)/.test(item.name)) {
            item.info += ',';
            if (/Strength/.test(dataText))
                item.info += ' Str';
            if (/Dexterity/.test(dataText))
                item.info += ' Dex';
            if (/Endurance/.test(dataText))
                item.info += ' End';
            if (/Agility/.test(dataText))
                item.info += ' Agi';
        }
        item.badinfo = '';

        function getPxp0(pxpN, n) {
            var pxp0Est = 300;
            for (var i = 1; i < 15; i++) {
                var sumPxpNextLevel = 1000 * (Math.pow(1 + pxp0Est / 1000, n + 1) - 1);
                var sumPxpThisLevel = 1000 * (Math.pow(1 + pxp0Est / 1000, n) - 1);
                var estimate = sumPxpNextLevel - sumPxpThisLevel;
                if (estimate > pxpN)
                    pxp0Est -= 300 / Math.pow(2, i);
                else
                    pxp0Est += 300 / Math.pow(2, i);
            }
            return Math.round(pxp0Est);
        }

        var pxp0;
        var potencyStr = dataText.match(/Potency\sTier:\s([^\)]+\))/)[1];
        if (potencyStr == '10 (MAX)') {
            item.info += ', IW 10';
            if (/Peerless/.test(item.name))
                pxp0 = 400;
            else if (/Legendary/.test(item.name))
                pxp0 = 357;
            else if (/Magnificent/.test(item.name))
                pxp0 = 326;
            else
                pxp0 = 280;
        } else if (potencyStr[0] != '0') {
            pxp0 = getPxp0(parseInt(potencyStr.match(/\d+(?=\))/)[0]), parseInt(potencyStr[0]));
            item.info += ', IW ' + potencyStr[0];
        } else
            pxp0 = parseInt(potencyStr.match(/(\d+)\)/)[1]);

        var statNames = [
            ['ADB', 'Physical Damage', 'Attack Damage', 0.0854, 50 / 3],
            ['MDB', 'Magical Damage', 'Magic Damage', 0.082969, 50 / 3],
            ['PMit', 'Physical Defense', 'Physical Mitigation', 0.021, 2000],
            ['MMit', 'Magical Defense', 'Magical Mitigation', 0.0201, 2000],
            ['BLK', 'Block Chance', 'Block Chance', 0.0998, 2000],
            ['Parry', 'Parry Chance', 'Parry Chance', 0.0894, 2000],
            ['PCrit Chc', 'Physical Crit Chance', 'Attack Crit Chance', 0.0105, 2000],
            ['PCrit Dmg', null, 'Attack Crit Damage', 0.01, 5000],
            ['AS', null, 'Attack Speed', 0.0481, Infinity],
            ['EProf', 'Elemental Proficiency', 'Elemental', 0.0306, 250 / 7],
            ['DProf', 'Divine Proficiency', 'Divine', 0.0306, 250 / 7],
            ['FProf', 'Forbidden Proficiency', 'Forbidden', 0.0306, 250 / 7],
            ['Str', 'Strength Bonus', 'Strength', 0.03, 250 / 7],
            ['Dex', 'Dexterity Bonus', 'Dexterity', 0.03, 250 / 7],
            ['End', 'Endurance Bonus', 'Endurance', 0.03, 250 / 7],
            ['Agi', 'Agility Bonus', 'Agility', 0.03, 250 / 7],
            ['Int', 'Intelligence Bonus', 'Intelligence', 0.03, 250 / 7],
            ['Wis', 'Wisdom Bonus', 'Wisdom', 0.03, 250 / 7],
            ['Evd', 'Evade Chance', 'Evade Chance', 0.025, 2000],
            ['EDB', 'Holy Spell Damage', 'Holy', 0.0804, 200],
            ['EDB', 'Dark Spell Damage', 'Dark', 0.0804, 200],
            ['EDB', 'Wind Spell Damage', 'Wind', 0.0804, 200],
            ['EDB', 'Elec Spell Damage', 'Elec', 0.0804, 200],
            ['EDB', 'Cold Spell Damage', 'Cold', 0.0804, 200],
            ['EDB', 'Fire Spell Damage', 'Fire', 0.0804, 200],
            ['MCrit Dmg', null, 'Spell Crit Damage', 0.01, 5000],
            ['Mana C', null, 'Mana Conservation', 0.1, Infinity],
            ['CS', 'Casting Speed', 'Casting Speed', 0, 0]
        ];

        var maxUpgrade = 0;
        item.forging = {};
        [].forEach.call(data.querySelectorAll('#eu > span'), function(span) {
            var re = span.textContent.match(/(.+)\sLv\.(\d+)/);
            var thisUpgrade = parseInt(re[2]);
            if (maxUpgrade < thisUpgrade)
                maxUpgrade = thisUpgrade;
            var htmlNameObj = forgeNameToHtmlName(re[1]);
            if (htmlNameObj)
                item.forging[htmlNameObj.htmlName] = { amount: thisUpgrade, baseMultiplier: htmlNameObj.baseMultiplier, scalingFactor: htmlNameObj.scalingFactor };
        });

        function reverseForgeMultiplierDamage(forgedBase, forgeLevelObj) {
            var qualityBonus = 0.01 * Math.round(100 * (pxp0 - 100) / 25 * forgeLevelObj.baseMultiplier);
            var forgeCoeff = 1 + 0.278875 * Math.log(0.1 * forgeLevelObj.amount + 1);
            var unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
            return unforgedBase;
        }

        function reverseForgeMultiplierPlain(forgedBase, forgeLevelObj) {
            var qualityBonus = 0.01 * Math.round(100 * (pxp0 - 100) / 25 * forgeLevelObj.baseMultiplier);
            var forgeCoeff = 1 + 0.2 * Math.log(0.1 * forgeLevelObj.amount + 1);
            var unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
            return unforgedBase;
        }
        if (maxUpgrade > 0)
            item.info += ', forged ' + maxUpgrade;

        function forgeNameToHtmlName(forgeName) {
            var htmlNameObj;
            statNames.forEach(function(stats) {
                if (forgeName == stats[1])
                    htmlNameObj = { htmlName: stats[2], baseMultiplier: stats[3], scalingFactor: stats[4] };
            });
            return htmlNameObj;
        }
        var lower = item.name.toLowerCase();

        if (/leather/.test(lower) || (/cotton/.test(lower) && (/protection/.test(lower) || /warding/.test(lower)))) {
            done(item);
            return item;
        }

        var htmlMagicTypes = ['Holy', 'Dark', 'Wind', 'Elec', 'Cold', 'Fire'];
        var htmlProfTypes = ['Divine', 'Forbidden', 'Elemental'];
        var staffPrefixes = { 'Holy': 'Hallowed', 'Dark': 'Demonic', 'Wind': 'Tempestuous', 'Elec': 'Shocking', 'Cold': 'Arctic', 'Fire': 'Fiery' };

        var equipStats = {};

        function titleStrToBase(title) {
            return parseFloat(title.substr(6));
        }
        [].forEach.call(data.querySelectorAll('div[title]'), function(div) {
            if (div.parentElement.parentElement.id == 'equip_extended') {
                equipStats['Attack Damage'] = titleStrToBase(div.title);
                return;
            }
            var htmlName = div.childNodes[0].textContent;
            if (/\+/.test(htmlName)) // "Elec +"
                htmlName = htmlName.substr(0, htmlName.length - 2);
            if (htmlMagicTypes.indexOf(htmlName) != -1) {
                if (div.parentElement.children[0].textContent == 'Damage Mitigations')
                    htmlName += ' Mit';
            }
            equipStats[htmlName] = titleStrToBase(div.title);
        });

        function abbrevNameToHtmlName(abbrevName) {
            var htmlName;

            if (abbrevName == 'Prof') {
                Object.keys(equipStats).forEach(function(equipStatName) {
                    if (htmlProfTypes.indexOf(equipStatName) != -1)
                        htmlName = equipStatName;
                });
            } else if (abbrevName == 'EDB') {
                Object.keys(equipStats).forEach(function(equipStatName) {
                    if (htmlMagicTypes.indexOf(equipStatName) != -1 && !/Staff/.test(item.name))
                        htmlName = equipStatName;
                    if (htmlMagicTypes.indexOf(equipStatName) != -1 && /Staff/.test(item.name))
                        if (item.name.indexOf(staffPrefixes[equipStatName]) != -1)
                            htmlName = equipStatName;
                });
            } else {
                statNames.forEach(function(stats) {
                    if (abbrevName == stats[0]) {
                        htmlName = stats[2];
                    }
                });
            }
            return htmlName;
        }

        var found = false;
        ranges.forEach(function(range) {
            if (!range[3].every(function(subName) {
                    if (lower.indexOf(subName) != -1)
                        return true;
                }))
                return;
            if (range[4] && lower.indexOf(range[4]) != -1)
                return;

            var abbrevName = range[0];
            var htmlName = abbrevNameToHtmlName(abbrevName);
            if (!htmlName) {
                alert('no htmlname for ' + abbrevName);
                return;
            }

            var stat = equipStats[htmlName];
            if (!stat) {
                alert('found no stat for ' + htmlName);
                return;
            }

            if (abbrevName == 'ADB' || abbrevName == 'MDB') {
                if (item.forging[htmlName])
                    stat = reverseForgeMultiplierDamage(stat, item.forging[htmlName]);
            } else if (item.forging[htmlName])
                stat = reverseForgeMultiplierPlain(stat, item.forging[htmlName]);

            if (abbrevName == 'ADB') {
                var butcher = dataText.match(/Butcher\sLv.(\d)/);
                if (butcher)
                    stat = stat / (1 + 0.02 * parseInt(butcher[1]));
            } else if (abbrevName == 'MDB') {
                var archmage = dataText.match(/Archmage\sLv.(\d)/);
                if (archmage)
                    stat = stat / (1 + 0.02 * parseInt(archmage[1]));
            }


            if (!stat) {
                alert('didnt find a stat for ' + abbrevName);
                return;
            }

            found = true;
            var percentile = Math.round(100 * (stat - range[1]) / (range[2] - range[1]));
            var dontShowInAuction = [/Int/, /Wis/, /Agi/, /Evd/, /Pmit/];
            if (percentile < 0)
                item.badinfo += ', ' + range[0] + ' ' + percentile + '%';
            else if (typeof showSeller == 'undefined' || !showSeller || dontShowInAuction.every(function(re) { return !re.test(range[0]); }))
                item.info += ', ' + range[0] + ' ' + percentile + '%';
        });

        if (found === false && !/plate/.test(lower) && !/leather/.test(lower))
            alert('Sorry, but ' + lower + ' either is obsolete or its data is unknown. Cannot parse it.');
        done(item);
    }
})();
