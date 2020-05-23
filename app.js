//OOP es6 classes. no global scope variables...

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
        li.className = 'store-card';
        const ul = document.querySelector(deckClass)
        li.innerHTML = `${card.backTerm}<a href="#"><i class="edit fa fa-pencil"></i><i class="delete fa fa-times"></i></a>`
        ul.appendChild(li);
    }

    cardGuesser(e){
        const UIcardTxt = document.querySelector('#flash-card-txt'),
              UIguessInput = document.querySelector('#guess-card'),
              mainDeck = Store.getMainDeck(),
              currentCard = mainDeck.cards[ui.findDisplayedCard(mainDeck)];
        console.log(currentCard);
        if (UIguessInput.value === currentCard.backTerm){
            ui.UIMessages('Correct!', 'green');
            UIcardTxt.innerText = currentCard.backTerm;
        } else {
            ui.UIMessages('Incorrect!', 'red');
        }
        e.preventDefault();
    }

    dealCard(){
        const mainDeck = Store.getMainDeck(),
             UIcardTxt = document.querySelector('#flash-card-txt');
        UIcardTxt.innerText = mainDeck.cards[mainDeck.shuffle()].frontDesc;
    }

    deleteCard(target){
        if(target.className === 'delete fa fa-times'){
            target.parentElement.parentElement.remove();         
        }
    }

    flipCard(e){
    const UIcardTxt = document.querySelector('#flash-card-txt'),
          mainDeck = Store.getMainDeck(),
          currentCardIndex = ui.findDisplayedCard(mainDeck),
          currentTxt = UIcardTxt.innerText;
    if(currentTxt === mainDeck.cards[currentCardIndex].frontDesc){
      UIcardTxt.innerText = mainDeck.cards[currentCardIndex].backTerm;
    } else {
      UIcardTxt.innerText = mainDeck.cards[currentCardIndex].frontDesc;
    }
  
  }

  findDisplayedCard(deck) {
    const UIcardTxt = document.querySelector('#flash-card-txt');
    let cardIndex;
    deck.cards.forEach(function(card, index){
        if (card.frontDesc === UIcardTxt.innerText){
            cardIndex = index;
        } else if(card.backTerm === UIcardTxt.innerText){
            cardIndex = index;
        }
        }); 
        return cardIndex;
    }

        //get form values
    getAddCardForm(e){
        const term = document.getElementById('term').value,
        description = document.getElementById('description').value;
        // Instantiate a card
        const card = new Card(description, term);
        //Validate
        if(term === '' || description === '') {
        // Error alert
        ui.UIMessages('Please add a card!', 'red');
        } else{
        ui.addCard(card,'.card-list');
        //add to LS
        Store.addCardsToStorage(card);
        // tell me the card is added
        ui.UIMessages('Card Added!', 'green');
        // Clear Fields
        document.getElementById('term').value = '';
        document.getElementById('description').value = '';
        }
        e.preventDefault();
    }

    //select next card from main Deck
         nextCardinDeck(){
    const mainDeck = Store.getMainDeck(),
          discardDeck = Store.getDiscardDeck(),
          currentCard = mainDeck.cards[ui.findDisplayedCard(mainDeck)];
    if (mainDeck.cards.length > 1){  
        mainDeck.cards.splice(ui.findDisplayedCard(mainDeck), 1);
        discardDeck.cards.unshift(currentCard);
        Store.addDeckToStorage('mainDeck', mainDeck);
        Store.addDeckToStorage('discardDeck', discardDeck);
        ui.dealCard();
    } else {
        ui.UIMessages('No More Cards...', 'red');
    }
}

    //select previous cards
        prevCardinDeck(){
    const UIcardTxt = document.querySelector('#flash-card-txt'),        
          mainDeck = Store.getMainDeck(),
          discardDeck = Store.getDiscardDeck();
    if (discardDeck.cards.length >= 1){
        let currentCard = discardDeck.cards[0];
        UIcardTxt.innerText = currentCard.frontDesc;
        mainDeck.cards.unshift(currentCard);        
        discardDeck.cards.shift();
        Store.addDeckToStorage('mainDeck', mainDeck);
        Store.addDeckToStorage('discardDeck', discardDeck);
    } else {
        ui.UIMessages('No More Cards...', 'red');
    }
}
  //set card height responsively to width
  setCardHeight(){
    const UIflashcard = document.querySelector('#flash-card');
    let cardWidth = UIflashcard.offsetWidth;
    let setHeight = cardWidth / 1.666666666667;
    UIflashcard.style.height = `${setHeight}px`;
}

}

class Store {
    static getMainDeck() {
        const mainDeck = new Deck;
        if (localStorage.getItem('mainDeck') === null) {
        mainDeck.cards = [];
        } else {
            mainDeck.cards = JSON.parse(localStorage.getItem('mainDeck'));
        }
      
        return mainDeck;
    }

    static getStorageDeck() {
        const storeDeck = new Deck;
        if (localStorage.getItem('storeDeck') === null) {
            storeDeck.cards = [];
        } else {
            storeDeck.cards = JSON.parse(localStorage.getItem('storeDeck'));
        }
     
        return storeDeck;
    }

    static getDiscardDeck() {
        const discardDeck = new Deck;
        if (localStorage.getItem('discardDeck') === null) {
            discardDeck.cards = [];
        } else {
            discardDeck.cards = JSON.parse(localStorage.getItem('discardDeck'));
        }

        return discardDeck;
    }

