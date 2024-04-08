import { getAuth } from '@clerk/remix/ssr.server'
import { LoaderFunctionArgs } from '@remix-run/node'

export async function getUserId(args: LoaderFunctionArgs) {
  const auth = await getAuth(args)
  const normalizedId = auth.userId ? auth.userId : 'GUEST'
  console.log(`🚀 ~ getUserId ~ auth:`, normalizedId)
  return normalizedId
}
