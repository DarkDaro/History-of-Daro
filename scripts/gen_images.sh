#!/bin/bash
# Генерация визуальных ассетов для сайта «История Даро»
set -e
mkdir -p /home/z/my-project/public/covers
cd /home/z/my-project/public/covers

z-ai image -p "Cyberpunk book cover art, neon noir, lone woman in long coat standing in rain-soaked megacity street, towering skyscrapers, magenta and cyan neon holograms and signs, Blade Runner 2049 atmosphere, cinematic lighting, highly detailed digital painting, no text, no letters" -o "./book1.png" -s 768x1344

z-ai image -p "Cyberpunk book cover art, dystopian megacity towers rising above glowing cloud layer, glass and chrome skyscrapers, cyan and teal neon glow, flying vehicles, Ghost in the Shell atmosphere, cinematic, highly detailed digital painting, no text, no letters" -o "./book2.png" -s 768x1344

z-ai image -p "Cyberpunk book cover art, ruined neon city district at night, embers and ash floating in air, flickering magenta neon signs, silhouette of woman with cybernetic arm holding a katana, dark dystopian mood, cinematic, highly detailed digital painting, no text, no letters" -o "./book3.png" -s 768x1344

z-ai image -p "Vast cyberpunk megacity at night in the rain, seen from above, endless neon signs in cyan and magenta, flying cars with light trails, dense dark atmosphere, cinematic wide shot, very dark tones suitable as website background, highly detailed, no text, no letters" -o "./hero-city.png" -s 1440x720

echo "ALL_IMAGES_DONE"
