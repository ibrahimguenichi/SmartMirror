// Utility functions for debugging authentication

export const debugAuthState = () => {
  console.log('=== AUTH DEBUG INFO ===');
  
  // Check cookies
  const cookies = document.cookie.split(';');
  console.log('All cookies:', document.cookie);
  
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
  console.log('JWT cookie:', jwtCookie);
  
  // Try to decode JWT if present
  if (jwtCookie) {
    try {
      const jwtValue = jwtCookie.split('=')[1];
      const payload = JSON.parse(atob(jwtValue.split('.')[1]));
      console.log('JWT payload:', payload);
      console.log('User role from JWT:', payload.userRole);
      console.log('User ID from JWT:', payload.id);
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }
  
  console.log('========================');
};

export const clearAuthData = () => {
  // Clear JWT cookie
  document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  console.log('Cleared JWT cookie');
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.debugAuthState = debugAuthState;
  window.clearAuthData = clearAuthData;
}





