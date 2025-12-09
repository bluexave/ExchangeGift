# Gift Exchange API - Project Instructions

This is a Node.js REST API for matching gift exchange partners from different families.

## Project Overview

- **Type**: Node.js REST API
- **Framework**: Express.js
- **Purpose**: Match participants for gift exchange ensuring no one is paired with family members

## Setup Status

- ✅ Project structure created
- ✅ Core files implemented (index.js, matcher.js)
- ✅ Documentation (README.md)
- ⏳ Dependencies installation

## Running the Project

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. API available at `http://localhost:3000`

## Key Endpoints

- `POST /api/match` - Submit families and receive partner matches
- `GET /health` - Health check

## Algorithm Details

The matching uses backtracking to ensure:
- Each person gets matched with someone from a different family
- Each person gives exactly one gift and receives exactly one gift
- Valid circular matching is achieved
