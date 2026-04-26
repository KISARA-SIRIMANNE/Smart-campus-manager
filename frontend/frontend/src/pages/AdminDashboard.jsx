import { useEffect, useMemo, useState } from "react";
import { getDashboardSummary } from "../api/dashboardApi";
import { fixMissingCategories } from "../api/resourceApi";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fixingResources, setFixingResources] = useState(false);
  const [fixMessage, setFixMessage] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getDashboardSummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleFixMissingCategories = async () => {
    try {
      setFixingResources(true);
      setFixMessage("");
      const res = await fixMissingCategories("Other");
      setFixMessage(
        `✅ Successfully fixed ${res.data.resourcesFixed} resources with missing categories!`
      );
      // Refresh dashboard summary
      const summaryRes = await getDashboardSummary();
      setSummary(summaryRes.data);
      setTimeout(() => setFixMessage(""), 5000);
    } catch (err) {
      console.error("Fix resources error:", err);
      setFixMessage(
        "❌ Failed to fix resources. Please check the console for details."
      );
    } finally {
      setFixingResources(false);
    }
  };

  const stats = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: "Total Tickets",
        value: summary?.tickets?.TOTAL ?? 0,
        subtitle: "All incident tickets",
      },
      {
        title: "Open Tickets",
        value: summary?.tickets?.OPEN ?? 0,
        subtitle: "Need attention",
      },
      {
        title: "Resolved Tickets",
        value: summary?.tickets?.RESOLVED ?? 0,
        subtitle: "Successfully completed",
      },
      {
        title: "Total Bookings",
        value: summary?.bookings?.TOTAL ?? 0,
        subtitle: "All booking requests",
      },
      {
        title: "Pending Bookings",
        value: summary?.bookings?.PENDING ?? 0,
        subtitle: "Waiting for approval",
      },
      {
        title: "Total Resources",
        value: summary?.resources?.TOTAL ?? 0,
        subtitle: "Managed resources",
      },
    ];
  }, [summary]);

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-container">
          <div className="dashboard-loading-card">
            <h2>Loading dashboard...</h2>
            <p>Please wait while summary data is being loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-container">
          <div className="dashboard-error-card">
            <h2>Dashboard Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const openTickets = summary?.tickets?.OPEN ?? 0;
  const totalTickets = summary?.tickets?.TOTAL ?? 0;
  const resolvedTickets = summary?.tickets?.RESOLVED ?? 0;
  const totalBookings = summary?.bookings?.TOTAL ?? 0;
  const pendingBookings = summary?.bookings?.PENDING ?? 0;
  const totalResources = summary?.resources?.TOTAL ?? 0;

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-overlay"></div>

      <div className="admin-dashboard-container">
        <div className="dashboard-hero">
          <div className="dashboard-hero-left">
            <p className="dashboard-badge">Smart Campus Admin Panel</p>
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor tickets, bookings, and resources from one modern control
              center.
            </p>
          </div>

          <div className="dashboard-hero-right">
            <div className="hero-mini-card">
              <span>System Overview</span>
              <h2>
                {(totalTickets || 0) + (totalBookings || 0) + (totalResources || 0)}
              </h2>
              <p>Total tracked items</p>
            </div>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          {stats.map((item, index) => (
            <div className="dashboard-stat-card" key={index}>
              <div className="stat-top-line"></div>
              <h3>{item.title}</h3>
              <p className="stat-value">{item.value}</p>
              <span className="stat-subtitle">{item.subtitle}</span>
            </div>
          ))}
        </div>

        {fixMessage && (
          <div
            className={`fix-message ${fixMessage.includes("✅") ? "success" : "error"}`}
          >
            {fixMessage}
          </div>
        )}

        <button
          className="fix-resources-btn"
          onClick={handleFixMissingCategories}
          disabled={fixingResources}
        >
          {fixingResources
            ? "Fixing Resources..."
            : "🔧 Fix Resources Without Category"}
        </button>

        <div className="dashboard-bottom-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Quick Insights</h2>
              <p>Important summary of current system activity</p>
            </div>

            <div className="insight-list">
              <div className="insight-item">
                <div>
                  <h4>Open Tickets</h4>
                  <p>Tickets currently requiring action from staff or admin.</p>
                </div>
                <span className="insight-number warning">{openTickets}</span>
              </div>

              <div className="insight-item">
                <div>
                  <h4>Resolved Tickets</h4>
                  <p>Tickets that have already been successfully resolved.</p>
                </div>
                <span className="insight-number success">{resolvedTickets}</span>
              </div>

              <div className="insight-item">
                <div>
                  <h4>Pending Bookings</h4>
                  <p>Booking requests waiting for approval or confirmation.</p>
                </div>
                <span className="insight-number info">{pendingBookings}</span>
              </div>

              <div className="insight-item">
                <div>
                  <h4>Total Resources</h4>
                  <p>Resources currently available in the management system.</p>
                </div>
                <span className="insight-number neutral">{totalResources}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Full Summary</h2>
              <p>Raw summary data returned from the backend API</p>
            </div>

            <pre className="summary-json">
              {JSON.stringify(summary, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">Admin controls and overview.</p>
    </div>
  );
};

export default AdminDashboard;
