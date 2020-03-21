// ==UserScript==
// @name         HV Price Forged Equipment
// @author       carry0987
// @namespace    https://github.com/carry0987
// @support      https://github.com/carry0987/UserJS/issues
// @version      1.0.0
// @description  Calculate material cost for forged Legendary items only
// @icon         https://carry0987.github.io/favicon.png
// @match        http://*.hentaiverse.org/pages/showequip.php?eid=*&key=*
// @match        https://hentaiverse.org/equip/*
// @match        http://alt.hentaiverse.org/equip/*
// @require      https://dl.dropboxusercontent.com/u/5046/static/hv_scripts/classToString.js?t=1
// @license      MIT
// @grant        none
// @run-at       document-end
// ==/UserScript==

//Define costs in credits
var costs = {
    CrystallizedPhazon: 190000,
    ShadeFragment: 9000,
    RepurposedActuator: 68000,
    DefenseMatrixModulator: 10000,
    HighGradeCloth: 18000,
    MidGradeCloth: 450,
    HighGradeLeather: 250,
    MidGradeLeather: 280,
    HighGradeMetal: 850,
    MidGradeMetal: 380,
    HighGradeWood: 6800,
    MidGradeWood: 480,
    BindingOfSlaughter: 115000,
    BindingOfBalance: 4000,
    BindingOfIsaac: 8000,
    BindingOfDestruction: 66000,
    BindingOfFocus: 500,
    BindingOfFriendship: 500,
    BindingOfProtection: 30000,
    BindingOfTheFleet: 12000,
    BindingOfTheBarrier: 4500,
    BindingOfTheNimble: 5000,
    BindingOfTheElementalist: 800,
    BindingOfTheHeavenSent: 800,
    BindingOfTheDemonFiend: 800,
    BindingOfTheCurseWeaver: 800,
    BindingOfTheEarthWalker: 500,
    BindingOfSurtr: 800,
    BindingOfNiflheim: 800,
    BindingOfMjolnir: 800,
    BindingOfFreyr: 800,
    BindingOfHeimdall: 800,
    BindingOfFenrir: 800,
    BindingOfDampening: 1000,
    BindingOfStoneSkin: 800,
    BindingOfDeflection: 800,
    BindingOfTheFireEater: 500,
    BindingOfTheFrostBorn: 500,
    BindingOfTheThunderChild: 500,
    BindingOfTheWindWaker: 500,
    BindingOfTheThriceBlessed: 500,
    BindingOfTheSpiritWard: 500,
    BindingOfTheOx: 11000,
    BindingOfTheRaccoon: 11000,
    BindingOfTheCheetah: 34000,
    BindingOfTheTurtle: 4500,
    BindingOfTheFox: 18000,
    BindingOfTheOwl: 18000,
    BindingOfWarding: 4000,
    BindingOfNegation: 1000
};

