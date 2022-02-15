import React from 'react'
import { useGoogleAuth } from '../GoogleAuth';

const LoginPage = () => {
  const { signIn } = useGoogleAuth();

  return (
    <div className='login'>
      <div className='login-wrapper'>
        <h1>Login</h1>
        <button onClick={signIn}>Google Login</button>
      </div>
    </div>
  )
}

export default LoginPage