import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "HIERO CONNECT — Comprehensive Competitive & Market Gap Analysis")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, footer_text)
        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — HIERO SKILL INTELLIGENCE")
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#059669'),
        spaceAfter=14
    )

    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#64748B')
    )

    sec_header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=12,
        spaceAfter=6
    )

    company_name_style = ParagraphStyle(
        'CompanyName',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=2
    )

    badge_style = ParagraphStyle(
        'BadgeStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#047857')
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )

    gap_fill_style = ParagraphStyle(
        'GapFillText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#065F46')
    )

    uncovered_style = ParagraphStyle(
        'UncoveredText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#991B1B')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#1E293B')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # Title Banner
    story.append(Paragraph("HIERO CONNECT", title_style))
    story.append(Paragraph("Market Landscape & 10-Competitor In-Depth Gap Analysis Report", subtitle_style))
    story.append(Paragraph("<b>Target Domain:</b> Bengaluru & Indian Tech Recruitment, Campus-to-Corporate, Skill Intelligence & ATS Ecosystem<br/><b>Focus:</b> Competitor Drawbacks Resolved by HIERO vs. Advanced Enterprise Features Not Yet Covered", meta_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#059669'), spaceAfter=14))

    # Executive Overview
    story.append(Paragraph("1. Executive Summary", sec_header_style))
    exec_summary_text = (
        "In the Bengaluru and broader Indian recruitment ecosystem, hiring is fractured into three distinct silos: "
        "(1) <b>Rigid Assessment Platforms</b> (HackerEarth, HackerRank, Mercer Mettl) which focus on high-stakes, one-off test scores; "
        "(2) <b>Campus Workflow Aggregators</b> (Superset, TCS iON) which manage logistics but lack live skill verification; and "
        "(3) <b>Resume/History-Based Sourcing Engines</b> (Instahyre, Cutshort) which match on keyword text rather than proven capability. "
        "<b>HIERO Connect</b> establishes an innovative middle ground by acting as a <b>Competency-Driven Skill Intelligence & Hiring Portal</b>. "
        "This report investigates 10 prominent platforms operating in Bengaluru/India, detailing their architecture, features, critical gaps filled by HIERO, and enterprise capabilities they possess that HIERO has not yet covered."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 12))

    # 10 Companies Detailed Breakdown
    story.append(Paragraph("2. Detailed In-Depth Breakdown of 10 Competitors", sec_header_style))
    story.append(Spacer(1, 6))

    companies_data = [
        {
            "num": "01",
            "name": "HackerEarth",
            "hq": "Bengaluru HQ (Koramangala) & San Francisco",
            "category": "Developer Assessment & Hackathon Platform",
            "core": "Enterprise technical assessment platform with automated coding sandboxes, proctored assessments, and developer community hackathons.",
            "features_have": "10,000+ coding question bank across 40+ programming languages; live AI webcam and audio proctoring; integration with global ATSs (Workday, Greenhouse, Taleo); public hackathon engine with 7.5M+ developers.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Over-indexes on binary pass/fail algorithm puzzle tests that encourage LeetCode rote memorization instead of real-world full-stack readiness. Lacks granular, visual competency gap breakdowns.<br/><b>HIERO Gap Fill:</b> Real-time multidimensional skill-match percentages (e.g. 94% match) with transparent skill pill verification (Python, SQL, React) and continuous project competency tracking rather than high-stress puzzle tests.",
            "not_covered": "Automated code plagiarism AI detection engine; multi-language compiler sandboxes for 40+ niche/legacy languages; enterprise SSO/SAML integrations; massive public developer hackathon hosting capabilities."
        },
        {
            "num": "02",
            "name": "HackerRank",
            "hq": "Bengaluru Technology & Innovation Hub",
            "category": "Technical Skill Benchmark & Certification Engine",
            "core": "Developer Skills Platform offering standardized skill certifications, role-based assessments, and enterprise developer hiring solutions.",
            "features_have": "Standardized skill certifications (Problem Solving, React, SQL); IDE-based live technical interviewing; deep candidate analytics and industry benchmark percentiles; candidate plagiarism detection.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> High candidate drop-off and test anxiety; sterile experience with no direct link to continuous university-to-corporate career pipelines; expensive per-assessment seat licensing for startups.<br/><b>HIERO Gap Fill:</b> Lightweight, interactive employer dashboard with drag-and-drop recruitment pipelines, candidate portfolio transparency, and seamless job-to-competency alignment without prohibitive paywalls.",
            "not_covered": "Global percentile benchmarking against millions of tested engineers; certified standardized badge accreditation system recognized globally by Fortune 500s; hardware/embedded code emulation environments."
        },
        {
            "num": "03",
            "name": "Superset (JoinSuperset)",
            "hq": "Bengaluru HQ (HSR Layout)",
            "category": "University Placement & Campus Hiring Automation",
            "core": "India's largest university placement management system bridging college placement cells (TPOs), students, and visiting corporate recruiters.",
            "features_have": "Mass university integration (hundreds of engineering colleges across India); student academic record verification (CGPA, active backlogs, branches); automated drive scheduling; offer letter rollouts.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Pure administrative workflow tool. Does zero intrinsic deep technical/skill assessment—it relies blindly on student-submitted resumes and academic grades (CGPA) which are notorious for grade inflation.<br/><b>HIERO Gap Fill:</b> True skill-first intelligence that evaluates candidates on actual verified competencies rather than college GPA or pedigree, allowing talented students from tier-2/3 institutions to be matched meritocratically.",
            "not_covered": "Institutional College TPO administration modules (managing on-campus drive slots, hall ticket generation, multi-tier college approval workflows, university exam timetable conflict management)."
        },
        {
            "num": "04",
            "name": "Mercer | Mettl",
            "hq": "Major Bengaluru Operations & Gurugram HQ",
            "category": "Holistic Talent Assessment & Proctoring Suite",
            "core": "Comprehensive psychometric, cognitive, domain-knowledge, and technical evaluation engine with enterprise lockdown proctoring.",
            "features_have": "Scientifically validated psychometric batteries; automated AI video/audio/browser lockdown proctoring; multilingual test support; customized 360-degree leadership & behavioral assessments.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Clunky, legacy corporate enterprise interface; tests are isolated events without an integrated candidate talent marketplace, employer Kanban pipeline, or intuitive candidate discovery matching.<br/><b>HIERO Gap Fill:</b> Modern, sleek dark/light aesthetic UI with real-time candidate matchmaking, interactive hiring Kanban stages (Shortlist, Interview, Offer), and streamlined employer branding.",
            "not_covered": "Rigorous industrial/organizational psychometrics; strict hardware/OS-level lockdown browser clients; enterprise compliance & proctoring certifications (ISO 27001, GDPR, SOC2 Type II)."
        },
        {
            "num": "05",
            "name": "Instahyre",
            "hq": "Bengaluru & Pan-India Operations",
            "category": "AI Talent Sourcing & Passive Matching Engine",
            "core": "AI-powered hiring platform using 'InstaMatch' algorithm to curate top pre-vetted active and passive talent directly to tech recruiters.",
            "features_have": "Proprietary InstaMatch algorithm combining 100+ data points (salary expectations, company pedigree, tech stack); automated candidate email sequences; 10M+ tech professional profile pool.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Dependent on historical resume keywords and LinkedIn career summaries. Cannot verify if a candidate actually knows the skills listed or test practical problem-solving; ineffective for freshers.<br/><b>HIERO Gap Fill:</b> Verifiable competency testing and explicit skill gap indicators (e.g. required vs. acquired skills breakdown) rather than statistical resume keyword matching.",
            "not_covered": "Massive pre-indexed database of millions of lateral senior tech candidates; outbound automated drip email sequences; direct CRM sync with LinkedIn Recruiter."
        },
        {
            "num": "06",
            "name": "Cutshort",
            "hq": "Bengaluru Tech Hub & Pune HQ",
            "category": "AI-Enabled Tech Talent Marketplace",
            "core": "Direct-to-candidate hiring network powered by 'Voila' AI assistant, verified candidate responsiveness badges, and fast-track messaging.",
            "features_have": "In-app AI recruiter assistant (Voila); candidate responsiveness scores; direct recruiter-candidate chat and WhatsApp automation; verified candidate salary & notice period data.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Verification is limited to employment history, notice period, and responsiveness—does not perform in-depth technical skill analysis, code verification, or competency gap scoring.<br/><b>HIERO Gap Fill:</b> Dedicated Skill Intelligence engine that analyzes specific job competency criteria against candidate capabilities with precise percentage-match analytics.",
            "not_covered": "WhatsApp and AI voice bot candidate engagement; crowd-sourced candidate recommendation network; automated candidate salary negotiation & counter-offer intelligence."
        },
        {
            "num": "07",
            "name": "Unstop (formerly Dare2Compete)",
            "hq": "Bengaluru Presence & New Delhi",
            "category": "Early Talent Engagement & Gamified Challenges",
            "core": "Community engagement and gamified hiring platform leveraging hackathons, quizzes, business case competitions, and branded campus drives.",
            "features_have": "Mass student reach (8M+ student members); multi-disciplinary competition engine (engineering, management, design); corporate employer branding pages; live leaderboards and awards.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Heavy event-based, seasonal engagement model. Once a hackathon ends, there is no persistent, evergreen competency profile mapping for continuous everyday hiring needs.<br/><b>HIERO Gap Fill:</b> Continuous, evergreen job posting and talent matching platform that maintains persistent, up-to-date candidate skill profiles available 24/7/365 to employers.",
            "not_covered": "Campus ambassador network management; non-tech business case study simulation engines; viral gamified challenge viral mechanics and multi-stage university battlegrounds."
        },
        {
            "num": "08",
            "name": "TCS iON / NextStep",
            "hq": "Bengaluru Delivery Center & Mumbai HQ",
            "category": "Mass Standardized Assessment & National Qualifier Test",
            "core": "Large-scale digital assessment and hiring portal powering the National Qualifier Test (NQT) and mass enterprise entry-level hiring.",
            "features_have": "Massive physical test center network across 500+ Indian cities; capacity to assess 500,000+ candidates simultaneously; deep institutional alignment with government & major IT services firms.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Monolithic, extremely slow turnaround (months between NQT test, score release, and interview calls); rigid mass-filtering interface unsuited for modern agile tech startups.<br/><b>HIERO Gap Fill:</b> Instantaneous, agile hiring workflow with real-time candidate matching, interactive stage transitions, and modern cloud-native UI designed for fast-paced tech companies.",
            "not_covered": "Physical on-premise test center infrastructure and logistics; high-volume multi-lakh simultaneous candidate throughput; formal government & public sector exam hosting."
        },
        {
            "num": "09",
            "name": "Infosys Springboard / InfyTQ",
            "hq": "Bengaluru HQ (Electronics City)",
            "category": "Corporate Learning, Skill Certification & Talent Pipeline",
            "core": "Proprietary digital learning and skill certification platform designed to upskill university students and funnel certified talent into Infosys recruitment.",
            "features_have": "Thousands of hours of enterprise-grade curated coursework (Java, Python, Cloud, AI); hands-on virtual labs; official Infosys certification exams that grant direct technical interview bypass.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Closed, single-employer walled garden. Students certified on InfyTQ are primarily channeled exclusively into Infosys; other companies cannot use it as their recruitment portal.<br/><b>HIERO Gap Fill:</b> Open, multi-employer marketplace where any tech company, SME, or startup can post requirements and access verified student competencies directly.",
            "not_covered": "Massive internal library of accredited multi-month digital courseware, structured learning paths, and proprietary cloud-hosted virtual lab infrastructure."
        },
        {
            "num": "10",
            "name": "Darwinbox / Keka Recruit",
            "hq": "Bengaluru Hub (Koramangala/Indiranagar)",
            "category": "Enterprise HRMS & Applicant Tracking System (ATS)",
            "core": "End-to-end Human Resource Management System with built-in ATS, requisition management, approval hierarchies, and employee onboarding.",
            "features_have": "Complete employee lifecycle management (Requisition -> ATS -> Onboarding -> Payroll -> Attendance -> Performance -> Exit); customizable multi-level approval workflows; enterprise ERP integrations.",
            "drawbacks_hiero_fills": "<b>Drawback:</b> Focuses solely on managing inbound applicants and administrative hiring workflows. Has no built-in skill intelligence, candidate competency verification, or active talent marketplace.<br/><b>HIERO Gap Fill:</b> Native Skill Intelligence that actively matches, discovers, and verifies talent based on objective skill criteria rather than merely acting as a passive resume inbox.",
            "not_covered": "Full-lifecycle enterprise HRMS capabilities: biometric attendance, payroll processing, statutory tax compliance (PF/ESI/TDS), performance appraisals, and employee exit clearances."
        }
    ]

    for comp in companies_data:
        comp_card = []
        # Header Box
        header_text = f"<b>{comp['num']}. {comp['name']}</b> &nbsp; <font color='#059669'>[{comp['category']}]</font>"
        comp_card.append(Paragraph(header_text, company_name_style))
        comp_card.append(Paragraph(f"<b>Location:</b> {comp['hq']}", meta_style))
        comp_card.append(Spacer(1, 4))
        
        # Details
        comp_card.append(Paragraph(f"<b>Core Solution:</b> {comp['core']}", body_style))
        comp_card.append(Spacer(1, 3))
        comp_card.append(Paragraph(f"<b>Key Strengths & Features:</b> {comp['features_have']}", body_style))
        comp_card.append(Spacer(1, 4))

        # Two Callout Blocks
        # 1. How HIERO Fills the Gap (Green Box)
        gap_content = [
            [Paragraph("<b>HOW HIERO FILLS THE GAP &amp; RESOLVES DRAWBACKS:</b>", ParagraphStyle('GBH', parent=gap_fill_style, fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#065F46')))],
            [Paragraph(comp['drawbacks_hiero_fills'], gap_fill_style)]
        ]
        gap_table = Table(gap_content, colWidths=[500])
        gap_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#6EE7B7')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        comp_card.append(gap_table)
        comp_card.append(Spacer(1, 4))

        # 2. What they have not covered in HIERO yet (Amber/Red Box)
        uncovered_content = [
            [Paragraph("<b>WHAT COMPETITOR HAS THAT HIERO DOES NOT COVER (YET):</b>", ParagraphStyle('UBH', parent=uncovered_style, fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#991B1B')))],
            [Paragraph(comp['not_covered'], uncovered_style)]
        ]
        uncovered_table = Table(uncovered_content, colWidths=[500])
        uncovered_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#FCA5A5')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        comp_card.append(uncovered_table)
        comp_card.append(Spacer(1, 10))

        story.append(KeepTogether(comp_card))

    # Comprehensive Feature Comparison Matrix Table
    story.append(KeepTogether([
        Paragraph("3. Cross-Platform Feature & Capability Matrix", sec_header_style),
        Paragraph("Comprehensive comparison across core technical, competency, workflow, and platform dimensions.", body_style),
        Spacer(1, 8)
    ]))

    matrix_headers = [
        Paragraph("<b>Platform</b>", table_header_style),
        Paragraph("<b>Skill Match % Engine</b>", table_header_style),
        Paragraph("<b>Competency Verification</b>", table_header_style),
        Paragraph("<b>Campus/Student Connect</b>", table_header_style),
        Paragraph("<b>Agile Hiring Pipeline</b>", table_header_style),
        Paragraph("<b>Multi-Employer Open Market</b>", table_header_style),
    ]

    matrix_rows = [
        matrix_headers,
        [Paragraph("<b>HIERO Connect</b>", table_cell_bold), Paragraph("<b>Yes (Native AI)</b>", table_cell_style), Paragraph("<b>Yes (Skills & Gaps)</b>", table_cell_style), Paragraph("<b>Yes (Direct Link)</b>", table_cell_style), Paragraph("<b>Yes (Kanban ATS)</b>", table_cell_style), Paragraph("<b>Yes (Open Marketplace)</b>", table_cell_style)],
        [Paragraph("HackerEarth", table_cell_bold), Paragraph("Partial (Test Score)", table_cell_style), Paragraph("Yes (Code Sandbox)", table_cell_style), Paragraph("Partial (Hackathons)", table_cell_style), Paragraph("Limited (Integrates ATS)", table_cell_style), Paragraph("Yes (Enterprise)", table_cell_style)],
        [Paragraph("HackerRank", table_cell_bold), Paragraph("Partial (Benchmark)", table_cell_style), Paragraph("Yes (Certifications)", table_cell_style), Paragraph("Limited (Individual)", table_cell_style), Paragraph("Limited (Integrates ATS)", table_cell_style), Paragraph("Yes (Enterprise)", table_cell_style)],
        [Paragraph("Superset", table_cell_bold), Paragraph("No (Filter by GPA)", table_cell_style), Paragraph("No (Resume Only)", table_cell_style), Paragraph("<b>Yes (Market Leader)</b>", table_cell_style), Paragraph("Yes (Drive Stages)", table_cell_style), Paragraph("Yes (Colleges & Cos)", table_cell_style)],
        [Paragraph("Mercer Mettl", table_cell_bold), Paragraph("No (Score Report)", table_cell_style), Paragraph("<b>Yes (Psych/Domain)</b>", table_cell_style), Paragraph("Limited (Drive API)", table_cell_style), Paragraph("No (Report Export)", table_cell_style), Paragraph("Yes (B2B SaaS)", table_cell_style)],
        [Paragraph("Instahyre", table_cell_bold), Paragraph("Yes (Keyword Match)", table_cell_style), Paragraph("No (Self-Reported)", table_cell_style), Paragraph("No (Experienced Tech)", table_cell_style), Paragraph("Yes (Recruiter CRM)", table_cell_style), Paragraph("Yes (Curated)", table_cell_style)],
        [Paragraph("Cutshort", table_cell_bold), Paragraph("Partial (Profile Match)", table_cell_style), Paragraph("No (Trust/Activity)", table_cell_style), Paragraph("No (Lateral Focus)", table_cell_style), Paragraph("Yes (Chat/Pipeline)", table_cell_style), Paragraph("Yes (Curated)", table_cell_style)],
        [Paragraph("Unstop", table_cell_bold), Paragraph("No (Event Ranks)", table_cell_style), Paragraph("Partial (Challenges)", table_cell_style), Paragraph("<b>Yes (8M+ Students)</b>", table_cell_style), Paragraph("Limited (Contest Leads)", table_cell_style), Paragraph("Yes (Community)", table_cell_style)],
        [Paragraph("TCS iON", table_cell_bold), Paragraph("No (NQT Scorecard)", table_cell_style), Paragraph("Yes (Aptitude/Tech)", table_cell_style), Paragraph("Yes (Pan-India)", table_cell_style), Paragraph("No (Batch Processing)", table_cell_style), Paragraph("Limited (TCS/Partners)", table_cell_style)],
        [Paragraph("Infosys Springboard", table_cell_bold), Paragraph("No (Course Mastery)", table_cell_style), Paragraph("Yes (Infy Certified)", table_cell_style), Paragraph("Yes (Students)", table_cell_style), Paragraph("No (Infosys Internal)", table_cell_style), Paragraph("<b>No (Closed Garden)</b>", table_cell_style)],
        [Paragraph("Darwinbox / Keka", table_cell_bold), Paragraph("No (Manual Review)", table_cell_style), Paragraph("No (External)", table_cell_style), Paragraph("No (Inbound ATS)", table_cell_style), Paragraph("<b>Yes (Full HRMS)</b>", table_cell_style), Paragraph("No (Internal Tool)", table_cell_style)],
    ]

    matrix_table = Table(matrix_rows, colWidths=[90, 82, 85, 82, 81, 80])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#DCFCE7')),  # Highlight HIERO row
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    story.append(matrix_table)
    story.append(Spacer(1, 14))

    # Strategic Takeaways & Roadmap Recommendations
    story.append(KeepTogether([
        Paragraph("4. Strategic Takeaways & Roadmap Recommendations for HIERO", sec_header_style),
        Paragraph(
            "1. <b>Double Down on the 'Anti-Resume' Competency Graph:</b> Legacy platforms either rely on resumes (Superset, Instahyre) or high-stress puzzle tests (HackerRank). HIERO's unique competitive wedge is transparent, project-backed skill verification and real-time gap analysis.<br/>"
            "2. <b>Expand Enterprise ATS Integrations:</b> To win mid-to-large Bengaluru tech enterprises, HIERO should build webhook/API integrations with Workday, Greenhouse, and Darwinbox to push shortlisted candidates directly into corporate systems.<br/>"
            "3. <b>Introduce Automated Skill Assessment Modules:</b> While HIERO excels at matching and skill breakdown visualization, adding lightweight interactive coding sandboxes or automated asynchronous video interviews will close the functional gap with HackerEarth and Mettl.<br/>"
            "4. <b>Preserve the Open Multi-Employer Marketplace:</b> Unlike proprietary corporate silos (InfyTQ) or closed HRMS tools (Darwinbox), HIERO's multi-employer, open-access model offers immense network effects for both colleges and hiring companies.",
            body_style
        ),
        Spacer(1, 10),
        Paragraph("<i>Report generated automatically by Antigravity AI Engineering Suite.</i>", meta_style)
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    output_pdf = r"c:\Users\Rahul\OneDrive\Desktop\rahulrc\connect-portal-\HIERO_Competitive_Analysis_10_Companies.pdf"
    if len(sys.argv) > 1:
        output_pdf = sys.argv[1]
    build_pdf(output_pdf)
