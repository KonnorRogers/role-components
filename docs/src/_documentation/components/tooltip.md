---
title: Tooltip
permalink: /components/tooltip/
---

Tooltips are intended for re-use and are close to how you would make a native tooltip.

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <button aria-describedby="tooltip">I'm a button.</button>
    <button aria-describedby="tooltip">I'm also a button.</button>
    <role-tooltip id="tooltip" strategy="fixed"> My tooltip </role-tooltip>
  </template>
</light-preview>

## Styling the tooltip

Generally, the 2 things you want to pass to the tooltip are `var(--background-color)` and `var(--border-color)`.
Let's see what that looks like in action:

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <style>
      role-tooltip {
        --background-color: Canvas;
        --border-color: gray;
        color: CanvasText;
      }
    </style>
    <button aria-describedby="tooltip-left">Tooltip Left</button>
    <role-tooltip id="tooltip-left" placement="left">Tooltip Left</role-tooltip>
    <br><br>
    <button aria-describedby="tooltip-right">Tooltip Right</button>
    <role-tooltip id="tooltip-right" placement="right">Tooltip Right</role-tooltip>
    <br><br>
    <button aria-describedby="tooltip-top">Tooltip Top</button>
    <role-tooltip id="tooltip-top" placement="top">Tooltip Top</role-tooltip>
    <br><br>
    <button aria-describedby="tooltip-bottom">Tooltip Bottom</button>
    <role-tooltip id="tooltip-bottom" placement="bottom">Tooltip Bottom</role-tooltip>
  </template>
</light-preview>

