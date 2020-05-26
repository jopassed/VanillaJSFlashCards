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

    UIMessages(msg, color, msgClass){
        const UImessage = document.querySelector(msgClass);
        UImessage.style.color = color;
        UImessage.innerText = msg;
        setTimeout(() => {
         UImessage.innerText = '';
        }, 3000);
    }

    addCard(card, deckClass){
        const li = document.createElement('li');
        li.className = 'store-card draggable';
        li.setAttribute('draggable', 'true');
        const ul = document.querySelector(deckClass)
        li.innerHTML = `${card.backTerm}<a href="#"><i class="edit fa fa-pencil"></i></a><a href="#"><i class="delete fa fa-times"></i></a>`
        li.ondragstart = this.dragStart;
        li.ondragend = this.dragEnd;
        if (deckClass === '.main-deck-list'){
        const anchors = li.querySelectorAll('a');
        anchors.forEach(anchor => {
            anchor.style.display = 'none';  
        });    
        }
        ul.appendChild(li);
    }

    cardGuesser(e){
        const UIcardTxt = document.querySelector('#flash-card-txt'),
              UIguessInput = document.querySelector('#guess-card'),
              mainDeck = Store.getMainDeck(),
              currentCard = mainDeck.cards[ui.findDisplayedCard(mainDeck)];
        if (UIguessInput.value === currentCard.backTerm){
            ui.UIMessages('Correct!', 'green','.message');
            UIcardTxt.innerText = currentCard.backTerm;
        } else {
            ui.UIMessages('Incorrect!', 'red','.message');
        }
        e.preventDefault();
    }

    dealCard(){
        const mainDeck = Store.getMainDeck(),
        UIcardTxt = document.querySelector('#flash-card-txt');
        //conditional for empy deck
        if(mainDeck.cards[0] != undefined){
        UIcardTxt.innerText = mainDeck.cards[mainDeck.shuffle()].frontDesc;
        } else {    
            UIcardTxt.innerText = 'No cards, add a card to start!';
        }
    }

    deleteCard(target){
        if(target.className === 'delete fa fa-times' || target.className === 'edit fa fa-pencil'){
            target.parentElement.parentElement.remove();         
        }
    }

    flipCard(e){
    const UIcardTxt = document.querySelector('#flash-card-txt'),
          mainDeck = Store.getMainDeck(),
          currentCardIndex = ui.findDisplayedCard(mainDeck),
          currentTxt = UIcardTxt.innerText,
          UIcard = document.querySelector("#flash-card");
          UIcard.classList.toggle('flip-card');
          
          setTimeout(() => {
              if(mainDeck.cards[0] != undefined){
                if(currentTxt === mainDeck.cards[currentCardIndex].frontDesc){
                UIcardTxt.innerText = mainDeck.cards[currentCardIndex].backTerm;
                } else {
                UIcardTxt.innerText = mainDeck.cards[currentCardIndex].frontDesc;
                }
            } else {
                UIcardTxt.innerText = 'yo, you are flipping but there be no cards brah';
            }
            UIcardTxt.classList.toggle('flip-card');
        },250);
  
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
        ui.UIMessages('Please add a card!', 'red', '.deck-message');
        } else{
        ui.addCard(card,'.card-list');
        //add to LS
        Store.addCardsToStorage(card);
        // tell me the card is added
        ui.UIMessages('Card Added!', 'green','.deck-message');
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
        ui.UIMessages('No More Cards...', 'red','.message');
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
        ui.UIMessages('No More Cards...', 'red', '.message');
    }
}
  //set card height responsively to width
    setCardHeight(){
        const UIflashcard = document.querySelector('#flash-card');
        let cardWidth = UIflashcard.offsetWidth;
        let setHeight = cardWidth / 1.666666666667;
        UIflashcard.style.height = `${setHeight}px`;
}

