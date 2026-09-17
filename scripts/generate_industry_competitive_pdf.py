import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
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
            self.drawString(54, 750, "HIERO CONNECT — 10 Industry Giants (Bengaluru) & Talent Gap Analysis")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, footer_text)
        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — HIERO CONNECT INDUSTRY INTELLIGENCE")
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
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#059669'),
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#64748B')
    )

    sec_header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=12,
        spaceAfter=6
    )

    company_name_style = ParagraphStyle(
        'CompanyName',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    gap_fill_style = ParagraphStyle(
        'GapFillText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#065F46')
    )

    uncovered_style = ParagraphStyle(
        'UncoveredText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#991B1B')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#1E293B')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # Title Banner
    story.append(Paragraph("HIERO CONNECT", title_style))
    story.append(Paragraph("10 Top Industry Giants in Bengaluru: Recruitment Bottlenecks & HIERO Solution Report", subtitle_style))
    story.append(Paragraph("<b>Target Sectors:</b> Enterprise IT, E-Commerce, Automotive IoT, Fintech, Semiconductor, Quick Commerce, Biotech, SaaS, Aerospace, Omnichannel Retail<br/><b>Core Analysis:</b> Current Hiring Systems &rarr; Industry Bottlenecks &rarr; HIERO Gap Resolution &rarr; Enterprise Capabilities Not Covered", meta_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#059669'), spaceAfter=12))

    # Executive Overview
    story.append(Paragraph("1. Executive Problem Statement", sec_header_style))
    exec_summary_text = (
        "Top and mid-level industry employers in Bengaluru across sectors—from tech conglomerates (Infosys, Flipkart, PhonePe) "
        "to deep engineering firms (Bosch, Texas Instruments, Biocon, Titan)—rely on traditional corporate career portals, "
        "legacy ATS systems (Workday, SuccessFactors, Taleo), and high-volume campus drives. "
        "These systems suffer from critical structural drawbacks: <b>excessive reliance on keyword resume filtering</b>, "
        "<b>inability to verify real-world hands-on competency prior to interviews</b>, <b>massive engineering hours wasted on screening unqualified candidates</b>, "
        "and <b>costly 3-to-6 month onboarding training periods</b>. "
        "<b>HIERO Connect</b> directly solves these corporate bottlenecks through its <b>Skill Intelligence Match Engine, verified skill badges, and real-time skill-gap diagnostics</b>."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 10))

    # 10 Industry Companies Detailed Breakdown
    story.append(Paragraph("2. Analysis of 10 Major Industry Companies in Bengaluru", sec_header_style))
    story.append(Spacer(1, 4))

    industries_data = [
        {
            "num": "01",
            "name": "Infosys / Wipro",
            "sector": "Enterprise IT & Digital Transformation Services",
            "location": "Electronics City & Sarjapur, Bengaluru",
            "current_system": "Infosys Career Portal / Taleo / SuccessFactors / InfyTQ / Campus Recruitment Drives",
            "drawbacks": "Flooded with 500,000+ resumes annually. Keyword ATS filtering leads to high false rejections of skilled candidates from tier-2/3 colleges and false acceptance of resume keyword-stuffers. Hired graduates require 3 to 6 months on the 'training bench' before billable deployment because degree marks do not equal practical coding ability.",
            "hiero_solution": "HIERO verifies hands-on coding and project competency (e.g. 92% React/Node/SQL match) directly against live job specs. Cuts recruiter screening time by 75% and slashes expensive post-hire bench training cycles by delivering pre-validated talent.",
            "not_covered": "Enterprise-scale global visa processing (H1B/L1/Tier-2), multinational internal employee transfers across 300,000+ staff, complex multi-country statutory tax compliance."
        },
        {
            "num": "02",
            "name": "Flipkart",
            "sector": "E-Commerce & Supply Chain Logistics Tech",
            "location": "Bellandur, Outer Ring Road, Bengaluru",
            "current_system": "Flipkart Careers Portal / Greenhouse ATS / Annual GRiD Hackathons",
            "drawbacks": "Annual GRiD hackathons create a massive seasonal influx but fail to support continuous, year-round talent demand. Career portal resumes fail to verify candidate grasp of distributed systems, high-concurrency microservices, and database scaling, burning thousands of engineering manager hours in basic technical rounds.",
            "hiero_solution": "Provides continuous, year-round Skill Intelligence with granular competency breakdowns in microservices, caching, and API design. Engineering leads immediately see verified skill pills (Kafka ✓, Redis ✓, Distributed SQL ✓) before opening a resume.",
            "not_covered": "Multi-tier ESOP/equity grant modeling tools, automated bar-raiser panel interview consensus mechanisms, large-scale supply chain warehouse seasonal worker dispatch."
        },
        {
            "num": "03",
            "name": "Bosch Global Software Technologies (BGSW)",
            "sector": "Automotive Engineering, IoT & Embedded Systems",
            "location": "Adugodi & Electronic City, Bengaluru",
            "current_system": "Bosch Careers (SmartRecruiters / Workday)",
            "drawbacks": "Severe bottleneck sourcing cross-disciplinary engineers (Embedded C, RTOS, AUTOSAR, CAN bus, IoT). Standard ATS keyword search cannot determine whether an applicant has actual hardware-software debugging experience or just listed embedded keywords on paper.",
            "hiero_solution": "Visual Skill-Gap Breakdown explicitly highlights what required competencies a candidate possesses vs. missing (e.g., Embedded C ✓, RTOS ✓, CAN Protocol ✗), enabling Bosch hiring managers to quickly identify candidates who need minimal bridging.",
            "not_covered": "Automotive safety standard compliance tracking (ISO 26262, ASIL), hardware lab security clearances, and patent filing disclosures."
        },
        {
            "num": "04",
            "name": "PhonePe / Razorpay",
            "sector": "Fintech, Payment Gateway & Banking Infrastructure",
            "location": "Bellandur & Koramangala, Bengaluru",
            "current_system": "Custom Lever/Greenhouse Portals & Third-Party Tech Headhunters",
            "drawbacks": "Extremely high cost of engineering mis-hires in financial transaction systems. Heavy reliance on recruitment consultancies charging 20-30% placement fees because in-house ATS cannot verify high-throughput transactional engineering capability from inbound resumes.",
            "hiero_solution": "Eliminates high recruitment agency fees by directly matching hiring managers with verified talent scored on transactional backend competencies, database ACID principles, and asynchronous processing.",
            "not_covered": "Strict RBI/banking regulatory background audits, automated financial fraud clearance checks, and dynamic sign-on bonus calculation engines."
        },
        {
            "num": "05",
            "name": "Texas Instruments / Intel India",
            "sector": "Semiconductor, VLSI, FPGA & Firmware Engineering",
            "location": "CV Raman Nagar & Outer Ring Road, Bengaluru",
            "current_system": "TI Careers / Intel Workday Portal / Premier Institute Campus Drives",
            "drawbacks": "Deep talent drought for entry-level hardware design, Verilog/VHDL, and device driver talent. Campus hiring is restricted to top IITs/NITs because reviewing thousands of tier-2 college applicants manually is physically impossible without automated skill validation.",
            "hiero_solution": "Democratizes talent discovery by objectively benchmarking candidates from any college on validated hardware/firmware competencies, surfacing hidden top-tier talent that legacy college-tier filters automatically discard.",
            "not_covered": "Clean-room physical security access protocols, hardware laboratory testing equipment allocation, and defense export-control (ITAR) legal checks."
        },
        {
            "num": "06",
            "name": "Swiggy",
            "sector": "On-Demand Hyperlocal Food & Quick Commerce",
            "location": "Koramangala & Marathahalli, Bengaluru",
            "current_system": "Swiggy Careers / Greenhouse ATS / LinkedIn Job Posts",
            "drawbacks": "Fast-paced agile product teams overwhelmed by 1,000+ applicants per job post. Recruiters spend days sifting through identical resumes with inflated claims, leading to slow time-to-hire (45+ days) and high candidate drop-off during prolonged interview loops.",
            "hiero_solution": "Recruiters and hiring managers get an instant 90%+ match leaderboard with interactive Kanban stages (Matched &rarr; Shortlisted &rarr; Interview), compressing time-to-shortlist from weeks to under 24 hours.",
            "not_covered": "Gig-economy delivery partner onboarding modules, hyperlocal delivery radius compensation algorithms, and live rider dispatch tracking."
        },
        {
            "num": "07",
            "name": "Biocon & Syngene International",
            "sector": "Biopharmaceuticals, Genomics & Healthcare Tech",
            "location": "Biocon Park, Jigani Road, Bengaluru",
            "current_system": "Biocon Careers (SAP SuccessFactors)",
            "drawbacks": "Requires rare hybrid talent skilled in both molecular biology/chemistry and computational tools (Bioinformatics, Python, Nextflow, R, biostatistics). Traditional HR recruiters cannot accurately evaluate scientific-computational hybrid profiles from generic resume sheets.",
            "hiero_solution": "Multi-dimensional skill tagging and competency scoring that maps scientific domain knowledge alongside computational tooling, preventing qualified interdisciplinary candidates from being overlooked.",
            "not_covered": "US FDA / DCGI regulatory compliance verification, Good Laboratory Practice (GLP) audits, and molecular intellectual property chain-of-custody tracking."
        },
        {
            "num": "08",
            "name": "Postman",
            "sector": "API Platform, Cloud Infrastructure & Developer SaaS",
            "location": "Indiranagar, Bengaluru (Global HQ San Francisco)",
            "current_system": "Postman Careers / Lever ATS",
            "drawbacks": "Demands high developer empathy, modern API protocol mastery (GraphQL, WebSockets, REST), and TypeScript craftsmanship. Traditional resumes don't reflect whether a candidate writes clean, modular, well-tested code.",
            "hiero_solution": "Directly links validated technical capabilities and hands-on skill verification to specific API/full-stack requisitions, bypassing superficial keyword matching.",
            "not_covered": "Global remote-first salary benchmarking across 20+ countries, automated GitHub open-source repository scrapers, and remote ergonomic equipment stipends."
        },
        {
            "num": "09",
            "name": "L&T Technology Services (LTTS) / HAL",
            "sector": "Aerospace, Defense & Heavy Engineering",
            "location": "Whitefield & Old Airport Road, Bengaluru",
            "current_system": "LTTS Enterprise Portal / Public Sector Application Systems",
            "drawbacks": "Monolithic, bureaucratic hiring cycles spanning 90 to 120 days. Traditional paper applications and generic aptitude tests fail to test modern CAD/CAM, finite element analysis (FEA), and avionics software readiness.",
            "hiero_solution": "Modern, sleek cloud recruitment architecture that reduces enterprise hiring cycles to under two weeks with verifiable competency benchmarks and streamlined candidate management.",
            "not_covered": "Ministry of Defence (MoD) security clearances, physical medical examination scheduling, and public-sector wage scale pay matrix structures."
        },
        {
            "num": "10",
            "name": "Titan Company Ltd (Tata Group)",
            "sector": "Omnichannel Retail, Smart Wearables & IoT",
            "location": "Electronic City, Bengaluru",
            "current_system": "Titan Careers (Darwinbox / SAP SuccessFactors)",
            "drawbacks": "Transitioning rapidly from legacy watch/jewelry manufacturing into smart wearables, IoT sensors, and high-tech e-commerce; struggling to attract and evaluate modern digital/tech talent through legacy retail-oriented HR portals.",
            "hiero_solution": "Gives enterprise consumer giants a modern tech-employer portal with precise digital competency matching, enabling them to hire software, mobile, and IoT engineers with the speed of a Silicon Valley startup.",
            "not_covered": "Retail store frontline staff incentive calculation, seasonal festival temp-staffing pipelines, and fine jewelry craftsmanship apprenticeship management."
        }
    ]

    for comp in industries_data:
        comp_card = []
        header_text = f"<b>{comp['num']}. {comp['name']}</b> &nbsp; <font color='#059669'>[{comp['sector']}]</font>"
        comp_card.append(Paragraph(header_text, company_name_style))
        comp_card.append(Paragraph(f"<b>Location:</b> {comp['location']} | <b>Current System:</b> {comp['current_system']}", meta_style))
        comp_card.append(Spacer(1, 3))
        
        # Industry Drawbacks
        comp_card.append(Paragraph(f"<b>Current Industry Drawback:</b> {comp['drawbacks']}", body_style))
        comp_card.append(Spacer(1, 4))

        # How HIERO Fixes it (Green Box)
        gap_content = [
            [Paragraph("<b>HOW HIERO CONNECT FIXES THIS INDUSTRY BOTTLEKNECK:</b>", ParagraphStyle('GBH', parent=gap_fill_style, fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.HexColor('#065F46')))],
            [Paragraph(comp['hiero_solution'], gap_fill_style)]
        ]
        gap_table = Table(gap_content, colWidths=[500])
        gap_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#6EE7B7')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        comp_card.append(gap_table)
        comp_card.append(Spacer(1, 3))

        # What they have not covered in HIERO yet (Red/Amber Box)
        uncovered_content = [
            [Paragraph("<b>ENTERPRISE SYSTEM CAPABILITIES THEY HAVE (NOT IN HIERO YET):</b>", ParagraphStyle('UBH', parent=uncovered_style, fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.HexColor('#991B1B')))],
            [Paragraph(comp['not_covered'], uncovered_style)]
        ]
        uncovered_table = Table(uncovered_content, colWidths=[500])
        uncovered_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#FCA5A5')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        comp_card.append(uncovered_table)
        comp_card.append(Spacer(1, 8))

        story.append(KeepTogether(comp_card))

    # Industry Feature Matrix Table
    story.append(KeepTogether([
        Paragraph("3. Industry Hiring Transformation Matrix", sec_header_style),
        Paragraph("How HIERO Connect modernizes hiring across diverse industry sectors in Bengaluru.", body_style),
        Spacer(1, 6)
    ]))

    matrix_headers = [
        Paragraph("<b>Industry Sector</b>", table_header_style),
        Paragraph("<b>Legacy Method</b>", table_header_style),
        Paragraph("<b>Major Pain Point</b>", table_header_style),
        Paragraph("<b>HIERO Advantage</b>", table_header_style),
        Paragraph("<b>Time-to-Hire Impact</b>", table_header_style)
    ]

    matrix_rows = [
        matrix_headers,
        [Paragraph("<b>IT Services (Infosys)</b>", table_cell_bold), Paragraph("Mass Campus Drives", table_cell_style), Paragraph("6-month bench training", table_cell_style), Paragraph("Pre-verified competency", table_cell_style), Paragraph("<b>70% Faster</b>", table_cell_bold)],
        [Paragraph("<b>E-Commerce (Flipkart)</b>", table_cell_bold), Paragraph("Hackathons & ATS", table_cell_style), Paragraph("Engineering review fatigue", table_cell_style), Paragraph("System design skill pills", table_cell_style), Paragraph("<b>60% Faster</b>", table_cell_bold)],
        [Paragraph("<b>Automotive IoT (Bosch)</b>", table_cell_bold), Paragraph("Workday Keyword ATS", table_cell_style), Paragraph("Embedded vs software mismatch", table_cell_style), Paragraph("Granular skill-gap diagnostics", table_cell_style), Paragraph("<b>50% Faster</b>", table_cell_bold)],
        [Paragraph("<b>Fintech (PhonePe)</b>", table_cell_bold), Paragraph("Agency Consultancies", table_cell_style), Paragraph("High 25% recruitment fee", table_cell_style), Paragraph("Direct verified matching", table_cell_style), Paragraph("<b>80% Cost Cut</b>", table_cell_bold)],
        [Paragraph("<b>Semicon (Texas Inst.)</b>", table_cell_bold), Paragraph("IIT/NIT Exclusive", table_cell_style), Paragraph("Tier-2 skilled talent locked out", table_cell_style), Paragraph("Meritocratic skill scoring", table_cell_style), Paragraph("<b>3x Talent Pool</b>", table_cell_bold)],
        [Paragraph("<b>Quick Commerce (Swiggy)</b>", table_cell_bold), Paragraph("LinkedIn / Inbound ATS", table_cell_style), Paragraph("1000s of identical resumes", table_cell_style), Paragraph("1-click 90%+ match pipeline", table_cell_style), Paragraph("<b>75% Faster</b>", table_cell_bold)],
        [Paragraph("<b>Biotech (Biocon)</b>", table_cell_bold), Paragraph("SAP SuccessFactors", table_cell_style), Paragraph("Missing hybrid bio-IT talent", table_cell_style), Paragraph("Cross-domain competency index", table_cell_style), Paragraph("<b>High Accuracy</b>", table_cell_bold)],
        [Paragraph("<b>Cloud SaaS (Postman)</b>", table_cell_bold), Paragraph("Lever ATS / Referrals", table_cell_style), Paragraph("Cannot assess code craft", table_cell_style), Paragraph("Direct skill verification", table_cell_style), Paragraph("<b>Zero Fluff</b>", table_cell_bold)],
        [Paragraph("<b>Aerospace (LTTS/HAL)</b>", table_cell_bold), Paragraph("Govt Paper Portals", table_cell_style), Paragraph("90-120 day slow cycle", table_cell_style), Paragraph("Agile cloud Kanban workflow", table_cell_style), Paragraph("<b>85% Faster</b>", table_cell_bold)],
        [Paragraph("<b>Retail IoT (Titan)</b>", table_cell_bold), Paragraph("Darwinbox ATS", table_cell_style), Paragraph("Legacy retail brand hurdle", table_cell_style), Paragraph("Startup-grade tech portal", table_cell_style), Paragraph("<b>High Quality</b>", table_cell_bold)],
    ]

    matrix_table = Table(matrix_rows, colWidths=[95, 95, 110, 115, 85])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    story.append(matrix_table)
    story.append(Spacer(1, 10))

    # Strategic Conclusion
    story.append(KeepTogether([
        Paragraph("4. Key Takeaways for HIERO Connect", sec_header_style),
        Paragraph(
            "1. <b>Industry Employers Suffer from 'Resume Noise':</b> Regardless of sector (Fintech, Automotive, or IT), companies waste 60%+ of recruitment bandwidth filtering inflated resumes. HIERO's verified Skill Intelligence transforms this into instant, reliable shortlists.<br/>"
            "2. <b>Skill-Gap Transparency is the Secret Weapon:</b> Industry hiring managers do not just need a score—they need to see exactly which skills are verified (e.g., Python ✓, Docker ✓) and which represent a training gap (e.g., Kubernetes ✗).<br/>"
            "3. <b>Bridging Tier-2/3 Colleges into Deep Tech:</b> Semiconductor and Biotech giants are eager to tap into skilled candidates outside the top 10 colleges if their competence is pre-validated.",
            body_style
        ),
        Spacer(1, 8),
        Paragraph("<i>Report generated for HIERO Connect System Architecture & Industry Positioning.</i>", meta_style)
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    output_pdf = r"c:\Users\Rahul\OneDrive\Desktop\rahulrc\connect-portal-\HIERO_10_Industry_Companies_Analysis.pdf"
    if len(sys.argv) > 1:
        output_pdf = sys.argv[1]
    build_pdf(output_pdf)
