const header = document.querySelector("[data-header]");
const modal = document.querySelector("[data-service-modal]");
const locationModal = document.querySelector("[data-location-modal]");
const form = document.querySelector("[data-service-form]");
const summary = document.querySelector("[data-form-summary]");
const printSummary = document.querySelector("[data-print-summary]");
const modelSelect = document.querySelector("[data-model-select]");
const manualModel = document.querySelector("[data-manual-model]");
const openButtons = document.querySelectorAll("[data-open-service-form]");
const openLocationButtons = document.querySelectorAll("[data-open-location]");
const closeButtons = document.querySelectorAll("[data-close-service-form]");
const closeLocationButtons = document.querySelectorAll("[data-close-location]");
const printButton = document.querySelector("[data-print-slip]");
const modeTitle = document.querySelector("[data-mode-title]");
const modeCopy = document.querySelector("[data-mode-copy]");
const summaryTitle = document.querySelector("[data-summary-title]");
const submitLabel = document.querySelector("[data-submit-label]");
const priceStatus = document.querySelector("[data-price-status]");
const modelPhoto = document.querySelector("[data-model-photo]");
const contactStep = document.querySelector("[data-contact-step]");
const sendinStep = document.querySelector("[data-sendin-step]");
const returnStep = document.querySelector("[data-return-step]");
const summaryBox = document.querySelector("[data-form-summary-box]");
const formActions = document.querySelector("[data-form-actions]");
const sendinRequiredFields = document.querySelectorAll("[data-sendin-required]");
const parallaxDividers = document.querySelectorAll("[data-parallax-divider], .visual-divider");
let formMode = "sendin";

const fixedPrice = "39 € Festpreis Montage";

const formModes = {
  price: {
    serviceWay: "Modellprüfung",
    title: "Preischeck",
    copy: "Modell auswählen. Bei gelisteten Modellen siehst du direkt den Festpreis.",
    summary: "",
    submit: "Modell auswählen",
    print: false,
  },
  sendin: {
    serviceWay: "Einsendung",
    title: "Reifenwechsel einsenden",
    copy: "Für gelistete Modelle mit Festpreis. Bitte nur das ausgebaute Rad bzw. die Felge einsenden.",
    summary: "Sendungszettel",
    submit: "Sendungszettel vorbereiten",
    print: true,
  },
};

function setModeText(flowState = getFlowState()) {
  const config = formModes[formMode];
  const isRequest = flowState === "request";
  const title = isRequest ? "Preisanfrage" : config.title;
  const copy = isRequest
    ? "Für dieses Modell ist kein Festpreis hinterlegt. Sende Name und E-Mail, dann kommt Preis und Machbarkeit vor dem Versand."
    : config.copy;
  const summary = flowState === "fixed" && formMode === "sendin" ? config.summary : "";

  if (modeTitle) modeTitle.textContent = title;
  if (modeCopy) modeCopy.textContent = copy;
  if (summaryTitle) {
    summaryTitle.textContent = summary;
    summaryTitle.hidden = !summary;
  }
}

function getFlowState() {
  const modelStatus = getModelStatus();
  if (!modelStatus.model) return "idle";
  return modelStatus.hasFixedPrice ? "fixed" : "request";
}

function getModelStatus() {
  if (!modelSelect) return { model: "", hasFixedPrice: false };
  const selectedModel = modelSelect.value;
  const isManual = selectedModel === "manual";
  const isUnclear = selectedModel === "Ich bin unsicher" || selectedModel === "";
  const manualValue = manualModel?.querySelector("input")?.value;
  return {
    model: isManual ? manualValue : selectedModel,
    hasFixedPrice: Boolean(selectedModel && !isManual && !isUnclear),
  };
}

