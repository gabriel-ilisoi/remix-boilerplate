import { SignIn } from '@clerk/remix'

export default function SignInPage() {
  return (
    <div className='flex flex-col place-items-center py-8'>
        {/* <h1 className='mb-8'>Sign In route</h1> */}
        <SignIn path="/sign-in"/>
    </div>
  )
}
