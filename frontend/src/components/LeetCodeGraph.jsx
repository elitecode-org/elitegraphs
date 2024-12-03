import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as d3 from "d3";
import { debounce } from "lodash";
import { useUser } from "../context/userContext";

const categoryColors = {
  Array: "#FF3366",
  String: "#00FF88",
  "Hash Table": "#00CCFF",
  "Dynamic Programming": "#FF9933",
  Math: "#FFCC00",
  Sorting: "#FF0099",
  Greedy: "#9933FF",
  "Depth-First Search": "#3366FF",
  "Binary Search": "#FF6600",
  Database: "#FF0066",
  "Breadth-First Search": "#0099FF",
  Tree: "#00FFCC",
  Matrix: "#FFB300",
  "Binary Tree": "#00FFB3",
  "Two Pointers": "#FF0066",
  "Bit Manipulation": "#9933FF",
  Stack: "#FF3366",
  "Heap (Priority Queue)": "#00FF88",
  Graph: "#00CCFF",
  Design: "#FF9933",
  "Prefix Sum": "#FFCC00",
  Simulation: "#FF0066",
  Backtracking: "#9933FF",
  Counting: "#3366FF",
  "Sliding Window": "#FF6600",
  "Union Find": "#FF0066",
  "Linked List": "#0099FF",
  "Ordered Set": "#00FFCC",
  "Monotonic Stack": "#FFB300",
  Enumeration: "#00FFCC",
  Trie: "#FF0066",
  "Divide and Conquer": "#9933FF",
  "Binary Search Tree": "#00FFCC",
  Queue: "#00FF88",
  "Number Theory": "#FFCC00",
  Bitmask: "#9933FF",
  Recursion: "#3366FF",
  Memoization: "#FF9933",
};

