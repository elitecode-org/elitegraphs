import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as d3 from "d3";
import randomGraph from "../data.json";

const LeetCodeGraph = () => {
  const svgRef = useRef();
  const [centerForce, setCenterForce] = useState(0.5);
  const [repelForce, setRepelForce] = useState(0.5);
  const [linkForce, setLinkForce] = useState(0.8);
  const [linkDistance, setLinkDistance] = useState(0.5);
  const [timeProgress, setTimeProgress] = useState(0);

  const simulationRef = useRef(null);
  const data = randomGraph;

  const categoryColors = useMemo(
    () => ({
      Array: "#4f9fff",
      String: "#92d2a5",
      Tree: "#ffd280",
      "Linked List": "#a5a6f6",
      Graph: "#f4a4c0",
      Stack: "#ff9e9e",
      Queue: "#9ef1ff",
      "Hash Table": "#ffc4e6",
      "Binary Search": "#c9b1ff",
      "Dynamic Programming": "#ffb347",

      // Advanced Categories
      Sorting: "#ff7f7f",
      Greedy: "#7fbfff",
      Backtracking: "#98fb98",
      "Bit Manipulation": "#dda0dd",
      Math: "#ffdab9",
      Database: "#87cefa",
      Matrix: "#f08080",
      "Breadth-First Search": "#98fb98",
      "Depth-First Search": "#deb887",
      "Two Pointers": "#b0c4de",
      "Union Find": "#f0e68c",
      Trie: "#e6e6fa",
      "Divide and Conquer": "#ffa07a",
      "Sliding Window": "#87ceeb",
      "Topological Sort": "#dda0dd",
      "Shortest Path": "#90ee90",
      Geometry: "#ffb6c1",
      "Probability and Statistics": "#add8e6",
      "Game Theory": "#f0fff0",
      "Number Theory": "#ffe4e1",
      Combinatorics: "#e0ffff",
      Interactive: "#fafad2",
      Memoization: "#d8bfd8",
      "Monotonic Stack": "#afeeee",
      "Segment Tree": "#db7093",
      "Rolling Hash": "#f5deb3",
      "Minimum Spanning Tree": "#bc8f8f",
      "Counting Sort": "#b8860b",
      "Radix Sort": "#bdb76b",
      Shell: "#8fbc8f",
      "Strongly Connected Component": "#cd853f",
      "Reservoir Sampling": "#daa520",
      "Eulerian Circuit": "#808000",
      Bitmask: "#4682b4",
      "Rejection Sampling": "#483d8b",
      "Doubly-Linked List": "#008b8b",
      "Data Stream": "#556b2f",
      "Biconnected Component": "#8b008b",
      "Monotonic Queue": "#2f4f4f",
      "Prefix Sum": "#800000",
      "Brain Teaser": "#8b4513",
      Randomized: "#808080",
      "Hash Function": "#4b0082",
      Concurrency: "#800080",
      Recursion: "#008080",
    }),
    []
  );

  const getVisibleData = useCallback(
    (progress) => {
      const dates = data.links.map((link) => new Date(link.timestamp));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      const totalTime = maxDate - minDate;
      const cutoffDate = new Date(minDate.getTime() + totalTime * progress);

      const visibleLinks = data.links.filter(
        (link) => new Date(link.timestamp) <= cutoffDate
      );

      const visibleNodeIds = new Set();
      visibleLinks.forEach((link) => {
        visibleNodeIds.add(
          typeof link.source === "object" ? link.source.id : link.source
        );
        visibleNodeIds.add(
          typeof link.target === "object" ? link.target.id : link.target
        );
      });

      const visibleNodes = data.nodes.filter((node) =>
        visibleNodeIds.has(node.id)
      );

      visibleNodes.forEach((node) => {
        node.connections = 0;
      });

      visibleLinks.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;

        const sourceNode = visibleNodes.find((n) => n.id === sourceId);
        const targetNode = visibleNodes.find((n) => n.id === targetId);

        if (sourceNode)
          sourceNode.connections = (sourceNode.connections || 0) + 1;
        if (targetNode)
          targetNode.connections = (targetNode.connections || 0) + 1;
      });

      return { nodes: visibleNodes, links: visibleLinks };
    },
    [data]
  );

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const visibleData = getVisibleData(timeProgress);

    const width = 1200;
    const height = 650;

    const getNodeColor = (node) => {
      const firstCategory = node.categories ? node.categories[0] : node.category;
      return categoryColors[firstCategory] || "#808080";
    };

    const maxConnections = Math.max(
      ...visibleData.nodes.map((node) => node.connections)
    );
    const sizeScale = d3
      .scaleLinear()
      .domain([0, maxConnections])
      .range([1, 12]);

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bg-gray-50 rounded-lg");

    // Create a group for the zoom container
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4]) // Set min and max zoom scale
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    
    // Center the initial view
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(0.8);
    svg.call(zoom.transform, initialTransform);

    simulationRef.current = d3
      .forceSimulation(visibleData.nodes)
      .force(
        "link",
        d3
          .forceLink(visibleData.links)
          .id((d) => d.id)
          .distance(linkDistance * 100)
      )
      .force("charge", d3.forceManyBody().strength(-repelForce * 400))
      .force(
        "center",
        d3.forceCenter(0, 0).strength(centerForce) // Changed to (0,0) since we're centering with the transform
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => sizeScale(d.connections) + 5)
      );

    simulationRef.current.force("link").strength(linkForce);

    // Add links and nodes to the zoom container group instead of directly to the svg
    const links = g
      .append("g")
      .selectAll("line")
      .data(visibleData.links)
      .join("line")
      .attr("stroke", "#636363")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1);

    const nodes = g
      .append("g")
      .selectAll("g")
      .data(visibleData.nodes)
      .join("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    nodes
      .append("circle")
      .attr("r", (d) => sizeScale(d.connections))
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke-width", 0);

    nodes
      .append("text")
      .text((d) => d.id)
      .attr("x", (d) => sizeScale(d.connections) + 2)
      .attr("y", 3)
      .attr("font-size", "5px")
      .attr("fill", "#ddd");

    nodes
      .append("title")
      .text(
        (d) =>
          `${d.id}\nConnections: ${d.connections}\nCategories: ${
            d.categories ? d.categories.join(", ") : d.category
          }`
      );

    simulationRef.current.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulationRef.current.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [
    centerForce,
    repelForce,
    linkForce,
    linkDistance,
    timeProgress,
    getVisibleData,
    categoryColors,
  ]);

  return (
    <div className="relative w-full h-[800px]">
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full bg-gray-900 shadow-lg cursor-move rounded-lg"
      />

      <div className="absolute top-4 right-4 w-64 p-4 bg-gray-800/90 rounded-lg backdrop-blur-sm text-sm z-50">
        <h3 className="text-white font-semibold mb-3">Graph Controls</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-200 text-xs mb-1">Center force</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={centerForce}
              onChange={(e) => setCenterForce(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-200 text-xs mb-1">Repel force</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={repelForce}
              onChange={(e) => setRepelForce(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-200 text-xs mb-1">Link force</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={linkForce}
              onChange={(e) => setLinkForce(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-200 text-xs mb-1">Link distance</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={linkDistance}
              onChange={(e) => setLinkDistance(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div className="pt-3 border-t border-gray-700">
            <label className="block text-gray-200 text-xs mb-1">Timeline Progress</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeProgress}
              onChange={(e) => setTimeProgress(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeGraph;
