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

//click events
UIguessBtn.addEventListener('click', flipCard);
UIshuffleBtn.addEventListener('click', shuffleCards);
UInextBtn.addEventListener('click', nextCardinDeck);
UIprevBtn.addEventListener('click', prevCardinDeck);

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
    console.log(currentCard);
}

//flip current card
function flipCard(e){
    e.preventDefault();
    let currentTxt = UIcardTxt.innerText;
    for (let index=0; index < deck.length; index++){
        if (currentTxt === deck[index].frontDesc){
            UIcardTxt.innerText = deck[index].backTerm;
        } else if (currentTxt === deck[index].backTerm){
            UIcardTxt.innerText = deck[index].frontDesc;
        }
    }
}

//select next card.
function nextCardinDeck(){
    let currentTxt = UIcardTxt.innerText;
    for (let index=0; index < deck.length; index++){
        if (deck.length > 1){
           if (currentTxt === deck[index].frontDesc || currentTxt === deck[index].backTerm){
                discardDeck.unshift(deck[index]);
                deck.splice(index, 1);
                let randomInt = Math.floor(Math.random() * (deck.length));
                UIcardTxt.innerText = deck[randomInt].frontDesc;
         
            }
        } else {
            UImessage.innerText = 'Last Card of Next';
            break;
            
        }
    }
}

//select previous cards

function prevCardinDeck(){
    let currentTxt = UIcardTxt.innerText;
    for (let index=0; index < discardDeck.length; index++){
        if (discardDeck.length >= 1){
           deck.unshift(discardDeck[index]); 
           UIcardTxt.innerText = discardDeck[index].frontDesc;
           discardDeck.splice(index, 1);
           console.log(discardDeck);
           console.log(deck);
         } else {
             UImessage.innerText = 'Last Card of Previous';
             break;
             
         }

    }
     
}