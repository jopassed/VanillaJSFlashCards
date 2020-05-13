//procedural program with a little bit of classes.

'use strict';

//trial
// document.addEventListener('mousemove', function(e){
//     const blackdot = document.getElementById('black-dot');
//     console.log(e.pageX);
//     console.log(e.pageY);
//     blackdot.style.left = `${e.pageX}px`;
//     blackdot.style.top = `${e.pageY}px`;
// });

//ui elements
const UIflashcard = document.querySelector('#flash-card');
const UInextBtn = document.querySelector('#next');
const UIprevBtn = document.querySelector('#previous');
const UIshuffleBtn = document.querySelector('#shuffle');

//UI feedback
const UIcardTxt = document.querySelector('#flash-card-txt');

//guess form UI

const UIguessInput = document.querySelector('#guess-card');

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

//cards
const card1 = new Card('a way of storing datatypes such as strings, integers, with block scope and can be reassigned.', 'let');
const card2 = new Card('a way of storing datatypes such as strings, integers, with block scope and cannot be reassigned.', 'const');
const card3 = new Card('stores something to fire later', 'function');

class UI {
    UIMessages(msg, color){
        const UImessage = document.querySelector('.message');
        UImessage.style.color = color;
        UImessage.innerText = msg;
        setTimeout(() => {
         UImessage.innerText = '';
        }, 3000);
    }

    addCard(card, deckClass){
        const li = document.createElement('li');
        const ul = document.querySelector(deckClass)
        li.innerHTML = `${card.backTerm}<a href="#" class="delete">X</a>`
        ul.appendChild(li);
    }
    dealCard(){
        let mainDeck = Store.getMainDeck();
        let randomInt = Math.floor(Math.random() * (mainDeck.length));
        currentCard = mainDeck[randomInt];
        if (currentCard != undefined) {
        UIcardTxt.innerText = currentCard.frontDesc;
        }
    }

}

class Store {
    static getMainDeck() {
        let mainDeck;
        if (localStorage.getItem('mainDeck') === null) {
        mainDeck = [];
        } else {
            mainDeck = JSON.parse(localStorage.getItem('mainDeck'));
        }

        return mainDeck;
    }

    static getStorageDeck() {
        let storeDeck;
        if (localStorage.getItem('storeDeck') === null) {
            storeDeck = [];
        } else {
            storeDeck = JSON.parse(localStorage.getItem('storeDeck'));
        }

        return storeDeck;
    }

    static addCards(card) {
        let storeDeck = Store.getStorageDeck();
        storeDeck.push(card);
        localStorage.setItem('storeDeck', JSON.stringify(storeDeck));

    }

    static displayCards() {
        let storeDeck = Store.getStorageDeck();
        storeDeck.forEach(function(card){
            ui.addCard(card, '.card-list');
        });
    }


    static displayMainDeck() {
        let mainDeck = Store.getMainDeck();
        mainDeck.forEach(function(card){
            ui.addCard(card, '.main-deck-list');
        });
    }

}

//instantiate ui
const ui = new UI;

//decks
//Card Data Objects
let currentCard =[];
// const mainDeck = [card1, card2, card3];
const discardDeck = [];

//responsive event listeners
window.addEventListener('load', loadEvents);
window.addEventListener('resize', setCardHeight);

//click events
UIflashcard.addEventListener('mousedown', flipCard);
UIflashcard.addEventListener('mouseup', flipCard);
UIshuffleBtn.addEventListener('click', ui.dealCard);
UInextBtn.addEventListener('click', nextCardinDeck);
UIprevBtn.addEventListener('click', prevCardinDeck);

//form guesser event
document.querySelector('#guess-form').addEventListener('submit', cardGuesser);

//add card listener
document.getElementById('card-form').addEventListener('submit', function(e){
    //get form values
    const term = document.getElementById('term').value,
          description = document.getElementById('description').value;

    // Instantiate a card
    const card = new Card(description, term);

    //Validate
    if(term === '' || description === '') {
        // Error alert
        ui.UIMessages('Please add a card!', 'red');
    } else{
        ui.addCard(card);
        //add to LS
        Store.addCards(card);
        // Store.addBook(book);

        ui.UIMessages('Card Added!', 'green');

        //Clear Fields
        document.getElementById('term').value = '';
        document.getElementById('description').value = '';
    }

    e.preventDefault();
});


//load events
function loadEvents(){
    Store.displayMainDeck();
    Store.displayCards();
    setCardHeight();
    ui.dealCard();
}

//set card height responsively to width
function setCardHeight(){
    let cardWidth = UIflashcard.offsetWidth;
    let setHeight = cardWidth / 1.666666666667;
    UIflashcard.style.height = `${setHeight}px`;
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
    let mainDeck = Store.getMainDeck();
    if (mainDeck.length > 1){
        mainDeck.splice(mainDeck.indexOf(currentCard), 1);
        discardDeck.unshift(currentCard);
        dealCard();
    } else {
        ui.UIMessages('No More Cards...', 'red');
    }
}

//select previous cards
function prevCardinDeck(){
    let mainDeck = Store.getMainDeck();
    if (discardDeck.length >= 1){
        currentCard = discardDeck[0];
        UIcardTxt.innerText = currentCard.frontDesc;
        mainDeck.unshift(currentCard);        
        discardDeck.shift();
    } else {
        ui.UIMessages('No More Cards...', 'red');
    }
}



function cardGuesser(e){
    e.preventDefault();
    if (UIguessInput.value === currentCard.backTerm){
        ui.UIMessages('Correct!', 'green');
        UIcardTxt.innerText = currentCard.backTerm;
    } else {
        ui.UIMessages('Incorrect!', 'red');
    }
}