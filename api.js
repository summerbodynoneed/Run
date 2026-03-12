export default async function handler(req, res) {
  try {
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: 210989,
        client_secret: e95afaa733ab697697a295ef9ac1529fa84d82,
        grant_type: "refresh_token",
        refresh_token: abcfe47902d79a591895e001b9f3bcf9f8fa7a3
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(500).json({ error: "Failed to refresh token", details: tokenData });
    }

    const statsResponse = await fetch(
      `https://www.strava.com/api/v3/clubs/1704055/stats`,
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
