# MongoDB MCP Server Setup

Integrates MongoDB Model Context Protocol (MCP) server with Njiapanda's Hadithi agent for sourcing, storing, and retrieving SGBV articles.

## What is MCP?

Model Context Protocol (MCP) is an open standard for connecting AI assistants to tools and data. The MongoDB MCP server exposes 24 database tools (CRUD, aggregation, vector search) + 13 Atlas management tools that the Hadithi agent uses as "superpowers."

## Architecture

```
Hadithi Agent (Gemini)
    │
    ├── uses MongoDB MCP tools
    │     ├── insertMany()       → store sourced articles
    │     ├── find()             → query by abuse_type/location
    │     ├── aggregate()        → complex filtering + sorting
    │     ├── createIndex()      → enable full-text / vector search
    │     └── listCollections()  → discover data sources
    │
    └── communicates via MCP protocol (stdio/HTTP)
            │
    MongoDB MCP Server (npx @mongodb-js/mongodb-mcp-server)
            │
            └── MongoDB Atlas (free tier M0)
```

## Prerequisites

- [MongoDB Atlas](https://mongodb.com/atlas) account (free tier)
- Node.js 20+
- `npx` available (comes with Node.js)

## Step 1: Create MongoDB Atlas Cluster

1. Sign up at https://mongodb.com/atlas
2. Create a **free M0 cluster** (any cloud provider, any region)
3. Under **Security → Database Access**, create a database user:
   - Username: `njiapanda-agent`
   - Password: generate a strong password
   - Role: `readWrite` on `njiapanda` database
4. Under **Security → Network Access**, add your IP (or `0.0.0.0/0` for Cloud Run)
5. Click **Connect → Drivers** → copy the connection string

## Step 2: Configure Environment

Add to `.env`:

```bash
MONGODB_CONNECTION_STRING=mongodb+srv://njiapanda-agent:<password>@<cluster>.mongodb.net/njiapanda?retryWrites=true&w=majority
MONGODB_DB_NAME=njiapanda
MONGODB_COLLECTION_ARTICLES=sourced_articles
```

## Step 3: Configure MongoDB MCP Server

The MCP server runs as a sidecar process that the agent communicates with. Create `.mongodb-mcp.json`:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": [
        "-y",
        "@mongodb-js/mongodb-mcp-server@latest",
        "--readOnly"
      ],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "${MONGODB_CONNECTION_STRING}",
        "MDB_MCP_READ_ONLY": "false"
      }
    }
  }
}
```

## Step 4: Verify MCP Server

```bash
# Install and run the MCP server directly
npx @mongodb-js/mongodb-mcp-server --connection-string "$MONGODB_CONNECTION_STRING"
```

Expected output: Server starts and listens for MCP protocol messages.

## Step 5: Run Integration Demo

```bash
node scripts/mongodb-mcp-demo.cjs
```

This script simulates the Hadithi agent using MongoDB MCP tools:
1. `listCollections` — discover available collections
2. `insertMany` — store sourced articles
3. `find` — query by abuse type and location
4. `createIndex` — enable text search
5. `aggregate` — complex data retrieval

## Step 6: Deploy to Cloud Run

```bash
cd gcp-functions/article-sourcing

gcloud run deploy article-sourcing \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING,GEMINI_API_KEY=$GEMINI_API_KEY"
```

## Security Best Practices

| Practice | Implementation |
|---|---|
| **No exposed secrets** | MongoDB connection string is server-side only (`process.env`), never in frontend code |
| **Read-only API for frontend** | Cloud Run service only exposes read endpoints (GET) to the public |
| **Write restricted to agent** | Only the search-and-ingest endpoint (authenticated) can write |
| **Input sanitization** | All user inputs validated, trimmed, and length-limited |
| **Connection pooling** | MongoDB client is reused across invocations (warm starts) |
| **Least privilege** | Database user has `readWrite` only on `njiapanda` database |
| **Query limits** | Max 100 articles returned, full text excluded in list views |

## MongoDB MCP Tools Used

| Tool | Purpose |
|---|---|
| `listCollections` | Discover available data sources |
| `find` | Query articles by abuse_type, location, text search |
| `insertMany` | Store batch of sourced articles |
| `aggregate` | Complex filtering and sorting |
| `createIndex` | Enable text and vector search indexes |
| `countDocuments` | Article counts by category |

## Troubleshooting

**Connection refused**: Ensure your IP is whitelisted in Atlas Network Access.

**Authentication failed**: Verify the username/password in `MONGODB_CONNECTION_STRING` — special characters must be URL-encoded.

**MCP server not found**: Run `npx @mongodb-js/mongodb-mcp-server --help` to verify the package is accessible.

**Cloud Run timeout**: The `search-and-ingest` endpoint may take 15-30s. Increase the Cloud Run timeout:
```bash
gcloud run services update article-sourcing --timeout=120 --region us-central1
```
