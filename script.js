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
const submissionKey = `question-sent:${CONFIG.emailEndpoint}:${CONFIG.question}`;
const resendDelayMs = 5 * 60 * 1000;

question.textContent = CONFIG.question;

let visitorName = "";
let responseSentAt = 0;

try {
  responseSentAt = Number(window.localStorage.getItem(submissionKey)) || 0;
} catch {
  responseSentAt = 0;
}

const getRemainingDelay = () => Math.max(0, resendDelayMs - (Date.now() - responseSentAt));

const showCooldown = () => {
  const remainingMinutes = Math.ceil(getRemainingDelay() / 60000);
  hint.hidden = true;
  commentInput.hidden = true;
  document.querySelector(".comment-label").hidden = true;
  actions.hidden = true;
  success.hidden = false;
  successMessage.textContent = `Une réponse a déjà été envoyée. Tu pourras renvoyer le formulaire dans environ ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`;
};

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  visitorName = nameInput.value.trim();

  if (!visitorName) {
    nameInput.focus();
    return;
  }

  nameStep.hidden = true;
  questionStep.hidden = false;

  if (getRemainingDelay() > 0) {
    showCooldown();
    return;
  }

  commentInput.focus();
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
    return true;
  }

  if (CONFIG.fallbackEmail) {
    const body = `Nom : ${visitorName}\nRéponse : Oui\nCommentaire : ${commentInput.value.trim() || "(aucun)"}`;
    window.location.href = `mailto:${CONFIG.fallbackEmail}?subject=Réponse à ta question&body=${encodeURIComponent(body)}`;
  }

  return false;
};

yesButton.addEventListener("click", async () => {
  yesButton.disabled = true;
  noButton.hidden = true;
  hint.hidden = true;
  commentInput.disabled = true;
  error.hidden = true;
  yesButton.textContent = "Envoi en cours…";

  try {
    const wasSent = await sendResponse();

    if (wasSent) {
      try {
        window.localStorage.setItem(submissionKey, String(Date.now()));
      } catch {
        // Le blocage pendant cette session reste actif si le stockage est indisponible.
      }
      success.hidden = false;
      successMessage.textContent = `Réponse envoyée avec succès, ${visitorName} ! Merci 💌`;
      yesButton.textContent = "Réponse envoyée ✓";
    } else {
      success.hidden = false;
      successMessage.textContent = `Merci ${visitorName} ! Ton courriel est prêt à être envoyé.`;
      yesButton.textContent = "Réponse enregistrée";
    }
  } catch (sendError) {
    showError(`${sendError.message} Vérifie la configuration Formspree.`);
    yesButton.disabled = false;
    noButton.hidden = false;
    commentInput.disabled = false;
    yesButton.textContent = "Oui ! 💖";
  }
});
