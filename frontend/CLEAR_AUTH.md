# Clear Authentication Guide

## Problem: Auto-login or stuck with old user session

If you're experiencing issues with automatic login or being stuck with an old user session (like John Doe), follow these steps:

## Solution 1: Clear Browser Data (Recommended)

1. Open your browser's Developer Tools (F12)
2. Go to **Console** tab
3. Paste and run this command:

```javascript
// Clear all auth-related data
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_user');
localStorage.removeItem('user_role');
localStorage.removeItem('user_data');
document.cookie.split(";").forEach(c => { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('✅ Auth data cleared! Reload the page.');
```

4. Reload the page (`Ctrl+R` or `F5`)
5. You should see the login page

## Solution 2: Manual Clear

### Clear localStorage:
1. F12 → Application tab → Local Storage → http://localhost:3000
2. Delete these keys:
   - `auth_token`
   - `auth_user`
   - `user_role`
   - `user_data`

### Clear Cookies:
1. F12 → Application tab → Cookies → http://localhost:3000
2. Delete all cookies

3. Reload the page

## Solution 3: Private/Incognito Window

Open the app in a private/incognito window for a clean session:
- Chrome: `Ctrl+Shift+N`
- Firefox: `Ctrl+Shift+P`
- Edge: `Ctrl+Shift+N`

## Test Login Accounts

After clearing, use these accounts to login:

### Student Account:
- Email: `john.doe@student.edu`
- Password: (any password works in mock mode)

### Provider Account:
- Email: `jane.smith@university.edu`
- Password: (any password works in mock mode)

### Admin Account:
- Email: `admin@edumatch.com`
- Password: (any password works in mock mode)

## Changes Made to Fix Auto-Login

The following files were updated to prevent automatic fallback login:

1. `src/components/Navbar.tsx` - Removed John Doe fallback
2. `src/providers/RealTimeProvider.tsx` - Removed auto-user creation
3. `src/app/messages/page.tsx` - Removed fallback user

Now, if there's no valid token + user data, the system will correctly show the login page instead of auto-logging in as John Doe.
