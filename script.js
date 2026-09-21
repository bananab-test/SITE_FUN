/*
 * Personnalisation : modifie ces valeurs, puis republie le dossier sur GitHub Pages.
 * Pour recevoir automatiquement un courriel, crée un formulaire gratuit sur formspree.io
 * et colle son URL dans emailEndpoint (ex. https://formspree.io/f/xxxxx).
 */
const CONFIG = {
  question: "Veux-tu être ma partenaire de course ?",
  emailEndpoint: "https://formspree.io/f/xppwdqey",
  fallbackEmail: "",
  adminPasswordEncoded: "YWxsb2FkbWlu",
};

const question = document.querySelector("#question");
const nameStep = document.querySelector("#name-step");
const nameForm = document.querySelector("#name-form");
const nameInput = document.querySelector("#name-input");
const questionStep = document.querySelector("#question-step");
const backToName = document.querySelector("#back-to-name");
const hint = document.querySelector("#hint");
const actions = document.querySelector("#actions");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const commentInput = document.querySelector("#comment-input");
const success = document.querySelector("#success");
const successMessage = document.querySelector("#success-message");
const error = document.querySelector("#error");
const submissionSummary = document.querySelector("#submission-summary");
const adminReset = document.querySelector("#admin-reset");
const adminForm = document.querySelector("#admin-form");
const adminPasswordInput = document.querySelector("#admin-password");
const adminStatus = document.querySelector("#admin-status");
const confirmModal = document.querySelector("#confirm-modal");
const modal = confirmModal.querySelector(".modal");
const modalIcon = document.querySelector("#modal-icon");
const modalKicker = document.querySelector("#modal-kicker");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalSummary = document.querySelector("#modal-summary");
const modalClose = document.querySelector("#modal-close");
const modalCancel = document.querySelector("#modal-cancel");
const modalConfirm = document.querySelector("#modal-confirm");
const modalActions = document.querySelector("#modal-actions");
const modalDone = document.querySelector("#modal-done");
const submissionKey = `question-sent:${CONFIG.emailEndpoint}:${CONFIG.question}`;
const resendDelayMs = 5 * 60 * 1000;

question.textContent = CONFIG.question;

let visitorName = "";
let responseSentAt = 0;
let cooldownTimer;

try {
  responseSentAt = Number(window.localStorage.getItem(submissionKey)) || 0;
} catch {
  responseSentAt = 0;
}

const getRemainingDelay = () => Math.max(0, resendDelayMs - (Date.now() - responseSentAt));

const saveSubmissionTime = (timestamp) => {
  responseSentAt = timestamp;
  try {
    window.localStorage.setItem(submissionKey, String(timestamp));
  } catch {
    // Le délai reste actif pendant cette ouverture si le stockage est indisponible.
  }
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const formatSentTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });

const unlockForm = () => {
  clearInterval(cooldownTimer);
  confirmModal.hidden = true;
  modalConfirm.disabled = false;
  modalCancel.disabled = false;
  modalClose.hidden = false;
  modalActions.hidden = false;
  modalDone.hidden = true;
  modal.classList.remove("is-success");
  hint.hidden = false;
  commentInput.hidden = false;
  commentInput.disabled = false;
  document.querySelector(".comment-label").hidden = false;
  actions.hidden = false;
  noButton.hidden = false;
  yesButton.disabled = false;
  yesButton.textContent = "Oui ! 💖";
  successMessage.textContent = "Le délai est terminé. Tu peux maintenant renvoyer une réponse.";
  success.hidden = true;
  adminReset.hidden = true;
  adminPasswordInput.value = "";
  adminStatus.textContent = "";
};

const showCooldown = () => {
  hint.hidden = true;
  commentInput.hidden = true;
  document.querySelector(".comment-label").hidden = true;
  actions.hidden = true;
  success.hidden = false;
  adminReset.hidden = false;
  adminStatus.textContent = "";
  successMessage.textContent = `Une réponse a déjà été envoyée à ${formatSentTime(responseSentAt)}.`;

  clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    const remaining = getRemainingDelay();

    if (remaining === 0) {
      clearInterval(cooldownTimer);
      unlockForm();
      return;
    }

    successMessage.textContent = `Une réponse a déjà été envoyée à ${formatSentTime(responseSentAt)}. Nouveau formulaire possible dans ${formatTime(remaining)}.`;
  }, 1000);
};

adminForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (btoa(adminPasswordInput.value) === CONFIG.adminPasswordEncoded) {
    saveSubmissionTime(0);
    unlockForm();
    return;
  }

  adminStatus.textContent = "Mot de passe incorrect.";
  adminPasswordInput.select();
});

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

backToName.addEventListener("click", () => {
  questionStep.hidden = true;
  nameStep.hidden = false;
  nameInput.focus();
  nameInput.select();
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

const getSubmissionDetails = () => ({
  name: visitorName,
  response: "Oui",
  comment: commentInput.value.trim() || "(aucun commentaire)",
});

const renderSubmissionSummary = (target) => {
  const details = getSubmissionDetails();
  target.textContent = "";

  for (const [label, value] of [
    ["Nom", details.name],
    ["Réponse", details.response],
    ["Commentaire", details.comment],
  ]) {
    const row = document.createElement("div");
    row.className = "summary-row";
    const labelElement = document.createElement("span");
    labelElement.className = "summary-label";
    labelElement.textContent = label;
    const valueElement = document.createElement("span");
    valueElement.textContent = value;
    row.append(labelElement, valueElement);
    target.append(row);
  }
};

const openConfirmation = () => {
  renderSubmissionSummary(modalSummary);
  modal.classList.remove("is-success");
  modalIcon.textContent = "💌";
  modalKicker.textContent = "Dernière vérification";
  modalTitle.textContent = "On envoie ta réponse ?";
  modalText.textContent = "Voici les informations qui seront envoyées.";
  modalActions.hidden = false;
  modalDone.hidden = true;
  modalClose.hidden = false;
  confirmModal.hidden = false;
  modalConfirm.focus();
};

const closeConfirmation = () => {
  if (!modalConfirm.disabled) {
    confirmModal.hidden = true;
    yesButton.disabled = false;
  }
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
  if (getRemainingDelay() > 0) {
    showCooldown();
    return;
  }

  error.hidden = true;
  openConfirmation();
});

modalCancel.addEventListener("click", closeConfirmation);
modalClose.addEventListener("click", closeConfirmation);
modalConfirm.addEventListener("click", async () => {
  modalConfirm.disabled = true;
  modalCancel.disabled = true;
  modalClose.hidden = true;
  modalKicker.textContent = "Envoi en cours";
  modalTitle.textContent = "On envoie ça…";
  modalText.textContent = "Un instant, ta réponse est en train de partir.";
  modalIcon.textContent = "✨";

  try {
    const wasSent = await sendResponse();

    if (wasSent) {
      yesButton.disabled = true;
      noButton.hidden = true;
      hint.hidden = true;
      commentInput.disabled = true;
      saveSubmissionTime(Date.now());
      success.hidden = false;
      successMessage.textContent = `Réponse envoyée avec succès à ${formatSentTime(responseSentAt)}, ${visitorName} !`;
      submissionSummary.textContent = `Nom : ${visitorName}\nRéponse : Oui\nCommentaire : ${commentInput.value.trim() || "(aucun commentaire)"}`;
      yesButton.textContent = "Réponse envoyée ✓";
      modal.classList.add("is-success");
      modalIcon.textContent = "🎉";
      modalKicker.textContent = "Envoi réussi";
      modalTitle.textContent = "C’est envoyé !";
      modalText.textContent = `Merci ${visitorName}, ta réponse a bien été reçue.`;
      renderSubmissionSummary(modalSummary);
      modalActions.hidden = true;
      modalDone.hidden = false;
      showCooldown();
    } else {
      modalKicker.textContent = "Prêt à envoyer";
      modalTitle.textContent = "Ton courriel est prêt";
      modalText.textContent = "Ouvre ton application de courriel pour terminer l’envoi.";
      modalConfirm.disabled = false;
      modalCancel.disabled = false;
      modalClose.hidden = false;
    }
  } catch (sendError) {
    showError(`${sendError.message} Vérifie la configuration Formspree.`);
    modalKicker.textContent = "Oups…";
    modalTitle.textContent = "L’envoi a échoué";
    modalText.textContent = sendError.message;
    modalConfirm.disabled = false;
    modalCancel.disabled = false;
    modalClose.hidden = false;
  }
});

modalDone.addEventListener("click", () => {
  confirmModal.hidden = true;
});
