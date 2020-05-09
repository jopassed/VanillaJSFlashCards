'use strict';

//ui elements
const UIflashcard = document.querySelector('#flash-card');
const UInextBtn = document.querySelector('#next');
const UIprevBtn = document.querySelector('#previous');
const UIshuffleBtn = document.querySelector('#shuffle');
const UIguessBtn = document.querySelector('#flip-btn');

//UI feedback
const UImessage = document.querySelector('.message');
const UIcardTxt = document.querySelector('#flash-card-txt');


//guess form UI
const UIform = document.querySelector('#guess-form');
const UIguessInput = document.querySelector('#guess-card');


//responsive event listeners
window.addEventListener('load', loadEvents);
window.addEventListener('resize', setCardHeight);


//eventlisteners
UIguessBtn.addEventListener('click', flipCard);
UIshuffleBtn.addEventListener('click', shuffleCards);

//click events

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
const deck = [
    {frontDesc:'a way of storing datatypes such as strings, integers, with block scope and can be reassigned.', backTerm: 'let', faceUp: false},
    {frontDesc:'a way of storing datatypes such as strings, integers, with block scope and cannot be reassigned.', backTerm: 'const', faceUp: false},
    {frontDesc:'stores something to fire later', backTerm: 'function', faceUp: false}
];

function shuffleCards(){
    let randomInt = Math.floor(Math.random() * (deck.length + 1));
    UIcardTxt.innerText = deck[randomInt].frontDesc;
}

UIcardTxt.innerText = deck[2].frontDesc;

//flip current card
function flipCard(e){
    e.preventDefault();
    let currentCard;
    let currentTxt = UIcardTxt.innerText;
    for (let index=0; index < deck.length; index++){
        if (currentTxt === deck[index].frontDesc){
            UIcardTxt.innerText = deck[index].backTerm;
        } else if (currentTxt === deck[index].backTerm){
            UIcardTxt.innerText = deck[index].frontDesc;
        }
    }
}