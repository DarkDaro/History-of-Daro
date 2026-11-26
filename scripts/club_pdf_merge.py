# -*- coding: utf-8 -*-
"""Слияние обложки и тела клуба в один PDF, нормализация к A4."""
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89

def normalize_page_to_a4(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    if abs(w - A4_W) > 0.1 or abs(h - A4_H) > 0.1:
        page.scale_to(A4_W, A4_H)
    return page

writer = PdfWriter()
cover_page = PdfReader('/tmp/club_cover.pdf').pages[0]
writer.add_page(normalize_page_to_a4(cover_page))
for page in PdfReader('/tmp/club_body.pdf').pages:
    writer.add_page(normalize_page_to_a4(page))
writer.add_metadata({
    '/Title': 'Клуб «История Даро» — проект варианта А',
    '/Author': 'Z.ai',
    '/Creator': 'Z.ai',
    '/Subject': 'Проект клуба читателей цикла «История Даро»: Boosty-касса, вход по пропуску, схема и страницы',
})
out = '/home/z/my-project/download/club-design.pdf'
with open(out, 'wb') as f:
    writer.write(f)
print('merged →', out, '| pages:', len(writer.pages))
