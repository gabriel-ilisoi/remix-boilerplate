import { SignIn } from '@clerk/remix'

export default function SignInPage() {
  return (
    <div className='w-[100vw] min-h-[100vh] place-items-center'>
      <h1>Sign In route</h1>
      <SignIn path="/sign-in"/>
    </div>
  )
}