const LeetCodeGraph = () => {
  const svgRef = useRef();
  const [centerForce, setCenterForce] = useState(0.5);
  const [repelForce, setRepelForce] = useState(0.5);
  const [linkForce, setLinkForce] = useState(0.8);
  const [linkDistance, setLinkDistance] = useState(0.5);
  const [timeProgress, setTimeProgress] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null);

  const { problems, stats } = useUser();

  // Transform problems into graph data format
  const data = useMemo(() => {
    if (!problems || problems.length === 0) {
      return { nodes: [], links: [] };
    }

    // Create nodes from problems and category tags
    const problemNodes = problems.map((problem) => ({
      id: problem.problemId,
      name: problem.questionTitle,
      type: "problem",
      difficulty: problem.difficultyLevel,
      categories: problem.tags || [], // Make sure your backend provides tags
      timestamp: new Date(problem.lastAttempted),
      status: problem.status,
      questionLink: problem.questionLink,
    }));

    // Create unique category nodes
    const uniqueCategories = [
      ...new Set(problems.flatMap((p) => p.tags || [])),
    ];
    const categoryNodes = uniqueCategories.map((category) => ({
      id: `category-${category}`,
      name: category,
      type: "category",
      categories: [category],
    }));

    const nodes = [...problemNodes, ...categoryNodes];

    // Create links
    const links = [];

    // Link problems to their category nodes
    problemNodes.forEach((problem) => {
      problem.categories.forEach((category) => {
        links.push({
          source: problem.id,
          target: `category-${category}`,
          value: 1,
          type: "problem-category",
          categories: [category],
          timestamp: problem.timestamp || new Date(),
        });
      });
    });

    // Link problems with each other if they share 2 or more categories
    for (let i = 0; i < problemNodes.length; i++) {
      for (let j = i + 1; j < problemNodes.length; j++) {
        const commonCategories = problemNodes[i].categories.filter((category) =>
          problemNodes[j].categories.includes(category)
        );

        // Only create a link if there are 2 or more common categories
        if (commonCategories.length >= 3) {
          links.push({
            source: problemNodes[i].id,
            target: problemNodes[j].id,
            value: commonCategories.length, // Strength based on number of shared categories
            type: "problem-problem",
            categories: commonCategories,
            timestamp: problemNodes[i].timestamp || new Date(),
          });
        }
      }
    }

    // Count incoming connections for each category
    const categoryConnections = {};
    links.forEach((link) => {
      if (link.type === "problem-category") {
        const categoryId = link.target;
        categoryConnections[categoryId] =
          (categoryConnections[categoryId] || 0) + 1;
      }
    });

    // Add connection count to category nodes
    nodes.forEach((node) => {
      if (node.type === "category") {
        node.connections = categoryConnections[node.id] || 0;
      }
    });
    return { nodes, links };
  }, [problems]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const simulationRef = useRef(null);

  const getVisibleData = useCallback(
    (progress) => {
      // Only consider problem nodes for timeline filtering
      const problemNodes = data.nodes.filter(
        (node) => node.type === "problem" && node.status === "accepted"
      );

      const dates = problemNodes.map((node) => new Date(node.timestamp));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      const totalTime = maxDate - minDate;
      const cutoffDate = new Date(minDate.getTime() + totalTime * progress);

      // Filter problem nodes based on timestamp
      const visibleProblemNodes = problemNodes.filter(
        (node) => new Date(node.timestamp) <= cutoffDate
      );

      // Get all category nodes initially
      const categoryNodes = data.nodes.filter(
        (node) => node.type === "category"
      );

      // Filter links to only include those connected to visible problem nodes
      const visibleProblemIds = new Set(
        visibleProblemNodes.map((node) => node.id)
      );
      const visibleLinks = data.links.filter((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;

        if (link.type === "problem-category") {
          return visibleProblemIds.has(sourceId);
        }
        return (
          visibleProblemIds.has(sourceId) && visibleProblemIds.has(targetId)
        );
      });

      // Find which categories have connections
      const connectedCategoryIds = new Set();
      visibleLinks.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;

        if (link.type === "problem-category") {
          connectedCategoryIds.add(targetId);
        }
      });

      // Filter category nodes to only include those with connections
      const visibleCategoryNodes = categoryNodes.filter((node) =>
        connectedCategoryIds.has(node.id)
      );

      // Combine filtered problem nodes with filtered category nodes
      const visibleNodes = [...visibleProblemNodes, ...visibleCategoryNodes];

      // Update connection counts
      const nodeConnectionCounts = {};
      visibleLinks.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;

        nodeConnectionCounts[sourceId] =
          (nodeConnectionCounts[sourceId] || 0) + 1;
        nodeConnectionCounts[targetId] =
          (nodeConnectionCounts[targetId] || 0) + 1;
      });

      visibleNodes.forEach((node) => {
        node.connections = nodeConnectionCounts[node.id] || 0;
      });

      return { nodes: visibleNodes, links: visibleLinks };
    },
    [data]
  );

  const getFilteredData = useCallback((data, searchQuery) => {
    if (!searchQuery) return data;

    const lowercaseQuery = searchQuery.toLowerCase();

    // Filter nodes based on search query
    const filteredNodes = data.nodes.filter((node) => {
      if (node.type === "problem") {
        return node.name.toLowerCase().includes(lowercaseQuery);
      }
      // Keep all category nodes initially
      return node.type === "category";
    });

    // Get IDs of filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    // Filter links to only include connections to/from filtered nodes
    const filteredLinks = data.links.filter((link) => {
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target;

      if (link.type === "problem-category") {
        // Keep category links only if the problem node is in filtered set
        return filteredNodeIds.has(sourceId);
      }
      // For problem-problem links, keep only if both nodes are in filtered set
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    // Remove category nodes that have no connections after filtering
    const connectedNodeIds = new Set();
    filteredLinks.forEach((link) => {
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target;
      connectedNodeIds.add(sourceId);
      connectedNodeIds.add(targetId);
    });

    const finalNodes = filteredNodes.filter(
      (node) => node.type === "problem" || connectedNodeIds.has(node.id)
    );

    // Highlight matched nodes
    finalNodes.forEach((node) => {
      if (node.type === "problem") {
        node.highlighted = node.name.toLowerCase().includes(lowercaseQuery);
      }
    });

    return { nodes: finalNodes, links: filteredLinks };
  }, []);

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

  const resetVisualization = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Reset node styling
    svg
      .selectAll("circle")
      .attr("stroke", "none")
      .attr("stroke-width", 0)
      .style("filter", (d) => (d.type === "category" ? "url(#glow)" : "none"))
      .style("opacity", (d) => (d.type === "category" ? 0.9 : 0.7));

    // Reset link styling
    svg.selectAll("line").attr("stroke-opacity", 0.2).attr("stroke-width", 1);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Get visible data based on timeline
    const timelineData = getVisibleData(timeProgress);
    // Then filter based on search
    const visibleData = getFilteredData(timelineData, searchQuery);

    const width = 1200;
    const height = 700;

    const getNodeSize = (node) => {
      if (node.type === "category") {
        // Scale category size based on number of connections
        const minSize = 15;
        const maxSize = 30;
        const maxConnections = Math.max(
          ...visibleData.nodes
            .filter((n) => n.type === "category")
            .map((n) => n.connections)
        );
        const scale = d3
          .scaleLinear()
          .domain([0, Math.max(1, maxConnections)])
          .range([minSize, maxSize]);
        return scale(node.connections);
      }

      // Scale problem nodes, but keep them smaller
      const minSize = 2;
      const maxSize = 8; // Significantly smaller than category nodes
      const maxConnections = Math.max(
        ...visibleData.nodes
          .filter((n) => n.type === "problem")
          .map((n) => n.connections || 0)
      );
      const scale = d3
        .scaleLinear()
        .domain([0, Math.max(1, maxConnections)])
        .range([minSize, maxSize]);
      return scale(node.connections || 0);
    };

    const getNodeColor = (node) => {
      if (node.type === "category") {
        const baseColor = categoryColors[node.name] || "#808080";
        // Make the color more vibrant by increasing saturation
        const hslColor = d3.hsl(baseColor);
        hslColor.s = Math.min(1, hslColor.s * 1.3); // Increase saturation by 30%
        hslColor.l = Math.min(0.6, hslColor.l * 1.2); // Slightly increase lightness
        return hslColor.toString();
      }
      // For problem nodes, use the first category's color with reduced opacity
      const firstCategory = node.categories ? node.categories[0] : null;
      const baseColor = categoryColors[firstCategory] || "#808080";
      return d3.color(baseColor).darker(0.5);
    };

    const maxConnections = Math.max(
      ...visibleData.nodes.map((node) => node.connections || 0)
    );
    const sizeScale = d3
      .scaleLinear()
      .domain([0, Math.max(1, maxConnections)])
      .range([3, 5]);

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bg-gray-950 rounded-lg");

    // Add glow filter definition
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("height", "300%")
      .attr("width", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%");

    filter
      .append("feGaussianBlur")
      .attr("class", "blur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur2");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "coloredBlur2");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Add a new glow filter specifically for links
    const linkGlow = defs
      .append("filter")
      .attr("id", "linkGlow")
      .attr("height", "300%")
      .attr("width", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%");

    linkGlow
      .append("feGaussianBlur")
      .attr("class", "blur")
      .attr("stdDeviation", "1")
      .attr("result", "coloredBlur");

    const linkMerge = linkGlow.append("feMerge");
    linkMerge.append("feMergeNode").attr("in", "coloredBlur");
    linkMerge.append("feMergeNode").attr("in", "SourceGraphic");

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
      .alphaDecay(0.01)
      .alphaMin(0.001)
      .velocityDecay(0.3)
      .force(
        "link",
        d3
          .forceLink(visibleData.links)
          .id((d) => d.id)
          .distance((d) => {
            // Increase distance between nodes based on their types
            if (d.type === "problem-problem") return linkDistance * 150;
            return linkDistance * 200; // Larger distance for problem-category links
          })
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength((d) => {
            // Stronger repulsion for category nodes
            if (d.type === "category") return -repelForce * 800;
            return -repelForce * 600;
          })
          .theta(0.9)
          .distanceMin(10) // Increase minimum distance
          .distanceMax(width) // Allow repulsion to work across the entire width
      )
      .force(
        "center",
        d3.forceCenter(0, 0).strength(centerForce * 0.5) // Reduce center force
      )
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => {
            // Increase collision radius
            if (d.type === "category") return getNodeSize(d) * 3;
            return getNodeSize(d) * 4;
          })
          .strength(0.9) // Increase collision strength
          .iterations(2) // More iterations for better collision detection
      )
      .force("x", d3.forceX().strength(0.1)) // Add x-axis spreading force
      .force("y", d3.forceY().strength(0.1)); // Add y-axis spreading force

    // Optionally, add these helper forces to prevent clustering
    simulationRef.current
      .force(
        "radial",
        d3
          .forceRadial(
            (d) => (d.type === "category" ? 200 : 100),
            width / 2,
            height / 2
          )
          .strength(0.1)
      )
      .force("forceX", d3.forceX(width / 2).strength(0.05))
      .force("forceY", d3.forceY(height / 2).strength(0.05));

    // Increase initial simulation ticks for better initial layout
    simulationRef.current.tick(100);

    simulationRef.current.force("link").strength(linkForce);

    // Update the links styling
    const links = g
      .append("g")
      .selectAll("line")
      .data(visibleData.links)
      .join("line")
      .attr("stroke", "#FFFFFF") // Pure white color
      .attr("stroke-opacity", 0.2) // Increased opacity
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
      .attr("r", (d) => getNodeSize(d))
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke", (d) => (d.highlighted ? "#ffffff" : "none"))
      .attr("stroke-width", (d) => (d.highlighted ? 2 : 0))
      .style("filter", (d) => {
        if (d.type === "category") return "url(#glow)";
        if (d.highlighted) return "url(#glow)";
        return "none";
      })
      .style("opacity", (d) => {
        if (searchQuery && !d.highlighted && d.type === "problem") return 0.3;
        return d.type === "category" ? 0.9 : 0.7;
      });

    const nodeTexts = nodeGroups
      .append("text")
      .text((d) => (d.type === "category" ? d.name : "")) // Only show category names by default
      .attr("x", (d) => getNodeSize(d) + 2)
      .attr("y", 3)
      .attr("font-size", (d) => (d.type === "category" ? "8px" : "4px"))
      .attr("fill", "#9CA3AF");

    // Add hover functionality
    nodeGroups
      .on("mouseover", function (event, d) {
        d3.select(this).select("text").text(d.name);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .select("text")
          .text(
            d.type === "category" ? d.name : d.connections >= 100 ? d.name : ""
          );
      });

    nodeGroups
      .append("title")
      .text((d) =>
        d.type === "category"
          ? `${d.name}\nProblems: ${d.connections}`
          : `${d.name}\nConnections: ${
              d.connections || 0
            }\nCategories: ${d.categories.join(
              ", "
            )}\nCmd/Ctrl + Click to open problem`
      );

    nodeGroups.on("click", (event, d) => {
      if (d.type === "category") {
        const connectedProblems = visibleData.nodes.filter(
          (node) =>
            node.type === "problem" &&
            node.categories &&
            node.categories.includes(d.name)
        );

        setModalData({
          category: d.name,
          problems: connectedProblems,
        });
      } else if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        window.open(d.questionLink, "_blank");
      }
    });

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

    // Add pulsing animation for category nodes
    nodeGroups
      .filter((d) => d.type === "category")
      .select("circle")
      .style("animation", "pulse 2s infinite");

    // Add CSS animation for pulse effect
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% {
          filter: url(#glow) brightness(1) saturate(1);
        }
        50% {
          filter: url(#glow) brightness(1.4) saturate(1.4);
        }
        100% {
          filter: url(#glow) brightness(1) saturate(1);
        }
      }
    `;
    document.head.appendChild(style);

    // Update link styling based on connected nodes
    links
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", (d) => {
        const sourceHighlighted = d.source.highlighted;
        const targetHighlighted = d.target.highlighted;
        return sourceHighlighted || targetHighlighted ? 0.4 : 0.1;
      })
      .attr("stroke-width", (d) => {
        const sourceHighlighted = d.source.highlighted;
        const targetHighlighted = d.target.highlighted;
        return sourceHighlighted || targetHighlighted ? 1.5 : 1;
      });

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
      document.head.removeChild(style);
    };
  }, [
    centerForce,
    repelForce,
    linkForce,
    linkDistance,
    timeProgress,
    searchQuery,
    getVisibleData,
    getFilteredData,
    categoryColors,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        // If search is already shown, close it and clear the search
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery("");
          resetVisualization();
        } else {
          // Otherwise, show the search and focus it
          setShowSearch(true);
          setTimeout(() => {
            const searchInput = document.getElementById("search-input");
            if (searchInput) {
              searchInput.focus();
            }
          }, 10);
        }
      }
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false);
        setSearchQuery("");
        resetVisualization();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch, resetVisualization]);

  // Extract user stats from the context
  const userStats = useMemo(
    () => ({
      username: stats?.username || "User",
      total: stats?.totalSolved || 0,
      easy: stats?.easy?.solved || 0,
      medium: stats?.medium?.solved || 0,
      hard: stats?.hard?.solved || 0,
    }),
    [stats]
  );

  useEffect(() => {
    console.log(userStats);
  }, [userStats]);

  // Update the getLeetCodeUrl function
  const getLeetCodeUrl = (problem) => {
    return problem.questionLink;
  };

  return (
    <div className="relative w-full h-full bg-gray-950">
      <div className="absolute top-5 right-5 bg-gray-900/80 backdrop-blur-lg p-4 rounded-lg w-[250px] z-20 border border-gray-800">
        <h2
          className="text-2xl font-semibold mb-2 
          text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500
          drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        >
          {userStats.username}
        </h2>
        <div className="flex gap-4 items-center mt-2">
          <span className="text-xl font-medium text-white/90">
            {userStats.total}
          </span>
          <span className="text-xl font-light text-gray-400">solved</span>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="text-lg font-medium text-green-500">
            {userStats.easy}
          </div>
          <div className="text-lg font-medium text-yellow-500">
            {userStats.medium}
          </div>
          <div className="text-lg font-medium text-red-500">
            {userStats.hard}
          </div>
        </div>
      </div>

      <div className="absolute top-40 right-5 bg-gray-900/80 backdrop-blur-lg p-4 rounded-lg w-[250px] z-10 flex flex-col gap-2.5 border border-gray-800">
        <label className="block text-gray-400 mb-1 text-sm font-mono">
          Center Force
        </label>
        <input
          type="range"
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
            [&::-webkit-slider-thumb]:to-purple-500"
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
        <label className="block text-gray-400 mb-1 text-sm font-mono">
          Repel Force
        </label>
        <input
          type="range"
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
            [&::-webkit-slider-thumb]:to-purple-500"
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
        <label className="block text-gray-400 mb-1 text-sm font-mono">
          Link Force
        </label>
        <input
          type="range"
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
            [&::-webkit-slider-thumb]:to-purple-500"
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
        <label className="block text-gray-400 mb-1 text-sm font-mono">
          Link Distance
        </label>
        <input
          type="range"
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
            [&::-webkit-slider-thumb]:to-purple-500"
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
        <label className="block text-gray-400 mb-1 text-sm font-mono">
          Timeline Progress
        </label>
        <input
          type="range"
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
            [&::-webkit-slider-thumb]:to-purple-500"
          min="0"
          max="1"
          step="0.01"
          value={timeProgress}
          onChange={(e) => setTimeProgress(parseFloat(e.target.value))}
        />
      </div>

      <div
        className={`absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 
        bg-gray-900/90 backdrop-blur-lg p-1.5 px-2 rounded-lg shadow-lg z-50 w-[600px]
        border border-gray-800 ${showSearch ? "flex" : "hidden"}`}
      >
        <input
          id="search-input"
          className="bg-transparent border-none text-white p-1 text-sm font-mono outline-none w-full
            placeholder:text-white/40"
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full bg-gray-950 rounded-lg"
      />

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setModalData(null)}
          />
          <div className="relative bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                {modalData.category}
              </h2>
              <button
                onClick={() => setModalData(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="space-y-2">
                {modalData.problems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{problem.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-sm px-2 py-0.5 rounded ${
                            problem.difficulty === "Easy"
                              ? "bg-green-900 text-green-200"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        <span
                          className={`text-sm px-2 py-0.5 rounded ${
                            problem.status === "accepted"
                              ? "bg-green-900 text-green-200"
                              : "bg-blue-900 text-blue-200"
                          }`}
                        >
                          {problem.status === "accepted"
                            ? "Solved"
                            : "Attempted"}
                        </span>
                      </div>
                    </div>
                    <a
                      href={problem.questionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetCodeGraph;
