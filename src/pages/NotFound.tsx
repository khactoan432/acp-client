// src/pages/NotFound.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#212529',
  },
  title: {
    fontSize: '8rem',
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    fontSize: '1.5rem',
    margin: '1rem 0',
  },
  link: {
    fontSize: '1.25rem',
    color: '#007bff',
    textDecoration: 'none',
  },
}

export default NotFound
