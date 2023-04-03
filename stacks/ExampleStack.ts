import { Api, StaticSite, StackContext, Table, WebSocketApi } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
	// Create the table
	const table = new Table(stack, "WSConnections", {
		fields: {
			id: "string",
			clientCode: "string",
			clientId: "string"
		},
		primaryIndex: { partitionKey: "id" },
	});
	// Create the HTTP API
	const api = new Api(stack, "Api", {
		defaults: {
			function: {
				// Bind the table name to our API
				bind: [table],
			},
		},
		routes: {
			"POST /": "packages/functions/src/lambda.main",
		},
	});
	// Create WS API
	const wsApi = new WebSocketApi(stack, "wsApi", {
		defaults: {
			function: {
				bind: [table],
			},
		},
		routes: {
			$connect: "packages/functions/src/connect.main",
			$disconnect: "packages/functions/src/disconnect.main",
			sendmessage: "packages/functions/src/sendMessage.main",
			peermessage: "packages/functions/src/peerMessage.main"
		},
	});

	// Show the URLs in the output
	// Deploy our Svelte app
	const site = new StaticSite(stack, "SvelteJSSite", {
		path: "packages/frontend",
		buildCommand: "npm run build",
		buildOutput: "dist",
		environment: {
			// Pass in the API endpoint to our app
			VITE_APP_API_URL: api.url,
			VITE_APP_WS_API_URL: wsApi.url,
		},
	});

	// Show the URLs in the output
	stack.addOutputs({
		SiteUrl: site.url || "http://localhost:5173",
		ApiEndpoint: api.url,
		wsApiEndpoint: wsApi.url
	});
}
