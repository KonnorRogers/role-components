---
title: Tooltip
permalink: /components/tooltip/
---

Tooltips are intended for re-use and are close to how you would make a native tooltip.

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <button aria-describedby="tooltip">I'm a button.</button>
    <button aria-describedby="tooltip">I'm also a button.</button>
    <role-tooltip id="tooltip"> My tooltip </role-tooltip>
  </template>
</light-preview>
