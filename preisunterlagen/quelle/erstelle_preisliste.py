from pathlib import Path
import json
import re
from xml.etree import ElementTree as ET

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph


OUT = Path(__file__).resolve().parents[1]
BRAND = Path(__file__).resolve().parent / 'marke'
FONT_DIR = BRAND / 'Inter'
for weight in ('Regular', 'Medium', 'SemiBold'):
    pdfmetrics.registerFont(TTFont('Inter-' + weight, str(FONT_DIR / ('Inter-' + weight + '.ttf'))))
pdfmetrics.registerFontFamily('Inter', normal='Inter-Regular', bold='Inter-SemiBold', italic='Inter-Regular', boldItalic='Inter-SemiBold')

W, H = A4
M = 40
CW = W - 2 * M
DARK = '#15171C'
INK = '#252732'
MUTED = '#606471'
PALE = '#F4EEFC'
PAPER = '#F4F4F7'
ACCENT = '#C5ADEE'
PURPLE = '#7953A6'
LIGHT = '#F0F0F5'
GRAY = '#AEB0B9'
LINE = '#DADDE4'
WHITE = '#FFFFFF'
DATE = 'November 2026'

PRICES = {
    'basis': 1500,
    'komplett': 2500,
    'hosting': 69,
    'stunde': 95,
}
ORIGINAL = {'basis': 950, 'komplett': 1500, 'hosting': 49, 'stunde': 85}

LAYOUT_CHECKS = []


def euro(value):
    return f'{value:,.0f}'.replace(',', '.') + ' €'


def color(value):
    return HexColor(value)


def rect(c, x, top, w, h, fill, radius=0, stroke=None):
    c.setFillColor(color(fill))
    c.setStrokeColor(color(stroke or fill))
    c.setLineWidth(.55)
    if radius:
        c.roundRect(x, H - top - h, w, h, radius, fill=1, stroke=bool(stroke))
    else:
        c.rect(x, H - top - h, w, h, fill=1, stroke=bool(stroke))


def txt(c, x, top, value, size=10.5, weight='Regular', fill=INK, align='left'):
    c.setFillColor(color(fill))
    c.setFont('Inter-' + weight, size)
    baseline = H - top - size
    if align == 'right':
        c.drawRightString(x, baseline, value)
    else:
        c.drawString(x, baseline, value)


def wordmark(c, x, top, value='Schaf & Grimm', size=17, fill=INK):
    text = c.beginText(x, H - top - size)
    text.setFont('Inter-SemiBold', size)
    text.setFillColor(color(fill))
    text.setCharSpace(-.055 * size)
    text.textOut(value)
    c.drawText(text)


def para(c, x, top, w, value, size=10.4, leading=15.0, fill=INK,
         weight='Regular', max_height=None):
    value = re.sub(r'(?<=\d) (?=€)', '&nbsp;', value)
    style = ParagraphStyle(
        'text', fontName='Inter-' + weight, fontSize=size, leading=leading,
        textColor=color(fill), spaceBefore=0, spaceAfter=0,
        splitLongWords=False, allowWidows=0, allowOrphans=0,
    )
    p = Paragraph(value, style)
    pw, ph = p.wrap(w, H)
    if max_height is not None:
        assert ph <= max_height + .1, (value, ph, max_height)
    assert top >= 0 and top + ph <= H - 20, (value, top, ph)
    LAYOUT_CHECKS.append({'text': re.sub('<[^>]+>', '', value), 'top': top, 'height': ph, 'width': pw})
    p.drawOn(c, x, H - top - ph)
    return top + ph


def line(c, x, top, w, fill=LINE, width=.55):
    c.setStrokeColor(color(fill))
    c.setLineWidth(width)
    c.line(x, H - top, x + w, H - top)


