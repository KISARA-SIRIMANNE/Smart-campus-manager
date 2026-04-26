import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getResources } from "../api/resourceApi";
import "./ResourceStatistics.css";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function ResourceStatistics() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResourceStats = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getResources();
        const resources = res.data || [];

        // Group resources by category
        const categoryCount = {};
        resources.forEach((resource) => {
          const category = resource.category || "Other";
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        // Prepare chart data
        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);

        setChartData({
          labels: categories,
          datasets: [
            {
              label: "Resources by Category",
              data: counts,
              backgroundColor: [
                "rgba(37, 99, 235, 0.6)",
                "rgba(59, 130, 246, 0.6)",
                "rgba(96, 165, 250, 0.6)",
                "rgba(147, 197, 253, 0.6)",
                "rgba(191, 219, 254, 0.6)",
                "rgba(30, 58, 138, 0.6)",
                "rgba(29, 78, 216, 0.6)",
                "rgba(37, 99, 235, 0.8)",
              ],
              borderColor: [
                "rgba(37, 99, 235, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(96, 165, 250, 1)",
                "rgba(147, 197, 253, 1)",
                "rgba(191, 219, 254, 1)",
                "rgba(30, 58, 138, 1)",
                "rgba(29, 78, 216, 1)",
                "rgba(37, 99, 235, 1)",
              ],
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        console.error("Resource stats fetch error:", err);
        setError("Failed to load resource statistics");
      } finally {
        setLoading(false);
      }
    };

    loadResourceStats();
  }, []);

  if (loading) {
    return (
      <div className="resource-stats-card">
        <h2>Resources by Category</h2>
        <p className="loading-text">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resource-stats-card">
        <h2>Resources by Category</h2>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="resource-stats-card">
      <div className="stats-header">
        <h2>Resources by Category</h2>
        <p className="stats-subtitle">Visual breakdown of resources across all categories</p>
      </div>
      {chartData && (
        <div className="chart-container">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                  position: "right",
                  labels: {
                    color: "#1f2937",
                    font: {
                      size: 14,
                      weight: "500",
                    },
                    padding: 20,
                  },
                },
                title: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: 12,
                  titleFont: {
                    size: 14,
                  },
                  bodyFont: {
                    size: 13,
                  },
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
