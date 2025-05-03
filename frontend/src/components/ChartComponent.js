import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ChartComponent({ data, labelKey, valueKey }) {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const width = 400, height = 300;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3.scaleBand()
      .domain(data.map(d => d[labelKey]))
      .range([40, width-20])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[valueKey])])
      .nice()
      .range([height-30, 20]);

    svg.append('g')
      .attr('transform', `translate(0,${height-30})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('dy','0.35em')
      .attr('x',-10)
      .attr('y',10)
      .attr('transform','rotate(-45)');

    svg.append('g')
      .attr('transform', `translate(40,0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class','bar')
      .attr('x', d => x(d[labelKey]))
      .attr('y', d => y(d[valueKey]))
      .attr('width', x.bandwidth())
      .attr('height', d => height-30 - y(d[valueKey]));

  }, [data]);

  return <svg ref={ref} role="img" aria-label="Bar chart"></svg>;
}
