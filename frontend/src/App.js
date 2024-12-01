import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import randomGraph from "./random_graph_value_1.json";


const LeetCodeGraph = () => {
  const svgRef = useRef();
  const [centerForce, setCenterForce] = useState(0.5);
  const [repelForce, setRepelForce] = useState(0.5);
  const [linkForce, setLinkForce] = useState(0.8);
  const [linkDistance, setLinkDistance] = useState(0.5);

  // const data = {
  //   nodes: [
  //     { id: "Two Sum", difficulty: "Easy", category: "Array" },
  //     { id: "Add Two Numbers", difficulty: "Medium", category: "Linked List" },
  //     { id: "Longest Substring", difficulty: "Medium", category: "String" },
  //     { id: "Median Arrays", difficulty: "Hard", category: "Array" },
  //     { id: "Binary Tree Inorder", difficulty: "Easy", category: "Tree" },
  //     { id: "Valid Parentheses", difficulty: "Easy", category: "Stack" },
  //   ],
  //   links: [
  //     { source: "Two Sum", target: "Add Two Numbers", value: 1 },
  //     { source: "Add Two Numbers", target: "Median Arrays", value: 1 },
  //     { source: "Longest Substring", target: "Median Arrays", value: 1 },
  //     { source: "Binary Tree Inorder", target: "Median Arrays", value: 1 },
  //     { source: "Valid Parentheses", target: "Median Arrays", value: 1 },
  //     { source: "Two Sum", target: "Median Arrays", value: 1 },
  //     { source: "Two Sum", target: "Median Arrays", value: 1 },
  //     { source: "Two Sum", target: "Median Arrays", value: 1 },
  //     { source: "Add Two Numbers", target: "Longest Substring", value: 1 },
  //     { source: "Binary Tree Inorder", target: "Valid Parentheses", value: 1 },
  //   ],
  // };
  const data = randomGraph;

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate connection count for each node
    const connectionCount = {};
    data.nodes.forEach((node) => {
      connectionCount[node.id] = 0;
    });

    data.links.forEach((link) => {
      connectionCount[link.source] = (connectionCount[link.source] || 0) + 1;
      connectionCount[link.target] = (connectionCount[link.target] || 0) + 1;
    });

    // Add connection count to node data
    data.nodes.forEach((node) => {
      node.connections = connectionCount[node.id];
    });

    const width = 800;
    const height = 500;

    const colorScale = d3
      .scaleOrdinal()
      .domain(["Array", "Linked List", "String", "Tree", "Stack"])
      .range(["#4299e1", "#48bb78", "#ed8936", "#667eea", "#ed64a6"]);

    // Create size scale based on connection count
    const maxConnections = Math.max(...Object.values(connectionCount));
    const sizeScale = d3
      .scaleLinear()
      .domain([0, maxConnections])
      .range([4, 20]); // Adjust min and max sizes as needed

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bg-gray-50 rounded-lg");

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(linkDistance * 100)
      )
      .force("charge", d3.forceManyBody().strength(-repelForce * 400))
      .force(
        "center",
        d3.forceCenter(width / 2, height / 2).strength(centerForce)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => sizeScale(d.connections) + 5)
      );

    simulation.force("link").strength(linkForce);

    const links = svg
      .append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
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
      .attr("fill", (d) => colorScale(d.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    nodes
      .append("text")
      .text((d) => d.id)
      .attr("x", (d) => sizeScale(d.connections) + 2)
      .attr("y", 3)
      .attr("font-size", "8px")
      .attr("class", "text-xs fill-gray-700");

    nodes
      .append("title")
      .text(
        (d) => `${d.id}\nConnections: ${d.connections}\nCategory: ${d.category}`
      );

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [centerForce, repelForce, linkForce, linkDistance]);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <svg ref={svgRef} className="w-full h-64 shadow-lg" />

      <div className="mt-4 space-y-2 text-sm">
        <div>
          <label className="block text-gray-300">Center force</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={centerForce}
            onChange={(e) => setCenterForce(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-300">Repel force</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={repelForce}
            onChange={(e) => setRepelForce(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-300">Link force</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={linkForce}
            onChange={(e) => setLinkForce(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-300">Link distance</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={linkDistance}
            onChange={(e) => setLinkDistance(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Array</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Linked List</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span>String</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span>Tree</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          <span>Stack</span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeGraph;
