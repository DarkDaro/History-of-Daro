# -*- coding: utf-8 -*-
"""Тело PDF «Клуб Истории Даро — проект варианта А» (ReportLab, TOC, Template 07 body palette)."""
import os, sys, hashlib

PDF_SKILL_DIR = '/home/z/my-project/skills/pdf'
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, 'scripts'))

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, KeepTogether, CondPageBreak, HRFlowable)
from reportlab.platypus.tableofcontents import TableOfContents

# ── шрифты ────────────────────────────────────────────────────────────────
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', f'{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf'))
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')
registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold',
                   italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

from pdf import install_font_fallback
install_font_fallback()

# ── палитра Template 07 Crystal Blue (фиксированная, тело) ────────────────
PAGE_BG      = colors.HexColor('#f5f8fc')   # XL
CARD_BG      = colors.HexColor('#e4ecf5')   # L
TABLE_STRIPE = colors.HexColor('#eef3fa')   # L
HEADER_FILL  = colors.HexColor('#1a4a7a')   # M
BORDER       = colors.HexColor('#c0d0e2')   # S
ACCENT       = colors.HexColor('#2d7ab3')   # XS
TEXT_PRIMARY = colors.HexColor('#142840')
TEXT_MUTED   = colors.HexColor('#5a7a96')

# ── геометрия ─────────────────────────────────────────────────────────────
MARGIN = 62
TOP, BOTTOM = 74, 64
PAGE_W, PAGE_H = A4
AVAIL = PAGE_W - 2 * MARGIN
AVAIL_H = PAGE_H - TOP - BOTTOM
DOC_TITLE = 'Клуб «История Даро» — проект варианта А'

# ── стили ─────────────────────────────────────────────────────────────────
S = {}
S['h1'] = ParagraphStyle('H1', fontName='FreeSerif', fontSize=19, leading=25,
                         textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=4)
S['h2'] = ParagraphStyle('H2', fontName='FreeSerif', fontSize=13.5, leading=18,
                         textColor=HEADER_FILL, spaceBefore=14, spaceAfter=6)
S['body'] = ParagraphStyle('Body', fontName='FreeSerif', fontSize=10.5, leading=16.5,
                           textColor=TEXT_PRIMARY, alignment=TA_LEFT,
                           spaceBefore=0, spaceAfter=8)
S['bullet'] = ParagraphStyle('Bullet', parent=S['body'], leftIndent=16,
                             bulletIndent=4, spaceAfter=5)
S['caption'] = ParagraphStyle('Caption', fontName='FreeSerif', fontSize=8.5, leading=11,
                              textColor=TEXT_MUTED, alignment=TA_CENTER,
                              spaceBefore=3, spaceAfter=6)
S['th'] = ParagraphStyle('TH', fontName='FreeSerif', fontSize=9.5, leading=12.5,
                         textColor=colors.white, alignment=TA_LEFT)
S['td'] = ParagraphStyle('TD', fontName='FreeSerif', fontSize=9.5, leading=12.5,
                         textColor=TEXT_PRIMARY, alignment=TA_LEFT)
S['tdb'] = ParagraphStyle('TDB', parent=S['td'])
S['code'] = ParagraphStyle('Code', fontName='DejaVuSans', fontSize=7.6, leading=10.2,
                           textColor=TEXT_PRIMARY)
S['stat'] = ParagraphStyle('Stat', fontName='FreeSerif', fontSize=19, leading=23,
                           textColor=ACCENT, alignment=TA_CENTER)
S['statlbl'] = ParagraphStyle('StatLbl', fontName='FreeSerif', fontSize=8, leading=10.5,
                              textColor=TEXT_MUTED, alignment=TA_CENTER)
S['toc0'] = ParagraphStyle('TOC0', fontName='FreeSerif', fontSize=11.5, leading=20,
                           textColor=TEXT_PRIMARY, leftIndent=6)
S['toctitle'] = ParagraphStyle('TOCTitle', fontName='FreeSerif', fontSize=19, leading=25,
                               textColor=TEXT_PRIMARY, spaceAfter=14)

# ── документ с TOC ────────────────────────────────────────────────────────
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            # номер в оглавлении = номер в футере (тело начинается с 1 после страницы «Содержание»)
            self.notify('TOCEntry', (level, text, self.page - 1, key))

    def beforePage(self):
        c = self.canv
        n = c.getPageNumber()
        c.saveState()
        # фон страницы (XL-тир)
        c.setFillColor(PAGE_BG)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        # колонтитул сверху
        c.setFont('FreeSerif', 7.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(MARGIN, PAGE_H - 40, DOC_TITLE.upper())
        c.setStrokeColor(ACCENT)
        c.setLineWidth(1.2)
        c.line(MARGIN, PAGE_H - 48, PAGE_W - MARGIN, PAGE_H - 48)
        # футер
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.line(MARGIN, 42, PAGE_W - MARGIN, 42)
        c.setFont('FreeSerif', 7.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(MARGIN, 30, 'Проект клуба · решение автора 2026-11-27')
        page_label = 'i' if n == 1 else str(n - 1)
        c.drawRightString(PAGE_W - MARGIN, 30, page_label)
        c.restoreState()

def h1(text):
    key = 'h_' + hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/><b>%s</b>' % (key, text), S['h1'])
    p.bookmark_name = key
    p.bookmark_level = 0
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def section(story, text, first_para=None):
    """H1 с защитой от сироты + акцентная линия + первый абзац."""
    story.append(CondPageBreak(AVAIL_H * 0.25))
    head = [h1(text),
            HRFlowable(width='100%', thickness=1.2, color=ACCENT,
                       spaceBefore=0, spaceAfter=10)]
    if first_para is not None:
        story.append(KeepTogether(head + [first_para]))
    else:
        story.append(KeepTogether(head))

def P(text, style='body'):
    return Paragraph(text, S[style])

def make_table(header, rows, ratios, stripe=True):
    data = [[Paragraph('<b>%s</b>' % c, S['th']) for c in header]]
    for r in rows:
        data.append([Paragraph(c, S['td']) for c in r])
    widths = [x * AVAIL for x in ratios]
    assert sum(widths) <= AVAIL + 0.5
    t = Table(data, colWidths=widths, hAlign='CENTER', repeatRows=1)
    st = [
        ('BACKGROUND', (0, 0), (-1, 0), HEADER_FILL),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    if stripe:
        for i in range(1, len(data)):
            st.append(('BACKGROUND', (0, i), (-1, i),
                       colors.white if i % 2 == 1 else TABLE_STRIPE))
    t.setStyle(TableStyle(st))
    return t

def add_table(story, title_text, header, rows, ratios, caption=None):
    tbl = make_table(header, rows, ratios)
    if len(rows) <= 12:
        story.append(KeepTogether([P('<b>%s</b>' % title_text, 'body'), Spacer(1, 6), tbl]))
    else:
        story.append(P('<b>%s</b>' % title_text, 'body'))
        story.append(Spacer(1, 6))
        story.append(tbl)
    if caption:
        story.append(Paragraph(caption, S['caption']))
    story.append(Spacer(1, 10))

# ── сборка ────────────────────────────────────────────────────────────────
story = []

# Содержание
story.append(Paragraph('<b>Содержание</b>', S['toctitle']))
toc = TableOfContents()
toc.levelStyles = [S['toc0']]
story.append(toc)
story.append(PageBreak())

# 1. Решение и рамки
section(story, '1. Решение и рамки',
    P('Этот документ фиксирует проект клуба читателей цикла «История Даро». '
      'Решение принято автором 27 ноября 2026 года: выбран вариант «А» — Boosty '
      'принимает деньги, сайт остаётся витриной, клуб пускает и бесплатных '
      'участников, и платных подписчиков. Регистрации юридического лица и '
      'собственного платёжного кода не требуется: приём денег, чеки и споры '
      'остаются на стороне платформы.'))
story.append(P('Слои системы разнесены сознательно. Касса живёт в Boosty, вход и закрытая '
      'зона — в клубном приложении, витрина остаётся статикой на GitHub Pages и '
      'от бекенда не зависит. Такое разделение означает, что половину «фуллстека» '
      '— самую тяжёлую часть — мы не пишем вовсе, а сайт не ломается ни при каком '
      'раскладе с клубом.'))
add_table(story, 'Таблица 1. Зафиксированные решения',
    ['Вопрос', 'Решение'],
    [['Деньги', 'Boosty: касса, уровни, чеки, отмены — всё на платформе'],
     ['Полный текст романа', 'Boosty, закрытые посты по уровням'],
     ['Витрина', 'Остаётся статикой на GitHub Pages, бекенд туда не возвращается'],
     ['Клуб', 'Маршруты /club внутри того же приложения, полная сборка (standalone)'],
     ['Вход', 'Email-код и пропуск Boosty. Паролей нет — их нечем украсть'],
     ['ИП и мерчант', 'Не нужны: приём денег не наш код'],
     ['Демо-том', 'Расширение /excerpts, без бекенда']],
    [0.28, 0.72])

stats = Table([[
    Paragraph('<b>0</b>', S['stat']), Paragraph('<b>4</b>', S['stat']),
    Paragraph('<b>6</b>', S['stat']), Paragraph('<b>0</b>', S['stat'])], [
    Paragraph('паролей<br/>в базе', S['statlbl']),
    Paragraph('уровня<br/>доступа', S['statlbl']),
    Paragraph('чанков<br/>внедрения', S['statlbl']),
    Paragraph('руб. своей<br/>кассы', S['statlbl'])]],
    colWidths=[AVAIL * 0.25] * 4, hAlign='CENTER')
stats.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
    ('BOX', (0, 0), (-1, -1), 1, ACCENT),
    ('LINEBEFORE', (1, 0), (-1, -1), 0.5, BORDER),
    ('TOPPADDING', (0, 0), (-1, 0), 10), ('BOTTOMPADDING', (0, 1), (-1, 1), 10),
    ('TOPPADDING', (0, 1), (-1, 1), 2), ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')]))
story.append(KeepTogether([Spacer(1, 4), stats, Spacer(1, 12)]))

# 2. Роли и вход
section(story, '2. Роли и вход: пропуск вместо паролей',
    P('Принцип входа: хранить и шифровать пароли не нужно, потому что паролей '
      'нет вообще. Вместо них — одноразовый код из письма и пропуск Boosty для '
      'платных уровней. Это снимает целый класс рисков: в базе нет пары '
      '«логин — хэш пароля», которую можно украсть или подобрать, а восстановление '
      'доступа сводится к повторной отправке кода.'))
story.append(P('Поток входа выглядит так. Участник вводит email на странице /club — сервер '
      'шлёт одноразовый код из шести цифр, который живёт десять минут и хранится '
      'только в виде хэша. После ввода кода создаётся запись участника или '
      'находится старая, и выдаётся подписанная сессионная cookie; уровень по '
      'умолчанию — «Гость». Подписчик Boosty вводит в кабинете код-пропуск вида '
      '«ПЕРИМ-ХХХХ» из закрытого поста своего уровня — код привязывается к email '
      'и повышает доступ. Отмена подписки отрабатывается вручную: автор отзывает '
      'пропуск, пока участников мало, а админ-страница появится после первых '
      'десяти человек.'))
story.append(P('Механика выдачи пропусков на стороне Boosty проста: в закрытом посте '
      'каждого уровня лежит код. При утечке или смене кода автор правит пост и '
      'отзывает старый код одним запросом к базе. Когда участников станет больше '
      'тридцати, таблица пропусков готова к переходу на пул одноразовых кодов — '
      'схема изначально спроектирована под это, менять структуру не придётся.'))

# 3. Уровни поддержки
section(story, '3. Уровни поддержки',
    P('Каркас выгод построен накопительно: каждый уровень включает всё предыдущего. '
      'Цены в таблице — ориентир для старта, финальные значения автор называет при '
      'настройке Boosty: платформа позволяет любую цену и ежемесячное списание. '
      'Главный принцип воронки — бесплатный «Гость» уже получает ценность (ленту, '
      'демо-том, RSS), а платные уровни добавляют близость к автору и полный текст '
      'романа, а не «убирают ограничения».'))
add_table(story, 'Таблица 2. Каркас уровней',
    ['Уровень', 'Что даёт', 'Ориентир цены'],
    [['Гость (бесплатно)', 'Читать ленту вопросов и ответов, демо-том на витрине, RSS, один вопрос в месяц в общей очереди', '0 руб.'],
     ['Уровень 1', 'Приоритет в очереди вопросов, голос за тему очередного разбора мира, ранние анонсы глав', 'ок. 100 руб./мес'],
     ['Уровень 2', 'Вопросы без месячного лимита, полный текст романа в Boosty\u00A0— закрытые посты по главам', 'ок. 300 руб./мес'],
     ['Уровень 3', 'Вопрос вне очереди с ответом в течение недели, имя в благодарностях тома, раз в месяц — выбор темы хронологии', 'ок. 700 руб./мес']],
    [0.2, 0.57, 0.23])
story.append(P('Названия уровней предлагается взять из мира цикла. Ниже три набора — '
      'выбор за автором. Набор «А» опирается на сопротивление «Периметр Зеро», '
      'набор «Б» — на радиообразы сайта и эмбиент «Эфир», набор «В» — на '
      'корпоративную иронию: Даро в каноне — «актив, ушедший с баланса».'))
add_table(story, 'Таблица 3. Варианты названий уровней',
    ['Набор', 'Уровень 1', 'Уровень 2', 'Уровень 3'],
    [['А', 'Слушающий', 'Связной', 'Периметр'],
     ['Б', 'Приёмник', 'Частота', 'Эфир'],
     ['В', 'Стажёр баланса', 'Актив', 'Вне баланса']],
    [0.13, 0.29, 0.29, 0.29],
    caption='Таблица 3. Выбор набора названий — за автором; каркас выгод не зависит от выбора')

# 4. Схема данных
section(story, '4. Схема данных',
    P('База — Postgres на Vercel или Neon при деплое в облако, SQLite при переезде '
      'на VPS: схема одинаковая, источник данных меняется одной строкой '
      'конфигурации. Шесть моделей покрывают весь клуб: участники, пропуска, '
      'вопросы и ответы, обратная связь и метаданные глав романа. Шаблонные '
      'модели User и Post из стартового скаффолда заменяются первым чанком — по '
      'правилу репозитория «ничего не удалять напрямую» старый текст выводится '
      'в комментарий журнала отключений.'))
story.append(P('Очередь вопросов сортируется по уровню: «Периметр», затем «Связной», '
      'затем «Слушающий», затем «Гость»; внутри уровня — по времени. Лимиты '
      'уровней проверяются кодом приложения, а не структурой базы — это позволяет '
      'менять правила без миграций. Поле body у метаданных глав — резерв: хранить '
      'ли текст глав на сайте, автор решит позже, и заложенное поле избавит от '
      'миграции, если решение будет положительным.'))

PRISMA = [
 'model Member {',
 '  id          String    @id @default(cuid())',
 '  email       String    @unique',
 '  callsign    String?   // позывной в клубе, виден в ленте',
 '  level       String    @default("guest") // guest | l1 | l2 | l3',
 '  createdAt   DateTime  @default(now())',
 '  lastSeenAt  DateTime?',
 '  questions   Question[]',
 '}',
 '',
 'model Pass {',
 '  id          String    @id @default(cuid())',
 '  code        String    @unique // ПЕРИМ-ХХХХ',
 '  level       String    // l1 | l2 | l3',
 '  memberId    String?',
 '  member      Member?   @relation(fields: [memberId], references: [id])',
 '  issuedAt    DateTime  @default(now())',
 '  activatedAt DateTime?',
 '  revokedAt   DateTime? // отзыв при отмене подписки',
 '  note        String?   // «утечка — перевыпуск 2026-12-05»',
 '}',
 '',
 'model Question {',
 '  id        String    @id @default(cuid())',
 '  memberId  String',
 '  member    Member    @relation(fields: [memberId], references: [id])',
 '  body      String    // текст вопроса, до 2000 символов',
 '  status    String    @default("queued") // queued | answered | withdrawn',
 '  createdAt DateTime  @default(now())',
 '  answers   Answer[]',
 '}',
 '',
 'model Answer {',
 '  id          String   @id @default(cuid())',
 '  questionId  String',
 '  question    Question @relation(fields: [questionId], references: [id])',
 '  body        String',
 '  publishedAt DateTime @default(now())',
 '}',
 '',
 'model Feedback {',
 '  id        String   @id @default(cuid())',
 '  name      String?  // имя, необязательно',
 '  email     String   // без ответа не бывает — email обязателен',
 '  body      String',
 '  createdAt DateTime @default(now())',
 '  status    String   @default("new") // new | read',
 '}',
 '',
 'model ChapterMeta {',
 '  id      String  @id @default(cuid())',
 '  volume  Int     // том 1..3',
 '  number  Int     // номер главы в томе',
 '  title   String',
 '  status  String  // draft | on-boosty | published',
 '  body    String? // резерв: решение о хранении текста глав — позже',
 '}',
]
code_rows = [[Paragraph(esc if False else (l.replace('&', '&').replace('<', '<').replace('>', '>') or ' '), S['code'])]
             for l in PRISMA]
code_tbl = Table(code_rows, colWidths=[AVAIL], hAlign='CENTER')
code_tbl.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
    ('LINEBEFORE', (0, 0), (0, -1), 2.5, ACCENT),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 0.5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ('TOPPADDING', (0, 0), (-1, 0), 8),
    ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
]))
story.append(P('<b>Листинг 1. Эскиз Prisma-схемы клуба</b>', 'body'))
story.append(Spacer(1, 4))
story.append(code_tbl)
story.append(Paragraph('Листинг 1. Шесть моделей клуба; datasource выбирается при деплое', S['caption']))
story.append(Spacer(1, 8))

# 5. Страницы клуба
section(story, '5. Страницы клуба',
    P('Клуб живёт на четырёх маршрутах внутри того же приложения и переиспользует '
      'готовую систему оформления сайта: неоновую палитру, HUD-рамки, шрифты '
      'Russo One, Play и JetBrains Mono, эффекты из модуля cyber. Отдельная '
      'ветка кода не нужна — и контент-модули канона, и компоненты доступны '
      'клубным страницам напрямую.'))
add_table(story, 'Таблица 4. Маршруты и поведение',
    ['Маршрут', 'Блоки', 'Поведение'],
    [['/club', 'Вход: email, затем код; поле «есть пропуск Boosty»', 'Без сессии доступен только этот маршрут и /club/feedback'],
     ['/club/qa', 'Лента вопросов со статусами: В ОЧЕРЕДИ, ОТВЕЧЕНО, СНЯТО; форма вопроса с лимитом уровня', 'Вопрос видят все участники; ответы пишет только автор, от его имени — без дискуссий'],
     ['/club/me', 'Кабинет: карточка уровня, статус пропуска, мои вопросы, активация пропуска, выход', 'Активация пропуска повышает уровень сразу'],
     ['/club/feedback', 'Форма: имя (необязательно), email, текст', 'Доступна без входа; пишет в базу и шлёт письмо-уведомление автору']],
    [0.17, 0.42, 0.41])
story.append(P('В шапке сайта появляется отдельный пункт навигации со ссылкой на адрес '
      'клубного приложения. Витрина при этом остаётся статической сборкой: '
      'клубные маршруты исключаются из экспорта той же механикой, что уже '
      'используется для releases и download.html в build-static.mjs, поэтому '
      'GitHub Pages не увидит ни одного клубного следа.'))

# 6. Админ-минимум
section(story, '6. Админ-минимум',
    P('До первых десяти участников административные операции выполняются '
      'SQL-запросами: ответ на вопрос, отзыв пропуска, отметка письма '
      'прочитанным. Набор запросов хранится в этом документе и пополняется по '
      'мере появления операций — это честнее преждевременной админ-панели. '
      'Страница /club/admin с входом только по email автора выделяется в '
      'отдельный чанк после того, как ручные операции станут ощутимы по времени.'))
story.append(P('Практический объём ручной работы на старте — минуты в неделю: '
      'выдать пропуск новому подписчику не нужно, код лежит в закрытом посте; '
      'ответить на вопросы и, изредка, отозвать пропуск при отмене подписки. '
      'Автоматизация оправдана, когда таких операций наберётся больше десятка '
      'в неделю.'))

# 7. Демо-том
section(story, '7. Демо-том на витрине',
    P('Раздел /excerpts дополняется маршрутом «Демо-том»: подборка фрагментов, '
      'расставленных как маршрут чтения первой главы, плюс блок «Полный текст — '
      'на Boosty» со ссылкой на блог. Контент живёт в модуле src/content, сборка '
      'остаётся статической, бекенд не требуется.'))
story.append(P('Это и есть воронка без единой строки платёжного кода: гость читает '
      'демо-том на витрине, участник платного уровня переходит в Boosty за '
      'полным текстом, а вопросы задаёт уже в клубе. Каждая точка маршрута '
      'остаётся на своей площадке — сайт не превращается в кассу, Boosty не '
      'становится читалкой сайта.'))

# 8. Хостинг
section(story, '8. Хостинг и внешние зависимости',
    P('Для клуба выбирается один из двух носителей. Первый — Vercel Hobby: '
      'бесплатно, но по правилам платформы тариф предназначен для некоммерческого '
      'использования; клуб, не проводящий платежи через сайт, находится в серой '
      'зоне — риск осознанный. Второй — VPS у российского провайдера: оплата по '
      'СБП или картой «Мир» без региональных ограничений, тот же standalone-сервер '
      'и уже лежащий в репозитории Caddyfile.'))
add_table(story, 'Таблица 5. Варианты инфраструктуры',
    ['Слой', 'Вариант 1', 'Вариант 2'],
    [['Приложение', 'Vercel Hobby — 0 руб.; формально некоммерческий тариф, осознанный риск', 'VPS в РФ (Timeweb, Selectel); standalone плюс Caddyfile'],
     ['База', 'Postgres: Neon или Supabase, бесплатные планы', 'SQLite в файле на VPS'],
     ['Письма', 'Resend, бесплатный лимит около 100 писем в сутки — уточнить при подключении', 'SMTP собственного домена']],
    [0.18, 0.42, 0.4])
story.append(P('Резервный путь входа описан заранее: если почтовая интеграция не '
      'взлетит, клуб пускает только по пропуску Boosty, а бесплатных участников '
      'автор вносит вручную тем же SQL-минимумом. Схема и страницы при этом не '
      'меняются. Доступность из России у Vercel сейчас есть; при блокировках '
      'переезд на VPS сводится к замене двух переменных окружения.'))

# 9. План Boosty
section(story, '9. План автора на Boosty (вне кода)',
    P('Пять шагов подготовки платформы, которые не требуют кода и выполняются '
      'в интерфейсе Boosty.'))
for i, t in enumerate([
    'Завести аккаунт и оформить блог «История Даро»: шапка, описание, обложка — переиспользовать OG-картинки сайта.',
    'Создать три уровня: названия из раздела 3, цены автор определяет сам.',
    'В закрытый пост каждого уровня положить код-пропуск вида «ПЕРИМ-ХХХХ».',
    'Настроить приветственное сообщение подписчику: адрес клуба и два шага входа.',
    'Разместить полный текст романа: закрытые посты по главам для уровня 2 и выше; открытые посты — анонсы и свободные главы для уровня 1.'], 1):
    story.append(P('<b>%d.</b> %s' % (i, t), 'bullet'))

# 10. Этапы
section(story, '10. Этапы внедрения',
    P('Работа разбита на шесть чанков по правилу репозитория «один коммит — одна '
      'причина». Витринный чанк идёт через стандартный пайплайн репозитория; '
      'клубные — через полную сборку и деплой клубного приложения. Пуш возможен '
      'после возврата токена: коммит проекта клуба уже лежит в локальной истории.'))
add_table(story, 'Таблица 6. Чанки внедрения',
    ['№', 'Чанк', 'Проверки'],
    [['1', 'Схема Prisma, замена шаблона User и Post, миграции на пустой базе', 'prisma migrate dev, lint, tsc'],
     ['2', 'Вход по email-коду на /club', 'ручной прогон и смоук API'],
     ['3', 'Пропуска и кабинет на /club/me', 'ручной прогон: активация, отзыв, смена уровня'],
     ['4', 'Лента вопросов и ответов на /club/qa', 'ручной прогон: лимиты уровней, очередь, статусы'],
     ['5', 'Обратная связь на /club/feedback', 'проверка honeypot, лимит с IP, письмо-уведомление'],
     ['6', 'Демо-том на витрине', 'build:static, check-content, smoke']],
    [0.08, 0.52, 0.4])

# 11. Риски
section(story, '11. Риски',
    P('Каждый риск ниже имеет заранее описанное лечение — это позволяет принять '
      'их осознанно, а не обнаружить в моменте.'))
for t in [
    '<b>Vercel Hobby формально некоммерческий.</b> Клуб не проводит платежи через сайт — касса в Boosty, но при необходимости чистоты переезд на VPS описан в разделе 8.',
    '<b>Код уровня может утечь.</b> Цена утечки — чужой вход под чужим уровнем; лечение — перевыпуск за минуту. При росте клуба — пул одноразовых кодов.',
    '<b>Бесплатные лимиты конечны.</b> Resend и Neon при росте до сотен участников потребуют платный план или переезд на SMTP и VPS.',
    '<b>Один код на уровень не даёт статистики.</b> Кто именно подписан, видно только в Boosty; связь «email — подписка» устанавливает сам участник, активируя пропуск. Для клуба этого достаточно.']:
    story.append(P(t, 'bullet'))

# 12. Возврат
section(story, '12. Возврат и отключение',
    P('Клуб — новые маршруты и новые файлы: существующие не тронуты, витрина '
      'собирается и живёт как раньше. Отключение клуба — убрать клубные маршруты '
      'из исключений статического экспорта и перестать деплоить полную сборку; '
      'схема Prisma и этот документ остаются в репозитории как проект с путём '
      'возврата. Удаление — только отдельным чанком с причиной, по правилу '
      '«ничего не удалять напрямую».'))
story.append(P('Следующий шаг за автором: выбрать набор названий уровней и цены, '
      'завести блог на Boosty и сказать «начинаем» — после этого стартует чанк 1 '
      'со схемой Prisma.'))

# ── сборка ────────────────────────────────────────────────────────────────
out = '/tmp/club_body.pdf'
doc = TocDocTemplate(out, pagesize=A4,
                     leftMargin=MARGIN, rightMargin=MARGIN,
                     topMargin=TOP, bottomMargin=BOTTOM,
                     title=DOC_TITLE, author='Z.ai', creator='Z.ai',
                     subject='Проект клуба читателей цикла «История Даро»: вариант А, Boosty-касса, вход по пропуску')
doc.multiBuild(story)
print('OK, pages:', doc.page)
