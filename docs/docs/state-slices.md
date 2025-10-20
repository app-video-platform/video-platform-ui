---
title: State Slices (Index)
sidebar_position: 5
---

Brief index of Redux Toolkit slices and selectors. Expand as needed.

| Slice | File | Key actions | Selectors | Notes |
|---|---|---|---|---|
| `auth` | `src/store/auth-store/*` | `loginSuccess`, `logout` | `selectAuthUser` | Holds user + roles |
| `shopCart` | `src/store/shopCart/*` | `addProductToCart`, `removeFromCart` | `selectCartItems`, `selectCartTotal` | Total derived from items |
| `wishlist` | `src/store/wishlist/*` | `addToWishlist`, `removeFromWishlist`, `moveWishlistItemToCart` | `selectWishlistProducts` | Cross-action to cart |



> Owner: @aleb, el Hijo del Diablo · Last reviewed: 2025-10-20
