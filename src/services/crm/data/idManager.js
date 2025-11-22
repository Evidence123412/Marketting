const ID_COUNTERS_KEY = 'crm_id_counters';

/**
 * Gets the current ID counters from LocalStorage.
 * @returns {Object} The counters object.
 */
const getCounters = () => {
  try {
    const counters = localStorage.getItem(ID_COUNTERS_KEY);
    return counters ? JSON.parse(counters) : {};
  } catch (error) {
    console.error("Error reading ID counters from localStorage", error);
    return {};
  }
};

/**
 * Saves the ID counters to LocalStorage.
 * @param {Object} counters - The counters object to save.
 */
const saveCounters = (counters) => {
  try {
    localStorage.setItem(ID_COUNTERS_KEY, JSON.stringify(counters));
  } catch (error) {
    console.error("Error saving ID counters to localStorage", error);
  }
};

/**
 * Gets the next available ID for a given entity type.
 * It's persistent and avoids collisions.
 * @param {string} entityName - The name of the entity (e.g., 'leads', 'notes').
 * @returns {number} The next unique ID.
 */
export const getNextId = (entityName) => {
  const counters = getCounters();
  const nextId = (counters[entityName] || 0) + 1;
  counters[entityName] = nextId;
  saveCounters(counters);
  return nextId;
};
