// ==UserScript==
// @name         HV Equipment Highlight
// @author       carry0987; ggxxsol(ggxxhy); hc br
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.2.8
// @description  People always discern the color first, then to see word
// @icon         https://e-hentai.org/favicon.ico
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @match        https://forums.e-hentai.org/*
// @match        http://forums.e-hentai.org/*
// @exclude      *://*hentaiverse.org/?s=Battle*
// @exclude      *://forums.e-hentai.org/index.php?act*
// @exclude      *://*hentaiverse.org/?s=Character&ss=it
// @exclude      *://*hentaiverse.org/?s=Bazaar&ss=ss
// @run-at       document-end
// ==/UserScript==

var getLocation = document.location.href;
if (getLocation.match(/ss=iw/) && !document.getElementById('item_pane')) return
var hanhua = true;
var closeH = 0;
var mhtml = document.body.innerHTML;
var html = document.body.innerHTML;
mainhh();
var xuanfu = document.createElement('div');
var torep = new Array();
var repby = new Array();

function mainhh() {
    if (getLocation.match('://hentaiverse.org/equip/') || getLocation.match('://hentaiverse.org/pages/showequip.php')) {
        html = eqmthh(document.body);
        document.body.innerHTML = html;
        return
    }
    var lklist = new Array();
    //背包0
    lklist = lklist.concat('Character&ss=in')
    //道具店1
    lklist = lklist.concat('Bazaar&ss=is')
    //裝備2
    lklist = lklist.concat('Character&ss=eq')
    //裝備店3
    lklist = lklist.concat('Bazaar&ss=es')
    //祭壇4
    lklist = lklist.concat('Bazaar&ss=ss')
    //戰鬥道具5
    lklist = lklist.concat('Character&ss=it')
    //IW漢化6
    lklist = lklist.concat('ss=iw')
    //論壇漢化7
    lklist = lklist.concat('forums')
    //武器彩卷8
    lklist = lklist.concat('Bazaar&ss=lt')
    //武器彩卷9
    lklist = lklist.concat('Bazaar&ss=la')
    //強化10
    lklist = lklist.concat('Forge&ss=up&*')
    //附魔11
    lklist = lklist.concat('Forge&ss=en&*')
    //鍛造12
    lklist = lklist.concat('Forge')
    for (var i = 0; i < lklist.length; i++) {
        if (getLocation.match(lklist[i])) {
            var temp = i;
            break;
        }
    }
    switch (temp) {
        case 0: //背包0
            torep = new Array();
            repby = new Array();
            try {
                var itemdiv = document.querySelector('#inv_equip.cspp');
                var equipdiv = document.querySelector('#inv_eqstor.cspp');
                equipdiv = eqmthh(equipdiv)
                itemdiv = eqmthh(itemdiv)
                document.querySelector('#inv_equip.cspp').innerHTML = itemdiv;
                document.querySelector('#inv_eqstor.cspp').innerHTML = equipdiv;
            } catch (e) {}
            break;
        case 1: //道具店1
            torep = new Array();
            repby = new Array();
            itemdiv = document.querySelector('#mainpane').innerHTML;
            item()
            itemdiv = yhanhua(torep, repby, itemdiv)
            document.querySelector('#mainpane').innerHTML = itemdiv;
            break;
        case 2: //裝備2
            torep = new Array();
            repby = new Array();
            var getEquip = document.querySelector('#eqsb');
            if (!getEquip) {
                getEquip = document.querySelector('#equip_pane');
            }
            equipdiv = getEquip;
            equipdiv = eqmthh(equipdiv)
            getEquip.innerHTML = equipdiv;
            break;
        case 3: //裝備店3
            torep = new Array();
            repby = new Array();
            equipdiv = document.querySelectorAll('.equiplist');
            temp = eqmthh(equipdiv[0])
            equipdiv[0].innerHTML = temp
            temp = eqmthh(equipdiv[1])
            equipdiv[1].innerHTML = temp
            var equhide = document.createElement('a');
            equhide.style.cssText = `
            font-size: 15px;color: red;position: absolute;top: 652px;left: 2px;text-align: left;border: 1px solid rgb(92, 13, 17);padding: 4px;cursor: pointer;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none
            `;
            try {
                if (!localStorage.hideflag) {
                    localStorage.hideflag = 'Display lock equipment'
                }
                if (localStorage.hideflag != 'Display lock equipment') {
                    equipdiv = document.querySelectorAll('.il')
                    for (i = 0; i < equipdiv.length; i++) {
                        equipdiv[i].parentNode.style.cssText = 'display:none;'
                    }
                }
                equhide.innerHTML = 'NOW ' + localStorage.hideflag
            } catch (e) { alert(e) }
            equhide.onclick = function() {
                equipdiv = document.querySelectorAll('.il')
                if (localStorage.hideflag == 'Hide the locking equipment') {
                    localStorage.hideflag = 'Display lock equipment'
                    for (i = 0; i < equipdiv.length; i++) {
                        equipdiv[i].parentNode.style.cssText = 'display:block;'
                    }
                } else {
                    localStorage.hideflag = 'Hide the locking equipment'
                    for (i = 0; i < equipdiv.length; i++) {
                        equipdiv[i].parentNode.style.cssText = 'display:none;'
                    }
                }
                this.innerHTML = 'NOW ' + localStorage.hideflag
            }
            document.body.appendChild(equhide);
            break;
        case 4: // 祭壇4
            torep = new Array();
            repby = new Array();
            itemdiv = document.querySelector('#mainpane').innerHTML;
            item()
            itemdiv = yhanhua(torep, repby, itemdiv)
            document.querySelector('#mainpane').innerHTML = itemdiv;
            break;
        case 5: //戰鬥道具5
            torep = new Array();
            repby = new Array();
            itemdiv = document.querySelector('#mainpane').innerHTML;
            item()
            itemdiv = yhanhua(torep, repby, itemdiv)
            document.querySelector('#mainpane').innerHTML = itemdiv;
            break;
        case 6: //iw
            torep = new Array();
            repby = new Array();
            equipdiv = document.querySelector('#item_pane');
            equipdiv = eqmthh(equipdiv)
            document.querySelector('#item_pane').innerHTML = equipdiv;
            break;
        case 7: //論壇
            var torep = new Array();
            var repby = new Array();
            equipdiv = document.getElementsByClassName('postcolor');
            for (var ii = 0; ii < equipdiv.length; ii++) {
                var tempequipment = equipdiv[ii]
                //tempequipment.innerHTML = tempequipment.innerHTML.replace(/<span [^>]+>[^>]+>/g,"")
                tempequipment.innerHTML = tempequipment.innerHTML.replace(/<!--[/]?color[^>]+>/g, "")
                tempequipment.innerHTML = tempequipment.innerHTML.replace(/<[/]*b>/g, "")
                tempequipment = eqmthh(tempequipment)
                //item()
                //tempequipment = yhanhua(torep,repby,tempequipment);
                document.getElementsByClassName('postcolor')[ii].innerHTML = tempequipment;
            }
            break;
        case 8: //武器彩卷
            torep = new Array();
            repby = new Array();
            equipdiv = document.querySelector('#leftpane');
            equipdiv = eqmthh(equipdiv)
            document.querySelector('#leftpane').innerHTML = equipdiv;
            break;
        case 9: //防具彩卷
            torep = new Array();
            repby = new Array();
            equipdiv = document.querySelector('#leftpane');
            equipdiv = eqmthh(equipdiv)
            document.querySelector('#leftpane').innerHTML = equipdiv;
            break;
        case 10: //強化
            torep = new Array();
            repby = new Array();
            equipdiv = document.querySelector('#leftpane');
            equipdiv = eqmthh(equipdiv)
            document.querySelector('#leftpane').innerHTML = equipdiv;
            break;
        case 11: //附魔
            torep = new Array();
            repby = new Array();
            equipdiv = document.querySelector('#leftpane');
            equipdiv = eqmthh(equipdiv)
            document.querySelector('#leftpane').innerHTML = equipdiv;
            break;
        case 12: //鍛造
            torep = new Array();
            repby = new Array();
            if (equipdiv = document.getElementById('upgrade_button')) equipdiv.style.cssText = 'position:relative; top:20px;';
            equipdiv = document.querySelector('#item_pane');
            equipdiv = eqmthh(equipdiv)
            document.querySelector('#item_pane').innerHTML = equipdiv;
            break;
        default:
    }

    //源語句，漢化後語句，漢化變量
    function yhanhua(torep, repby, temp) {
        for (var i = 0; i < torep.length; i++) {
            var regex = new RegExp(torep[i], 'g');
            temp = temp.replace(regex, repby[i]);
        }
        return temp
    }

    function item() {}

    function eqmthh(eminn) {
        var em = eminn.innerHTML.match(/([>]|[>\[\]0-9A-Z]+)(Fine|Super|Exquisite|Average|Crude|Fair|Magnificent|Legendary|Peerless)[a-zA-Z- ]*/g)
        if (em == null) return eminn.innerHTML
        var eqc1 = new Array();
        var eqc2 = new Array();
        var eqc3 = new Array();
        var eqc4 = new Array();
        var eqac = new Array();
        var eqe1 = new Array();
        var eqe2 = new Array();
        var eqe3 = new Array();
        var eqe4 = new Array();
        var eqae = new Array();
        var emc = new Array();
        var eqe5 = new Array();
        var eqc5 = new Array();
        eq1()
        eq2()
        eq3()
        eq4()
        eq5()
        var e1
        var e2
        var e3
        var e4
        var e5
        for (var i = 0; i < em.length; i++) {
            em[i] = em[i].replace('The', 'the')
            e1 = eqc(em[i], eqe1)
            e2 = eqc(em[i], eqe2)
            e3 = eqc(em[i], eqe3)
            e4 = eqc(em[i], eqe4)
            e5 = eqc(em[i], eqe5)
            emc[i] = eqc1[e1] + ' ' + eqc2[e2] + ' ' + eqc4[e4] + ' ' + eqc5[e5] + ' ' + eqc3[e3] + '</span>'
        }
        var tempeq = eminn.innerHTML
        for (i = 0; i < emc.length; i++) {
            tempeq = tempeq.replace(em[i], '>' + emc[i])
        }

        eqa() //道具裝載
        for (i = 0; i < eqae.length; i++) {
            var regex = new RegExp(eqae[i], 'g');
            tempeq = tempeq.replace(regex, eqac[i]);
        }
        return tempeq

        //temp 輸入裝備名稱, eqeq 列表英文
        function eqc(temp, eqeq) {
            var temps = temp
            for (var j = 0; j < eqeq.length; j++) {
                var aaa = temps.match(eqeq[j])
                if (aaa != null) return j;
            }
            return 0
        }

        function eqa() {
            eqae = eqae.concat('');
            eqac = eqac.concat('');
            eqae = eqae.concat('');
            eqac = eqac.concat('');
        }

        function eq5() {
            eqe5 = eqe5.concat('ddsezxcwer');
            eqc5 = eqc5.concat(''); //如果出現問號絕對有問題
            eqe5 = eqe5.concat('Buckler');
            eqc5 = eqc5.concat('');
            eqe5 = eqe5.concat('Kite Shield');
            eqc5 = eqc5.concat('');
            eqe5 = eqe5.concat('Tower Shield');
            eqc5 = eqc5.concat('');
            //單手武器類
            eqe5 = eqe5.concat('Dagger');
            eqc5 = eqc5.concat('Dagger(1H)');
            eqe5 = eqe5.concat('Shortsword');
            eqc5 = eqc5.concat('Shortsword(1H)');
            eqe5 = eqe5.concat('Wakizashi');
            eqc5 = eqc5.concat('Wakizashi(1H)');
            eqe5 = eqe5.concat('Axe');
            eqc5 = eqc5.concat('Axe(1H)');
            eqe5 = eqe5.concat('Club');
            eqc5 = eqc5.concat('Club(1H)');
            eqe5 = eqe5.concat('Rapier');
            eqc5 = eqc5.concat('Rapier(1H)');
            //雙手
            eqe5 = eqe5.concat('Longsword');
            eqc5 = eqc5.concat('Longsword(2H)');
            eqe5 = eqe5.concat('Scythe');
            eqc5 = eqc5.concat('Scythe(2H)');
            eqe5 = eqe5.concat('Katana');
            eqc5 = eqc5.concat('Katana(2H)');
            eqe5 = eqe5.concat('Mace');
            eqc5 = eqc5.concat('Mace(2H)');
            eqe5 = eqe5.concat('Estoc');
            eqc5 = eqc5.concat('Estoc(2H)');
            //法杖
            eqe5 = eqe5.concat('Staff');
            eqc5 = eqc5.concat('Staff');
            //布甲
            eqe5 = eqe5.concat('Cap');
            eqc5 = eqc5.concat('Cap');
            eqe5 = eqe5.concat('Robe');
            eqc5 = eqc5.concat('Robe');
            eqe5 = eqe5.concat('Gloves');
            eqc5 = eqc5.concat('Gloves');
            eqe5 = eqe5.concat('Pants');
            eqc5 = eqc5.concat('Pants');
            eqe5 = eqe5.concat('Shoes');
            eqc5 = eqc5.concat('Shoes');
            //輕甲
            eqe5 = eqe5.concat('Helmet');
            eqc5 = eqc5.concat('Helmet');
            eqe5 = eqe5.concat('Breastplate');
            eqc5 = eqc5.concat('Breastplate');
            eqe5 = eqe5.concat('Gauntlets');
            eqc5 = eqc5.concat('Gauntlets');
            eqe5 = eqe5.concat('Leggings');
            eqc5 = eqc5.concat('Leggings');
            //重甲
            eqe5 = eqe5.concat('Cuirass');
            eqc5 = eqc5.concat('Cuirass');
            eqe5 = eqe5.concat('Armor');
            eqc5 = eqc5.concat('Armor');
            eqe5 = eqe5.concat('Sabatons');
            eqc5 = eqc5.concat('Sabatons');
            eqe5 = eqe5.concat('Boots');
            eqc5 = eqc5.concat('Boots');
            eqe5 = eqe5.concat('Greaves');
            eqc5 = eqc5.concat('Greaves');
        }

        function eq4() {
            /////////////////////////////盾或者材料,武器不會出現這個
            eqe4 = eqe4.concat('ddsezxcwer'); //防止空缺
            eqc4 = eqc4.concat('');
            //盾
            eqe4 = eqe4.concat('Buckler');
            eqc4 = eqc4.concat('Buckler');
            eqe4 = eqe4.concat('Kite Shield');
            eqc4 = eqc4.concat('Kite Shield');
            eqe4 = eqe4.concat('Tower Shield');
            eqc4 = eqc4.concat('Tower Shield');
            eqe4 = eqe4.concat('Force Shield');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >Force Shield</span>');
            //布甲
            eqe4 = eqe4.concat('Cotton');
            eqc4 = eqc4.concat('Cotton(C)');
            eqe4 = eqe4.concat('Gossamer');
            eqc4 = eqc4.concat('Gossamer(C)');
            eqe4 = eqe4.concat('Phase');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >Phase</span><span style=\"background:#FFFFFF;color:#000000\" >(C)</span>');
            //輕甲
            eqe4 = eqe4.concat('Leather');
            eqc4 = eqc4.concat('Leather<span style=\"background:#d498ff;color:#FFFFFF\" >(L)</span>');
            eqe4 = eqe4.concat('Kevlar');
            eqc4 = eqc4.concat('Kevlar<span style=\"background:#d498ffe;color:#FFFFFF\" >(L)</span>');
            eqe4 = eqe4.concat('Shade');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >Shade</span><span style=\"background:#d498ff;color:#FFFFFF\" >(L)</span>');
            //重甲
            eqe4 = eqe4.concat('Plate');
            eqc4 = eqc4.concat('Plate<span style=\"background:#6b06b4;color:#FFFFFF\" >(H)</span>');
            eqe4 = eqe4.concat('Power');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >Power</span><span style=\"background:#6b06b4;color:#FFFFFF\" >(H)</span>');
            //法杖
            eqe4 = eqe4.concat('Ebony');
            eqc4 = eqc4.concat('Ebony');
            eqe4 = eqe4.concat('Redwood');
            eqc4 = eqc4.concat('Redwood');
            eqe4 = eqe4.concat('Willow');
            eqc4 = eqc4.concat('Willow');
            eqe4 = eqe4.concat('Oak');
            eqc4 = eqc4.concat('Oak');
            eqe4 = eqe4.concat('Katalox');
            eqc4 = eqc4.concat('Katalox');
        }

        function eq3() {
            eqe3 = eqe3.concat('ddsezxcwer'); //防止空缺
            eqc3 = eqc3.concat('');
            ///////////////////////////////////////////防具後綴////////////////////////////////////////////
            eqe3 = eqe3.concat('of the Cheetah');
            eqc3 = eqc3.concat('of the Cheetah');
            eqe3 = eqe3.concat('of Negation');
            eqc3 = eqc3.concat('of Negation');
            eqe3 = eqe3.concat('of the Shadowdancer');
            eqc3 = eqc3.concat('of the Shadowdancer');
            eqe3 = eqe3.concat('of the Arcanist');
            eqc3 = eqc3.concat('of the Arcanist');
            eqe3 = eqe3.concat('of the Fleet');
            eqc3 = eqc3.concat('of the Fleet');
            eqe3 = eqe3.concat('Spirit-ward');
            eqc3 = eqc3.concat('Spirit-ward');
            eqe3 = eqe3.concat('of the Fire-eater');
            eqc3 = eqc3.concat('of the Fire-eater');
            eqe3 = eqe3.concat('Fire-eater');
            eqc3 = eqc3.concat('Fire-eater');
            eqe3 = eqe3.concat('of the Thunder-child');
            eqc3 = eqc3.concat('of the Thunder-child');
            eqe3 = eqe3.concat('of the Wind-waker');
            eqc3 = eqc3.concat('of the Wind-waker');
            eqe3 = eqe3.concat('of the Spirit-ward');
            eqc3 = eqc3.concat('of the Spirit-ward');
            eqe3 = eqe3.concat('of Dampening');
            eqc3 = eqc3.concat('of Dampening');
            eqe3 = eqe3.concat('of Stoneskin');
            eqc3 = eqc3.concat('of Stoneskin');
            eqe3 = eqe3.concat('of Deflection');
            eqc3 = eqc3.concat('of Deflection');
            eqe3 = eqe3.concat('of the Battlecaster');
            eqc3 = eqc3.concat('of the Battlecaster');
            eqe3 = eqe3.concat('of the Nimble');
            eqc3 = eqc3.concat('of the Nimble');
            eqe3 = eqe3.concat('of the Barrier');
            eqc3 = eqc3.concat('of the Barrier');
            eqe3 = eqe3.concat('of Protection');
            eqc3 = eqc3.concat('of Protection');
            eqe3 = eqe3.concat('of Warding');
            eqc3 = eqc3.concat('of Warding');
            eqe3 = eqe3.concat('of the Raccoon');
            eqc3 = eqc3.concat('of the Raccoon');
            eqe3 = eqe3.concat('of the Frost-born');
            eqc3 = eqc3.concat('of the Frost-born');
            ////////////////////////////////////////////////////武器後綴/////////////////////////////////
            eqe3 = eqe3.concat('of Swiftness');
            eqc3 = eqc3.concat('of Swiftness');
            eqe3 = eqe3.concat('of the Battlecaster');
            eqc3 = eqc3.concat('of the Battlecaster');
            eqe3 = eqe3.concat('of the Banshee');
            eqc3 = eqc3.concat('of the Banshee');
            eqe3 = eqe3.concat('of the Illithid');
            eqc3 = eqc3.concat('of the Illithid');
            eqe3 = eqe3.concat('of the Vampire');
            eqc3 = eqc3.concat('of the Vampire');
            eqe3 = eqe3.concat('of Focus');
            eqc3 = eqc3.concat('of Focus');
            eqe3 = eqe3.concat('of the Elementalist');
            eqc3 = eqc3.concat('of the Elementalist');
            eqe3 = eqe3.concat('of the Heaven-sent');
            eqc3 = eqc3.concat('of the Heaven-sent');
            eqe3 = eqe3.concat('of the Demon-fiend');
            eqc3 = eqc3.concat('of the Demon-fiend');
            eqe3 = eqe3.concat('of the Earth-walker');
            eqc3 = eqc3.concat('of the Earth-walker');
            eqe3 = eqe3.concat('of the Priestess');
            eqc3 = eqc3.concat('of the Priestess');
            eqe3 = eqe3.concat('of the Curse-weaver');
            eqc3 = eqc3.concat('of the Curse-weaver');
            eqe3 = eqe3.concat('of the Thrice-blessed');
            eqc3 = eqc3.concat('of the Thrice-blessed');
            eqe3 = eqe3.concat('of Slaughter');
            eqc3 = eqc3.concat('<span style=\"background:#FF0000;color:#FFFFFF\" >of Slaughter</span>');
            eqe3 = eqe3.concat('of Balance');
            eqc3 = eqc3.concat('<span style=\"background:#c8c87c\;color:#000000\" >of Balance</span>');
            eqe3 = eqe3.concat('of Destruction');
            eqc3 = eqc3.concat('<span style=\"background:#9400d3\;color:#FFFFFF" >of Destruction</span>');
            eqe3 = eqe3.concat('of Surtr');
            eqc3 = eqc3.concat('<span style=\"background:#f97c7c\;color:#000000" >of Surtr</span>');
            eqe3 = eqe3.concat('of Niflheim');
            eqc3 = eqc3.concat('<span style=\"background:#94c2f5\;color:#000000" >of Niflheim</span>');
            eqe3 = eqe3.concat('of Mjolnir');
            eqc3 = eqc3.concat('<span style=\"background:#fcff66\;color:#000000" >of Mjolnir</span>');
            eqe3 = eqe3.concat('of Freyr');
            eqc3 = eqc3.concat('<span style=\"background:#7ff97c\;color:#000000" >of Freyr</span>');
            eqe3 = eqe3.concat('of Heimdall');
            eqc3 = eqc3.concat('<span style=\"background:#ffffff\;color:#000000" >of Heimdall</span>');
            eqe3 = eqe3.concat('of Fenrir');
            eqc3 = eqc3.concat('<span style=\"background:#000000\;color:#ffffff" >of Fenrir</span>');
        }

        function eq2() {
            eqe2 = eqe2.concat('dfgdsfgsdge'); //防止空缺
            eqc2 = eqc2.concat('');
            ///////////////武器或者防具屬性/////////////////
            eqe2 = eqe2.concat('Charged');
            eqc2 = eqc2.concat('<span style=\"color:red\" >Charged</span>');
            eqe2 = eqe2.concat('Mystic');
            eqc2 = eqc2.concat('Mystic');
            eqe2 = eqe2.concat('Amber');
            eqc2 = eqc2.concat('Amber');
            eqe2 = eqe2.concat('Mithril');
            eqc2 = eqc2.concat('<span style=\"color:red\" >Mithril</span>');
            eqe2 = eqe2.concat('Agile');
            eqc2 = eqc2.concat('<span style=\"color:red\" >Agile</span>');
            eqe2 = eqe2.concat('Zircon');
            eqc2 = eqc2.concat('Zircon');
            eqe2 = eqe2.concat('Frugal');
            eqc2 = eqc2.concat('Frugal');
            eqe2 = eqe2.concat('Jade');
            eqc2 = eqc2.concat('Jade');
            eqe2 = eqe2.concat('Cobalt');
            eqc2 = eqc2.concat('Cobalt');
            eqe2 = eqe2.concat('Ruby');
            eqc2 = eqc2.concat('Ruby');
            eqe2 = eqe2.concat('Astral');
            eqc2 = eqc2.concat('Astral');
            eqe2 = eqe2.concat('Onyx');
            eqc2 = eqc2.concat('Onyx');
            eqe2 = eqe2.concat('Savage');
            eqc2 = eqc2.concat('<span style=\"color:red\" >Savage</span>');
            eqe2 = eqe2.concat('Reinforced');
            eqc2 = eqc2.concat('Reinforced');
            eqe2 = eqe2.concat('Shielding');
            eqc2 = eqc2.concat('Shielding');
            eqe2 = eqe2.concat('Radiant');
            eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:red" >Radiant</span>');
            eqe2 = eqe2.concat('Arctic');
            eqc2 = eqc2.concat('<span style=\"background:#94c2f5\;color:#000000" >Arctic</span>');
            eqe2 = eqe2.concat('Fiery');
            eqc2 = eqc2.concat('<span style=\"background:#f97c7c\;color:#000000" >Fiery</span>');
            eqe2 = eqe2.concat('Shocking');
            eqc2 = eqc2.concat('<span style=\"background:#fcff66\;color:#000000" >Shocking</span>');
            eqe2 = eqe2.concat('Tempestuous');
            eqc2 = eqc2.concat('<span style=\"background:#a9f94f\;color:#000000" >Tempestuous</span>');
            eqe2 = eqe2.concat('Hallowed');
            eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:#000000" >Hallowed</span>');
            eqe2 = eqe2.concat('Demonic');
            eqc2 = eqc2.concat('<span style=\"background:#000000\;color:#ffffff" >Demonic</span>');
            eqe2 = eqe2.concat('Ethereal');
            eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:#5c5a5a" >Ethereal</span>');
        }

        function eq1() {
            /////////////////品質//////////
            eqe1 = eqe1.concat('Crude');
            eqc1 = eqc1.concat('Crude');
            eqe1 = eqe1.concat('Fair');
            eqc1 = eqc1.concat('Fair');
            eqe1 = eqe1.concat('Average');
            eqc1 = eqc1.concat('Average');
            eqe1 = eqe1.concat('Fine');
            eqc1 = eqc1.concat('Fine(OUT)');
            eqe1 = eqe1.concat('Superior');
            eqc1 = eqc1.concat('<span style=\"background:#44c554\;color:#ffffff" >Superior</span>');
            eqe1 = eqe1.concat('Exquisite');
            eqc1 = eqc1.concat('<span style=\"background:#6060f9\;color:#ffffff" >Exquisite</span>');
            eqe1 = eqe1.concat('Magnificent');
            eqc1 = eqc1.concat('<span style=\"background:#0000ae\;color:#ffffff" >Magnificent</span>');
            eqe1 = eqe1.concat('Legendary');
            eqc1 = eqc1.concat('<span style=\"background:#f5b9cd\;color:#000000" >☆Legendary☆</span>');
            eqe1 = eqe1.concat('Peerless');
            eqc1 = eqc1.concat('<span style=\"background:#fbc93e\;color:#000000" >★Peerless★</span>');
        }
    }
}
