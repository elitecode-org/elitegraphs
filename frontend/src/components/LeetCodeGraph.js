import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as d3 from "d3";
import randomGraph from "../final_data4.json";
import {
  ControlsContainer,
  ControlsTitle,
  TimelineSlider,
  StatsContainer,
  Username,
  StatsRow,
  StatValue,
  StatLabel,
  DifficultyStats,
  DifficultyItem,
} from "./LeetCodeGraph.styles";
import { debounce } from "lodash";
import styled from "styled-components";

const InstructionText = styled.div`
  position: absolute;
  bottom: -30px;
  right: 10px;
  color: #666;
  font-size: 1rem;
  pointer-events: none;
`;

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
      "Binary Tree": "#98fb98",
      "Binary Search Tree": "#dda0dd",
      "Binary Indexed Tree": "#b8860b",
      "Bucket Sort": "#cd853f",
      Counting: "#4682b4",
      Design: "#556b2f",
      Enumeration: "#8b008b",
      "Line Sweep": "#2f4f4f",
      "Heap (Priority Queue)": "#800000",
      Iterator: "#8b4513",
      "Ordered Set": "#4b0082",
      Quickselect: "#800080",
      Simulation: "#008080",
      "String Matching": "#98fb98",
      "Suffix Array": "#dda0dd",
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

  const transitionRef = useRef(null);
  const targetValuesRef = useRef({
    centerForce: 0.5,
    repelForce: 0.5,
    linkForce: 0.8,
    linkDistance: 0.5,
  });

  const updateForces = useCallback(() => {
    if (!simulationRef.current) return;

    const simulation = simulationRef.current;
    const target = targetValuesRef.current;
    let changed = false;

    ["centerForce", "repelForce", "linkForce", "linkDistance"].forEach(
      (param) => {
        const current = simulation.force("center").strength();
        const diff = target[param] - current;
        if (Math.abs(diff) > 0.001) {
          changed = true;
          const newValue = current + diff * 0.1;

          switch (param) {
            case "centerForce":
              simulation.force("center").strength(newValue);
              break;
            case "repelForce":
              simulation.force("charge").strength(-newValue * 400);
              break;
            case "linkForce":
              simulation.force("link").strength(newValue);
              break;
            case "linkDistance":
              simulation.force("link").distance(newValue * 100);
              break;
          }
        }
      }
    );

    if (changed) {
      simulation.alpha(0.3).restart();
      transitionRef.current = requestAnimationFrame(updateForces);
    } else {
      transitionRef.current = null;
    }
  }, []);

  const handleForceChange = useMemo(
    () => ({
      centerForce: debounce((value) => {
        targetValuesRef.current.centerForce = value;
        if (!transitionRef.current) {
          transitionRef.current = requestAnimationFrame(updateForces);
        }
      }, 16),
      repelForce: debounce((value) => {
        targetValuesRef.current.repelForce = value;
        if (!transitionRef.current) {
          transitionRef.current = requestAnimationFrame(updateForces);
        }
      }, 16),
      linkForce: debounce((value) => {
        targetValuesRef.current.linkForce = value;
        if (!transitionRef.current) {
          transitionRef.current = requestAnimationFrame(updateForces);
        }
      }, 16),
      linkDistance: debounce((value) => {
        targetValuesRef.current.linkDistance = value;
        if (!transitionRef.current) {
          transitionRef.current = requestAnimationFrame(updateForces);
        }
      }, 16),
    }),
    [updateForces]
  );

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const visibleData = getVisibleData(timeProgress);

    const width = 1200;
    const height = 700;

    const getNodeColor = (node) => {
      const firstCategory = node.categories
        ? node.categories[0]
        : node.category;
      return categoryColors[firstCategory] || "#808080";
    };

    const maxConnections = Math.max(
      ...visibleData.nodes.map((node) => node.connections || 0)
    );
    const sizeScale = d3
      .scaleLinear()
      .domain([0, Math.max(1, maxConnections)])
      .range([1, 70]);

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bg-gray-50 rounded-lg");

    // Create a group for the zoom container
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3
      .zoom()
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
      .alphaDecay(0.1)
      .alphaMin(0.001)
      .velocityDecay(0.3)
      .force(
        "link",
        d3
          .forceLink(visibleData.links)
          .id((d) => d.id)
          .distance(linkDistance * 100)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-repelForce * 400)
          .theta(0.9)
          .distanceMin(1)
          .distanceMax(width / 2)
      )
      .force("center", d3.forceCenter(0, 0).strength(centerForce))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => sizeScale(d.connections) + 5)
          .strength(0.7)
          .iterations(1)
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

    const nodeGroups = g
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

    nodeGroups
      .append("circle")
      .attr("r", (d) => sizeScale(d.connections || 0))
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke-width", 0);

    const nodeTexts = nodeGroups
      .append("text")
      .text((d) => (d.connections >= 100 ? d.name : ""))
      .attr("x", (d) => sizeScale(d.connections || 0) + 2)
      .attr("y", 3)
      .attr("font-size", "5px")
      .attr("fill", "#ddd");

    // Add hover functionality
    nodeGroups
      .on("mouseover", function (event, d) {
        d3.select(this).select("text").text(d.name);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .select("text")
          .text(d.connections >= 100 ? d.name : "");
      });

    nodeGroups
      .append("title")
      .text(
        (d) =>
          `${d.name}\nConnections: ${d.connections}\nCategories: ${
            d.categories ? d.categories.join(", ") : d.category
          }\nCmd/Ctrl + Click to open problem`
      );

    nodeGroups
      .on("click", (event, d) => {
        // Check if command (Mac) or ctrl (Windows) key is pressed
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          const url = getLeetCodeUrl(d.name);
          window.open(url, "_blank");
        }
      })
      .style("cursor", "pointer"); // Change cursor to pointer to indicate clickable

    simulationRef.current.tick(30);

    simulationRef.current.on("tick", () => {
      if (!simulationRef.current.tickRequest) {
        simulationRef.current.tickRequest = requestAnimationFrame(() => {
          links
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

          nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);

          simulationRef.current.tickRequest = null;
        });
      }
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

    // Clean up the timeout when component updates
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        if (simulationRef.current.tickRequest) {
          cancelAnimationFrame(simulationRef.current.tickRequest);
        }
      }
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
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

  // Extract user stats from the data
  const userStats = useMemo(
    () => ({
      username: data.user?.username || "yangsteven",
      total: data.user?.total_problems_completed || 0,
      easy: data.user?.easy_questions || 0,
      medium: data.user?.medium_questions || 0,
      hard: data.user?.hard_questions || 0,
    }),
    [data]
  );

  // Update the getLeetCodeUrl function
  const getLeetCodeUrl = (problemName) => {
    // Convert problem name to leetcode URL format
    // e.g. "Number of Squareful Arrays" -> "number-of-squareful-arrays"
    const urlName = problemName
      .toLowerCase()
      // First replace spaces with dashes
      .replace(/\s+/g, "-")
      // Then remove any remaining special characters
      .replace(/[^a-zA-Z0-9-]/g, "");
    return `https://leetcode.com/problems/${urlName}/description/`;
  };

  return (
    <div className="relative w-full h-full">
      <StatsContainer>
        <Username>{userStats.username}</Username>
        <StatsRow>
          <StatValue>{userStats.total}</StatValue>
          <StatLabel>solved</StatLabel>
        </StatsRow>
        <DifficultyStats>
          <DifficultyItem color="#00B8A3">{userStats.easy}</DifficultyItem>
          <DifficultyItem color="#FFC01E">{userStats.medium}</DifficultyItem>
          <DifficultyItem color="#FF375F">{userStats.hard}</DifficultyItem>
        </DifficultyStats>
      </StatsContainer>

      <ControlsContainer>
        <div>
          <label>Center Force</label>
          <TimelineSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={centerForce}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setCenterForce(value);
              handleForceChange.centerForce(value);
            }}
          />
        </div>
        <div>
          <label>Repel Force</label>
          <TimelineSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={repelForce}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setRepelForce(value);
              handleForceChange.repelForce(value);
            }}
          />
        </div>
        <div>
          <label>Link Force</label>
          <TimelineSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={linkForce}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setLinkForce(value);
              handleForceChange.linkForce(value);
            }}
          />
        </div>
        <div>
          <label>Link Distance</label>
          <TimelineSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={linkDistance}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setLinkDistance(value);
              handleForceChange.linkDistance(value);
            }}
          />
        </div>
        <div>
          <label>Timeline Progress</label>
          <TimelineSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={timeProgress}
            onChange={(e) => setTimeProgress(parseFloat(e.target.value))}
          />
        </div>
        <InstructionText>⌘/Ctrl + Click to open problem</InstructionText>
      </ControlsContainer>

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full bg-gray-900 shadow-lg cursor-move rounded-lg"
      />
    </div>
  );
};

export default LeetCodeGraph;
