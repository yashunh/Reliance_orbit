import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '../.env' });

export default async function calculateDistance(
    origin: string,
    destination: string,
    stoppage: string[],
): Promise<[number, number]> {

    stoppage = stoppage?.filter((stop: string) => stop.trim() !== "")
    stoppage = [...new Set(stoppage)]
    let waypoints = ""

    if (stoppage.length) {
        waypoints = "optimize:true"
        stoppage.map(stop => waypoints += "|" + stop)
    }

    const locationDetails = await axios.get(process.env.DIRECTIONS_API || "", {
        params: {
            origin,
            destination,
            waypoints
        }
    })
    if (locationDetails.data.status !== "OK") {
        return [-1, -1];
    }

    let distance = 0;
    let duration = 0;
    for (const leg of locationDetails.data.routes[0].legs) {
        distance += leg.distance.value
        duration += leg.duration.value
    }

    return [distance, duration]
}
