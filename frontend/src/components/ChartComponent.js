import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ChartComponent({ data, labelKey, valueKey, ariaLabel }) {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;

    // Clear out any existing chart
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    // Dimensions & margins
    const fullWidth  = 480;
    const fullHeight = 320;
    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const width  = fullWidth  - margin.left - margin.right;
    const height = fullHeight - margin.top  - margin.bottom;

    svg
      .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
      .attr('role', 'img')
      .attr('aria-label', ariaLabel);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d[labelKey]))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[valueKey])])
      .nice()
      .range([height, 0]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeTableau10)
      .domain(data.map(d => d[labelKey]));

    // Chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '0.25em');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y));

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d[labelKey]))
        .attr('y', d => y(d[valueKey]))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d[valueKey]))
        .attr('fill', d => color(d[labelKey]));

  }, [data, labelKey, valueKey, ariaLabel]);

  return <svg ref={ref} />;
}

