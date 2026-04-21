#!/usr/bin/env node
/*
 * import-vr-art.mjs
 *
 * Walk a Van Ryder Games press-kit folder, fuzzy-match every PNG against the
 * 94 entities the app expects, print a coverage report, and (with --apply)
 * copy the matched files into src/assets/{characters,locations,box-art}/
 * with the canonical filenames defined in src/types/gameData.ts.
 *
 * Run from the repo root:
 *
 *   node scripts/import-vr-art.mjs                                   # dry-run report
 *   node scripts/import-vr-art.mjs --source "$HOME/Downloads/Final Girl"
 *   node scripts/import-vr-art.mjs --apply                           # actually copy
 *
 * Pure Node, zero dependencies.
 */

import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, basename, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// ─── Args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name) => {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  const next = args[idx + 1];
  return next && !next.startsWith('--') ? next : true;
};
const APPLY = !!flag('--apply');
const SOURCE = (typeof flag('--source') === 'string' ? flag('--source') : null)
  ?? `${process.env.HOME}/Downloads/Final Girl`;

// ─── Expected entities (must stay in sync with src/types/gameData.ts) ──────

const CHARACTER_FILES = {
  'Hans': 'hans.png',
  'Laurie': 'laurie.png',
  'Reiko': 'reiko.png',
  'Dr. Fright': 'dr-fright.png',
  'Nancy': 'nancy.png',
  'Sheila': 'sheila.png',
  'Geppetto': 'geppetto.png',
  'Asami': 'asami.png',
  'Charlie': 'charlie.png',
  'Alice': 'alice.png',
  'Selena': 'selena.png',
  'Adelaide': 'adelaide.png',
  'Barbara': 'barbara.png',
  'Poltergeist': 'poltergeist.png',
  'Inkanyamba': 'inkanyamba.png',
  'Heather': 'heather.png',
  'Veronica': 'veronica.png',
  'Ratchet Lady': 'ratchet-lady.png',
  'Kat': 'kat.png',
  'Tali': 'tali.png',
  'The Hunter': 'the-hunter.png',
  'Joy': 'joy.png',
  'Vicky': 'vicky.png',
  'Grimlash': 'grimlash.png',
  'Ellen': 'ellen.png',
  'Jenette': 'jenette.png',
  'Evomorph': 'evomorph.png',
  'Kate': 'kate.png',
  'Uki': 'uki.png',
  'The Organism': 'the-organism.png',
  'Gretel': 'gretel.png',
  'Red': 'red.png',
  'Big Bad Wolf': 'big-bad-wolf.png',
  'Ginny': 'ginny.png',
  'Ava': 'ava.png',
  'The Intruders': 'the-intruders.png',
  'Octavia': 'octavia.png',
  'Janelle': 'janelle.png',
  'Slayer': 'slayer.png',
  'Kenzie': 'kenzie.png',
  'Julie': 'julie.png',
  'Razorface': 'razorface.png',
  'Mandy': 'mandy.png',
  'Cassie': 'cassie.png',
  'The Tormentor': 'the-tormentor.png',
  'Meghan': 'meghan.png',
  'Ronda': 'ronda.png',
  'The Eyeless': 'the-eyeless.png',
  'Melanie': 'melanie.png',
  'Birds': 'birds.png',
  'Patsy': 'patsy.png',
  'Zombies': 'zombies.png',
  'Gabrielle': 'gabrielle.png',
  'Destiny': 'destiny.png',
  'Adrianne': 'adrianne.png',
  'Maureen': 'maureen.png',
  'Mort the Teenage Dirtbag': 'mort-the-teenage-dirtbag.png',
};

const LOCATION_FILES = {
  'Camp Happy Trails': 'camp-happy-trails.png',
  'Maple Lane': 'maple-lane.png',
  'Carnival of Blood': 'carnival-of-blood.png',
  'Creech Manor': 'creech-manor.png',
  'Sacred Groves': 'sacred-groves.png',
  'Wolfe Asylum': 'wolfe-asylum.png',
  'Sunnydaze Mall': 'sunnydaze-mall.png',
  'Shady Acres': 'shady-acres.png',
  'USS Konrad': 'uss-konrad.png',
  'Station 2891': 'station-2891.png',
  'Storybook Woods': 'storybook-woods.png',
  'Wingard Cottage': 'wingard-cottage.png',
  'Falconwood': 'falconwood.png',
  'Hellscape': 'hellscape.png',
  'Marrek Warehouse': 'marrek-warehouse.png',
  'Utopia': 'utopia.png',
  'MegaBGCon': 'megabgcon.png',
};

