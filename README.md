# Purpose

A collection of small reusable components.

## Installation

```
npm install role-components
```

## Usage

```js
// Register everything
import "role-components"

// Auto-registering
import "role-components/exports/tooltip/tooltip-register.js"

// Manual-Registering
import Tooltip from "role-components/exports/tooltip/tooltip.js"
Tooltip.define()

// Renaming and registering
import Tooltip from "role-components/exports/tooltip/tooltip.js"
Tooltip.define("my-tooltip")
```
