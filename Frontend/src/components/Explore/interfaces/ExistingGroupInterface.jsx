import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const GroupCard = ({ group, theme }) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: theme === "dark" ? "#1e293b" : "#f0f4f9",
        border: theme === "dark" ? "1px solid #475569" : "1px solid #c9d6e4",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          theme === "dark"
            ? "0 4px 15px rgba(0,0,0,0.3)"
            : "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: theme === "dark" ? "#ffffff" : "#374151",
              margin: 0,
            }}
          >
            {group.name}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: theme === "dark" ? "#94a3b8" : "#6b7280",
              margin: "4px 0 0 0",
            }}
          >
            {group.members.length} Members
          </p>
          <p
            style={{
              fontSize: "13px",
              margin: "4px 0",
              color: group.ISactive ? "green" : "red",
              fontWeight: "500",
            }}
          >
            Status: {group.ISactive ? "Active" : "Inactive"}
          </p>
          <p
            style={{
              fontSize: "12px",
              margin: "2px 0",
              color: theme === "dark" ? "#cbd5e1" : "#475569",
            }}
          >
            
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMembers(!showMembers)}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {showMembers ? "Hide Members" : "Show Members"}
        </motion.button>
      </div>

      {/* Members List */}
      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden", marginTop: "16px" }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {group.members.map((member, index) => (
                <motion.li
                  key={member.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    fontSize: "14px",
                    color: theme === "dark" ? "#e2e8f0" : "#374151",
                    padding: "6px 0",
                  }}
                >
                  <strong>{member.name}</strong> ({member.phone})
                  {group.admin === member.id && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "12px",
                        color: "#6366f1",
                        fontWeight: "600",
                      }}
                    >
                      [Admin]
                    </span>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExistingGroupInterface = ({ theme, onBackToMain, isMobile }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/see-groups", {
          withCredentials: true,
        });
        console.log("Fetched groups:", res.data.groups);
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "25px",
        padding: isMobile ? "20px" : "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 20,
      }}
    >
       <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToMain}
        style={{
          position: "absolute",
          top: isMobile ? "10px" : "20px",
          left: isMobile ? "10px" : "20px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: theme === "dark" ? "#374151" : "#f3f4f6",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: theme === "dark" ? "#ffffff" : "#374151",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          zIndex: 30,
        }}
      >
        ←
      </motion.button>
      <h2
        style={{
          marginBottom: "20px",
          fontWeight: "800",
          color: theme === "dark" ? "#f8fafc" : "#111827",
        }}
      >
        Existing Groups
      </h2>
      <div
        className="hide-scrollbar"
        style={{
          width: "100%",
          maxWidth: "700px",
          flex: 1,
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >
        {groups.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>
            You are not part of any groups.
          </p>
        ) : (
          groups.map((group) => (
            <GroupCard key={group.id} group={group} theme={theme} />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ExistingGroupInterface;