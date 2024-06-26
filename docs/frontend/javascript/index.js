import "../styles/index.css"
import { Application } from "@hotwired/stimulus"

if (window.location.href.includes("localhost")) {
  function storeScroll () {
    const scrollTop = document.documentElement.scrollTop.toString()
    sessionStorage.setItem("scroll-height", scrollTop)
  }

  function restoreScroll () {
      const scrollHeight = Number(sessionStorage.getItem("scroll-height")) || 0
      document.documentElement.scrollTop = scrollHeight
  }

  window.addEventListener("beforeunload", storeScroll)
  window.addEventListener("unload", storeScroll)
  window.addEventListener("pageshow", restoreScroll)
  document.addEventListener("DOMContentLoaded", restoreScroll)
}

// Shoelace
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

import LazyLoader from "./src/lazy-loader.js"

import * as Turbo from "@hotwired/turbo"
window.Turbo = Turbo
import "./src/layout.js"
import "role-components"
import "@shoelace-style/shoelace/dist/components/popup/popup.js"
//
LazyLoader()
//
setBasePath((process.env.BASE_PATH || "") + "/shoelace-assets")

// Import all JavaScript & CSS files from src/_components
import components from "bridgetownComponents/**/*.{js,jsx,js.rb,css}"

window.Stimulus = Application.start()

import controllers from "./controllers/**/*.{js,js.rb}"
Object.entries(controllers).forEach(([filename, controller]) => {
  if (filename.includes("_controller.") || filename.includes("-controller.")) {
    const identifier = filename.replace("./controllers/", "")
      .replace(/[_-]controller..*$/, "")
      .replace("_", "-")
      .replace("/", "--")

    Stimulus.register(identifier, controller.default)
  }
})

if (window.Prism) {
  window.Prism.manual = true
}

;(() => {
  if (!window.scrollPositions) {
    window.scrollPositions = {};
  }

  function preserveScroll() {
    document.querySelectorAll('[data-preserve-scroll').forEach(element => {
      scrollPositions[element.id] = element.scrollTop;
    });
  }

  function restoreScroll(event) {
    if (event.detail && event.detail.newBody) {
      event.detail.newBody.querySelectorAll('[data-preserve-scroll]').forEach(element => {
        element.scrollTop = scrollPositions[element.id];
      });
    }

    document.querySelectorAll('[data-preserve-scroll').forEach(element => {
      element.scrollTop = scrollPositions[element.id];
    });

  }

  window.addEventListener('turbo:before-cache', preserveScroll);
  window.addEventListener('turbo:before-render', restoreScroll);
  window.addEventListener('turbo:render', restoreScroll);
})();

