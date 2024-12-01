export class SpatialIndex {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.width = width;
    this.height = height;
    this.grid = new Map();
  }

  getKey(x, y) {
    const gridX = Math.floor(x / this.cellSize);
    const gridY = Math.floor(y / this.cellSize);
    return `${gridX},${gridY}`;
  }

  insert(node) {
    const key = this.getKey(node.x, node.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key).add(node);
  }

  query(x, y, radius) {
    const results = new Set();
    const gridRadius = Math.ceil(radius / this.cellSize);
    
    const centerX = Math.floor(x / this.cellSize);
    const centerY = Math.floor(y / this.cellSize);

    for (let i = -gridRadius; i <= gridRadius; i++) {
      for (let j = -gridRadius; j <= gridRadius; j++) {
        const key = `${centerX + i},${centerY + j}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const node of cell) {
            const dx = node.x - x;
            const dy = node.y - y;
            if (dx * dx + dy * dy <= radius * radius) {
              results.add(node);
            }
          }
        }
      }
    }
    return Array.from(results);
  }

  clear() {
    this.grid.clear();
  }
} 