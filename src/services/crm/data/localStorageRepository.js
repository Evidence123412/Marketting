import { seedInitialData } from './seed';

const DB_PREFIX = 'crm_';

// Check if the DB is initialized, if not, seed it.
if (!localStorage.getItem(`${DB_PREFIX}initialized`)) {
  seedInitialData();
}

/**
 * A generic repository for interacting with LocalStorage like a database.
 * It handles data immutably.
 */
export const repository = {
  /**
   * Gets all items from an entity table.
   * @param {string} entityName - The name of the entity (e.g., 'leads').
   * @returns {Array} An array of items.
   */
  getAll(entityName) {
    try {
      const items = localStorage.getItem(`${DB_PREFIX}${entityName}`);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error(`Error getting all ${entityName} from localStorage`, error);
      return [];
    }
  },

  /**
   * Finds an item by its ID.
   * @param {string} entityName - The name of the entity.
   * @param {number} id - The ID of the item to find.
   * @returns {Object|null} The found item or null.
   */
  findById(entityName, id) {
    const items = this.getAll(entityName);
    return items.find(item => item.id === id) || null;
  },

  /**
   * Finds items by a specific property.
   * @param {string} entityName - The name of the entity.
   * @param {string} key - The property name to filter by.
   * @param {*} value - The value of the property to match.
   * @returns {Array} An array of matching items.
   */
  findByProperty(entityName, key, value) {
    const items = this.getAll(entityName);
    return items.filter(item => item[key] === value);
  },

  /**
   * Saves an item (creates or updates).
   * @param {string} entityName - The name of the entity.
   * @param {Object} itemData - The item to save. It must have an 'id'.
   * @returns {Object} The saved item.
   */
  save(entityName, itemData) {
    if (!itemData.id) {
      throw new Error('Item must have an ID to be saved.');
    }
    const items = this.getAll(entityName);
    const index = items.findIndex(i => i.id === itemData.id);
    
    let newItems;
    if (index !== -1) {
      // Update: create a new array with the updated item
      newItems = [...items];
      newItems[index] = { ...items[index], ...itemData, updatedAt: new Date().toISOString() };
    } else {
      // Create: create a new array with the new item added
      newItems = [...items, itemData];
    }

    try {
      localStorage.setItem(`${DB_PREFIX}${entityName}`, JSON.stringify(newItems));
      return this.findById(entityName, itemData.id); // Return a fresh copy
    } catch (error) {
      console.error(`Error saving ${entityName} to localStorage`, error);
      throw error;
    }
  },

  /**
   * Deletes an item by its ID.
   * @param {string} entityName - The name of the entity.
   * @param {number} id - The ID of the item to delete.
   * @returns {boolean} True if deletion was successful, false otherwise.
   */
  destroy(entityName, id) {
    const items = this.getAll(entityName);
    const newItems = items.filter(item => item.id !== id);

    if (newItems.length === items.length) {
      console.warn(`Item with ID ${id} not found in ${entityName}.`);
      return false;
    }

    try {
      localStorage.setItem(`${DB_PREFIX}${entityName}`, JSON.stringify(newItems));
      return true;
    } catch (error) {
      console.error(`Error deleting ${entityName} from localStorage`, error);
      return false;
    }
  },
};
