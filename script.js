/* ==========================================================================
   INTEGRA CRÉDITOS — Script principal
   ========================================================================== */

// TODO: Reemplazar con el número real de WhatsApp de la empresa (formato: código país + número, sin espacios ni "+")
const WHATSAPP_NUMBER = "573000000000";
const WHATSAPP_DEFAULT_MESSAGE = "Hola, quiero recibir información sobre créditos con Integra Créditos.";

/**
 * Abre una conversación de WhatsApp con el número configurado.
 * Centraliza el comportamiento para que sea fácil de mantener o reemplazar
 * por otra integración en el futuro.
 */
function openWhatsApp(message) {
  const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MESSAGE);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, "_blank", "noopener");
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileNav();
  initHeroAnimation();
  initAccordion();
  initWhatsAppButtons();
  initFormValidation();
  initFooterYear();
});

/* ---------------------------------------------------------------------- *
 * Tema claro / oscuro
 * ---------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  const root = document.documentElement;
  const STORAGE_KEY = "integra-theme";

  function applyTheme(theme, { persist } = { persist: false }) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      toggleBtn.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      toggleBtn.setAttribute("aria-pressed", "false");
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (err) {
        // localStorage no disponible; el tema simplemente no persistirá.
      }
    }
  }

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    storedTheme = null;
  }

  if (storedTheme === "dark" || storedTheme === "light") {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark", { persist: true });
  });

  // Si el usuario nunca ha elegido manualmente, seguir la preferencia del sistema.
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      let hasManualPreference = false;
      try {
        hasManualPreference = !!localStorage.getItem(STORAGE_KEY);
      } catch (err) {
        hasManualPreference = false;
      }
      if (!hasManualPreference) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }
}

/* ---------------------------------------------------------------------- *
 * Menú móvil
 * ---------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  const overlay = document.getElementById("navOverlay");

  function closeNav() {
    nav.classList.remove("is-open");
    overlay.classList.remove("is-active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menú");
  }

  function openNav() {
    nav.classList.add("is-open");
    overlay.classList.add("is-active");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Cerrar menú");
  }

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });

  overlay.addEventListener("click", closeNav);

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

/* ---------------------------------------------------------------------- *
 * Animación de entrada del hero (un único momento orquestado)
 * ---------------------------------------------------------------------- */
function initHeroAnimation() {
  const svg = document.querySelector(".hero__svg");
  if (!svg) return;
  // Pequeño retraso para asegurar que el navegador pinte el estado inicial
  // antes de disparar las animaciones definidas en CSS.
  requestAnimationFrame(() => {
    setTimeout(() => svg.classList.add("is-ready"), 60);
  });
}

/* ---------------------------------------------------------------------- *
 * Acordeón de preguntas frecuentes
 * ---------------------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll("#accordion .accordion__item");

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion__trigger");
    const panel = item.querySelector(".accordion__panel");

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Cerrar cualquier otro panel abierto (solo uno abierto a la vez).
      items.forEach((otherItem) => {
        if (otherItem === item) return;
        const otherTrigger = otherItem.querySelector(".accordion__trigger");
        const otherPanel = otherItem.querySelector(".accordion__panel");
        otherTrigger.setAttribute("aria-expanded", "false");
        otherPanel.style.maxHeight = null;
      });

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}

/* ---------------------------------------------------------------------- *
 * Botones de WhatsApp
 * ---------------------------------------------------------------------- */
function initWhatsAppButtons() {
  const ids = ["heroWhatsapp", "ctaWhatsapp", "footerWhatsapp", "whatsappFab"];
  ids.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => openWhatsApp());
  });
}

/* ---------------------------------------------------------------------- *
 * Validación y envío simulado del formulario de contacto
 * ---------------------------------------------------------------------- */
function initFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successMessage = document.getElementById("formSuccess");
  const submitBtn = form.querySelector(".form__submit");

  const fields = {
    fullName: {
      input: document.getElementById("fullName"),
      errorEl: document.getElementById("err-fullName"),
      validate: (value) => (value.trim().length >= 3 ? "" : "Ingresa tu nombre completo."),
    },
    phone: {
      input: document.getElementById("phone"),
      errorEl: document.getElementById("err-phone"),
      validate: (value) => (/^[0-9+\s()-]{7,15}$/.test(value.trim()) ? "" : "Ingresa un teléfono válido."),
    },
    email: {
      input: document.getElementById("email"),
      errorEl: document.getElementById("err-email"),
      validate: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Ingresa un correo electrónico válido."),
    },
    reason: {
      input: document.getElementById("reason"),
      errorEl: document.getElementById("err-reason"),
      validate: (value) => (value ? "" : "Selecciona el motivo de tu solicitud."),
    },
    message: {
      input: document.getElementById("message"),
      errorEl: document.getElementById("err-message"),
      validate: (value) => (value.trim().length >= 10 ? "" : "Cuéntanos brevemente qué necesitas (mínimo 10 caracteres)."),
    },
    consent: {
      input: document.getElementById("consent"),
      errorEl: document.getElementById("err-consent"),
      validate: (value) => (value ? "" : "Debes aceptar el tratamiento de datos para continuar."),
    },
  };

  function getFieldValue(field) {
    if (field.input.type === "checkbox") return field.input.checked;
    return field.input.value;
  }

  function setFieldState(key, errorText) {
    const field = fields[key];
    const row = field.input.closest(".form__row");
    field.errorEl.textContent = errorText;
    row.classList.toggle("is-invalid", Boolean(errorText));
  }

  function validateField(key) {
    const field = fields[key];
    const error = field.validate(getFieldValue(field));
    setFieldState(key, error);
    return !error;
  }

  // Validación en tiempo real al salir de cada campo.
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    const eventName = field.input.type === "checkbox" ? "change" : "blur";
    field.input.addEventListener(eventName, () => validateField(key));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isFormValid = true;
    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      const firstInvalid = form.querySelector(".form__row.is-invalid input, .form__row.is-invalid select, .form__row.is-invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      successMessage.classList.remove("is-visible");
      return;
    }

    submitBtn.setAttribute("disabled", "true");
    submitBtn.querySelector(".form__submit-text").textContent = "Enviando...";

    const payload = {
      fullName: fields.fullName.input.value.trim(),
      phone: fields.phone.input.value.trim(),
      email: fields.email.input.value.trim(),
      reason: fields.reason.input.value,
      amount: document.getElementById("amount").value.trim(),
      message: fields.message.input.value.trim(),
      consent: fields.consent.input.checked,
    };

    // Simulación de envío. Reemplazar este bloque por una llamada real, por ejemplo:
    //
    //   fetch("https://tu-backend-o-formspree.example/endpoint", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   })
    //     .then((response) => { ... })
    //     .catch((error) => { ... });
    //
    // TODO: Conectar con el backend, Formspree, EmailJS u otro servicio real.
    setTimeout(() => {
      console.log("Formulario listo para enviar:", payload);

      form.reset();
      Object.keys(fields).forEach((key) => setFieldState(key, ""));

      successMessage.textContent = "¡Gracias! Hemos recibido tu solicitud. Pronto nos pondremos en contacto contigo.";
      successMessage.classList.add("is-visible");

      submitBtn.removeAttribute("disabled");
      submitBtn.querySelector(".form__submit-text").textContent = "Solicitar información";
    }, 900);
  });
}

/* ---------------------------------------------------------------------- *
 * Año dinámico en el footer
 * ---------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
