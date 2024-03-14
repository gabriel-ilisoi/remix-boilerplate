import type { MetaFunction } from '@remix-run/node'
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/remix'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div>
      <h1 className="bg-primary">Welcome to Remix</h1>
      <div>
        <SignedIn>
          <h1>Index route</h1>
          <p>You are signed in!</p>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    </div>
  )
}
