import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { json } from '@remix-run/node'

import { useLoaderData } from '@remix-run/react'
import { FC } from 'react'

import { getUserId } from '~/services/auth.server'
import { getPosts } from '~/services/post.server'

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)
  const posts = await getPosts({userId})
  const data = { userId, posts }
  return json(data)
}

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: 'zz' }, { name: 'description', content: 'zz' }]
}

const ZzRoute: FC = () => {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <h2>ZzRoute</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default ZzRoute
