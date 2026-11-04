#!/bin/bash
# Изображения для страницы «Поддержать автора» (/support, BACKLOG п.16-смежное)
# Стиль — как у gen_images.sh: неон циан/магента, дождь, без текста.
set -e
mkdir -p /home/z/my-project/public/covers
cd /home/z/my-project/public/covers

# 1) Широкий кадр: передатчик сопротивления на крыше — визуальная метафора страницы
z-ai image -p "Lone radio transmitter tower with glowing cyan antenna light on a rooftop of a cyberpunk megacity at night, heavy rain, magenta and cyan neon holograms below, dark brooding atmosphere, cinematic wide shot, Blade Runner 2049 style, very dark tones suitable as website background, highly detailed digital painting, no text, no letters" -o "./support-beacon.png" -s 1344x768

# 2) Вертикальный кадр: уличный голо-терминал, рука вставляет светящуюся монету
z-ai image -p "Cyberpunk street kiosk terminal glowing with holographic cyan interface, anonymous figure in long coat inserting a glowing cyan coin into the slot, magenta neon reflections on wet pavement, night rain, dark cinematic mood, highly detailed digital painting, no text, no letters" -o "./support-terminal.png" -s 864x1152

echo "SUPPORT_IMAGES_DONE"
