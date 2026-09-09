import { useState, useEffect } from 'react';

// Helper function to get cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
    )
  )
  return matches ? decodeURIComponent(matches[1]) : null
}

// Helper function to parse JWT (basic implementation)
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user data from localStorage (set during login)
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const userData = JSON.parse(localUser);
          setUser(userData);
          console.log('useAuth: User data retrieved from localStorage:', userData);
        } else {
          setUser(null);
          console.log('useAuth: No user data found in localStorage');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Also listen for storage changes to handle login/logout from other tabs
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to login (to be used in login page)
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);

      // Call our Next.js API route (which proxies to the actual backend)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login API route response status:', response.status);
      console.log('Login API route response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Login API route response text:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON data:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON from response:', jsonError);
        // If we can't parse JSON, throw an error with the response text
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      // The API route sets the auth-token cookie via Set-Cookie header
      // We store user data in localStorage and token in sessionStorage for client-side access
      if (data.staff) {
        localStorage.setItem("user", JSON.stringify(data.staff));
        console.log('Stored staff data in localStorage:', data.staff);
      }
      if (data.accessToken) {
        sessionStorage.setItem("auth-token", data.accessToken);
        console.log('Stored auth token in sessionStorage');
      }

      // Update user state with the staff data from response
      setUser(data.staff);
      console.log('User state updated');

      return { success: true };
    } catch (error: any) {
      console.error('Login error in useAuth:', error);
      throw new Error(error.message || "Login failed");
    }
  };

  // Function to logout
  const logout = () => {
    // Clear auth token cookie
    document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Clear auth token from sessionStorage
    sessionStorage.removeItem("auth-token");

    // Optional: call backend logout endpoint to invalidate token on server
    // Uncomment if your backend has a logout endpoint that needs to be called
    /*
    fetch("/api/auth/logout", {
      method: "POST",
    }).catch(console.error)
    */

    // Update user state
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};