//drag and drop functions

    drop_handlerMain(e) {
        const dragged = document.getElementById('dragged');
        Store.storeToMainDeck(dragged.textContent);
        const list = document.querySelector('.main-deck-list');
        const anchors = dragged.querySelectorAll('a');
        anchors.forEach(anchor => {
            anchor.style.display = 'none';
    });
        dragged.removeAttribute('id', 'dragged');
        list.appendChild(dragged);

}

    drop_handler(e) {
        const dragged = document.getElementById('dragged');
        Store.mainToStorageDeck(dragged.textContent);
        const list = document.querySelector('.card-list');
        const anchors = dragged.querySelectorAll('a');
        anchors.forEach(anchor => {
            anchor.style.display = 'inline';
    });
        dragged.removeAttribute('id', 'dragged');
        list.appendChild(dragged);

}

    dragStart(e){
        e.target.setAttribute('id', 'dragged');     
}

    dragEnd(e){
        e.target.removeAttribute('id', 'dragged');     
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

    static pullFromList(term) {
        const storeDeck = Store.getStorageDeck();
        let pulledCard;

        storeDeck.cards.forEach(function(card, index){
            if(card.backTerm === term) {
               pulledCard = storeDeck.cards.splice(index, 1);
            }
        });
        Store.addDeckToStorage('storeDeck', storeDeck);
        return pulledCard[0];

    }

    static mainToStorageDeck(term) {
        const mainDeck = Store.getMainDeck();
        const storeDeck = Store.getStorageDeck();

        mainDeck.cards.forEach(function(card, index){
            if(card.backTerm === term) {
                storeDeck.cards.push(card);
                mainDeck.cards.splice(index, 1);
     
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
document.querySelector('#flash-card').addEventListener('click', ui.flipCard);
// document.querySelector('#flash-card').addEventListener('mouseup', ui.flipCard);
document.querySelector('#shuffle').addEventListener('click', ui.dealCard);
document.querySelector('#next').addEventListener('click', ui.nextCardinDeck);
document.querySelector('#previous').addEventListener('click', ui.prevCardinDeck);

document.querySelector('.card-list').addEventListener('click', (e) => {
    //remove from ui for edit and delete
    ui.deleteCard(e.target);
    if(e.target.className === 'delete fa fa-times'){
    Store.deleteFromList(e.target.parentElement.parentElement.textContent);
    }
    if(e.target.className === 'edit fa fa-pencil') {
        
        let pulledCard = Store.pullFromList(e.target.parentElement.parentElement.textContent);
        document.getElementById('term').value = pulledCard.backTerm;
        document.getElementById('description').value = pulledCard.frontDesc;
        ui.UIMessages('Edit the Card', 'green','.deck-message');
        
    }
  
    e.preventDefault();
});

document.querySelector('.main-deck-list').addEventListener('click', (e) => {
    ui.deleteCard(e.target);
    //delete from storage
     if(e.target.className === 'delete fa fa-times'){
    Store.mainToStorageDeck(e.target.parentElement.parentElement.textContent); 
    }  
    e.preventDefault();
});

//form guesser event
document.querySelector('#guess-form').addEventListener('submit', ui.cardGuesser);

//add card listener
document.getElementById('card-form').addEventListener('submit', ui.getAddCardForm);
//toggle add card page
document.getElementById('deckpagebtn').addEventListener('click',(e) => {
    document.querySelector('.deck-page').classList.add('show-page');
    e.preventDefault();
});

document.querySelector('.close-btn').addEventListener('click',(e) => {
    document.querySelector('.deck-page').classList.remove('show-page');
    ui.dealCard();
    e.preventDefault();
});
//drag events
const draggables = document.querySelectorAll('.draggable');
draggables.forEach(draggable => {
draggable.addEventListener('dragstart', ui.dragStart);
draggable.addEventListener('dragend', ui.dragEnd);
});
  
document.querySelector('.main-deck-list').addEventListener('drop', ui.drop_handlerMain);
document.querySelector('.main-deck-list').addEventListener('dragover', (e) => {
e.preventDefault();
});

document.querySelector('.card-list').addEventListener('drop', ui.drop_handler);
document.querySelector('.card-list').addEventListener('dragover', (e) => {
e.preventDefault();
});



//load events
function loadEvents(){
    Store.displayMainDeck();
    Store.displayCards();
    ui.setCardHeight();
    ui.dealCard();

}

