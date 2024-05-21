import React from "react";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { geoPath, geoAlbersUsa } from 'd3-geo';
import usMapData from "./states-10m.json";
import GunDeathData from "./StateGunDeaths.csv";
import { feature } from 'topojson-client';

export const GunDeath = () => {
    const svgRef = useRef();
    useEffect(() => {
        const width = 960;
        const height = 500;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove();

        const projection = d3.geoAlbersUsa()
            .scale(1000)
            .translate([width / 2, height / 2]);

        const pathGenerator = geoPath().projection(projection);

        svg.attr('width', width)
            .attr('height', height)
            .selectAll('.state')
            .data(feature(usMapData, usMapData.objects.states).features)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', pathGenerator)
            .attr('fill', '#ccc')
            .attr('stroke', '#fff');

        d3.csv(GunDeathData).then(data => {
            const filteredData = data.map(d => ({
                ...d,
                lat: parseFloat(d.lat.trim()), 
                lng: parseFloat(d.lng.trim()) 
            })).filter(d => !isNaN(d.lat) && !isNaN(d.lng));

            svg.append("g")
                .selectAll("circle")
                .data(filteredData)
                .enter().append("circle")
                .attr("cx", d => {
                    const coords = projection([d.lng, d.lat]);
                    return coords ? coords[0] : null;
                })
                .attr("cy", d => {
                    const coords = projection([d.lng, d.lat]);
                    return coords ? coords[1] : null;
                })
                .attr("r", 2)
                .style("fill", "red")
                .attr("display", d => {
                    const coords = projection([d.lng, d.lat]);
                    return coords ? "inline" : "none";
                });
        });


    }, []);

    return (
        <>
            <svg ref={svgRef}></svg>
        </>
    );
};