// CSS Animations
const cssRoot = document.querySelector(":root");
const cardSlideTimeMs = 230;

// Cards
const cardContainerEl = document.querySelector(".card-container");
const cardEl = document.querySelector(".card");
const definitionText = document.querySelector("#definition");
const numText = document.querySelectorAll(".card-num");
const clearedScreen = document.querySelector(".cleared");
const termText = document.querySelector("#term");

// Buttons
const gotItBtn = document.querySelector("#got-it");
const missedItBtn = document.querySelector("#missed-it");

// Levels
const allLevelsLabel = document.querySelectorAll(".level-label");
const allLevelsEl = document.querySelectorAll(".level");
const allMarkers = document.querySelectorAll(".marker");
const marker1 = document.querySelector("#mark1");
const marker2 = document.querySelector("#mark2");
const marker3 = document.querySelector("#mark3");
const marker4 = document.querySelector("#mark4");
const marker5 = document.querySelector("#mark5");
let level1 = [];
let level2 = [];
let level3 = [];
let level4 = [];
let level5 = [];

// Local Storage
const saveName = "level1Save";

// Indexing and selection tracking
let selectedLevel = 1;
let numIndex = 1;

// Buttons
const resetBtn = document.querySelector("#reset-all");
const studyBtn = document.querySelector("#study-btn");
const editorBtn = document.querySelector("#access-editor");

// Editor
const editor = document.querySelector(".editor");
const addNewDiv = document.querySelector(".add-new");
const addNewBtn = document.querySelector("#addnew-btn");

// ----------------------------------------------
execute();

function execute() {
  // This loads the cards from local storage
  loadCardsFromSave();

  // This loads the first level since they all start from the first level
  loadSelectedLevel(1);

  // Initalizes the CSS variables (i put css value in js for consistency for later changes if needed)
  cssRoot.style.setProperty("--slide-out-time", `${cardSlideTimeMs}ms`);

  // Flips card on click
  cardContainerEl.addEventListener("click", () =>
    cardContainerEl.classList.toggle("flip-card")
  );

  // Flips card on spacebar, so they can zoom through cards 🏃🏼💨
  document.addEventListener("keydown", (e) => {
    if (e.key == " ") cardContainerEl.classList.toggle("flip-card");
  });

  // This resets the local storage and the page
  resetBtn.addEventListener("click", function () {
    if (confirm("This will reset EVERYTHING, do you want to continue?"))
      localStorage.setItem(saveName, null);
    location.reload();
  });

  // This loads the level when the level is clicked
  allLevelsEl.forEach(function (eachLevel) {
    eachLevel.addEventListener("click", () =>
      loadSelectedLevel(Number(eachLevel.id.split("-")[1]))
    );
  });

  // If the user can recall the card, then it moves the card up a level
  gotItBtn.addEventListener("click", function () {
    moveCardUpALevel();
  });

  // If the user can't recall the card, then it moves the card down a level
  missedItBtn.addEventListener("click", function () {
    moveCardDownALevel();
  });

  // Saves the editor and goes back to study mode 😎📚
  studyBtn.addEventListener("click", function () {
    studyBtn.classList.add("hidden");
    editorBtn.classList.remove("hidden");
    editor.classList.add("hidden");
    loadEditorCardsToStudy();
  });

  // Opens up the card editor
  editorBtn.addEventListener("click", function () {
    editorBtn.classList.add("hidden");
    editor.classList.remove("hidden");
    studyBtn.classList.remove("hidden");
    loadStudyCardsToEditor();
  });

  // inserts a new card in the editor
  addNewBtn.addEventListener("click", function () {
    addNewDiv.insertAdjacentHTML(
      "beforebegin",
      `
    <div class="edit-card editor-item">
      <div class="edit-term">
        <h1 class="edit-label">Term</h1>
        <input class="term-input"/>
      </div>
      <div class="edit-def">
        <h1 class="edit-label">Definition</h1>
        <textarea class="definition-input"></textarea>
      </div>
      <div class="edit-options">
        <div><p class="delete">✗</p></div>
      </div>
    </div>
    `
    );
  });
}

