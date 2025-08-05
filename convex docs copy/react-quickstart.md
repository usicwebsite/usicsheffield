React Quickstart
To get setup quickly with Convex and React run

npm create convex@latest


or follow the guide below.

Learn how to query data from Convex in a React app using Vite and
TypeScript

Create a React app
Create a React app using the create vite command.

npm create vite@latest my-app -- --template react-ts

Install the Convex client and server library
To get started, install the convex package which provides a convenient interface for working with Convex from a React app.

Navigate to your app directory and install convex.

cd my-app && npm install convex

Set up a Convex dev deployment
Next, run npx convex dev. This will prompt you to log in with GitHub, create a project, and save your production and deployment URLs.

It will also create a convex/ folder for you to write your backend API functions in. The dev command will then continue running to sync your functions with your dev deployment in the cloud.

npx convex dev

Create sample data for your database
In a new terminal window, create a sampleData.jsonl file with some sample data.

sampleData.jsonl
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}

Add the sample data to your database
Now that your project is ready, add a tasks table with the sample data into your Convex database with the import command.

npx convex import --table tasks sampleData.jsonl

(optional) Define a schema
Add a new file schema.ts in the convex/ folder with a description of your data.

This will declare the types of your data for optional typechecking with TypeScript, and it will be also enforced at runtime.

Alternatively remove the line 'plugin:@typescript-eslint/recommended-requiring-type-checking', from the .eslintrc.cjs file to lower the type checking strictness.

convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});

Expose a database query
Add a new file tasks.ts in the convex/ folder with a query function that loads the data.

Exporting a query function from this file declares an API function named after the file and the export name, api.tasks.get.

convex/tasks.ts
TS
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

Connect the app to your backend
In src/main.tsx, create a ConvexReactClient and pass it to a ConvexProvider wrapping your app.

src/main.tsx
TS
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
);


Display the data in your app
In src/App.tsx, use the useQuery hook to fetch from your api.tasks.get API function and display the data.

src/App.tsx
TS
import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
    </div>
  );
}

export default App;



Start the app
Start the app, open http://localhost:5173/ in a browser, and see the list of tasks.

npm run dev