/***********
Do not modify below
***********/
var mapping = {
    "Physical Damage": [costs.BindingOfSlaughter, true],
    "Physical Hit Chance": [costs.BindingOfBalance, false],
    "Physical Crit Chance": [costs.BindingOfIsaac, false],
    "Magical Damage": [costs.BindingOfDestruction, true],
    "Magical Hit Chance": [costs.BindingOfFocus, false],
    "Magical Crit Chance": [costs.BindingOfFriendship, false],
    "Physical Defense": [costs.BindingOfProtection, false],
    "Evade Chance": [costs.BindingOfTheFleet, false],
    "Block Chance": [costs.BindingOfTheBarrier, false],
    "Parry Chance": [costs.BindingOfTheNimble, false],
    "Elemental Proficiency": [costs.BindingOfTheElementalist, false],
    "Divine Proficiency": [costs.BindingOfTheHeavenSent, false],
    "Forbidden Proficiency": [costs.BindingOfTheDemonFiend, false],
    "Deprecating Proficiency": [costs.BindingOfTheCurseWeaver, false],
    "Supportive Proficiency": [costs.BindingOfTheEarthWalker, false],
    "Fire Spell Damage": [costs.BindingOfSurtr, false],
    "Cold Spell Damage": [costs.BindingOfNiflheim, false],
    "Elec Spell Damage": [costs.BindingOfMjolnir, false],
    "Wind Spell Damage": [costs.BindingOfFreyr, false],
    "Holy Spell Damage": [costs.BindingOfHeimdall, false],
    "Dark Spell Damage": [costs.BindingOfFenrir, false],
    "Crushing Mitigation": [costs.BindingOfDampening, false],
    "Slashing Mitigation": [costs.BindingOfStoneSkin, false],
    "Piercing Mitigation": [costs.BindingOfDeflection, false],
    "Fire Mitigation": [costs.BindingOfTheFireEater, false],
    "Cold Mitigation": [costs.BindingOfTheFrostBorn, false],
    "Elec Mitigation": [costs.BindingOfTheThunderChild, false],
    "Wind Mitigation": [costs.BindingOfTheWindWaker, false],
    "Holy Mitigation": [costs.BindingOfTheThriceBlessed, false],
    "Dark Mitigation": [costs.BindingOfTheSpiritWard, false],
    "Strength Bonus": [costs.BindingOfTheOx, false],
    "Dexterity Bonus": [costs.BindingOfTheRaccoon, false],
    "Agility Bonus": [costs.BindingOfTheCheetah, false],
    "Endurance Bonus": [costs.BindingOfTheTurtle, false],
    "Intelligence Bonus": [costs.BindingOfTheFox, false],
    "Wisdom Bonus": [costs.BindingOfTheOwl, false],
    "Magical Defense": [costs.BindingOfWarding, false],
    "Resist Chance": [costs.BindingOfNegation, false]
};

var materialCost = {
    cloth: { midGrade: costs.MidGradeCloth, highGrade: costs.HighGradeCloth, special: 0 },
    wood: { midGrade: costs.MidGradeWood, highGrade: costs.HighGradeWood, special: 0 },
    leather: { midGrade: costs.MidGradeLeather, highGrade: costs.HighGradeLeather, special: 0 },
    metal: { midGrade: costs.MidGradeMetal, highGrade: costs.HighGradeMetal, special: 0 },
    phase: { midGrade: costs.MidGradeCloth, highGrade: costs.HighGradeCloth, special: costs.CrystallizedPhazon },
    shade: { midGrade: costs.MidGradeLeather, highGrade: costs.HighGradeLeather, special: costs.ShadeFragment },
    power: { midGrade: costs.MidGradeMetal, highGrade: costs.HighGradeMetal, special: costs.RepurposedActuator },
    force: { midGrade: costs.MidGradeWood, highGrade: costs.HighGradeWood, special: costs.DefenseMatrixModulator },
    unknown: { midGrade: -1, highGrade: -1, special: -1 }
};

var catalystCost = {
    Wispy: 90,
    Dilluted: 450,
    Regular: 900,
    Robust: 2250,
    Vibrant: 4500,
    Coruscating: 9000
};

var rangesNonDamage = {
    5: { midGradeQty: 6, highGradeQty: 0, catalystCost: catalystCost.Robust },
    8: { midGradeQty: 5, highGradeQty: 1, catalystCost: catalystCost.Robust },
    12: { midGradeQty: 4, highGradeQty: 2, catalystCost: catalystCost.Robust },
    16: { midGradeQty: 3, highGradeQty: 3, catalystCost: catalystCost.Vibrant },
    20: { midGradeQty: 2, highGradeQty: 4, catalystCost: catalystCost.Vibrant },
    23: { midGradeQty: 1, highGradeQty: 5, catalystCost: catalystCost.Vibrant },
    25: { midGradeQty: 0, highGradeQty: 6, catalystCost: catalystCost.Vibrant },
    50: { midGradeQty: 0, highGradeQty: 6, catalystCost: catalystCost.Coruscating }
};

