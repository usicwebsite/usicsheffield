Next.js
Next.js is a React web development framework. When used with Convex, Next.js provides:

File-system based routing
Fast refresh in development
Font and image optimization
and more!

This page covers the App Router variant of Next.js. Alternatively see the Pages Router version of this page.

Getting started
Follow the Next.js Quickstart to add Convex to a new or existing Next.js project.

Adding authentication
Client-side only
The simplest way to add user authentication to your Next.js app is to follow our React-based authentication guides for Clerk or Auth0, inside your app/ConvexClientProvider.tsx file. For example this is what the file would look like for Auth0:

app/ConvexClientProvider.tsx
TS
"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri:
          typeof window === "undefined" ? undefined : window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}

Custom loading and logged out views can be built with the helper Authenticated, Unauthenticated and AuthLoading components from convex/react, see the Convex Next.js demo for an example.

If only some routes of your app require login, the same helpers can be used directly in page components that do require login instead of being shared between all pages from app/ConvexClientProvider.tsx. Share a single ConvexReactClient instance between pages to avoid needing to reconnect to Convex on client-side page navigation.

Server and client side
To access user information or load Convex data requiring ctx.auth from Server Components, Server Actions, or Route Handlers you need to use the Next.js specific SDKs provided by Clerk and Auth0.

Additional .env.local configuration is needed for these hybrid SDKs.

Clerk
For an example of using Convex and with Next.js 15, run

npm create convex@latest -- -t nextjs-clerk


Otherwise, follow the Clerk Next.js quickstart, a guide from Clerk that includes steps for adding NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to the .env.local file. In Next.js 15, the <ClerkProvider> component imported from the @clerk/nextjs v6 package functions as both a client and a server context provider so you probably won't need the ClerkProvider from @clerk/clerk-react.

Auth0
See the Auth0 Next.js guide.

Other providers
Convex uses JWT identity tokens on the client for live query subscriptions and running mutations and actions, and on the Next.js backend for running queries, mutations, and actions in server components and API routes.

Obtain the appropriate OpenID Identity JWT in both locations and you should be able to use any auth provider. See Custom Auth for more.

Server rendering (SSR)
Next.js automatically renders both Client and Server Components on the server during the initial page load.

To keep your UI automatically reactive to changes in your Convex database it needs to use Client Components. The ConvexReactClient will maintain a connection to your deployment and will get updates as data changes and that must happen on the client.

See the dedicated Server Rendering page for more details about preloading data for Client Components, fetching data and authentication in Server Components, and implementing Route Handlers.

Next.js Server Rendering
Next.js automatically renders both Client and Server Components on the server during the initial page load.

By default Client Components will not wait for Convex data to be loaded, and your UI will render in a "loading" state. Read on to learn how to preload data during server rendering and how to interact with the Convex deployment from Next.js server-side.

Example: Next.js App Router

This pages covers the App Router variant of Next.js.

Next.js Server Rendering support is in beta
Next.js Server Rendering support is currently a beta feature. If you have feedback or feature requests, let us know on Discord!

Preloading data for Client Components
If you want to preload data from Convex and leverage Next.js server rendering, but still retain reactivity after the initial page load, use preloadQuery from convex/nextjs.

In a Server Component call preloadQuery:

app/TasksWrapper.tsx
TS
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Tasks } from "./Tasks";

export async function TasksWrapper() {
  const preloadedTasks = await preloadQuery(api.tasks.list, {
    list: "default",
  });
  return <Tasks preloadedTasks={preloadedTasks} />;
}

In a Client Component call usePreloadedQuery:

app/TasksWrapper.tsx
TS
"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Tasks(props: {
  preloadedTasks: Preloaded<typeof api.tasks.list>;
}) {
  const tasks = usePreloadedQuery(props.preloadedTasks);
  // render `tasks`...
  return <div>...</div>;
}

preloadQuery takes three arguments:

The query reference
Optionally the arguments object passed to the query
Optionally a NextjsOptions object
preloadQuery uses the cache: 'no-store' policy so any Server Components using it will not be eligible for static rendering.

Using the query result
preloadQuery returns an opaque Preloaded payload that should be passed through to usePreloadedQuery. If you want to use the return value of the query, perhaps to decide whether to even render the Client Component, you can pass the Preloaded payload to the preloadedQueryResult function.

Using Convex to render Server Components
If you need Convex data on the server, you can load data from Convex in your Server Components, but it will be non-reactive. To do this, use the fetchQuery function from convex/nextjs:

app/StaticTasks.tsx
TS
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function StaticTasks() {
  const tasks = await fetchQuery(api.tasks.list, { list: "default" });
  // render `tasks`...
  return <div>...</div>;
}

Server Actions and Route Handlers
Next.js supports building HTTP request handling routes, similar to Convex HTTP Actions. You can use Convex from a Server Action or a Route Handler as you would any other database service.

