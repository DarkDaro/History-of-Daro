#!/bin/bash
# Генерация расширенного набора визуальных ассетов «Истории Даро».
# Результат: сырые PNG в /tmp/daro-assets, дальше их жмёт optimize-images.mjs.
set -u
RAW=/tmp/daro-assets
mkdir -p "$RAW"

gen() { # name, size, prompt
  local name="$1" size="$2" prompt="$3"
  if [ -s "$RAW/$name.png" ]; then echo "SKIP $name"; return 0; fi
  echo "GEN  $name ..."
  z-ai image -p "$prompt" -o "$RAW/$name.png" -s "$size" >/dev/null 2>&1 \
    && echo "OK   $name" || echo "FAIL $name"
}

STYLE="dark neo-noir cyberpunk digital painting, dystopia 2147, teal and magenta neon palette, rain and haze, cinematic lighting, gritty detail, no text, no letters, no watermark, no logo"

# ---------- Портреты персонажей (досье, 3:4) ----------
gen daro      864x1152 "Dossier portrait of a young man with a split personality, antihero: human half with tired sad eyes, dark alt-ego shadow silhouette overlapping his face like smoke, short dark hair, black high-collar techwear jacket, faint cyan circuit lines on neck, magenta neon rim light from left, cyan from right, blurred rainy megacity bokeh background, $STYLE"
gen ohotnik   864x1152 "Dossier portrait of a lost cybernetic assassin, hooded man, scarred face, one glowing red cybernetic eye, exposed cybernetic spinal connector at base of neck, worn dark armored suit, red alarm light and sparks behind him, dystopian laboratory corridor, $STYLE"
gen lina      864x1152 "Dossier portrait of a young woman, hacker and resistance leader, sharp confident gaze, short asymmetric dark hair, headphones around neck, dark jacket with glowing magenta circuit details, holographic code reflections on face, dark server racks behind, $STYLE"
gen aya       864x1152 "Dossier portrait of a young woman, communications operator, gentle cautious face, headset with microphone, cyan holographic radio map reflected on her skin, dark control room with glowing panels, $STYLE"
gen nemezida  864x1152 "Dossier portrait of a cyborg woman warrior, stoic beautiful face with cold stare, sleek cybernetic arm with magenta glow lines, black tactical suit, fragmented memory glitch effect across image, dark industrial background, $STYLE"
gen skorpion  864x1152 "Dossier portrait of a warlord in heavy armored exosuit, scarred face half hidden by respirator mask, amber glowing visor slits, massive silhouette, drone swarm in dark sky behind, $STYLE"
gen raiz      864x1152 "Dossier portrait of a calm middle-aged corporate director, silver-streaked hair, precise grey suit, subtle glowing cyan pin on lapel, cold calculating eyes, dark skyscraper office with holographic charts, $STYLE"
gen hugo      864x1152 "Dossier portrait of an underground information broker, man with easy smirk, amber-tinted goggles pushed up on forehead, layered worn techwear coat, dim black market alley with neon haze behind, $STYLE"
gen darkdarus 864x1152 "Abstract portrait of an ancient dark entity, humanoid silhouette of black smoke and violet-magenta lightning, no face, dissolving into tendrils, cosmic dread inside neon darkness, $STYLE"

# ---------- Широкие сцены (16:8) ----------
gen pobeg      1344x768 "Wide cinematic shot, dark laboratory corridor flooded with blood-red alarm light, sparks falling from torn ceiling panels, wrecked robotic guards on floor, hooded figure with glowing energy rifle walking away from camera into shadows, $STYLE"
gen world      1344x768 "Street level of a dystopian megacity under a giant glowing dome, filtered rain, crowds in dark coats under neon signs, colossal corporate tower looming, wet asphalt reflections, $STYLE"
gen implants   1344x768 "Extreme macro close-up of a cybernetic spine implant with glowing neural ports along a human neck, cyan interface light, dark clinical room with magenta accents, $STYLE"
gen armory     1344x768 "Dark weapons locker wall: curved katana, energy carbine and pulse rifles on magnetic racks, amber and cyan indicator lights, welding sparks in background, $STYLE"
gen story      1344x768 "Five silhouetted figures on a rooftop seen from behind, overlooking vast neon megacity at night in the rain, cyan and magenta city glow, dark but hopeful mood, $STYLE"

echo "ALL_DONE"