var rangesDamage = {
    5: { midGradeQty: 6, highGradeQty: 0, catalystCost: catalystCost.Robust },
    12: { midGradeQty: 5, highGradeQty: 1, catalystCost: catalystCost.Robust },
    20: { midGradeQty: 4, highGradeQty: 2, catalystCost: catalystCost.Robust },
    25: { midGradeQty: 3, highGradeQty: 3, catalystCost: catalystCost.Robust },
    27: { midGradeQty: 3, highGradeQty: 3, catalystCost: catalystCost.Vibrant },
    35: { midGradeQty: 2, highGradeQty: 4, catalystCost: catalystCost.Vibrant },
    42: { midGradeQty: 1, highGradeQty: 5, catalystCost: catalystCost.Vibrant },
    50: { midGradeQty: 0, highGradeQty: 6, catalystCost: catalystCost.Vibrant },
    100: { midGradeQty: 0, highGradeQty: 6, catalystCost: catalystCost.Coruscating }
};

/****** Init ******/
//document.body.appendChild(document.createElement('br'));
//var button = document.body.appendChild(document.createElement('div'));
//var equipment = document.getElementById('equipment');
var equipment = document.body;
//var upgrades = equipment.getElementsByClassName("eu");
var upgrades = equipment.querySelectorAll('#eu span');
var inp = document.createElement('input');
inp.size = 2;
inp.onkeyup = function() { futureCalc(this.value); };
equipment.childNodes[3].getElementsByTagName('div')[0].appendChild(inp);

if (!upgrades.length) {
    return;
} else {
    /*
    TODO pre-populate any missing stats by inserting a class='eu' element.
    Pre-pop to forge Lv.0 will make all child methods work properly.
    This requires a mapping of all possible stats on a piece on equipment to the corresponding 'mapping' variable.
    Then foreach ( stat in statlist ) {
          if( !exists( mapping[ statmap[ stat ] ] ) } {
            append new 'eu' element for statmap[ stat ] + " Lv.0";
          }
    */
    equipment.style = 'height:425px';
    var basicMaterialCost = getBasicMaterialCost();
    var output = {};
    var maxLevel = 0;
    var totalInvested = {};
    calcCost(-1);
}

/****** Functions ******/
function calcCost(levelOverride) {
    output = {};
    maxLevel = 0;
    for (var i = 0; i < upgrades.length; i++) {
        var upgradeStr = upgrades[i].innerHTML;
        var upgradeIdentifier = upgradeStr.substring(0, upgradeStr.lastIndexOf(' '));
        if (mapping[upgradeIdentifier]) {
            var upgradeLevel = parseInt(upgradeStr.substring(upgradeStr.lastIndexOf(' ') + 4, upgradeStr.length));
            if (mapping[upgradeIdentifier][1] && levelOverride >= 100) {
                levelOverride = 100;
            } else if (!mapping[upgradeIdentifier][1] && levelOverride >= 50) {
                levelOverride = 50;
            }
            if (levelOverride > 0) {
                upgradeLevel = levelOverride;
                upgradeStr = upgradeIdentifier + ' Lv.' + upgradeLevel;
            }
            var bindingCost = mapping[upgradeIdentifier][0];
            var isDamage = mapping[upgradeIdentifier][1];
            var costObj = calculateUpgradeCost(upgradeLevel, bindingCost, basicMaterialCost, isDamage);
            if (upgradeLevel > maxLevel) maxLevel = upgradeLevel;
            output[upgradeStr] = costObj;
            appendTitle(upgrades[i], upgradeIdentifier, upgradeLevel, costObj, (levelOverride == -1));
        }
    }
    outputSummary((levelOverride == -1));
}

