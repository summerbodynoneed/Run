export default async function handler(req, res) {
  try {
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: process.env.STRAVA_REFRESH_TOKEN
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(500).json({ error: "Failed to refresh token", details: tokenData });
    }

    const statsResponse = await fetch(
      `https://www.strava.com/api/v3/athletes/${process.env.STRAVA_ATHLETE_ID}/stats`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    );

    const statsData = await statsResponse.json();

    if (!statsResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch stats", details: statsData });
    }

    const allRunKm = ((statsData.all_run_totals?.distance || 0) / 1000).toFixed(1);

    res.status(200).json({
      all_run_km: allRunKm
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}