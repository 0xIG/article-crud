/**
 * Route prefixes for API endpoints
 * Centralized location for all route definitions to ensure consistency
 */

// Authentication routes
export const AUTH_ROUTE_PREFIX = '/auth';
export const AUTH_SIGNIN_ROUTE_PREFIX = '/signin';
export const AUTH_SIGNUP_ROUTE_PREFIX = '/signup';

// Article routes
export const ARTICLE_ROUTE_PREFIX = '/article';
export const ARTICLE_ADD_ROUTE_PREFIX = '';
export const [
  ARTICLE_GET_ROUTE_PREFIX,
  ARTICLE_EDIT_ROUTE_PREFIX,
  ARTICLE_DELETE_ROUTE_PREFIX,
]: string = ':id';
export const ARTICLE_LIST_ROUTE_PREFIX = '/list';