def svg_segments(value):
    # Interpret the approved SVG paths verbatim; the mark is not recreated from letters.
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', value)
    i, command, x, y, start, control = 0, None, 0, 0, (0, 0), None
    arity = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4}
    result = []
    while i < len(tokens):
        if tokens[i].isalpha():
            command = tokens[i]
            i += 1
            if command == 'Z':
                result.append(('Z',))
                x, y = start
                control = None
                continue
        n = arity[command]
        a = [float(v) for v in tokens[i:i + n]]
        i += n
        if command == 'M':
            x, y = a
            start = (x, y)
            result.append(('M', x, y))
            command, control = 'L', None
        elif command == 'L':
            x, y = a
            result.append(('L', x, y))
            control = None
        elif command == 'H':
            x = a[0]
            result.append(('L', x, y))
            control = None
        elif command == 'V':
            y = a[0]
            result.append(('L', x, y))
            control = None
        elif command == 'C':
            result.append(('C', *a))
            control, (x, y) = (a[2], a[3]), a[4:6]
        elif command == 'S':
            reflected = (2 * x - control[0], 2 * y - control[1]) if control else (x, y)
            result.append(('C', *reflected, *a))
            control, (x, y) = (a[0], a[1]), a[2:4]
    return result


svg = ET.parse(BRAND / 'SG-Amethyst.svg')
SVG_SHAPES = [svg_segments(p.attrib['d']) for p in svg.getroot().iter('{http://www.w3.org/2000/svg}path')]


def logo(c, x, top, width=44, fill=PURPLE):
    scale = width / 64
    c.saveState()
    c.setFillColor(color(fill))
    c.translate(x - 4 * scale, H - top + 8 * scale)
    c.scale(scale, -scale)
    for segments in SVG_SHAPES:
        path = c.beginPath()
        for op, *v in segments:
            if op == 'M':
                path.moveTo(*v)
            elif op == 'L':
                path.lineTo(*v)
            elif op == 'C':
                path.curveTo(*v)
            else:
                path.close()
        c.drawPath(path, fill=1, stroke=0)
    c.restoreState()


def brand(c, dark=False, section='Preisübersicht'):
    logo(c, M, 36, 44, ACCENT if dark else PURPLE)
    wordmark(c, M + 60, 36, fill=LIGHT if dark else INK)
    txt(c, W - M, 34, section, 9, 'Medium', GRAY if dark else MUTED, 'right')
    txt(c, W - M, 48, DATE, 8.5, fill=GRAY if dark else MUTED, align='right')


def footer(c, page, pages, internal=False):
    line(c, M, 789, CW)
    txt(c, M, 801, 'Schaf & Grimm · Grimm & Schafheutle GbR', 8.0, fill=MUTED)
    label = 'Intern · Kalkulationsvorschlag' if internal else 'info@schafundgrimm.de'
    txt(c, M, 815, label, 8.0, fill=MUTED)
    if not internal:
        c.linkURL('mailto:info@schafundgrimm.de', (M, H - 827, M + 139, H - 814), relative=0, thickness=0)
    txt(c, W - M, 808, f'{page:02d} / {pages:02d}', 8.5, 'Medium', MUTED, 'right')


def bullet(c, x, top, w, value, fill=INK, size=10.1, leading=14.2, gap=9):
    rect(c, x, top + 5.0, 3.0, 3.0, PURPLE)
    bottom = para(c, x + 13, top, w - 13, value, size=size, leading=leading, fill=fill)
    return bottom + gap


def website_card(c, x, top, w, kind):
    is_full = kind == 'komplett'
    rect(c, x, top, w, 316, PALE if is_full else PAPER, radius=9)
    inset = x + 19
    txt(c, inset, top + 20, 'Website Komplett' if is_full else 'Website Basis', 16, 'SemiBold')
    txt(c, inset, top + 50, 'ab ' + euro(PRICES[kind]), 28, 'SemiBold', PURPLE if is_full else INK)
    txt(c, inset, top + 88, 'einmalig', 9.5, fill=MUTED)
    intro = ('Für Unternehmen, die ihre Inhalte selbst verwalten möchten.' if is_full else
             'Für einen professionellen Auftritt mit klaren Inhalten.')
    para(c, inset, top + 115, w - 38, intro, size=10.3, leading=14.5, fill=MUTED, max_height=43.5)
    line(c, inset, top + 161, w - 38, '#E2D5F6' if is_full else LINE)
    start = top + 178
    if is_full:
        txt(c, inset, start, 'Alles aus Basis, zusätzlich:', 10.2, 'SemiBold')
        start += 26
        features = [
            'Adminbereich zur Inhaltspflege',
            'SEO-Grundeinrichtung für Google',
            'Impressum &amp; Datenschutz<br/>auf Vorlagenbasis',
            'Einweisung in die Verwaltung',
        ]
    else:
        features = [
            'Design nach Ihren Wünschen',
            'Technische Umsetzung der Website',
            'Für Handy, Tablet und Desktop',
            'Einbindung Ihrer Texte und Bilder',
            'Abstimmung und technische Übergabe',
        ]
    for item in features:
        start = bullet(c, inset, start, w - 38, item, size=9.8, leading=13.4, gap=9)
    assert start <= top + 310, (kind, start, top)


