/**
 * Visual descriptions for Location settings
 * Used to augment AI image generation with accurate environment depictions
 */

export const LOCATION_DESCRIPTIONS: Record<string, string> = {
  "Camp Happy Trails": `A secluded lakeside summer camp set deep in a forest, composed of small wooden cabins arranged loosely around a central dirt path and communal fire pit. The camp feels modest, old-fashioned, and slightly neglected rather than abandoned—structures are intact but weathered, with peeling wood, uneven steps, and soft yellow light glowing from cabin windows.

At the heart of the camp is a large circular fire pit surrounded by rough-hewn log benches. The fire burns steadily, casting long, flickering shadows across the ground and nearby trees. The firelight creates a false sense of warmth and safety.

A calm lake borders the camp, its surface glassy and reflective, partially obscured by low-lying mist that rolls gently across the water and creeps toward the cabins. The lake reflects cabin lights and trees, doubling the sense of stillness and isolation.

A narrow dirt road leads into the camp, marked by a simple wooden sign reading "Camp Happy Trails." An old mid-century car is parked near the path, hinting at recent arrival or an attempt to leave.

The surrounding forest is dense, dark, and enclosing—tall trees press in close, limiting sightlines and sound. Beyond the firelight, visibility drops off quickly into shadow and fog.

The camp feels quiet, suspended, and watchful—as if something is present but waiting. Key elements: Lakeside setting with visible mist or fog. Small wooden cabins with warm interior light. Central fire pit with log seating. Dense forest enclosing the space. A single access path or dirt road.`,

  "Carnival of Blood": `A derelict traveling carnival frozen in time, set under a storm-heavy sky. The grounds are muddy and uneven, with puddles reflecting strings of warm carnival lights that still glow despite the absence of joy. Everything feels recently active but wrong—like the crowd left in a hurry.

At the center stands a large striped circus tent ("The Big Top"), its fabric sagging slightly with age and moisture. The entrance is lit and open, inviting but ominous, as if something inside is waiting for an audience that never arrived.

Surrounding the big top are decaying attractions: A House of Mirrors with flickering marquee lights. A Ferris wheel looming silently in the background. Rusted animal cages on wagons, doors closed but suggestive. A small ticket booth still staffed or recently abandoned. Old carnival signage, hand-painted and weathered.

The ground is churned mud, suggesting heavy foot traffic followed by rain. Light bulbs glow warmly, contrasting sharply with the cold sky and dark surroundings.

The carnival feels theatrical but rotten—performance stripped of innocence. Key elements: Large striped big top tent at center. Carnival lights glowing despite abandonment. House of Mirrors or funhouse facade. Ferris wheel visible in silhouette. Animal cages or wagons present. Mud, puddles, and stormy skies.`,

  "Maple Lane": `A calm, middle-class suburban neighborhood at dusk or early night, centered on a four-way residential intersection. Modest single-family homes with pitched roofs and tidy lawns line the streets, their porch lights and interior lamps glowing warmly. Everything appears orderly, safe, and routine.

Streetlights cast soft pools of amber light onto damp asphalt, creating reflective patches on the road surface. The streets are empty—no pedestrians, no moving cars—just stillness. The silence feels intentional rather than late.

At the edge of the sidewalk sits a small, unsettling detail: abandoned children's toys—a tricycle, a ball—left near the curb as if dropped mid-play. These objects feel recent, not forgotten.

Leafless trees frame the scene, their bare branches cutting into the deep blue evening sky. The neighborhood stretches outward evenly in all directions, offering no obvious refuge—only repetition.

The location feels watched, paused, and vulnerable. Nothing is visibly wrong, which makes everything feel wrong. Key elements: Four-way residential intersection. Single-family suburban houses with warm lights on. Streetlights illuminating wet pavement. Abandoned children's toys near the curb. Leafless trees and empty streets.`,

  "Wolfe Asylum": `An imposing, Victorian-era psychiatric hospital constructed from weathered, rough-hewn grey stone, set against a bleak and overcast sky. The building, identified by a rusted metal archway as "Wolfe Asylum - Est. 1899," dominates the landscape with its multi-story Gothic architecture, featuring steep gables, narrow windows—some boarded over—and a prominent central arched portico. The left wing is heavily draped in dark green ivy, while the rest of the stone appears soot-stained and neglected.

In the foreground, a pair of rusted, wrought-iron gates stand partially open, leading to a cracked asphalt driveway littered with dead, fallen leaves and overgrown weeds. The surrounding grounds are unkempt, with skeletal trees and wild grass pressing in from the edges, limiting the horizon. A newer, white sign reading "HAVEN" is mounted near the main entrance, creating a jarring, modern contrast against the ancient, forbidding stone walls.

The overall aesthetic is one of stagnant isolation and institutional dread. It feels like a place where time has stopped, carrying the heavy weight of forgotten history and buried secrets.

Massive Gothic stone architecture with multi-story gables and slate roofing. Rusted metal archway and partially open iron gates. Boarded-up windows and ivy-covered stone walls. Unkempt grounds with dead leaves and bare, skeletal trees. Dismal, overcast lighting and a small "HAVEN" sign near the door.`,

  "Sunnydaze Mall": `A bustling two-story indoor shopping mall named "Sunny Daze Mall," characterized by a bright, airy atrium and a mix of niche retail stores overlooking a communal food court. The architecture features clean lines, stark white walls, and a large grid-like skylight that floods the central space with natural light, giving the interior a crisp, midday feel.

The upper level features a glass-railed mezzanine lined with specialty storefronts including "Military Surplus Rus," "Stan's Sporting Goods," and "Boards 'N' Bones." These shops are framed with warm wood paneling and large glass displays, offering a view of the shoppers below. A set of dual escalators serves as the focal point for vertical transit, positioned centrally near the "Atrium" signage.

At the heart of the ground floor is an expansive food court filled with dozens of light-wood tables and chairs. The area is active with people of all ages eating, chatting, and resting between shops. Flanking the seating area are smaller kiosks and service-oriented counters like "Zap Snack," a dedicated "Security" desk, and "Smokin' Subject," while a "Service Entrance" and public restrooms are tucked into the far corner.

The environment feels social and nostalgic—a classic suburban hub captured in a moment of peak weekend activity. The lighting is a blend of cool, natural daylight from the ceiling and the warm, inviting glow of the individual shop interiors, creating a clean and welcoming atmosphere.

Two-story indoor mall with a central atrium and large skylight. Upper-level retail including sporting goods and hobby shops with wood-paneled facades. Ground-level food court with dense communal seating. Functional elements like glass railings, escalators, and security stations. Bright, bustling atmosphere with a diverse crowd of shoppers.`
};

/**
 * Get the visual description for a location by name
 * Returns undefined if no description exists
 */
export function getLocationDescription(name: string): string | undefined {
  return LOCATION_DESCRIPTIONS[name];
}
