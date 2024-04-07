import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { json } from '@remix-run/node'

import { useLoaderData, useNavigate } from '@remix-run/react'
import { FC, useCallback, useEffect } from 'react'

import { getUserId } from '~/services/auth.server'
import { getPosts } from '~/services/post/post.server'

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
  const userId = await getUserId(args)
  const posts = await getPosts({ userId })
  const data = { userId, posts }
  return json(data)
}

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: 'zz' }, { name: 'description', content: 'zz' }]
}

const ZzRoute: FC = () => {
  const revalidate = useRevalidate()
  const data = useLoaderData<typeof loader>()
  useEffect(() => {
    console.log('Reload route')
    revalidate()
  }, [])

  return (
    <>
      <h2>ZzRoute</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default ZzRoute
