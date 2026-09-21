/*
 * Personnalisation : modifie ces valeurs, puis republie le dossier sur GitHub Pages.
 * Pour recevoir automatiquement un courriel, crée un formulaire gratuit sur formspree.io
 * et colle son URL dans emailEndpoint (ex. https://formspree.io/f/xxxxx).
 */
const CONFIG = {
  question: "Veux-tu être mon/ma partenaire d’aventure ?",
  emailEndpoint: "https://formspree.io/f/xppwdqey",
  fallbackEmail: "",
};

const question = document.querySelector("#question");
const nameStep = document.querySelector("#name-step");
const nameForm = document.querySelector("#name-form");
const nameInput = document.querySelector("#name-input");
const questionStep = document.querySelector("#question-step");
const hint = document.querySelector("#hint");
const actions = document.querySelector("#actions");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const commentInput = document.querySelector("#comment-input");
const success = document.querySelector("#success");
const successMessage = document.querySelector("#success-message");
const error = document.querySelector("#error");

question.textContent = CONFIG.question;

let visitorName = "";

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  visitorName = nameInput.value.trim();

  if (!visitorName) {
    nameInput.focus();
    return;
  }

  nameStep.hidden = true;
  questionStep.hidden = false;
  questionStep.querySelector("#comment-input").focus();
});

const moveNoButton = () => {
  const buttonBounds = noButton.getBoundingClientRect();
  const maxX = Math.max(55, Math.min(140, (window.innerWidth - buttonBounds.width) / 2 - 20));
  const maxY = Math.max(35, Math.min(75, (window.innerHeight - buttonBounds.height) / 2 - 30));
  const x = Math.round(Math.random() * maxX * 2 - maxX);
  const y = Math.round(Math.random() * maxY * 2 - maxY);

  noButton.style.transform = `translate(${x}px, ${y}px)`;
};

noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointermove", moveNoButton);
noButton.addEventListener("focus", moveNoButton);
noButton.addEventListener("touchstart", moveNoButton, { passive: true });
noButton.addEventListener("click", moveNoButton);

const showError = (message) => {
  error.hidden = false;
  error.textContent = message;
};

const sendResponse = async () => {
  if (CONFIG.emailEndpoint) {
    const formData = new FormData();
    formData.append("response", "Oui");
    formData.append("question", CONFIG.question);
    formData.append("name", visitorName);
    formData.append("comment", commentInput.value.trim());

    const response = await fetch(CONFIG.emailEndpoint, {
      body: formData,
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("La réponse n’a pas pu être envoyée.");
    }
    return;
  }

  if (CONFIG.fallbackEmail) {
    const body = `Nom : ${visitorName}\nRéponse : Oui\nCommentaire : ${commentInput.value.trim() || "(aucun)"}`;
    window.location.href = `mailto:${CONFIG.fallbackEmail}?subject=Réponse à ta question&body=${encodeURIComponent(body)}`;
  }
};

yesButton.addEventListener("click", async () => {
  yesButton.disabled = true;
  noButton.hidden = true;
  hint.hidden = true;
  commentInput.disabled = true;
  error.hidden = true;
  success.hidden = false;
  successMessage.textContent = `Je savais que tu dirais oui, ${visitorName} ! Merci pour ta réponse 💌`;

  try {
    await sendResponse();
  } catch (sendError) {
    success.hidden = true;
    showError(`${sendError.message} Vérifie la configuration Formspree.`);
    yesButton.disabled = false;
    noButton.hidden = false;
    commentInput.disabled = false;
  }
});
