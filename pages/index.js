// import Image from 'next/image'
import { Inter } from 'next/font/google'
import { API, Amplify, Auth } from 'aws-amplify';
// import style from '../styles/globals.css'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
const inter = Inter({ subsets: ['latin'] })
Amplify.configure({
  aws_project_region: 'ap-northeast-1',
  aws_user_pools_id: 'ap-northeast-1_lY4iPP3A0', // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: '7ccef74to4e00q9k38tdn6n1tm', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  // aws_cognito_identity_pool_id:
  //   'us-east-1:f602c14b-0fde-409c-9a7e-0baccbfd87d0', // (optional) - Amazon Cognito Identity Pool ID
  aws_mandatory_sign_in: 'enable',
  aws_cloud_logic_custom: [
    {
      name: 'api-sls',
      endpoint: 'https://26gti1ykv4.execute-api.ap-northeast-1.amazonaws.com/dev',
      region: 'ap-northeast-1'
    }
  ]
})
export default function Home() {
  const getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser()
    const idToken = user.signInUserSession.idToken.jwtToken
    console.log('idToken: ', idToken);
    const requestHeader = {
      headers: { Authorization: idToken },
      body: {
        email: user.attributes.email,
        name: user.attributes.name,
        age: 18
      }// OPTIONAL
    };
    // const data = await API.get('api-sls', '/hello', requestHeader)
    const data = await API.post('api-sls', '/hello', requestHeader)

    console.log('Cognito user object: ', data);
  }
  return (
    <div>

      <Authenticator loginMechanisms={['email']}
        socialProviders={['amazon', 'apple', 'facebook', 'google']}
        signUpAttributes={[
          // 'address',
          // 'birthdate',
          // 'email',
          // 'family_name',
          // 'gender',
          // 'given_name',
          // 'locale',
          // 'middle_name',
          'name',
          // 'nickname',
          // 'phone_number',
          // 'picture',
          // 'preferred_username',
          // 'profile',
          // 'updated_at',
          // 'website',
          // 'zoneinfo',
        ]}>
        {({ signOut, user }) => (
          <main>

            <h1>Hello {user.attributes.name}- {user.attributes.email}</h1>
            <p> Secret message</p>
            <button onClick={getUserData}>Call API</button><br />
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </div>
  )
}
