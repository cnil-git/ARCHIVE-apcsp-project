// CSS Animations
const cssRoot = document.querySelector(":root");
const cardSlideTimeMs = 230;

// Cards
const cardContainerEl = document.querySelector(".card-container");
const cardEl = document.querySelector(".card");
let termText = document.querySelector("#term");
let definitionText = document.querySelector("#definition");
const numText = document.querySelectorAll(".card-num");
const clearedScreen = document.querySelector(".cleared");
// Buttons
const gotItBtn = document.querySelector("#got-it");
const missedItBtn = document.querySelector("#missed-it");

// Levels
const allLevelsLabel = document.querySelectorAll(".level-label");
const allLevelsEl = document.querySelectorAll(".level");
const marker1 = document.querySelector("#mark1");
const marker2 = document.querySelector("#mark2");
const marker3 = document.querySelector("#mark3");
const marker4 = document.querySelector("#mark4");
const marker5 = document.querySelector("#mark5");
const allMarkers = document.querySelectorAll(".marker");
let level1 = [
  ["Click Me!", "Click the icon in the top right to add your own cards!"],
];
let level2 = [
  ["cool!", "we!"],
  ["nee!", "wzee!"],
];
let level3 = [];
let level4 = [];
let level5 = [];
const allSaves = [
  "level1Save",
  "level2Save",
  "level3Save",
  "level4Save",
  "level5Save",
];

// Inputs
let selectedCard;
let cardIndex = 0;
let selectedLevel = 1;
let numIndex = 1;

// Reset Button
const resetBtn = document.querySelector("#reset-all");

// ----------------------------------------------
main();

