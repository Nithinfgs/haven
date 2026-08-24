import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

pdf_filename = "/Users/nithinselvaraj/Desktop/HAVEN_FULL_PRODUCT_SPECIFICATION.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(45, letter[1] - 30, "Haven Platform — Comprehensive Product Specification & Architecture")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(45, letter[1] - 34, letter[0] - 45, letter[1] - 34)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 45, 25, footer_text)
        self.drawString(45, 25, "CONFIDENTIAL — HAVEN (Nithin Selvaraj & Arunachalam Premkumar)")
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

# Typography Styles
title_style = ParagraphStyle(
    'MainTitle',
    parent=styles['Heading1'],
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#0F172A'),
    alignment=1, # Center
    fontName='Helvetica-Bold'
)

subtitle_style = ParagraphStyle(
    'MainSubtitle',
    parent=styles['Normal'],
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#4338CA'),
    alignment=1,
    fontName='Helvetica-Bold'
)

meta_style = ParagraphStyle(
    'MetaCenter',
    parent=styles['Normal'],
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#64748B'),
    alignment=1
)

h1_style = ParagraphStyle(
    'H1Section',
    parent=styles['Heading2'],
    fontSize=12,
    leading=16,
    textColor=colors.HexColor('#0F172A'),
    fontName='Helvetica-Bold',
    spaceBefore=11,
    spaceAfter=5
)

h2_style = ParagraphStyle(
    'H2Section',
    parent=styles['Heading3'],
    fontSize=10,
    leading=13.5,
    textColor=colors.HexColor('#312E81'),
    fontName='Helvetica-Bold',
    spaceBefore=7,
    spaceAfter=3
)

body_style = ParagraphStyle(
    'BodyText',
    parent=styles['Normal'],
    fontSize=8.5,
    leading=12.5,
    textColor=colors.HexColor('#334155'),
    fontName='Helvetica'
)

table_header_style = ParagraphStyle(
    'TH',
    parent=body_style,
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor('#1E1B4B'),
    fontName='Helvetica-Bold'
)

table_cell_style = ParagraphStyle(
    'TC',
    parent=body_style,
    fontSize=8,
    leading=11
)

story = []

# ==================== COVER / HEADER BANNER ====================
story.append(Paragraph("HAVEN PLATFORM SPECIFICATION & ARCHITECTURE DOSSIER", title_style))
story.append(Spacer(1, 3))
story.append(Paragraph("Comprehensive Technical Architecture, UI/UX Philosophy & Feature Blueprint", subtitle_style))
story.append(Spacer(1, 3))
story.append(Paragraph("Version 2.4 | Production Release | Domain: havenwellbeing.in | Date: August 2026", meta_style))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4338CA'), spaceAfter=8))

# ==================== 1. EXECUTIVE SUMMARY & ATTRIBUTION ====================
story.append(Paragraph("1. EXECUTIVE SUMMARY & FOUNDING ATTRIBUTION", h1_style))
exec_summary = """
<b>Haven</b> is a full-stack digital mental health, emotional self-awareness, peer support, and telehealth consultation platform purpose-built for adolescents and young adults. Designed with strict zero-emoji, high-contrast typography, whisper-level dark mode atmospheres, and local-first data sovereignty, Haven bridges the gap between everyday stress management and professional clinical telehealth counseling.
<br/><br/>
<b>Founding Attribution & Leadership:</b><br/>
&bull; <b>Arunachalam Premkumar:</b> <i>Co-Founder, Initial Concept Ideator & Strategic Partner (37% Allocation)</i><br/>
&bull; <b>Nithin Selvaraj:</b> <i>Co-Founder, Lead Architect & Lead Developer (63% Allocation)</i>
"""
story.append(Paragraph(exec_summary, body_style))
story.append(Spacer(1, 6))

