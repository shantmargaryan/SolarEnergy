class ResourceCache {
    constructor() {
        this.CACHE_VERSION = '1.0';
        this.CACHE_PREFIX = 'resource_cache_';
        this.CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    }

    // Generate cache key for a resource
    getCacheKey(url) {
        return `${this.CACHE_PREFIX}${this.CACHE_VERSION}_${url}`;
    }

    // Check if resource is cached and not expired
    isCached(url) {
        const cacheKey = this.getCacheKey(url);
        const cachedData = localStorage.getItem(cacheKey);
        
        if (!cachedData) return false;

        try {
            const { timestamp, content } = JSON.parse(cachedData);
            return (Date.now() - timestamp) < this.CACHE_EXPIRY;
        } catch {
            return false;
        }
    }

    // Get cached resource
    getCachedResource(url) {
        const cacheKey = this.getCacheKey(url);
        const cachedData = localStorage.getItem(cacheKey);
        
        if (!cachedData) return null;

        try {
            const { content } = JSON.parse(cachedData);
            return content;
        } catch {
            return null;
        }
    }

    // Cache a resource
    cacheResource(url, content) {
        const cacheKey = this.getCacheKey(url);
        const cacheData = {
            timestamp: Date.now(),
            content: content
        };
        
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            return true;
        } catch (e) {
            console.error('Failed to cache resource:', e);
            return false;
        }
    }

    // Load and cache a CSS file
    async loadCSS(url) {
        if (this.isCached(url)) {
            const cachedContent = this.getCachedResource(url);
            this.injectCSS(cachedContent);
            return;
        }

        try {
            const response = await fetch(url);
            const content = await response.text();
            this.cacheResource(url, content);
            this.injectCSS(content);
        } catch (error) {
            console.error('Failed to load CSS:', error);
        }
    }

    // Load and cache a JS file
    async loadJS(url) {
        if (this.isCached(url)) {
            const cachedContent = this.getCachedResource(url);
            this.injectJS(cachedContent);
            return;
        }

        try {
            const response = await fetch(url);
            const content = await response.text();
            this.cacheResource(url, content);
            this.injectJS(content);
        } catch (error) {
            console.error('Failed to load JS:', error);
        }
    }

    // Inject CSS content into the page
    injectCSS(content) {
        const style = document.createElement('style');
        style.textContent = content;
        document.head.appendChild(style);
    }

    // Inject JS content into the page
    injectJS(content) {
        const script = document.createElement('script');
        script.textContent = content;
        document.body.appendChild(script);
    }

    // Clear expired cache entries
    clearExpiredCache() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.CACHE_PREFIX)) {
                try {
                    const { timestamp } = JSON.parse(localStorage.getItem(key));
                    if (Date.now() - timestamp > this.CACHE_EXPIRY) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    localStorage.removeItem(key);
                }
            }
        }
    }
}

// Create and export cache instance
const resourceCache = new ResourceCache();
export default resourceCache; 