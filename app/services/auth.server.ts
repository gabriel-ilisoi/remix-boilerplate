import { getAuth } from '@clerk/remix/ssr.server'
import { LoaderFunctionArgs } from '@remix-run/node'

export async function getUserId(args: LoaderFunctionArgs) {
  const auth = await getAuth(args)
  console.log(`🚀 ~ getUserId ~ auth:`, auth)
  return auth.userId ? auth.userId : 'GUEST'
}