def customer_pdf(path):
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1, invariant=1)
    c.setTitle('Websites & Betreuung | Preisliste | Schaf & Grimm')
    c.setAuthor('Schaf & Grimm - Grimm & Schafheutle GbR')
    c.setSubject('Richtpreise für Unternehmenswebsites, Hosting, Wartung und Weiterentwicklung. Stand November 2026.')
    c.setKeywords('Schaf & Grimm, Preisliste, Website, Webdesign, Hosting, Wartung')

    # Page 1: project prices.
    rect(c, 0, 0, W, 225, DARK)
    brand(c, dark=True)
    txt(c, M, 101, 'Ihre Website.', 28, 'SemiBold', LIGHT)
    txt(c, M, 137, 'Individuell umgesetzt.', 28, 'SemiBold', ACCENT)
    para(c, M, 186, CW, 'Wir gestalten Ihren Auftritt und setzen ihn technisch um.<br/>Sie wählen den Umfang, der zu Ihrem Unternehmen passt.', size=10.6, leading=15, fill=LIGHT)
    txt(c, M, 253, 'Website erstellen', 17, 'SemiBold')
    txt(c, W - M, 260, 'Zwei Pakete · einmalige Investition', 9.2, fill=MUTED, align='right')
    gap = 16
    card_w = (CW - gap) / 2
    website_card(c, M, 290, card_w, 'basis')
    website_card(c, M + card_w + gap, 290, card_w, 'komplett')

    para(c, M, 624, CW,
         '<b>SEO-Grundeinrichtung:</b> Seitentitel, Seitenbeschreibungen und technische Indexierbarkeit. '
         '<b>Rechtstexte:</b> Bereitstellung und Einbindung von Impressum und Datenschutzhinweisen auf Vorlagenbasis anhand Ihrer Angaben. '
         'Externe Lizenzen und juristische Prüfung werden bei Bedarf separat angeboten.',
         size=9.3, leading=13.6, fill=MUTED, max_height=54.4)
    txt(c, M, 698, 'Ihre Wünsche geben die Richtung vor.', 13, 'SemiBold')
    para(c, M, 720, CW,
         'Wir besprechen Gestaltung, Seitenumfang und Funktionen gemeinsam. Besondere Anforderungen '
         'wie Shops, Schnittstellen, Portale oder mehrere Sprachen kalkulieren wir individuell.',
         size=10.3, leading=14.5, max_height=29)
    txt(c, M, 765, 'Nettopreise für Geschäftskunden, zzgl. gesetzlicher Umsatzsteuer, soweit diese anfällt.', 8.5, fill=MUTED)
    footer(c, 1, 2)
    c.showPage()

    # Page 2: recurring operation and hourly work.
    brand(c, section='Hosting & Service')
    line(c, M, 83, CW)
    txt(c, M, 109, 'Online bleiben.', 26, 'SemiBold')
    txt(c, M, 143, 'Gut betreut.', 26, 'SemiBold', PURPLE)
    para(c, M, 190, CW,
         'Sie können Hosting und Betreuung direkt bei uns buchen.<br/>Auch die Bereitstellung auf Ihrem eigenen Hosting ist möglich.',
         size=10.6, leading=15, fill=MUTED)

    rect(c, M, 244, CW, 231, PALE, radius=9)
    txt(c, M + 20, 266, 'Hosting & Betreuung', 17, 'SemiBold')
    txt(c, W - M - 20, 260, euro(PRICES['hosting']), 30, 'SemiBold', PURPLE, 'right')
    txt(c, W - M - 20, 301, 'pro Monat', 9.5, fill=MUTED, align='right')
    para(c, M + 20, 302, 340,
         'Für den laufenden Betrieb Ihrer Website.', size=10.4, leading=15, fill=MUTED)
    line(c, M + 20, 333, CW - 40, '#E2D5F6')
    y = 349
    for item in [
        'Veröffentlichung, Hosting und SSL-Zertifikat',
        'Technische Routinewartung und Sicherheitsupdates',
        'Regelmäßige Backups und Funktionskontrollen',
        'Kleine Inhaltsänderungen bis 30 Minuten pro Monat',
    ]:
        y = bullet(c, M + 20, y, CW - 40, item, size=10.3, leading=14.5, gap=9)
    txt(c, M + 20, 450, 'Änderungszeit nicht übertragbar. Mehrarbeit nach Freigabe: ' + euro(PRICES['stunde']) + '/Stunde.', 8.7, fill=MUTED)

    rect(c, M, 491, CW, 122, PAPER, radius=9)
    txt(c, M + 20, 512, 'Wartung & Weiterentwicklung', 15, 'SemiBold')
    txt(c, W - M - 20, 512, euro(PRICES['stunde']), 27, 'SemiBold', INK, 'right')
    txt(c, W - M - 20, 549, 'pro Stunde', 9.5, fill=MUTED, align='right')
    para(c, M + 20, 546, 326,
         'Für einzelne Wartungsaufträge, neue Funktionen und Anpassungen. '
         'Auch bei eigenem Hosting. Zusatzarbeiten stimmen wir vor Beginn mit Ihnen ab.',
         size=10.3, leading=14.5, fill=MUTED, max_height=43.5)

    txt(c, M, 639, 'Das legen wir im Angebot fest', 13, 'SemiBold')
    col_gap = 24
    col_w = (CW - col_gap) / 2
    txt(c, M, 666, 'Umfang & Inhalte', 10.5, 'SemiBold')
    para(c, M, 686, col_w,
         'Seitenzahl, Funktionen, Korrekturschleifen und bereitgestellte Inhalte. '
         'Texterstellung, Fotos und größere Datenübernahmen nach Aufwand.',
         size=9.8, leading=14, fill=MUTED, max_height=70)
    x2 = M + col_w + col_gap
    txt(c, x2, 666, 'Hosting & Fremdkosten', 10.5, 'SemiBold')
    para(c, x2, 686, col_w,
         'Betriebsumfang, Vertragslaufzeit und Kündigung. Domains, E-Mail-Postfächer '
         'und kostenpflichtige Dienste nach Bedarf separat.',
         size=9.8, leading=14, fill=MUTED, max_height=70)
    para(c, M, 765, CW,
         'Unverbindliche Richtpreise. Verbindlich ist das individuelle Angebot. Alle Preise netto, zzgl. USt., soweit diese anfällt.',
         size=8.1, leading=11, fill=MUTED, max_height=11)
    footer(c, 2, 2)
    c.showPage()
    c.save()