# Table: Platform Quick Facts
facts_data = [
    [Paragraph("<b>Dimension</b>", table_header_style), Paragraph("<b>Specification / Tech Stack</b>", table_header_style), Paragraph("<b>Purpose / Key Highlight</b>", table_header_style)],
    [Paragraph("<b>Target Audience</b>", table_cell_style), Paragraph("Adolescents, High Schoolers & University Students", table_cell_style), Paragraph("Non-clinical sanctuary + telehealth bridge", table_cell_style)],
    [Paragraph("<b>Frontend Stack</b>", table_cell_style), Paragraph("React 18, TypeScript, Tailwind CSS, Vite, Framer Motion", table_cell_style), Paragraph("Sub-150ms instant client rendering", table_cell_style)],
    [Paragraph("<b>Backend & Cloud</b>", table_cell_style), Paragraph("Supabase (PostgreSQL), Netlify Edge, Web Audio API", table_cell_style), Paragraph("Dual-sync local + cloud architecture", table_cell_style)],
    [Paragraph("<b>Languages</b>", table_cell_style), Paragraph("6 Languages (English, Tamil, Hindi, Urdu, Kannada, Telugu)", table_cell_style), Paragraph("Native regional accessibility", table_cell_style)],
    [Paragraph("<b>Telehealth Link</b>", table_cell_style), Paragraph("Google Calendar API + Automated Google Meet URL engine", table_cell_style), Paragraph("Zero friction encrypted 1-on-1 video calls", table_cell_style)]
]

t_facts = Table(facts_data, colWidths=[1.4*inch, 2.9*inch, 2.7*inch])
t_facts.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
    ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#F8FAFC')),
    ('BACKGROUND', (0,5), (-1,5), colors.HexColor('#F8FAFC')),
]))
story.append(t_facts)
story.append(Spacer(1, 8))

# ==================== 2. COMPLETE FEATURE SUITE MATRIX ====================
story.append(Paragraph("2. COMPLETE PLATFORM FEATURE SUITE", h1_style))

