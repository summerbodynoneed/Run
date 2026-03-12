async function loadStats() {
  const counter = document.getElementById("counter");

  try {
    const res = await fetch("/api/strava"); // or /api/strava-stats
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`API did not return JSON: ${text}`);
    }

    if (!res.ok) {
      throw new Error(data.error || "API request failed");
    }

    counter.innerText = `${data.club_km} km`; // or data.all_run_km
  } catch (error) {
    console.error(error);
    counter.innerText = `Error: ${error.message}`;
  }
}

loadStats();
