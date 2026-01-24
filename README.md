
# Toaster Notification System

  

A lightweight, framework-agnostic toast notification utility for production web applications.

  

**Toaster** is designed as a local UI utility rather than a full design-system component. It focuses on predictable lifecycle management, accessibility-aware behavior, and safe cleanup, while remaining easy to embed into any project.

  

**Author:** Ashish Toppo

**License:** MIT

  

---

  

## Features

  

- Framework-agnostic (no dependencies)

- Automatic stacking with configurable limits

- Safe cleanup of timers and DOM nodes

- XSS-safe text rendering (`textContent`)

- Accessibility-aware ARIA roles

- Redirect support (cancellable or unskippable)

- Options-based API for future extensibility

- Automatic CSS injection (no setup required)

  

---

  

## Non-Goals

  

Toaster is intentionally **not**:

  

- A full UI framework component

- A design-system primitive

- A gesture / sound / animation framework

- A global notification service

  

This keeps the implementation small, auditable, and easy to reason about.

  

---

  

## Installation

  

Include the Toaster script in your application. Style are injected automatically on first use. No CSS imports required.

  

```html

<script  src="toaster.js"></script>

```



<head>

<meta  charset="UTF-8">

<meta  name="viewport"  content="width=device-width, initial-scale=1.0">

<title>Toaster Documentation</title>

<style>

body {

font-family: system-ui, -apple-system, sans-serif;

line-height: 1.6;

color: #1f2937;

max-width: 800px;

margin: 0  auto;

padding: 20px;

}

h2 { border-bottom: 1px  solid  #e5e7eb; padding-bottom: 0.5rem; margin-top: 2rem; }

h3 { margin-top: 1.5rem; color: #374151; }

p { margin-bottom: 1rem; }

/* Code Block Styling */

pre {

background-color: #f3f4f6;

padding: 1rem;

border-radius: 6px;

overflow-x: auto;

border: 1px  solid  #e5e7eb;

}

code {

font-family: 'Menlo', 'Monaco', monospace;

font-size: 0.9em;

color: #d63384;

}

pre  code { color: #1f2937; } /* Normal color for block code */

  

/* Table Styling */

table { width: 100%; border-collapse: collapse; margin: 1rem  0; }

th, td { text-align: left; padding: 12px; border-bottom: 1px  solid  #e5e7eb; }

th { background-color: #f9fafb; font-weight: 600; }

  

/* Warning Box */

.warning-box {

background-color: #fff7ed;

border-left: 4px  solid  #f59e0b;

padding: 1rem;

margin: 1rem  0;

color: #9a3412;

}

  

/* Lists */

ul { padding-left: 1.5rem; margin-bottom: 1rem; }

li { margin-bottom: 0.5rem; }

</style>

</head>

<body>

  

<section>

<h2>Basic Usage</h2>

<h3>API Signature</h3>

<pre><code>Toaster.{type}(message, redirectUrl?, options?);</code></pre>

  

<h3>Standard Toasts</h3>

<pre><code>Toaster.success("Profile updated successfully");

Toaster.error("Failed to connect to server");

Toaster.info("New version available");

Toaster.warning("Storage is almost full");</code></pre>

</section>

  

<section>

<h2>Redirect Handling</h2>

  

<h3>Cancellable Redirect (Default)</h3>

<p>Displays a countdown and allows the user to cancel navigation.</p>

<pre><code>Toaster.success("Login successful", "/dashboard");</code></pre>

  

<h3>Unskippable Redirect (Critical)</h3>

<p>Used when the user must not remain on the current page (e.g., session expiration, auth invalidation).</p>

<pre><code>Toaster.error("Session expired", "/login", {

unskippable: true

});</code></pre>

  

<h4>Behavior:</h4>

<ul>

<li>No close button</li>

<li>No cancel button</li>

<li>Assertive screen-reader announcement</li>

<li>Forced redirect after timeout</li>

</ul>

  

<div  class="warning-box">

<strong>⚠️ Warning:</strong> Use unskippable redirects sparingly. This intentionally removes user control.

</div>

</section>

  

<section>

<h2>Options Object</h2>

<p>The options object is designed to be extensible without breaking the API.</p>

<table>

<thead>

<tr>

<th>Property</th>

<th>Type</th>

<th>Default</th>

<th>Description</th>

</tr>

</thead>

<tbody>

<tr>

<td><code>unskippable</code></td>

<td>Boolean</td>

<td><code>false</code></td>

<td>Prevents dismissal and cancellation of redirects</td>

</tr>

</tbody>

</table>

</section>

  

<section>

<h2>Returned Control Handle</h2>

<p>All toast methods return a handle object:</p>

<pre><code>const toast = Toaster.info("Uploading…");

  

// Update message later

toast.update("Upload complete");

  

// Manually dismiss

toast.close();</code></pre>

</section>

  

<section>

<h2>Global Configuration</h2>

<p>Override defaults for future toasts. Existing toasts are not affected.</p>

<pre><code>Toaster.configure({

REDIRECT_MS: 3000,

AUTO_CLOSE_MS: 5000,

MAX_TOASTS: 3

});</code></pre>

</section>

  

<section>

<h2>Accessibility (A11Y)</h2>

<p>ARIA roles are assigned automatically to ensure critical messages interrupt screen readers while informational ones do not.</p>

<table>

<thead>

<tr>

<th>Role / Live</th>

<th>Types</th>

</tr>

</thead>

<tbody>

<tr>

<td>

<code>role="status"</code><br>

<code>aria-live="polite"</code>

</td>

<td>

• success<br>

• info

</td>

</tr>

<tr>

<td>

<code>role="alert"</code><br>

<code>aria-live="assertive"</code>

</td>

<td>

• error<br>

• warning<br>

• unskippable redirects

</td>

</tr>

</tbody>

</table>

</section>

  

<section>

<h2>Security & Safety</h2>

<ul>

<li><strong>XSS Protection:</strong> All content is injected via <code>textContent</code>.</li>

<li><strong>Memory Safety:</strong> Timers are tracked per-toast and cleared on removal.</li>

<li><strong>Stacking Cap:</strong> Oldest toast is evicted when the limit is exceeded.</li>

<li><strong>SPA-Safe:</strong> No retained DOM references after removal.</li>

</ul>

</section>

  

<section>

<h2>License</h2>

<p>MIT © Ashish Toppo</p>

<p>You are free to use, modify, and distribute this code with attribution.</p>

</section>

  

</body>

</html>
