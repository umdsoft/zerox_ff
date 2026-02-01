/**
 * ZeroX - Performance Monitoring Utilities
 *
 * Sahifa va komponent performance'ini kuzatish
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Performance metrics'ni o'lchash
 */
export const measurePerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return null;

  const timing = window.performance.timing;
  const navigation = window.performance.getEntriesByType?.('navigation')?.[0];

  return {
    // DNS lookup
    dns: timing.domainLookupEnd - timing.domainLookupStart,

    // TCP connection
    tcp: timing.connectEnd - timing.connectStart,

    // Time to First Byte
    ttfb: timing.responseStart - timing.requestStart,

    // DOM Content Loaded
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,

    // Full page load
    pageLoad: timing.loadEventEnd - timing.navigationStart,

    // DOM Interactive
    domInteractive: timing.domInteractive - timing.navigationStart,

    // First Paint (if available)
    firstPaint: navigation?.responseEnd || 0,
  };
};

/**
 * Component render vaqtini o'lchash
 */
export const createPerformanceMarker = (name) => {
  if (IS_PRODUCTION || typeof window === 'undefined') {
    return { start: () => {}, end: () => {} };
  }

  const markStart = `${name}-start`;
  const markEnd = `${name}-end`;

  return {
    start: () => {
      try {
        performance.mark(markStart);
      } catch (e) {}
    },
    end: () => {
      try {
        performance.mark(markEnd);
        performance.measure(name, markStart, markEnd);
        const measure = performance.getEntriesByName(name)[0];
        if (measure) {
          console.debug(`[Perf] ${name}: ${measure.duration.toFixed(2)}ms`);
        }
        // Cleanup
        performance.clearMarks(markStart);
        performance.clearMarks(markEnd);
        performance.clearMeasures(name);
      } catch (e) {}
    },
  };
};

/**
 * Lazy load image with intersection observer
 */
export const lazyLoadImage = (element, src, options = {}) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    element.src = src;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        element.src = src;
        observer.unobserve(element);
      }
    });
  }, {
    rootMargin: options.rootMargin || '50px',
    threshold: options.threshold || 0.1,
  });

  observer.observe(element);

  return () => observer.disconnect();
};

/**
 * Debounce function - ko'p chaqiriqlarni optimallashtirish
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - chaqiriq chastotasini cheklash
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Memory usage (faqat Chrome)
 */
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !window.performance?.memory) {
    return null;
  }

  const memory = window.performance.memory;
  return {
    usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
  };
};

/**
 * Report Web Vitals
 */
export const reportWebVitals = (callback) => {
  if (typeof window === 'undefined') return;

  // First Contentful Paint
  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        callback({ name: 'FCP', value: entry.startTime });
      }
    }
  });

  try {
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {}

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    callback({ name: 'LCP', value: lastEntry.startTime });
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      callback({ name: 'FID', value: entry.processingStart - entry.startTime });
    }
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {}

  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    callback({ name: 'CLS', value: clsValue });
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}

  return () => {
    paintObserver.disconnect();
    lcpObserver.disconnect();
    fidObserver.disconnect();
    clsObserver.disconnect();
  };
};

export default {
  measurePerformance,
  createPerformanceMarker,
  lazyLoadImage,
  debounce,
  throttle,
  getMemoryUsage,
  reportWebVitals,
};