const FILM_BOX_ART = {
  'The Happy Trails Horror': 'happy-trails-horror.png',
  'The Haunting of Creech Manor': 'haunting-creech-manor.png',
  'Slaughter in the Groves': 'slaughter-groves.png',
  'Carnage at the Carnival': 'carnage-carnival.png',
  'Frightmare on Maple Lane': 'frightmare-maple-lane.png',
  'Terror From Above': 'terror-from-above.png',
  'Into the Void': 'into-the-void.png',
  'Panic at Station 2891': 'panic-station-2891.png',
  'Madness in the Dark': 'madness-in-the-dark.png',
  'Once Upon a Full Moon': 'once-upon-full-moon.png',
  'A Knock at the Door': 'knock-at-the-door.png',
  'Terror From the Grave': 'terror-from-the-grave.png',
  'The Falconwood Files': 'the-falconwood-files.png',
  'The Killer from Tomorrow': 'killer-from-tomorrow.png',
  'Hell to Pay': 'hell-to-pay.png',
  'The Marrek Murders': 'the-marrek-murders.png',
  "Don't Make a Sound": 'dont-make-a-sound.png',
  'Terror From Destiny': 'terror-from-destiny.png',
  'Shriek': 'shriek.png',
  'A Rotten Harvest': 'rotten-harvest.png',
};

// Synonyms / known aliases that pure fuzzy matching won't catch.
// Keys are the official entity name; values are extra strings to look for in
// the candidate path (case-insensitive, normalized).
const ENTITY_HINTS = {
  // Killer aliases
  'Slayer': ['slayer', 'slayer alpha', 'killer alpha'],
  'Big Bad Wolf': ['big bad wolf', 'wolf', 'bbw'],
  'Ratchet Lady': ['ratchet', 'ratchet lady', 'nurse'],
  'The Organism': ['organism'],
  'The Hunter': ['hunter'],
  'The Tormentor': ['tormentor'],
  'The Eyeless': ['eyeless'],
  'The Intruders': ['intruders', 'intruder'],
  'Mort the Teenage Dirtbag': ['mort', 'dirtbag', 'teenage dirtbag'],
  'Dr. Fright': ['dr fright', 'dr. fright', 'fright', 'drfright'],
  // Final Girl name conflict — their files name her Eva, our entity is Ava.
  'Ava': ['ava', 'eva'],
  // Vignettes / animals
  'Birds': ['birds', 'bird', 'flock'],
  'Zombies': ['zombies', 'zombie'],
};

const LOCATION_HINTS = {
  'USS Konrad': ['uss konrad', 'konrad'],
  'Station 2891': ['station 2891', 'station2891', '2891'],
  'Marrek Warehouse': ['marrek', 'marrek warehouse', 'warehouse'],
  'Wolfe Asylum': ['wolfe asylum', 'wolfe', 'asylum'],
  'Wingard Cottage': ['wingard cottage', 'wingard', 'cottage'],
  'Storybook Woods': ['storybook woods', 'storybook'],
  'Sunnydaze Mall': ['sunnydaze mall', 'sunnydaze', 'mall'],
  'Shady Acres': ['shady acres', 'shady'],
  'Sacred Groves': ['sacred groves', 'groves'],
  'Camp Happy Trails': ['camp happy trails', 'happy trails', 'camp'],
  'Maple Lane': ['maple lane', 'maple'],
  'Carnival of Blood': ['carnival of blood', 'carnival'],
  'Creech Manor': ['creech manor', 'creech'],
  'Hellscape': ['hellscape', 'hell'],
  'Falconwood': ['falconwood'],
  'Utopia': ['utopia'],
  'MegaBGCon': ['megabgcon', 'mega bg con', 'bgcon'],
};

