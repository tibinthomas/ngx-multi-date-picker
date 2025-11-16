#!/usr/bin/env node

// ===============================
// CONFIGURE THESE VALUES
// ===============================
const ORG = "tibinthomas";
const PROJECT = "asteroids";
const REPO = "asteroids";
const PAT = ""; // Code (Read) scope
const SINCE_DATE = "2025-01-01"; // YYYY-MM-DD
// ===============================

const API_VERSION = "6.0";
const BASE_URL = `https://dev.azure.com/${encodeURIComponent(
  ORG
)}/${encodeURIComponent(PROJECT)}/_apis/git/repositories/${encodeURIComponent(
  REPO
)}`;
const authHeader = "Basic " + Buffer.from(":" + PAT).toString("base64");

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: authHeader,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return { json: await res.json(), res };
}

async function getCommitsSince(dateIso) {
  let all = [];
  let continuationToken;

  while (true) {
    const params = new URLSearchParams({
      "searchCriteria.fromDate": dateIso,
      $top: "100",
      "api-version": API_VERSION,
    });

    if (continuationToken) params.set("continuationToken", continuationToken);

    const url = `${BASE_URL}/commits?${params.toString()}`;
    const { json, res } = await fetchJson(url);

    all.push(...json.value);

    continuationToken = res.headers.get("x-ms-continuationtoken") || null;
    if (!continuationToken) break;
  }
  return all;
}

async function getCommitChanges(commitId) {
  const url = `${BASE_URL}/commits/${commitId}/changes?api-version=${API_VERSION}`;
  const { json } = await fetchJson(url);
  return json.changes || [];
}

function fileName(path) {
  return path.split("/").pop();
}

(async () => {
  try {
    const sinceIso = new Date(SINCE_DATE).toISOString();
    const commits = await getCommitsSince(sinceIso);

    const unique = new Set();
    const results = [];

    for (const c of commits) {
      const sha = c.commitId;
      if (!sha) continue;

      const changes = await getCommitChanges(sha);

      for (const ch of changes) {
        const path = ch?.item?.path;
        if (!path) continue;

        if (!unique.has(path)) {
          unique.add(path);
          results.push(path); // or push({ name: fileName(path), path })
        }
      }
    }

    // Output one file per line
    for (const p of results) {
      console.log(p);
    }

    console.error(`Done. Total changed files: ${results.length}`);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
})();
