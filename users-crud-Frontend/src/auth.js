import { CONFIG } from './config';
import { jwtDecode } from 'jwt-decode';

export function getTokenFromHash() {
  if (!CONFIG.USE_AUTH) return null;

  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');

  if (accessToken) {
    localStorage.setItem('cognito_token', accessToken);
    localStorage.setItem(
      'cognito_token_expires_in',
      String(Date.now() + (Number(expiresIn || 3600) * 1000))
    );

    window.history.replaceState({}, document.title, '/');
  }

  return localStorage.getItem('cognito_token');
}

export function getUserRole() {
  const token = localStorage.getItem('cognito_token');
  if (!token) return null;

  const decoded = jwtDecode(token);
  const groups = decoded['cognito:groups'] || [];

  return groups.includes('ADMIN') ? 'ADMIN' : 'USER';
}

export function login() {
  const d = CONFIG.COGNITO;
  const url = new URL(`https://${d.COGNITO_DOMAIN}/login`);
  url.searchParams.set('client_id', d.CLIENT_ID);
  url.searchParams.set('response_type', 'token');
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