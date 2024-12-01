// webgl-helpers.js
import * as d3 from 'd3';
import * as THREE from 'three';

// Convert hex color to RGB array
export const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
};

// Create force simulation
export const createSimulation = (data) => {
  return d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(0, 0))
    .stop();
};

// Calculate node sizes based on connections
export const calculateNodeSizes = (nodes) => {
  const maxConnections = Math.max(...nodes.map(n => n.connections || 1));
  nodes.forEach(node => {
    node.size = Math.sqrt((node.connections || 1) / maxConnections) * 20 + 5;
  });
};

// Process data for WebGL
export const processDataForWebGL = (rawData) => {
  // Convert raw data into proper format for WebGL
  const nodes = rawData.nodes.map(node => ({
    ...node,
    x: Math.random() * 1000 - 500,
    y: Math.random() * 1000 - 500,
  }));

  const links = rawData.links.map(link => ({
    ...link,
    source: typeof link.source === 'object' ? link.source.id : link.source,
    target: typeof link.target === 'object' ? link.target.id : link.target,
  }));

  return { nodes, links };
};

// Handle canvas resize
export const resizeCanvas = (canvas, gl) => {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
};

// Create transformation matrix
export const createTransformationMatrix = (transform, canvas) => {
  const matrix = new Float32Array(16);
  
  // Start with identity matrix
  for (let i = 0; i < 16; i++) {
    matrix[i] = i % 5 === 0 ? 1 : 0;
  }

  // Apply transformations
  matrix[0] = transform.scale;
  matrix[5] = transform.scale;
  matrix[12] = transform.x;
  matrix[13] = transform.y;

  // Apply aspect ratio correction
  const aspect = canvas.width / canvas.height;
  matrix[0] *= aspect;

  return matrix;
};

export function initWebGLRenderer(container, width, height) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    width / -2, width / 2, height / 2, height / -2, 1, 1000
  );
  
  return { renderer, scene, camera };
}

export function createNodeGeometry(nodes, nodeColors) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(nodes.length * 3);
  const colors = new Float32Array(nodes.length * 3);
  const sizes = new Float32Array(nodes.length);

  nodes.forEach((node, i) => {
    positions[i * 3] = node.x;
    positions[i * 3 + 1] = node.y;
    positions[i * 3 + 2] = 0;

    const color = new THREE.Color(nodeColors[node.category]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = node.radius;
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  return geometry;
}