def internal_pdf(path):
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1, invariant=1)
    c.setTitle('Basalic-Sonderkonditionen | Interner Preisvergleich | Schaf & Grimm')
    c.setAuthor('Schaf & Grimm - Grimm & Schafheutle GbR')
    c.setSubject('Interner Vergleich des bestehenden Basalic-Angebots mit vorgeschlagenen neuen Richtpreisen.')

    rect(c, 0, 0, W, 225, DARK)
    brand(c, dark=True, section='Intern · Nicht zur Weitergabe')
    txt(c, M, 101, 'Sonderpreis.', 28, 'SemiBold', LIGHT)
    txt(c, M, 137, 'Klar eingeordnet.', 28, 'SemiBold', ACCENT)
    para(c, M, 188, CW,
         'Das Basalic-Angebot als Sonderkondition für dieses Projekt.<br/>Die neuen Richtpreise als Ausgangspunkt für künftige Angebote.',
         size=10.6, leading=15, fill=LIGHT)

    txt(c, M, 252, 'Basalic im Vergleich', 17, 'SemiBold')
    cols = [M, 219, 311, 395, 481]
    ends = [M + 162, 293, 377, 463, W - M - 12]
    rect(c, M, 289, CW, 35, PAPER, radius=0)
    for i, label in enumerate(['Leistung', 'Richtpreis', 'Basalic', 'Nachlass', 'Rabatt']):
        txt(c, M + 12 if i == 0 else ends[i], 300, label, 9, 'Medium', MUTED, 'left' if i == 0 else 'right')
    rows = [
        ('Website Basis', 'einmalig', 'basis'),
        ('Website Komplett', 'einmalig', 'komplett'),
        ('Hosting & Betreuung', 'pro Monat', 'hosting'),
        ('Wartung / Anpassungen', 'pro Stunde', 'stunde'),
    ]
    for i, (name, unit, key) in enumerate(rows):
        top = 324 + i * 57
        if key == 'komplett':
            rect(c, M, top, CW, 57, PALE)
        txt(c, M + 12, top + 13, name, 10.2, 'SemiBold')
        txt(c, M + 12, top + 30, unit, 8.8, fill=MUTED)
        discount = PRICES[key] - ORIGINAL[key]
        pct = f'{discount / PRICES[key] * 100:.1f}'.replace('.', ',') + ' %'
        vals = [euro(PRICES[key]), euro(ORIGINAL[key]), euro(discount), pct]
        for j, val in enumerate(vals, 1):
            txt(c, ends[j], top + 19, val, 10.4, 'SemiBold' if j == 4 else 'Regular', PURPLE if j == 4 else INK, 'right')
        line(c, M, top + 57, CW)

    txt(c, M, 576, 'So nutzen wir die neuen Preise', 13, 'SemiBold')
    para(c, M, 600, CW,
         'Die Websitepakete starten künftig bei <b>' + euro(PRICES['basis']) + '</b> und <b>' + euro(PRICES['komplett']) + '</b>. '
         'Hosting und Betreuung liegen bei <b>' + euro(PRICES['hosting']) + '/Monat</b>, Einzelaufträge bei <b>' + euro(PRICES['stunde']) + '/Stunde</b>. '
         'Projektbezogene Rabatte weisen wir in neuen Angeboten gesondert aus.',
         size=10.4, leading=15, max_height=60)

    rect(c, M, 670, CW, 67, PAPER, radius=9)
    para(c, M + 16, 684, CW - 32,
         '<b>Für neue Angebote:</b> Mobile Optimierung ist in beiden Websitepaketen enthalten. '
         'Das Betreuungspaket umfasst bis zu 30 Minuten kleine Inhaltsänderungen pro Monat. '
         'Der vereinbarte Umfang des bestehenden Basalic-Angebots bleibt maßgeblich.',
         size=9.3, leading=13.5, max_height=40.5)

    para(c, M, 754, CW,
         'Rechnerischer Nachlass gegenüber den vorgeschlagenen Richtpreisen; gleiche Steuerbasis und vergleichbarer Umfang vorausgesetzt. '
         'Die Steuerbasis der ursprünglichen Beträge wurde nicht angegeben. Neue Richtpreise sind netto kalkuliert.',
         size=8.2, leading=11, fill=MUTED, max_height=33)
    footer(c, 1, 1, internal=True)
    c.showPage()
    c.save()


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    customer = OUT / 'Schaf-und-Grimm-Preisliste-Websites.pdf'
    internal = OUT / 'Schaf-und-Grimm-Preisvergleich-Basalic-intern.pdf'
    customer_pdf(customer)
    internal_pdf(internal)
    print(json.dumps({'files': [str(customer), str(internal)], 'paragraphs_checked': len(LAYOUT_CHECKS),
                      'prices': PRICES, 'basalic': ORIGINAL}, ensure_ascii=False))
