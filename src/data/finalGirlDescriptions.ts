/**
 * Visual descriptions for Final Girl characters
 * Used to augment AI image generation with accurate character appearances
 */

export const FINAL_GIRL_DESCRIPTIONS: Record<string, string> = {
  "Laurie": `A woman in her early-to-mid 30s with a lean, athletic build and a hardened, resilient presence. She has pale skin marked by dirt, faint bruising, and healed cuts that suggest recent hardship rather than stylized beauty. Her face is angular with high cheekbones, a narrow jaw, and a straight nose. She has intense, piercing light-blue eyes with a focused, defiant stare and slightly furrowed brows that convey determination and suppressed anger.

Her hair is dark blonde to light ash-blonde, straight, shoulder-length, worn loose and slightly messy, with a natural part and no visible styling. No makeup or only minimal, worn makeup. Her expression is serious, unsmiling, emotionally guarded.

She appears weathered but strong, like a survivor rather than a victim. Worn, practical clothing with muted colors. Fabric looks dirty, torn, or distressed rather than fashionable. Nothing ornamental or decorative. The overall aesthetic is gritty, grounded, and realistic.`,

  "Reiko": `A woman in her late 20s to early 30s with a compact, wiry build and a confrontational, unyielding presence. She has light-to-medium skin with visible bruising, swelling, and healed abrasions on her face and shoulders, suggesting recent physical conflict. Her face is rounder than angular, with strong cheekbones, a short nose, and a tense jaw. Her lips are slightly split and swollen. She wears a scowl or sneer, brows knitted tightly, projecting anger, defiance, and distrust rather than fear.

Her eyes are dark brown, intense, and narrowed, giving the impression that she's sizing up a threat rather than reacting to one.

She has straight black hair cut into a blunt chin-length bob with short, straight bangs that sit just above her eyebrows. Hair is neat but unstyled, practical rather than expressive.

She reads as tough, scrappy, and street-hardened—someone who doesn't back down and doesn't ask permission. She wears practical, worn clothing with visible damage—rips, tears, stretched fabric. Colors are muted but not dull, favoring everyday streetwear rather than survival gear. Nothing ornamental. Clothing looks lived-in, not styled.`,

  "Asami": `A woman in her mid-20s with a slender, resilient build and a calm, unflinching presence. She has warm olive-to-tan skin with visible dirt, small cuts, and dried blood across her face, neck, and collarbone, suggesting prolonged struggle rather than a single fight. Her face is softly angular with a narrow jaw, straight nose, and full but unsmiling lips. Her expression is steady, emotionally contained, and observant—less anger than endurance.

Her eyes are medium brown, large and alert, with a quiet intensity that suggests vigilance and inner resolve rather than confrontation.

She has dark brown hair, nearly black, worn loosely tied back in a messy, low arrangement, with thin strands falling around her face. Hair texture is natural and slightly unkempt, no styling or ornamentation.

She reads as a survivor shaped by sustained hardship—composed, inwardly strong, and quietly defiant. Simple, utilitarian clothing made of natural fabrics. Garments are torn, stained, and worn from use rather than fashion. Colors skew earthy or faded. Clothing feels practical, symbolic, or ritual-adjacent rather than modern streetwear.`,

  "Charlie": `A woman in her late 20s to early 30s with a lean, athletic build and a hardened, self-possessed presence. She has fair skin marked by fresh cuts, dried blood, and abrasions across her face and neck, suggesting recent violence rather than long-term wear. Her face is angular with a strong jawline, high cheekbones, and a straight nose. Her lips are set neutrally, neither defiant nor fearful—controlled, alert.

Her eyes are striking light blue, steady and assessing, giving the impression of someone constantly measuring risk.

Her hair is short, cropped, and blonde—cut close around the sides and back, slightly longer on top, tousled and practical rather than styled. The haircut reads as functional, almost military, not fashionable.

She gives off the energy of a capable fighter: alert, disciplined, and unwilling to be underestimated. She wears rugged, utilitarian clothing with protective elements—leather or heavy fabric outerwear, visible metal or reinforced shoulder pieces. Clothing is worn, scuffed, and practical. The look suggests readiness for conflict rather than survival-by-endurance.

Color palette: dark neutrals with a strong accent color (e.g., red undershirt).`,

  "Sheila": `A woman in her early-to-mid 20s with a slight, soft-built frame and a visibly shaken but determined presence. She has light-to-medium olive skin with freckles, dirt, and smeared dried blood across her face and clothing, suggesting sudden trauma rather than long-term hardening. Her face is round-to-oval with gentle features, a small straight nose, and slightly parted lips that convey shock, fear, and dawning resolve rather than anger.

Her eyes are dark brown, wide and reflective, with an anxious, searching expression—as if she's still processing what just happened while forcing herself to stay upright.

She has long, dark brown hair with a natural wave, worn loose and unstyled, falling past her shoulders. The hair frames her face unevenly, contributing to a disheveled, vulnerable look.

She wears large, round eyeglasses with thin metal frames—an essential identifying feature that immediately distinguishes her. The glasses slightly magnify her eyes, reinforcing her fragile, intellectual, and unprepared-for-violence appearance.

She reads as an ordinary person thrust into extraordinary danger: scared, overwhelmed, but not broken. Layered, everyday clothing rather than survival gear: a denim jacket with a shearling or fleece lining over a soft sweatshirt or sweater. Fabrics are visibly stained and rumpled. Colors are muted pastels and worn blues—casual, civilian, non-threatening.`,

  "Nancy": `A woman in her mid-to-late 20s with a compact, athletic build and a restrained, watchful presence. She has fair skin marked by light dirt, small cuts, and faint blood spatter, suggesting she's been close to violence but not overwhelmed by it. Her face is softly angular with a defined jaw, straight nose, and firm mouth set in a neutral, controlled expression.

Her eyes are a striking pale green, steady and unblinking, conveying alertness and internal calculation rather than fear or rage. She looks like someone who has already decided what she'll do if things go wrong.

She has short, naturally curly brown hair, cut to about chin length. The curls are loose and slightly uneven, framing her face without styling. The haircut reads as practical and unpretentious.

She appears grounded, composed, and quietly resilient—someone who doesn't posture, but doesn't hesitate either. Simple, close-fitting everyday clothing that allows movement. A plain short-sleeve shirt or top in muted or cool tones. Fabric shows signs of wear—stains, small tears—but nothing decorative. Clothing feels civilian and functional rather than tactical or fashionable.`
};

/**
 * Get the visual description for a final girl by name
 * Returns undefined if no description exists
 */
export function getFinalGirlDescription(name: string): string | undefined {
  return FINAL_GIRL_DESCRIPTIONS[name];
}
