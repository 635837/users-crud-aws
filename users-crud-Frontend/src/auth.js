import { CONFIG } from './config';

export function getTokenFromHash() {
  if (!CONFIG.USE_AUTH) return null;

  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  // ✅ ALWAYS use the access token for API calls
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');

  if (accessToken) {
    // ✅ Store ONLY access token
    localStorage.setItem('cognito_token', accessToken);

    localStorage.setItem(
      'cognito_token_expires_in',
      String(Date.now() + (Number(expiresIn || 3600) * 1000))
    );

    // ✅ Clean the URL (remove tokens from address bar)
    window.history.replaceState({}, document.title, '/');
  }

  return localStorage.getItem('cognito_token');
}

export function login() {
  const d = CONFIG.COGNITO;

  const url = new URL(`https://${d.COGNITO_DOMAIN}/login`);
  url.searchParams.set('client_id', d.CLIENT_ID);

  // ✅ Implicit grant, returns access_token
  url.searchParams.set('response_type', 'token');

  // ✅ Required scopes
  url.searchParams.set('scope', 'openid email profile');

  url.searchParams.set('redirect_uri', d.REDIRECT_URI);
  window.location.assign(url.toString());
}

export function logout() {
  localStorage.removeItem('cognito_token');
  localStorage.removeItem('cognito_token_expires_in');

  const d = CONFIG.COGNITO;
  const url = new URL(`https://${d.COGNITO_DOMAIN}/logout`);
  url.searchParams.set('client_id', d.CLIENT_ID);
  url.searchParams.set('logout_uri', d.LOGOUT_REDIRECT_URI);
  window.location.assign(url.toString());
}