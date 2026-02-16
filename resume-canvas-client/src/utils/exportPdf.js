// PDF Export Utilities
export const getPrintTitle = () => `Resume-${new Date().toISOString().slice(0, 10)}`;

// Generate a clean filename for PDF export
export const generatePdfFilename = (resumeName = "Resume") => {
  const date = new Date().toISOString().slice(0, 10);
  const cleanName = resumeName.replace(/[^a-zA-Z0-9]/g, '_');
  return `${cleanName}_${date}.pdf`;
};

// Format date helpers
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Text utilities
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Validation utilities
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhone = (phone) => {
  // Basic phone validation - matches various formats
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Block/Element utilities
export const calculateBlockArea = (block) => {
  return block.w * block.h;
};

export const isBlockOverlapping = (block1, block2) => {
  return !(
    block1.x + block1.w < block2.x ||
    block2.x + block2.w < block1.x ||
    block1.y + block1.h < block2.y ||
    block2.y + block2.h < block1.y
  );
};

export const sortBlocksByPosition = (blocks) => {
  return [...blocks].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
};

// Storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Export/Import utilities
export const downloadJson = (data, filename = 'resume-data.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Debounce utility
export const debounce = (func, wait) => {
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

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Generate unique IDs (simple version - you might want to use nanoid instead)
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Clamp number between min and max
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Get readable file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Resume-specific utilities
export const calculateResumeCompleteness = (resumeData, sections) => {
  let completed = 0;
  let total = 0;

  // Check basic info
  const basicFields = ['fullName', 'email', 'phone', 'location'];
  basicFields.forEach(field => {
    total++;
    if (resumeData[field] && resumeData[field].trim() !== '' && !resumeData[field].includes('Your') && !resumeData[field].includes('you@')) {
      completed++;
    }
  });

  // Check sections
  if (sections.experience && sections.experience.length > 0) {
    total++;
    completed++;
  }
  if (sections.education && sections.education.length > 0) {
    total++;
    completed++;
  }
  if (sections.skills && sections.skills.length > 0) {
    total++;
    completed++;
  }

  return Math.round((completed / total) * 100);
};

export const estimateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

// Print/Export optimization
export const prepareForPrint = () => {
  // Hide all UI elements except the canvas content
  document.querySelectorAll('.no-print').forEach(el => {
    el.style.display = 'none';
  });
};

export const restoreAfterPrint = () => {
  // Restore UI elements
  document.querySelectorAll('.no-print').forEach(el => {
    el.style.display = '';
  });
};

// Keyboard shortcut helper
export const isKeyboardShortcut = (event, key, modifiers = {}) => {
  const { ctrl = false, shift = false, alt = false, meta = false } = modifiers;
  
  return (
    event.key.toLowerCase() === key.toLowerCase() &&
    event.ctrlKey === ctrl &&
    event.shiftKey === shift &&
    event.altKey === alt &&
    event.metaKey === meta
  );
};

// Get OS-specific modifier key name
export const getModifierKeyName = () => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return isMac ? '⌘' : 'Ctrl';
};