function outputSummary(baseSummary) {
    if (Object.keys(output).length > 0) {
        var summary = upgradeSummary(output, basicMaterialCost, maxLevel);
        var html = document.createElement('div');
        html.id = 'calccost';
        html.style = 'margin:7px auto 2px; text-align:center';
        var div = document.createElement('div');
        div.style = 'font-weight:bold';
        div.innerHTML = 'Cost Summary:';
        html.appendChild(div);

        var mg = document.createElement('span');
        mg.className = 'ep';
        var hg = document.createElement('span');
        hg.className = 'ep';
        var bi = document.createElement('span');
        bi.className = 'ep';
        var ca = document.createElement('span');
        ca.className = 'ep';
        var sp = document.createElement('span');
        sp.className = 'ep';
        var tot = document.createElement('p');
        tot.style = 'color:#F00';

        mg.innerHTML = 'Mid-Grade ' + credit(summary.midGrade);
        html.appendChild(mg);
        hg.innerHTML = ' High-Grade ' + credit(summary.highGrade);
        html.appendChild(hg);
        bi.innerHTML = ' Binding ' + credit(summary.binding);
        html.appendChild(bi);
        ca.innerHTML = '<br/> Catalyst ' + credit(summary.catalyst);
        html.appendChild(ca);
        sp.innerHTML = ' Special ' + credit(summary.special);
        html.appendChild(sp);
        if (baseSummary) {
            totalInvested.summary = summary;
            tot.innerHTML = 'Total ' + credit(upgradeTotal(summary));
            html.appendChild(tot);
        } else {
            tot.innerHTML = 'Total ' + credit(upgradeTotal(summary)) + ' (' + credit(upgradeTotal(totalInvested.summary)) + ')';
            html.appendChild(tot);
        }
        equipment.appendChild(html);
    }
}

function appendTitle(elem, titleStr, upgradeLvl, costObj, baseSummary) {
    var title = titleStr + ' Lv.' + upgradeLvl + "\n";
    if (baseSummary) {
        totalInvested[titleStr] = costObj;
        title += 'Mid-Grade ' + credit(costObj.midGrade) + "\n";
        title += 'High-Grade ' + credit(costObj.highGrade) + "\n";
        title += 'Binding ' + credit(costObj.binding) + "\n";
        title += 'Catalyst ' + credit(costObj.catalyst) + "\n";
        title += 'Special ' + credit(costObj.special) + "\n";
        title += 'Total ' + credit(upgradeTotal(costObj));
    } else {
        //Override totalInvested for special when calculating future forge costs
        totalInvested[titleStr].special = totalInvested.summary.special;
        title += 'Mid-Grade ' + credit(costObj.midGrade) + ' (' + credit(totalInvested[titleStr].midGrade) + ')' + "\n";
        title += 'High-Grade ' + credit(costObj.highGrade) + ' (' + credit(totalInvested[titleStr].highGrade) + ')' + "\n";
        title += 'Binding ' + credit(costObj.binding) + ' (' + credit(totalInvested[titleStr].binding) + ')' + "\n";
        title += 'Catalyst ' + credit(costObj.catalyst) + ' (' + credit(totalInvested[titleStr].catalyst) + ')' + "\n";
        title += 'Special ' + credit(costObj.special) + ' (' + credit(totalInvested[titleStr].special) + ')' + "\n";
        title += 'Total ' + credit(upgradeTotal(costObj)) + ' (' + credit(upgradeTotal(totalInvested[titleStr])) + ')';
    }
    elem.title = title;
    elem.style = 'cursor:help';
}

function calculateUpgradeCost(upgradeLevel, bindingCost, materialsType, isDamage) {
    var cost = new upgradeCost();
    for (var j = 0; j < upgradeLevel; j++) {
        var range = getRangeData(j, isDamage);
        //Mid Grade
        cost.midGrade += range.midGradeQty * basicMaterialCost.midGrade;
        //High Grade
        cost.highGrade += range.highGradeQty * basicMaterialCost.highGrade;
        //Catalyst
        cost.catalyst += range.catalystCost;
        //Special
        cost.special += basicMaterialCost.special;
        if (j >= 5) {
            //Binding
            cost.binding += bindingCost;
        }
    }
    return cost;
}

