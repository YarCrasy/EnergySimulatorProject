import { FaChartLine } from "react-icons/fa";

import { asNumber } from "@models/common";
import type { SimulationPoint, SimulationRun } from "@models/simulation";

import { numberFormat } from "@components/simulations/simulatorConfig";
import "./SimulationPanel.css";

function formatTimestamp(value: string | null | undefined, fallback: number) {
  if (!value) {
    return String(fallback);
  }

  return value.replace("T", " ");
}

export function SimulationPanel({ simulation }: { simulation: SimulationRun | null }) {
  const points = simulation?.points ?? [];
  const chartPoints = points.slice(0, 72);
  const maxValue = Math.max(1, ...chartPoints.flatMap((point) => [asNumber(point.generationW), asNumber(point.consumptionW)]));

  const polyline = (field: keyof Pick<SimulationPoint, "generationW" | "consumptionW" | "balanceW">) =>
    chartPoints
      .map((point, index) => {
        const x = chartPoints.length <= 1 ? 0 : (index / (chartPoints.length - 1)) * 280;
        const y = 120 - ((asNumber(point[field]) + (field === "balanceW" ? maxValue : 0)) / (field === "balanceW" ? maxValue * 2 : maxValue)) * 110;
        return `${x},${Math.max(6, Math.min(116, y))}`;
      })
      .join(" ");

  return (
    <section className="simulation-panel">
      <h2>
        <FaChartLine aria-hidden="true" />
        Resultados
      </h2>
      {!simulation ? (
        <p>Ejecuta una simulacion para ver curvas y tabla.</p>
      ) : (
        <>
          <div className="simulation-overview">
            <div className="result-summary">
              <article className="generation">
                <strong>{numberFormat.format(simulation.totalGenerationKwh ?? 0)}</strong>
                <span>kWh generados</span>
              </article>
              <article className="consumption">
                <strong>{numberFormat.format(simulation.totalConsumptionKwh ?? 0)}</strong>
                <span>kWh consumidos</span>
              </article>
              <article className="balance">
                <strong>{numberFormat.format(simulation.selfSufficiencyPercent ?? 0)}%</strong>
                <span>Autosuficiencia</span>
              </article>
            </div>
            <svg className="simulation-chart" viewBox="0 0 280 128" role="img" aria-label="Curvas de simulacion">
              <polyline points={polyline("generationW")} className="line generation" />
              <polyline points={polyline("consumptionW")} className="line consumption" />
              <polyline points={polyline("balanceW")} className="line balance" />
            </svg>
          </div>
          <div className="simulation-table-wrap">
            <table className="simulation-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Generados</th>
                  <th>Consumidos</th>
                  <th>Balance</th>
                  <th>Nubes</th>
                  <th>Irradiacion</th>
                </tr>
              </thead>
              <tbody>
                {points.slice(0, 48).map((point, index) => (
                  <tr key={point.id ?? `${point.timestamp}-${index}`}>
                    <td>{formatTimestamp(point.timestamp, index)}</td>
                    <td>{numberFormat.format(point.generationW ?? 0)}</td>
                    <td>{numberFormat.format(point.consumptionW ?? 0)}</td>
                    <td>{numberFormat.format(point.balanceW ?? 0)}</td>
                    <td>{numberFormat.format(point.cloudCover ?? 0)}%</td>
                    <td>{numberFormat.format(point.irradiance ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