const FILM_HINTS = {
  'The Happy Trails Horror':   ['happy trails', 'ff01', 'fs01', 'film 01'],
  'The Haunting of Creech Manor': ['creech manor', 'haunting'],
  'Slaughter in the Groves':   ['slaughter', 'groves'],
  'Carnage at the Carnival':   ['carnage', 'carnival'],
  'Frightmare on Maple Lane':  ['frightmare', 'maple lane'],
  'Terror From Above':         ['terror from above', 'above', 'birds'],
  'Into the Void':             ['into the void', 'void', 'konrad'],
  'Panic at Station 2891':     ['panic', '2891'],
  'Madness in the Dark':       ['madness', 'asylum', 'wolfe'],
  'Once Upon a Full Moon':     ['once upon', 'full moon', 'wolf', 'storybook'],
  'A Knock at the Door':       ['knock at the door', 'knock'],
  'Terror From the Grave':     ['terror from the grave', 'grave', 'zombies'],
  'The Falconwood Files':      ['falconwood'],
  'The Killer from Tomorrow':  ['killer from tomorrow', 'tomorrow', 'sunnydaze'],
  'Hell to Pay':               ['hell to pay', 'razorface'],
  'The Marrek Murders':        ['marrek'],
  "Don't Make a Sound":        ['make a sound', 'eyeless', 'utopia'],
  'Terror From Destiny':       ['terror from destiny', 'destiny'],
  'Shriek':                    ['shriek', 'megabgcon', 'mort'],
  'A Rotten Harvest':          ['rotten harvest', 'rotten', 'grimlash'],
};

// ─── Walk source folder ────────────────────────────────────────────────────

function walkPngs(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      // Skip macOS metadata
      if (e.name.startsWith('._') || e.name === '.DS_Store') continue;
      const p = join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && extname(e.name).toLowerCase() === '.png') out.push(p);
    }
  }
  return out;
}

// ─── Matching ──────────────────────────────────────────────────────────────

const norm = (s) => s.toLowerCase().replace(/[_\-./\\]+/g, ' ').replace(/\s+/g, ' ').trim();

function tokens(s) {
  return new Set(norm(s).split(' ').filter(Boolean));
}

function scoreCandidate(entityName, hints, candidatePath) {
  const normedPath = norm(candidatePath);
  const normedFile = norm(basename(candidatePath, extname(candidatePath)));
  let score = 0;

  // Strong: exact name match in filename (not just path)
  const entityTokens = norm(entityName).split(' ').filter(t => t.length > 2);
  for (const t of entityTokens) {
    if (normedFile.split(' ').includes(t)) score += 50;
    else if (normedFile.includes(t)) score += 25;
    else if (normedPath.includes(t)) score += 5;
  }

  // Hints
  for (const hint of hints ?? []) {
    const h = norm(hint);
    if (normedFile.includes(h)) score += 40;
    else if (normedPath.includes(h)) score += 8;
  }

  // Penalize obvious back-of-card / non-art candidates
  if (/back/.test(normedFile)) score -= 30;
  if (/logo/.test(normedPath)) score -= 5;
  if (/template/.test(normedPath)) score -= 100;
  if (/component/.test(normedPath)) score -= 20;

  return score;
}

// Bonuses for art-type matching (character vs location vs box art).
function typeBonus(kind, candidatePath) {
  const p = norm(candidatePath);
  let b = 0;
  if (kind === 'character') {
    if (/\bart\b/.test(p)) b += 10;
    if (/portrait|character|killer|girl/.test(p)) b += 6;
    if (/\bbg\b|background/.test(p)) b -= 30;
    if (/box|front|back/.test(p)) b -= 20;
  } else if (kind === 'location') {
    if (/\bbg\b|background/.test(p)) b += 30;
    if (/location/.test(p)) b += 10;
    if (/portrait|character|killer|girl/.test(p)) b -= 20;
    if (/box|front|back/.test(p)) b -= 20;
  } else if (kind === 'box') {
    if (/box|front/.test(p)) b += 30;
    if (/back/.test(p)) b -= 30;
    if (/ff\d{2}|sf\d{2}|fs\d{2}/.test(p)) b += 15;
    if (/\bbg\b|background/.test(p)) b -= 30;
  }
  return b;
}

function bestMatch(entityName, hints, kind, candidates) {
  let scored = candidates.map(p => ({
    path: p,
    score: scoreCandidate(entityName, hints, p) + typeBonus(kind, p),
  }));
  scored = scored.filter(c => c.score > 0).sort((a, b) => b.score - a.score);
  return scored;
}

