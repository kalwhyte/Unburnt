// Simple in-memory key-value store (loses data on app restart)

class MemoryStore {
  private store: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

export default new MemoryStore();