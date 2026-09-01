// Person data model and logic
class PersonModel {
    constructor() {
        this.storage = new Storage('displaced_persons');
        this.nextId = this._getNextId();
    }

    // Get the next available ID
    _getNextId() {
        const persons = this.storage.getAll();
        if (persons.length === 0) return 1;
        const maxId = Math.max(...persons.map(p => p.id));
        return maxId + 1;
    }

    // Create a new person
    createPerson(personData) {
        const person = {
            id: this.nextId++,
            ...personData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.storage.add(person)) {
            return person;
        }
        return null;
    }

    // Get all persons
    getAllPersons() {
        return this.storage.getAll();
    }

    // Get person by ID
    getPersonById(id) {
        return this.storage.findById(id);
    }

    // Update person by ID
    updatePerson(id, updates) {
        const person = this.getPersonById(id);
        if (!person) return null;

        const updatedPerson = {
            ...person,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        if (this.storage.update(id, updatedPerson)) {
            return updatedPerson;
        }
        return null;
    }

    // Delete person by ID
    deletePerson(id) {
        return this.storage.delete(id);
    }

    // Search persons by name or tent number
    searchPersons(query) {
        if (!query.trim()) return this.getAllPersons();

        const lowerQuery = query.toLowerCase();
        return this.getAllPersons().filter(person =>
            person.fullName.toLowerCase().includes(lowerQuery) ||
            person.tentNumber.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter persons by family status
    filterByFamilyStatus(persons, status) {
        if (status === 'all') return persons;
        if (status === 'family') {
            return persons.filter(person => person.familySize > 1);
        }
        if (status === 'individuals') {
            return persons.filter(person => person.familySize === 1);
        }
        return persons;
    }

    // Get statistics
    getStatistics() {
        const persons = this.getAllPersons();

        if (persons.length === 0) {
            return {
                total: 0,
                families: 0,
                individuals: 0,
                avgAge: 0,
                occupiedTents: 0,
                recentArrivals: 0
            };
        }

        const total = persons.length;
        const families = persons.filter(p => p.familySize > 1).length;
        const individuals = persons.filter(p => p.familySize === 1).length;

        // Calculate average age
        const totalAge = persons.reduce((sum, p) => sum + (parseInt(p.age) || 0), 0);
        const avgAge = total > 0 ? Math.round(totalAge / total) : 0;

        // Count unique tent numbers
        const occupiedTents = new Set(persons.map(p => p.tentNumber)).size;

        // Count recent arrivals (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentArrivals = persons.filter(p => {
            const arrivalDate = new Date(p.arrivalDate);
            return arrivalDate >= sevenDaysAgo;
        }).length;

        return {
            total,
            families,
            individuals,
            avgAge,
            occupiedTents: occupiedTents,
            recentArrivals
        };
    }
}

// Export for use in other files
window.PersonModel = PersonModel;