function getBasicMaterialCost() {
    //Taken from Hentaiverse Equipment Comparison 0.6.5.3

    /*
    var nameList = document.getElementsByClassName("fd2");
    if(!nameList.length) {
        nameList = document.getElementsByClassName("fd4");
    }

    var fullName = "";
    if(nameList.length) {
        fullName = [].map.call(nameList,function(e){return e.textContent;}).join(" ").trim().replace(/\b(?:The|Of)\b/g,function(e){return e.toLowerCase();});
    }

    if( fullName === "" ) {
        //if fd2 exists, use that. otherwise use fd4
        if ( document.getElementsByClassName('fd2').length ) {
            fullName = hvElemToString( document.getElementsByClassName('fd2') );
        } else {
            fullName = hvElemToString( document.getElementsByClassName('fd4') );
        }
    }
    */
    function getName(body) {
        var nameDiv;
        if (typeof body.children[1] == 'undefined') {
            return 'No such item';
        }
        var showequip = body.children[1];
        if (showequip.children.length == 3) {
            nameDiv = showequip.children[0].children[0];
        } else {
            nameDiv = showequip.children[1].children[0];
        }
        var name = nameDiv.children[0].textContent;
        if (nameDiv.children.length == 3) {
            name += ' ' + nameDiv.children[2].textContent;
        }
        return name;
    }


    var fullName = getName(document.body);

    if (fullName.match(/Axe|Club|Rapier|Shortsword|Wakizashi|Estoc|Longsword|Mace|Katana/i)) {
        return materialCost.metal;
    } else if (fullName.match(/Katalox|Redwood|Willow|Oak|Buckler|Kite/i)) {
        return materialCost.wood;
    } else if (fullName.match(/Cotton/i)) {
        return materialCost.cloth;
    } else if (fullName.match(/Leather/i)) {
        return materialCost.leather;
    } else if (fullName.match(/Force/i)) {
        return materialCost.force;
    } else if (fullName.match(/Phase/i)) {
        return materialCost.phase;
    } else if (fullName.match(/Shade/i)) {
        return materialCost.shade;
    } else if (fullName.match(/Power/i)) {
        return materialCost.power;
    } else {
        return materialCost.unknown;
    }
}

//TODO this is inefficient
function getRangeData(level, isDamage) {
    if (isDamage) {
        for (var rangeDmg in rangesDamage) {
            if (rangeDmg > level) {
                return rangesDamage[rangeDmg];
            }
        }
    } else {
        for (var rangeNonDmg in rangesNonDamage) {
            if (rangeNonDmg > level) {
                return rangesNonDamage[rangeNonDmg];
            }
        }
    }
}

function credit(credits) {
    if (credits >= 1000000) {
        return (credits / 1000000).toFixed(2).replace('.00', '') + 'm';
    } else if (credits >= 10000) {
        return (credits / 1000).toFixed(2).replace('.00', '') + 'k';
    } else {
        return credits + 'c';
    }
}

function upgradeTotal(upgradeCost) {
    var total = 0;
    for (var key in upgradeCost) {
        total += upgradeCost[key];
    }
    return total;
}

function upgradeSummary(input, basicMaterialCost, maxLevel) {
    var summaryCost = new upgradeCost();
    for (var key in input) {
        summaryCost.midGrade += input[key].midGrade;
        summaryCost.highGrade += input[key].highGrade;
        summaryCost.binding += input[key].binding;
        summaryCost.catalyst += input[key].catalyst;
    }
    summaryCost.special += basicMaterialCost.special * maxLevel;
    return summaryCost;
}

function upgradeCost() {
    this.midGrade = 0;
    this.highGrade = 0;
    this.binding = 0;
    this.catalyst = 0;
    this.special = 0;
}

function futureCalc(toLevel) {
    document.getElementById('calccost').remove();
    toLevel = parseInt(toLevel);
    if (isNaN(toLevel) || toLevel <= 0) {
        calcCost(-1);
        return;
    }
    calcCost(toLevel);
}
