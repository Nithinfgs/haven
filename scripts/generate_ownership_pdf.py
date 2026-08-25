import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfgen import canvas

pdf_filename = "/Users/nithinselvaraj/Desktop/haven/HAVEN_SOLE_OWNERSHIP_DECLARATION.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        page_count = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(page_count)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (page 2+)
        if self._pageNumber > 1:
            self.drawString(45, letter[1] - 30, "HAVEN PLATFORM — MASTER PROPRIETARY & SOLE OWNERSHIP DECLARATION")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(45, letter[1] - 34, letter[0] - 45, letter[1] - 34)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 45, 25, footer_text)
        self.drawString(45, 25, "CONFIDENTIAL & LEGALLY BINDING — SOLE OWNER: NITHIN SELVARAJ")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(45, 34, letter[0] - 45, 34)
        self.restoreState()

doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=45,
    leftMargin=45,
    topMargin=45,
    bottomMargin=45
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=16,
    leading=20,
    textColor=colors.HexColor('#1E1B4B'),
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=13,
    textColor=colors.HexColor('#4338CA'),
    spaceAfter=8
)

h1_style = ParagraphStyle(
    'SectionH1',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#1E1B4B'),
    spaceBefore=8,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#334155'),
    spaceAfter=5
)

meta_style = ParagraphStyle(
    'MetaText',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#64748B'),
    spaceAfter=6
)

table_header_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#1E1B4B')
)

table_cell_style = ParagraphStyle(
    'TableCell',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10.5,
    textColor=colors.HexColor('#334155')
)

highlight_style = ParagraphStyle(
    'HighlightCell',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#4338CA')
)

story = []

# Title & Metadata
story.append(Paragraph("HAVEN PLATFORM — MASTER PROPRIETARY, FOUNDER & IP DECLARATION", title_style))
story.append(Paragraph("LEGAL INSTRUMENT OF SOLE OWNERSHIP, INTELLECTUAL PROPERTY & FULL ASSET ALLOCATION", subtitle_style))
story.append(Paragraph("<b>Effective Date:</b> August 25, 2026 | <b>Jurisdiction:</b> Republic of India | <b>Governing Law:</b> Indian Copyright Act (1957) Sec 19", meta_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4338CA'), spaceAfter=8))

# Preamble
preamble = """
This <b>Master Proprietary, Founder & Intellectual Property Declaration</b> is formally executed and recorded on <b>August 25, 2026</b> by <b>NITHIN SELVARAJ</b> ("Sole Founder, Product Architect & Sole Owner"), residing in India.<br/>
<b>WHEREAS</b>, Nithin Selvaraj has designed, engineered, architected, and authored the comprehensive digital mental health, emotional self-awareness, and telehealth ecosystem known as <b>Haven</b> (<code>havenwellbeing.in</code>); and<br/>
<b>WHEREAS</b>, as of August 25, 2026, all concepts, problem statements, source code, designs, algorithms, and derivative byproducts of Haven are declared under the 100% sole and exclusive ownership of Nithin Selvaraj.
"""
story.append(Paragraph(preamble, body_style))
story.append(Spacer(1, 4))

# Section 1: Ownership Table
story.append(Paragraph("1. MASTER EQUITY, REVENUE & ASSET ALLOCATION SCHEDULE", h1_style))

data_split = [
    [Paragraph("<b>Proprietor / Author</b>", table_header_style), Paragraph("<b>Official Title & Role</b>", table_header_style), Paragraph("<b>Equity & Asset Share</b>", table_header_style)],
    [Paragraph("<b>Nithin Selvaraj</b>", body_style), Paragraph("Sole Founder, Product Architect & Lead Engineer", body_style), Paragraph("<b>100.00% (One Hundred Percent)</b>", highlight_style)]
]

t_split = Table(data_split, colWidths=[2.2*inch, 3.1*inch, 1.9*inch])
t_split.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_split)
story.append(Spacer(1, 6))

# Section 2: Intellectual Property
story.append(Paragraph("2. COMPLETE INTELLECTUAL PROPERTY OWNERSHIP", h1_style))
sec2_text = """
<b>2.1 Scope of Owned Assets:</b> In accordance with Section 19 of the Indian Copyright Act, 1957, Nithin Selvaraj holds sole and exclusive ownership of all software source code, database architectures, generative audio synthesizers, CBT thought untangling frameworks, somatic grounding tools, UI/UX designs, trademarks, and associated domain names.<br/>
<b>2.2 Revenue & Monetization:</b> All subscription proceeds, institutional licensing fees, university deployment grants, telehealth facilitation margins, and commercial exit returns belong 100% to Nithin Selvaraj.<br/>
<b>2.3 Derivative Byproducts:</b> Any future byproducts, mobile applications, APIs, clinical algorithms, or enterprise tools derived from Haven shall remain under the sole proprietary ownership of Nithin Selvaraj.
"""
story.append(Paragraph(sec2_text, body_style))
story.append(Spacer(1, 6))

# Section 3: Signatures
story.append(Paragraph("3. FORMAL EXECUTION & ATTESTATION", h1_style))

sig_data = [
    [
        Paragraph("<b>SOLE FOUNDER & PROPRIETOR (100.00% OWNERSHIP)</b><br/><br/><i>Nithin Selvaraj</i><br/>___________________________<br/><b>Nithin Selvaraj</b><br/>Sole Founder, Product Architect & Lead Engineer<br/>Date: August 25, 2026 | Place: India", body_style),
        Paragraph("<b>GOVERNING JURISDICTION & SEAL</b><br/><br/><b>Republic of India</b><br/>Indian Contract Act, 1872<br/>Indian Copyright Act, 1957 (Section 19)<br/>Information Technology Act, 2000<br/>Status: <b>Active & Legally Binding</b>", body_style)
    ]
]

t_sig = Table(sig_data, colWidths=[3.6*inch, 3.6*inch])
t_sig.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#4338CA')),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(t_sig)

doc.build(story, canvasmaker=NumberedCanvas)
print(f"Successfully generated Master Sole Ownership PDF: {pdf_filename}")
