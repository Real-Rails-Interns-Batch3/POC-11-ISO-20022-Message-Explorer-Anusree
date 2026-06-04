'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function D3Sparkline({ 
  data, 
  width = 60, 
  height = 20, 
  color = 'var(--success)' 
}: D3SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([Math.min(...data), Math.max(...data)])
      .range([height - 2, 2]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    // Gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "d3-spark-grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.3);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0);

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#d3-spark-grad)")
      .attr("d", area);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg.append("circle")
      .attr("cx", x(data.length - 1))
      .attr("cy", y(data[data.length - 1]))
      .attr("r", 2.5)
      .attr("fill", "var(--bg-obsidian)")
      .attr("stroke", color)
      .attr("stroke-width", 1.5);

  }, [data, width, height, color]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible ml-2 opacity-90" />
  );
}
