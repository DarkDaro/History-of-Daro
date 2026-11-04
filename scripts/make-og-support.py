#!/usr/bin/env python3
# ============================================================
# OG-обложка страницы «Поддержать автора» (/support).
# Из public/covers/support-beacon.png собирает
# public/covers/og-support.png (1200x630): затемнённый кадр
# передатчика + заголовок. Шрифт: DejaVu Sans (кириллица).
# Запуск: python3 scripts/make-og-support.py
# ============================================================

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
COVERS = ROOT / "public" / "covers"

W, H = 1200, 630
BG_TOP = (7, 7, 15)
BG_BOTTOM = (12, 12, 30)
CYAN = (0, 240, 255)
MAGENTA = (255, 42, 109)
WHITE = (240, 244, 255)
GREY = (150, 158, 180)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

src = Image.open(COVERS / "support-beacon.png").convert("RGB")

# Кадрирование 1200x630 из 1344x768: по центру, чуть выше середины
ratio = max(W / src.width, H / src.height)
resized = src.resize((round(src.width * ratio), round(src.height * ratio)), Image.LANCZOS)
x = (resized.width - W) // 2
y = max(0, (resized.height - H) // 3)  # берём верхнюю треть — там антенна
base = resized.crop((x, y, x + W, y + H))

# Затемнение и лёгкое размытие — текст должен читаться
base = ImageEnhance.Brightness(base).enhance(0.72)
base = base.filter(ImageFilter.GaussianBlur(1.2))

# Вертикальный градиент поверх кадра
grad = Image.new("RGB", (W, H), BG_TOP)
gd = ImageDraw.Draw(grad)
for row in range(H):
    t = row / H
    color = tuple(round(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3))
    gd.line([(0, row), (W, row)], fill=color)
overlay = Image.new("L", (W, H), 0)
od = ImageDraw.Draw(overlay)
for row in range(H):
    t = row / H
    od.line([(0, row), (W, row)], fill=round(150 + 110 * t))
img = Image.composite(grad, base, overlay)
d = ImageDraw.Draw(img)

# Неоновые скобки по углам (как Corners на сайте)
c = 44
for (cx, cy, dx, dy) in [(24, 24, 1, 1), (W - 24, 24, -1, 1), (24, H - 24, 1, -1), (W - 24, H - 24, -1, -1)]:
    d.line([(cx, cy), (cx + dx * c, cy)], fill=CYAN, width=3)
    d.line([(cx, cy), (cx, cy + dy * c)], fill=CYAN, width=3)

# Текст
f_kicker = ImageFont.truetype(FONT, 26)
f_title = ImageFont.truetype(FONT_BOLD, 78)
f_sub = ImageFont.truetype(FONT, 30)

d.text((70, 120), "ИСТОРИЯ ДАРО · ПОДДЕРЖКА ПЕРЕДАТЧИКА", font=f_kicker, fill=CYAN)
d.text((66, 178), "Поддержать", font=f_title, fill=WHITE)
d.text((66, 272), "автора", font=f_title, fill=WHITE)
d.line([(70, 396), (560, 396)], fill=MAGENTA, width=4)
d.text((70, 424), "Сайт живёт без рекламы и пейволла.", font=f_sub, fill=GREY)
d.text((70, 464), "Донат — энергия для передатчика.", font=f_sub, fill=GREY)

img.save(COVERS / "og-support.png", optimize=True)
print("OG done:", COVERS / "og-support.png")
