/**
 * Bahía Café — interactions & WhatsApp deep links
 * Replace WHATSAPP_NUMBER with your business number (country + number, no + or spaces).
 */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "573001234567";
  var DEFAULT_MESSAGE =
    "Hola Bahía Café, quiero información sobre café Mozzura en Cartagena.";

  function buildWhatsAppUrl(encodedMessage) {
    var base = "https://wa.me/" + WHATSAPP_NUMBER;
    if (encodedMessage) {
      base += "?text=" + encodedMessage;
    }
    return base;
  }

  function initWhatsAppLinks() {
    var nodes = document.querySelectorAll("[data-whatsapp-cta]");
    nodes.forEach(function (el) {
      var msg = el.getAttribute("data-msg") || DEFAULT_MESSAGE;
      el.setAttribute("href", buildWhatsAppUrl(encodeURIComponent(msg)));
      el.setAttribute("rel", "noopener noreferrer");
      el.setAttribute("target", "_blank");
    });
  }

  function initQrImage() {
    var img = document.getElementById("brew-qr");
    if (!img) return;
    var url = buildWhatsAppUrl(
      encodeURIComponent(
        "Hola Bahía Café, quiero la guía de preparación de café Mozzura."
      )
    );
    img.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=" +
      encodeURIComponent(url);
    img.alt = "Código QR para contactar por WhatsApp";
  }

  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    var threshold = 48;

    function update() {
      if (window.scrollY > threshold) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var nav = document.querySelector(".nav");
    var list = document.getElementById("nav-menu");
    if (!toggle || !nav || !list) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        close();
      } else {
        open();
      }
    });

    list.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 899px)").matches) {
          close();
        }
      });
    });

    window.addEventListener(
      "resize",
      function () {
        if (window.matchMedia("(min-width: 900px)").matches) {
          close();
        }
      },
      { passive: true }
    );
  }

  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    elements.forEach(function (el) {
      if (el.closest(".hero")) return;
      observer.observe(el);
    });
  }

  function initHeroReveal() {
    var hero = document.querySelector(".hero .reveal");
    if (!hero) return;
    window.requestAnimationFrame(function () {
      document.querySelectorAll(".hero .reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  function boot() {
    initWhatsAppLinks();
    initQrImage();
    initHeader();
    initNav();
    initReveal();
    initHeroReveal();
  }
})();
