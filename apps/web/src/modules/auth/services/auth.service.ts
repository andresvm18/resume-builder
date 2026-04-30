// Base URL for authentication API endpoints
// Points to my backend server running on port 8080
const API_URL = "http://localhost:8080/api/auth";

// TypeScript interface defining the shape of authentication response
// This ensures type safety when working with auth data
type AuthResponse = {
  token: string;      // JWT token for authenticated requests
  user: {
    id: string;       // User's unique identifier
    name: string;     // User's full name
    email: string;    // User's email address
  };
};

/**
 * Register a new user account
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's chosen password
 * @returns Promise with auth response containing token and user data
 * @throws Error if registration fails
 */
export async function registerUser(name: string, email: string, password: string) {
  // Make POST request to /register endpoint
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  // Tell server we're sending JSON
    },
    body: JSON.stringify({ name, email, password }),  // Convert data to JSON
  });

  // Check if request was successful (status code 2xx)
  if (!response.ok) {
    throw new Error("Error registering user");
  }

  // Parse JSON response and return as AuthResponse type
  return response.json() as Promise<AuthResponse>;
}

/**
 * Authenticate user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with auth response containing token and user data
 * @throws Error if credentials are invalid
 */
export async function loginUser(email: string, password: string) {
  // Make POST request to /login endpoint
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json() as Promise<AuthResponse>;
}

/**
 * Save authentication session data to localStorage
 * This persists user login across browser refreshes
 * @param data - Authentication response from server
 */
export function saveAuthSession(data: AuthResponse) {
  // Store JWT token for authenticated API requests
  localStorage.setItem("auth_token", data.token);
  
  // Store user data as JSON string for easy retrieval
  localStorage.setItem("auth_user", JSON.stringify(data.user));
}

/**
 * Retrieve stored JWT token from localStorage
 * @returns JWT token or null if not found
 */
export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

/**
 * Retrieve and parse stored user data from localStorage
 * @returns User object or null if not found
 */
export function getAuthUser() {
  const user = localStorage.getItem("auth_user");
  return user ? JSON.parse(user) : null;  // Parse JSON string back to object
}

/**
 * Clear all authentication data from localStorage
 * Used when user logs out
 */
export function logoutUser() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}