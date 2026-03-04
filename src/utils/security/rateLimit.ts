interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate Limiter simple en mémoire.
 * @param key Identifiant unique (IP, userId, etc.)
 * @param limit Nombre de requêtes autorisées
 * @param windowMs Fenêtre de temps en millisecondes
 * @returns boolean true si la requête est autorisée, false sinon
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  
  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, limit, remaining: limit - 1, reset: store[key].resetTime };
  }

  store[key].count++;

  if (store[key].count > limit) {
    return { 
      success: false, 
      limit, 
      remaining: 0, 
      reset: store[key].resetTime 
    };
  }

  return { 
    success: true, 
    limit, 
    remaining: limit - store[key].count, 
    reset: store[key].resetTime 
  };
}
