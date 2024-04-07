import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
  useUser,
} from '@clerk/remix'
import { getPosts } from '~/services/post/post.server'
import { getUserId } from '~/services/auth.server'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { useCallback, useEffect } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

function useRevalidate() {
  // We get the navigate function from React Rotuer
  const navigate = useNavigate()
  // And return a function which will navigate to `.` (same URL) and replace it
  return useCallback(
    function revalidate() {
      navigate('.', { replace: true })
    },
    [navigate],
  )
}

export async function loader(args: LoaderFunctionArgs) {
  // const userId = await requireUserId(request);
  // invariant(params.postId, 'await not found');
  // invariant(userId, 'await not found');
  const userId = await getUserId(args)
  console.log(`🚀 ~ loader ~ userId:`, userId)
  const post = await getPosts({ userId })
  console.log(`🚀 ~ loader ~ post:`, post)

  if (!post) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ post, userId })
}

export default function Index() {
  const { user } = useUser()
  const revalidate = useRevalidate()
  useEffect(() => {
    console.log(`Reload route ${ user?.id || 'GUEST' }`)
    revalidate()
  }, [user?.id || 'GUEST'])

  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <h1 className="bg-primary">Welcome to Remix</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
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
