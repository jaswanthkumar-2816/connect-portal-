// ============================================================
// HieroConnect — Demo/Seed Data
// ============================================================
// This file contains all mock data for the prototype.
// When the real HIERO API is connected, replace this with
// actual API calls through hiroService.ts
// ============================================================

import type {
  Company,
  Opportunity,
  Candidate,
  Application,
  DashboardStats,
  MatchResult,
  User,
} from '../types';

// --- Demo User ---
export const demoUser: User = {
  id: 'u1',
  name: 'Arjun Mehta',
  email: 'arjun@technova.com',
  role: 'industry',
  companyId: 'c1',
  designation: 'Head of Talent Acquisition',
  phone: '+91 98765 43210',
};

// --- Demo Companies ---
export const demoCompanies: Company[] = [
  {
    id: 'c1',
    name: 'TechNova',
    email: 'hr@technova.com',
    industry: 'Information Technology',
    size: '201-500',
    location: 'Bangalore, India',
    website: 'https://technova.io',
    description:
      'TechNova is a leading technology company specializing in AI-powered enterprise solutions. We build products that help businesses harness the power of machine learning and data analytics to make smarter decisions.',
    recruiter: {
      name: 'Arjun Mehta',
      designation: 'Head of Talent Acquisition',
      phone: '+91 98765 43210',
      email: 'arjun@technova.com',
    },
    createdAt: '2024-06-15',
  },
  {
    id: 'c2',
    name: 'DataSphere',
    email: 'careers@datasphere.ai',
    industry: 'Data Analytics & AI',
    size: '51-200',
    location: 'Hyderabad, India',
    website: 'https://datasphere.ai',
    description:
      'DataSphere is an AI-first data analytics company that transforms raw data into actionable intelligence for Fortune 500 clients across healthcare, finance, and retail.',
    recruiter: {
      name: 'Priya Sharma',
      designation: 'Technical Recruiter',
      phone: '+91 87654 32109',
      email: 'priya@datasphere.ai',
    },
    createdAt: '2024-03-20',
  },
  {
    id: 'c3',
    name: 'CloudWorks',
    email: 'talent@cloudworks.dev',
    industry: 'Cloud Computing & DevOps',
    size: '501-1000',
    location: 'Pune, India',
    website: 'https://cloudworks.dev',
    description:
      'CloudWorks provides enterprise-grade cloud infrastructure and DevOps solutions. We help companies migrate to the cloud and build resilient, scalable systems.',
    recruiter: {
      name: 'Rahul Krishnan',
      designation: 'VP Engineering',
      phone: '+91 76543 21098',
      email: 'rahul@cloudworks.dev',
    },
    createdAt: '2024-01-10',
  },
];

