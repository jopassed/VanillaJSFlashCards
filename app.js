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

//cards
const card1 = new Card('a way of storing datatypes such as strings, integers, with block scope and can be reassigned.', 'let');
const card2 = new Card('a way of storing datatypes such as strings, integers, with block scope and cannot be reassigned.', 'const');
const card3 = new Card('stores something to fire later', 'function');

//decks
// let mainDeck; //currently undefinied but as it's in function scope -

const discardDeck = new Deck([]);

class Save {
    static getDecks() {
        let mainDeck = new Deck([]);
        if(localStorage.getItem('mainDeck') === null) {
            mainDeck = new Deck([]);
        } else {
            mainDeck.cards = JSON.parse(localStorage.getItem('mainDeck'));
            
        }
        return mainDeck;
        
    
    }
    // static displayBooks() {
    //     const decks = Store.getDecks();
    //     decks.forEach(function(book){
            

    //         //Add book to UI
    //         ui.addBookToList(book);
    //     });
            
    // }

    static addCardtoDeck(card){
        const mainDeck = Save.getDecks();
        mainDeck.cards.push(card);
        localStorage.setItem('mainDeck', JSON.stringify(mainDeck.cards));
        // const mainDeck = new Deck;
        // mainDeck.cards = Save.getDecks();
        // mainDeck.cards.push(card);
        // localStorage.setItem('mainDeck', JSON.stringify(mainDeck));


    }

    static removeCard(i) {
        const mainDeck = Save.getDecks();
        mainDeck.cards.forEach(function(card){
          if(card[i]){
              cards.splice(i, 1);
          } 
        });

        localStorage.setItem('mainDeck', JSON.stringify(mainDeck.cards));

    }
}

//Card on Display
let displayedCard;

//ui elements
const UIflashcard = document.querySelector('#flash-card'),
      UInextBtn = document.querySelector('#next'),
      UIprevBtn = document.querySelector('#previous'),
      UIshuffleBtn = document.querySelector('#shuffle');

//UI feedback
const UImessage = document.querySelector('.message'),
      UIcardTxt = document.querySelector('#flash-card-txt');

//guess form UI
const UIform = document.querySelector('#guess-form'),
      UIguessInput = document.querySelector('#guess-card');



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

//add card


// Event Listeners

//Add card to mainDeck array.
document.getElementById('card-form').addEventListener('submit', function(e){
    
     //get form values
     const term = document.getElementById('term').value,
           description = document.getElementById('description').value;
     
    // Instantiate book
    const card = new Card(description, term);

    //Validate
    if(term === '' || description === '') {
        // Error alert
        UIMessages('Please enter in Term and Description', 'red');
    } else{
        
        Save.addCardtoDeck(card);
        
        //UI Message    
        UIMessages('Card added to Main Deck', 'green');
        
        //Clear Fields
        document.getElementById('term').value = '';
        document.getElementById('description').value = '';
    }
   

    e.preventDefault();
});

//load events
function loadEvents(){
    const mainDeck = Save.getDecks();
    setCardHeight();
    dealCard();
}

//set card height responsively to width
function setCardHeight(){
    let cardWidth = UIflashcard.offsetWidth;
    let setHeight = cardWidth / 1.666666666667;
    UIflashcard.style.height = `${setHeight}px`;
}


function dealCard(){
    const mainDeck = Save.getDecks();
    displayedCard = mainDeck.cards[mainDeck.shuffle()];
    UIcardTxt.innerText = displayedCard.frontDesc;
   
}

//flip current card
function flipCard(e){
    e.preventDefault();
    let currentTxt = UIcardTxt.innerText;
    if(currentTxt === displayedCard.frontDesc){
        UIcardTxt.innerText = displayedCard.backTerm;
    } else {
        UIcardTxt.innerText = displayedCard.frontDesc;
    }
}

//select next card
function nextCardinDeck(){
        const mainDeck = Save.getDecks(); //this isn't work cause on every click it's pulling the array from localStorage and not lowering the length.
       
      if (mainDeck.cards.length > 1){
        Save.removeCard(mainDeck.cards.findIndex(displayedCard));
        discardDeck.cards.unshift(displayedCard);
        dealCard();
    } else {
        UIMessages('No More Cards...', 'red');
    }
}

//select previous cards
function prevCardinDeck(){
    const mainDeck = Save.getDecks();
    if (discardDeck.cards.length >= 1){
        displayedCard = discardDeck.cards[0];
        UIcardTxt.innerText = displayedCard.frontDesc;
        mainDeck.cards.unshift(displayedCard);        
        discardDeck.cards.shift();
    } else {
        UIMessages('No More Cards...', 'red');
    }
}

function UIMessages(msg, color){
    UImessage.style.color = color;
    UImessage.innerText = msg;
    setTimeout(() => {
     UImessage.innerText = '';
    }, 3000);
}

function cardGuesser(e){
    e.preventDefault();
    if (UIguessInput.value === displayedCard.backTerm){
        UIMessages('Correct!', 'green');
        UIcardTxt.innerText = displayedCard.backTerm;
    } else {
        UIMessages('Incorrect!', 'red');
    }
}