features_data = [
    [Paragraph("<b>Feature Module</b>", table_header_style), Paragraph("<b>Route / URL</b>", table_header_style), Paragraph("<b>Detailed Capabilities & User Experience</b>", table_header_style)],
    
    [Paragraph("<b>Self-Awareness Sanctuary</b>", table_cell_style), 
     Paragraph("<code>/</code> (Home)", table_cell_style), 
     Paragraph("Daily emotional check-in quadrant (Stress, Energy, Sleep, Connection), reflective prompt of the day, 2-minute Haven Moment guided breathing, quick tool launcher.", table_cell_style)],
    
    [Paragraph("<b>Untangle My Mind (CBT)</b>", table_cell_style), 
     Paragraph("<code>/untangle</code>", table_cell_style), 
     Paragraph("4-step Cognitive Behavioral Therapy thought reframer. Identifies 6 cognitive distortions (Catastrophizing, Mind Reading, etc.), Socratic reality check questions, generates balanced empowering reframes, saves to private local journal.", table_cell_style)],
    
    [Paragraph("<b>Panic SOS & Grounding</b>", table_cell_style), 
     Paragraph("<code>/grounding</code>", table_cell_style), 
     Paragraph("Dual somatic panic relief: (1) Step-by-step 5-4-3-2-1 Sensory Grounding engine to anchor nervous system; (2) Animated 4-4-4-4 Box Breathing pacer with cycle tracking.", table_cell_style)],
    
    [Paragraph("<b>Ambient Sound Sanctuary</b>", table_cell_style), 
     Paragraph("<code>/soundscape</code>", table_cell_style), 
     Paragraph("Web Audio API generative synthesizer. Mixes Rain on Glass, 432Hz Alpha Binaural beats, Deep Ocean Swells, and Lo-Fi Brown Noise with 15/30/45/60m sleep/focus timer. 100% offline ready.", table_cell_style)],
    
    [Paragraph("<b>Anonymous Hope Board</b>", table_cell_style), 
     Paragraph("<code>/hope-board</code>", table_cell_style), 
     Paragraph("Digital community encouragement corkboard. Post anonymous kind notes; peers react with safe, toxicity-free reactions ('I hear you', 'Sending strength', 'You got this').", table_cell_style)],
    
    [Paragraph("<b>Peer Circles & Talk Now</b>", table_cell_style), 
     Paragraph("<code>/community</code><br/><code>/talk-now</code>", table_cell_style), 
     Paragraph("Categorized peer rooms (Exam Stress, Social Anxiety, Finding Balance, Late Night Thoughts) and 1-on-1 anonymous peer matching with instant Google Meet telehealth links.", table_cell_style)],
    
    [Paragraph("<b>Therapist Directory</b>", table_cell_style), 
     Paragraph("<code>/therapists</code><br/><code>/therapist/:id</code>", table_cell_style), 
     Paragraph("Search licensed practitioners by issues & languages. Slot booking with instant Google Calendar URL generation, embedded Google Meet links, and direct 1-on-1 consultation texting channel.", table_cell_style)],
    
    [Paragraph("<b>Provider Onboarding & Contract</b>", table_cell_style), 
     Paragraph("<code>/apply-therapist</code>", table_cell_style), 
     Paragraph("Comprehensive clinical intake: degrees (PhD/PsyD, LCSW, LMFT, LPC), state license number, full resume, modalities (CBT/DBT), working hours, voluntary terms agreement, and digital signature sign-off.", table_cell_style)],
    
    [Paragraph("<b>Executive Admin Governance</b>", table_cell_style), 
     Paragraph("<code>/admin</code>", table_cell_style), 
     Paragraph("Executive console for auditing incoming provider applications, inspecting full dossiers & signed contracts, 1-click license approval/rejection, and monitoring platform student analytics.", table_cell_style)],
    
    [Paragraph("<b>Clinical Therapist Hub</b>", table_cell_style), 
     Paragraph("<code>/admin/clinical</code>", table_cell_style), 
     Paragraph("Dedicated practitioner dashboard for managing assigned student check-ins, monitoring mood distributions, reviewing habit logs, and conducting telehealth consultations.", table_cell_style)],
    
    [Paragraph("<b>Urgent Crisis Intercept</b>", table_cell_style), 
     Paragraph("<code>/urgent-support</code>", table_cell_style), 
     Paragraph("Immediate crisis lifeline routing (988, 911, Vandrevala Foundation India, Tele-MANAS, Crisis Text Line), grounded zero-judgment distress guides.", table_cell_style)],
    
    [Paragraph("<b>Habits & Streaks</b>", table_cell_style), 
     Paragraph("<code>/habits</code>", table_cell_style), 
     Paragraph("Daily wellbeing habit tracker (Mindfulness, Water, Sleep, Movement) with dynamic streak counting and positive reinforcement.", table_cell_style)],
    
    [Paragraph("<b>Developer Feedback Box</b>", table_cell_style), 
     Paragraph("<code>/profile</code><br/><code>/admin/settings</code>", table_cell_style), 
     Paragraph("Built-in feedback & bug reporting task modal that dispatches directly to Lead Developer nithinselvaraj9@gmail.com with 1-click mailto and copy tool.", table_cell_style)]
]

