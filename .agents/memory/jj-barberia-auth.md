---
name: JJ Barbería Firebase Auth System
description: Decisiones clave del sistema de auth + admin dashboard en citas.html
---

# Firebase Auth + Admin Dashboard — JJ Barbería

## Configuración Firebase
- Proyecto: bdfirebase-62a1b
- Realtime DB: https://bdfirebase-62a1b-default-rtdb.firebaseio.com
- Auth: Email/Password (debe activarse en Firebase Console → Authentication → Sign-in method)

## Detección de admin
- `ADMIN_EMAIL = "jesusjuarezperezel10@gmail.com"` — comparación directa en `auth.onAuthStateChanged`
- NO hay PIN, NO hay custom claims — solo comparación de email

## Arquitectura de pantallas
- `#screenAuth` — CSS `display:flex` por defecto, mostrada cuando no hay sesión
- `#screenBooking` — `style="display:none"` inicial, para usuarios normales
- `#screenAdmin` — CSS `display:none`, para admin
- `#mainNav` — `style="display:none"` inicial, mostrado después del login
- `showScreen(name)` controla todo (auth | booking | admin)

## Firebase DB structure
- `/citas/{pushId}` → incluye uid, userEmail desde la sesión del usuario
- `/usuarios/{uid}` → nombre, whatsapp, email, createdAt/updatedAt
- Admin tiene listener real-time (`admListener`) en `db.ref("citas").orderByChild("fecha")`

## Inicialización lazy
- `renderServices()`, `initCal()`, `loadUserProfile()` se llaman SOLO después de auth
- Flag `calInitialized` evita doble inicialización
- `applyUrlServiceParam()` (citas.html?s=cortebarba) se llama también después del auth

**Why:** Evita que el wizard se renderice antes de saber si el usuario es admin.

## Pasos pendientes (fuera del código)
1. Activar Email/Password en Firebase Console → Authentication → Sign-in method
2. Crear cuenta admin con `jesusjuarezperezel10@gmail.com` en Firebase Auth
3. Actualizar Firebase Security Rules para requerir autenticación en escritura
