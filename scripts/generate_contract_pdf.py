import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

pdf_filename = "/Users/nithinselvaraj/Desktop/haven/HAVEN_PARTNERSHIP_AGREEMENT_NITHIN_PREM.pdf"

doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=44,
    leftMargin=44,
    topMargin=38,
    bottomMargin=38
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#0F172A'),
    alignment=1, # Center
    fontName='Helvetica-Bold'
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#4338CA'),
    alignment=1,
    fontName='Helvetica-Bold'
)

heading_style = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading2'],
    fontSize=9.5,
    leading=13,
    textColor=colors.HexColor('#0F172A'),
    fontName='Helvetica-Bold',
    spaceBefore=7,
    spaceAfter=3
)

body_style = ParagraphStyle(
    'BodyDark',
    parent=styles['Normal'],
    fontSize=8,
    leading=11.5,
    textColor=colors.HexColor('#334155'),
    fontName='Helvetica'
)

highlight_style = ParagraphStyle(
    'HighlightBox',
    parent=body_style,
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#0F172A'),
    fontName='Helvetica-Bold'
)

story = []

# Title Banner
story.append(Paragraph("MASTER CO-FOUNDER PARTNERSHIP & REVENUE SHARING AGREEMENT", title_style))
story.append(Spacer(1, 2))
story.append(Paragraph("GOVERNED UNDER THE INDIAN CONTRACT ACT, 1872 & IT ACT, 2000", subtitle_style))
story.append(Spacer(1, 2))
story.append(Paragraph("Effective Date: August 21, 2026 | Stamp Duty: Non-Judicial e-Stamp Paper", ParagraphStyle('DateCenter', parent=body_style, alignment=1, textColor=colors.HexColor('#64748B'))))
story.append(Spacer(1, 5))
story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4338CA'), spaceAfter=6))

# 1. Recitals & Genesis
story.append(Paragraph("1. PARTIES & FOUNDING COLLABORATIVE GENESIS", heading_style))
recitals_text = """
This <b>Master Co-Founder Agreement</b> is executed on <b>August 21, 2026</b> between <b>NITHIN SELVARAJ</b> ("Party A", Lead Architect & Lead Developer) and <b>ARUNACHALAM PREMKUMAR</b> ("Party B", Initial Concept Ideator & Strategic Partner), both residing in India.<br/>
<b>WHEREAS</b>, the initial foundational concept and core vision for Haven originated through the ideation and initiative of <b>Arunachalam Premkumar</b>;<br/>
<b>WHEREAS</b>, following this initial concept, both Co-Founders engaged in intensive joint ideation, collaborative scoping, feature definition, and creative architecture together to evolve the platform beyond its initial premise into a comprehensive adolescent mental health ecosystem; and<br/>
<b>WHEREAS</b>, as the project commenced and expanded, <b>Nithin Selvaraj</b> spearheaded and executed the comprehensive software architecture, full-stack development, database design, cryptographic security, Netlify/Supabase infrastructure, domain configuration (<code>havenwellbeing.in</code>), and technical execution of the platform; and<br/>
<b>WHEREAS</b>, the Parties wish to establish an airtight, legally binding agreement governing their ownership rights, IP assignments, and revenue distribution under the laws of India.
"""
story.append(Paragraph(recitals_text, body_style))
story.append(Spacer(1, 4))

# 2. Equity & Revenue Allocation Table
story.append(Paragraph("2. EQUITY OWNERSHIP, CAPITALIZATION & REVENUE ALLOCATION", heading_style))

split_data = [
    [Paragraph("<b>Co-Founder</b>", highlight_style), Paragraph("<b>Founding Role & Executive Focus</b>", highlight_style), Paragraph("<b>Equity & Revenue Split</b>", highlight_style)],
    [Paragraph("<b>Nithin Selvaraj</b>", body_style), Paragraph("Co-Founder, Architecture, Engineering, Security & Lead Developer", body_style), Paragraph("<b>63.00% (Sixty-Three Percent)</b>", highlight_style)],
    [Paragraph("<b>Arunachalam Premkumar</b>", body_style), Paragraph("Co-Founder, Initial Concept Ideator & Strategic Director", body_style), Paragraph("<b>37.00% (Thirty-Seven Percent)</b>", highlight_style)]
]

t = Table(split_data, colWidths=[1.7*inch, 3.4*inch, 2.1*inch])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#4338CA')),
    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
    ('BACKGROUND', (0,2), (-1,2), colors.HexColor('#FFFFFF')),
]))
story.append(t)
story.append(Spacer(1, 4))

terms_1 = """
<b>2.1 Net Revenue Sharing:</b> All gross revenue, institutional grants, university enterprise licensing, telehealth facilitation fees, sponsorship earnings, and acquisition/exit proceeds shall be distributed according to the <b>63.00% (Nithin Selvaraj)</b> and <b>37.00% (Arunachalam Premkumar)</b> split after deducting legitimate third-party operational costs.<br/>
<b>2.2 Capitalization & Incorporation:</b> Upon incorporation (Private Limited under <i>Companies Act, 2013</i> or LLP under <i>LLP Act, 2008</i>), issued equity shares and voting rights shall strictly mirror this 63% / 37% capitalization schedule.
"""
story.append(Paragraph(terms_1, body_style))
story.append(Spacer(1, 4))

