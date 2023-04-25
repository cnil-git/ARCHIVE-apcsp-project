const cssRoot = document.querySelector(":root");
const cssVars = getComputedStyle(cssRoot);
const card = document.querySelector(".card-container");
const termText = document.querySelector("#term");
const definitionText = document.querySelector("#definition");
const cardSlideTimeMs = 400;

const terms = [];
const definitions = [];

cssRoot.style.setProperty("--slide-out-time", `${cardSlideTimeMs}ms`);

card.addEventListener("click", function () {
  this.classList.toggle("flip-card");
});

document.querySelector("#next-card").addEventListener("click", function () {
  switchCard("term", "definition", false);
});

// localStorage.setItem("dataKey", "dataValue");
// let retrievedData = localStorage.getItem("dataKey");

function switchCard(termPar, definitionPar, isFront) {
  // prettier-ignore
  if (card.classList.contains("flip-card")) cssRoot.style.setProperty("--slide-animation", "slide-out-back");
  else cssRoot.style.setProperty("--slide-animation", "slide-out");

  cssRoot.style.setProperty("--is-inverse", `${isFront ? 1 : -1}`);

  card.classList.add("slide-out");
  setTimeout(() => {
    termText.textContent = termPar;
    definitionText.textContent = definitionPar;
  }, cardSlideTimeMs * 0.6);
  setTimeout(() => card.classList.remove("slide-out"), cardSlideTimeMs);
}
