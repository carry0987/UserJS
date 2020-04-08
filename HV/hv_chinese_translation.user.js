// ==UserScript==
// @name         HV Item Chinese TR
// @author       ggxxsol(ggxxhy); mbbdzz; hc br; carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.1.0
// @description  Translate HentaiVerse items into traditional chinese
// @icon         https://e-hentai.org/favicon.ico
// @include      https://hentaiverse.org/*
// @include      http://hentaiverse.org/*
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
    if (getLocation.match('hentaiverse.org/equip/') || getLocation.match('hentaiverse.org/pages/showequip.php')) {
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
            var showConfig
            showConfig = checkHide()
            try {
                if (!getValue('hideflag')) {
                    setValue('hideflag', 1)
                }
                if (getValue('hideflag', true) != 1) {
                    equipdiv = document.querySelectorAll('.il')
                    for (i = 0; i < equipdiv.length; i++) {
                        equipdiv[i].parentNode.style.cssText = 'display:none;'
                    }
                }
                equhide.innerHTML = 'NOW ' + showConfig
            } catch (e) { alert(e) }
            equhide.onclick = function() {
                equipdiv = document.querySelectorAll('.il')
                if (getValue('hideflag', true) == 0) {
                    setValue('hideflag', 1)
                    for (i = 0; i < equipdiv.length; i++) {
                        equipdiv[i].parentNode.style.cssText = 'display:block;'
                    }
                } else {
                    setValue('hideflag', 0)
                    for (i = 0; i < equipdiv.length; i++) {
                        equipdiv[i].parentNode.style.cssText = 'display:none;'
                    }
                }
                showConfig = checkHide()
                this.innerHTML = 'NOW ' + showConfig
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

    function item() {
        //藥水
        torep = torep.concat('Health Draught')
        repby = repby.concat('體力藥水')
        torep = torep.concat('Health Potion')
        repby = repby.concat('體力藥劑')
        torep = torep.concat('Health Elixir')
        repby = repby.concat('體力萬能藥')
        torep = torep.concat('Mana Draught')
        repby = repby.concat('魔力藥水')
        torep = torep.concat('Mana Potion')
        repby = repby.concat('魔力藥劑')
        torep = torep.concat('Mana Elixir')
        repby = repby.concat('魔力萬能藥')
        torep = torep.concat('Spirit Draught')
        repby = repby.concat('靈力藥水')
        torep = torep.concat('Spirit Potion')
        repby = repby.concat('靈力藥劑')
        torep = torep.concat('Spirit Elixir')
        repby = repby.concat('靈力萬能藥')
        torep = torep.concat('Energy Drink')
        repby = repby.concat('能量飲料')
        torep = torep.concat('Last Elixir')
        repby = repby.concat('終極萬能藥')
        //魔藥
        torep = torep.concat('Infusion of Darkness')
        repby = repby.concat('暗屬性魔藥')
        torep = torep.concat('Infusion of Divinity')
        repby = repby.concat('聖屬性魔藥')
        torep = torep.concat('Infusion of Storms')
        repby = repby.concat('風屬性魔藥')
        torep = torep.concat('Infusion of Lightning')
        repby = repby.concat('雷屬性魔藥')
        torep = torep.concat('Infusion of Frost')
        repby = repby.concat('冰屬性魔藥')
        torep = torep.concat('Infusion of Flames')
        repby = repby.concat('火屬性魔藥')
        torep = torep.concat('Scroll of Swiftness')
        repby = repby.concat('迅捷卷軸')
        torep = torep.concat('Scroll of the Avatar')
        repby = repby.concat('化身捲軸')
        torep = torep.concat('Scroll of Shadows')
        repby = repby.concat('幻影捲軸')
        torep = torep.concat('Scroll of Absorption')
        repby = repby.concat('吸收捲軸')
        torep = torep.concat('Scroll of Life')
        repby = repby.concat('生命捲軸')
        torep = torep.concat('Scroll of Protection')
        repby = repby.concat('防護卷軸')
        torep = torep.concat('Scroll of the Gods')
        repby = repby.concat('神之捲軸')
        torep = torep.concat('Bubble-Gum')
        repby = repby.concat('泡泡糖')
        torep = torep.concat('Flower Vase')
        repby = repby.concat('花瓶')
        //道具翻譯
        torep = torep.concat('Crystallized Phazon')
        repby = repby.concat('相位素材(布)')
        torep = torep.concat('Shade Fragment')
        repby = repby.concat('暗影素材(輕)')
        torep = torep.concat('Repurposed Actuator')
        repby = repby.concat('動力素材(重)')
        torep = torep.concat('Defense Matrix Modulator')
        repby = repby.concat('力場素材(盾)')
        torep = torep.concat('Soul Fragment')
        repby = repby.concat('靈魂斷片')
        torep = torep.concat('Featherweight Shard')
        repby = repby.concat('羽毛碎片(裝備)')
        torep = torep.concat('Voidseeker Shard')
        repby = repby.concat('虛空碎片(武器)')
        torep = torep.concat('Aether Shard')
        repby = repby.concat('以太碎片(魔法)')
        torep = torep.concat('Amnesia Shard')
        repby = repby.concat('失憶碎片(鍛造)')
        //道具說明
        torep = torep.concat('Provides a long-lasting health restoration effect.')
        repby = repby.concat('持續50回合恢復2%基礎體力值。')
        torep = torep.concat('Instantly restores a large amount of health.')
        repby = repby.concat('使用當下恢復100%基礎體力值。')
        torep = torep.concat('Fully restores health, and grants a long-lasting health restoration effect.')
        repby = repby.concat('使用當下體力值全滿並持續100回合恢復2%基礎體力值。')
        torep = torep.concat('Provides a long-lasting mana restoration effect.')
        repby = repby.concat('持續50回合恢復1%基礎魔力值。')
        torep = torep.concat('Instantly restores a moderate amount of mana.')
        repby = repby.concat('使用當下恢復50%基礎魔力值。')
        torep = torep.concat('Fully restores mana, and grants a long-lasting mana restoration effect.')
        repby = repby.concat('使用當下魔力值全滿並持續100回合恢復1%基礎魔力值。')
        torep = torep.concat('Provides a long-lasting spirit restoration effect.')
        repby = repby.concat('持續50回合恢復1%基礎靈力值。')
        torep = torep.concat('Instantly restores a moderate amount of spirit.')
        repby = repby.concat('使用當下恢復50%基礎靈力值。')
        torep = torep.concat('Fully restores spirit, and grants a long-lasting spirit restoration effect.')
        repby = repby.concat('使用當下靈力值全滿並持續100回合恢復1%基礎靈力值。')
        torep = torep.concat('Restores 10 points of Stamina, up to the maximum of 99.')
        repby = repby.concat('恢復10點精力，但不超過99。')
        torep = torep.concat(' When used in battle, also boosts Overcharge and Spirit by 10% for ten turns.')
        repby = repby.concat('當在戰鬥中使用，同時回復怒氣值和靈力值10%持續十回合。')
        torep = torep.concat('Fully restores all vitals, and grants long-lasting restoration effects.')
        repby = repby.concat('狀態全滿並持續100回合恢復基礎體力2%.魔力1%.靈力1%。')
        torep = torep.concat('You gain ')
        repby = repby.concat('你獲得')
        torep = torep.concat(' resistance to Fire elemental attacks and do 25% more damage with Fire magicks.')
        repby = repby.concat('的火焰抗性且火焰魔法傷害增加25%。')
        torep = torep.concat(' resistance to Cold elemental attacks and do 25% more damage with Cold magicks.')
        repby = repby.concat('的冰霜抗性且冰霜魔法傷害增加25%。')
        torep = torep.concat(' resistance to Elec elemental attacks and do 25% more damage with Elec magicks.')
        repby = repby.concat('的閃電抗性且閃電魔法傷害增加25%。')
        torep = torep.concat(' resistance to Wind elemental attacks and do 25% more damage with Wind magicks.')
        repby = repby.concat('的狂風抗性且狂風魔法傷害增加25%。')
        torep = torep.concat(' resistance to Holy elemental attacks and do 25% more damage with Holy magicks.')
        repby = repby.concat('的神聖抗性且神聖魔法傷害增加25%。')
        torep = torep.concat(' resistance to Dark elemental attacks and do 25% more damage with Dark magicks.')
        repby = repby.concat('的黑暗抗性且黑暗魔法傷害增加25%。')
        torep = torep.concat('Grants the Haste effect.')
        repby = repby.concat('使用產生100回合加速效果(增加行動速度60%)。')
        torep = torep.concat('Grants the Protection effect.')
        repby = repby.concat('使用產生100回合保護效果(吸收50%傷害值)。')
        torep = torep.concat('Grants the Haste and Protection effects.')
        repby = repby.concat('產生加速和保護的效果。')
        torep = torep.concat('with twice the normal duration.')
        repby = repby.concat('(200回合)')
        torep = torep.concat('Grants the Absorb effect.')
        repby = repby.concat('使用後獲得吸收效果(吸收機率為100%)。')
        torep = torep.concat('Grants the Shadow Veil effect.')
        repby = repby.concat('使用產生100回合閃避效果(增加迴避率30%)。')
        torep = torep.concat('Grants the Spark of Life effect.')
        repby = repby.concat('使用產生100回生命火花效果(觸發消耗25%基礎靈力值殘血50%)。')
        torep = torep.concat('Grants the Absorb, Shadow Veil and Spark of Life effects.')
        repby = repby.concat('同時產生吸收，閃避，以及生命花火效果。')
        torep = torep.concat('There are three flowers in a vase. The third flower is green.')
        repby = repby.concat('物理/魔法的傷害.命中.暴擊率提升，迴避/抵抗率提升。(+25%傷害持續50回合)')
        torep = torep.concat('It is time to kick ass and chew bubble-gum... and here is some gum.')
        repby = repby.concat('物理/魔法傷害大幅提升，必定命中且必定暴擊。同時每回合補充基礎體力.魔力值的20%。(+100%傷害持續50回合)')
        //物品說明
        torep = torep.concat('Various bits and pieces of scrap cloth. These can be used to mend the condition of an equipment piece.')
        repby = repby.concat('各種零碎的布料，用於修復裝備')
        torep = torep.concat('Various bits and pieces of scrap leather. These can be used to mend the condition of an equipment piece.')
        repby = repby.concat('各種零碎的皮革，用於修復裝備')
        torep = torep.concat('Various bits and pieces of scrap metal. These can be used to mend the condition of an equipment piece.')
        repby = repby.concat('各種零碎的金屬，用於修復裝備')
        torep = torep.concat('Various bits and pieces of scrap wood. These can be used to mend the condition of an equipment piece.')
        repby = repby.concat('各種零碎的木材，用於修復裝備')
        torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade cloth armor.')
        repby = repby.concat('一些從怪物身上收集到的材料，用於升級布甲')
        torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade staffs and shields.')
        repby = repby.concat('一些從怪物身上收集到的材料，用於升級法杖和盾牌')
        torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade heavy armor and weapons')
        repby = repby.concat('一些從怪物身上收集到的材料，用於升級重甲和武器')
        torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade light armor')
        repby = repby.concat('一些從怪物身上收集到的材料，用於升級輕甲')
        torep = torep.concat('A cylindrical object filled to the brim with arcano-technological energy. Required to restore advanced armor and shields to full condition.')
        repby = repby.concat('一個邊緣充斥著神秘科技能量的圓柱形物體，用於修復高級護甲和盾牌')
        torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to upgrade equipment bonuses to')
        repby = repby.concat('從怪物身上收集的材料，用於升級裝備的')
        torep = torep.concat('A small vial filled with a catalytic substance necessary for upgrading and repairing equipment in the forge. This is permanently consumed on use.')
        repby = repby.concat('一個裝著升級與修復裝備必須的催化劑的小瓶子，每使用一次就會消耗一個')
        torep = torep.concat('When used with a weapon, this shard will temporarily imbue it with the')
        repby = repby.concat('當用在一件武器上時，會臨時給予')
        torep = torep.concat('When used with an equipment piece, this shard will temporarily imbue it with the')
        repby = repby.concat('當用在一件裝備上時，會臨時給予')
        torep = torep.concat('Can be used to reset the unlocked potencies and experience of an equipment piece.')
        repby = repby.concat('可以用於重置裝備的潛能等級')
        torep = torep.concat('Suffused Aether enchantment')
        repby = repby.concat('瀰漫的以太的附魔效果')
        torep = torep.concat('Featherweight Charm enchantment')
        repby = repby.concat('輕如鴻毛的附魔效果')
        torep = torep.concat('Voidseeker')
        repby = repby.concat('虛空探索者')
        torep = torep.concat('s Blessing enchantment')
        repby = repby.concat('的祝福的附魔效果')
        torep = torep.concat('These fragments can be used in the forge to permanently soulfuse an equipment piece to you, which will make it level as you do.')
        repby = repby.concat('這個碎片可以將一件裝備與你靈魂綁定，靈魂綁定的裝備會隨著你的等級一同成長。')
        torep = torep.concat('You can fuse this crystal with a monster in the monster tab to increase its')
        repby = repby.concat('你可以用這種水晶在怪物實驗室裡面為一個怪物提升它的')
        //抗性
        torep = torep.concat('Fire Resistance')
        repby = repby.concat('火屬性抗性')
        torep = torep.concat('Cold Resistance')
        repby = repby.concat('冰屬性抗性')
        torep = torep.concat('Electrical Resistance')
        repby = repby.concat('電屬性抗性')
        torep = torep.concat('Wind Resistance')
        repby = repby.concat('風屬性抗性')
        torep = torep.concat('Holy Resistance')
        repby = repby.concat('聖屬性抗性')
        torep = torep.concat('Dark Resistance')
        repby = repby.concat('暗屬性抗性')
        //怪物相關
        torep = torep.concat('Non-discerning monsters like to munch on this chow.')
        repby = repby.concat('不挑食的初級怪物喜歡吃這種食物')
        torep = torep.concat('Mid-level monsters like to feed on something slightly more palatable, like these scrumptious edibles.')
        repby = repby.concat('中級怪物喜歡吃更好吃的食物，比如這種')
        torep = torep.concat('High-level monsters would very much prefer this highly refined level of dining if you wish to parlay their favor.')
        repby = repby.concat('如果你想受高等級怪物的青睞的話，請餵牠們吃這種精煉的食物吧')
        torep = torep.concat('Tiny pills filled with delicious artificial happiness. Use on monsters to restore morale if you cannot keep them happy. It beats leaving them sad and miserable.')
        repby = repby.concat('美味的人造藥丸，滿溢著的幸福，沒法讓怪物開心的話，就用它來恢復怪物的士氣，趕走怪物的悲傷和沮喪吧')
        torep = torep.concat('An advanced technological artifact from an ancient and long-lost civilization. Handing these in at the Shrine of Snowflake will grant you a reward.')
        repby = repby.concat('一個發達古文明的技術結晶，把它交給雪花神殿的雪花女神來獲得你的獎勵')
        torep = torep.concat('You can exchange this token for the chance to face a legendary monster by itself in the Ring of Blood.')
        repby = repby.concat('你可以用這些令牌在浴血擂台裡面換取與傳奇怪物對陣的機會')
        torep = torep.concat('You can use this token to unlock monster slots in the Monster Lab, as well as to upgrade your monsters.')
        repby = repby.concat('你可以用這些令牌開啟額外的怪物實驗室槽位，也可以升級你的怪物')
        torep = torep.concat('A sapling from Yggdrasil, the World Tree')
        repby = repby.concat('一棵來自世界樹的樹苗')
        torep = torep.concat('A plain black 100% cotton T-Shirt. On the front, an inscription in white letters reads')
        repby = repby.concat('一件平凡無奇的100%純棉T恤衫，在前面用白色的字母寫著')
        torep = torep.concat('I defeated Real Life, and all I got was this lousy T-Shirt.')
        repby = repby.concat('戰勝了現實後，我就得到了這麼一件噁心的T恤衫')
        torep = torep.concat('No longer will MBP spread havoc, destruction, and melted polar ice caps.')
        repby = repby.concat('不會再有人熊豬擴散浩劫、破壞、和融化的極地冰帽了。')
        torep = torep.concat('You found this item in the lair of a White Bunneh. It appears to be a dud.')
        repby = repby.concat('這似乎是你在一隻殺人兔的巢穴裡發現的一顆未爆彈。')
        torep = torep.concat('A Lilac flower given to you by a Mithra when you defeated her. Apparently, this type was her favorite.')
        repby = repby.concat('擊敗小貓女後她送你的紫丁香。很顯然這品種是她的最愛。')
        torep = torep.concat('Taken from the destroyed remains of a Dalek shell.')
        repby = repby.concat('從戴立克的殘骸裡取出來的音箱。')
        torep = torep.concat('Given to you by Konata when you defeated her. It smells of Timotei.')
        repby = repby.concat('擊敗泉此方後獲得的藍發。聞起來有 Timotei 洗髮精的味道')
        torep = torep.concat('Given to you by Mikuru when you defeated her. If you wear it, keep it to yourself.')
        repby = repby.concat('擊敗朝比奈實玖瑠後獲得的兔女郎裝。不要告訴別人你有穿過。')
        torep = torep.concat('Given to you by Ryouko when you defeated her. You decided to name it Achakura, for no particular reason.')
        repby = repby.concat('擊敗朝倉涼子後獲得的人形。你決定取名叫朝倉，這沒什麼特別的理由。')
        torep = torep.concat('Given to you by Yuki when you defeated her. She looked better without them anyway.')
        repby = repby.concat('擊敗長門有希後獲得的眼鏡。她不戴眼鏡時看起來好多了。')
        torep = torep.concat('An Invisible Pink')
        repby = repby.concat('從隱形粉紅獨角獸頭上取下來的')
        torep = torep.concat('taken from the Invisible Pink Unicorn.')
        repby = repby.concat('一隻角')
        torep = torep.concat('It doesn')
        repby = repby.concat('它')
        torep = torep.concat('t weigh anything and has the consistency of air, but you')
        repby = repby.concat('很像空氣一樣輕，幾乎沒有重量')
        torep = torep.concat('re quite sure it')
        repby = repby.concat('但是你很確定它是真實存在的')
        torep = torep.concat('A nutritious pasta-based appendage from the Flying Spaghetti Monster.')
        repby = repby.concat('一條用飛行意大利麵怪物身上的麵糰做成的營養附肢。')
        torep = torep.concat('You found these in your Xmas stocking when you woke up. Maybe Snowflake will give you something for them.')
        repby = repby.concat('你醒來時,在你的聖誕襪裡發現這些東西。說不定用它可以和雪花女神交換禮物。')
        torep = torep.concat('This box is said to contain an item of immense power. You should get Snowflake to open it.')
        repby = repby.concat('傳說此盒子封印了一件擁有巨大力量的裝備。你應該找雪花女神去打開它。')
        //友情小馬炮
        torep = torep.concat('A 1/10th scale figurine of Twilight Sparkle, the cutest, smartest, all-around best pony. According to Pinkie Pie, anyway.')
        repby = repby.concat('NO.1 暮光閃閃的 1/10 比例縮放公仔。最可愛、最聰明，最全能的小馬。(根據萍琪的說法，嗯…) ')
        torep = torep.concat('A 1/10th scale figurine of Rainbow Dash, flier extraordinaire. Owning this will make you about 20% cooler, but it probably took more than 10 seconds to get one.')
        repby = repby.concat('NO.2 雲寶黛西的 1/10 比例縮放公仔。傑出的飛行員。擁有這個公仔可以讓你多酷大約 20%，但為了得到她你得多花 10 秒！ ')
        torep = torep.concat('A 1/10th scale figurine of Applejack, the loyalest of friends and most dependable of ponies. Equestria&amp;#039;s best applebucker, and founder of Appleholics Anonymous.')
        repby = repby.concat('NO.3 蘋果傑克的 1/10 比例縮放公仔。最忠誠的朋友，最可靠的小馬。阿奎斯陲亞最好的蘋果採收員，同時也是蘋果農莊的創始馬。 ')
        torep = torep.concat('A 1/10th scale figurine of Fluttershy, resident animal caretaker. You&amp;#039;re going to love her. Likes baby dragons; Hates grown up could-eat-a-pony-in-one-bite dragons.')
        repby = repby.concat('NO.4 小蝶的 1/10 比例縮放公仔。小馬鎮動物的褓姆，大家都喜愛她。喜歡幼龍；討厭能一口吞掉小馬的大龍。 ')
        torep = torep.concat('A 1/10th scale figurine of Pinkie Pie, a celebrated connoisseur of cupcakes and confectioneries. She just wants to keep smiling forever.')
        repby = repby.concat('NO.5 萍琪的 1/10 比例縮放公仔。一位著名的杯子蛋糕與各式餅乾糖果的行家。她只想讓大家永遠保持笑容。 ')
        torep = torep.concat('A 1/10th scale figurine of Rarity, the mistress of fashion and elegance. Even though she&amp;#039;s prim and proper, she could make it in a pillow fight.')
        repby = repby.concat('NO.6 瑞瑞的 1/10 比例縮放公仔。時尚與品味的的女主宰。她總是能在枕頭大戰中保持拘謹矜持。 ')
        torep = torep.concat('A 1/10th scale figurine of The Great and Powerful Trixie. After losing her wagon, she now secretly lives in the Ponyville library with her girlfriend, Twilight Sparkle.')
        repby = repby.concat('NO.7 崔克茜的 1/10 比例縮放公仔。偉大的、法力無邊的崔克茜。失去她的篷車後，她現在偷偷的與她的女友暮光閃閃住在小馬鎮的圖書館中。 ')
        torep = torep.concat('A 1/10th scale figurine of Princess Celestia, co-supreme ruler of Equestria. Bored of the daily squabble of the Royal Court, she has recently taken up sock swapping.')
        repby = repby.concat('NO.8 塞拉斯提婭公主的 1/10 比例縮放公仔。阿奎斯陲亞大陸的最高統治者。對每日的皇家爭吵感到無聊，她近日開始穿上不成對的襪子。 ')
        torep = torep.concat('A 1/10th scale figurine of Princess Luna, aka Nightmare Moon. After escaping her 1000 year banishment to the moon, she was grounded for stealing Celestia&amp;#039;s socks.')
        repby = repby.concat('NO.9 露娜公主的 1/10 比例縮放公仔。又名夢靨之月。在結束了一千年的放逐後，她從月球回到阿奎斯陲亞偷走了塞拉斯提婭的襪子。 ')
        torep = torep.concat('A 1/10th scale figurine of Apple Bloom, Applejack&amp;#039;s little sister. Comes complete with a &amp;quot;Draw Your Own Cutie Mark&amp;quot; colored pencil and permanent tattoo applicator set.')
        repby = repby.concat('NO.10 小萍花的 1/10 比例縮放公仔。蘋果傑克的小妹。使用了“畫出妳自己的可愛標誌”彩色鉛筆與永久紋身組後，生命更加的完整了。 ')
        torep = torep.concat('A 1/10th scale figurine of Scootaloo. Die-hard Dashie fanfilly, best pony of the Cutie Mark Crusaders, and inventor of the Wingboner Propulsion Drive. 1/64th chicken.')
        repby = repby.concat('NO.11 飛板露的 1/10 比例縮放公仔。雲寶黛西的鐵桿年輕迷妹，可愛標誌十字軍中最棒的小馬，以及蠢翅動力推進系統的發明者。有 1/64 的組成成分是魯莽。 ')
        torep = torep.concat('A 1/10th scale figurine of Sweetie Belle, Rarity&amp;#039;s little sister. Comes complete with evening gown and cocktail dress accessories made of 100% Dumb Fabric.')
        repby = repby.concat('NO.12 甜貝兒的 1/10 比例縮放公仔。瑞瑞的小妹。在穿上 100% 蠢布料製成的晚禮服與宴會短裙後更加完美了。 ')
        torep = torep.concat('A 1/10th scale figurine of Big Macintosh, Applejack&amp;#039;s older brother. Famed applebucker and draft pony, and an expert in applied mathematics.')
        repby = repby.concat('NO.13 大麥克的 1/10 比例縮放公仔。蘋果傑克的大哥。有名的蘋果採收員和大力馬，同時也是實用數學的專家。 ')
        torep = torep.concat('A 1/10th scale figurine of Spitfire, team leader of the Wonderbolts. Dashie&amp;#039;s idol and occasional shipping partner. Doesn&amp;#039;t actually spit fire.')
        repby = repby.concat('NO.14 爆火的 1/10 比例縮放公仔。驚奇閃電的領導者。雲寶黛西的偶像和臨時飛行搭檔。實際上不會吐火。 ')
        torep = torep.concat('A 1/10th scale figurine of Derpy Hooves, Ponyville&amp;#039;s leading mailmare. Outspoken proponent of economic stimulus through excessive muffin consumption.')
        repby = repby.concat('NO.15 小呆的 1/10 比例縮放公仔。小馬鎮上重要的郵差馬。直言不諱的主張以大量食用馬芬的方式來刺激經濟。 ')
        torep = torep.concat('A 1/10th scale figurine of Lyra Heartstrings. Features twenty-six points of articulation, replaceable pegasus hoofs, and a detachable unicorn horn.')
        repby = repby.concat('NO.16 天琴心弦的 1/10 比例縮放公仔。擁有 26 個可動關節，可更換的飛馬蹄與一個可拆卸的獨角獸角是其特色。 ')
        torep = torep.concat('A 1/10th scale figurine of Octavia. Famous cello musician; believed to have created the Octatonic scale, the Octahedron, and the Octopus.')
        repby = repby.concat('NO.17 奧塔維亞的 1/10 比例縮放公仔。著名的大提琴家；據信創造了八度空間、八面體以及章魚。 ')
        torep = torep.concat('A 1/10th scale figurine of Zecora, a mysterious zebra from a distant land. She&amp;#039;ll never hesitate to mix her brews or lend you a hand. Err, hoof.')
        repby = repby.concat('NO.18 澤科拉的 1/10 比例縮放公仔。一位來自遠方的神秘斑馬。她會毫不遲疑的攪拌她的魔藥或助你一臂之力。呃，我是說一蹄之力… ')
        torep = torep.concat('A 1/10th scale figurine of Cheerilee, Ponyville&amp;#039;s most beloved educational institution. Your teachers will never be as cool as Cheerilee.')
        repby = repby.concat('NO.19 車厘子的 1/10 比例縮放公仔。小馬鎮最有愛心的教育家。你的老師絕對不會像車厘子這麼酷的！ ')
        torep = torep.concat('A 1/10th scale bobblehead figurine of Vinyl Scratch, the original DJ P0n-3. Octavia&amp;#039;s musical rival and wub wub wub interest.')
        repby = repby.concat('NO.20 維尼爾的 1/10 比例縮放搖頭公仔。是 DJ P0n-3 的本名。為奧塔維亞在音樂上的對手，喜歡重低音喇叭。 ')
        torep = torep.concat('A 1/10th scale figurine of Daring Do, the thrill-seeking, action-taking mare starring numerous best-selling books. Dashie&amp;#039;s recolor and favorite literary character.')
        repby = repby.concat('NO.21 天馬無畏的 1/10 比例縮放公仔。追尋刺激，有如動作片主角一般的小馬，為一系列暢銷小說的主角。是雲寶黛西最喜歡的角色，也是帶領她進入閱讀世界的原因。 ')
        torep = torep.concat('A 1/10th scale figurine of Doctor Whooves. Not a medical doctor. Once got into a hoof fight with Applejack over a derogatory remark about apples.')
        repby = repby.concat('NO.22 神秘博士的 1/10 比例縮放公仔。不是醫生。曾經與蘋果傑克陷入一場因貶低蘋果的不當發言而產生的蹄鬥。 ')
        torep = torep.concat('A 1/10th scale figurine of Berry Punch. Overly protective parent pony and Ponyville&amp;#039;s resident lush. It smells faintly of fruit wine.')
        repby = repby.concat('NO.23 酸梅酒的 1/10 比例縮放公仔。有過度保護傾向的小馬，也是小馬鎮的萬年酒鬼。聞起來有淡淡水果酒的氣味。 ')
        torep = torep.concat('A 1/10th scale figurine of Bon-Bon. Usually seen in the company of Lyra. Suffers from various throat ailments that make her sound different every time you see her.')
        repby = repby.concat('NO.24 糖糖的 1/10 比例縮放公仔。常常被目擊與天琴心弦在一起。患有許多呼吸道相關的疾病，使你每次遇到她的時候她的聲音都不同。 ')
        torep = torep.concat('A 1/10th scale fluffy figurine of Fluffle Puff. Best Bed Forever.')
        repby = repby.concat('NO.25 毛毛小馬 1/10 比例縮放的毛茸茸玩偶。讓你想要永遠躺在上面。 ')
        torep = torep.concat('A lifesize figurine of Angel Bunny, Fluttershy&amp;#039;s faithful yet easily vexed pet and life partner. All-purpose assistant, time keeper, and personal attack alarm.')
        repby = repby.concat('NO.26 天使兔的等身大玩偶。為小蝶忠實且易怒的寵物及伴侶。萬能助理、報時器、受到人身攻擊時的警報器。 ')
        torep = torep.concat('A lifesize figurine of Gummy, Pinkie Pie&amp;#039;s faithful pet. Usually found lurking in your bathtub. While technically an alligator, he is still arguably the best pony.')
        repby = repby.concat('NO.27 甘米的等身大玩偶。是萍琪的忠實寵物。經常被發現潛伏在你的浴缸裡。雖然技術上是隻短吻鱷，但牠仍然可以稱得上是最棒的小馬。 ')
        //文物獎盃
        torep = torep.concat('Precursor Artifact')
        repby = repby.concat('舊世界文物')
        torep = torep.concat('Iridium Sprinkler')
        repby = repby.concat('銥合金灑水器')
        torep = torep.concat('ManBearPig Tail')
        repby = repby.concat('人熊豬的尾巴(層級2)')
        torep = torep.concat('Holy Hand Grenade of Antioch')
        repby = repby.concat('安提阿的神聖手榴彈(層級2)')
        torep = torep.concat('Mithra\'s Flower')
        repby = repby.concat('貓人族的花(層級2)')
        torep = torep.concat('Dalek Voicebox')
        repby = repby.concat('戴立克音箱(層級2)')
        torep = torep.concat('Lock of Blue Hair')
        repby = repby.concat('一綹藍髮(層級3)')
        torep = torep.concat('Bunny-Girl Costume')
        repby = repby.concat('兔女郎裝(層級2)')
        torep = torep.concat('Hinamatsuri Doll')
        repby = repby.concat('雛人形(層級3)')
        torep = torep.concat('Broken Glasses')
        repby = repby.concat('破碎的眼鏡(層級3)')
        torep = torep.concat('Sapling')
        repby = repby.concat('樹苗(層級4)')
        torep = torep.concat('Black T-Shirt')
        repby = repby.concat('黑色Ｔ恤(層級4)')
        torep = torep.concat('Unicorn Horn')
        repby = repby.concat('獨角獸的角(層級5)')
        torep = torep.concat('Noodly Appendage')
        repby = repby.concat('麵條般的附肢(層級6)')
        torep = torep.concat('Stocking Stuffers')
        repby = repby.concat('聖誕襪小禮物(層級7)')
        torep = torep.concat('Dinosaur Egg')
        repby = repby.concat('恐龍蛋(層級7)')
        torep = torep.concat('Precursor Smoothie Blender')
        repby = repby.concat('舊世界冰沙機(層級8)')
        torep = torep.concat('Rainbow Smoothie')
        repby = repby.concat('彩虹冰沙(層級7)')
        torep = torep.concat('Tenbora\'s Box')
        repby = repby.concat('天菠拉的盒子(層級9)')
        torep = torep.concat('Figurine')
        repby = repby.concat('塑像')
        //怪物物品
        torep = torep.concat('Monster Chow')
        repby = repby.concat('怪物口糧|低|')
        torep = torep.concat('Monster Edibles')
        repby = repby.concat('怪物食品|中|')
        torep = torep.concat('Monster Cuisine')
        repby = repby.concat('怪物料理|高|')
        torep = torep.concat('Happy Pills')
        repby = repby.concat('快樂藥丸')
        torep = torep.concat('Token of Blood')
        repby = repby.concat('血之令牌')
        torep = torep.concat('Chaos Token')
        repby = repby.concat('混沌令牌')
        torep = torep.concat('Crystal of Vigor')
        repby = repby.concat('力量水晶')
        torep = torep.concat('Crystal of Finesse')
        repby = repby.concat('靈巧水晶')
        torep = torep.concat('Crystal of Swiftness')
        repby = repby.concat('敏捷水晶')
        torep = torep.concat('Crystal of Fortitude')
        repby = repby.concat('體質水晶')
        torep = torep.concat('Crystal of Cunning')
        repby = repby.concat('智力水晶')
        torep = torep.concat('Crystal of Knowledge')
        repby = repby.concat('知識水晶')
        torep = torep.concat('Crystal of Flames')
        repby = repby.concat('火之水晶')
        torep = torep.concat('Crystal of Frost')
        repby = repby.concat('冰之水晶')
        torep = torep.concat('Crystal of Lightning')
        repby = repby.concat('雷之水晶')
        torep = torep.concat('Crystal of Tempest')
        repby = repby.concat('風之水晶')
        torep = torep.concat('Crystal of Devotion')
        repby = repby.concat('神聖水晶')
        torep = torep.concat('Crystal of Corruption')
        repby = repby.concat('暗黑水晶')
        torep = torep.concat('Crystal of Quintessence')
        repby = repby.concat('靈魂水晶')
        //物品類型
        torep = torep.concat('Consumable')
        repby = repby.concat('消費品')
        torep = torep.concat('Artifacts and Trophies')
        repby = repby.concat('文物和獎盃')
        torep = torep.concat('Artifact')
        repby = repby.concat('文物')
        torep = torep.concat('Trophy')
        repby = repby.concat('戰利品')
        torep = torep.concat('Token')
        repby = repby.concat('代幣')
        torep = torep.concat('Crystal')
        repby = repby.concat('水晶')
        torep = torep.concat('Monster Food')
        repby = repby.concat('怪物食物')
        torep = torep.concat('Material')
        repby = repby.concat('素材')
        torep = torep.concat('Collectable')
        repby = repby.concat('珍藏品')
        //材料
        torep = torep.concat('Catalyst')
        repby = repby.concat('修復劑')
        torep = torep.concat('Low-Grade')
        repby = repby.concat('低階')
        torep = torep.concat('Mid-Grade')
        repby = repby.concat('中階')
        torep = torep.concat('High-Grade')
        repby = repby.concat('高階')
        torep = torep.concat('Cloth');
        repby = repby.concat('布料');
        torep = torep.concat('Leather')
        repby = repby.concat('皮革')
        torep = torep.concat('Wood')
        repby = repby.concat('木材')
        torep = torep.concat('Metals')
        repby = repby.concat('金屬')
        torep = torep.concat('Metal')
        repby = repby.concat('金屬')
        torep = torep.concat('Scrap')
        repby = repby.concat('廢棄')
        repby = repby.concat('Materials')
        torep = torep.concat('材料')
        //素材說明
        torep = torep.concat('Some materials scavenged from fallen adventurers by a monster')
        repby = repby.concat('從被擊倒的冒險者身上收集來的材料')
        torep = torep.concat('Required to upgrade equipment bonuses to')
        repby = repby.concat('裝備強化之材料')
        torep = torep.concat('Physical Base Damage')
        repby = repby.concat('(物理傷害)')
        torep = torep.concat('Physical Hit Chance')
        repby = repby.concat('(物理命中率)')
        torep = torep.concat('Magical Base Damage')
        repby = repby.concat('(魔法傷害)')
        torep = torep.concat('Magical Hit Chance')
        repby = repby.concat('(魔法命中率)')
        torep = torep.concat('Physical Defense')
        repby = repby.concat('(物理緩傷)')
        torep = torep.concat('Evade Chance')
        repby = repby.concat('(迴避率)')
        torep = torep.concat('Block Chance')
        repby = repby.concat('(格擋率)')
        torep = torep.concat('Parry Chance')
        repby = repby.concat('(招架率)')
        torep = torep.concat('Elemental Magic Proficiency')
        repby = repby.concat('(元素熟練)')
        torep = torep.concat('Divine Magic Proficiency')
        repby = repby.concat('(聖熟練)')
        torep = torep.concat('Forbidden Magic Proficiency')
        repby = repby.concat('(暗熟練)')
        torep = torep.concat('Deprecating Magic Proficiency')
        repby = repby.concat('(貶抑熟練)')
        torep = torep.concat('Supportive Magic Proficiency')
        repby = repby.concat('(輔助熟練)')
        torep = torep.concat('Fire Spell Damage')
        repby = repby.concat('(火焰魔傷)')
        torep = torep.concat('Cold Spell Damage')
        repby = repby.concat('(冰霜魔傷)')
        torep = torep.concat('Elec Spell Damage')
        repby = repby.concat('(閃電魔傷)')
        torep = torep.concat('Wind Spell Damage')
        repby = repby.concat('(狂風魔傷)')
        torep = torep.concat('Holy Spell Damage')
        repby = repby.concat('(神聖魔傷)')
        torep = torep.concat('Dark Spell Damage')
        repby = repby.concat('(黑暗魔傷)')
        torep = torep.concat('Crushing Mitigation')
        repby = repby.concat('(敲擊緩傷)')
        torep = torep.concat('Slashing Mitigation')
        repby = repby.concat('(砍擊緩傷)')
        torep = torep.concat('Piercing Mitigation')
        repby = repby.concat('(刺擊緩傷)')
        torep = torep.concat('Fire Mitigation')
        repby = repby.concat('(火焰緩傷)')
        torep = torep.concat('Cold Mitigation')
        repby = repby.concat('(冰霜緩傷)')
        torep = torep.concat('Elec Mitigation')
        repby = repby.concat('(閃電緩傷)')
        torep = torep.concat('Wind Mitigation')
        repby = repby.concat('(狂風緩傷)')
        torep = torep.concat('Holy Mitigation')
        repby = repby.concat('(神聖緩傷)')
        torep = torep.concat('Dark Mitigation')
        repby = repby.concat('(黑暗緩傷)')
        torep = torep.concat('Strength')
        repby = repby.concat('(力量)')
        torep = torep.concat('Dexterity')
        repby = repby.concat('(靈巧)')
        torep = torep.concat('Agility')
        repby = repby.concat('(敏捷)')
        torep = torep.concat('Endurance')
        repby = repby.concat('(體質)')
        torep = torep.concat('Intelligence')
        repby = repby.concat('(智力)')
        torep = torep.concat('Wisdom')
        repby = repby.concat('(感知)')
        torep = torep.concat('Magical Defense')
        repby = repby.concat('(魔法緩傷)')
        torep = torep.concat('Resist Chance')
        repby = repby.concat('(抵抗率)')
        torep = torep.concat('Physical Crit Chance')
        repby = repby.concat('(物理暴擊率)')
        torep = torep.concat('Magical Crit Chance')
        repby = repby.concat('(魔法暴擊率)')
    }

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
            //裝備屬性
            eqae = eqae.concat('Potency Tier')
            eqac = eqac.concat('潛力等級')
            eqae = eqae.concat('One-handed Weapon')
            eqac = eqac.concat('單手武器')
            eqae = eqae.concat('Two-handed Weapon')
            eqac = eqac.concat('雙手武器')
            eqae = eqae.concat('Heavy Armor')
            eqac = eqac.concat('重甲')
            eqae = eqae.concat('Staff')
            eqac = eqac.concat('法杖')
            eqae = eqae.concat('Cloth Armor')
            eqac = eqac.concat('布甲')
            //裝備屬性
            eqae = eqae.concat('Level')
            eqac = eqac.concat('裝備等級')
            eqae = eqae.concat('Unassigned')
            eqac = eqac.concat('未定')
            eqae = eqae.concat('One-handed Weapon')
            eqac = eqac.concat('單手武器')
            eqae = eqae.concat('Two-handed Weapon')
            eqac = eqac.concat('雙手武器')
            eqae = eqae.concat(' Staff')
            eqac = eqac.concat(' 法杖')
            eqae = eqae.concat('Staff ')
            eqac = eqac.concat(' 法杖')
            eqae = eqae.concat(' 法杖 ')
            eqac = eqac.concat(' Staff')
            eqae = eqae.concat('Shield')
            eqac = eqac.concat('盾牌')
            eqae = eqae.concat('Cloth Armor')
            eqac = eqac.concat('布甲')
            eqae = eqae.concat('Light Armor')
            eqac = eqac.concat('輕甲')
            eqae = eqae.concat('Heavy Armor')
            eqac = eqac.concat('重甲')
            eqae = eqae.concat('Tradeable')
            eqac = eqac.concat('可交易')
            eqae = eqae.concat('Untradeable')
            eqac = eqac.concat('不可交易')
            eqae = eqae.concat('Soulbound')
            eqac = eqac.concat('靈魂連結')
            eqae = eqae.concat('Potency Tier');
            eqac = eqac.concat('潛能層級');
            eqae = eqae.concat('Condition');
            eqac = eqac.concat('耐久度');
            eqae = eqae.concat('Attack Accuracy')
            eqac = eqac.concat('物理命中')
            eqae = eqae.concat('Attack Crit Chance')
            eqac = eqac.concat('物理爆擊率')
            eqae = eqae.concat('Attack Crit Damage')
            eqac = eqac.concat('物理爆擊傷害')
            eqae = eqae.concat('Physical Damage')
            eqac = eqac.concat('物理傷害')
            eqae = eqae.concat('Physical Hit Chance')
            eqac = eqac.concat('物理命中')
            eqae = eqae.concat('Physical Crit Chance')
            eqac = eqac.concat('物理暴擊')
            eqae = eqae.concat('Attack Damage')
            eqac = eqac.concat('攻擊傷害')
            eqae = eqae.concat('Damage Mitigations')
            eqac = eqac.concat('傷害減免')
            eqae = eqae.concat('Parry Chance')
            eqac = eqac.concat('招架概率')
            eqae = eqae.concat('Magic Accuracy')
            eqac = eqac.concat('魔法命中')
            eqae = eqae.concat('Magic Damage')
            eqac = eqac.concat('魔法傷害')
            eqae = eqae.concat('Magic Crit Chance')
            eqac = eqac.concat('魔法暴擊率')
            eqae = eqae.concat('Magic Critical')
            eqac = eqac.concat('魔法暴擊')
            eqae = eqae.concat('Spell Crit Damage')
            eqac = eqac.concat('魔法暴擊傷害')
            eqae = eqae.concat('Mana Conservation')
            eqac = eqac.concat('魔法節省')
            eqae = eqae.concat('Counter-Resist')
            eqac = eqac.concat('反魔法抵抗')
            eqae = eqae.concat('Physical Mitigation')
            eqac = eqac.concat('物理緩傷')
            eqae = eqae.concat('Magical Mitigation')
            eqac = eqac.concat('魔法減傷')
            eqae = eqae.concat('Block Chance')
            eqac = eqac.concat('格擋概率')
            eqae = eqae.concat('Upgrades and Enchantments');
            eqac = eqac.concat('升級與附魔');
            eqae = eqae.concat('Primary Attributes')
            eqac = eqac.concat('屬性(PAB)')
            eqae = eqae.concat('Evade Chance')
            eqac = eqac.concat('迴避概率')
            eqae = eqae.concat('Casting Speed')
            eqac = eqac.concat('詠唱速度')
            eqae = eqae.concat('Resist Chance')
            eqac = eqac.concat('魔免概率')
            eqae = eqae.concat(' Spell Damage')
            eqac = eqac.concat('傷害加成(EDB)')
            eqae = eqae.concat('Spell Damage')
            eqac = eqac.concat('傷害加成(EDB)')
            eqae = eqae.concat('Siphon Spirit')
            eqac = eqac.concat('靈力吸取')
            eqae = eqae.concat('Siphon Magic');
            eqac = eqac.concat('魔力吸取');
            eqae = eqae.concat('Siphon Health')
            eqac = eqac.concat('生命吸取')
            eqae = eqae.concat('Ether Theft')
            eqac = eqac.concat('魔力回流')
            eqae = eqae.concat('Penetrated Armor');
            eqac = eqac.concat('破甲');
            eqae = eqae.concat('Attack Speed')
            eqac = eqac.concat('物理攻擊速度')
            eqae = eqae.concat('Current Owner')
            eqac = eqac.concat('持有者')
            eqae = eqae.concat('Ether Tap')
            eqac = eqac.concat('魔力回流')
            eqae = eqae.concat('Elemental Strike')
            eqac = eqac.concat('屬性攻擊')
            eqae = eqae.concat('Bleeding Wound')
            eqac = eqac.concat('流血')
            eqae = eqae.concat('Lasts for')
            eqac = eqac.concat('持續')
            eqae = eqae.concat('Stunned')
            eqac = eqac.concat('眩暈')
            eqae = eqae.concat('turns')
            eqac = eqac.concat('回合')
            eqae = eqae.concat('Interference')
            eqac = eqac.concat('干涉')
            eqae = eqae.concat('Burden');
            eqac = eqac.concat('負重');
            eqae = eqae.concat('Strength');
            eqac = eqac.concat('力量');
            eqae = eqae.concat('Dexterity');
            eqac = eqac.concat('靈巧');
            eqae = eqae.concat('Agility');
            eqac = eqac.concat('敏捷');
            eqae = eqae.concat('Endurance');
            eqac = eqac.concat('體質');
            eqae = eqae.concat('Intelligence');
            eqac = eqac.concat('智力');
            eqae = eqae.concat('Wisdom');
            eqac = eqac.concat('感知');
            eqae = eqae.concat(' chance');
            eqac = eqac.concat('機率');
            eqae = eqae.concat('Crushing');
            eqac = eqac.concat('破碎');
            eqae = eqae.concat('Piercing');
            eqac = eqac.concat('穿刺');
            eqae = eqae.concat('Slashing');
            eqac = eqac.concat('斬擊');
            eqae = eqae.concat(' Damage');
            eqac = eqac.concat('傷害');
            eqae = eqae.concat(' Hit Chance');
            eqac = eqac.concat('命中');
            eqae = eqae.concat(' Crit Chance');
            eqac = eqac.concat('暴擊率');
            eqae = eqae.concat(' Defense');
            eqac = eqac.concat('防禦');
            eqae = eqae.concat(' Mitigation');
            eqac = eqac.concat('緩傷');
            eqae = eqae.concat(' DOT');
            eqac = eqac.concat('持續性傷害');
            eqae = eqae.concat(' Proficiency');
            eqac = eqac.concat('熟練度(Pro)');
            eqae = eqae.concat('Proficiency');
            eqac = eqac.concat('熟練度(Pro)');
            eqae = eqae.concat('>Elemental');
            eqac = eqac.concat('>元素');
            eqae = eqae.concat('Divine');
            eqac = eqac.concat('聖');
            eqae = eqae.concat('Forbidden');
            eqac = eqac.concat('暗');
            eqae = eqae.concat('Deprecating');
            eqac = eqac.concat('減益');
            eqae = eqae.concat('Supportive');
            eqac = eqac.concat('輔助');
            eqae = eqae.concat('>Fire');
            eqac = eqac.concat('>火焰');
            eqae = eqae.concat('>Cold');
            eqac = eqac.concat('>冰霜');
            eqae = eqae.concat('>Elec');
            eqac = eqac.concat('>閃電');
            eqae = eqae.concat('>Wind');
            eqac = eqac.concat('>狂風');
            eqae = eqae.concat('>Holy');
            eqac = eqac.concat('>神聖');
            eqae = eqae.concat('>Dark');
            eqac = eqac.concat('>黑暗');
            eqae = eqae.concat('Void ');
            eqac = eqac.concat('虛空');
            eqae = eqae.concat('Void');
            eqac = eqac.concat('虛空');
            eqae = eqae.concat('points');
            eqac = eqac.concat('點');
            eqae = eqae.concat(' Strike');
            eqac = eqac.concat('衝擊');
            eqae = eqae.concat('Strike');
            eqac = eqac.concat('衝擊');
            eqae = eqae.concat('None');
            eqac = eqac.concat('無');
            //道具界屬性
            eqae = eqae.concat('Physical');
            eqac = eqac.concat('物理');
            eqae = eqae.concat('Magical');
            eqac = eqac.concat('魔法');
            eqae = eqae.concat('Hollowforged');
            eqac = eqac.concat('虛空化');
            eqae = eqae.concat(' Bonus');
            eqac = eqac.concat('加成');
            eqae = eqae.concat('Counter-Parry');
            eqac = eqac.concat('反制招架');
            eqae = eqae.concat('proof');
            eqac = eqac.concat('抵禦');
            eqae = eqae.concat('Annihilator');
            eqac = eqac.concat('魔法暴傷');
            eqae = eqae.concat('Archmage');
            eqac = eqac.concat('魔法傷害');
            eqae = eqae.concat('Butcher');
            eqac = eqac.concat('武器傷害');
            eqae = eqae.concat('Capacitor');
            eqac = eqac.concat('增加魔力');
            eqae = eqae.concat('Economizer');
            eqac = eqac.concat('魔力節省');
            eqae = eqae.concat('Fatality');
            eqac = eqac.concat('武器暴傷');
            eqae = eqae.concat('Juggernaut');
            eqac = eqac.concat('增加體力');
            eqae = eqae.concat('Overpower');
            eqac = eqac.concat('反制招架');
            eqae = eqae.concat('Penetrator');
            eqac = eqac.concat('反制抵抗');
            eqae = eqae.concat('Spellweaver');
            eqac = eqac.concat('詠唱速度');
            eqae = eqae.concat('Swift衝擊');
            eqac = eqac.concat('物理攻速');
            //論壇修正
            eqae = eqae.concat('虛空seeker');
            eqac = eqac.concat('Voidseeker');
            eqae = eqae.concat('防禦 Matrix Modulator');
            eqac = eqac.concat(' Defense Matrix Modulator');

        }

        function eq5() {
            eqe5 = eqe5.concat('ddsezxcwer')
            eqc5 = eqc5.concat(''); //如果出現問號絕對有問題
            //盾
            eqe5 = eqe5.concat('Buckler');
            eqc5 = eqc5.concat('');
            eqe5 = eqe5.concat('Kite Shield');
            eqc5 = eqc5.concat('');
            eqe5 = eqe5.concat('Tower Shield');
            eqc5 = eqc5.concat('');
            // 單手武器類
            eqe5 = eqe5.concat('Dagger');
            eqc5 = eqc5.concat('*匕首(單)');
            eqe5 = eqe5.concat('Shortsword');
            eqc5 = eqc5.concat('短劍(單)');
            eqe5 = eqe5.concat('Wakizashi');
            eqc5 = eqc5.concat('脇差(單)');
            eqe5 = eqe5.concat('Axe');
            eqc5 = eqc5.concat('斧(單)');
            eqe5 = eqe5.concat('Club');
            eqc5 = eqc5.concat('棍(單)');
            eqe5 = eqe5.concat('Rapier');
            eqc5 = eqc5.concat('西洋劍(單)');
            //雙手
            eqe5 = eqe5.concat('Longsword');
            eqc5 = eqc5.concat('長劍(雙)');
            eqe5 = eqe5.concat('Scythe');
            eqc5 = eqc5.concat('*鐮刀(雙)');
            eqe5 = eqe5.concat('Katana');
            eqc5 = eqc5.concat('太刀(雙)');
            eqe5 = eqe5.concat('Mace');
            eqc5 = eqc5.concat('重槌(雙)');
            eqe5 = eqe5.concat('Estoc');
            eqc5 = eqc5.concat('刺劍(雙)');
            //法杖
            eqe5 = eqe5.concat('Staff');
            eqc5 = eqc5.concat('法杖');
            //布甲
            eqe5 = eqe5.concat('Cap');
            eqc5 = eqc5.concat('兜帽');
            eqe5 = eqe5.concat('Robe');
            eqc5 = eqc5.concat('長袍');
            eqe5 = eqe5.concat('Gloves');
            eqc5 = eqc5.concat('手套');
            eqe5 = eqe5.concat('Pants');
            eqc5 = eqc5.concat('短褲');
            eqe5 = eqe5.concat('Shoes');
            eqc5 = eqc5.concat('鞋');
            //輕甲
            eqe5 = eqe5.concat('Helmet');
            eqc5 = eqc5.concat('頭盔');
            eqe5 = eqe5.concat('Breastplate');
            eqc5 = eqc5.concat('護胸');
            eqe5 = eqe5.concat('Gauntlets');
            eqc5 = eqc5.concat('手套');
            eqe5 = eqe5.concat('Leggings');
            eqc5 = eqc5.concat('護腿');
            //重甲
            eqe5 = eqe5.concat('Cuirass');
            eqc5 = eqc5.concat('胸甲');
            eqe5 = eqe5.concat('Armor');
            eqc5 = eqc5.concat('盔甲');
            eqe5 = eqe5.concat('Greaves');
            eqc5 = eqc5.concat('護脛');
            eqe5 = eqe5.concat('Sabatons');
            eqc5 = eqc5.concat('重靴');
            eqe5 = eqe5.concat('Boots');
            eqc5 = eqc5.concat('長靴');
        }

        function eq4() {
            //盾或者材料,武器不會出現這個
            eqe4 = eqe4.concat('ddsezxcwer'); //防止空缺
            eqc4 = eqc4.concat('');
            //盾
            eqe4 = eqe4.concat('Buckler');
            eqc4 = eqc4.concat('圓盾');
            eqe4 = eqe4.concat('Kite Shield');
            eqc4 = eqc4.concat('鳶盾');
            eqe4 = eqe4.concat('Tower Shield');
            eqc4 = eqc4.concat('*塔盾');
            eqe4 = eqe4.concat('Force Shield');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >力場盾</span>');
            //布甲
            eqe4 = eqe4.concat('Cotton ');
            eqc4 = eqc4.concat('棉質(布)');
            eqe4 = eqe4.concat('Gossamer');
            eqc4 = eqc4.concat('*薄紗(布)');
            eqe4 = eqe4.concat('Phase');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >相位</span><span style=\"background:#FFFFFF;color:#000000\" >(布)</span>');
            //輕甲
            eqe4 = eqe4.concat('Leather');
            eqc4 = eqc4.concat('皮革<span style=\"background:#d498ff;color:#FFFFFF\" >(輕)</span>');
            eqe4 = eqe4.concat('Kevlar');
            eqc4 = eqc4.concat('*凱夫拉<span style=\"background:#d498ffe;color:#FFFFFF\" >(輕)</span>');
            eqe4 = eqe4.concat('Shade');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >暗影</span><span style=\"background:#d498ff;color:#FFFFFF\" >(輕)</span>');
            //重甲
            eqe4 = eqe4.concat('Plate');
            eqc4 = eqc4.concat('板甲<span style=\"background:#6b06b4;color:#FFFFFF\" >(重)</span>');
            eqe4 = eqe4.concat('Power');
            eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >動力</span><span style=\"background:#6b06b4;color:#FFFFFF\" >(重)</span>');
            //法杖
            eqe4 = eqe4.concat('Ebony');
            eqc4 = eqc4.concat('*烏木');
            eqe4 = eqe4.concat('Redwood');
            eqc4 = eqc4.concat('紅木');
            eqe4 = eqe4.concat('Willow');
            eqc4 = eqc4.concat('柳木');
            eqe4 = eqe4.concat('Oak');
            eqc4 = eqc4.concat('橡木');
            eqe4 = eqe4.concat('Katalox');
            eqc4 = eqc4.concat('鐵木');
        }

        function eq3() {
            eqe3 = eqe3.concat('adfouhasd') //防止空缺
            eqc3 = eqc3.concat('')
            //防具後綴//
            eqe3 = eqe3.concat('of Negation')
            eqc3 = eqc3.concat('否定')
            eqe3 = eqe3.concat('of the Shadowdancer')
            eqc3 = eqc3.concat('<span style=\"color:red\" >影武</span>')
            eqe3 = eqe3.concat('of the Arcanist')
            eqc3 = eqc3.concat('奧術')
            eqe3 = eqe3.concat('of the Fleet')
            eqc3 = eqc3.concat('迅捷')
            eqe3 = eqe3.concat('of Dampening')
            eqc3 = eqc3.concat('防碎')
            eqe3 = eqe3.concat('of Stoneskin')
            eqc3 = eqc3.concat('防斬')
            eqe3 = eqe3.concat('of Deflection')
            eqc3 = eqc3.concat('防刺')
            eqe3 = eqe3.concat('of the Battlecaster');
            eqc3 = eqc3.concat('魔戰');
            eqe3 = eqe3.concat('of the Nimble');
            eqc3 = eqc3.concat('招架');
            eqe3 = eqe3.concat('of the Barrier')
            eqc3 = eqc3.concat('格擋')
            eqe3 = eqe3.concat('of Protection')
            eqc3 = eqc3.concat('物防')
            eqe3 = eqe3.concat('of Warding')
            eqc3 = eqc3.concat('抗魔')
            eqe3 = eqe3.concat('of the Raccoon')
            eqc3 = eqc3.concat('招架')
            //武器後綴//
            eqe3 = eqe3.concat('of Slaughter');
            eqc3 = eqc3.concat('<span style=\"background:#FF0000;color:#FFFFFF\" >殺戮</span>');
            eqe3 = eqe3.concat('of Swiftness');
            eqc3 = eqc3.concat('加速');
            eqe3 = eqe3.concat('of Balance');
            eqc3 = eqc3.concat('<span style=\"background:#c8c87c\;color:#000000\" >平衡</span>');
            eqe3 = eqe3.concat('of the Battlecaster');
            eqc3 = eqc3.concat('魔戰');
            eqe3 = eqe3.concat('of the Banshee');
            eqc3 = eqc3.concat('吸魂');
            eqe3 = eqe3.concat('of the Illithid');
            eqc3 = eqc3.concat('吸魔');
            eqe3 = eqe3.concat('of the Vampire');
            eqc3 = eqc3.concat('吸血');
            eqe3 = eqe3.concat('of Destruction')
            eqc3 = eqc3.concat('<span style=\"background:#9400d3\;color:#FFFFFF" >毀滅之</span>')
            eqe3 = eqe3.concat('of Surtr')
            eqc3 = eqc3.concat('<span style=\"background:#f97c7c\;color:#000000" >蘇爾特</span>')
            eqe3 = eqe3.concat('of Niflheim')
            eqc3 = eqc3.concat('<span style=\"background:#94c2f5\;color:#000000" >尼芙菲姆</span>')
            eqe3 = eqe3.concat('of Mjolnir')
            eqc3 = eqc3.concat('<span style=\"background:#fcff66\;color:#000000" >姆喬爾尼爾</span>')
            eqe3 = eqe3.concat('of Freyr')
            eqc3 = eqc3.concat('<span style=\"background:#7ff97c\;color:#000000" >弗瑞爾</span>')
            eqe3 = eqe3.concat('of Heimdall')
            eqc3 = eqc3.concat('<span style=\"background:#ffffff\;color:#000000" >海姆達</span>')
            eqe3 = eqe3.concat('of Fenrir')
            eqc3 = eqc3.concat('<span style=\"background:#000000\;color:#ffffff" >芬里爾</span>')
            eqe3 = eqe3.concat('of Focus')
            eqc3 = eqc3.concat('專注')
            eqe3 = eqe3.concat('of the Elementalist')
            eqc3 = eqc3.concat('元素使')
            eqe3 = eqe3.concat('of the Heaven-sent')
            eqc3 = eqc3.concat('天堂')
            eqe3 = eqe3.concat('of the Demon-fiend')
            eqc3 = eqc3.concat('惡魔')
            eqe3 = eqe3.concat('of the Earth-walker')
            eqc3 = eqc3.concat('地行者')
            eqe3 = eqe3.concat('of the Curse-weaver')
            eqc3 = eqc3.concat('咒術師')
        }

        function eq2() {
            //武器或防具前綴//
            eqe2 = eqe2.concat('dfgdsfgsdge'); //防止空缺
            eqc2 = eqc2.concat('');
            eqe2 = eqe2.concat('Radiant');
            eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:red" >魔光的</span>');
            eqe2 = eqe2.concat('Charged');
            eqc2 = eqc2.concat('<span style=\"color:red\" >詠唱的</span>');
            eqe2 = eqe2.concat('Mystic');
            eqc2 = eqc2.concat('神秘的');
            eqe2 = eqe2.concat('Amber');
            eqc2 = eqc2.concat('琥珀的');
            eqe2 = eqe2.concat('Mithril');
            eqc2 = eqc2.concat('<span style=\"color:red\" >秘銀的</span>');
            eqe2 = eqe2.concat('Agile');
            eqc2 = eqc2.concat('<span style=\"color:red\" >俊敏的</span>');
            eqe2 = eqe2.concat('Zircon');
            eqc2 = eqc2.concat('鋯石的');
            eqe2 = eqe2.concat('Frugal');
            eqc2 = eqc2.concat('節約的');
            eqe2 = eqe2.concat('Jade');
            eqc2 = eqc2.concat('翡翠的');
            eqe2 = eqe2.concat('Cobalt');
            eqc2 = eqc2.concat('鈷石的');
            eqe2 = eqe2.concat('Ruby');
            eqc2 = eqc2.concat('紅寶石');
            eqe2 = eqe2.concat('Onyx');
            eqc2 = eqc2.concat('縞瑪瑙');
            eqe2 = eqe2.concat('Savage');
            eqc2 = eqc2.concat('<span style=\"color:red\" >殘暴的</span>');
            eqe2 = eqe2.concat('Reinforced');
            eqc2 = eqc2.concat('強固的');
            eqe2 = eqe2.concat('Shielding');
            eqc2 = eqc2.concat('盾化的');
            eqe2 = eqe2.concat('Fiery')
            eqc2 = eqc2.concat('<span style=\"background:#f97c7c\;color:#000000" >紅蓮的</span>')
            eqe2 = eqe2.concat('Arctic')
            eqc2 = eqc2.concat('<span style=\"background:#94c2f5\;color:#000000" >北極的</span>')
            eqe2 = eqe2.concat('Shocking')
            eqc2 = eqc2.concat('<span style=\"background:#fcff66\;color:#000000" >雷鳴的</span>')
            eqe2 = eqe2.concat('Tempestuous')
            eqc2 = eqc2.concat('<span style=\"background:#a9f94f\;color:#000000" >風暴的</span>')
            eqe2 = eqe2.concat('Hallowed')
            eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:#000000" >聖光的</span>')
            eqe2 = eqe2.concat('Demonic')
            eqc2 = eqc2.concat('<span style=\"background:#000000\;color:#ffffff" >魔性的</span>')
            eqe2 = eqe2.concat('Ethereal')
            eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:#5c5a5a" >虛空的</span>')

        }

        function eq1() {
            //品質//
            eqe1 = eqe1.concat('Crude')
            eqc1 = eqc1.concat('粗糙')
            eqe1 = eqe1.concat('Fair');
            eqc1 = eqc1.concat('尚可');
            eqe1 = eqe1.concat('Average');
            eqc1 = eqc1.concat('普通');
            eqe1 = eqe1.concat('Fine')
            eqc1 = eqc1.concat('*優質')
            eqe1 = eqe1.concat('Superior');
            eqc1 = eqc1.concat('<span style=\"background:#44c554\;color:#ffffff" >優秀</span>');
            eqe1 = eqe1.concat('Exquisite');
            eqc1 = eqc1.concat('<span style=\"background:#6060f9\;color:#ffffff" >精緻</span>');
            eqe1 = eqe1.concat('Magnificent');
            eqc1 = eqc1.concat('<span style=\"background:#0000ae\;color:#ffffff" >華麗</span>');
            eqe1 = eqe1.concat('Legendary');
            eqc1 = eqc1.concat('<span style=\"background:#f5b9cd\;color:#000000" >傳奇</span>');
            eqe1 = eqe1.concat('Peerless');
            eqc1 = eqc1.concat('<span style=\"background:#fbc93e\;color:#000000" >無雙</span>');
        }
    }
}

function setValue(item, value) {
    window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

function getValue(item, toJSON) {
    return (window.localStorage[item]) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
}

function checkHide() {
    return (getValue('hideflag', true) == 0) ? 'Hide the locking equipment' : 'Display lock equipment';
}
