Convex React
Convex React is the client library enabling your React application to interact with your Convex backend. It allows your frontend code to:

Call your queries, mutations and actions
Upload and display files from File Storage
Authenticate users using Authentication
Implement full text Search over your data
The Convex React client is open source and available on GitHub.

Follow the React Quickstart to get started with React using Vite.

Installation
Convex React is part of the convex npm package:

npm install convex

Connecting to a backend
The ConvexReactClient maintains a connection to your Convex backend, and is used by the React hooks described below to call your functions.

First you need to create an instance of the client by giving it your backend deployment URL. See Configuring Deployment URL on how to pass in the right value:

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient("https://<your domain here>.convex.cloud");

And then you make the client available to your app by passing it in to a ConvexProvider wrapping your component tree:

reactDOMRoot.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
);

Fetching data
Your React app fetches data using the useQuery React hook by calling your queries via an api object.

The npx convex dev command generates this api object for you in the convex/_generated/api.js module to provide better autocompletion in JavaScript and end-to-end type safety in TypeScript:

src/App.tsx
TS
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const data = useQuery(api.functions.myQuery);
  return data ?? "Loading...";
}

The useQuery hook returns undefined while the data is first loading and afterwards the return value of your query.

Query arguments
Arguments to your query follow the query name:

src/App.tsx
TS
export function App() {
  const a = "Hello world";
  const b = 4;
  const data = useQuery(api.functions.myQuery, { a, b });
  //...
}

Reactivity
The useQuery hook makes your app automatically reactive: when the underlying data changes in your database, your component rerenders with the new query result.

The first time the hook is used it creates a subscription to your backend for a given query and any arguments you pass in. When your component unmounts, the subscription is canceled.

Consistency
Convex React ensures that your application always renders a consistent view of the query results based on a single state of the underlying database.

Imagine a mutation changes some data in the database, and that 2 different useQuery call sites rely on this data. Your app will never render in an inconsistent state where only one of the useQuery call sites reflects the new data.

Paginating queries
See Paginating within React Components.

Skipping queries
Advanced: Loading a query conditionally
One-off queries
Advanced: Fetching a query from a callback
Editing data
Your React app edits data using the useMutation React hook by calling your mutations.

The convex dev command generates this api object for you in the convex/_generated/api.js module to provide better autocompletion in JavaScript and end-to-end type safety in TypeScript:

src/App.tsx
TS
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const doSomething = useMutation(api.functions.doSomething);
  return <button onClick={() => doSomething()}>Click me</button>;
}

The hook returns an async function which performs the call to the mutation.

Mutation arguments
Arguments to your mutation are passed to the async function returned from useMutation:

src/App.tsx
TS
export function App() {
  const a = "Hello world";
  const b = 4;
  const doSomething = useMutation(api.functions.doSomething);
  return <button onClick={() => doSomething({ a, b })}>Click me</button>;
}

Mutation response and error handling
The mutation can optionally return a value or throw errors, which you can await:

src/App.tsx
TS
export function App() {
  const doSomething = useMutation(api.functions.doSomething);
  const onClick = () => {
    async function callBackend() {
      try {
        const result = await doSomething();
      } catch (error) {
        console.error(error);
      }
      console.log(result);
    }
    void callBackend();
  };
  return <button onClick={onClick}>Click me</button>;
}

Or handle as a Promise:

src/App.tsx
TS
export function App() {
  const doSomething = useMutation(api.functions.doSomething);
  const onClick = () => {
    doSomething()
      .catch((error) => {
        console.error(error);
      })
      .then((result) => {
        console.log(result);
      });
  };
  return <button onClick={onClick}>Click me</button>;
}

Learn more about Error Handling in functions.

Retries
Convex React automatically retries mutations until they are confirmed to have been written to the database. The Convex backend ensures that despite multiple retries, every mutation call only executes once.

Additionally, Convex React will warn users if they try to close their browser tab while there are outstanding mutations. This means that when you call a Convex mutation, you can be sure that the user's edits won't be lost.

Optimistic updates
Convex queries are fully reactive, so all query results will be automatically updated after a mutation. Sometimes you may want to update the UI before the mutation changes propagate back to the client. To accomplish this, you can configure an optimistic update to execute as part of your mutation.

Optimistic updates are temporary, local changes to your query results which are used to make your app more responsive.

See Optimistic Updates on how to configure them.

Calling third-party APIs
Your React app can read data, call third-party services, and write data with a single backend call using the useAction React hook by calling your actions.

Like useQuery and useMutation, this hook is used with the api object generated for you in the convex/_generated/api.js module to provide better autocompletion in JavaScript and end-to-end type safety in TypeScript:

src/App.tsx
TS
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const doSomeAction = useAction(api.functions.doSomeAction);
  return <button onClick={() => doSomeAction()}>Click me</button>;
}

The hook returns an async function which performs the call to the action.

Action arguments
Action arguments work exactly the same as mutation arguments.

Action response and error handling
Action response and error handling work exactly the same as mutation response and error handling.

Actions do not support automatic retries or optimistic updates.

Under the hood
The ConvexReactClient connects to your Convex deployment by creating a WebSocket. The WebSocket provides a 2-way communication channel over TCP. This allows Convex to push new query results reactively to the client without the client needing to poll for updates.

If the internet connection drops, the client will handle reconnecting and re-establishing the Convex session automatically.

Configuring Deployment URL
When connecting to your backend it's important to correctly configure the deployment URL.

Create a Convex project
The first time you run

npx convex dev

in your project directory you will create a new Convex project.

Your new project includes two deployments: production and development. The development deployment's URL will be saved in .env.local or .env file, depending on the frontend framework or bundler you're using.

You can find the URLs of all deployments in a project by visiting the deployment settings on your Convex dashboard.

Configure the client
Construct a Convex React client by passing in the URL of the Convex deployment. There should generally be a single Convex client in a frontend application.

src/index.js
import { ConvexProvider, ConvexReactClient } from "convex/react";

const deploymentURL = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(deploymentURL);

While this URL can be hardcoded, it's convenient to use an environment variable to determine which deployment the client should connect to.

Use an environment variable name accessible from your client code according to the frontend framework or bundler you're using.

Choosing environment variable names
To avoid unintentionally exposing secret environment variables in frontend code, many bundlers require environment variables referenced in frontend code to use a specific prefix.

Vite requires environment variables used in frontend code start with VITE_, so VITE_CONVEX_URL is a good name.

Create React App requires environment variables used in frontend code to begin with REACT_APP_, so the code above uses REACT_APP_CONVEX_URL.

Next.js requires them to begin with NEXT_PUBLIC_, so NEXT_PUBLIC_CONVEX_URL is a good name.

Bundlers provide different ways to access these variables too: while Vite uses import.meta.env.VARIABLE_NAME, many other tools like Next.js use the Node.js-like process.env.VARIABLE_NAME

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

.env files are a common way to wire up different environment variable values in development and production environments. npx convex dev will save the deployment URL to the corresponding .env file, while trying to infer which bundler your project uses.

.env.local
NEXT_PUBLIC_CONVEX_URL=https://guiltless-dog-960.convex.cloud

# examples of other environment variables that might be passed to the frontend
NEXT_PUBLIC_SENTRY_DSN=https://123abc@o123.ingest.sentry.io/1234
NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT_SIDE_ID=01234567890abcdef

Your backend functions can use environment variables configured on your dashboard. They do not source values from .env files.

