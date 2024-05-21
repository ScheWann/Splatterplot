import React from "react";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import faithfulData from "./faithful.json";

export const FaithfulHistogramKDE = () => {
    const svgRef = useRef();
    useEffect(() => {
        const width = 960;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };


        const svg = d3.select(svgRef.current)
                        .attr("width", width)
                        .attr("height", height);
        
        svg.selectAll("#faithfulHistogram").remove();

        const kernelDensityEstimator = (kernel, X) => {
            return function (V) {
                return X.map(function (x) {
                    return [x, d3.mean(V, function (v) { return kernel(x - v); })];
                });
            };
        }

        const kernelEpanechnikov = (k) => {
            return function (v) {
                return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
            };
        }

        const x = d3.scaleLinear()
            .domain([30, 110])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 0.1]) 
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", width - margin.right)
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "end")
            .text("Time between eruptions (min.)");

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(10, ".0%"));

        const n = faithfulData.length;
        const bins = d3.histogram()
            .domain(x.domain())
            .thresholds(40)
            (faithfulData);
        const density = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))(faithfulData);
        
        svg.insert("g", "*")
            .attr("fill", "#bbb")
            .selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", d => x(d.x0) + 1)
            .attr("y", d => y(d.length / n))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => y(0) - y(d.length / n));

        svg.append("path")
            .datum(density)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function (d) { return x(d[0]); })
                .y(function (d) { return y(d[1]); }));
    }, []);

    return (
        <>
            <svg ref={svgRef} id="faithfulHistogram"></svg>
        </>
    );
};