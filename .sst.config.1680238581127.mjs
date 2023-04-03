import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/ExampleStack.ts
import { Api, StaticSite, Table, WebSocketApi } from "sst/constructs";
function ExampleStack({ stack }) {
  const table = new Table(stack, "WSConnections", {
    fields: {
      id: "string",
      clientCode: "string",
      clientId: "string"
    },
    primaryIndex: { partitionKey: "id" }
  });
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [table]
      }
    },
    routes: {
      "POST /": "packages/functions/src/lambda.main"
    }
  });
  const wsApi = new WebSocketApi(stack, "wsApi", {
    defaults: {
      function: {
        bind: [table]
      }
    },
    routes: {
      $connect: "packages/functions/src/connect.main",
      $disconnect: "packages/functions/src/disconnect.main",
      sendmessage: "packages/functions/src/sendMessage.main",
      peermessage: "packages/functions/src/peerMessage.main"
    }
  });
  const site = new StaticSite(stack, "SvelteJSSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_WS_API_URL: wsApi.url
    }
  });
  stack.addOutputs({
    SiteUrl: site.url || "http://localhost:5173",
    ApiEndpoint: api.url,
    wsApiEndpoint: wsApi.url
  });
}
__name(ExampleStack, "ExampleStack");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "svelte-app",
      region: "eu-north-1"
    };
  },
  stacks(app) {
    app.stack(ExampleStack);
  }
};
export {
  sst_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RhY2tzL0V4YW1wbGVTdGFjay50cyIsICJzc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBcGksIFN0YXRpY1NpdGUsIFN0YWNrQ29udGV4dCwgVGFibGUsIFdlYlNvY2tldEFwaSB9IGZyb20gXCJzc3QvY29uc3RydWN0c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gRXhhbXBsZVN0YWNrKHsgc3RhY2sgfTogU3RhY2tDb250ZXh0KSB7XG5cdC8vIENyZWF0ZSB0aGUgdGFibGVcblx0Y29uc3QgdGFibGUgPSBuZXcgVGFibGUoc3RhY2ssIFwiV1NDb25uZWN0aW9uc1wiLCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRpZDogXCJzdHJpbmdcIixcblx0XHRcdGNsaWVudENvZGU6IFwic3RyaW5nXCIsXG5cdFx0XHRjbGllbnRJZDogXCJzdHJpbmdcIlxuXHRcdH0sXG5cdFx0cHJpbWFyeUluZGV4OiB7IHBhcnRpdGlvbktleTogXCJpZFwiIH0sXG5cdH0pO1xuXHQvLyBDcmVhdGUgdGhlIEhUVFAgQVBJXG5cdGNvbnN0IGFwaSA9IG5ldyBBcGkoc3RhY2ssIFwiQXBpXCIsIHtcblx0XHRkZWZhdWx0czoge1xuXHRcdFx0ZnVuY3Rpb246IHtcblx0XHRcdFx0Ly8gQmluZCB0aGUgdGFibGUgbmFtZSB0byBvdXIgQVBJXG5cdFx0XHRcdGJpbmQ6IFt0YWJsZV0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0cm91dGVzOiB7XG5cdFx0XHRcIlBPU1QgL1wiOiBcInBhY2thZ2VzL2Z1bmN0aW9ucy9zcmMvbGFtYmRhLm1haW5cIixcblx0XHR9LFxuXHR9KTtcblx0Ly8gQ3JlYXRlIFdTIEFQSVxuXHRjb25zdCB3c0FwaSA9IG5ldyBXZWJTb2NrZXRBcGkoc3RhY2ssIFwid3NBcGlcIiwge1xuXHRcdGRlZmF1bHRzOiB7XG5cdFx0XHRmdW5jdGlvbjoge1xuXHRcdFx0XHRiaW5kOiBbdGFibGVdLFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdHJvdXRlczoge1xuXHRcdFx0JGNvbm5lY3Q6IFwicGFja2FnZXMvZnVuY3Rpb25zL3NyYy9jb25uZWN0Lm1haW5cIixcblx0XHRcdCRkaXNjb25uZWN0OiBcInBhY2thZ2VzL2Z1bmN0aW9ucy9zcmMvZGlzY29ubmVjdC5tYWluXCIsXG5cdFx0XHRzZW5kbWVzc2FnZTogXCJwYWNrYWdlcy9mdW5jdGlvbnMvc3JjL3NlbmRNZXNzYWdlLm1haW5cIixcblx0XHRcdHBlZXJtZXNzYWdlOiBcInBhY2thZ2VzL2Z1bmN0aW9ucy9zcmMvcGVlck1lc3NhZ2UubWFpblwiXG5cdFx0fSxcblx0fSk7XG5cblx0Ly8gU2hvdyB0aGUgVVJMcyBpbiB0aGUgb3V0cHV0XG5cdC8vIERlcGxveSBvdXIgU3ZlbHRlIGFwcFxuXHRjb25zdCBzaXRlID0gbmV3IFN0YXRpY1NpdGUoc3RhY2ssIFwiU3ZlbHRlSlNTaXRlXCIsIHtcblx0XHRwYXRoOiBcInBhY2thZ2VzL2Zyb250ZW5kXCIsXG5cdFx0YnVpbGRDb21tYW5kOiBcIm5wbSBydW4gYnVpbGRcIixcblx0XHRidWlsZE91dHB1dDogXCJkaXN0XCIsXG5cdFx0ZW52aXJvbm1lbnQ6IHtcblx0XHRcdC8vIFBhc3MgaW4gdGhlIEFQSSBlbmRwb2ludCB0byBvdXIgYXBwXG5cdFx0XHRWSVRFX0FQUF9BUElfVVJMOiBhcGkudXJsLFxuXHRcdFx0VklURV9BUFBfV1NfQVBJX1VSTDogd3NBcGkudXJsLFxuXHRcdH0sXG5cdH0pO1xuXG5cdC8vIFNob3cgdGhlIFVSTHMgaW4gdGhlIG91dHB1dFxuXHRzdGFjay5hZGRPdXRwdXRzKHtcblx0XHRTaXRlVXJsOiBzaXRlLnVybCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTE3M1wiLFxuXHRcdEFwaUVuZHBvaW50OiBhcGkudXJsLFxuXHRcdHdzQXBpRW5kcG9pbnQ6IHdzQXBpLnVybFxuXHR9KTtcbn1cbiIsICJpbXBvcnQgeyBTU1RDb25maWcgfSBmcm9tIFwic3N0XCI7XG5pbXBvcnQgeyBFeGFtcGxlU3RhY2sgfSBmcm9tIFwiLi9zdGFja3MvRXhhbXBsZVN0YWNrXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnKF9pbnB1dCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcInN2ZWx0ZS1hcHBcIixcbiAgICAgIHJlZ2lvbjogXCJldS1ub3J0aC0xXCIsXG4gICAgfTtcbiAgfSxcbiAgc3RhY2tzKGFwcCkge1xuICAgIGFwcC5zdGFjayhFeGFtcGxlU3RhY2spO1xuICB9XG59IHNhdGlzZmllcyBTU1RDb25maWc7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7OztBQUFBLFNBQVMsS0FBSyxZQUEwQixPQUFPLG9CQUFvQjtBQUU1RCxTQUFTLGFBQWEsRUFBRSxNQUFNLEdBQWlCO0FBRXJELFFBQU0sUUFBUSxJQUFJLE1BQU0sT0FBTyxpQkFBaUI7QUFBQSxJQUMvQyxRQUFRO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixZQUFZO0FBQUEsTUFDWixVQUFVO0FBQUEsSUFDWDtBQUFBLElBQ0EsY0FBYyxFQUFFLGNBQWMsS0FBSztBQUFBLEVBQ3BDLENBQUM7QUFFRCxRQUFNLE1BQU0sSUFBSSxJQUFJLE9BQU8sT0FBTztBQUFBLElBQ2pDLFVBQVU7QUFBQSxNQUNULFVBQVU7QUFBQSxRQUVULE1BQU0sQ0FBQyxLQUFLO0FBQUEsTUFDYjtBQUFBLElBQ0Q7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNQLFVBQVU7QUFBQSxJQUNYO0FBQUEsRUFDRCxDQUFDO0FBRUQsUUFBTSxRQUFRLElBQUksYUFBYSxPQUFPLFNBQVM7QUFBQSxJQUM5QyxVQUFVO0FBQUEsTUFDVCxVQUFVO0FBQUEsUUFDVCxNQUFNLENBQUMsS0FBSztBQUFBLE1BQ2I7QUFBQSxJQUNEO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixhQUFhO0FBQUEsTUFDYixhQUFhO0FBQUEsTUFDYixhQUFhO0FBQUEsSUFDZDtBQUFBLEVBQ0QsQ0FBQztBQUlELFFBQU0sT0FBTyxJQUFJLFdBQVcsT0FBTyxnQkFBZ0I7QUFBQSxJQUNsRCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsTUFFWixrQkFBa0IsSUFBSTtBQUFBLE1BQ3RCLHFCQUFxQixNQUFNO0FBQUEsSUFDNUI7QUFBQSxFQUNELENBQUM7QUFHRCxRQUFNLFdBQVc7QUFBQSxJQUNoQixTQUFTLEtBQUssT0FBTztBQUFBLElBQ3JCLGFBQWEsSUFBSTtBQUFBLElBQ2pCLGVBQWUsTUFBTTtBQUFBLEVBQ3RCLENBQUM7QUFDRjtBQXhEZ0I7OztBQ0NoQixJQUFPLHFCQUFRO0FBQUEsRUFDYixPQUFPLFFBQVE7QUFDYixXQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU8sS0FBSztBQUNWLFFBQUksTUFBTSxZQUFZO0FBQUEsRUFDeEI7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