t_features = Table(features_data, colWidths=[1.4*inch, 1.4*inch, 4.2*inch])
t_features.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ('TOPPADDING', (0,0), (-1,-1), 3.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(t_features)
story.append(Spacer(1, 8))

# ==================== 3. UI/UX DESIGN & ATMOSPHERE SYSTEM ====================
story.append(Paragraph("3. UI/UX DESIGN PHILOSOPHY & ATMOSPHERE ARCHITECTURE", h1_style))
ui_text = """
<b>1. Strict Zero-Emoji & Typography-First Policy:</b> To maintain an authentic, mature, and clinical-grade atmosphere, Haven strictly prohibits cartoon emojis. All visual cues utilize clean SVG Lucide icons and modern sans-serif typography.
<br/><br/>
<b>2. Six Ambient Color Atmospheres:</b> Haven features 6 scientifically curated color atmospheres available in both Light and Dark modes:
<br/>
&bull; <b>Haven:</b> Soft Indigo (#4656A8 / #7585C4) & Slate — Promotes safety and structure.<br/>
&bull; <b>Ocean:</b> Faint Oceanic Mist (#3478A6 / #5A95B8) — Lowers heart rate and eases panic.<br/>
&bull; <b>Forest:</b> Muted Sage & Pine (#4D7460 / #65917A) — Restorative, grounding biophilic tones.<br/>
&bull; <b>Lavender:</b> Soft Dusky Lilac (#7663A8 / #8E7DBA) — Calms sensory overload and evening stress.<br/>
&bull; <b>Sunset:</b> Muted Warm Clay (#A65E4B / #B57766) — Warm, compassionate human presence.<br/>
&bull; <b>Monochrome:</b> Clean Muted Charcoal (#3E4148 / #8E9299) — Minimalist high-contrast focus.
<br/><br/>
<b>3. Whisper-Level Soft Dark Mode:</b> Unlike harsh neon dark modes, Haven’s dark mode utilizes deep neutral slate bases (#111216) with faint 1-2% ambient tints, eliminating optical fatigue during late-night distress.
"""
story.append(Paragraph(ui_text, body_style))
story.append(Spacer(1, 8))

# ==================== 4. DATA SOVEREIGNTY & SECURITY ====================
story.append(Paragraph("4. SECURITY, DATA SOVEREIGNTY & PRIVACY ARCHITECTURE", h1_style))
sec_text = """
<b>1. Dual-Sync Architecture:</b> All user check-ins, habit streaks, and appointments write instantly to on-device storage (localStorage) and optionally synchronize with cloud databases via encrypted Supabase PostgreSQL APIs.
<br/><br/>
<b>2. Local-Only Storage Mode:</b> Users can toggle 'Local-Only Mode' in Settings, which completely halts cloud telemetry and ensures 100% of journal entries, CBT reframes, and mood logs remain strictly on the user's physical device.
<br/><br/>
<b>3. One-Click Health Data Export & Zero-Trace Purge:</b> In compliance with global data sovereignty standards, students can download their entire health record as a structured <code>.json</code> file at any time or execute a complete irreversible on-device data purge.
"""
story.append(Paragraph(sec_text, body_style))
story.append(Spacer(1, 8))

# ==================== 5. CORPORATE & GOVERNANCE SUMMARY ====================
story.append(Paragraph("5. CO-FOUNDER PARTNERSHIP & LEGAL GOVERNANCE", h1_style))
gov_text = """
The platform is governed under the <b>Indian Contract Act, 1872</b>, <b>Indian Copyright Act, 1957 (Section 19)</b>, and <b>Information Technology Act, 2000</b>:
<br/><br/>
&bull; <b>Equity & Revenue Split:</b> <b>63.00%</b> to <b>Nithin Selvaraj</b> | <b>37.00%</b> to <b>Arunachalam Premkumar</b>.<br/>
&bull; <b>Intellectual Property Assignment:</b> All software code, repositories, UI/UX designs, trademarks, and registered domains (<code>havenwellbeing.in</code>) are assigned irrevocably to the partnership in perpetuity.<br/>
&bull; <b>Governance:</b> Technical & operational authority led by Nithin Selvaraj (63% majority interest); fundamental corporate milestones (sale, major debt) require joint written consensus.
"""
story.append(Paragraph(gov_text, body_style))

doc.build(story, canvasmaker=NumberedCanvas)
print(f"Successfully generated Full Specification PDF: {pdf_filename}")
