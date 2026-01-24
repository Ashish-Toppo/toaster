
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

