import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/remix'
import { getPosts } from '~/services/post.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const userId = await requireUserId(request);
  // invariant(params.postId, 'await not found');

  const post = await getPosts({ userId:"1" });
  console.log(`🚀 ~ loader ~ post:`, post)
  
  if (!post) {
      throw new Response('Not Found', { status: 404 });
  }
  return json({ post });
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
