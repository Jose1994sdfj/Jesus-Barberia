---
name: JJ Barbería Firebase Auth System
description: Decisiones clave del sistema de auth + admin dashboard en citas.html
---

# Firebase Auth + Admin Dashboard — JJ Barbería

## Configuración Firebase
- La configuración vigente se encuentra en las páginas HTML; verificarla antes de cambiar reglas o proveedores porque los apuntes históricos pueden quedar obsoletos.
- Auth: Email/Password y Google deben estar activos en Firebase Console → Authentication → Sign-in method.

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
1. Crear cuenta admin con `jesusjuarezperezel10@gmail.com` en Firebase Auth.
2. Permitir que cada usuario autenticado lea/escriba solo `/usuarios/{su_uid}`; el admin puede leer y administrar ese nodo.

## PWA y acceso Google
- La PWA usa un service worker con caché de HTML; cualquier corrección de autenticación debe cambiar la versión del caché y probarse también después de actualizar la PWA instalada.

**Why:** Una PWA puede seguir sirviendo un `login.html` o `index.html` anterior aunque el servidor ya tenga el código corregido, provocando bucles de retorno después de Google.

**How to apply:** Publicar la nueva versión, abrir la PWA al menos una vez para activar el service worker nuevo y, si persiste el bucle, borrar los datos del sitio o reinstalar la PWA.
