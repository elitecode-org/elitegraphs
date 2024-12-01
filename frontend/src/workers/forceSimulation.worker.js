import * as d3 from 'd3';

self.onmessage = function(event) {
  const { nodes, links, config } = event.data;
  
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(config.linkDistance * 100))
    .force("charge", d3.forceManyBody().strength(-config.repelForce * 400))
    .force("center", d3.forceCenter(0, 0).strength(config.centerForce))
    .force("collision", d3.forceCollide().radius(d => d.radius + 5));

  simulation.force("link").strength(config.linkForce);

  simulation.on("tick", () => {
    self.postMessage({ type: 'tick', nodes: nodes, links: links });
  });

  simulation.on("end", () => {
    self.postMessage({ type: 'end', nodes: nodes, links: links });
  });
}; 