function fetchLevel(level) {
  switch (level) {
    case 1:
      return level1;
    case 2:
      return level2;
    case 3:
      return level3;
    case 4:
      return level4;
    case 5:
      return level5;
  }
}

function loadSelectedLevel(levelNum) {
  selectedLevel = levelNum;

  const curLevel = [level1, level2, level3, level4, level5][selectedLevel - 1]; // gets the current level

  // hides all the markers that are under the level buttons
  for (let i = 0; i < allMarkers.length; i++) {
    allMarkers[i].classList.add("hidden");
  }

  // shows the marker for the level
  allMarkers[selectedLevel - 1].classList.remove("hidden");

  if (curLevel == undefined || curLevel.length == 0) {
    // If the level is cleared
    cardContainerEl.classList.add("hidden"); // shows card element
    clearedScreen.classList.remove("hidden"); // hides cleared screen
    gotItBtn.classList.add("disabled"); // disables "got it" button
    missedItBtn.classList.add("disabled"); // disables "missed it" button
  } else {
    // If the level is not cleared
    cardContainerEl.classList.remove("hidden"); // hides card element
    clearedScreen.classList.add("hidden"); // shows cleared screen
    gotItBtn.classList.remove("disabled"); // enables "got it" button
    missedItBtn.classList.remove("disabled"); // enables "missed it" button
    loadCardInLevel(false); // loads the card immediately, no animation
  }

  updateLevelNums(); // updates the level numbers
}

function loadCardInLevel(shouldAnimate, isRight = true) {
  // If the level is cleared, then it will do the card animation, then hide the card element and show the cleared screen
  if (fetchLevel(selectedLevel).length === 0) {
    if (shouldAnimate) animateCardSwitch("", "", isRight);
    setTimeout(() => {
      cardContainerEl.classList.add("hidden");
      clearedScreen.classList.remove("hidden");
      gotItBtn.classList.add("disabled");
      missedItBtn.classList.add("disabled");
      return null;
    }, cardSlideTimeMs);
  } else {
    // If the level is not cleared, then it will get the first card of the selected level
    const newCard = fetchLevel(selectedLevel)[0];
    const newTerm = newCard[0]; // gets the term from the first card
    const newDef = newCard[1]; // gets the definition from the first card

    // If the card should be animated then it will run the animation
    if (shouldAnimate) animateCardSwitch(newTerm, newDef, isRight);
    // If the card shouldn't be animated just load the card manually
    else {
      termText.textContent = newTerm;
      definitionText.textContent = newDef;
      numText.forEach(
        (eachNum) =>
          (eachNum.textContent = `${numIndex}/${
            fetchLevel(selectedLevel).length
          }`)
      );
    }
  }
}

function moveCardUpALevel() {
  // If the card is at the first level, it won't push it up any further
  if (selectedLevel == 1) level1.push(...level1.splice(0, 1));
  // If the card is not at the first level, it will push it up one level
  else
    fetchLevel(selectedLevel - 1).push(
      ...fetchLevel(selectedLevel).splice(0, 1)
    );

  // Used for the card number text on the top of the card
  numIndex++;

  // makes sure the numIndex doesn't go over the number of cards in the level
  if (numIndex > fetchLevel(selectedLevel).length) numIndex = 1;

  loadCardInLevel(true); // loads the next card
  updateLevelNums(); // updates the level numbers
}

function moveCardDownALevel() {
  // If the card is at the last level, it won't push it down any further
  if (selectedLevel == 5) level5.push(...level5.splice(0, 1));
  // If the card is not at the last level, it will push it down one level
  else
    fetchLevel(selectedLevel + 1).push(
      ...fetchLevel(selectedLevel).splice(0, 1)
    );

  // Used for the card number text on the top of the card
  numIndex++;

  // makes sure the numIndex doesn't go over the number of cards in the level
  if (numIndex > fetchLevel(selectedLevel).length) numIndex = 1;

  loadCardInLevel(true, false); // loads the next card
  updateLevelNums(); // updates the level numbers
}

