import React from 'react';

function ConfirmModal({ isOpen, onConfirm, onCancel, text }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.4)', /* Semi-transparent black background */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999, /* Make it appear above other page content */
      }}>
        <div className="modal-content" style={{
          background: '#fff', /* White background for the modal */
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', /* Box shadow for a raised effect */
          padding: '20px',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '18px',
            margin: '0 0 20px',
          }}>{text}</p>
          <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse'}}>
          <button style={{
              background: '#ff0000', /* Red background color for buttons */
            color: '#fff', /* White text color for buttons */
            padding: '10px 20px',
            margin: '0 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }} onClick={onConfirm}>Yes</button>
          <button style={{
            background: '#ccc', /* Light gray background color for buttons */
            color: '#fff', /* White text color for buttons */
            padding: '10px 20px',
            margin: '0 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        }} onClick={onCancel}>No</button>
        </div>
        </div>
      </div>
      
  );
}

export default ConfirmModal;
