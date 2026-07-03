import 'dotenv/config';

async function run() {
  const payload = {
    startAt: "2026-07-05T14:00:00Z",
    locationId: "L30DXARY07J67",
    serviceVariationIds: ["EXPPH76AN5UK7Q27FGR26FPR"],
    appointmentSegments: [
      {
        durationMinutes: 240,
        serviceVariationId: "EXPPH76AN5UK7Q27FGR26FPR",
        teamMemberId: "TMj5Sr67JDP_wy4b",
        serviceVariationVersion: "1782508356254"
      }
    ],
    customer: {
      firstName: "Test",
      lastName: "LiveEndpointUser",
      email: "testliveendpoint@gmail.com",
      phone: "+17123056313",
      locationType: "drop-off"
    },
    serviceName: "Test Service",
    addons: []
  };

  console.log("Calling live API endpoint...");
  try {
    const response = await fetch("https://bryansdetailingomaha.com/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response Body:", text);
  } catch (err: any) {
    console.error("Fetch error:", err);
  }
}

run().catch(console.error);