function loadCardsFromSave() {
  let noCards = true;
  let currentSave = JSON.parse(localStorage.getItem(saveName));

  // If there are no cards in the save it will replace the level with an empty array
  if (currentSave == null) level1 = [];
  // Just in case the save is improperly assigned, it won't crash the program
  else if (Array.isArray(currentSave)) {
    // If there is content in the save
    if (currentSave.length !== 0) {
      noCards = false;
      level1 = currentSave;
    }
  }

  // renders default cards if there are no cards in the save
  if (noCards) {
    level1 = [
      ["Click Me!", "Click the icon in the top right to add your own cards!"],
    ];
  }
}

function updateLevelNums() {
  const allLevelsArr = [level1, level2, level3, level4, level5];

  // loops through all levels, counts their cards, and updates the display
  for (let i = 0; i < allLevelsLabel.length; i++) {
    allLevelsLabel[i].textContent = allLevelsArr[i].length;
  }
}

function animateCardSwitch(termPar, definitionPar, isRight) {
  console.log("animation ran!");
  // if the card is flipped, it will keep it flipped and do an animation that works with it flipped
  if (cardContainerEl.classList.contains("flip-card"))
    cssRoot.style.setProperty("--slide-animation", "slide-out-back");
  // if the card is not flipped, it will keep it not flipped and do an animation works with it not flipped
  else cssRoot.style.setProperty("--slide-animation", "slide-out");

  // changes the direction of the card slide effect
  cssRoot.style.setProperty("--is-inverse", `${isRight ? -1 : 1}`);

  // assigns the animation class
  cardContainerEl.classList.add("slide-out");

  // waits for the animation to finish about 60% through before changing the text
  setTimeout(() => {
    termText.textContent = termPar;
    definitionText.textContent = definitionPar;
    numText.forEach(
      (eachNum) =>
        (eachNum.textContent = `${numIndex}/${
          fetchLevel(selectedLevel).length
        }`)
    );
  }, cardSlideTimeMs * 0.6);

  // waits for the animation to finish before removing the animation class
  setTimeout(
    () => cardContainerEl.classList.remove("slide-out"),
    cardSlideTimeMs
  );
}

function loadEditorCardsToStudy() {
  // Extracts all the terms and definitions from the editor
  const allTerms = document.querySelectorAll(".term-input");
  const allDefs = document.querySelectorAll(".definition-input");

  // Clears all the levels
  level1 = [];
  level2 = [];
  level3 = [];
  level4 = [];
  level5 = [];

  // Adds all the extracted terms and definitions to level 1 as cards
  for (let i = 0; i < allTerms.length; i++) {
    level1.push([allTerms[i].value, allDefs[i].value]);
  }

  // Adds the cards to to local storage
  localStorage.setItem(saveName, JSON.stringify(level1));

  // Loads the cards to the first level
  loadSelectedLevel(1);
}

function loadStudyCardsToEditor() {
  // Combines all the cards from all the levels into a single list and sorts it
  const combinedCards = [
    ...level1,
    ...level2,
    ...level3,
    ...level4,
    ...level5,
  ].sort();

  // Extracts all the terms and definitions from the combined cards into terms and definitions lists
  let allTerms = [];
  let allDefs = [];
  for (let i = 0; i < combinedCards.length; i++) {
    allTerms.push(combinedCards[i][0]);
    allDefs.push(combinedCards[i][1]);
  }

  // clears the editor of possible previous content in it
  editor.innerHTML = "";

  // Adds the div to add new cards to the editor
  editor.insertAdjacentElement("afterbegin", addNewDiv);

  // Adds all the cards to the editor
  for (let i = 0; i < allTerms.length; i++) {
    addNewDiv.insertAdjacentHTML(
      "beforebegin",
      `
    <div class="edit-card editor-item">
      <div class="edit-term">
        <h1 class="edit-label">Term</h1>
        <input class="term-input" value="${allTerms[i]}"/>
      </div>
      <div class="edit-def">
        <h1 class="edit-label">Definition</h1>
        <textarea class="definition-input">${allDefs[i]}</textarea>
      </div>
      <div class="edit-options">
        <div><p class="delete">✗</p></div>
      </div>
    </div>
    `
    );
  }

  // Makes the delete button functional, so it deletes the card when clicked
  document.querySelectorAll(".delete").forEach((eachDelete) => {
    eachDelete.addEventListener("click", () => {
      eachDelete.closest(".edit-card").remove();
    });
  });
}
