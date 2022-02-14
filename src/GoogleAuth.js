import React from 'react'
import { useGoogleLogin } from 'react-use-googlelogin'

const GoogleAuthContext = React.createContext()

export const GoogleAuthProvider = ({children}) => {
  
  const googleAuth = useGoogleLogin({
    clientId: "880782189600-n43tfp2sc95sdc5fjg59fr88h4vrsmvf.apps.googleusercontent.com", 
  })
  return (
    <GoogleAuthContext.Provider value={googleAuth}>
      {children}
    </GoogleAuthContext.Provider>
  )
}

export const useGoogleAuth = () => React.useContext(GoogleAuthContext)