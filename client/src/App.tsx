import { GoogleLogin } from '@react-oauth/google'

export default function App () {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('SUCCESS RESPONSE:', credentialResponse)
  }

  const handleGoogleFailure = () => {
    console.log('an error occured')
  }

  return (
    <>
      log in:
      <GoogleLogin
        onSuccess={credentialResponse => {
          handleGoogleSuccess(credentialResponse)
        }}
        onError={() => {
          handleGoogleFailure()
        }}
      />
    </>
  )
}
