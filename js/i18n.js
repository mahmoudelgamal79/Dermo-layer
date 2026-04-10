(function () {
  "use strict";

  const STORAGE_KEY = "wen-lang";
  const DEFAULT_LANG = "en";

  function getByPath(obj, path) {
    if (!obj || !path) return null;
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function applyTranslations(dict) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getByPath(dict, key);
      if (val !== null && val !== undefined) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = getByPath(dict, key);
      if (val !== null && val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = getByPath(dict, key);
      if (val !== null && val !== undefined) el.placeholder = val;
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var val = getByPath(dict, key);
      if (val !== null && val !== undefined) el.alt = val;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      var val = getByPath(dict, key);
      if (val !== null && val !== undefined) el.setAttribute("aria-label", val);
    });

    var titleKey = document.body.getAttribute("data-title-key");
    if (titleKey) {
      var pageTitle = getByPath(dict, titleKey);
      var brand = getByPath(dict, "meta.shortBrand");
      if (pageTitle && brand) document.title = pageTitle + " — " + brand;
      else if (pageTitle) document.title = pageTitle;
    } else {
      var siteTitle = getByPath(dict, "meta.siteTitle");
      if (siteTitle) document.title = siteTitle;
    }

    var desc = getByPath(dict, "meta.siteDescription");
    var metaDesc = document.querySelector('meta[name="description"]');
    if (desc && metaDesc) metaDesc.setAttribute("content", desc);
  }

  function setLangButtonsActive(lang) {
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  window.WEN_I18N = {
    dict: null,
    lang: DEFAULT_LANG,

    init: function () {
      var stored = localStorage.getItem(STORAGE_KEY);
      var lang = stored === "ar" || stored === "en" ? stored : DEFAULT_LANG;
      return this.setLang(lang);
    },

    setLang: function (lang) {
      var self = this;
      if (lang !== "en" && lang !== "ar") lang = DEFAULT_LANG;
      return fetch("lang/" + lang + ".json")
        .then(function (res) {
          if (!res.ok) throw new Error("lang load failed");
          return res.json();
        })
        .then(function (dict) {
          self.dict = dict;
          self.lang = lang;
          localStorage.setItem(STORAGE_KEY, lang);
          document.documentElement.lang = lang === "ar" ? "ar" : "en";
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          applyTranslations(dict);
          setLangButtonsActive(lang);
          document.dispatchEvent(new CustomEvent("wen:langchange", { detail: { lang: lang } }));
        })
        .catch(function () {
          if (lang !== DEFAULT_LANG) return self.setLang(DEFAULT_LANG);
          console.error("WEN i18n: could not load language files.");
        });
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-set-lang");
        window.WEN_I18N.setLang(lang);
      });
    });
    window.WEN_I18N.init();
  });
})();
