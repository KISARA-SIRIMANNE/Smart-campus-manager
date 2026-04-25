import React, { useState } from "react";
import "./RejectionModal.css";

export default function RejectionModal({ isOpen, itemType, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="rejection-modal-overlay">
      <div className="rejection-modal">
        <div className="rejection-modal-header">
          <h2>Reject {itemType}</h2>
          <button className="close-btn" onClick={handleCancel}>✕</button>
        </div>

        <div className="rejection-modal-body">
          <label htmlFor="rejection-reason">Rejection Reason *</label>
          <textarea
            id="rejection-reason"
            className="rejection-textarea"
            placeholder="Please provide a detailed rejection reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
          />
        </div>

        <div className="rejection-modal-footer">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
