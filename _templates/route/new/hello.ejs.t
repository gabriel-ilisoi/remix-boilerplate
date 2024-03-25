---
to: app/routes/<%= name %>.tsx
---
import type {
    <%= features.includes('action')? 'ActionFunction,': null %>
    <%= features.includes('links')? 'LinkDescriptor, LinksFunction,': null %>
    <%= features.includes('loader')? 'LoaderFunctionArgs,': null %>
    <%= features.includes('meta')? 'MetaFunction,': null %>    
} from "@remix-run/node"

import {
    json,
    redirect
} from "@remix-run/node"

import {useParams} from "@remix-run/react"
import {useLoaderData} from "@remix-run/react"
import {FC} from "react"

import { getUserId } from '~/services/auth.server'

 <% if (features.includes('links')) { %>
export const links: LinksFunction = () => {
    const links: LinkDescriptor[] = []
    return links
}
<% } %>

<% if (features.includes('meta')) { %>
export const meta: MetaFunction<%-(features.includes('loader'))?'<typeof loader>':'' %> = () => {
  return [
    { title: "<%= name %>" },
    { name: 'description', content: "<%= name %>" },
  ]
}
<% } %>

<% if (features.includes('loader')) { %>
export async function loader(args: LoaderFunctionArgs) {
const {request, params} = args   
const userId = await getUserId(args)
    const data = {userId}
    return json(data)
}
<% } %>

<% if (features.includes('action')) { %>
export const action: ActionFunction = async ({request, params}) => {
    return redirect("/")
}
<% } %>

<% if (features.includes('error')) { %>
export const ErrorBoundary = ({error}) => {
    console.log(error)
    const params = useParams()
    return <p>Something went wrong.</p>
}
<% } %>

const <%= h.changeCase.pascal(name) %>Route: FC = () => {
<% if (features.includes('loader')) { %>
    const data = useLoaderData<typeof loader>()
<% } %>
    return (<>
        <h2><%= h.changeCase.pascal(name) %>Route</h2>
<% if (features.includes('loader')) { %>
        <pre>{JSON.stringify(data, null, 2)}</pre>
<% } %>
    </>)    
}


export default <%= h.changeCase.pascal(name) %>Route
