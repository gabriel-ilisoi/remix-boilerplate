// @see https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import stylesheet from '~/tailwind.css?url'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { LinksFunction, LoaderFunction } from '@remix-run/node'
import { ClerkApp, ClerkErrorBoundary } from '@clerk/remix'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
export const loader: LoaderFunction = args => rootAuthLoader(args)


export const ErrorBoundary = ClerkErrorBoundary();

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function RemixApp() {
  return <Outlet />
}

const App = ClerkApp(RemixApp)
export default App
