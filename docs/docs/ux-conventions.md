---
title: UX Conventions
sidebar_position: 11
---

## Loading
- Use skeleton or inline spinner for < 2s operations.
- Disable buttons during mutations (`disabled` + aria-busy).

## Errors
- Known business errors: inline message near the control.
- Unknown/500 errors: toast: "Something went wrong. Please retry."

## Toasts
- Success after user actions (add to cart, saved product).
- Avoid toasting on page-load fetches.

## Empty states
- `/app/library/*` tabs: show helpful hints instead of blank tables.

## Forms
- Client validation first; server errors mapped to fields.
- Submit buttons: `type="submit"` + `disabled` when invalid or loading.


> Owner: @aleb, el Hijo del Diablo · Last reviewed: 2025-10-20
