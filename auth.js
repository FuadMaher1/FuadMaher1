// Simple authentication handler
class Auth {
    constructor() {
        this.storage = new Storage('camp_admin_auth');
        this.adminUsername = 'admin';
        this.adminPassword = 'admin123'; // In a real app, this would be more secure
        this.initializeDefaultAdmin();
    }

    // Initialize default admin credentials if none exist
    initializeDefaultAdmin() {
        const admins = this.storage.getAll();
        if (admins.length === 0) {
            const defaultAdmin = {
                id: 1,
                username: this.adminUsername,
                password: this.adminPassword, // In production, hash this!
                createdAt: new Date().toISOString()
            };
            this.storage.add(defaultAdmin);
        }
    }

    // Login admin
    login(username, password) {
        const admins = this.storage.getAll();
        const admin = admins.find(admin =>
            admin.username === username &&
            admin.password === password
        );

        if (admin) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentAdmin', JSON.stringify({
                id: admin.id,
                username: admin.username
            }));
            return true;
        }
        return false;
    }

    // Logout admin
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentAdmin');
    }

    // Check if admin is logged in
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Get current admin info
    getCurrentAdmin() {
        const adminJson = localStorage.getItem('currentAdmin');
        return adminJson ? JSON.parse(adminJson) : null;
    }
}

// Export for use in other files
window.Auth = Auth;