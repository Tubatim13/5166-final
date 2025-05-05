// src/components/PieChartComponent.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function PieChartComponent({ data, labelKey, valueKey, ariaLabel }) {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    // Dramatically larger container
    const size   = 700;
    const radius = 180;
    const center = size / 2;

    svg
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .attr('role', 'img')
      .attr('aria-label', ariaLabel);

    const g = svg.append('g')
      .attr('transform', `translate(${center},${center})`);

    const color = d3.scaleOrdinal(d3.schemeTableau10)
      .domain(data.map(d => d[labelKey]));

    const pie = d3.pie()
      .value(d => d[valueKey])
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const outerArc = d3.arc()
      .innerRadius(radius + 20)
      .outerRadius(radius + 20);

    // Draw slices
    g.selectAll('path')
      .data(pie(data))
      .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[labelKey]))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

    // Draw polylines
    g.selectAll('polyline')
      .data(pie(data))
      .join('polyline')
        .attr('points', d => {
          const [x1, y1] = arc.centroid(d);
          const [x2, y2] = outerArc.centroid(d);
          const mid = (d.startAngle + d.endAngle) / 2;
          const x3 = (radius + 60) * (mid < Math.PI ? 1 : -1);
          const y3 = y2;
          return [[x1, y1], [x2, y2], [x3, y3]];
        })
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .attr('stroke-width', 2);

    // Draw labels
    g.selectAll('text')
      .data(pie(data))
      .join('text')
        .attr('transform', d => {
          const mid = (d.startAngle + d.endAngle) / 2;
          const [_, y2] = outerArc.centroid(d);
          const x3 = (radius + 60) * (mid < Math.PI ? 1 : -1);
          return `translate(${x3},${y2})`;
        })
        .attr('text-anchor', d => {
          const mid = (d.startAngle + d.endAngle) / 2;
          return mid < Math.PI ? 'start' : 'end';
        })
        .attr('dy', '0.35em')
        .style('font-size', '14px')
        .text(d => `${d.data[labelKey]} (${d.data[valueKey]})`);

  }, [data, labelKey, valueKey, ariaLabel]);

  return <svg ref={ref} />;
}
