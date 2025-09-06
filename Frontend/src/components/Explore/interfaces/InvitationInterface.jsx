// src/components/interfaces/InvitationInterface.jsx
import React from 'react';
import { motion } from 'framer-motion';

const InvitationCard = ({ person, type, onAction, theme }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    style={{
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
      borderRadius: '15px',
      padding: '16px',
      marginBottom: '12px',
      minWidth: '0',
      boxShadow: theme === 'dark'
        ? '0 4px 15px rgba(0,0,0,0.3)'
        : '0 4px 15px rgba(0,0,0,0.1)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, minWidth: '0' }}>
        <h4 style={{
          margin: '0 0 4px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: theme === 'dark' ? '#ffffff' : '#000000',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {person.name}
        </h4>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: theme === 'dark' ? '#94a3b8' : '#6b7280',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {person.contact}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAction(person.name)}
        style={{
          padding: '8px 16px',
          borderRadius: '25px',
          background: type === 'send' ? '#10b981' : '#6366f1',
          color: '#ffffff',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: type === 'send'
            ? '0 2px 8px rgba(16, 185, 129, 0.3)'
            : '0 2px 8px rgba(99, 102, 241, 0.3)'
        }}
      >
        {type === 'send' ? 'Send' : 'Accept'}
      </motion.button>
    </div>
  </motion.div>
);

const InvitationSection = ({ title, data, type, onAction, theme, isMobile }) => (
  <div style={{
    flex: 1,
    minHeight: '0',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <h3 style={{
      textAlign: 'center',
      margin: '0 0 20px 0',
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    }}>
      {title}
    </h3>
    <div style={{
      flex: 1,
      overflowY: 'auto',
      paddingRight: '8px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      maxHeight: isMobile ? '200px' : 'auto'
    }}>
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {data.map((person, index) => (
        <InvitationCard
          key={index}
          person={person}
          type={type}
          onAction={onAction}
          theme={theme}
        />
      ))}
    </div>
  </div>
);

const InvitationInterface = ({ theme, isMobile }) => {
  const sendInvitations = [
    { name: 'Alex Johnson', contact: '+1 234 567 8901' },
    { name: 'Sarah Chen', contact: '+1 234 567 8902' },
    { name: 'Mike Davis', contact: '+1 234 567 8903' },
    { name: 'Emily Brown', contact: '+1 234 567 8904' },
    { name: 'David Wilson', contact: '+1 234 567 8905' }
  ];

  const acceptInvitations = [
    { name: 'John Smith', contact: '+1 234 567 8906' },
    { name: 'Lisa Taylor', contact: '+1 234 567 8907' },
    { name: 'Robert Lee', contact: '+1 234 567 8908' },
    { name: 'Maria Garcia', contact: '+1 234 567 8909' },
    { name: 'James Miller', contact: '+1 234 567 8910' }
  ];

  const handleSendInvitation = (name) => {
    console.log(`Sending invitation to ${name}`);
  };

  const handleAcceptInvitation = (name) => {
    console.log(`Accepting invitation from ${name}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '15px',
        padding: '0px'
      }}
    >
      <h2 style={{
        textAlign: 'center',
        margin: '10px 0 10px 0',
        fontSize: isMobile ? '24px' : '32px',
        fontWeight: '800',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}>
        Stay Buddy <span style={{ color: '#6366f1' }}>Invitations</span>
      </h2>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : '40px',
        minHeight: '0',
        paddingBottom: '20px'
      }}>
        <InvitationSection
          title="Send Invitation"
          data={sendInvitations}
          type="send"
          onAction={handleSendInvitation}
          theme={theme}
          isMobile={isMobile}
        />
        {!isMobile && (
          <div style={{
            width: '1px',
            background: theme === 'dark' ? '#475569' : '#e2e8f0',
            margin: '0 10px'
          }} />
        )}
        <InvitationSection
          title="Accept Invitation"
          data={acceptInvitations}
          type="accept"
          onAction={handleAcceptInvitation}
          theme={theme}
          isMobile={isMobile}
        />
      </div>
    </motion.div>
  );
};

export default InvitationInterface;