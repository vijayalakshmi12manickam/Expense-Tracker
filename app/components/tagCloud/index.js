"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

export default function D3TagCloud() {
  const svgRef = useRef();
  const containerRef = useRef();
  const [words, setWords] = useState([]);

  // 1️⃣ Fetch data from /api/tags
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((d) => ({
          text: d._id,
          value: d.count,
        }));
        setWords(formatted);
      })
      .catch((err) => console.error("Failed to load tags", err));
  }, []);

  // 2️⃣ Draw cloud when words change
  useEffect(() => {
    if (!words.length) return;

    const drawCloud = () => {
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = Math.max(300, width * 0.5);

      const min = d3.min(words, (d) => d.value);
      const max = d3.max(words, (d) => d.value);

      const fontScale = d3.scaleLinear().domain([min, max]).range([14, 30]);
      // const colorScale = d3
      //   .scaleSequential(d3.interpolatePlasma)
      //   .domain([min, max]);

      // Dynamic color scale: cool (low) → warm (high)
      const colorScale = d3
        .scaleSequential()
        .domain([min, max])
        .interpolator((t) => d3.interpolateCool(1 - t) + ""); // reverses cool→warm mapping

      const layout = cloud()
        .size([width, height])
        .words(words.map((d) => ({ ...d })))
        .padding(5)
        //   .rotate(() => (Math.random() > 0.5 ? 0 : 90))
        .rotate(0)
        .font("sans-serif")
        .fontSize((d) => fontScale(d.value))
        .on("end", draw);

      layout.start();

      function draw(words) {
        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .style("background", "#fff")
          .selectAll("*")
          .remove(); // clear old words

        const group = d3
          .select(svgRef.current)
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

        group
          .selectAll("text")
          .data(words)
          .join("text")
          .style("font-size", (d) => `${d.size}px`)
          .style("fill", (d) => colorScale(d.value))
          .style("font-family", "sans-serif")
          .style("cursor", "pointer")
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`,
          )
          .text((d) => d.text)
          .on("click", (e, d) => {
            window.location.href = `/tag?tag=${d.text}`;
          })
          .append("title")
          .text((d) => `${d.text}: ${d.value} transactions`);
      }
    };

    drawCloud();
    window.addEventListener("resize", drawCloud);
    return () => window.removeEventListener("resize", drawCloud);
  }, [words]);

  return (
    <div ref={containerRef} className="flex justify-center items-center">
      {words.length ? (
        <svg ref={svgRef} className="max-w-full h-auto"></svg>
      ) : (
        <p className="text-gray-500">Loading tag cloud...</p>
      )}
    </div>
  );
}
