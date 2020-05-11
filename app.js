'use strict';

//Deck Class Constructor
class Deck {
    constructor(cards){
        this.cards = cards;
        }
    //shuffle cards - I'm just creating a random int based on the number of cards rather than actually changing the array...
    shuffle(){
        let randomInt = Math.floor(Math.random() * (this.cards.length));
        return randomInt;
    }

}

//Card Class Constructor
class Card {
    constructor(frontDesc, backTerm){
        this.frontDesc = frontDesc;
        this.backTerm = backTerm;
    }
}

//ui elements
const UIflashcard = document.querySelector('#flash-card');
const UInextBtn = document.querySelector('#next');
const UIprevBtn = document.querySelector('#previous');
const UIshuffleBtn = document.querySelector('#shuffle');

//UI feedback
const UImessage = document.querySelector('.message');
const UIcardTxt = document.querySelector('#flash-card-txt');

//guess form UI
const UIform = document.querySelector('#guess-form');
const UIguessInput = document.querySelector('#guess-card');

//responsive event listeners
window.addEventListener('load', loadEvents);
window.addEventListener('resize', setCardHeight);

//click events
UIflashcard.addEventListener('mousedown', flipCard);
UIflashcard.addEventListener('mouseup', flipCard);
UIshuffleBtn.addEventListener('click', dealCard);
UInextBtn.addEventListener('click', nextCardinDeck);
UIprevBtn.addEventListener('click', prevCardinDeck);

//form guesser event
UIform.addEventListener('submit', cardGuesser);

//decks tracker
let prevCardTracker = [];

//load events
function loadEvents(){
    setCardHeight();
    dealCard();
}

//set card height responsively to width
function setCardHeight(){
    let cardWidth = UIflashcard.offsetWidth;
    let setHeight = cardWidth / 1.666666666667;
    UIflashcard.style.height = `${setHeight}px`;
}

//Card Data Objects
let currentCard =[];


//cards
const card1 = new Card('a way of storing datatypes such as strings, integers, with block scope and can be reassigned.', 'let');
const card2 = new Card('a way of storing datatypes such as strings, integers, with block scope and cannot be reassigned.', 'const');
const card3 = new Card('stores something to fire later', 'function');

//decks
const mainDeck = new Deck([card1,card2, card3]);
const discardDeck = new Deck([]);

function dealCard(){
    currentCard = mainDeck.cards[mainDeck.shuffle()];
    UIcardTxt.innerText = currentCard.frontDesc;
}

//flip current card
function flipCard(e){
    e.preventDefault();
    let currentTxt = UIcardTxt.innerText;
    if(currentTxt === currentCard.frontDesc){
        UIcardTxt.innerText = currentCard.backTerm;
    } else {
        UIcardTxt.innerText = currentCard.frontDesc;
    }
}

//select next card
function nextCardinDeck(){
    if (mainDeck.cards.length > 1){
        mainDeck.cards.splice(mainDeck.cards.indexOf(currentCard), 1);
        discardDeck.cards.unshift(currentCard);
        dealCard();
    } else {
        UIMessages('No More Cards...');
    }
}

//select previous cards
function prevCardinDeck(){
    if (discardDeck.cards.length >= 1){
        currentCard = discardDeck.cards[0];
        UIcardTxt.innerText = currentCard.frontDesc;
        mainDeck.cards.unshift(currentCard);        
        discardDeck.cards.shift();
    } else {
        UIMessages('No More Cards...');
    }
}

function UIMessages(msg){
    UImessage.innerText = msg;
    setTimeout(() => {
     UImessage.innerText = '';
    }, 3000);
}

function cardGuesser(e){
    e.preventDefault();
    if (UIguessInput.value === currentCard.backTerm){
        UIMessages('Correct!');
        UIcardTxt.innerText = currentCard.backTerm;
    } else {
        UIMessages('Incorrect!');
    }
}