To load and edit Convex data in your Server Action or Route Handler, you can use the fetchQuery, fetchMutation and fetchAction functions.

Here's an example inline Server Action calling a Convex mutation:

app/example/page.tsx
TS
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { revalidatePath } from "next/cache";

export default async function PureServerPage() {
  const tasks = await fetchQuery(api.tasks.list, { list: "default" });
  async function createTask(formData: FormData) {
    "use server";

    await fetchMutation(api.tasks.create, {
      text: formData.get("text") as string,
    });
    revalidatePath("/example");
  }
  // render tasks and task creation form
  return <form action={createTask}>...</form>;
}

Here's an example Route Handler calling a Convex mutation:

app/api/route.ts
TS
import { NextResponse } from "next/server";
// Hack for TypeScript before 5.2
const Response = NextResponse;

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function POST(request: Request) {
  const args = await request.json();
  await fetchMutation(api.tasks.create, { text: args.text });
  return Response.json({ success: true });
}

Server-side authentication
To make authenticated requests to Convex during server rendering, pass a JWT token to preloadQuery or fetchQuery in the third options argument:

app/TasksWrapper.tsx
TS
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Tasks } from "./Tasks";

export async function TasksWrapper() {
  const token = await getAuthToken();
  const preloadedTasks = await preloadQuery(
    api.tasks.list,
    { list: "default" },
    { token },
  );
  return <Tasks preloadedTasks={preloadedTasks} />;
}

The implementation of getAuthToken depends on your authentication provider.

Clerk
Auth0
app/auth.ts
TS
import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
  return (await (await auth()).getToken({ template: "convex" })) ?? undefined;
}

Configuring Convex deployment URL
Convex hooks used by Client Components are configured via the ConvexReactClient constructor, as shown in the Next.js Quickstart.

To use preloadQuery, fetchQuery, fetchMutation and fetchAction in Server Components, Server Actions and Route Handlers you must either:

have NEXT_PUBLIC_CONVEX_URL environment variable set to the Convex deployment URL
or pass the url option in the third argument to preloadQuery, fetchQuery, fetchMutation or fetchAction
Consistency
preloadQuery and fetchQuery use the ConvexHTTPClient under the hood. This client is stateless. This means that two calls to preloadQuery are not guaranteed to return consistent data based on the same database state. This is similar to more traditional databases, but is different from the guaranteed consistency provided by the ConvexReactClient.

To prevent rendering an inconsistent UI avoid using multiple preloadQuery calls on the same page.

Next.js Pages Router
This pages covers the Pages Router variant of Next.js. Alternatively see the App Router version of this page.

Getting started
Follow the Next.js Pages Router Quickstart to add Convex to a new or existing Next.js project.

Adding client-side authentication
The simplest approach to authentication in Next.js is to keep it client-side.

For example Auth0 describes this approach in Next.js Authentication with Auth0 guide, describing it in "Next.js Static Site Approach" and "Serverless with the user on the frontend".

To require login on every page of your application you can add logic to _app.jsx to conditionally render page content, blocking it until the user is logged in.

If you're using Auth0, the helper component ConvexProviderWithAuth0 can be imported from convex/react-auth0.

pages/_app.jsx
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";
import { AppProps } from "next/app";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri:
          typeof window === "undefined" ? undefined : window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <Component {...pageProps} />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}

Custom loading and logged out views can be built with the helper Authenticated, Unauthenticated and AuthLoading components from convex/react, see the Convex Next.js demo for an example.

If only some routes of your app require login, the same helpers can be used directly in page components that do require login instead of being shared between all pages from pages/_app.jsx. Share a single ConvexReactClient instance between pages to avoid needing to reconnect to Convex on client-side page navigation.

Read more about authenticating users with Convex in Authentication.

API routes
Next.js supports building HTTP request handling routes, similar to Convex HTTP Actions. Using Next.js routes might be helpful if you need to use a dependency not supported by the Convex default runtime.

To build an API route add a file to the pages/api directory.

To load and edit Convex data in your endpoints, use the fetchQuery function from convex/nextjs:

pages/api/clicks.js
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export const count = async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const clicks = await fetchQuery(api.counter.get, { counterName: "clicks" });
  res.status(200).json({ clicks });
};

Server-side rendering
Consider client-side rendering Convex data when using Next.js. Data from Convex is fully reactive so Convex needs a connection from your deployment to the browser in order to push updates as data changes.

You can of course load data from Convex in getStaticProps or getServerSideProps, but it will be non-reactive. To do this, use the fetchQuery function to call query functions just like you would in API routes.

To make authenticated requests to Convex during server-side rendering, you need authentication info present server-side. Auth0 describes this approach in Serverless with the user on the backend. When server-side rendering, pass the authentication token as token to the third argument of fetchQuery.

To preload data on server side before rendering a reactive query on the client side use preloadQuery. Check out the App Router version of these docs for more details.