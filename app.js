'use strict';

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
UIshuffleBtn.addEventListener('click', shuffleCards);
UInextBtn.addEventListener('click', nextCardinDeck);
UIprevBtn.addEventListener('click', prevCardinDeck);

//form guesser event
UIform.addEventListener('submit', cardGuesser);

//decks tracker
let prevCardTracker = [];

//load events
function loadEvents(){
    setCardHeight();
    shuffleCards();
}

//set card height responsively to width
function setCardHeight(){
    let cardWidth = UIflashcard.offsetWidth;
    let setHeight = cardWidth / 1.666666666667;
    UIflashcard.style.height = `${setHeight}px`;
}

//Card Data Objects
let deck = [];
let discardDeck = [];
let currentCard =[];

function setDeck(){
    deck = [
    {frontDesc:'a way of storing datatypes such as strings, integers, with block scope and can be reassigned.', backTerm: 'let', faceUp: false},
    {frontDesc:'a way of storing datatypes such as strings, integers, with block scope and cannot be reassigned.', backTerm: 'const', faceUp: false},
    {frontDesc:'stores something to fire later', backTerm: 'function', faceUp: false}
];}

setDeck();

function shuffleCards(){
    let randomInt = Math.floor(Math.random() * (deck.length));
    currentCard = deck[randomInt];
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
    if (deck.length > 1){
        deck.splice(deck.indexOf(currentCard), 1);
        discardDeck.unshift(currentCard);
        shuffleCards();
    } else {
        UIMessages('No More Cards...');
    }
}

//select previous cards
function prevCardinDeck(){
    if (discardDeck.length >= 1){
        currentCard = discardDeck[0];
        UIcardTxt.innerText = currentCard.frontDesc;
        deck.unshift(currentCard);        
        discardDeck.shift();
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