# 3. IP Assignment (Indian Copyright Act, 1957)
story.append(Paragraph("3. IRREVOCABLE INTELLECTUAL PROPERTY ASSIGNMENT (SECTION 19, COPYRIGHT ACT, 1957)", heading_style))
terms_3 = """
Pursuant to <b>Section 19 of the Indian Copyright Act, 1957</b>, each Co-Founder hereby <b>irrevocably, perpetually, and unconditionally assigns and transfers</b> to the Haven Partnership all right, title, and interest in and to all source code, software repositories, frontend/backend architecture, UI/UX designs, trademarks, domain names (including <code>havenwellbeing.in</code>), algorithms, and documentation worldwide in perpetuity without royalty.<br/>
<b>Official Public Credits:</b> Documentation, platform releases, and official filings shall credit:<br/>
&bull; <i>Arunachalam Premkumar: Initial Concept, Co-Founder & Strategy</i><br/>
&bull; <i>Nithin Selvaraj: Architecture, Engineering, Co-Founder & Lead Developer</i>
"""
story.append(Paragraph(terms_3, body_style))
story.append(Spacer(1, 4))

# 4. Roles, Governance & Deadlock
story.append(Paragraph("4. ROLES, GOVERNANCE & DEADLOCK RESOLUTION", heading_style))
terms_2 = """
<b>4.1 Technical & Operational Authority:</b> Nithin Selvaraj holds sole executive authority over technical architecture, infrastructure, security standards, and codebase management. In operational disagreements, the <b>63% majority interest (Nithin Selvaraj)</b> is final and binding.<br/>
<b>4.2 Strategic Direction:</b> Arunachalam Premkumar leads concept curation, mental health framework research, and institutional outreach.<br/>
<b>4.3 Fundamental Corporate Actions:</b> Sale/merger of Haven, debt exceeding ₹500,000 INR, or third-party equity issuance requires mutual written consent.
"""
story.append(Paragraph(terms_2, body_style))
story.append(Spacer(1, 4))

# 5. Non-Compete & Non-Circumvention
story.append(Paragraph("5. NON-CIRCUMVENTION, NON-COMPETE (24 MONTHS) & CONFIDENTIALITY", heading_style))
terms_4 = """
For a period of <b>24 months</b> post-departure, neither Co-Founder shall directly or indirectly develop, fund, advise, or launch a competing platform using Haven's proprietary architecture, or solicit Haven's clients or partners. Both Parties covenant strict confidentiality of code, credentials, and patient data.
"""
story.append(Paragraph(terms_4, body_style))
story.append(Spacer(1, 4))

# 6. Entire Agreement & Dispute Resolution
story.append(Paragraph("6. ENTIRE AGREEMENT & BINDING ARBITRATION (ARBITRATION ACT, 1996)", heading_style))
terms_5 = """
This written Agreement supersedes all prior verbal, WhatsApp, or email discussions. Any unresolved dispute shall be settled by binding arbitration in India under the <b>Arbitration and Conciliation Act, 1996</b> by a mutually appointed sole arbitrator.
"""
story.append(Paragraph(terms_5, body_style))
story.append(Spacer(1, 6))

# 7. Signatures Block
story.append(Paragraph("7. EXECUTION & WITNESS ATTESTATION", heading_style))
story.append(Paragraph("IN WITNESS WHEREOF, the Parties execute this Agreement on August 21, 2026 in India.", body_style))
story.append(Spacer(1, 4))

sig_data = [
    [
        Paragraph("<b>PARTY A (63.00% ALLOCATION)</b><br/><br/><i>Nithin Selvaraj</i><br/>___________________________<br/><b>Nithin Selvaraj</b><br/>Lead Architect & Lead Developer<br/>Date: August 21, 2026 | Place: India", body_style),
        Paragraph("<b>PARTY B (37.00% ALLOCATION)</b><br/><br/><i>Arunachalam Premkumar</i><br/>___________________________<br/><b>Arunachalam Premkumar</b><br/>Initial Concept Ideator & Strategic Director<br/>Date: August 21, 2026 | Place: India", body_style)
    ],
    [
        Paragraph("<b>WITNESS 1:</b><br/>Signature: _______________________<br/>Name: __________________________<br/>Date: __________________________", body_style),
        Paragraph("<b>WITNESS 2:</b><br/>Signature: _______________________<br/>Name: __________________________<br/>Date: __________________________", body_style)
    ]
]

sig_table = Table(sig_data, colWidths=[3.6*inch, 3.6*inch])
sig_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
    ('PADDING', (0,0), (-1,-1), 6),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor('#E2E8F0'))
]))
story.append(sig_table)

doc.build(story)
print(f"Successfully generated Master Airtight PDF: {pdf_filename}")
