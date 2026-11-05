#!/bin/bash
# ============================================================
# ИСТОРИЯ ДАРО — батч 4: атмосферные сцены Хи-Мигаты для /gallery.
# Стиль — как gen_images.sh / gen_support_images.sh: неон
# циан/магента/янтарь, дождь, нуар, без текста. 1344x768.
# Результат: /tmp/scenes2/<name>.png -> оптимизация
#   python3 scripts/optimize-scenes-batch.py <name>...
#   -> public/img/scenes/scene-<name>.webp
# ============================================================
set -e
mkdir -p /tmp/scenes2

# 1) Чёрный рынок «Котёл» (Доки: импланты с ещё живых людей)
z-ai image -p "Underground black market bazaar in a cyberpunk megacity, cramped stalls selling glowing cybernetic implants and prosthetic arms under torn tarpaulin, hooded figures trading, hanging cables and steam, cyan and magenta neon signs reflecting in puddles, grimy dock district, dark cinematic wide shot, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/kotel.png -s 1344x768

# 2) Сектора «Чистильщиков» (банда, вырезающая железо у киборгов)
z-ai image -p "Gang of menacing silhouettes in gas masks and heavy coats walking through a steam-filled cyberpunk alley at night, carrying glowing red cutting tools, wet pavement with magenta neon reflections, industrial pipes overhead, threatening mood, cinematic composition, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/cleaners.png -s 1344x768

# 3) Объект «РХ» — Резонансный Охотник (телекинетический резонанс)
z-ai image -p "Lone cybernetic hunter standing on a rooftop edge in heavy rain, telekinetic distortion rippling the air around his outstretched hand, falling raindrops bending away from him, glowing cyan cracks in dark armor, megacity with magenta neon far below, ominous cinematic mood, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/hunter.png -s 1344x768

# 4) База «Периметр Зеро» (заброшенная станция сопротивления)
z-ai image -p "Hidden resistance base inside an abandoned underground metro station, makeshift server racks with cyan blinking lights, holographic city map floating over a central table, people in worn coats working, warm amber lamps against cold cyan glow, rainwater dripping from ceiling, dark cinematic atmosphere, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/perimeter.png -s 1344x768

# 5) Шпиль Технодоминуса (корпорация: сеть, вычисления, небо)
z-ai image -p "Colossal corporate arcology tower piercing smog in a cyberpunk megacity at night, sterile white and cyan lights, holographic rings rotating around the spire, searchlights scanning low clouds, flying vehicles in formation, cold authoritarian atmosphere, cinematic wide angle from street level, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/technodominus.png -s 1344x768

# 6) Проект «Доминатор» (орбитальная система Скорпиона над городом)
z-ai image -p "View from a rain-soaked cyberpunk city street looking straight up into the night sky, colossal orbital weapons platform glowing ominous amber above the cloud layer, framed by dark skyscrapers, magenta and cyan neon signs at the edges, tiny silhouettes of people stopping to look up, ominous cinematic mood, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/dominator.png -s 1344x768

# 7) Лаборатория «Синтеза» (тело в рассрочку: каталог в танках)
z-ai image -p "Sterile corporate cybernetics laboratory, rows of glass pod tanks filled with glowing cyan liquid and human silhouettes inside, surgical robotic arms, cold white-cyan light, magenta warning indicators, fog creeping on the floor, dystopian clean atmosphere, cinematic wide shot, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/lab.png -s 1344x768

# 8) Цех утилизации («оптимизация персонала»)
z-ai image -p "Dark industrial processing plant interior, endless conveyor line with mechanical arms sorting glowing cybernetic parts and cables, cyan arc lights and orange sparks, hanging chains, heavy shadows, dystopian factory atmosphere, cinematic wide shot, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/conveyor.png -s 1344x768

# 9) Эстакада между ярусами (транспорт верхних ярусов в дождь)
z-ai image -p "Elevated highway bridge between tiers of a cyberpunk megacity at night, stream of flying vehicles with light trails, heavy rain, pedestrians with umbrellas on a lower walkway, cyan and magenta neon reflections on wet asphalt, layered city depth fading into fog, cinematic wide shot, highly detailed digital painting, no text, no letters" -o /tmp/scenes2/skybridge.png -s 1344x768

echo "SCENES_BATCH4_DONE"
