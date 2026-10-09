/* =========================================================================
   Mansi Tukadekar — Portfolio interactions
   Vanilla JS only, loaded with `defer`.
   Handles: theme toggle, sticky header, mobile nav, active-section
   highlighting, scroll reveal, back-to-top, the contact form and an
   optional certificate lightbox (for image files).
   ========================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Theme toggle (light / dark)
     The initial theme is set by an inline script in <head> to prevent a
     flash. Here we handle user toggling and persist the choice.
     --------------------------------------------------------------------- */
  function initTheme() {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    function sync() {
      var isDark = root.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    // Re-apply the stored theme (in case the head script was skipped).
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        root.setAttribute("data-theme", stored);
      }
    } catch (e) { /* ignore private-mode errors */ }
    sync();

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
      sync();
    });
  }

  /* ---------------------------------------------------------------------
     Sticky header: add a blurred background once the page is scrolled.
     --------------------------------------------------------------------- */
  function initHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mobile navigation: toggle, close on link click, Escape and outside tap.
     --------------------------------------------------------------------- */
  function initNav() {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!header || !toggle || !nav) return;

    function openMenu() {
      header.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }
    function closeMenu() {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    function isOpen() { return header.classList.contains("nav-open"); }

    toggle.addEventListener("click", function () {
      isOpen() ? closeMenu() : openMenu();
    });

    // Close after choosing a link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when clicking outside the header
    document.addEventListener("click", function (e) {
      if (isOpen() && !header.contains(e.target)) closeMenu();
    });

    // Reset when resizing back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---------------------------------------------------------------------
     Active-section highlighting with IntersectionObserver.
     --------------------------------------------------------------------- */
  function initActiveSection() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    var visible = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        var bestId = null;
        var bestRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > bestRatio) {
            bestRatio = visible[id];
            bestId = id;
          }
        });

        links.forEach(function (link) {
          var matches = bestId && link.getAttribute("href") === "#" + bestId;
          link.classList.toggle("is-active", !!matches);
          if (matches) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal. Reduced-motion users just see everything immediately.
     --------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Back-to-top button.
     --------------------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     Certificate lightbox.
     Works for image certificates (png/jpg/webp/svg). PDF certificates keep
     their normal "open in a new tab" behaviour. The file extension is read
     from each link, so swapping in a .png automatically enables the preview.
     --------------------------------------------------------------------- */
  function initCertLightbox() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".cert-link"));
    if (!links.length) return;

    var lightbox = document.getElementById("lightbox");
    var img = document.getElementById("lightbox-img");
    var caption = document.getElementById("lightbox-caption");
    var closeBtn = document.getElementById("lightbox-close");
    if (!lightbox || !img || !closeBtn) return;

    var lastFocus = null;

    function open(src, title) {
      lastFocus = document.activeElement;
      img.setAttribute("src", src);
      img.setAttribute("alt", title || "Certificate");
      if (caption) caption.textContent = title || "";
      lightbox.hidden = false;
      document.body.classList.add("no-scroll");
      closeBtn.focus();
    }
    function close() {
      lightbox.hidden = true;
      img.setAttribute("src", "");
      document.body.classList.remove("no-scroll");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    function isImage(href) {
      return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(href);
    }

    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (!isImage(href)) return; // PDFs and others open in a new tab

      link.addEventListener("click", function (e) {
        e.preventDefault();
        open(href, link.getAttribute("data-title"));
      });
    });

    closeBtn.addEventListener("click", close);
    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) close();
    });
  }

  /* ---------------------------------------------------------------------
     Contact form.

     >>> FORM ENDPOINT <<<
     To receive submissions by email, create a free endpoint and paste it
     below. Until then the form gracefully falls back to a prefilled
     mailto: link.

        Web3Forms:  https://web3forms.com
            var FORM_ENDPOINT = "https://api.web3forms.com/submit";
            var WEB3FORMS_ACCESS_KEY = "PASTE-YOUR-WEB3FORMS-ACCESS-KEY";
        Formspree:  https://formspree.io
            var FORM_ENDPOINT = "https://formspree.io/f/PASTE-YOUR-ID";
     --------------------------------------------------------------------- */
  var FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/your-id"
  var WEB3FORMS_ACCESS_KEY = ""; // only needed for Web3Forms
  var FALLBACK_EMAIL = "mansitukadekar@gmail.com";

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var submitBtn = document.getElementById("cf-submit");
    var submitLabel = submitBtn ? submitBtn.textContent : "Send Message";

    var fields = [
      { el: document.getElementById("cf-name"), error: document.getElementById("err-name"), label: "Please enter your name.", test: function (v) { return v.trim().length >= 2; } },
      { el: document.getElementById("cf-email"), error: document.getElementById("err-email"), label: "Please enter a valid email address.", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
      { el: document.getElementById("cf-subject"), error: document.getElementById("err-subject"), label: "Please add a subject.", test: function (v) { return v.trim().length >= 2; } },
      { el: document.getElementById("cf-message"), error: document.getElementById("err-message"), label: "Please write a short message.", test: function (v) { return v.trim().length >= 10; } }
    ];

    function validateField(field) {
      var valid = field.test(field.el.value);
      var wrap = field.el.closest(".form-field");
      wrap.classList.toggle("has-error", !valid);
      field.el.setAttribute("aria-invalid", valid ? "false" : "true");
      field.error.textContent = valid ? "" : field.label;
      return valid;
    }

    // Live feedback once a field has been touched
    fields.forEach(function (field) {
      field.el.addEventListener("blur", function () { validateField(field); });
      field.el.addEventListener("input", function () {
        if (field.el.closest(".form-field").classList.contains("has-error")) validateField(field);
      });
    });

    function setStatus(message, type) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove("is-success", "is-error");
      if (type) status.classList.add(type);
    }

    function mailtoFallback(values) {
      var body = "Name: " + values.name + "\nEmail: " + values.email + "\n\n" + values.message;
      var href = "mailto:" + FALLBACK_EMAIL +
        "?subject=" + encodeURIComponent(values.subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        setStatus("Please fix the highlighted fields and try again.", "is-error");
        var firstBad = form.querySelector(".form-field.has-error input, .form-field.has-error textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var values = {
        name: document.getElementById("cf-name").value.trim(),
        email: document.getElementById("cf-email").value.trim(),
        subject: document.getElementById("cf-subject").value.trim(),
        message: document.getElementById("cf-message").value.trim()
      };

      // No endpoint configured yet -> fall back to email.
      if (!FORM_ENDPOINT) {
        mailtoFallback(values);
        setStatus("Opening your email client with the message filled in...", "is-success");
        form.reset();
        return;
      }

      // Send to the configured endpoint.
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      var payload = {
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message
      };
      if (WEB3FORMS_ACCESS_KEY) payload.access_key = WEB3FORMS_ACCESS_KEY;

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          setStatus("Thanks for reaching out — I'll get back to you soon!", "is-success");
          form.reset();
        })
        .catch(function () {
          setStatus("Something went wrong. Opening your email client instead...", "is-error");
          mailtoFallback(values);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        });
    });
  }

  /* ---------------------------------------------------------------------
     Projects "View All Projects" / "Show Less" toggle.
     Starts collapsed (3 cards), expands to every available project.
     --------------------------------------------------------------------- */
  function initProjectsToggle() {
    var grid = document.getElementById("projects-grid");
    var toggle = document.getElementById("projects-toggle");
    if (!grid || !toggle) return;

    var collapsedLabel = "View All Projects";
    var expandedLabel = "Show Less";

    function setExpanded(expanded) {
      grid.classList.toggle("is-collapsed", !expanded);
      toggle.textContent = expanded ? expandedLabel : collapsedLabel;
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (expanded) {
        // Make sure freshly revealed cards are painted immediately.
        grid.querySelectorAll(".project-card").forEach(function (card) {
          card.classList.add("is-visible");
        });
      }
    }

    toggle.addEventListener("click", function () {
      setExpanded(grid.classList.contains("is-collapsed"));
    });
  }

  /* ---------------------------------------------------------------------
     Init everything on DOM ready.
     --------------------------------------------------------------------- */
  function init() {
    initTheme();
    initHeader();
    initNav();
    initActiveSection();
    initReveal();
    initBackToTop();
    initCertLightbox();
    initProjectsToggle();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
