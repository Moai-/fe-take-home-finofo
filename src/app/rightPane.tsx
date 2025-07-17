import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useFruitContext } from "./context";

type ChartDatum = {
  id: number;
  name: string;
  calories: number;
};

type ArcDatum = d3.PieArcDatum<ChartDatum>;

interface SlicePath extends SVGPathElement {
  _current?: ArcDatum;
}

export const RightPane: React.FC = () => {
  const { jar, fruitMap } = useFruitContext();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const data: ChartDatum[] = useMemo(() => {
    const tally = new Map<number, ChartDatum>();
    jar.forEach((id) => {
      const fruit = fruitMap[id];
      if (!fruit) return;
      const prev = tally.get(id);
      if (prev) {
        prev.calories += fruit.nutritions.calories;
      } else {
        tally.set(id, {
          id,
          name: fruit.name,
          calories: fruit.nutritions.calories,
        });
      }
    });
    return Array.from(tally.values());
  }, [jar, fruitMap]);

  useEffect(() => {
    if (!svgRef.current) return;

    const w = 340;
    const h = 340;
    const r = Math.min(w, h) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("class", "mx-auto select-none text-xs font-medium fill-slate-700");

    const group = svg
      .selectAll<SVGGElement, unknown>("g.root")
      .data([null])
      .join("g")
      .attr("class", "root")
      .attr("transform", `translate(${w / 2},${h / 2})`);

    const pieGen = d3
      .pie<ChartDatum>()
      .value((d) => d.calories)
      .sort(null);

    const arcGen = d3
      .arc<ArcDatum>()
      .innerRadius(0)
      .outerRadius(r - 20);

    const outerArc = d3
      .arc<ArcDatum>()
      .innerRadius(r - 10)
      .outerRadius(r - 10);

    const sliceSel = group
      .selectAll<SlicePath, ArcDatum>("path.slice")
      .data(pieGen(data), (d) => d.data.id);

    sliceSel
      .exit()
      .transition()
      .duration(700)
      // @ts-expect-error unknown datum
      .attrTween("d", function (this: SlicePath, d: ArcDatum) {
        const endState: ArcDatum = { ...d, startAngle: d.endAngle };
        const interp = d3.interpolate<ArcDatum>(d, endState);
        return (t) => arcGen(interp(t)) ?? '';
      })
      .style("opacity", 0)
      .remove();

    sliceSel
      .transition()
      .duration(700)
      .attrTween("d", function (this: SlicePath, d) {
        const prev = this._current ?? d;
        const interp = d3.interpolate<ArcDatum>(prev, d);
        this._current = d; // store for next round
        return (t) => arcGen(interp(t)) ?? '';
      });

    sliceSel
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("fill", (_, i) => d3.schemeTableau10[i % 10])
      .each(function (this: SlicePath, d) {
        this._current = { ...d, startAngle: d.endAngle };
      })
      .style("opacity", 0)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attrTween("d", function (this: SlicePath, d) {
        const prev = this._current!;
        const interp = d3.interpolate<ArcDatum>(prev, d);
        this._current = d;
        return (t) => arcGen(interp(t)) ?? '';
      });

    const lineSel = group
      .selectAll<SVGPolylineElement, ArcDatum>("polyline.leader")
      .data(pieGen(data), (d) => d.data.id);

    lineSel.exit().transition().duration(700).style("opacity", 0).remove();

    lineSel
      .enter()
      .append("polyline")
      .attr("class", "leader")
      .attr("stroke", "#64748b")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .merge(lineSel)
      .transition()
      .duration(700)
      .attr("points", (d) => {
        const midAngle = (d.startAngle + d.endAngle) / 2;
        const pos = arcGen.centroid(d);
        const mid = outerArc.centroid(d);
        const labelX = midAngle < Math.PI ? r - 5 : -(r - 5);
        const labelY = mid[1];
        return [pos, mid, [labelX, labelY]]
          .map((p) => p.join(","))
          .join(" ");
      })
      .style("opacity", (d) => (d.endAngle - d.startAngle < 0.04 ? 0 : 1));

    const textSel = group
      .selectAll<SVGTextElement, ArcDatum>("text.label")
      .data(pieGen(data), (d) => d.data.id);

    textSel.exit().transition().duration(700).attr("opacity", 0).remove();

    textSel
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", "0.35em")
      .merge(textSel)
      .transition()
      .duration(700)
      .attr("opacity", (d) => (d.endAngle - d.startAngle < 0.04 ? 0 : 1))
      .attr("text-anchor", (d) => ((d.startAngle + d.endAngle) / 2 < Math.PI ? "start" : "end"))
      .attr("transform", (d) => {
        const midAngle = (d.startAngle + d.endAngle) / 2;
        const pos = outerArc.centroid(d);
        const labelX = midAngle < Math.PI ? r : -r;
        return `translate(${labelX},${pos[1]})`;
      })
      .text((d) => `${d.data.name} (${d.data.calories})`);
  }, [data]);

  const totalCalories = data.reduce((sum, d) => sum + d.calories, 0);

  return (
    <div className="space-y-4 p-4">
      {jar.length === 0 ? (
        <p className="text-center italic text-slate-500">Your jar is empty - add some fruit!</p>
      ) : (
        <>
          <svg ref={svgRef} width={640} height={380} />
          <p className="text-center italic text-slate-800">
            Your jar contains {totalCalories} calories in total
          </p>
          <ul className="space-y-1 text-sm">
            {jar.map((id, idx) => {
              const fruit = fruitMap[id];
              if (!fruit) return null;
              return (
                <li
                  key={`${id}-${idx}`}
                  className="flex items-center justify-between rounded-md p-2 even:bg-slate-50"
                >
                  {fruit.name}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};