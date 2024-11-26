import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../redux/slices/authSlice'
import { useDispatch } from 'react-redux'
import { postData } from "../axios"

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await postData('/api/auth/login', { email: username, password: password })
      if (response.token) {
        console.log("logining: ", response);

        // Điều hướng tới trang tương ứng
        if (response.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (response.user.role === 'TEACHER') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/')
        }
        dispatch(setAuth({ user: response.user, access_token: response.token  }))
      }
    } catch (error) {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{width: "100%"}}>
        <div style={styles.container}>
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
            {error && <p style={styles.error}>{error}</p>}
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            />
            <button type="submit" style={styles.button}>
            Login
            </button>
        </form>
        </div>
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
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '300px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
}

export default Login
