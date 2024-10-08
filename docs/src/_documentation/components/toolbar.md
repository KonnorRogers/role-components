---
title: Toolbar
permalink: /components/toolbar/
---

<role-toolbar></role-toolbar>

<style>
  light-preview::part(iframe) { min-height: 70vh; }
</style>

"Focusable" elements in the toolbar should have a `tabindex="-1"` and a `data-role="toolbar-item"` attribute to be able to
properly implement the "roving tabindex"

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <script type="module">
      // import "/exports/toolbar/toolbar-register.js";
      // import "/exports/tooltip/tooltip-register.js";
    </script>
    <style>
      button {
        border-radius: 5px;
        border: 1px solid #ececea;
        outline: none;
        display: inline-flex;
        justify-content: center;
        padding: 5px;
        text-align: center;
        background: rgb(255 255 255);
      }

      button:is(:focus) {
        border: 2px solid #005a9c;
        padding: 4px;
      }

      button:is(:focus, :hover) {
        background-color: #e2efff;
      }
    </style>
    <div>
      <!-- Tooltip example -->
      <button data-role-tooltip="tooltip">I'm a button.</button>
      <button data-role-tooltip="tooltip">I'm also a button.</button>
      <role-tooltip id="tooltip"> My tooltip </role-tooltip>
      <br />
      <br />
      <!-- Toolbar example -->
      <div style="display: grid; max-width: 800px; margin: 0 auto">
        <role-toolbar aria-controls="textarea-1" style="">
          <button data-role="toolbar-item" data-role-tooltip="bold">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-type-bold"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="italics"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-type-italic"
              viewBox="0 0 16 16"
            >
              <path
                d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-type-underline"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"
              />
            </svg>
          </button>
          <span style="margin: 0 1rem"></span>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="align-left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-text-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="align-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-text-center"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="align-right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-text-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
        </role-toolbar>
        <textarea id="textarea-1"></textarea>
      </div>
      <br /><br /><br /><br />
      <!-- Toolbar example -->
      <div
        style="
          display: grid;
          grid-template-columns: 60px 1fr;
          max-width: 800px;
          margin: 0 auto;
        "
      >
        <role-toolbar orientation="vertical" aria-controls="textarea-2">
          <button data-role="toolbar-item" data-role-tooltip="bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-type-bold"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="italics"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-type-italic"
              viewBox="0 0 16 16"
            >
              <path
                d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-type-underline"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"
              />
            </svg>
          </button>
          <span style="margin: 0 1rem"></span>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="align-left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-text-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="align-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-text-center"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <button
            data-role="toolbar-item"
            tabindex="-1"
            data-role-tooltip="align-right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-text-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
        </role-toolbar>
        <textarea id="textarea-2"></textarea>
      </div>
      <role-tooltip id="bold"> Bold </role-tooltip>
      <role-tooltip id="italics"> Italics </role-tooltip>
      <role-tooltip id="underline"> Underline </role-tooltip>
      <role-tooltip id="align-left"> Align Left </role-tooltip>
      <role-tooltip id="align-center"> Align Center </role-tooltip>
      <role-tooltip id="align-right"> Align Right </role-tooltip>
    </div>
  </template>
</light-preview>
