
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private static cache = new Map<string, CacheItem>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Cleanup expired cache items every 5 minutes
    const interval = setInterval(() => {
      CacheManager.cleanup();
    }, 5 * 60 * 1000);

    // Cleanup on app start
    CacheManager.cleanup();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
};

export { CacheManager, CacheProvider };