// --- Demo Opportunities ---
export const demoOpportunities: Opportunity[] = [
  {
    id: 'j1',
    companyId: 'c1',
    type: 'internship',
    title: 'Software Developer Intern',
    department: 'Engineering',
    description:
      'We are looking for a motivated Software Developer Intern to join our engineering team. You will work on building and optimizing core platform features, collaborate with senior engineers, and gain hands-on experience with modern tech stacks including React, Node.js, Python, and cloud services.',
    requiredSkills: [
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'SQL', importance: 'high', category: 'required' },
      { name: 'React', importance: 'high', category: 'required' },
      { name: 'Git', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'AWS', importance: 'medium', category: 'preferred' },
      { name: 'Docker', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech/B.E. in CS or related fields. CGPA 7.0+',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Internship',
    salary: '₹25,000/month',
    deadline: '2026-09-30',
    status: 'active',
    applicantsCount: 47,
    shortlistedCount: 12,
    createdAt: '2026-07-15',
  },
  {
    id: 'j2',
    companyId: 'c1',
    type: 'full-time',
    title: 'Data Analyst',
    department: 'Data Science',
    description:
      'Join our data science team to analyze complex datasets, build dashboards, and generate insights that drive business decisions. You will work with Python, SQL, Tableau, and modern BI tools.',
    requiredSkills: [
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'SQL', importance: 'high', category: 'required' },
      { name: 'Tableau', importance: 'medium', category: 'required' },
      { name: 'Statistics', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'R', importance: 'low', category: 'preferred' },
      { name: 'Machine Learning', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech/M.Tech/MCA. 0-2 years experience.',
    location: 'Bangalore, India',
    workMode: 'on-site',
    employmentType: 'Full-time',
    salary: '₹8-12 LPA',
    deadline: '2026-10-15',
    status: 'active',
    applicantsCount: 83,
    shortlistedCount: 18,
    createdAt: '2026-07-01',
  },
  {
    id: 'j3',
    companyId: 'c2',
    type: 'internship',
    title: 'AI/ML Engineer Intern',
    department: 'AI Research',
    description:
      'Work alongside our AI research team on cutting-edge machine learning projects. You will assist in model development, data preprocessing, and experimentation with transformer architectures.',
    requiredSkills: [
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'Machine Learning', importance: 'high', category: 'required' },
      { name: 'TensorFlow', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'PyTorch', importance: 'medium', category: 'preferred' },
      { name: 'NLP', importance: 'medium', category: 'preferred' },
      { name: 'LLMs', importance: 'low', category: 'preferred' },
    ],
    eligibility: 'B.Tech/M.Tech in CS/AI/ML. Strong fundamentals.',
    location: 'Hyderabad, India',
    workMode: 'hybrid',
    employmentType: 'Internship',
    salary: '₹30,000/month',
    deadline: '2026-08-31',
    status: 'active',
    applicantsCount: 124,
    shortlistedCount: 22,
    createdAt: '2026-06-20',
  },
  {
    id: 'j4',
    companyId: 'c1',
    type: 'full-time',
    title: 'Frontend Developer',
    department: 'Product Engineering',
    description:
      'Build beautiful, performant user interfaces for our enterprise platform. Work with React, TypeScript, and modern CSS frameworks to deliver exceptional user experiences.',
    requiredSkills: [
      { name: 'React', importance: 'high', category: 'required' },
      { name: 'TypeScript', importance: 'high', category: 'required' },
      { name: 'CSS', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Next.js', importance: 'medium', category: 'preferred' },
      { name: 'Tailwind CSS', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech in CS. 1-3 years frontend experience.',
    location: 'Bangalore, India',
    workMode: 'remote',
    employmentType: 'Full-time',
    salary: '₹10-16 LPA',
    deadline: '2026-11-01',
    status: 'active',
    applicantsCount: 56,
    shortlistedCount: 8,
    createdAt: '2026-08-01',
  },
  {
    id: 'j5',
    companyId: 'c1',
    type: 'full-time',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    description:
      'Manage and optimize our cloud infrastructure, CI/CD pipelines, and deployment systems. Work with AWS, Kubernetes, Terraform, and monitoring tools.',
    requiredSkills: [
      { name: 'AWS', importance: 'high', category: 'required' },
      { name: 'Docker', importance: 'high', category: 'required' },
      { name: 'Kubernetes', importance: 'high', category: 'required' },
      { name: 'Linux', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Terraform', importance: 'medium', category: 'preferred' },
      { name: 'Python', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech in CS/IT. 2-5 years DevOps experience.',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Full-time',
    salary: '₹15-22 LPA',
    deadline: '2026-10-30',
    status: 'draft',
    applicantsCount: 0,
    shortlistedCount: 0,
    createdAt: '2026-08-10',
  },
  {
    id: 'j6',
    companyId: 'c2',
    type: 'full-time',
    title: 'Backend Developer',
    department: 'Platform Engineering',
    description:
      'Design and build scalable backend services for our data analytics platform. Work with Node.js, Python, PostgreSQL, and microservices architecture.',
    requiredSkills: [
      { name: 'Node.js', importance: 'high', category: 'required' },
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'PostgreSQL', importance: 'high', category: 'required' },
      { name: 'REST APIs', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'GraphQL', importance: 'medium', category: 'preferred' },
      { name: 'Redis', importance: 'low', category: 'preferred' },
    ],
    eligibility: 'B.Tech/MCA. 1-3 years backend experience.',
    location: 'Hyderabad, India',
    workMode: 'remote',
    employmentType: 'Full-time',
    salary: '₹12-18 LPA',
    deadline: '2026-09-15',
    status: 'closed',
    applicantsCount: 92,
    shortlistedCount: 15,
    createdAt: '2026-05-10',
  },
];

// --- Demo Candidates (from HIERO) ---
export const demoCandidates: Candidate[] = [
  {
    id: 's1',
    name: 'Aisha Patel',
    email: 'aisha.patel@email.com',
    phone: '+91 98765 00001',
    headline: 'Full Stack Developer | React & Python Enthusiast',
    location: 'Mumbai, India',
    skills: [
      { name: 'Python', competency: 94, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'React', competency: 88, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'SQL', competency: 91, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'Git', competency: 86, verified: true, lastAssessedAt: '2026-07-10' },
      { name: 'AWS', competency: 62, verified: false, lastAssessedAt: '2026-06-01' },
      { name: 'Docker', competency: 45, verified: false, lastAssessedAt: '2026-05-15' },
    ],
    projects: [
      {
        title: 'E-Commerce Platform',
        description: 'Built a full-stack e-commerce platform with React frontend and Python/Flask backend.',
        skills: ['React', 'Python', 'SQL', 'REST APIs'],
      },
      {
        title: 'Sentiment Analysis Dashboard',
        description: 'Real-time sentiment analysis of social media data using NLP and visualization.',
        skills: ['Python', 'NLP', 'React', 'Chart.js'],
      },
    ],
    education: [
      {
        institution: 'IIT Bombay',
        degree: 'B.Tech',
        field: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.9,
      },
    ],
    experience: [
      {
        company: 'TechStart',
        role: 'Summer Intern',
        description: 'Developed REST APIs and optimized database queries for the core platform.',
        startDate: '2025-05',
        endDate: '2025-07',
        skills: ['Python', 'SQL', 'REST APIs'],
      },
    ],
    certifications: [
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025-12' },
    ],
    resumeUrl: '#',
    aboutMe: 'Passionate full-stack developer with strong fundamentals in DSA and system design. Looking to contribute to impactful products.',
    hieroAssessments: [
      { skill: 'Python', score: 94, level: 'advanced', assessedAt: '2026-07-20' },
      { skill: 'React', score: 88, level: 'advanced', assessedAt: '2026-07-18' },
      { skill: 'SQL', score: 91, level: 'advanced', assessedAt: '2026-07-15' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'certifications', 'resume'],
  },
  {
    id: 's2',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 00002',
    headline: 'ML Engineer | Data Science Enthusiast',
    location: 'Delhi, India',
    skills: [
      { name: 'Python', competency: 92, verified: true, lastAssessedAt: '2026-07-22' },
      { name: 'Machine Learning', competency: 89, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'TensorFlow', competency: 85, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'SQL', competency: 78, verified: false, lastAssessedAt: '2026-06-10' },
      { name: 'PyTorch', competency: 80, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'NLP', competency: 75, verified: false, lastAssessedAt: '2026-06-20' },
    ],
    projects: [
      {
        title: 'Movie Recommendation System',
        description: 'Collaborative filtering recommendation engine using deep learning.',
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'Pandas'],
      },
      {
        title: 'Chatbot with Intent Recognition',
        description: 'NLP-powered chatbot for customer support with intent classification.',
        skills: ['Python', 'NLP', 'TensorFlow', 'Flask'],
      },
    ],
    education: [
      {
        institution: 'IIT Delhi',
        degree: 'B.Tech',
        field: 'Electronics & Communication',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.5,
      },
    ],
    experience: [],
    certifications: [
      { name: 'TensorFlow Developer Certificate', issuer: 'Google', date: '2025-11' },
    ],
    resumeUrl: '#',
    aboutMe: 'Aspiring ML engineer with a strong foundation in mathematics and deep learning.',
    hieroAssessments: [
      { skill: 'Python', score: 92, level: 'advanced', assessedAt: '2026-07-22' },
      { skill: 'Machine Learning', score: 89, level: 'advanced', assessedAt: '2026-07-20' },
      { skill: 'TensorFlow', score: 85, level: 'advanced', assessedAt: '2026-07-18' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'certifications', 'resume'],
  },
  {
    id: 's3',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    headline: 'Frontend Developer | UI/UX Designer',
    location: 'Hyderabad, India',
    skills: [
      { name: 'React', competency: 95, verified: true, lastAssessedAt: '2026-07-25' },
      { name: 'TypeScript', competency: 90, verified: true, lastAssessedAt: '2026-07-22' },
      { name: 'CSS', competency: 93, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'Next.js', competency: 82, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'Tailwind CSS', competency: 88, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'Node.js', competency: 65, verified: false, lastAssessedAt: '2026-06-05' },
    ],
    projects: [
      {
        title: 'Design System Library',
        description: 'Built a comprehensive React component library with Storybook documentation.',
        skills: ['React', 'TypeScript', 'CSS', 'Storybook'],
      },
      {
        title: 'Portfolio Generator',
        description: 'Web app that generates developer portfolios from GitHub data.',
        skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      },
    ],
    education: [
      {
        institution: 'BITS Pilani',
        degree: 'B.E.',
        field: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        cgpa: 9.1,
      },
    ],
    experience: [
      {
        company: 'DesignCo',
        role: 'Frontend Intern',
        description: 'Redesigned the main product UI, improving user engagement by 23%.',
        startDate: '2025-06',
        endDate: '2025-08',
        skills: ['React', 'TypeScript', 'CSS'],
      },
    ],
    certifications: [],
    resumeUrl: '#',
    aboutMe: 'Creative frontend developer with a keen eye for design and user experience.',
    hieroAssessments: [
      { skill: 'React', score: 95, level: 'master', assessedAt: '2026-07-25' },
      { skill: 'TypeScript', score: 90, level: 'advanced', assessedAt: '2026-07-22' },
      { skill: 'CSS', score: 93, level: 'master', assessedAt: '2026-07-20' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'resume'],
  },
  {
    id: 's4',
    name: 'Karthik Menon',
    email: 'karthik.m@email.com',
    headline: 'Data Analyst | SQL & Visualization Expert',
    location: 'Chennai, India',
    skills: [
      { name: 'Python', competency: 85, verified: true, lastAssessedAt: '2026-07-19' },
      { name: 'SQL', competency: 93, verified: true, lastAssessedAt: '2026-07-22' },
      { name: 'Tableau', competency: 88, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'Statistics', competency: 90, verified: true, lastAssessedAt: '2026-07-10' },
      { name: 'R', competency: 72, verified: false, lastAssessedAt: '2026-06-01' },
      { name: 'Machine Learning', competency: 55, verified: false, lastAssessedAt: '2026-05-20' },
    ],
    projects: [
      {
        title: 'Sales Analytics Dashboard',
        description: 'Interactive dashboard for retail sales data with predictive trends.',
        skills: ['Python', 'SQL', 'Tableau', 'Statistics'],
      },
    ],
    education: [
      {
        institution: 'NIT Trichy',
        degree: 'B.Tech',
        field: 'Information Technology',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.2,
      },
    ],
    experience: [
      {
        company: 'AnalyticsPro',
        role: 'Data Analyst Intern',
        description: 'Built automated reporting pipelines and ad-hoc analysis for business teams.',
        startDate: '2025-05',
        endDate: '2025-07',
        skills: ['SQL', 'Python', 'Tableau'],
      },
    ],
    certifications: [
      { name: 'Tableau Desktop Specialist', issuer: 'Tableau', date: '2025-10' },
    ],
    resumeUrl: '#',
    aboutMe: 'Detail-oriented data analyst who loves turning data into actionable insights.',
    hieroAssessments: [
      { skill: 'SQL', score: 93, level: 'master', assessedAt: '2026-07-22' },
      { skill: 'Tableau', score: 88, level: 'advanced', assessedAt: '2026-07-15' },
      { skill: 'Statistics', score: 90, level: 'advanced', assessedAt: '2026-07-10' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'certifications', 'resume'],
  },
  {
    id: 's5',
    name: 'Priyanka Joshi',
    email: 'priyanka.j@email.com',
    headline: 'Backend Developer | Microservices & Cloud',
    location: 'Pune, India',
    skills: [
      { name: 'Node.js', competency: 91, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'Python', competency: 82, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'PostgreSQL', competency: 87, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'Docker', competency: 78, verified: true, lastAssessedAt: '2026-07-10' },
      { name: 'AWS', competency: 70, verified: false, lastAssessedAt: '2026-06-05' },
      { name: 'GraphQL', competency: 65, verified: false, lastAssessedAt: '2026-05-20' },
    ],
    projects: [
      {
        title: 'Real-time Chat Application',
        description: 'Scalable chat app using WebSockets, Node.js, and PostgreSQL.',
        skills: ['Node.js', 'PostgreSQL', 'WebSocket', 'Docker'],
      },
      {
        title: 'API Gateway Service',
        description: 'Microservices API gateway with rate limiting and authentication.',
        skills: ['Node.js', 'Redis', 'Docker', 'REST APIs'],
      },
    ],
    education: [
      {
        institution: 'COEP Pune',
        degree: 'B.Tech',
        field: 'Computer Engineering',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.7,
      },
    ],
    experience: [],
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2026-01' },
    ],
    resumeUrl: '#',
    aboutMe: 'Backend-focused developer passionate about building scalable systems.',
    hieroAssessments: [
      { skill: 'Node.js', score: 91, level: 'advanced', assessedAt: '2026-07-20' },
      { skill: 'PostgreSQL', score: 87, level: 'advanced', assessedAt: '2026-07-15' },
      { skill: 'Docker', score: 78, level: 'intermediate', assessedAt: '2026-07-10' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'certifications', 'resume'],
  },
  {
    id: 's6',
    name: 'Rohan Gupta',
    email: 'rohan.g@email.com',
    headline: 'DevOps & Cloud Enthusiast',
    location: 'Bangalore, India',
    skills: [
      { name: 'AWS', competency: 88, verified: true, lastAssessedAt: '2026-07-22' },
      { name: 'Docker', competency: 92, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'Kubernetes', competency: 85, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'Linux', competency: 90, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'Python', competency: 75, verified: false, lastAssessedAt: '2026-06-10' },
      { name: 'Terraform', competency: 78, verified: true, lastAssessedAt: '2026-07-05' },
    ],
    projects: [
      {
        title: 'Kubernetes Cluster Manager',
        description: 'Automated K8s cluster provisioning and monitoring dashboard.',
        skills: ['Kubernetes', 'Docker', 'Python', 'Grafana'],
      },
    ],
    education: [
      {
        institution: 'IIIT Hyderabad',
        degree: 'B.Tech',
        field: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.3,
      },
    ],
    experience: [
      {
        company: 'CloudScale',
        role: 'DevOps Intern',
        description: 'Managed CI/CD pipelines and automated infrastructure provisioning.',
        startDate: '2025-06',
        endDate: '2025-08',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      },
    ],
    certifications: [
      { name: 'AWS Solutions Architect Associate', issuer: 'AWS', date: '2026-02' },
      { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2025-12' },
    ],
    resumeUrl: '#',
    aboutMe: 'Cloud-native enthusiast focused on building reliable, scalable infrastructure.',
    hieroAssessments: [
      { skill: 'AWS', score: 88, level: 'advanced', assessedAt: '2026-07-22' },
      { skill: 'Docker', score: 92, level: 'master', assessedAt: '2026-07-20' },
      { skill: 'Kubernetes', score: 85, level: 'advanced', assessedAt: '2026-07-18' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'certifications', 'resume'],
  },
  {
    id: 's7',
    name: 'Meera Iyer',
    email: 'meera.i@email.com',
    headline: 'Full Stack Developer | MERN Stack',
    location: 'Chennai, India',
    skills: [
      { name: 'React', competency: 87, verified: true, lastAssessedAt: '2026-07-19' },
      { name: 'Node.js', competency: 84, verified: true, lastAssessedAt: '2026-07-17' },
      { name: 'SQL', competency: 79, verified: false, lastAssessedAt: '2026-06-15' },
      { name: 'Git', competency: 82, verified: true, lastAssessedAt: '2026-07-10' },
      { name: 'Python', competency: 70, verified: false, lastAssessedAt: '2026-05-20' },
    ],
    projects: [
      {
        title: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates.',
        skills: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      },
    ],
    education: [
      {
        institution: 'VIT Vellore',
        degree: 'B.Tech',
        field: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.1,
      },
    ],
    experience: [],
    certifications: [],
    resumeUrl: '#',
    aboutMe: 'Aspiring full-stack developer with a passion for clean code.',
    hieroAssessments: [
      { skill: 'React', score: 87, level: 'advanced', assessedAt: '2026-07-19' },
      { skill: 'Node.js', score: 84, level: 'advanced', assessedAt: '2026-07-17' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'resume'],
  },
  {
    id: 's8',
    name: 'Aditya Verma',
    email: 'aditya.v@email.com',
    headline: 'Software Engineer | Systems Programming',
    location: 'Bangalore, India',
    skills: [
      { name: 'Python', competency: 88, verified: true, lastAssessedAt: '2026-07-21' },
      { name: 'SQL', competency: 82, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'Git', competency: 90, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'React', competency: 55, verified: false, lastAssessedAt: '2026-06-01' },
      { name: 'AWS', competency: 40, verified: false, lastAssessedAt: '2026-05-10' },
    ],
    projects: [
      {
        title: 'CLI Tool for Git Analytics',
        description: 'Command-line tool that analyzes Git repository patterns and developer productivity.',
        skills: ['Python', 'Git', 'CLI'],
      },
    ],
    education: [
      {
        institution: 'IIT Madras',
        degree: 'B.Tech',
        field: 'Computer Science',
        startYear: 2023,
        endYear: 2027,
        cgpa: 8.6,
      },
    ],
    experience: [],
    certifications: [],
    resumeUrl: '#',
    aboutMe: 'Systems-oriented developer with strong DSA fundamentals.',
    hieroAssessments: [
      { skill: 'Python', score: 88, level: 'advanced', assessedAt: '2026-07-21' },
      { skill: 'Git', score: 90, level: 'advanced', assessedAt: '2026-07-15' },
    ],
    authorizedSections: ['skills', 'projects', 'education'],
  },
  {
    id: 's9',
    name: 'Nisha Agarwal',
    email: 'nisha.a@email.com',
    headline: 'Data Engineer | ETL & Pipeline Specialist',
    location: 'Gurgaon, India',
    skills: [
      { name: 'Python', competency: 86, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'SQL', competency: 94, verified: true, lastAssessedAt: '2026-07-23' },
      { name: 'AWS', competency: 80, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'Docker', competency: 68, verified: false, lastAssessedAt: '2026-06-10' },
    ],
    projects: [
      {
        title: 'ETL Pipeline Orchestrator',
        description: 'Automated ETL pipeline for processing 10M+ records daily from multiple sources.',
        skills: ['Python', 'SQL', 'AWS', 'Airflow'],
      },
    ],
    education: [
      {
        institution: 'DTU',
        degree: 'B.Tech',
        field: 'Information Technology',
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.4,
      },
    ],
    experience: [
      {
        company: 'DataFlow Inc',
        role: 'Data Engineering Intern',
        description: 'Built and optimized data pipelines processing terabytes of data.',
        startDate: '2025-06',
        endDate: '2025-08',
        skills: ['Python', 'SQL', 'AWS', 'Airflow'],
      },
    ],
    certifications: [
      { name: 'AWS Data Analytics Specialty', issuer: 'AWS', date: '2026-03' },
    ],
    resumeUrl: '#',
    aboutMe: 'Data engineer passionate about building efficient data pipelines.',
    hieroAssessments: [
      { skill: 'SQL', score: 94, level: 'master', assessedAt: '2026-07-23' },
      { skill: 'Python', score: 86, level: 'advanced', assessedAt: '2026-07-20' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'certifications', 'resume'],
  },
  {
    id: 's10',
    name: 'Arjun Nair',
    email: 'arjun.n@email.com',
    headline: 'ML Engineer | Computer Vision',
    location: 'Kochi, India',
    skills: [
      { name: 'Python', competency: 93, verified: true, lastAssessedAt: '2026-07-24' },
      { name: 'Machine Learning', competency: 91, verified: true, lastAssessedAt: '2026-07-22' },
      { name: 'TensorFlow', competency: 88, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'PyTorch', competency: 90, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'NLP', competency: 82, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'LLMs', mastered: 78, verified: false, lastAssessedAt: '2026-07-10' } as any,
    ],
    projects: [
      {
        title: 'Object Detection System',
        description: 'Real-time object detection using YOLOv8 with deployment optimization.',
        skills: ['Python', 'PyTorch', 'Computer Vision', 'Docker'],
      },
      {
        title: 'LLM Fine-tuning Pipeline',
        description: 'End-to-end pipeline for fine-tuning language models on domain-specific data.',
        skills: ['Python', 'PyTorch', 'NLP', 'Transformers'],
      },
    ],
    education: [
      {
        institution: 'IISc Bangalore',
        degree: 'M.Tech',
        field: 'Artificial Intelligence',
        startYear: 2024,
        endYear: 2026,
        cgpa: 9.2,
      },
    ],
    experience: [
      {
        company: 'AI Research Lab',
        role: 'Research Intern',
        description: 'Published paper on efficient transformer architectures for edge devices.',
        startDate: '2025-01',
        endDate: '2025-06',
        skills: ['Python', 'PyTorch', 'Machine Learning', 'Research'],
      },
    ],
    certifications: [
      { name: 'Deep Learning Specialization', issuer: 'Coursera', date: '2025-08' },
    ],
    resumeUrl: '#',
    aboutMe: 'ML researcher with published work in efficient deep learning. Passionate about bringing AI to production.',
    hieroAssessments: [
      { skill: 'Python', score: 93, level: 'master', assessedAt: '2026-07-24' },
      { skill: 'Machine Learning', score: 91, level: 'master', assessedAt: '2026-07-22' },
      { skill: 'PyTorch', score: 90, level: 'advanced', assessedAt: '2026-07-18' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'certifications', 'resume'],
  },
  {
    id: 's11',
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@email.com',
    headline: 'Frontend Developer | Accessibility Champion',
    location: 'Mumbai, India',
    skills: [
      { name: 'React', competency: 91, verified: true, lastAssessedAt: '2026-07-23' },
      { name: 'TypeScript', competency: 85, verified: true, lastAssessedAt: '2026-07-20' },
      { name: 'CSS', competency: 89, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'Git', competency: 80, verified: true, lastAssessedAt: '2026-07-10' },
      { name: 'Python', competency: 50, verified: false, lastAssessedAt: '2026-05-15' },
    ],
    projects: [
      {
        title: 'Accessible UI Component Library',
        description: 'React component library with full WCAG 2.1 AA compliance.',
        skills: ['React', 'TypeScript', 'CSS', 'Accessibility'],
      },
    ],
    education: [
      {
        institution: 'Mumbai University',
        degree: 'B.Sc',
        field: 'Computer Science',
        startYear: 2022,
        endYear: 2025,
        cgpa: 8.8,
      },
    ],
    experience: [
      {
        company: 'WebAccess',
        role: 'Frontend Developer',
        description: 'Building accessible web interfaces for government portals.',
        startDate: '2025-09',
        endDate: 'Present',
        skills: ['React', 'TypeScript', 'CSS', 'Accessibility'],
      },
    ],
    certifications: [],
    resumeUrl: '#',
    aboutMe: 'Frontend developer passionate about building inclusive digital experiences.',
    hieroAssessments: [
      { skill: 'React', score: 91, level: 'master', assessedAt: '2026-07-23' },
      { skill: 'TypeScript', score: 85, level: 'advanced', assessedAt: '2026-07-20' },
    ],
    authorizedSections: ['skills', 'projects', 'education', 'experience', 'resume'],
  },
  {
    id: 's12',
    name: 'Siddharth Rao',
    email: 'sid.r@email.com',
    headline: 'Full Stack Developer | Open Source Contributor',
    location: 'Bangalore, India',
    skills: [
      { name: 'React', competency: 83, verified: true, lastAssessedAt: '2026-07-18' },
      { name: 'Python', competency: 80, verified: true, lastAssessedAt: '2026-07-15' },
      { name: 'SQL', competency: 76, verified: false, lastAssessedAt: '2026-06-10' },
      { name: 'Git', competency: 92, verified: true, lastAssessedAt: '2026-07-22' },
      { name: 'Docker', competency: 70, verified: false, lastAssessedAt: '2026-06-05' },
    ],
    projects: [
      {
        title: 'Open Source CLI Framework',
        description: 'Popular CLI framework with 500+ GitHub stars.',
        skills: ['Python', 'Git', 'CLI', 'Testing'],
      },
    ],
    education: [
      {
        institution: 'Manipal Institute of Technology',
        degree: 'B.Tech',
        field: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        cgpa: 7.9,
      },
    ],
    experience: [],
    certifications: [],
    resumeUrl: '#',
    aboutMe: 'Open source enthusiast with a love for developer tooling.',
    hieroAssessments: [
      { skill: 'Python', score: 80, level: 'advanced', assessedAt: '2026-07-15' },
      { skill: 'Git', score: 92, level: 'master', assessedAt: '2026-07-22' },
    ],
    authorizedSections: ['skills', 'projects', 'education'],
  },
];

// --- Demo Applications ---
export const demoApplications: Application[] = [
  // Software Developer Intern (j1)
  { id: 'a1', opportunityId: 'j1', studentId: 's1', matchScore: 94, matchingSkills: [{ name: 'Python', score: 94 }, { name: 'SQL', score: 91 }, { name: 'React', score: 88 }, { name: 'Git', score: 86 }], skillGaps: [{ name: 'AWS', required: 60, candidate: 62 }, { name: 'Docker', required: 50, candidate: 45 }], status: 'shortlisted', appliedAt: '2026-07-20' },
  { id: 'a2', opportunityId: 'j1', studentId: 's5', matchScore: 72, matchingSkills: [{ name: 'Python', score: 82 }, { name: 'SQL', score: 78 }], skillGaps: [{ name: 'React', required: 70, candidate: 0 }, { name: 'Git', required: 70, candidate: 0 }], status: 'under-review', appliedAt: '2026-07-22' },
  { id: 'a3', opportunityId: 'j1', studentId: 's7', matchScore: 78, matchingSkills: [{ name: 'React', score: 87 }, { name: 'SQL', score: 79 }], skillGaps: [{ name: 'Python', required: 70, candidate: 70 }, { name: 'Git', required: 70, candidate: 82 }], status: 'applied', appliedAt: '2026-07-25' },
  { id: 'a4', opportunityId: 'j1', studentId: 's12', matchScore: 75, matchingSkills: [{ name: 'Python', score: 80 }, { name: 'React', score: 83 }, { name: 'Git', score: 92 }], skillGaps: [{ name: 'SQL', required: 70, candidate: 76 }], status: 'applied', appliedAt: '2026-07-26' },
  { id: 'a5', opportunityId: 'j1', studentId: 's8', matchScore: 82, matchingSkills: [{ name: 'Python', score: 88 }, { name: 'SQL', score: 82 }, { name: 'Git', score: 90 }], skillGaps: [{ name: 'React', required: 70, candidate: 55 }], status: 'interview', appliedAt: '2026-07-18' },
  // Data Analyst (j2)
  { id: 'a6', opportunityId: 'j2', studentId: 's4', matchScore: 91, matchingSkills: [{ name: 'Python', score: 85 }, { name: 'SQL', score: 93 }, { name: 'Tableau', score: 88 }, { name: 'Statistics', score: 90 }], skillGaps: [], status: 'shortlisted', appliedAt: '2026-07-05' },
  { id: 'a7', opportunityId: 'j2', studentId: 's1', matchScore: 70, matchingSkills: [{ name: 'Python', score: 94 }, { name: 'SQL', score: 91 }], skillGaps: [{ name: 'Tableau', required: 60, candidate: 0 }, { name: 'Statistics', required: 70, candidate: 0 }], status: 'under-review', appliedAt: '2026-07-08' },
  { id: 'a8', opportunityId: 'j2', studentId: 's9', matchScore: 82, matchingSkills: [{ name: 'Python', score: 86 }, { name: 'SQL', score: 94 }], skillGaps: [{ name: 'Tableau', required: 60, candidate: 0 }, { name: 'Statistics', required: 70, candidate: 0 }], status: 'interview', appliedAt: '2026-07-03' },
  // AI/ML Engineer Intern (j3)
  { id: 'a9', opportunityId: 'j3', studentId: 's2', matchScore: 89, matchingSkills: [{ name: 'Python', score: 92 }, { name: 'Machine Learning', score: 89 }, { name: 'TensorFlow', score: 85 }], skillGaps: [{ name: 'PyTorch', required: 70, candidate: 80 }], status: 'shortlisted', appliedAt: '2026-06-25' },
  { id: 'a10', opportunityId: 'j3', studentId: 's10', matchScore: 93, matchingSkills: [{ name: 'Python', score: 93 }, { name: 'Machine Learning', score: 91 }, { name: 'TensorFlow', score: 88 }, { name: 'PyTorch', score: 90 }], skillGaps: [], status: 'selected', appliedAt: '2026-06-22' },
  { id: 'a11', opportunityId: 'j3', studentId: 's4', matchScore: 55, matchingSkills: [{ name: 'Python', score: 85 }], skillGaps: [{ name: 'Machine Learning', required: 80, candidate: 55 }, { name: 'TensorFlow', required: 70, candidate: 0 }], status: 'rejected', appliedAt: '2026-06-28' },
  // Frontend Developer (j4)
  { id: 'a12', opportunityId: 'j4', studentId: 's3', matchScore: 95, matchingSkills: [{ name: 'React', score: 95 }, { name: 'TypeScript', score: 90 }, { name: 'CSS', score: 93 }], skillGaps: [], status: 'shortlisted', appliedAt: '2026-08-03' },
  { id: 'a13', opportunityId: 'j4', studentId: 's11', matchScore: 88, matchingSkills: [{ name: 'React', score: 91 }, { name: 'TypeScript', score: 85 }, { name: 'CSS', score: 89 }], skillGaps: [], status: 'applied', appliedAt: '2026-08-05' },
  { id: 'a14', opportunityId: 'j4', studentId: 's7', matchScore: 76, matchingSkills: [{ name: 'React', score: 87 }], skillGaps: [{ name: 'TypeScript', required: 70, candidate: 0 }, { name: 'CSS', required: 70, candidate: 0 }], status: 'under-review', appliedAt: '2026-08-04' },
  // Backend Developer (j6)
  { id: 'a15', opportunityId: 'j6', studentId: 's5', matchScore: 84, matchingSkills: [{ name: 'Node.js', score: 91 }, { name: 'Python', score: 82 }, { name: 'PostgreSQL', score: 87 }], skillGaps: [{ name: 'GraphQL', required: 50, candidate: 65 }], status: 'selected', appliedAt: '2026-05-15' },
];

// --- Dashboard Stats (for Company c1) ---
export const demoDashboardStats: DashboardStats = {
  activeJobs: 3,
  activeInternships: 1,
  totalApplications: 176,
  shortlistedCandidates: 38,
  interviews: 14,
  hires: 5,
  topSkillsDemand: [
    { skill: 'Python', percentage: 82 },
    { skill: 'SQL', percentage: 76 },
    { skill: 'React', percentage: 69 },
    { skill: 'AWS', percentage: 61 },
    { skill: 'Docker', percentage: 54 },
    { skill: 'Node.js', percentage: 48 },
    { skill: 'TypeScript', percentage: 42 },
  ],
};

// --- Helper: Generate Match Results for a given opportunity ---
export function generateMatchResults(opportunityId: string): MatchResult[] {
  const oppApplications = demoApplications.filter(a => a.opportunityId === opportunityId);
  
  return oppApplications
    .map(app => {
      const candidate = demoCandidates.find(c => c.id === app.studentId);
      if (!candidate) return null;

      const opp = demoOpportunities.find(o => o.id === opportunityId);
      if (!opp) return null;

      const allRequired = [...opp.requiredSkills, ...opp.preferredSkills];
      const skillMatches = allRequired.map(req => {
        const candSkill = candidate.skills.find(s => s.name === req.name);
        return {
          name: req.name,
          score: candSkill?.competency ?? 0,
          meetsRequired: req.category === 'required' && (candSkill?.competency ?? 0) >= 60,
        };
      });

      const matchedCount = skillMatches.filter(s => s.meetsRequired).length;
      const totalRequired = opp.requiredSkills.length;
      const strengths = skillMatches.filter(s => s.score >= 80).map(s => `${s.name} (${s.score}%)`);
      const gaps = skillMatches.filter(s => s.score < 60).map(s => `${s.name} (${s.score}%)`);

      let explanation = '';
      if (matchedCount === totalRequired) {
        explanation = `Strong alignment with all ${totalRequired} required skills. ${gaps.length > 0 ? `${gaps.length} preferred skill${gaps.length > 1 ? 's' : ''} below threshold.` : 'Excellent match across all criteria.'}`;
      } else {
        explanation = `Aligns with ${matchedCount} of ${totalRequired} required skills. ${gaps.length > 0 ? `Gaps in: ${gaps.join(', ')}.` : 'Review preferred skill alignment.'}`;
      }

      return {
        candidateId: app.studentId,
        overallScore: app.matchScore,
        skillMatches,
        matchExplanation: explanation,
        strengths,
        gaps,
      };
    })
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => b.overallScore - a.overallScore);
}