function main() {
  initalize();
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

function reassignLevel(levelNum, shouldEqual) {
  switch (levelNum) {
    case 1:
      level1 = shouldEqual;
      break;
    case 2:
      level2 = shouldEqual;
      break;
    case 3:
      level3 = shouldEqual;
      break;
    case 4:
      level4 = shouldEqual;
      break;
    case 5:
      level5 = shouldEqual;
      break;
  }
}

function loadLevel(levelNum) {
  selectedLevel = levelNum;
  const curLevel = [level1, level2, level3, level4, level5][levelNum - 1];
  for (let i = 0; i < allMarkers.length; i++) {
    allMarkers[i].classList.add("hidden");
  }

  allMarkers[levelNum - 1].classList.remove("hidden");

  if (curLevel == undefined || curLevel.length == 0) {
    // If the level is cleared
    cardContainerEl.classList.add("hidden");
    clearedScreen.classList.remove("hidden");
    gotItBtn.classList.add("disabled");
    missedItBtn.classList.add("disabled");
  } else {
    // If the level is not cleared
    cardContainerEl.classList.remove("hidden");
    clearedScreen.classList.add("hidden");
    gotItBtn.classList.remove("disabled");
    missedItBtn.classList.remove("disabled");
    loadCards(false);
  }

  updateLevelNums();
}

function loadCards(shouldAnimate, isRight = true) {
  if (fetchLevel(selectedLevel).length === 0) {
    cardContainerEl.classList.add("hidden");
    clearedScreen.classList.remove("hidden");
    gotItBtn.classList.add("disabled");
    missedItBtn.classList.add("disabled");
    return null;
  }
  const newCard = fetchLevel(selectedLevel)[0];
  const newTerm = newCard[0];
  const newDef = newCard[1];

  if (shouldAnimate) {
    switchCard(newTerm, newDef, isRight);
  } else {
    termText.textContent = newTerm;
    definitionText.textContent = newDef;
    numText.forEach(
      (eachNum) =>
        (eachNum.textContent = `${cardIndex + 1}/${
          fetchLevel(selectedLevel).length
        }`)
    );
  }
}

function initalize() {
  loadPreviousCards();

  cssRoot.style.setProperty("--slide-out-time", `${cardSlideTimeMs}ms`);

  cardContainerEl.addEventListener("click", () =>
    cardContainerEl.classList.toggle("flip-card")
  );

  document.addEventListener("keydown", (e) => {
    if (e.key == " ") cardContainerEl.classList.toggle("flip-card");
  });

  resetBtn.addEventListener("click", function () {
    if (confirm("This will reset EVERYTHING, do you want to continue?"))
      resetPage();
  });

  allLevelsEl.forEach(function (eachLevel) {
    eachLevel.addEventListener("click", () =>
      loadLevel(Number(eachLevel.id.split("-")[1]))
    );
  });

  loadLevel(1);

  gotItBtn.addEventListener("click", function () {
    moveCardUp();
  });

  missedItBtn.addEventListener("click", function () {
    moveCardDown();
  });
}

function moveCardUp() {
  if (selectedLevel == 1) level1.push(...level1.splice(0, 1));
  else
    fetchLevel(selectedLevel - 1).push(
      ...fetchLevel(selectedLevel).splice(0, 1)
    );

  numIndex++;
  if (numIndex > fetchLevel(selectedLevel).length) numIndex = 1;
  loadCards(true);
  updateLevelNums();
}

function moveCardDown() {
  if (selectedLevel == 5) level5.push(...level5.splice(0, 1));
  else
    fetchLevel(selectedLevel + 1).push(
      ...fetchLevel(selectedLevel).splice(0, 1)
    );

  numIndex++;
  if (numIndex > fetchLevel(selectedLevel).length) numIndex = 1;
  loadCards(true, false);
  updateLevelNums();
}

function loadPreviousCards() {
  let noCards = true;
  for (let i = 0; i < allSaves.length; i++) {
    const currentSave = localStorage.getItem(allSaves[i]);
    // If there are no cards in the save
    if (currentSave == null) reassignLevel(i + 1, []);
    else if (currentSave.isArray()) {
      // If there is content in the save
      if (currentSave.length !== 0) {
        noCards = false;
        reassignLevel(i + 1, currentSave);
      }
    }

    // If there are no saved cards within all the cards
    if (noCards) {
      level1 = [
        ["Click Me!", "Click the icon in the top right to add your own cards!"],
      ];
      level2 = [
        ["cool!", "we!"],
        ["nee!", "wzee!"],
      ];
      // level3 = [];
      // level4 = [];
      // level5 = [];
    }
  }
}

function updateLevelNums() {
  const allLevelsArr = [level1, level2, level3, level4, level5];
  for (let i = 0; i < allLevelsLabel.length; i++) {
    allLevelsLabel[i].textContent = allLevelsArr[i].length;
  }
}

function resetPage() {
  localStorage.setItem("savedTerms", null);
  localStorage.setItem("savedDefinitions", null);
  location.reload();
}

function switchCard(termPar, definitionPar, isRight) {
  // prettier-ignore
  if (cardContainerEl.classList.contains("flip-card")) cssRoot.style.setProperty("--slide-animation", "slide-out-back");
  else cssRoot.style.setProperty("--slide-animation", "slide-out");

  cssRoot.style.setProperty("--is-inverse", `${isRight ? -1 : 1}`);

  cardContainerEl.classList.add("slide-out");
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
  setTimeout(
    () => cardContainerEl.classList.remove("slide-out"),
    cardSlideTimeMs
  );
}


/*

            */

const editorBtn = document.querySelector("#access-editor");
const studyBtn = document.querySelector("#study-btn");
const editor = document.querySelector(".editor");
const addNewDiv = document.querySelector(".add-new");
const addNewBtn = document.querySelector("#addnew-btn");

studyBtn.addEventListener("click", function () {
  studyBtn.classList.add("hidden");
  editorBtn.classList.remove("hidden");
  editor.classList.add("hidden");
});


editorBtn.addEventListener("click", function () {
  editorBtn.classList.add("hidden");
  editor.classList.remove("hidden");
  studyBtn.classList.remove("hidden");
  loadEditorCards()
})

addNewBtn.addEventListener("click", function () {
  addNewDiv.insertAdjacentHTML("beforebegin", `
  <div class="edit-card editor-item">
    <div class="edit-term">
      <h1 class="edit-label">Term</h1>
      <input id="term-input"/>
    </div>
    <div class="edit-def">
      <h1 class="edit-label">Definition</h1>
      <textarea id="definition-input"></textarea>
    </div>
    <div class="edit-options">
      <img class="delete" src="imgs/delete-emoji.png" alt="delete!">
    </div>
  </div>
  `)
});

function loadEditorCards(){
  const combinedCards = [...level1, ...level2, ...level3, ...level4, ...level5]
  let allTerms = [];
  let allDefs = [];

  for (let i = 0; i < combinedCards.length; i++) {
    allTerms.push(combinedCards[i][0]);
    allDefs.push(combinedCards[i][1]);
  }

  editor.innerHTML = "";
  editor.insertAdjacentElement("afterbegin", addNewDiv);
  for(let i = 0; i < allTerms.length; i++){
    addNewDiv.insertAdjacentHTML("beforebegin", `
    <div class="edit-card editor-item">
      <div class="edit-term">
        <h1 class="edit-label">Term</h1>
        <input id="term-input" value="${allTerms[i]}"/>
      </div>
      <div class="edit-def">
        <h1 class="edit-label">Definition</h1>
        <textarea id="definition-input">${allDefs[i]}</textarea>
      </div>
      <div class="edit-options">
        <img class="delete" src="imgs/delete-emoji.png" alt="delete!">
      </div>
    </div>
    `)
  }
}