// ─── Main ──────────────────────────────────────────────────────────────────

function pad(s, n) { return String(s).padEnd(n); }

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`\nERROR: source folder not found:\n  ${SOURCE}\n`);
    console.error('Pass --source "/path/to/Final Girl" if it lives elsewhere.\n');
    process.exit(1);
  }

  console.log(`\nScanning: ${SOURCE}`);
  const allPngs = walkPngs(SOURCE);
  console.log(`Found ${allPngs.length} PNG files.\n`);

  const targets = [
    { kind: 'character', map: CHARACTER_FILES, hints: ENTITY_HINTS,   destDir: 'src/assets/characters' },
    { kind: 'location',  map: LOCATION_FILES,  hints: LOCATION_HINTS, destDir: 'src/assets/locations'  },
    { kind: 'box',       map: FILM_BOX_ART,    hints: FILM_HINTS,     destDir: 'src/assets/box-art'    },
  ];

  const plan = [];   // { entity, kind, src, destPath }
  const ambiguous = []; // { entity, kind, candidates }
  const gaps = [];   // { entity, kind }

  for (const { kind, map, hints, destDir } of targets) {
    console.log(`\n=== ${kind.toUpperCase()} ===`);
    for (const [entity, filename] of Object.entries(map)) {
      const matches = bestMatch(entity, hints[entity], kind, allPngs);
      const top = matches[0];
      const second = matches[1];

      if (!top) {
        console.log(`  GAP    ${pad(entity, 32)} → no candidate`);
        gaps.push({ entity, kind });
        continue;
      }

      const tight = !second || top.score - second.score >= 25;
      const destPath = join(REPO_ROOT, destDir, filename);

      if (tight && top.score >= 40) {
        console.log(`  OK     ${pad(entity, 32)} ← ${top.path.replace(SOURCE + '/', '')}  (score ${top.score})`);
        plan.push({ entity, kind, src: top.path, destPath });
      } else {
        console.log(`  AMBIG  ${pad(entity, 32)} top=${top.score}: ${top.path.replace(SOURCE + '/', '')}`);
        for (const c of matches.slice(1, 4)) {
          console.log(`         alt=${c.score}: ${c.path.replace(SOURCE + '/', '')}`);
        }
        ambiguous.push({ entity, kind, candidates: matches.slice(0, 4) });
      }
    }
  }

  console.log('\n──────────────── SUMMARY ────────────────');
  console.log(`  Confident matches: ${plan.length}`);
  console.log(`  Ambiguous:         ${ambiguous.length}`);
  console.log(`  Gaps:              ${gaps.length}`);

  if (ambiguous.length) {
    console.log('\nAmbiguous entries — review the candidates above. Either:');
    console.log('  • rename your source files to make the right one obvious, or');
    console.log('  • copy the right file by hand into the dest folder, or');
    console.log('  • add a hint to ENTITY_HINTS / LOCATION_HINTS / FILM_HINTS in this script.');
  }

  if (gaps.length) {
    console.log('\nGaps (no candidate at all):');
    for (const { entity, kind } of gaps) console.log(`  - [${kind}] ${entity}`);
    console.log('\nThese will keep falling back to the AI art (FALLBACK_TO_AI_WHEN_MISSING).');
  }

  if (!APPLY) {
    console.log('\nDRY RUN — no files copied. Re-run with --apply to perform the copy.\n');
    return;
  }

  console.log('\nCopying confident matches…');
  let copied = 0;
  for (const { src, destPath } of plan) {
    mkdirSync(dirname(destPath), { recursive: true });
    copyFileSync(src, destPath);
    copied++;
  }
  console.log(`Copied ${copied} files.`);
  console.log('\nNext steps:');
  console.log('  1. git status      # see what landed');
  console.log('  2. npm run build   # confirm Vite resolves every asset');
  console.log('  3. resolve any AMBIG entries by hand-copying the right files');
  console.log('  4. once happy, flip FALLBACK_TO_AI_WHEN_MISSING to false in');
  console.log('     src/types/gameData.ts so missing art is no longer hidden.');
  console.log('');
}

main();
