"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

type Props = {
  height?: number;
};

export default function GeoMap({ height = 220 }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<string>("");

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 8)
      .translate([width / 2, height / 2 + 10]);

    const path = d3.geoPath(projection);

    fetch("/geo/countries-110m.json")
      .then((res) => res.json())
      .then((topology) => {
        const countries = feature(
          topology,
          topology.objects.countries
        ).features as any[];

        svg
          .append("g")
          .selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", "#1f2937")
          .attr("stroke", "rgba(255,255,255,0.08)")
          .attr("stroke-width", 0.5)
          .style("pointer-events", "auto")
          .on("mouseenter", function (_, d) {
            setHovered(d.properties.name);
            d3.select(this).attr("fill", "#3b82f6");
          })
          .on("mouseleave", function () {
            setHovered("");
            d3.select(this).attr("fill", "#1f2937");
          });
      });
  }, [height]);

  return (
    <div className="relative h-full w-full">
      {/* Hover label */}
      <div className="pointer-events-none absolute left-3 top-3 text-xs text-white/70">
        {hovered || "—"}
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 text-[11px] text-white/50">
        <span>Low</span>
        <div className="flex gap-[2px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-[3px]"
              style={{
                background: `rgba(59,130,246,${(i + 1) / 12})`,
              }}
            />
          ))}
        </div>
        <span>High</span>
      </div>

      {/* SVG MUST NOT CAPTURE POINTER EVENTS */}
      <svg
        ref={svgRef}
        className="h-full w-full pointer-events-none"
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}