    static discardCards(card) 
    {   let discardDeck = Store.getDiscardDeck();
        discardDeck.cards.push(card);
        Store.addDeckToStorage('discardDeck', discardDeck);

    }

    static deleteFromList(term) {
        const storeDeck = Store.getStorageDeck();

        storeDeck.cards.forEach(function(card, index){
            if(card.backTerm === term) {
                storeDeck.cards.splice(index, 1);
            }
        });
        Store.addDeckToStorage('storeDeck', storeDeck);
    }

    static mainToStorageDeck(term) {
        const mainDeck = Store.getMainDeck();
        const storeDeck = Store.getStorageDeck();

        mainDeck.cards.forEach(function(card, index){
            if(card.backTerm === term) {
                storeDeck.cards.push(card);
                mainDeck.cards.splice(index, 1);
                ui.addCard(card, '.card-list');
            }
        });
        Store.addDeckToStorage('mainDeck', mainDeck);
        Store.addDeckToStorage('storeDeck', storeDeck);
    }

    static storeToMainDeck(term) {
        const mainDeck = Store.getMainDeck();
        const storeDeck = Store.getStorageDeck();

        storeDeck.cards.forEach(function(card, index){
            if(card.backTerm === term) {
                mainDeck.cards.push(card);
                storeDeck.cards.splice(index, 1);
                ui.addCard(card, '.card-list');
            }
        });
        Store.addDeckToStorage('mainDeck', mainDeck);
        Store.addDeckToStorage('storeDeck', storeDeck);
    }

    static addCardsToStorage(card) 
    {   let storeDeck = Store.getStorageDeck();
        storeDeck.cards.push(card);
        Store.addDeckToStorage('storeDeck', storeDeck);

    }

    static addDeckToStorage(storeName, deck){
        localStorage.setItem(storeName, JSON.stringify(deck.cards));
    }

    static displayCards() {
        let storeDeck = Store.getStorageDeck();
        storeDeck.cards.forEach(function(card){
            ui.addCard(card, '.card-list');
        });
    }

    static displayMainDeck() {
        const mainDeck = Store.getMainDeck();
        mainDeck.cards.forEach(function(card){
            ui.addCard(card, '.main-deck-list');
        });
    }

}

//instantiate ui
const ui = new UI;

//responsive event listeners
window.addEventListener('load', loadEvents);
window.addEventListener('resize', ui.setCardHeight);

//click events
document.querySelector('#flash-card').addEventListener('mousedown', ui.flipCard);
document.querySelector('#flash-card').addEventListener('mouseup', ui.flipCard);
document.querySelector('#shuffle').addEventListener('click', ui.dealCard);
document.querySelector('#next').addEventListener('click', ui.nextCardinDeck);
document.querySelector('#previous').addEventListener('click', ui.prevCardinDeck);
document.querySelector('.card-list').addEventListener('click', (e) => {
   
    ui.deleteCard(e.target);
    if(e.target.className === 'delete fa fa-times'){
    Store.deleteFromList(e.target.parentElement.parentElement.textContent);
    }
  
    e.preventDefault();
});

document.querySelector('.main-deck-list').addEventListener('click', (e) => {
    ui.deleteCard(e.target);
     if(e.target.className === 'delete fa fa-times'){
    Store.mainToStorageDeck(e.target.parentElement.parentElement.textContent); 
    }
    e.preventDefault();
});

//form guesser event
document.querySelector('#guess-form').addEventListener('submit', ui.cardGuesser);

//add card listener
document.getElementById('card-form').addEventListener('submit', ui.getAddCardForm);

//load events
function loadEvents(){
    Store.displayMainDeck();
    Store.displayCards();
    ui.setCardHeight();
    ui.dealCard();
}


//drag cards from storage deck to main deck. consider making this a button instead next time you work on it.
// let isClicked = false;

// document.querySelector('.card-list').addEventListener('mousedown', function(e) {
        
//     if (e.target.className === 'store-card'){
//         e.target.setAttribute('id', 'clicked-card');   
//         isClicked = true;
//      }
// });
// document.addEventListener('mouseup', function(e){

//     if (e.target.className === 'store-card'){
       
//         const deckListX = document.querySelector('.main-deck-list').getBoundingClientRect().x;
//         const deckListY = document.querySelector('.main-deck-list').getBoundingClientRect().y + window.scrollY; 
//         const deckListW = document.querySelector('.main-deck-list').getBoundingClientRect().width;
//         const deckListH = document.querySelector('.main-deck-list').getBoundingClientRect().height;
//         if(e.pageX >= deckListX && e.pageX <= deckListX + deckListW && e.pageY >= deckListY && e.pageY <= deckListY + deckListH){
            
//             Store.storeToMainDeck(e.target.textContent);
//             e.target.removeAttribute('id', 'clicked-card'); 
//             e.target.remove();
//             document.querySelector('.main-deck-list').innerHTML = '';
//             Store.displayMainDeck();

//         } 
//         isClicked = false;
        
//   }
// });

// document.addEventListener('mousemove', function(e){
//     if(isClicked){
//     const clickedCard = document.getElementById('clicked-card');
//     clickedCard.style.position = 'fixed';
//     clickedCard.style.left = `${e.pageX}px`;
//     clickedCard.style.top = `${e.pageY - window.scrollY}px`;
//     }
// });  