function getFormData() {
  if (!form) return [];
  const data = new FormData(form);
  const modelStatus = getModelStatus();
  const flowState = getFlowState();
  const photoName = modelPhoto?.files?.[0]?.name;
  const street = data.get("street");
  const houseNumber = data.get("houseNumber");
  const postalCode = data.get("postalCode");
  const city = data.get("city");
  const returnAddress = [street && houseNumber ? `${street} ${houseNumber}` : street || houseNumber, [postalCode, city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const rows = [
    ["Nächster Schritt", flowState === "fixed" ? "Reifenwechsel einsenden" : flowState === "request" ? "Preisanfrage" : "Modell auswählen"],
    ["Modell", modelStatus.model || "Noch nicht angegeben"],
    ["Preis", flowState === "fixed" ? fixedPrice : flowState === "request" ? "Preis auf Anfrage" : "Noch offen"],
  ];

  if (flowState === "fixed" && formMode === "sendin") {
    rows.push(
      ["Leistung", data.get("serviceScope") || "Noch nicht angegeben"],
      ["Reifentyp", data.get("tireType") || "Noch nicht angegeben"]
    );
  }

  if (modelSelect?.value === "manual") {
    rows.push(["Foto", photoName || "Kein Foto ausgewählt"]);
  }

  rows.push(
    ["Name", data.get("customerName") || "Noch nicht angegeben"],
    ["E-Mail", data.get("email") || "Noch nicht angegeben"]
  );

  if (flowState === "fixed" && formMode === "sendin") {
    rows.push(["Rücksendeadresse", returnAddress || "Noch nicht angegeben"]);
  }

  return rows;
}

function renderSummary(target, rows) {
  if (!target) return;
  target.innerHTML = rows
    .map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join("");
}

function updateSummary() {
  const rows = getFormData();
  updatePriceStatus();
  renderSummary(summary, rows);
  renderSummary(printSummary, rows);
}

function updatePriceStatus() {
  if (!priceStatus) return;
  const modelStatus = getModelStatus();
  const flowState = getFlowState();
  const showSendinDetails = formMode === "sendin" && flowState === "fixed";
  const showRequestContact = flowState === "request";
  const showSummary = showSendinDetails;
  const showActions = showRequestContact || showSendinDetails;
  setModeText(flowState);
  if (sendinStep) sendinStep.hidden = !showSendinDetails;
  if (returnStep) returnStep.hidden = !showSendinDetails;
  sendinRequiredFields.forEach((field) => {
    field.required = showSendinDetails;
  });
  if (contactStep) contactStep.hidden = !(showRequestContact || showSendinDetails);
  if (summaryBox) summaryBox.hidden = !showSummary;
  if (formActions) formActions.hidden = !showActions;
  if (submitLabel) {
    submitLabel.textContent =
      flowState === "fixed" && formMode === "sendin"
        ? "Sendungszettel vorbereiten"
        : flowState === "request"
          ? "Preisanfrage versenden"
          : "Modell auswählen";
    submitLabel.disabled = flowState === "idle";
  }
  if (printButton) {
    printButton.hidden = !(formMode === "sendin" && flowState === "fixed");
  }
  if (flowState === "idle") {
    priceStatus.innerHTML = "<strong>Modell auswählen</strong><p>Bei gelisteten Modellen erscheint hier direkt der Festpreis.</p>";
    priceStatus.dataset.state = "idle";
    return;
  }
  if (flowState === "fixed") {
    priceStatus.innerHTML =
      formMode === "price"
        ? `<strong>${fixedPrice}</strong><div class="price-status__actions"><button class="button button--primary" type="button" data-price-action="sendin">Reifen einsenden</button><button class="button button--secondary" type="button" data-price-action="location">Anfahrt</button></div>`
        : `<strong>${fixedPrice}</strong><p>Für dieses Modell kannst du den Reifenwechsel per Einsendung vorbereiten. Ersatzteile und Rückversand werden vorab abgestimmt.</p>`;
    priceStatus.dataset.state = "fixed";
    return;
  }
  priceStatus.innerHTML = "<strong>Preis auf Anfrage</strong><p>Für dieses Modell senden wir dir erst Preis und Machbarkeit per E-Mail.</p>";
  priceStatus.dataset.state = "request";
}

function setFormMode(mode) {
  formMode = formModes[mode] ? mode : "sendin";
  setModeText();
  updateSummary();
}

function resetFormState() {
  form?.reset();
  if (manualModel) manualModel.hidden = true;
  const manualInput = manualModel?.querySelector("input");
  if (manualInput) manualInput.required = false;
  sendinRequiredFields.forEach((field) => {
    field.required = false;
  });
}

function openModal(mode = "sendin") {
  if (!modal) return;
  resetFormState();
  setFormMode(mode);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  updateSummary();
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  if (!locationModal || locationModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function openLocationModal() {
  if (!locationModal) return;
  locationModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeLocationModal() {
  if (!locationModal) return;
  locationModal.hidden = true;
  if (!modal || modal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.openServiceForm));
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

closeLocationButtons.forEach((button) => {
  button.addEventListener("click", closeLocationModal);
});

openLocationButtons.forEach((button) => {
  button.addEventListener("click", openLocationModal);
});

priceStatus?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-price-action]");
  if (!actionButton) return;
  if (actionButton.dataset.priceAction === "sendin") {
    setFormMode("sendin");
    updateSummary();
  }
  if (actionButton.dataset.priceAction === "location") {
    closeModal();
    openLocationModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && locationModal && !locationModal.hidden) {
    closeLocationModal();
    return;
  }
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeModal();
  }
});

modelSelect?.addEventListener("change", () => {
  const isManual = modelSelect.value === "manual";
  if (manualModel) manualModel.hidden = !isManual;
  const input = manualModel?.querySelector("input");
  if (input) input.required = isManual;
  updateSummary();
});

form?.addEventListener("input", updateSummary);
form?.addEventListener("change", updateSummary);

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateSummary();
  const flowState = getFlowState();
  const message =
    flowState === "fixed"
      ? "Danke. Der Sendungszettel ist vorbereitet. Bitte drucken und dem Paket beilegen."
      : "Danke. Die Preisanfrage ist vorbereitet.";
  form.querySelector(".service-form-summary h3").textContent = message;
});

printButton?.addEventListener("click", () => {
  updateSummary();
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  window.print();
});

function updateParallax() {
  parallaxDividers.forEach((divider) => {
    const image = divider.querySelector(".visual-divider__image");
    if (!image) return;
    const rect = divider.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const travel = window.matchMedia("(max-width: 760px)").matches ? 72 : 128;
    const offset = Math.max(-travel, Math.min(travel, -progress * travel));
    image.style.setProperty("--parallax-y", `${offset - travel * 0.5}px`);
  });
}

function updateHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

window.addEventListener(
  "scroll",
  () => {
    updateHeaderState();
    updateParallax();
  },
  { passive: true }
);

window.addEventListener("resize", updateParallax);
updateHeaderState();
updateParallax();
