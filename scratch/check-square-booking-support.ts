import 'dotenv/config';
import { Client, Environment } from 'square';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: token,
});

async function run() {
  console.log("Current Environment:", process.env.SQUARE_ENVIRONMENT);
  console.log("Locations:");
  const locationsResp = await client.locationsApi.listLocations();
  const locations = locationsResp.result.locations || [];
  
  for (const loc of locations) {
    console.log(`- Name: ${loc.name}, ID: ${loc.id}, Status: ${loc.status}`);
  }

  console.log("\nBusiness Booking Profile:");
  try {
    const profileResp = await client.bookingsApi.retrieveBusinessBookingProfile();
    const profile = profileResp.result.businessBookingProfile;
    console.log(JSON.stringify(profile, null, 2));
  } catch (err: any) {
    console.error("Error retrieving business booking profile:", err?.message || err);
  }
  
  console.log("\nTeam Members:");
  try {
    const teamResp = await client.teamApi.searchTeamMembers({
      query: {
        filter: {
          status: 'ACTIVE'
        }
      }
    });
    const team = teamResp.result.teamMembers || [];
    for (const member of team) {
      console.log(`- Name: ${member.givenName} ${member.familyName || ''}, ID: ${member.id}`);
    }
  } catch (err: any) {
    console.error("Error retrieving team members:", err?.message || err);
  }
}

run().catch(console.error);
