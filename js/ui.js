// UI update functions
class UI {
    constructor() {
        this.personModel = new PersonModel();
        this.currentPage = 'persons'; // Default page
    }

    // Initialize the application
    init() {
        // Check authentication first - if not logged in, redirect to login and stop
        if (!this.checkAuth()) {
            return; // Stop initialization if not authenticated
        }
        this.bindEvents();
        this.renderPage('persons'); // Start with persons page
    }

    // Check authentication status
    checkAuth() {
        const auth = new Auth();
        if (!auth.isLoggedIn()) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Bind event listeners
    bindEvents() {
        // Navigation buttons
        document.getElementById('persons-btn')?.addEventListener('click', () => {
            this.setActiveNav('persons-btn');
            this.renderPage('persons');
        });

        document.getElementById('add-person-btn')?.addEventListener('click', () => {
            this.setActiveNav('add-person-btn');
            this.renderPage('add-person');
        });

        document.getElementById('stats-btn')?.addEventListener('click', () => {
            this.setActiveNav('stats-btn');
            this.renderPage('stats');
        });

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            const auth = new Auth();
            auth.logout();
            window.location.href = 'login.html';
        });

        // Search and filter
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            this.renderPersonsList(e.target.value);
        });

        // Search button
        document.getElementById('search-btn')?.addEventListener('click', () => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                this.renderPersonsList(searchInput.value);
            }
        });

        document.getElementById('filter-select')?.addEventListener('change', (e) => {
            this.renderPersonsList(document.getElementById('search-input').value, e.target.value);
        });

        // Add person form
        const addPersonForm = document.getElementById('add-person-form');
        if (addPersonForm) {
            addPersonForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddPerson();
            });
        }

        document.getElementById('cancel-add-btn')?.addEventListener('click', () => {
            this.renderPage('persons');
        });
    }

    // Set active navigation button
    setActiveNav(activeButtonId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeButtonId)?.classList.add('active');
    }

    // Render a specific page
    renderPage(page) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the requested section
        const sectionId = `${page}-section`;
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            this.currentPage = page;
        }

        // Initialize page-specific content
        if (page === 'persons') {
            this.renderPersonsList();
            this.updateStatistics();
        } else if (page === 'add-person') {
            // Reset form
            document.getElementById('add-person-form')?.reset();
        } else if (page === 'stats') {
            this.updateStatistics();
        }
    }

    // Render persons list with optional search and filter
    renderPersonsList(searchQuery = '', filterStatus = 'all') {
        const personsList = document.getElementById('persons-list');
        if (!personsList) return;

        let persons = this.personModel.getAllPersons();

        // Apply search
        if (searchQuery.trim()) {
            persons = this.personModel.searchPersons(searchQuery);
        }

        // Apply filter
        if (filterStatus !== 'all') {
            persons = this.personModel.filterByFamilyStatus(persons, filterStatus);
        }

        // Render persons
        if (persons.length === 0) {
            personsList.innerHTML = '<p class="no-data">No records found.</p>';
            return;
        }

        personsList.innerHTML = persons.map(person => this.createPersonCard(person)).join('');
    }

    // Create a person card HTML
    createPersonCard(person) {
        return `
            <div class="person-card" data-id="${person.id}">
                <div class="person-header">
                    <h3>${person.fullName}</h3>
                    <p>Tent: ${person.tentNumber} • Family: ${person.familySize}</p>
                </div>
                <div class="person-body">
                    <p><strong>Age:</strong> ${person.age}</p>
                    <p><strong>Gender:</strong> ${person.gender}</p>
                    <p><strong>Arrival:</strong> ${new Date(person.arrivalDate).toLocaleDateString()}</p>
                    ${person.healthStatus ? `<p><strong>Health:</strong> ${person.healthStatus}</p>` : ''}
                    ${person.specialNeeds ? `<p><strong>Special Needs:</strong> ${person.specialNeeds}</p>` : ''}
                </div>
                <div class="person-actions">
                    <button class="view-btn" onclick="ui.viewPerson(${person.id})">View</button>
                    <button class="edit-btn" onclick="ui.editPerson(${person.id})">Edit</button>
                    <button class="delete-btn" onclick="ui.deletePerson(${person.id})">Delete</button>
                </div>
            </div>
        `;
    }

    // Handle adding a new person
    handleAddPerson() {
        const form = document.getElementById('add-person-form');
        if (!form) return;

        const formData = new FormData(form);
        const personData = {
            fullName: formData.get('full-name'),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            familySize: parseInt(formData.get('family-size')),
            tentNumber: formData.get('tent-number'),
            arrivalDate: formData.get('arrival-date'),
            healthStatus: formData.get('health-status') || null,
            specialNeeds: formData.get('special-needs') || null,
            notes: formData.get('notes') || null
        };

        // Validate required fields
        if (!personData.fullName || !personData.age || !personData.gender || !personData.tentNumber || !personData.arrivalDate) {
            alert('Please fill in all required fields');
            return;
        }

        const newPerson = this.personModel.createPerson(personData);
        if (newPerson) {
            alert('Person added successfully!');
            form.reset();
            this.renderPage('persons');
        } else {
            alert('Error adding person. Please try again.');
        }
    }

    // View person details (placeholder for now)
    viewPerson(id) {
        alert(`Viewing person with ID: ${id}\nFeature coming soon!`);
    }

    // Edit person
    editPerson(id) {
        const person = this.personModel.getPersonById(id);
        if (!person) {
            alert('Person not found');
            return;
        }

        // For simplicity, we'll just show an alert with current data
        // In a full implementation, we'd populate an edit form
        const confirmation = confirm(`Edit person: ${person.fullName}\n\nCurrent data:\nAge: ${person.age}\nGender: ${person.gender}\nTent: ${person.tentNumber}\nFamily Size: ${person.familySize}\n\nFeature coming soon!`);
        if (confirmation) {
            // For now, just refresh the list
            this.renderPersonsList();
        }
    }

    // Delete person
    deletePerson(id) {
        const person = this.personModel.getPersonById(id);
        if (!person) {
            alert('Person not found');
            return;
        }

        if (confirm(`Are you sure you want to delete ${person.fullName}? This action cannot be undone.`)) {
            if (this.personModel.deletePerson(id)) {
                alert('Person deleted successfully');
                this.renderPersonsList();
                this.updateStatistics();
            } else {
                alert('Error deleting person');
            }
        }
    }

    // Update statistics display
    updateStatistics() {
        const stats = this.personModel.getStatistics();
        document.getElementById('total-persons')?.textContent = stats.total;
        document.getElementById('total-families')?.textContent = stats.families;
        document.getElementById('total-individuals')?.textContent = stats.individuals;
        document.getElementById('avg-age')?.textContent = stats.avgAge;
        document.getElementById('occupied-tents')?.textContent = stats.occupiedTents;
        document.getElementById('recent-arrivals')?.textContent = stats.recentArrivals;
    }
}

// Create global UI instance
window.ui = new UI();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
