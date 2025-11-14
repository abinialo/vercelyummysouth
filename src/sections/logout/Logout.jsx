import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px 25px",
              borderRadius: "10px",
              textAlign: "center",
              width: "340px",
              height: "160px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h3 style={{ marginBottom: "20px", fontSize: "18px", color: "#333" }}>
              Are you sure you want to logout?
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px", // reduced gap between buttons
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  background: "#083814",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  minWidth: "90px",
                }}
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: "gray",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  minWidth: "90px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
