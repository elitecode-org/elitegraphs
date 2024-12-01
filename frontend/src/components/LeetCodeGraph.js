import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import randomGraph from "../random_graph_value_1.json";

const LeetCodeGraph = () => {
  const svgRef = useRef();
  const [centerForce, setCenterForce] = useState(0.5);
  const [repelForce, setRepelForce] = useState(0.5);
  const [linkForce, setLinkForce] = useState(0.8);
  const [linkDistance, setLinkDistance] = useState(0.5);
  const [timeProgress, setTimeProgress] = useState(0);
  
  const simulationRef = useRef(null);
  const data = randomGraph;

  const getVisibleData = (progress) => {
    const nodeCount = Math.max(1, Math.floor(data.nodes.length * progress));
    const visibleNodes = data.nodes.slice(0, nodeCount);
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
    
    visibleNodes.forEach(node => {
      node.connections = 0;
    });
    
    const visibleLinks = data.links.filter(link => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      if (visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId)) {
        const sourceNode = visibleNodes.find(n => n.id === sourceId);
        const targetNode = visibleNodes.find(n => n.id === targetId);
        if (sourceNode) sourceNode.connections = (sourceNode.connections || 0) + 1;
        if (targetNode) targetNode.connections = (targetNode.connections || 0) + 1;
        return true;
      }
      return false;
    });

    return { nodes: visibleNodes, links: visibleLinks };
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const visibleData = getVisibleData(timeProgress);

    const width = 1000;
    const height = 550;

    const colorScale = d3
      .scaleOrdinal()
      .domain(["Array", "Linked List", "String", "Tree", "Stack"])
      .range(["#4f9fff", "#92d2a5", "#ffd280", "#a5a6f6", "#f4a4c0"]);

    // Create size scale based on connection count
    const maxConnections = Math.max(...visibleData.nodes.map(node => node.connections));
    const sizeScale = d3
      .scaleLinear()
      .domain([0, maxConnections])
      .range([1, 12]); // Adjust min and max sizes as needed

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bg-gray-50 rounded-lg");

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
        d3.forceCenter(width / 2, height / 2).strength(centerForce)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => sizeScale(d.connections) + 5)
      );

    simulationRef.current.force("link").strength(linkForce);

    const links = svg
      .append("g")
      .selectAll("line")
      .data(visibleData.links)
      .join("line")
      .attr("stroke", "#636363")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1);

    const nodes = svg
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
      .attr("fill", (d) => colorScale(d.category))
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
        (d) => `${d.id}\nConnections: ${d.connections}\nCategory: ${d.category}`
      );

    simulationRef.current.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulationRef.current.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [centerForce, repelForce, linkForce, linkDistance, timeProgress]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-[#ddd] text-gray-100">
      <div className="relative">
        <svg ref={svgRef} className="w-full h-[600px] shadow-lg" />

        <div className="absolute top-4 left-4 right-4 max-w-[300px] p-4 bg-gray-800/90 rounded-lg backdrop-blur-sm space-y-2 text-sm z-50 text-gray-200">
          <div>
            <label className="block !text-white">Center force</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={centerForce}
              onChange={(e) => setCenterForce(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div>
            <label className="block !text-white">Repel force</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={repelForce}
              onChange={(e) => setRepelForce(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div>
            <label className="block !text-white">Link force</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={linkForce}
              onChange={(e) => setLinkForce(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div>
            <label className="block !text-white">Link distance</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={linkDistance}
              onChange={(e) => setLinkDistance(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div className="border-t border-gray-700 pt-2 mt-2">
            <label className="block !text-white">Timeline Progress</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeProgress}
              onChange={(e) => setTimeProgress(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeGraph;
