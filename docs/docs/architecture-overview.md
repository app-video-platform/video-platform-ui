---
sidebar_position: 2
title: Architecture Overview
---

A high-level picture of the frontend.

```mermaid
graph TD
  User -->|clicks| App[React App]
  App --> Router[React Router]
  App --> Store[(Redux Toolkit)]
  App --> API
  API --> DB[(Database)]
```

> Owner: @aleb, el Hijo del Diablo · Last reviewed: 2025-10-20