export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_TIMEOUT = 10000;

const environment = import.meta.env.MODE;

// Helper function to handle Render's cold start
const waitForRenderWakeup = async (url, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        timeout: 30000 
      });
      if (response.ok) return true;
    } catch (error) {
      console.log(`Render wakeup attempt ${i + 1}/${maxRetries}...`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }
  }
  return false;
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // For production (Render), try to wake up the service first
  if (environment === 'production' && endpoint === '/api/health') {
    const isAwake = await waitForRenderWakeup(url);
    if (!isAwake) {
      throw new Error('Backend service is unavailable');
    }
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Render service might be sleeping');
    }
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Health check function specifically for Render
export const checkRenderHealth = async () => {
  try {
    const response = await apiRequest('/api/health');
    return { status: 'connected', data: response };
  } catch (error) {
    return { 
      status: 'disconnected', 
      error: error.message,
      isRenderSleeping: error.message.includes('timeout') || error.message.includes('unavailable')
    };
  }
};
