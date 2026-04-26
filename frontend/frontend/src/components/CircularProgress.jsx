export default function CircularProgress({ percentage, label, color = "#3b82f6" }) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div style={{ marginTop: "-85px", position: "relative", zIndex: 2 }}>
        <p style={{ fontSize: "24px", fontWeight: "bold", color, margin: "0" }}>
          {Math.round(percentage)}%
        </p>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
          {label}
        </p>
      </div>
    </div>
  );
}
