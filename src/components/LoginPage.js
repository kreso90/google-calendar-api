import React, {useEffect, useState} from 'react'
import { gapi } from 'gapi-script'
import { useGoogleAuth } from '../GoogleAuth';
const LoginPage = () => {
  const { signIn } = useGoogleAuth();

  const { isSignedIn } = useGoogleAuth();
  const [name, setName] = useState([])
  
  return (
    <div>LoginPage
    <button onClick={signIn}>Login</button>
   
   
    </div>
  )
}

export default LoginPage