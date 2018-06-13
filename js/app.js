'use strict';

var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
var gLastRes = null;

var QUESTS_TREE_KEY = 'questsTree';

$(document).ready(init);

function init() {
    gQuestsTree = loadFromStorage(QUESTS_TREE_KEY);
    if (!gQuestsTree) {
        gQuestsTree = createQuest('Male?');

        gQuestsTree.yes = createQuest('Athlete');
        gQuestsTree.yes.yes = createQuest('Omri Caspi');
        gQuestsTree.yes.no = createQuest('Gandhi');

        gQuestsTree.no = createQuest('Athlete');
        gQuestsTree.no.yes = createQuest('Yarden Jarebi');
        gQuestsTree.no.no = createQuest('Rita');
    }
    gCurrQuest = gQuestsTree;
}

function startGuessing() {
    $('.gameStart').hide();
    renderQuest();
    $('.gameQuest').show();
}

function renderQuest() {
    var question = addQMark(gCurrQuest.txt);
    $('.gameQuest h2').text(question);
}

function userResponse(res) {
    // If this node has no children
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            $('#modal .modal-title').text(`I knew it!`);
            $('#modal p').text(`You tought on ${gCurrQuest.txt}! Easy money.`);
            $('#modal').modal()
        } else {
            $('.gameQuest').hide();
            $('.gameNewQuest').show();
            $('#modal .modal-title').text(`I... OK, I gave up`);
            $('#modal p').text(`Oh, I don't know that person... Help me`);
            $('#modal').modal()
        }
    } else {
        gPrevQuest = gCurrQuest;
        gCurrQuest = gCurrQuest[res];
        gLastRes = res;
        renderQuest();
    }
}

function addGuess() {
    var questStr = removeQMark($('#newQuest').val());
    var tempQuest = createQuest(questStr);
    var guessStr = removeQMark($('#newGuess').val());
    tempQuest.yes = createQuest(guessStr);
    tempQuest.no = gCurrQuest;
    gPrevQuest[gLastRes] = tempQuest;
    saveToStorage(QUESTS_TREE_KEY, gQuestsTree);
    restartGame();
}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function restartGame() {
    $('#modal').modal('toggle');
    $('.gameNewQuest').hide();
    $('.gameQuest').hide();
    $('.gameStart').show();
    gCurrQuest = gQuestsTree;
    gPrevQuest = null;
    gLastRes = null;
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

// Adding question mark
function addQMark(str) {
    var newStr = removeQMark(str);
    return newStr + '?';
}

// Removing question mark and unnecessary spaces
function removeQMark(str) {
    var newStr = str.trim();
    var newStr = (newStr.slice(-1) === '?') ? newStr.slice(0, newStr.length - 1) : newStr;
    return newStr.trim();
}