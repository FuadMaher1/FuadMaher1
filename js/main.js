// Main application entry point
// This file ensures all modules are loaded and initializes the UI

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI (this will handle authentication checks and page rendering)
    if (window.ui) {
        ui.init();
    } else {
        console.error('UI module not loaded');
    }
});

// Export for potential use in other modules
window.main = {
    // Expose any necessary functions or data here
};