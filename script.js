async function loadStats() {
    try {
        const res = await fetch("/api/strava-stats");
        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();

        document.getElementById("counter").innerText = `${data.all_run_km} km`;
    } catch (error) {
        console.error(error);
        document.getElementById("counter").innerText = "Unable to load stats";
    }
}

loadStats();