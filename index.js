// This file now serves as a bridge to the TypeScript version
// To use the old JavaScript version, run: npm run start:old

import('./dist/index.js').catch(err => {
    console.error('Failed to load TypeScript version, falling back to JavaScript:', err);
    // Fallback to the original implementation
    import('./src/index-fallback.js');
});