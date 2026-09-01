// Storage abstraction layer for localStorage
class Storage {
    constructor(namespace) {
        this.namespace = namespace;
    }

    // Get all items in the namespace
    getAll() {
        try {
            const data = localStorage.getItem(this.namespace);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading from ${this.namespace}:`, error);
            return [];
        }
    }

    // Save items to the namespace
    save(items) {
        try {
            localStorage.setItem(this.namespace, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error(`Error saving to ${this.namespace}:`, error);
            return false;
        }
    }

    // Add a new item
    add(item) {
        const items = this.getAll();
        items.push(item);
        return this.save(items);
    }

    // Update an item by ID
    update(id, updatedItem) {
        const items = this.getAll();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            return this.save(items);
        }
        return false;
    }

    // Delete an item by ID
    delete(id) {
        const items = this.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        if (filteredItems.length !== items.length) {
            return this.save(filteredItems);
        }
        return false;
    }

    // Find an item by ID
    findById(id) {
        const items = this.getAll();
        return items.find(item => item.id === id) || null;
    }

    // Clear all items
    clear() {
        return this.save([]);
    }
}

// Export for use in other files
window.Storage = Storage;