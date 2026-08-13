# JJ Barbería

## Project overview

Static HTML/PWA site for JJ Barbería in Pachuca, served by the Express server in `server.js`.

- `index.html`: public home page
- `login.html`: Firebase email/password and Google authentication
- `citas.html`: booking flow and admin dashboard
- `tienda.html`: product catalog and orders
- `escuela.html`: academy area
- `server.js`: static hosting and email API

## Running on Replit

The `Start application` workflow runs `node server.js` on port 5000.

## Authentication and contacts

Firebase Authentication provides email/password and Google sign-in. After either provider signs in, `login.html` upserts the user's profile at `usuarios/{uid}` in Firebase Realtime Database. The admin Contacts and Correos tabs in `citas.html` read that same node.

For profiles to be saved, Realtime Database rules must allow an authenticated user to write only their own profile:

```json
"usuarios": {
  "$uid": {
    ".read": "auth != null && (auth.uid == $uid || auth.token.email == 'jesusjuarezperezel10@gmail.com')",
    ".write": "auth != null && (auth.uid == $uid || auth.token.email == 'jesusjuarezperezel10@gmail.com')"
  }
}
```

Google must also be enabled in Firebase Console under Authentication → Sign-in method. On mobile, the app uses redirect sign-in because mobile browsers commonly block popups; desktop uses a popup.

## User preferences

- Keep the existing static HTML/Firebase structure unless a change explicitly requires otherwise.
- Keep user-facing copy in Spanish.