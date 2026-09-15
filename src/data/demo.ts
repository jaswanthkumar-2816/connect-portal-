// ============================================================
// HieroConnect — Comprehensive Demo Data (50 HIERO Candidates + 50 Bridge Students)
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

export const demoUser: User = {
  id: 'u1',
  name: 'Rahul Chavan',
  email: 'hr@technova.com',
  role: 'industry',
  companyId: 'c1',
  designation: 'HR Talent Acquisition Lead',
  phone: '+91 98765 43210',
};

export const demoCompanies: Company[] = [
  {
    id: 'c1',
    name: 'TechNova Inc.',
    email: 'hr@technova.com',
    industry: 'Enterprise AI & Cloud Systems',
    size: '201-500',
    location: 'Bangalore, India',
    website: 'https://technova.io',
    description: 'Leading provider of enterprise AI agents, high-throughput microservices, and verified technical hiring infrastructure.',
    recruiter: {
      name: 'Rahul Chavan',
      designation: 'HR Talent Acquisition Lead',
      phone: '+91 98765 43210',
      email: 'hr@technova.com',
    },
    createdAt: '2024-06-15',
  },
  {
    id: 'c2',
    name: 'DataSphere Technologies',
    email: 'careers@datasphere.ai',
    industry: 'Data Intelligence & Analytics',
    size: '51-200',
    location: 'Hyderabad, India',
    website: 'https://datasphere.ai',
    description: 'Data analytics platform transforming raw telemetric data into predictive operational insights.',
    recruiter: {
      name: 'Priya Sharma',
      designation: 'Technical Recruiter',
      phone: '+91 87654 32109',
      email: 'priya@datasphere.ai',
    },
    createdAt: '2024-03-20',
  }
];

export const demoOpportunities: Opportunity[] = [
  {
    id: 'j1',
    companyId: 'c1',
    type: 'internship',
    title: 'Software Developer Intern',
    department: 'Engineering',
    description: 'Build core platform features, reactive UI architectures, and scalable microservices.',
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
    eligibility: 'B.Tech/B.E. in CS/IT/AI. CGPA 7.5+',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Internship',
    salary: '₹35,000/month',
    deadline: '2026-10-30',
    status: 'active',
    applicantsCount: 50,
    shortlistedCount: 14,
    createdAt: '2026-07-15',
  },
  {
    id: 'j2',
    companyId: 'c1',
    type: 'full-time',
    title: 'Data Analyst & BI Engineer',
    department: 'Data Science',
    description: 'Develop analytics dashboards, execute ETL pipelines, and generate actionable insights.',
    requiredSkills: [
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'SQL', importance: 'high', category: 'required' },
      { name: 'Tableau', importance: 'medium', category: 'required' },
      { name: 'Statistics', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Spark', importance: 'medium', category: 'preferred' },
      { name: 'Airflow', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech/MCA/M.Tech. CGPA 7.0+',
    location: 'Hyderabad, India',
    workMode: 'hybrid',
    employmentType: 'Full-time',
    salary: '₹10-14 LPA',
    deadline: '2026-11-15',
    status: 'active',
    applicantsCount: 38,
    shortlistedCount: 10,
    createdAt: '2026-07-01',
  },
  {
    id: 'j3',
    companyId: 'c1',
    type: 'internship',
    title: 'AI/ML Research Engineer Intern',
    department: 'AI Research',
    description: 'Train transformer models, computer vision pipelines, and fine-tune LLM architectures.',
    requiredSkills: [
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'PyTorch', importance: 'high', category: 'required' },
      { name: 'TensorFlow', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Transformers', importance: 'high', category: 'preferred' },
      { name: 'CUDA', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech/M.Tech with strong ML portfolio. CGPA 8.0+',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Internship',
    salary: '₹45,000/month',
    deadline: '2026-10-25',
    status: 'active',
    applicantsCount: 65,
    shortlistedCount: 18,
    createdAt: '2026-07-10',
  },
  {
    id: 'j4',
    companyId: 'c1',
    type: 'full-time',
    title: 'Frontend Architecture Engineer',
    department: 'Frontend Architecture',
    description: 'Design and optimize reactive design systems, WebGL rendering, and responsive enterprise interfaces.',
    requiredSkills: [
      { name: 'React', importance: 'high', category: 'required' },
      { name: 'TypeScript', importance: 'high', category: 'required' },
      { name: 'CSS', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Next.js', importance: 'high', category: 'preferred' },
      { name: 'TailwindCSS', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech/BE. Demonstrated web app engineering.',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Full-time',
    salary: '₹14-20 LPA',
    deadline: '2026-11-30',
    status: 'active',
    applicantsCount: 42,
    shortlistedCount: 12,
    createdAt: '2026-08-01',
  },
  {
    id: 'j5',
    companyId: 'c1',
    type: 'full-time',
    title: 'Cloud Infrastructure & DevOps Engineer',
    department: 'Infrastructure',
    description: 'Manage automated Kubernetes clusters, multi-region CI/CD pipelines, and observability.',
    requiredSkills: [
      { name: 'AWS', importance: 'high', category: 'required' },
      { name: 'Docker', importance: 'high', category: 'required' },
      { name: 'Kubernetes', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Terraform', importance: 'high', category: 'preferred' },
      { name: 'Go', importance: 'medium', category: 'preferred' },
    ],
    eligibility: 'B.Tech/BE in CS/IT. Linux proficiency.',
    location: 'Bangalore / Pune, India',
    workMode: 'remote',
    employmentType: 'Full-time',
    salary: '₹16-24 LPA',
    deadline: '2026-12-15',
    status: 'active',
    applicantsCount: 30,
    shortlistedCount: 8,
    createdAt: '2026-08-05',
  },
  {
    id: 'j6',
    companyId: 'c1',
    type: 'full-time',
    title: 'Backend Systems & Distributed Engineer',
    department: 'Core Platform',
    description: 'Develop low-latency transactional microservices, distributed caching, and event streaming.',
    requiredSkills: [
      { name: 'Go', importance: 'high', category: 'required' },
      { name: 'Python', importance: 'high', category: 'required' },
      { name: 'PostgreSQL', importance: 'high', category: 'required' },
    ],
    preferredSkills: [
      { name: 'Kafka', importance: 'high', category: 'preferred' },
      { name: 'Redis', importance: 'high', category: 'preferred' },
    ],
    eligibility: 'B.Tech in CS/IT. Strong DSA & concurrency fundamentals.',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Full-time',
    salary: '₹18-26 LPA',
    deadline: '2026-11-20',
    status: 'active',
    applicantsCount: 45,
    shortlistedCount: 15,
    createdAt: '2026-08-10',
  }
];

// --- 50 HIERO Candidates ---
export const demoCandidates: Candidate[] = [
  {
    "id": "s1",
    "name": "Aisha Patel",
    "email": "aisha.patel@hiero.ai",
    "phone": "+91 9810000000",
    "headline": "Full Stack & AI Engineer | HIERO Skill Verified",
    "location": "Bombay, India",
    "aboutMe": "High-caliber Full Stack & AI Engineer from IIT Bombay specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Aisha_Patel_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Git",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AWS",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 81,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Bombay",
        "degree": "B.Tech",
        "field": "Computer Science & Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with React and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "React",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Full Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "SQL",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Full Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "React"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s2",
    "name": "Vikram Singh",
    "email": "vikram.singh@hiero.ai",
    "phone": "+91 9810001793",
    "headline": "Machine Learning Research Engineer | HIERO Skill Verified",
    "location": "Delhi, India",
    "aboutMe": "High-caliber Machine Learning Research Engineer from IIT Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Vikram_Singh_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Machine Learning",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TensorFlow",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Delhi",
        "degree": "B.Tech",
        "field": "Artificial Intelligence & ML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Machine Learning and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "Machine Learning",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Machine Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "TensorFlow",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Machine Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Machine Learning"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s3",
    "name": "Sneha Reddy",
    "email": "sneha.reddy@hiero.ai",
    "phone": "+91 9810003586",
    "headline": "Frontend & UI Architecture Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Frontend & UI Architecture Engineer from BITS Pilani specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Sneha_Reddy_Resume_Master.pdf",
    "skills": [
      {
        "name": "React",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CSS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Next.js",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TailwindCSS",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "BITS Pilani",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "React High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with TypeScript and sub-50ms latency SLAs.",
        "skills": [
          "React",
          "TypeScript",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Frontend Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "CSS",
          "React",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Frontend Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "React",
          "TypeScript"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s4",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@hiero.ai",
    "phone": "+91 9810005379",
    "headline": "Distributed Systems Architect | HIERO Skill Verified",
    "location": "Madras, India",
    "aboutMe": "High-caliber Distributed Systems Architect from IIT Madras specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 91,
    "resumeUrl": "/resumes/Rahul_Sharma_Resume_Master.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "gRPC",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Madras",
        "degree": "B.Tech",
        "field": "Computer Science & Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Go High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Python and sub-50ms latency SLAs.",
        "skills": [
          "Go",
          "Python",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Distributed Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Kubernetes",
          "Go",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Distributed Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "Python"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s5",
    "name": "Ananya Verma",
    "email": "ananya.verma@hiero.ai",
    "phone": "+91 9810007172",
    "headline": "Backend & Cloud Infrastructure Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Backend & Cloud Infrastructure Engineer from IIIT Hyderabad specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Ananya_Verma_Resume_Master.pdf",
    "skills": [
      {
        "name": "Node.js",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIIT Hyderabad",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Node.js High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with PostgreSQL and sub-50ms latency SLAs.",
        "skills": [
          "Node.js",
          "PostgreSQL",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Backend Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Docker",
          "Node.js",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Backend Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Node.js",
          "PostgreSQL"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s6",
    "name": "Rohan Gupta",
    "email": "rohan.gupta@hiero.ai",
    "phone": "+91 9810008965",
    "headline": "Cloud Platform & DevOps Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Cloud Platform & DevOps Engineer from DTU Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 87,
    "resumeUrl": "/resumes/Rohan_Gupta_Resume_Master.pdf",
    "skills": [
      {
        "name": "AWS",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Terraform",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "DTU Delhi",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "AWS High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Docker and sub-50ms latency SLAs.",
        "skills": [
          "AWS",
          "Docker",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Cloud Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Kubernetes",
          "AWS",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Cloud Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "AWS",
          "Docker"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s7",
    "name": "Meera Iyer",
    "email": "meera.iyer@hiero.ai",
    "phone": "+91 9810010758",
    "headline": "Full Stack MERN Lead | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Full Stack MERN Lead from NIT Trichy specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Meera_Iyer_Resume_Master.pdf",
    "skills": [
      {
        "name": "React",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Git",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "GraphQL",
        "competency": 81,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "NIT Trichy",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "React High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Node.js and sub-50ms latency SLAs.",
        "skills": [
          "React",
          "Node.js",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Full Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "SQL",
          "React",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Full Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "React",
          "Node.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s8",
    "name": "Karthik Menon",
    "email": "karthik.menon@hiero.ai",
    "phone": "+91 9810012551",
    "headline": "High Performance Backend Developer | HIERO Skill Verified",
    "location": "Roorkee, India",
    "aboutMe": "High-caliber High Performance Backend Developer from IIT Roorkee specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.3,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Karthik_Menon_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Git",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Roorkee",
        "degree": "B.Tech",
        "field": "Computer Science & Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.3
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with C++ and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "C++",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated High Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "SQL",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "High Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "C++"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s9",
    "name": "Nisha Agarwal",
    "email": "nisha.agarwal@hiero.ai",
    "phone": "+91 9810014344",
    "headline": "Data Engineering & Analytics Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Data Engineering & Analytics Specialist from IISc Bangalore specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.5,
    "passingYear": 2026,
    "score": 98,
    "resumeUrl": "/resumes/Nisha_Agarwal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AWS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Airflow",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Spark",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IISc Bangalore",
        "degree": "B.Tech",
        "field": "Artificial Intelligence",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.5
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with SQL and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "SQL",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Data Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "AWS",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Data Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "SQL"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s10",
    "name": "Arjun Nair",
    "email": "arjun.nair@hiero.ai",
    "phone": "+91 9810016137",
    "headline": "Computer Vision & Deep Learning Specialist | HIERO Skill Verified",
    "location": "Kharagpur, India",
    "aboutMe": "High-caliber Computer Vision & Deep Learning Specialist from IIT Kharagpur specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.6,
    "passingYear": 2026,
    "score": 99,
    "resumeUrl": "/resumes/Arjun_Nair_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Computer Vision",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TensorFlow",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Kharagpur",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.6
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with PyTorch and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "PyTorch",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Computer Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Computer Vision",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Computer Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s11",
    "name": "Tanvi Deshmukh",
    "email": "tanvi.deshmukh@hiero.ai",
    "phone": "+91 9810017930",
    "headline": "Frontend Lead & Accessibility Champion | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Frontend Lead & Accessibility Champion from COEP Pune specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.6,
    "passingYear": 2026,
    "score": 86,
    "resumeUrl": "/resumes/Tanvi_Deshmukh_Resume_Master.pdf",
    "skills": [
      {
        "name": "React",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CSS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Git",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TailwindCSS",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "COEP Pune",
        "degree": "B.Tech",
        "field": "Computer Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.6
      }
    ],
    "projects": [
      {
        "title": "React High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with TypeScript and sub-50ms latency SLAs.",
        "skills": [
          "React",
          "TypeScript",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Frontend Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "CSS",
          "React",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Frontend Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "React",
          "TypeScript"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s12",
    "name": "Siddharth Rao",
    "email": "siddharth.rao@hiero.ai",
    "phone": "+91 9810019723",
    "headline": "Open Source Systems Developer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Open Source Systems Developer from Manipal Institute specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.5,
    "passingYear": 2026,
    "score": 86,
    "resumeUrl": "/resumes/Siddharth_Rao_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Git",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Manipal Institute",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.5
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with React and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "React",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Open Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Git",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Open Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "React"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s13",
    "name": "Pooja Hegde",
    "email": "pooja.hegde@hiero.ai",
    "phone": "+91 9810021516",
    "headline": "NLP & LLM Applications Engineer | HIERO Skill Verified",
    "location": "Guwahati, India",
    "aboutMe": "High-caliber NLP & LLM Applications Engineer from IIT Guwahati specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Pooja_Hegde_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "NLP",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Transformers",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Guwahati",
        "degree": "B.Tech",
        "field": "Data Science & AI",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with NLP and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "NLP",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated NLP Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Transformers",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "NLP Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "NLP"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s14",
    "name": "Varun Kulkarni",
    "email": "varun.kulkarni@hiero.ai",
    "phone": "+91 9810023309",
    "headline": "Cybersecurity & Cloud Security Analyst | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Cybersecurity & Cloud Security Analyst from NIT Surathkal specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Varun_Kulkarni_Resume_Master.pdf",
    "skills": [
      {
        "name": "Linux",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Cryptography",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Bash",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "NIT Surathkal",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "Linux High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Python and sub-50ms latency SLAs.",
        "skills": [
          "Linux",
          "Python",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Cybersecurity Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Cryptography",
          "Linux",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Cybersecurity Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Linux",
          "Python"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s15",
    "name": "Shreya Sen",
    "email": "shreya.sen@hiero.ai",
    "phone": "+91 9810025102",
    "headline": "Distributed Database Systems Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Distributed Database Systems Engineer from Jadavpur University specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Shreya_Sen_Resume_Master.pdf",
    "skills": [
      {
        "name": "Java",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Go",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Distributed Systems",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kafka",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Jadavpur University",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Java High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Go and sub-50ms latency SLAs.",
        "skills": [
          "Java",
          "Go",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Distributed Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Distributed Systems",
          "Java",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Distributed Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Java",
          "Go"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s16",
    "name": "Aditya Joshi",
    "email": "aditya.joshi@hiero.ai",
    "phone": "+91 9810026895",
    "headline": "Compilers & Low-level Systems Engineer | HIERO Skill Verified",
    "location": "Kanpur, India",
    "aboutMe": "High-caliber Compilers & Low-level Systems Engineer from IIT Kanpur specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Aditya_Joshi_Resume_Master.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Rust",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "LLVM",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Assembly",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Kanpur",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "C++ High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Rust and sub-50ms latency SLAs.",
        "skills": [
          "C++",
          "Rust",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Compilers Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "LLVM",
          "C++",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Compilers Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "Rust"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s17",
    "name": "Divya Pillai",
    "email": "divya.pillai@hiero.ai",
    "phone": "+91 9810028688",
    "headline": "Mobile & Cross-Platform UI Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Mobile & Cross-Platform UI Specialist from NIT Calicut specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 88,
    "resumeUrl": "/resumes/Divya_Pillai_Resume_Master.pdf",
    "skills": [
      {
        "name": "React Native",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Flutter",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Firebase",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "NIT Calicut",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "React Native High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Flutter and sub-50ms latency SLAs.",
        "skills": [
          "React Native",
          "Flutter",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Mobile Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "TypeScript",
          "React Native",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Mobile Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "React Native",
          "Flutter"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s18",
    "name": "Nikhil Bansal",
    "email": "nikhil.bansal@hiero.ai",
    "phone": "+91 9810030481",
    "headline": "Full Stack Python & Microservices Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Full Stack Python & Microservices Dev from NSUT Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Nikhil_Bansal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Django",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "NSUT Delhi",
        "degree": "B.Tech",
        "field": "Computer Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Django and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "Django",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Full Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "React",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Full Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Django"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s19",
    "name": "Keerthi Bhat",
    "email": "keerthi.bhat@hiero.ai",
    "phone": "+91 9810032274",
    "headline": "Cloud Infrastructure Automation Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Cloud Infrastructure Automation Dev from RVCE Bangalore specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.6,
    "passingYear": 2026,
    "score": 89,
    "resumeUrl": "/resumes/Keerthi_Bhat_Resume_Master.pdf",
    "skills": [
      {
        "name": "AWS",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Terraform",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CI/CD",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "RVCE Bangalore",
        "degree": "B.Tech",
        "field": "Information Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.6
      }
    ],
    "projects": [
      {
        "title": "AWS High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Terraform and sub-50ms latency SLAs.",
        "skills": [
          "AWS",
          "Terraform",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Cloud Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Kubernetes",
          "AWS",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Cloud Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "AWS",
          "Terraform"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s20",
    "name": "Harshvardhan Reddy",
    "email": "harshvardhan.reddy@hiero.ai",
    "phone": "+91 9810034067",
    "headline": "High Performance Computing Specialist | HIERO Skill Verified",
    "location": "Hyderabad, India",
    "aboutMe": "High-caliber High Performance Computing Specialist from IIT Hyderabad specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Harshvardhan_Reddy_Resume_Master.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CUDA",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "OpenMP",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "MPI",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Hyderabad",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "C++ High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with CUDA and sub-50ms latency SLAs.",
        "skills": [
          "C++",
          "CUDA",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated High Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "OpenMP",
          "C++",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "High Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "CUDA"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s21",
    "name": "Riya Mukherjee",
    "email": "riya.mukherjee@hiero.ai",
    "phone": "+91 9810035860",
    "headline": "Information Security & Cryptography Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Information Security & Cryptography Dev from IIIT Allahabad specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Riya_Mukherjee_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Security Protocols",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIIT Allahabad",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with C and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "C",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Information Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Security Protocols",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Information Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "C"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s22",
    "name": "Devansh Singhal",
    "email": "devansh.singhal@hiero.ai",
    "phone": "+91 9810037653",
    "headline": "Big Data Processing & ETL Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Big Data Processing & ETL Specialist from DTU Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 88,
    "resumeUrl": "/resumes/Devansh_Singhal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Spark",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kafka",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Scala",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "DTU Delhi",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Spark and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "Spark",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Big Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Kafka",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Big Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Spark"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s23",
    "name": "Ankit Agarwal",
    "email": "ankit.agarwal@hiero.ai",
    "phone": "+91 9810039446",
    "headline": "Reinforcement Learning Engineer | HIERO Skill Verified",
    "location": "BHU, India",
    "aboutMe": "High-caliber Reinforcement Learning Engineer from IIT BHU Varanasi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.3,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Ankit_Agarwal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Reinforcement Learning",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "NumPy",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT BHU Varanasi",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.3
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with PyTorch and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "PyTorch",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Reinforcement Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Reinforcement Learning",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Reinforcement Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s24",
    "name": "Nidhi Kulkarni",
    "email": "nidhi.kulkarni@hiero.ai",
    "phone": "+91 9810041239",
    "headline": "Enterprise Microservices Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Enterprise Microservices Engineer from VJTI Mumbai specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Nidhi_Kulkarni_Resume_Master.pdf",
    "skills": [
      {
        "name": "Java",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Spring Boot",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kafka",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "VJTI Mumbai",
        "degree": "B.Tech",
        "field": "Computer Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "Java High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Spring Boot and sub-50ms latency SLAs.",
        "skills": [
          "Java",
          "Spring Boot",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Enterprise Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Kafka",
          "Java",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Enterprise Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Java",
          "Spring Boot"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s25",
    "name": "Tarun Varma",
    "email": "tarun.varma@hiero.ai",
    "phone": "+91 9810043032",
    "headline": "Quantum Algorithms & Core DSA Specialist | HIERO Skill Verified",
    "location": "Indore, India",
    "aboutMe": "High-caliber Quantum Algorithms & Core DSA Specialist from IIT Indore specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Tarun_Varma_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Algorithms",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linear Algebra",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Indore",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with C++ and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "C++",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Quantum Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Algorithms",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Quantum Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "C++"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s26",
    "name": "Priya Deshmukh",
    "email": "priya.deshmukh@hiero.ai",
    "phone": "+91 9810044825",
    "headline": "Robotics Perception & Vision Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Robotics Perception & Vision Engineer from Cummins College Pune specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 88,
    "resumeUrl": "/resumes/Priya_Deshmukh_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "OpenCV",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ROS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Cummins College Pune",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with OpenCV and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "OpenCV",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Robotics Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "ROS",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Robotics Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "OpenCV"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s27",
    "name": "Kabir Mehrotra",
    "email": "kabir.mehrotra@hiero.ai",
    "phone": "+91 9810046618",
    "headline": "Decentralized Systems & Smart Contracts Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Decentralized Systems & Smart Contracts Dev from BITS Pilani Goa specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Kabir_Mehrotra_Resume_Master.pdf",
    "skills": [
      {
        "name": "Solidity",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Go",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Rust",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "BITS Pilani Goa",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "Solidity High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Go and sub-50ms latency SLAs.",
        "skills": [
          "Solidity",
          "Go",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Decentralized Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Rust",
          "Solidity",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Decentralized Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Solidity",
          "Go"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s28",
    "name": "Tanvi Chawla",
    "email": "tanvi.chawla@hiero.ai",
    "phone": "+91 9810048411",
    "headline": "Modern Web & React Ecosystem Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Modern Web & React Ecosystem Engineer from Thapar University specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.5,
    "passingYear": 2026,
    "score": 87,
    "resumeUrl": "/resumes/Tanvi_Chawla_Resume_Master.pdf",
    "skills": [
      {
        "name": "React",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Next.js",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "GraphQL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TailwindCSS",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Thapar University",
        "degree": "B.Tech",
        "field": "Computer Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.5
      }
    ],
    "projects": [
      {
        "title": "React High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Next.js and sub-50ms latency SLAs.",
        "skills": [
          "React",
          "Next.js",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Modern Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "TypeScript",
          "React",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Modern Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "React",
          "Next.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s29",
    "name": "Pranav Bajaj",
    "email": "pranav.bajaj@hiero.ai",
    "phone": "+91 9810050204",
    "headline": "Cloud Architecture & Reliability Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Cloud Architecture & Reliability Engineer from PEC Chandigarh specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Pranav_Bajaj_Resume_Master.pdf",
    "skills": [
      {
        "name": "AWS",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "GCP",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Go",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Prometheus",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "PEC Chandigarh",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "AWS High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with GCP and sub-50ms latency SLAs.",
        "skills": [
          "AWS",
          "GCP",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Cloud Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Kubernetes",
          "AWS",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Cloud Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "AWS",
          "GCP"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s30",
    "name": "Ishaan Kapoor",
    "email": "ishaan.kapoor@hiero.ai",
    "phone": "+91 9810051997",
    "headline": "Edge Computing & IoT Systems Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Edge Computing & IoT Systems Dev from BITS Hyderabad specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Ishaan_Kapoor_Resume_Master.pdf",
    "skills": [
      {
        "name": "Embedded C",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "MQTT",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "BITS Hyderabad",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Embedded C High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Python and sub-50ms latency SLAs.",
        "skills": [
          "Embedded C",
          "Python",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Edge Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "MQTT",
          "Embedded C",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Edge Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Embedded C",
          "Python"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s31",
    "name": "Rhea Bhatia",
    "email": "rhea.bhatia@hiero.ai",
    "phone": "+91 9810053790",
    "headline": "AI Ethics & Data Science Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber AI Ethics & Data Science Specialist from IGDTUW Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Rhea_Bhatia_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "R",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Machine Learning",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Pandas",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IGDTUW Delhi",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with R and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "R",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated AI Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Machine Learning",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "AI Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "R"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s32",
    "name": "Rishabh Jain",
    "email": "rishabh.jain@hiero.ai",
    "phone": "+91 9810055583",
    "headline": "Information Retrieval & Vector Search Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Information Retrieval & Vector Search Dev from IIIT Bangalore specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Rishabh_Jain_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Elasticsearch",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIIT Bangalore",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Elasticsearch and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "Elasticsearch",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Information Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "FastAPI",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Information Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Elasticsearch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s33",
    "name": "Samaira Khurana",
    "email": "samaira.khurana@hiero.ai",
    "phone": "+91 9810057376",
    "headline": "Computational Linguistics & NLP Researcher | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Computational Linguistics & NLP Researcher from Ashoka University specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Samaira_Khurana_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "NLP",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Transformers",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Ashoka University",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with PyTorch and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "PyTorch",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Computational Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "NLP",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Computational Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s34",
    "name": "Yashwardhan Goel",
    "email": "yashwardhan.goel@hiero.ai",
    "phone": "+91 9810059169",
    "headline": "Autonomous Systems & Navigation Dev | HIERO Skill Verified",
    "location": "Gandhinagar, India",
    "aboutMe": "High-caliber Autonomous Systems & Navigation Dev from IIT Gandhinagar specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Yashwardhan_Goel_Resume_Master.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ROS2",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Control Systems",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "LiDAR",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Gandhinagar",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "C++ High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Python and sub-50ms latency SLAs.",
        "skills": [
          "C++",
          "Python",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Autonomous Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "ROS2",
          "C++",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Autonomous Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "Python"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s35",
    "name": "Avani Shah",
    "email": "avani.shah@hiero.ai",
    "phone": "+91 9810060962",
    "headline": "Communications & Realtime Streaming Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Communications & Realtime Streaming Dev from DAIICT Gandhinagar specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Avani_Shah_Resume_Master.pdf",
    "skills": [
      {
        "name": "WebRTC",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Go",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "WebSockets",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "DAIICT Gandhinagar",
        "degree": "B.Tech",
        "field": "Information & Comm Tech",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "WebRTC High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Go and sub-50ms latency SLAs.",
        "skills": [
          "WebRTC",
          "Go",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Communications Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Node.js",
          "WebRTC",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Communications Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "WebRTC",
          "Go"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s36",
    "name": "Madhav Rastogi",
    "email": "madhav.rastogi@hiero.ai",
    "phone": "+91 9810062755",
    "headline": "Kernel & Operating Systems Engineer | HIERO Skill Verified",
    "location": "Ropar, India",
    "aboutMe": "High-caliber Kernel & Operating Systems Engineer from IIT Ropar specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.3,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Madhav_Rastogi_Resume_Master.pdf",
    "skills": [
      {
        "name": "C",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Rust",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux Kernel",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "File Systems",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Git",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Ropar",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.3
      }
    ],
    "projects": [
      {
        "title": "C High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Rust and sub-50ms latency SLAs.",
        "skills": [
          "C",
          "Rust",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Kernel Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Linux Kernel",
          "C",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Kernel Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "C",
          "Rust"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s37",
    "name": "Raghav Gupta",
    "email": "raghav.gupta@hiero.ai",
    "phone": "+91 9810064548",
    "headline": "Serverless Cloud Architect | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Serverless Cloud Architect from DTU Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.6,
    "passingYear": 2026,
    "score": 87,
    "resumeUrl": "/resumes/Raghav_Gupta_Resume_Master.pdf",
    "skills": [
      {
        "name": "AWS Lambda",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "DynamoDB",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Terraform",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "DTU Delhi",
        "degree": "B.Tech",
        "field": "Software Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.6
      }
    ],
    "projects": [
      {
        "title": "AWS Lambda High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Node.js and sub-50ms latency SLAs.",
        "skills": [
          "AWS Lambda",
          "Node.js",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Serverless Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Python",
          "AWS Lambda",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Serverless Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "AWS Lambda",
          "Node.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s38",
    "name": "Muskan Mittal",
    "email": "muskan.mittal@hiero.ai",
    "phone": "+91 9810066341",
    "headline": "Computational Biology & AI Researcher | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Computational Biology & AI Researcher from IIIT Delhi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Muskan_Mittal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Biopython",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "R",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Data Analysis",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIIT Delhi",
        "degree": "B.Tech",
        "field": "Computer Science & Bio",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Biopython and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "Biopython",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Computational Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "PyTorch",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Computational Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Biopython"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s39",
    "name": "Aryan Tyagi",
    "email": "aryan.tyagi@hiero.ai",
    "phone": "+91 9810068134",
    "headline": "Distributed Consensus & Fault Tolerance Dev | HIERO Skill Verified",
    "location": "Patna, India",
    "aboutMe": "High-caliber Distributed Consensus & Fault Tolerance Dev from IIT Patna specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Aryan_Tyagi_Resume_Master.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Raft",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "gRPC",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Distributed Systems",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Patna",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Go High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Raft and sub-50ms latency SLAs.",
        "skills": [
          "Go",
          "Raft",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Distributed Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "gRPC",
          "Go",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Distributed Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "Raft"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s40",
    "name": "Simran Chopra",
    "email": "simran.chopra@hiero.ai",
    "phone": "+91 9810069927",
    "headline": "Modern UI/UX & WebGL Graphics Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Modern UI/UX & WebGL Graphics Engineer from UIET Chandigarh specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 91,
    "resumeUrl": "/resumes/Simran_Chopra_Resume_Master.pdf",
    "skills": [
      {
        "name": "Three.js",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "GLSL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CSS",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "UIET Chandigarh",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "Three.js High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with React and sub-50ms latency SLAs.",
        "skills": [
          "Three.js",
          "React",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Modern Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "TypeScript",
          "Three.js",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Modern Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Three.js",
          "React"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s41",
    "name": "Tushar Bhardwaj",
    "email": "tushar.bhardwaj@hiero.ai",
    "phone": "+91 9810071720",
    "headline": "Applied ML & Graph Neural Network Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Applied ML & Graph Neural Network Dev from NIT Warangal specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Tushar_Bhardwaj_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch Geometric",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "NetworkX",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "NIT Warangal",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with PyTorch Geometric and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "PyTorch Geometric",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Applied Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "NetworkX",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Applied Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch Geometric"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s42",
    "name": "Akanksha Sethi",
    "email": "akanksha.sethi@hiero.ai",
    "phone": "+91 9810073513",
    "headline": "Full Stack Node/Go Engineer | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Full Stack Node/Go Engineer from NIT Kurukshetra specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 89,
    "resumeUrl": "/resumes/Akanksha_Sethi_Resume_Master.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "MongoDB",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "NIT Kurukshetra",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Go High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Node.js and sub-50ms latency SLAs.",
        "skills": [
          "Go",
          "Node.js",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Full Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "React",
          "Go",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Full Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "Node.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s43",
    "name": "Chirag Bansal",
    "email": "chirag.bansal@hiero.ai",
    "phone": "+91 9810075306",
    "headline": "DevSecOps & Automated CI/CD Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber DevSecOps & Automated CI/CD Specialist from Jamia Millia Islamia specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.5,
    "passingYear": 2026,
    "score": 87,
    "resumeUrl": "/resumes/Chirag_Bansal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Jenkins",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "GitHub Actions",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SonarQube",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AWS",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Jamia Millia Islamia",
        "degree": "B.Tech",
        "field": "Computer Engineering",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.5
      }
    ],
    "projects": [
      {
        "title": "Jenkins High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with GitHub Actions and sub-50ms latency SLAs.",
        "skills": [
          "Jenkins",
          "GitHub Actions",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated DevSecOps Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "SonarQube",
          "Jenkins",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "DevSecOps Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Jenkins",
          "GitHub Actions"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s44",
    "name": "Sanya Grover",
    "email": "sanya.grover@hiero.ai",
    "phone": "+91 9810077099",
    "headline": "Generative AI & LLM Pipelines Dev | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Generative AI & LLM Pipelines Dev from Bennett University specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Sanya_Grover_Resume_Master.pdf",
    "skills": [
      {
        "name": "LangChain",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "LlamaIndex",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "HuggingFace",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Bennett University",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "LangChain High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with LlamaIndex and sub-50ms latency SLAs.",
        "skills": [
          "LangChain",
          "LlamaIndex",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Generative Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Python",
          "LangChain",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Generative Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "LangChain",
          "LlamaIndex"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s45",
    "name": "Uday Aggarwal",
    "email": "uday.aggarwal@hiero.ai",
    "phone": "+91 9810078892",
    "headline": "High Throughput Backend Systems (Rust/C++) | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber High Throughput Backend Systems (Rust/C++) from MSRIT Bangalore specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Uday_Aggarwal_Resume_Master.pdf",
    "skills": [
      {
        "name": "Rust",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Async I/O",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "MSRIT Bangalore",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Rust High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with C++ and sub-50ms latency SLAs.",
        "skills": [
          "Rust",
          "C++",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated High Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Async I/O",
          "Rust",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "High Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Rust",
          "C++"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s46",
    "name": "Palak Sharma",
    "email": "palak.sharma@hiero.ai",
    "phone": "+91 9810080685",
    "headline": "Cloud Native Observability Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Cloud Native Observability Specialist from LNMIIT Jaipur specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 87,
    "resumeUrl": "/resumes/Palak_Sharma_Resume_Master.pdf",
    "skills": [
      {
        "name": "Prometheus",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Grafana",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "OpenTelemetry",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Go",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "LNMIIT Jaipur",
        "degree": "B.Tech",
        "field": "Communication & CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "Prometheus High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Grafana and sub-50ms latency SLAs.",
        "skills": [
          "Prometheus",
          "Grafana",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Cloud Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "OpenTelemetry",
          "Prometheus",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Cloud Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Prometheus",
          "Grafana"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s47",
    "name": "Sahil Narang",
    "email": "sahil.narang@hiero.ai",
    "phone": "+91 9810082478",
    "headline": "Distributed Stream Processing Specialist | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Distributed Stream Processing Specialist from IIIT Gwalior specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Sahil_Narang_Resume_Master.pdf",
    "skills": [
      {
        "name": "Apache Flink",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kafka",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Java",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIIT Gwalior",
        "degree": "B.Tech",
        "field": "Information Technology",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "Apache Flink High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Kafka and sub-50ms latency SLAs.",
        "skills": [
          "Apache Flink",
          "Kafka",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Distributed Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Java",
          "Apache Flink",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Distributed Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Apache Flink",
          "Kafka"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s48",
    "name": "Lavanya Sundaram",
    "email": "lavanya.sundaram@hiero.ai",
    "phone": "+91 9810084271",
    "headline": "Deep Learning Model Optimization Lead | HIERO Skill Verified",
    "location": "Bangalore, India",
    "aboutMe": "High-caliber Deep Learning Model Optimization Lead from PSG Tech Coimbatore specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.3,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Lavanya_Sundaram_Resume_Master.pdf",
    "skills": [
      {
        "name": "TensorRT",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ONNX",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Quantization",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "PSG Tech Coimbatore",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.3
      }
    ],
    "projects": [
      {
        "title": "TensorRT High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with ONNX and sub-50ms latency SLAs.",
        "skills": [
          "TensorRT",
          "ONNX",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Deep Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "PyTorch",
          "TensorRT",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Deep Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "TensorRT",
          "ONNX"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s49",
    "name": "Mohit Choudhary",
    "email": "mohit.choudhary@hiero.ai",
    "phone": "+91 9810086064",
    "headline": "Applied Cryptography & Privacy Systems Dev | HIERO Skill Verified",
    "location": "Mandi, India",
    "aboutMe": "High-caliber Applied Cryptography & Privacy Systems Dev from IIT Mandi specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Mohit_Choudhary_Resume_Master.pdf",
    "skills": [
      {
        "name": "Rust",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Zero-Knowledge Proofs",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Cryptography",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Mandi",
        "degree": "B.Tech",
        "field": "Computer Science",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "Rust High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with Zero-Knowledge Proofs and sub-50ms latency SLAs.",
        "skills": [
          "Rust",
          "Zero-Knowledge Proofs",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated Applied Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "Cryptography",
          "Rust",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "Applied Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Rust",
          "Zero-Knowledge Proofs"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "s50",
    "name": "Jaswanth Kumar",
    "email": "jaswanth.kumar@hiero.ai",
    "phone": "+91 9810087857",
    "headline": "AI Career & Skill Gateway Lead Architect | HIERO Skill Verified",
    "location": "Madras, India",
    "aboutMe": "High-caliber AI Career & Skill Gateway Lead Architect from IIT Madras specializing in modern software architecture, robust engineering practices, and verified production delivery.",
    "cgpa": 9.7,
    "passingYear": 2026,
    "score": 99,
    "resumeUrl": "/resumes/Jaswanth_Kumar_Resume_Master.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 96,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 93,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 87,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 84,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 81,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "IIT Madras",
        "degree": "B.Tech",
        "field": "Computer Science & AI",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.7
      }
    ],
    "projects": [
      {
        "title": "Python High-Throughput Service Engine",
        "description": "Architected and benchmarked production microservice with React and sub-50ms latency SLAs.",
        "skills": [
          "Python",
          "React",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "Automated AI Intelligence Platform",
        "description": "Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.",
        "skills": [
          "TypeScript",
          "Python",
          "FastAPI",
          "Redis"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "TechNova AI Systems",
        "role": "AI Engineering Intern",
        "description": "Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.",
        "startDate": "2025-05",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "React"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2025-11"
      },
      {
        "name": "HIERO Verified Specialist",
        "issuer": "HIERO Talent Platform",
        "date": "2026-02"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  }
];

// --- 50 HIERO Applications ---
export const demoApplications: Application[] = [
  {
    "id": "a1",
    "opportunityId": "j1",
    "studentId": "s1",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Aisha Patel",
    "email": "aisha.patel@hiero.ai",
    "phone": "+91 9810000000",
    "cgpa": 9.4,
    "department": "Computer Science & Engineering",
    "campusName": "IIT Bombay",
    "campusLocation": "Bombay, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 94,
    "status": "shortlisted",
    "appliedAt": "2026-08-10",
    "resumeUrl": "/resumes/Aisha_Patel_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "React",
        "score": 93
      },
      {
        "name": "SQL",
        "score": 90
      },
      {
        "name": "Git",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a2",
    "opportunityId": "j2",
    "studentId": "s2",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Vikram Singh",
    "email": "vikram.singh@hiero.ai",
    "phone": "+91 9810001793",
    "cgpa": 9.2,
    "department": "Artificial Intelligence & ML",
    "campusName": "IIT Delhi",
    "campusLocation": "Delhi, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 93,
    "status": "applied",
    "appliedAt": "2026-08-11",
    "resumeUrl": "/resumes/Vikram_Singh_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "Machine Learning",
        "score": 93
      },
      {
        "name": "TensorFlow",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a3",
    "opportunityId": "j3",
    "studentId": "s3",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Sneha Reddy",
    "email": "sneha.reddy@hiero.ai",
    "phone": "+91 9810003586",
    "cgpa": 9.1,
    "department": "Computer Science",
    "campusName": "BITS Pilani",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 93,
    "status": "interview",
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Sneha_Reddy_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "React",
        "score": 96
      },
      {
        "name": "TypeScript",
        "score": 93
      },
      {
        "name": "CSS",
        "score": 90
      },
      {
        "name": "Next.js",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a4",
    "opportunityId": "j4",
    "studentId": "s4",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Rahul Sharma",
    "email": "rahul.sharma@hiero.ai",
    "phone": "+91 9810005379",
    "cgpa": 8.8,
    "department": "Computer Science & Engineering",
    "campusName": "IIT Madras",
    "campusLocation": "Madras, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 91,
    "status": "selected",
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Rahul_Sharma_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 96
      },
      {
        "name": "Python",
        "score": 93
      },
      {
        "name": "Kubernetes",
        "score": 90
      },
      {
        "name": "gRPC",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a5",
    "opportunityId": "j5",
    "studentId": "s5",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Ananya Verma",
    "email": "ananya.verma@hiero.ai",
    "phone": "+91 9810007172",
    "cgpa": 9,
    "department": "Computer Science",
    "campusName": "IIIT Hyderabad",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 94,
    "status": "under-review",
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Ananya_Verma_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Node.js",
        "score": 96
      },
      {
        "name": "PostgreSQL",
        "score": 93
      },
      {
        "name": "Docker",
        "score": 90
      },
      {
        "name": "Redis",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a6",
    "opportunityId": "j6",
    "studentId": "s6",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Rohan Gupta",
    "email": "rohan.gupta@hiero.ai",
    "phone": "+91 9810008965",
    "cgpa": 8.7,
    "department": "Information Technology",
    "campusName": "DTU Delhi",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 87,
    "status": "shortlisted",
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Rohan_Gupta_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "AWS",
        "score": 96
      },
      {
        "name": "Docker",
        "score": 93
      },
      {
        "name": "Kubernetes",
        "score": 90
      },
      {
        "name": "Linux",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a7",
    "opportunityId": "j1",
    "studentId": "s7",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Meera Iyer",
    "email": "meera.iyer@hiero.ai",
    "phone": "+91 9810010758",
    "cgpa": 8.9,
    "department": "Computer Science",
    "campusName": "NIT Trichy",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 90,
    "status": "applied",
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Meera_Iyer_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "React",
        "score": 96
      },
      {
        "name": "Node.js",
        "score": 93
      },
      {
        "name": "SQL",
        "score": 90
      },
      {
        "name": "Git",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a8",
    "opportunityId": "j2",
    "studentId": "s8",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Karthik Menon",
    "email": "karthik.menon@hiero.ai",
    "phone": "+91 9810012551",
    "cgpa": 9.3,
    "department": "Computer Science & Engineering",
    "campusName": "IIT Roorkee",
    "campusLocation": "Roorkee, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 95,
    "status": "interview",
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Karthik_Menon_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "C++",
        "score": 93
      },
      {
        "name": "SQL",
        "score": 90
      },
      {
        "name": "Git",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a9",
    "opportunityId": "j3",
    "studentId": "s9",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Nisha Agarwal",
    "email": "nisha.agarwal@hiero.ai",
    "phone": "+91 9810014344",
    "cgpa": 9.5,
    "department": "Artificial Intelligence",
    "campusName": "IISc Bangalore",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 98,
    "status": "selected",
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Nisha_Agarwal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "SQL",
        "score": 93
      },
      {
        "name": "AWS",
        "score": 90
      },
      {
        "name": "Airflow",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a10",
    "opportunityId": "j4",
    "studentId": "s10",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Arjun Nair",
    "email": "arjun.nair@hiero.ai",
    "phone": "+91 9810016137",
    "cgpa": 9.6,
    "department": "Computer Science",
    "campusName": "IIT Kharagpur",
    "campusLocation": "Kharagpur, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 99,
    "status": "under-review",
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Arjun_Nair_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "PyTorch",
        "score": 93
      },
      {
        "name": "Computer Vision",
        "score": 90
      },
      {
        "name": "TensorFlow",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a11",
    "opportunityId": "j5",
    "studentId": "s11",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Tanvi Deshmukh",
    "email": "tanvi.deshmukh@hiero.ai",
    "phone": "+91 9810017930",
    "cgpa": 8.6,
    "department": "Computer Engineering",
    "campusName": "COEP Pune",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 86,
    "status": "shortlisted",
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Tanvi_Deshmukh_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "React",
        "score": 96
      },
      {
        "name": "TypeScript",
        "score": 93
      },
      {
        "name": "CSS",
        "score": 90
      },
      {
        "name": "Git",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a12",
    "opportunityId": "j6",
    "studentId": "s12",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Siddharth Rao",
    "email": "siddharth.rao@hiero.ai",
    "phone": "+91 9810019723",
    "cgpa": 8.5,
    "department": "Computer Science",
    "campusName": "Manipal Institute",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 86,
    "status": "applied",
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Siddharth_Rao_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "React",
        "score": 93
      },
      {
        "name": "Git",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a13",
    "opportunityId": "j1",
    "studentId": "s13",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Pooja Hegde",
    "email": "pooja.hegde@hiero.ai",
    "phone": "+91 9810021516",
    "cgpa": 9.1,
    "department": "Data Science & AI",
    "campusName": "IIT Guwahati",
    "campusLocation": "Guwahati, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 93,
    "status": "interview",
    "appliedAt": "2026-08-22",
    "resumeUrl": "/resumes/Pooja_Hegde_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "NLP",
        "score": 93
      },
      {
        "name": "Transformers",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a14",
    "opportunityId": "j2",
    "studentId": "s14",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Varun Kulkarni",
    "email": "varun.kulkarni@hiero.ai",
    "phone": "+91 9810023309",
    "cgpa": 8.9,
    "department": "Information Technology",
    "campusName": "NIT Surathkal",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 92,
    "status": "selected",
    "appliedAt": "2026-08-23",
    "resumeUrl": "/resumes/Varun_Kulkarni_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Linux",
        "score": 96
      },
      {
        "name": "Python",
        "score": 93
      },
      {
        "name": "Cryptography",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a15",
    "opportunityId": "j3",
    "studentId": "s15",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Shreya Sen",
    "email": "shreya.sen@hiero.ai",
    "phone": "+91 9810025102",
    "cgpa": 9,
    "department": "Computer Science",
    "campusName": "Jadavpur University",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 94,
    "status": "under-review",
    "appliedAt": "2026-08-24",
    "resumeUrl": "/resumes/Shreya_Sen_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Java",
        "score": 96
      },
      {
        "name": "Go",
        "score": 93
      },
      {
        "name": "Distributed Systems",
        "score": 90
      },
      {
        "name": "SQL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a16",
    "opportunityId": "j4",
    "studentId": "s16",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Aditya Joshi",
    "email": "aditya.joshi@hiero.ai",
    "phone": "+91 9810026895",
    "cgpa": 9.4,
    "department": "Computer Science",
    "campusName": "IIT Kanpur",
    "campusLocation": "Kanpur, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 94,
    "status": "shortlisted",
    "appliedAt": "2026-08-25",
    "resumeUrl": "/resumes/Aditya_Joshi_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 96
      },
      {
        "name": "Rust",
        "score": 93
      },
      {
        "name": "LLVM",
        "score": 90
      },
      {
        "name": "Linux",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a17",
    "opportunityId": "j5",
    "studentId": "s17",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Divya Pillai",
    "email": "divya.pillai@hiero.ai",
    "phone": "+91 9810028688",
    "cgpa": 8.7,
    "department": "Computer Science",
    "campusName": "NIT Calicut",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 88,
    "status": "applied",
    "appliedAt": "2026-08-26",
    "resumeUrl": "/resumes/Divya_Pillai_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "React Native",
        "score": 96
      },
      {
        "name": "Flutter",
        "score": 93
      },
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Firebase",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a18",
    "opportunityId": "j6",
    "studentId": "s18",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Nikhil Bansal",
    "email": "nikhil.bansal@hiero.ai",
    "phone": "+91 9810030481",
    "cgpa": 8.8,
    "department": "Computer Engineering",
    "campusName": "NSUT Delhi",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 90,
    "status": "interview",
    "appliedAt": "2026-08-27",
    "resumeUrl": "/resumes/Nikhil_Bansal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "Django",
        "score": 93
      },
      {
        "name": "React",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a19",
    "opportunityId": "j1",
    "studentId": "s19",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Keerthi Bhat",
    "email": "keerthi.bhat@hiero.ai",
    "phone": "+91 9810032274",
    "cgpa": 8.6,
    "department": "Information Science",
    "campusName": "RVCE Bangalore",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 89,
    "status": "selected",
    "appliedAt": "2026-08-28",
    "resumeUrl": "/resumes/Keerthi_Bhat_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "AWS",
        "score": 96
      },
      {
        "name": "Terraform",
        "score": 93
      },
      {
        "name": "Kubernetes",
        "score": 90
      },
      {
        "name": "Python",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a20",
    "opportunityId": "j2",
    "studentId": "s20",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Harshvardhan Reddy",
    "email": "harshvardhan.reddy@hiero.ai",
    "phone": "+91 9810034067",
    "cgpa": 9.2,
    "department": "Computer Science",
    "campusName": "IIT Hyderabad",
    "campusLocation": "Hyderabad, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 96,
    "status": "under-review",
    "appliedAt": "2026-08-29",
    "resumeUrl": "/resumes/Harshvardhan_Reddy_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 96
      },
      {
        "name": "CUDA",
        "score": 93
      },
      {
        "name": "OpenMP",
        "score": 90
      },
      {
        "name": "MPI",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a21",
    "opportunityId": "j3",
    "studentId": "s21",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Riya Mukherjee",
    "email": "riya.mukherjee@hiero.ai",
    "phone": "+91 9810035860",
    "cgpa": 9,
    "department": "Information Technology",
    "campusName": "IIIT Allahabad",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 90,
    "status": "shortlisted",
    "appliedAt": "2026-08-10",
    "resumeUrl": "/resumes/Riya_Mukherjee_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "C",
        "score": 93
      },
      {
        "name": "Security Protocols",
        "score": 90
      },
      {
        "name": "Linux",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a22",
    "opportunityId": "j4",
    "studentId": "s22",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Devansh Singhal",
    "email": "devansh.singhal@hiero.ai",
    "phone": "+91 9810037653",
    "cgpa": 8.7,
    "department": "Computer Science",
    "campusName": "DTU Delhi",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 88,
    "status": "applied",
    "appliedAt": "2026-08-11",
    "resumeUrl": "/resumes/Devansh_Singhal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "Spark",
        "score": 93
      },
      {
        "name": "Kafka",
        "score": 90
      },
      {
        "name": "SQL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a23",
    "opportunityId": "j5",
    "studentId": "s23",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Ankit Agarwal",
    "email": "ankit.agarwal@hiero.ai",
    "phone": "+91 9810039446",
    "cgpa": 9.3,
    "department": "Computer Science",
    "campusName": "IIT BHU Varanasi",
    "campusLocation": "BHU, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 95,
    "status": "interview",
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Ankit_Agarwal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "PyTorch",
        "score": 93
      },
      {
        "name": "Reinforcement Learning",
        "score": 90
      },
      {
        "name": "NumPy",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a24",
    "opportunityId": "j6",
    "studentId": "s24",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Nidhi Kulkarni",
    "email": "nidhi.kulkarni@hiero.ai",
    "phone": "+91 9810041239",
    "cgpa": 8.9,
    "department": "Computer Engineering",
    "campusName": "VJTI Mumbai",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 92,
    "status": "selected",
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Nidhi_Kulkarni_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Java",
        "score": 96
      },
      {
        "name": "Spring Boot",
        "score": 93
      },
      {
        "name": "Kafka",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a25",
    "opportunityId": "j1",
    "studentId": "s25",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Tarun Varma",
    "email": "tarun.varma@hiero.ai",
    "phone": "+91 9810043032",
    "cgpa": 9.1,
    "department": "Computer Science",
    "campusName": "IIT Indore",
    "campusLocation": "Indore, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 95,
    "status": "under-review",
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Tarun_Varma_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "C++",
        "score": 93
      },
      {
        "name": "Algorithms",
        "score": 90
      },
      {
        "name": "Linear Algebra",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a26",
    "opportunityId": "j2",
    "studentId": "s26",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Priya Deshmukh",
    "email": "priya.deshmukh@hiero.ai",
    "phone": "+91 9810044825",
    "cgpa": 8.8,
    "department": "Information Technology",
    "campusName": "Cummins College Pune",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 88,
    "status": "shortlisted",
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Priya_Deshmukh_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "OpenCV",
        "score": 93
      },
      {
        "name": "ROS",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a27",
    "opportunityId": "j3",
    "studentId": "s27",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Kabir Mehrotra",
    "email": "kabir.mehrotra@hiero.ai",
    "phone": "+91 9810046618",
    "cgpa": 8.9,
    "department": "Computer Science",
    "campusName": "BITS Pilani Goa",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 90,
    "status": "applied",
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Kabir_Mehrotra_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Solidity",
        "score": 96
      },
      {
        "name": "Go",
        "score": 93
      },
      {
        "name": "Rust",
        "score": 90
      },
      {
        "name": "TypeScript",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a28",
    "opportunityId": "j4",
    "studentId": "s28",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Tanvi Chawla",
    "email": "tanvi.chawla@hiero.ai",
    "phone": "+91 9810048411",
    "cgpa": 8.5,
    "department": "Computer Engineering",
    "campusName": "Thapar University",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 87,
    "status": "interview",
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Tanvi_Chawla_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "React",
        "score": 96
      },
      {
        "name": "Next.js",
        "score": 93
      },
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "GraphQL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a29",
    "opportunityId": "j5",
    "studentId": "s29",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Pranav Bajaj",
    "email": "pranav.bajaj@hiero.ai",
    "phone": "+91 9810050204",
    "cgpa": 8.7,
    "department": "Computer Science",
    "campusName": "PEC Chandigarh",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 90,
    "status": "selected",
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Pranav_Bajaj_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "AWS",
        "score": 96
      },
      {
        "name": "GCP",
        "score": 93
      },
      {
        "name": "Kubernetes",
        "score": 90
      },
      {
        "name": "Go",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a30",
    "opportunityId": "j6",
    "studentId": "s30",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Ishaan Kapoor",
    "email": "ishaan.kapoor@hiero.ai",
    "phone": "+91 9810051997",
    "cgpa": 9,
    "department": "Computer Science",
    "campusName": "BITS Hyderabad",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 94,
    "status": "under-review",
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Ishaan_Kapoor_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Embedded C",
        "score": 96
      },
      {
        "name": "Python",
        "score": 93
      },
      {
        "name": "MQTT",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a31",
    "opportunityId": "j1",
    "studentId": "s31",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Rhea Bhatia",
    "email": "rhea.bhatia@hiero.ai",
    "phone": "+91 9810053790",
    "cgpa": 9.2,
    "department": "Computer Science",
    "campusName": "IGDTUW Delhi",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 92,
    "status": "shortlisted",
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Rhea_Bhatia_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "R",
        "score": 93
      },
      {
        "name": "Machine Learning",
        "score": 90
      },
      {
        "name": "Pandas",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a32",
    "opportunityId": "j2",
    "studentId": "s32",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Rishabh Jain",
    "email": "rishabh.jain@hiero.ai",
    "phone": "+91 9810055583",
    "cgpa": 9.4,
    "department": "Information Technology",
    "campusName": "IIIT Bangalore",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 95,
    "status": "applied",
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Rishabh_Jain_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "Elasticsearch",
        "score": 93
      },
      {
        "name": "FastAPI",
        "score": 90
      },
      {
        "name": "Redis",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a33",
    "opportunityId": "j3",
    "studentId": "s33",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Samaira Khurana",
    "email": "samaira.khurana@hiero.ai",
    "phone": "+91 9810057376",
    "cgpa": 8.8,
    "department": "Computer Science",
    "campusName": "Ashoka University",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 90,
    "status": "interview",
    "appliedAt": "2026-08-22",
    "resumeUrl": "/resumes/Samaira_Khurana_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "PyTorch",
        "score": 93
      },
      {
        "name": "NLP",
        "score": 90
      },
      {
        "name": "Transformers",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a34",
    "opportunityId": "j4",
    "studentId": "s34",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Yashwardhan Goel",
    "email": "yashwardhan.goel@hiero.ai",
    "phone": "+91 9810059169",
    "cgpa": 9.1,
    "department": "Computer Science",
    "campusName": "IIT Gandhinagar",
    "campusLocation": "Gandhinagar, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 94,
    "status": "selected",
    "appliedAt": "2026-08-23",
    "resumeUrl": "/resumes/Yashwardhan_Goel_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 96
      },
      {
        "name": "Python",
        "score": 93
      },
      {
        "name": "ROS2",
        "score": 90
      },
      {
        "name": "Control Systems",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a35",
    "opportunityId": "j5",
    "studentId": "s35",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Avani Shah",
    "email": "avani.shah@hiero.ai",
    "phone": "+91 9810060962",
    "cgpa": 8.9,
    "department": "Information & Comm Tech",
    "campusName": "DAIICT Gandhinagar",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 93,
    "status": "under-review",
    "appliedAt": "2026-08-24",
    "resumeUrl": "/resumes/Avani_Shah_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "WebRTC",
        "score": 96
      },
      {
        "name": "Go",
        "score": 93
      },
      {
        "name": "Node.js",
        "score": 90
      },
      {
        "name": "WebSockets",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a36",
    "opportunityId": "j6",
    "studentId": "s36",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Madhav Rastogi",
    "email": "madhav.rastogi@hiero.ai",
    "phone": "+91 9810062755",
    "cgpa": 9.3,
    "department": "Computer Science",
    "campusName": "IIT Ropar",
    "campusLocation": "Ropar, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 93,
    "status": "shortlisted",
    "appliedAt": "2026-08-25",
    "resumeUrl": "/resumes/Madhav_Rastogi_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "C",
        "score": 96
      },
      {
        "name": "Rust",
        "score": 93
      },
      {
        "name": "Linux Kernel",
        "score": 90
      },
      {
        "name": "File Systems",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a37",
    "opportunityId": "j1",
    "studentId": "s37",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Raghav Gupta",
    "email": "raghav.gupta@hiero.ai",
    "phone": "+91 9810064548",
    "cgpa": 8.6,
    "department": "Software Engineering",
    "campusName": "DTU Delhi",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 87,
    "status": "applied",
    "appliedAt": "2026-08-26",
    "resumeUrl": "/resumes/Raghav_Gupta_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "AWS Lambda",
        "score": 96
      },
      {
        "name": "Node.js",
        "score": 93
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "DynamoDB",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a38",
    "opportunityId": "j2",
    "studentId": "s38",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Muskan Mittal",
    "email": "muskan.mittal@hiero.ai",
    "phone": "+91 9810066341",
    "cgpa": 9.4,
    "department": "Computer Science & Bio",
    "campusName": "IIIT Delhi",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 96,
    "status": "interview",
    "appliedAt": "2026-08-27",
    "resumeUrl": "/resumes/Muskan_Mittal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "Biopython",
        "score": 93
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "R",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a39",
    "opportunityId": "j3",
    "studentId": "s39",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Aryan Tyagi",
    "email": "aryan.tyagi@hiero.ai",
    "phone": "+91 9810068134",
    "cgpa": 9,
    "department": "Computer Science",
    "campusName": "IIT Patna",
    "campusLocation": "Patna, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 93,
    "status": "selected",
    "appliedAt": "2026-08-28",
    "resumeUrl": "/resumes/Aryan_Tyagi_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 96
      },
      {
        "name": "Raft",
        "score": 93
      },
      {
        "name": "gRPC",
        "score": 90
      },
      {
        "name": "Distributed Systems",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a40",
    "opportunityId": "j4",
    "studentId": "s40",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Simran Chopra",
    "email": "simran.chopra@hiero.ai",
    "phone": "+91 9810069927",
    "cgpa": 8.7,
    "department": "Computer Science",
    "campusName": "UIET Chandigarh",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 91,
    "status": "under-review",
    "appliedAt": "2026-08-29",
    "resumeUrl": "/resumes/Simran_Chopra_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Three.js",
        "score": 96
      },
      {
        "name": "React",
        "score": 93
      },
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "GLSL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a41",
    "opportunityId": "j5",
    "studentId": "s41",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Tushar Bhardwaj",
    "email": "tushar.bhardwaj@hiero.ai",
    "phone": "+91 9810071720",
    "cgpa": 9.2,
    "department": "Computer Science",
    "campusName": "NIT Warangal",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 92,
    "status": "shortlisted",
    "appliedAt": "2026-08-10",
    "resumeUrl": "/resumes/Tushar_Bhardwaj_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "PyTorch Geometric",
        "score": 93
      },
      {
        "name": "NetworkX",
        "score": 90
      },
      {
        "name": "SQL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a42",
    "opportunityId": "j6",
    "studentId": "s42",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Akanksha Sethi",
    "email": "akanksha.sethi@hiero.ai",
    "phone": "+91 9810073513",
    "cgpa": 8.8,
    "department": "Information Technology",
    "campusName": "NIT Kurukshetra",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 89,
    "status": "applied",
    "appliedAt": "2026-08-11",
    "resumeUrl": "/resumes/Akanksha_Sethi_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 96
      },
      {
        "name": "Node.js",
        "score": 93
      },
      {
        "name": "React",
        "score": 90
      },
      {
        "name": "MongoDB",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a43",
    "opportunityId": "j1",
    "studentId": "s43",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Chirag Bansal",
    "email": "chirag.bansal@hiero.ai",
    "phone": "+91 9810075306",
    "cgpa": 8.5,
    "department": "Computer Engineering",
    "campusName": "Jamia Millia Islamia",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 87,
    "status": "interview",
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Chirag_Bansal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Jenkins",
        "score": 96
      },
      {
        "name": "GitHub Actions",
        "score": 93
      },
      {
        "name": "SonarQube",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a44",
    "opportunityId": "j2",
    "studentId": "s44",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Sanya Grover",
    "email": "sanya.grover@hiero.ai",
    "phone": "+91 9810077099",
    "cgpa": 9.1,
    "department": "Computer Science",
    "campusName": "Bennett University",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 94,
    "status": "selected",
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Sanya_Grover_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "LangChain",
        "score": 96
      },
      {
        "name": "LlamaIndex",
        "score": 93
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "HuggingFace",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a45",
    "opportunityId": "j3",
    "studentId": "s45",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Uday Aggarwal",
    "email": "uday.aggarwal@hiero.ai",
    "phone": "+91 9810078892",
    "cgpa": 9,
    "department": "Computer Science",
    "campusName": "MSRIT Bangalore",
    "campusLocation": "Bangalore, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "matchScore": 94,
    "status": "under-review",
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Uday_Aggarwal_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Rust",
        "score": 96
      },
      {
        "name": "C++",
        "score": 93
      },
      {
        "name": "Async I/O",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a46",
    "opportunityId": "j4",
    "studentId": "s46",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Palak Sharma",
    "email": "palak.sharma@hiero.ai",
    "phone": "+91 9810080685",
    "cgpa": 8.7,
    "department": "Communication & CS",
    "campusName": "LNMIIT Jaipur",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Frontend Architecture Engineer",
    "matchScore": 87,
    "status": "shortlisted",
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Palak_Sharma_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Prometheus",
        "score": 96
      },
      {
        "name": "Grafana",
        "score": 93
      },
      {
        "name": "OpenTelemetry",
        "score": 90
      },
      {
        "name": "Kubernetes",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a47",
    "opportunityId": "j5",
    "studentId": "s47",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Sahil Narang",
    "email": "sahil.narang@hiero.ai",
    "phone": "+91 9810082478",
    "cgpa": 8.9,
    "department": "Information Technology",
    "campusName": "IIIT Gwalior",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "matchScore": 90,
    "status": "applied",
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Sahil_Narang_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Apache Flink",
        "score": 96
      },
      {
        "name": "Kafka",
        "score": 93
      },
      {
        "name": "Java",
        "score": 90
      },
      {
        "name": "Python",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a48",
    "opportunityId": "j6",
    "studentId": "s48",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Lavanya Sundaram",
    "email": "lavanya.sundaram@hiero.ai",
    "phone": "+91 9810084271",
    "cgpa": 9.3,
    "department": "Computer Science",
    "campusName": "PSG Tech Coimbatore",
    "campusLocation": "Bangalore, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "matchScore": 95,
    "status": "interview",
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Lavanya_Sundaram_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "TensorRT",
        "score": 96
      },
      {
        "name": "ONNX",
        "score": 93
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "Quantization",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a49",
    "opportunityId": "j1",
    "studentId": "s49",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Mohit Choudhary",
    "email": "mohit.choudhary@hiero.ai",
    "phone": "+91 9810086064",
    "cgpa": 9.2,
    "department": "Computer Science",
    "campusName": "IIT Mandi",
    "campusLocation": "Mandi, India",
    "jobTitle": "Software Developer Intern",
    "matchScore": 95,
    "status": "selected",
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Mohit_Choudhary_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Rust",
        "score": 96
      },
      {
        "name": "Zero-Knowledge Proofs",
        "score": 93
      },
      {
        "name": "Cryptography",
        "score": 90
      },
      {
        "name": "Python",
        "score": 87
      }
    ],
    "source": "hiero"
  },
  {
    "id": "a50",
    "opportunityId": "j2",
    "studentId": "s50",
    "companyId": "c1",
    "companyName": "TechNova Inc.",
    "studentName": "Jaswanth Kumar",
    "email": "jaswanth.kumar@hiero.ai",
    "phone": "+91 9810087857",
    "cgpa": 9.7,
    "department": "Computer Science & AI",
    "campusName": "IIT Madras",
    "campusLocation": "Madras, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "matchScore": 99,
    "status": "under-review",
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Jaswanth_Kumar_Resume_Master.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 96
      },
      {
        "name": "React",
        "score": 93
      },
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Node.js",
        "score": 87
      }
    ],
    "source": "hiero"
  }
];

// --- 50 Bridge Students mapped to Candidate format ---
export const bridgeCandidates: Candidate[] = [
  {
    "id": "STU-NITW-IN-01",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@nitw-in.edu",
    "phone": "+91-9876510001",
    "headline": "CSE Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (CSE) with active project portfolio and 8.85 CGPA.",
    "cgpa": 8.85,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Aarav_Sharma_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.85
      }
    ],
    "projects": [
      {
        "title": "E-Commerce Microservices Engine",
        "description": "Implementation of E-Commerce Microservices Engine using Python, FastAPI, Docker, PostgreSQL.",
        "skills": [
          "Python",
          "FastAPI",
          "Docker",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "FastAPI"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-02",
    "name": "Diya Patel",
    "email": "diya.patel@nitw-in.edu",
    "phone": "+91-9876510002",
    "headline": "AIML Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (AIML) with active project portfolio and 9.2 CGPA.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Diya_Patel_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Computer Vision",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "Brain MRI Tumor Segmentation with 3D U-Net",
        "description": "Implementation of Brain MRI Tumor Segmentation with 3D U-Net using Python, PyTorch, Computer Vision, FastAPI.",
        "skills": [
          "Python",
          "PyTorch",
          "Computer Vision",
          "FastAPI"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-03",
    "name": "Rohan Verma",
    "email": "rohan.verma@nitw-in.edu",
    "phone": "+91-9876510003",
    "headline": "CSE Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (CSE) with active project portfolio and 8.1 CGPA.",
    "cgpa": 8.1,
    "passingYear": 2026,
    "score": 85,
    "resumeUrl": "/resumes/Rohan_Verma_Resume.pdf",
    "skills": [
      {
        "name": "Java",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Spring Boot",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "React",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "MySQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.1
      }
    ],
    "projects": [
      {
        "title": "Smart Hospital Patient Queue Management",
        "description": "Implementation of Smart Hospital Patient Queue Management using Java, Spring Boot, React, MySQL.",
        "skills": [
          "Java",
          "Spring Boot",
          "React",
          "MySQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Java, Cloud APIs, Docker.",
        "skills": [
          "Java",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Java",
          "Spring Boot"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-04",
    "name": "Karan Malhotra",
    "email": "karan.malhotra@nitw-in.edu",
    "phone": "+91-9876510004",
    "headline": "AIML Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (AIML) with active project portfolio and 8.3 CGPA.",
    "cgpa": 8.3,
    "passingYear": 2026,
    "score": 87,
    "resumeUrl": "/resumes/Karan_Malhotra_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TensorFlow",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "NLP",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "BERT",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.3
      }
    ],
    "projects": [
      {
        "title": "Cloud & AI Solutions Optimization Engine",
        "description": "Implementation of Cloud & AI Solutions Optimization Engine using Python, TensorFlow, NLP, BERT.",
        "skills": [
          "Python",
          "TensorFlow",
          "NLP",
          "BERT"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "TensorFlow"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-05",
    "name": "Ananya Reddy",
    "email": "ananya.reddy@nitw-in.edu",
    "phone": "+91-9876510005",
    "headline": "IT Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (IT) with active project portfolio and 8.95 CGPA.",
    "cgpa": 8.95,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Ananya_Reddy_Resume.pdf",
    "skills": [
      {
        "name": "React",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "MongoDB",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.95
      }
    ],
    "projects": [
      {
        "title": "Collaborative Agile Kanban Cloud Workspace",
        "description": "Implementation of Collaborative Agile Kanban Cloud Workspace using React, Node.js, MongoDB, TypeScript.",
        "skills": [
          "React",
          "Node.js",
          "MongoDB",
          "TypeScript"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using React, Cloud APIs, Docker.",
        "skills": [
          "React",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "React",
          "Node.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-06",
    "name": "Kavya Nair",
    "email": "kavya.nair@nitw-in.edu",
    "phone": "+91-9876510006",
    "headline": "ECE Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (ECE) with active project portfolio and 8.7 CGPA.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 91,
    "resumeUrl": "/resumes/Kavya_Nair_Resume.pdf",
    "skills": [
      {
        "name": "Embedded C",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "IoT",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "OpenCV",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "ECE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "Edge AI Thermal Surveillance Camera Network",
        "description": "Implementation of Edge AI Thermal Surveillance Camera Network using Embedded C, Python, IoT, OpenCV.",
        "skills": [
          "Embedded C",
          "Python",
          "IoT",
          "OpenCV"
        ],
        "url": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "description": "Implementation of ECE Applied Capstone Innovation using Embedded C, Cloud APIs, Docker.",
        "skills": [
          "Embedded C",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Embedded C",
          "Python"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-07",
    "name": "Aditya Joshi",
    "email": "aditya.joshi@nitw-in.edu",
    "phone": "+91-9876510007",
    "headline": "CSE Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (CSE) with active project portfolio and 9.1 CGPA.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Aditya_Joshi_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Raft",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "gRPC",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "Distributed Key-Value Store with Raft Consensus",
        "description": "Implementation of Distributed Key-Value Store with Raft Consensus using Go, Docker, Raft, gRPC.",
        "skills": [
          "Go",
          "Docker",
          "Raft",
          "gRPC"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "Docker"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-08",
    "name": "Pooja Hegde",
    "email": "pooja.hegde@nitw-in.edu",
    "phone": "+91-9876510008",
    "headline": "AIML Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (AIML) with active project portfolio and 9.4 CGPA.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 98,
    "resumeUrl": "/resumes/Pooja_Hegde_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Transformers",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "Multilingual Transformer Conversational Chatbot",
        "description": "Implementation of Multilingual Transformer Conversational Chatbot using Python, Transformers, FastAPI, PyTorch.",
        "skills": [
          "Python",
          "Transformers",
          "FastAPI",
          "PyTorch"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Transformers"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-09",
    "name": "Siddharth Roy",
    "email": "siddharth.roy@nitw-in.edu",
    "phone": "+91-9876510009",
    "headline": "IT Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (IT) with active project portfolio and 8.6 CGPA.",
    "cgpa": 8.6,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Siddharth_Roy_Resume.pdf",
    "skills": [
      {
        "name": "Node.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Express",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.6
      }
    ],
    "projects": [
      {
        "title": "Realtime Payment Clearing Gateway Sandbox",
        "description": "Implementation of Realtime Payment Clearing Gateway Sandbox using Node.js, Express, Redis, PostgreSQL.",
        "skills": [
          "Node.js",
          "Express",
          "Redis",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using Node.js, Cloud APIs, Docker.",
        "skills": [
          "Node.js",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Node.js",
          "Express"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITW-IN-10",
    "name": "Meera Nambiar",
    "email": "meera.nambiar@nitw-in.edu",
    "phone": "+91-9876510010",
    "headline": "ECE Student · National Institute of Technology, Warangal",
    "location": "Warangal, Telangana, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Warangal (ECE) with active project portfolio and 8.75 CGPA.",
    "cgpa": 8.75,
    "passingYear": 2026,
    "score": 91,
    "resumeUrl": "/resumes/Meera_Nambiar_Resume.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ROS2",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "LiDAR",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Warangal",
        "degree": "B.Tech",
        "field": "ECE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.75
      }
    ],
    "projects": [
      {
        "title": "Autonomous Drone Flight Telemetry & Obstacle Avoidance",
        "description": "Implementation of Autonomous Drone Flight Telemetry & Obstacle Avoidance using C++, ROS2, Python, LiDAR.",
        "skills": [
          "C++",
          "ROS2",
          "Python",
          "LiDAR"
        ],
        "url": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "description": "Implementation of ECE Applied Capstone Innovation using C++, Cloud APIs, Docker.",
        "skills": [
          "C++",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Warangal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "ROS2"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Warangal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Warangal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-01",
    "name": "Tarun Varma",
    "email": "tarun.varma@iith-in.edu",
    "phone": "+91-9876510011",
    "headline": "CSE Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (CSE) with active project portfolio and 9.6 CGPA.",
    "cgpa": 9.6,
    "passingYear": 2026,
    "score": 99,
    "resumeUrl": "/resumes/Tarun_Varma_Resume.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CUDA",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "LLVM",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.6
      }
    ],
    "projects": [
      {
        "title": "Heterogeneous CPU-GPU Tensor Compiler",
        "description": "Implementation of Heterogeneous CPU-GPU Tensor Compiler using C++, CUDA, LLVM, Python.",
        "skills": [
          "C++",
          "CUDA",
          "LLVM",
          "Python"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using C++, Cloud APIs, Docker.",
        "skills": [
          "C++",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "CUDA"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-02",
    "name": "Sneha Iyer",
    "email": "sneha.iyer@iith-in.edu",
    "phone": "+91-9876510012",
    "headline": "AI Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (AI) with active project portfolio and 9.45 CGPA.",
    "cgpa": 9.45,
    "passingYear": 2026,
    "score": 98,
    "resumeUrl": "/resumes/Sneha_Iyer_Resume.pdf",
    "skills": [
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Computer Vision",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "AI",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.45
      }
    ],
    "projects": [
      {
        "title": "Self-Supervised Vision Transformer for Satellite Imagery",
        "description": "Implementation of Self-Supervised Vision Transformer for Satellite Imagery using PyTorch, Computer Vision, Python, Docker.",
        "skills": [
          "PyTorch",
          "Computer Vision",
          "Python",
          "Docker"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "description": "Implementation of AI Applied Capstone Innovation using PyTorch, Cloud APIs, Docker.",
        "skills": [
          "PyTorch",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "PyTorch",
          "Computer Vision"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-03",
    "name": "Vikramaditya Rao",
    "email": "vikramaditya.rao@iith-in.edu",
    "phone": "+91-9876510013",
    "headline": "CSE Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (CSE) with active project portfolio and 9.15 CGPA.",
    "cgpa": 9.15,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Vikramaditya_Rao_Resume.pdf",
    "skills": [
      {
        "name": "C",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "eBPF",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux Kernel",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Rust",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.15
      }
    ],
    "projects": [
      {
        "title": "High-Throughput Linux Kernel eBPF Packet Filter",
        "description": "Implementation of High-Throughput Linux Kernel eBPF Packet Filter using C, eBPF, Linux Kernel, Rust.",
        "skills": [
          "C",
          "eBPF",
          "Linux Kernel",
          "Rust"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using C, Cloud APIs, Docker.",
        "skills": [
          "C",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C",
          "eBPF"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-04",
    "name": "Priya Deshmukh",
    "email": "priya.deshmukh@iith-in.edu",
    "phone": "+91-9876510014",
    "headline": "EE Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (EE) with active project portfolio and 9.3 CGPA.",
    "cgpa": 9.3,
    "passingYear": 2026,
    "score": 97,
    "resumeUrl": "/resumes/Priya_Deshmukh_Resume.pdf",
    "skills": [
      {
        "name": "MATLAB",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "DSP",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "EE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.3
      }
    ],
    "projects": [
      {
        "title": "5G Open-RAN Beamforming Channel Simulator",
        "description": "Implementation of 5G Open-RAN Beamforming Channel Simulator using MATLAB, Python, C++, DSP.",
        "skills": [
          "MATLAB",
          "Python",
          "C++",
          "DSP"
        ],
        "url": "https://github.com"
      },
      {
        "title": "EE Applied Capstone Innovation",
        "description": "Implementation of EE Applied Capstone Innovation using MATLAB, Cloud APIs, Docker.",
        "skills": [
          "MATLAB",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "MATLAB",
          "Python"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-05",
    "name": "Harshvardhan Patil",
    "email": "harshvardhan.patil@iith-in.edu",
    "phone": "+91-9876510015",
    "headline": "AI Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (AI) with active project portfolio and 9.05 CGPA.",
    "cgpa": 9.05,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Harshvardhan_Patil_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Diffusion Models",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CUDA",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "AI",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.05
      }
    ],
    "projects": [
      {
        "title": "Latent Diffusion Model for Super-Resolution",
        "description": "Implementation of Latent Diffusion Model for Super-Resolution using Python, PyTorch, Diffusion Models, CUDA.",
        "skills": [
          "Python",
          "PyTorch",
          "Diffusion Models",
          "CUDA"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "description": "Implementation of AI Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-06",
    "name": "Shreya Sen",
    "email": "shreya.sen@iith-in.edu",
    "phone": "+91-9876510016",
    "headline": "CSE Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (CSE) with active project portfolio and 9.5 CGPA.",
    "cgpa": 9.5,
    "passingYear": 2026,
    "score": 99,
    "resumeUrl": "/resumes/Shreya_Sen_Resume.pdf",
    "skills": [
      {
        "name": "Rust",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ZK-SNARKs",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Solidity",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.5
      }
    ],
    "projects": [
      {
        "title": "Zero-Knowledge Proof Smart Contract Verifier",
        "description": "Implementation of Zero-Knowledge Proof Smart Contract Verifier using Rust, ZK-SNARKs, Solidity, Go.",
        "skills": [
          "Rust",
          "ZK-SNARKs",
          "Solidity",
          "Go"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Rust, Cloud APIs, Docker.",
        "skills": [
          "Rust",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Rust",
          "ZK-SNARKs"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-07",
    "name": "Ankit Agarwal",
    "email": "ankit.agarwal@iith-in.edu",
    "phone": "+91-9876510017",
    "headline": "EE Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (EE) with active project portfolio and 8.9 CGPA.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Ankit_Agarwal_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "gRPC",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "EE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "Distributed Micro-Transactions Fault-Tolerant Ledger",
        "description": "Implementation of Distributed Micro-Transactions Fault-Tolerant Ledger using Go, gRPC, PostgreSQL, Docker.",
        "skills": [
          "Go",
          "gRPC",
          "PostgreSQL",
          "Docker"
        ],
        "url": "https://github.com"
      },
      {
        "title": "EE Applied Capstone Innovation",
        "description": "Implementation of EE Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "gRPC"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-08",
    "name": "Nidhi Kulkarni",
    "email": "nidhi.kulkarni@iith-in.edu",
    "phone": "+91-9876510018",
    "headline": "AI Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (AI) with active project portfolio and 9.25 CGPA.",
    "cgpa": 9.25,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Nidhi_Kulkarni_Resume.pdf",
    "skills": [
      {
        "name": "Verilog",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Vitis AI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "AI",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.25
      }
    ],
    "projects": [
      {
        "title": "Edge Neural Network Acceleration on FPGA",
        "description": "Implementation of Edge Neural Network Acceleration on FPGA using Verilog, Vitis AI, Python, PyTorch.",
        "skills": [
          "Verilog",
          "Vitis AI",
          "Python",
          "PyTorch"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "description": "Implementation of AI Applied Capstone Innovation using Verilog, Cloud APIs, Docker.",
        "skills": [
          "Verilog",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Verilog",
          "Vitis AI"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-09",
    "name": "Devansh Singhal",
    "email": "devansh.singhal@iith-in.edu",
    "phone": "+91-9876510019",
    "headline": "CSE Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (CSE) with active project portfolio and 9.35 CGPA.",
    "cgpa": 9.35,
    "passingYear": 2026,
    "score": 97,
    "resumeUrl": "/resumes/Devansh_Singhal_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Vector DB",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.35
      }
    ],
    "projects": [
      {
        "title": "Semantic LLM Context Caching Engine",
        "description": "Implementation of Semantic LLM Context Caching Engine using Python, Vector DB, Redis, FastAPI.",
        "skills": [
          "Python",
          "Vector DB",
          "Redis",
          "FastAPI"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Vector DB"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-IITH-IN-10",
    "name": "Riya Mukherjee",
    "email": "riya.mukherjee@iith-in.edu",
    "phone": "+91-9876510020",
    "headline": "AI Student · Indian Institute of Technology, Hyderabad",
    "location": "Kandi, Sangareddy, Telangana, India",
    "aboutMe": "Verified campus placement candidate from Indian Institute of Technology, Hyderabad (AI) with active project portfolio and 9.1 CGPA.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Riya_Mukherjee_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ROS2",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Point Clouds",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Indian Institute of Technology, Hyderabad",
        "degree": "B.Tech",
        "field": "AI",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "Autonomous Vehicle LiDAR Multi-Object Tracking",
        "description": "Implementation of Autonomous Vehicle LiDAR Multi-Object Tracking using Python, C++, ROS2, Point Clouds.",
        "skills": [
          "Python",
          "C++",
          "ROS2",
          "Point Clouds"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "description": "Implementation of AI Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Indian Institute of Technology, Hyderabad Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "C++"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Indian Institute of Technology, Hyderabad Certified Honours Scholar",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Indian Institute of Technology, Hyderabad",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-01",
    "name": "Kabir Mehrotra",
    "email": "kabir.mehrotra@bits-pilani.edu",
    "phone": "+91-9876510021",
    "headline": "CS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (CS) with active project portfolio and 9.35 CGPA.",
    "cgpa": 9.35,
    "passingYear": 2026,
    "score": 97,
    "resumeUrl": "/resumes/Kabir_Mehrotra_Resume.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Lock-Free Queues",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.35
      }
    ],
    "projects": [
      {
        "title": "High-Frequency Order Book Matching Engine",
        "description": "Implementation of High-Frequency Order Book Matching Engine using C++, Lock-Free Queues, Python, Linux.",
        "skills": [
          "C++",
          "Lock-Free Queues",
          "Python",
          "Linux"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "description": "Implementation of CS Applied Capstone Innovation using C++, Cloud APIs, Docker.",
        "skills": [
          "C++",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "Lock-Free Queues"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-02",
    "name": "Tanvi Chawla",
    "email": "tanvi.chawla@bits-pilani.edu",
    "phone": "+91-9876510022",
    "headline": "CS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (CS) with active project portfolio and 8.9 CGPA.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Tanvi_Chawla_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "IPFS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "libp2p",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "Decentralized Peer-to-Peer Content Addressable Storage",
        "description": "Implementation of Decentralized Peer-to-Peer Content Addressable Storage using Go, IPFS, libp2p, TypeScript.",
        "skills": [
          "Go",
          "IPFS",
          "libp2p",
          "TypeScript"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "description": "Implementation of CS Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "IPFS"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-03",
    "name": "Pranav Bajaj",
    "email": "pranav.bajaj@bits-pilani.edu",
    "phone": "+91-9876510023",
    "headline": "EEE Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (EEE) with active project portfolio and 9.1 CGPA.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Pranav_Bajaj_Resume.pdf",
    "skills": [
      {
        "name": "Embedded C",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CAN Bus",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "MATLAB",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "EEE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "Battery Management System for Electric Vehicles",
        "description": "Implementation of Battery Management System for Electric Vehicles using Embedded C, CAN Bus, MATLAB, Python.",
        "skills": [
          "Embedded C",
          "CAN Bus",
          "MATLAB",
          "Python"
        ],
        "url": "https://github.com"
      },
      {
        "title": "EEE Applied Capstone Innovation",
        "description": "Implementation of EEE Applied Capstone Innovation using Embedded C, Cloud APIs, Docker.",
        "skills": [
          "Embedded C",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Embedded C",
          "CAN Bus"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-04",
    "name": "Ishaan Kapoor",
    "email": "ishaan.kapoor@bits-pilani.edu",
    "phone": "+91-9876510024",
    "headline": "CS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (CS) with active project portfolio and 9.5 CGPA.",
    "cgpa": 9.5,
    "passingYear": 2026,
    "score": 99,
    "resumeUrl": "/resumes/Ishaan_Kapoor_Resume.pdf",
    "skills": [
      {
        "name": "Rust",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AVX-512",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.5
      }
    ],
    "projects": [
      {
        "title": "Embedded Vector Database with SIMD Acceleration",
        "description": "Implementation of Embedded Vector Database with SIMD Acceleration using Rust, AVX-512, Python, C++.",
        "skills": [
          "Rust",
          "AVX-512",
          "Python",
          "C++"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "description": "Implementation of CS Applied Capstone Innovation using Rust, Cloud APIs, Docker.",
        "skills": [
          "Rust",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Rust",
          "AVX-512"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-05",
    "name": "Rhea Bhatia",
    "email": "rhea.bhatia@bits-pilani.edu",
    "phone": "+91-9876510025",
    "headline": "DS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (DS) with active project portfolio and 9.2 CGPA.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Rhea_Bhatia_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Neo4j",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kafka",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "DS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "Realtime Financial Fraud Detection on Graph Streams",
        "description": "Implementation of Realtime Financial Fraud Detection on Graph Streams using Python, Neo4j, Kafka, PyTorch.",
        "skills": [
          "Python",
          "Neo4j",
          "Kafka",
          "PyTorch"
        ],
        "url": "https://github.com"
      },
      {
        "title": "DS Applied Capstone Innovation",
        "description": "Implementation of DS Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Neo4j"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-06",
    "name": "Rishabh Jain",
    "email": "rishabh.jain@bits-pilani.edu",
    "phone": "+91-9876510026",
    "headline": "CS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (CS) with active project portfolio and 8.85 CGPA.",
    "cgpa": 8.85,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Rishabh_Jain_Resume.pdf",
    "skills": [
      {
        "name": "Rust",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Wasm",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Web Audio API",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.85
      }
    ],
    "projects": [
      {
        "title": "WebAssembly In-Browser Digital Audio Workstation",
        "description": "Implementation of WebAssembly In-Browser Digital Audio Workstation using Rust, Wasm, TypeScript, Web Audio API.",
        "skills": [
          "Rust",
          "Wasm",
          "TypeScript",
          "Web Audio API"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "description": "Implementation of CS Applied Capstone Innovation using Rust, Cloud APIs, Docker.",
        "skills": [
          "Rust",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Rust",
          "Wasm"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-07",
    "name": "Samaira Khurana",
    "email": "samaira.khurana@bits-pilani.edu",
    "phone": "+91-9876510027",
    "headline": "CS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (CS) with active project portfolio and 9 CGPA.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Samaira_Khurana_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Tree-sitter",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AST",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "AI-Powered Static Code Security Analysis Tool",
        "description": "Implementation of AI-Powered Static Code Security Analysis Tool using Python, Tree-sitter, AST, Docker.",
        "skills": [
          "Python",
          "Tree-sitter",
          "AST",
          "Docker"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "description": "Implementation of CS Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Tree-sitter"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-08",
    "name": "Yashwardhan Goel",
    "email": "yashwardhan.goel@bits-pilani.edu",
    "phone": "+91-9876510028",
    "headline": "EEE Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (EEE) with active project portfolio and 8.75 CGPA.",
    "cgpa": 8.75,
    "passingYear": 2026,
    "score": 91,
    "resumeUrl": "/resumes/Yashwardhan_Goel_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TensorFlow",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Timeseries",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "EEE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.75
      }
    ],
    "projects": [
      {
        "title": "Smart Grid Renewable Energy Forecasting with GRU",
        "description": "Implementation of Smart Grid Renewable Energy Forecasting with GRU using Python, TensorFlow, Timeseries, SQL.",
        "skills": [
          "Python",
          "TensorFlow",
          "Timeseries",
          "SQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "EEE Applied Capstone Innovation",
        "description": "Implementation of EEE Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "TensorFlow"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-09",
    "name": "Avani Shah",
    "email": "avani.shah@bits-pilani.edu",
    "phone": "+91-9876510029",
    "headline": "CS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (CS) with active project portfolio and 9.4 CGPA.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 98,
    "resumeUrl": "/resumes/Avani_Shah_Resume.pdf",
    "skills": [
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "GraphQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "CS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "Distributed GraphQL Federation Subgraph Gateway",
        "description": "Implementation of Distributed GraphQL Federation Subgraph Gateway using TypeScript, Node.js, GraphQL, Docker.",
        "skills": [
          "TypeScript",
          "Node.js",
          "GraphQL",
          "Docker"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "description": "Implementation of CS Applied Capstone Innovation using TypeScript, Cloud APIs, Docker.",
        "skills": [
          "TypeScript",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "TypeScript",
          "Node.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-BITS-PILANI-10",
    "name": "Madhav Rastogi",
    "email": "madhav.rastogi@bits-pilani.edu",
    "phone": "+91-9876510030",
    "headline": "DS Student · Birla Institute of Technology and Science, Pilani",
    "location": "Pilani, Rajasthan & Hyderabad Campus, India",
    "aboutMe": "Verified campus placement candidate from Birla Institute of Technology and Science, Pilani (DS) with active project portfolio and 9.15 CGPA.",
    "cgpa": 9.15,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Madhav_Rastogi_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Spacy",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Birla Institute of Technology and Science, Pilani",
        "degree": "B.Tech",
        "field": "DS",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.15
      }
    ],
    "projects": [
      {
        "title": "Clinical Trial Patient Matching NLP Pipeline",
        "description": "Implementation of Clinical Trial Patient Matching NLP Pipeline using Python, Spacy, FastAPI, PostgreSQL.",
        "skills": [
          "Python",
          "Spacy",
          "FastAPI",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "DS Applied Capstone Innovation",
        "description": "Implementation of DS Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Birla Institute of Technology and Science, Pilani Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Spacy"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Birla Institute of Technology and Science, Pilani Certified Honours Scholar",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Birla Institute of Technology and Science, Pilani",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-01",
    "name": "Varun Hegde",
    "email": "varun.hegde@nitk-in.edu",
    "phone": "+91-9876510031",
    "headline": "CSE Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (CSE) with active project portfolio and 9.25 CGPA.",
    "cgpa": 9.25,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Varun_Hegde_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FFmpeg",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.25
      }
    ],
    "projects": [
      {
        "title": "Realtime Distributed Video Transcoding CDN",
        "description": "Implementation of Realtime Distributed Video Transcoding CDN using Go, FFmpeg, Redis, Docker.",
        "skills": [
          "Go",
          "FFmpeg",
          "Redis",
          "Docker"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "FFmpeg"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-02",
    "name": "Keerthi Bhat",
    "email": "keerthi.bhat@nitk-in.edu",
    "phone": "+91-9876510032",
    "headline": "IT Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (IT) with active project portfolio and 9.4 CGPA.",
    "cgpa": 9.4,
    "passingYear": 2026,
    "score": 98,
    "resumeUrl": "/resumes/Keerthi_Bhat_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes Operator",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Prometheus",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Helm",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.4
      }
    ],
    "projects": [
      {
        "title": "Cloud Native Multi-Cluster Observability Operator",
        "description": "Implementation of Cloud Native Multi-Cluster Observability Operator using Go, Kubernetes Operator, Prometheus, Helm.",
        "skills": [
          "Go",
          "Kubernetes Operator",
          "Prometheus",
          "Helm"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "Kubernetes Operator"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-03",
    "name": "Gautam Kamath",
    "email": "gautam.kamath@nitk-in.edu",
    "phone": "+91-9876510033",
    "headline": "CSE Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (CSE) with active project portfolio and 8.95 CGPA.",
    "cgpa": 8.95,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Gautam_Kamath_Resume.pdf",
    "skills": [
      {
        "name": "Java",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "SQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Algorithms",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.95
      }
    ],
    "projects": [
      {
        "title": "Cost-Based Database Query Planner Optimizer",
        "description": "Implementation of Cost-Based Database Query Planner Optimizer using Java, SQL, C++, Algorithms.",
        "skills": [
          "Java",
          "SQL",
          "C++",
          "Algorithms"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Java, Cloud APIs, Docker.",
        "skills": [
          "Java",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Java",
          "SQL"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-04",
    "name": "Sahana Shetty",
    "email": "sahana.shetty@nitk-in.edu",
    "phone": "+91-9876510034",
    "headline": "AIML Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (AIML) with active project portfolio and 9.15 CGPA.",
    "cgpa": 9.15,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Sahana_Shetty_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Wav2Vec",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Audio DSP",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.15
      }
    ],
    "projects": [
      {
        "title": "End-to-End Automatic Speech Recognition for Indic Languages",
        "description": "Implementation of End-to-End Automatic Speech Recognition for Indic Languages using Python, Wav2Vec, PyTorch, Audio DSP.",
        "skills": [
          "Python",
          "Wav2Vec",
          "PyTorch",
          "Audio DSP"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Wav2Vec"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-05",
    "name": "Akhil Prabhu",
    "email": "akhil.prabhu@nitk-in.edu",
    "phone": "+91-9876510035",
    "headline": "ECE Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (ECE) with active project portfolio and 8.8 CGPA.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Akhil_Prabhu_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Signal Processing",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TensorFlow",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "ECE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Marine Underwater Sonar Signal Classifier",
        "description": "Implementation of Marine Underwater Sonar Signal Classifier using Python, Signal Processing, TensorFlow, C++.",
        "skills": [
          "Python",
          "Signal Processing",
          "TensorFlow",
          "C++"
        ],
        "url": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "description": "Implementation of ECE Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Signal Processing"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-06",
    "name": "Divya Shenoy",
    "email": "divya.shenoy@nitk-in.edu",
    "phone": "+91-9876510036",
    "headline": "CSE Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (CSE) with active project portfolio and 9.3 CGPA.",
    "cgpa": 9.3,
    "passingYear": 2026,
    "score": 97,
    "resumeUrl": "/resumes/Divya_Shenoy_Resume.pdf",
    "skills": [
      {
        "name": "Node.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Redis",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostgreSQL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.3
      }
    ],
    "projects": [
      {
        "title": "Enterprise Multi-Tenant OAuth2/OIDC Auth Server",
        "description": "Implementation of Enterprise Multi-Tenant OAuth2/OIDC Auth Server using Node.js, TypeScript, Redis, PostgreSQL.",
        "skills": [
          "Node.js",
          "TypeScript",
          "Redis",
          "PostgreSQL"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Node.js, Cloud APIs, Docker.",
        "skills": [
          "Node.js",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Node.js",
          "TypeScript"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-07",
    "name": "Manjunath Rao",
    "email": "manjunath.rao@nitk-in.edu",
    "phone": "+91-9876510037",
    "headline": "IT Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (IT) with active project portfolio and 8.7 CGPA.",
    "cgpa": 8.7,
    "passingYear": 2026,
    "score": 91,
    "resumeUrl": "/resumes/Manjunath_Rao_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "BGP",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "DNS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux Networking",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.7
      }
    ],
    "projects": [
      {
        "title": "Automated Global Anycast DNS Load Balancer",
        "description": "Implementation of Automated Global Anycast DNS Load Balancer using Go, BGP, DNS, Linux Networking.",
        "skills": [
          "Go",
          "BGP",
          "DNS",
          "Linux Networking"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "BGP"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-08",
    "name": "Deepa Nayak",
    "email": "deepa.nayak@nitk-in.edu",
    "phone": "+91-9876510038",
    "headline": "AIML Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (AIML) with active project portfolio and 9.05 CGPA.",
    "cgpa": 9.05,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Deepa_Nayak_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Vision-Language Models",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "DICOM",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.05
      }
    ],
    "projects": [
      {
        "title": "Automated Chest X-Ray Pathology Report Generator",
        "description": "Implementation of Automated Chest X-Ray Pathology Report Generator using Python, Vision-Language Models, PyTorch, DICOM.",
        "skills": [
          "Python",
          "Vision-Language Models",
          "PyTorch",
          "DICOM"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Vision-Language Models"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-09",
    "name": "Praveen Pai",
    "email": "praveen.pai@nitk-in.edu",
    "phone": "+91-9876510039",
    "headline": "ECE Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (ECE) with active project portfolio and 8.85 CGPA.",
    "cgpa": 8.85,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Praveen_Pai_Resume.pdf",
    "skills": [
      {
        "name": "C",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TinyML",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "ESP32",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "TensorFlow Lite",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "ECE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.85
      }
    ],
    "projects": [
      {
        "title": "Industrial Vibration Anomaly Detection on TinyML",
        "description": "Implementation of Industrial Vibration Anomaly Detection on TinyML using C, TinyML, ESP32, TensorFlow Lite.",
        "skills": [
          "C",
          "TinyML",
          "ESP32",
          "TensorFlow Lite"
        ],
        "url": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "description": "Implementation of ECE Applied Capstone Innovation using C, Cloud APIs, Docker.",
        "skills": [
          "C",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C",
          "TinyML"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-NITK-IN-10",
    "name": "Anusha Kudva",
    "email": "anusha.kudva@nitk-in.edu",
    "phone": "+91-9876510040",
    "headline": "CSE Student · National Institute of Technology, Surathkal",
    "location": "Mangalore, Karnataka, India",
    "aboutMe": "Verified campus placement candidate from National Institute of Technology, Surathkal (CSE) with active project portfolio and 9.5 CGPA.",
    "cgpa": 9.5,
    "passingYear": 2026,
    "score": 99,
    "resumeUrl": "/resumes/Anusha_Kudva_Resume.pdf",
    "skills": [
      {
        "name": "Rust",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux Namespaces",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "cgroups",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "OCI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "National Institute of Technology, Surathkal",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.5
      }
    ],
    "projects": [
      {
        "title": "Lightweight Container Isolation Runtime in Rust",
        "description": "Implementation of Lightweight Container Isolation Runtime in Rust using Rust, Linux Namespaces, cgroups, OCI.",
        "skills": [
          "Rust",
          "Linux Namespaces",
          "cgroups",
          "OCI"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Rust, Cloud APIs, Docker.",
        "skills": [
          "Rust",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "National Institute of Technology, Surathkal Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Rust",
          "Linux Namespaces"
        ]
      }
    ],
    "certifications": [
      {
        "name": "National Institute of Technology, Surathkal Certified Honours Scholar",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "National Institute of Technology, Surathkal",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-01",
    "name": "Raghav Gupta",
    "email": "raghav.gupta@dtu-delhi.edu",
    "phone": "+91-9876510041",
    "headline": "CSE Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (CSE) with active project portfolio and 9.1 CGPA.",
    "cgpa": 9.1,
    "passingYear": 2026,
    "score": 95,
    "resumeUrl": "/resumes/Raghav_Gupta_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AWS Lambda",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kafka",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "DynamoDB",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.1
      }
    ],
    "projects": [
      {
        "title": "High-Throughput Serverless Event Streaming Broker",
        "description": "Implementation of High-Throughput Serverless Event Streaming Broker using Go, AWS Lambda, Kafka, DynamoDB.",
        "skills": [
          "Go",
          "AWS Lambda",
          "Kafka",
          "DynamoDB"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "AWS Lambda"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-02",
    "name": "Muskan Mittal",
    "email": "muskan.mittal@dtu-delhi.edu",
    "phone": "+91-9876510042",
    "headline": "IT Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (IT) with active project portfolio and 9.35 CGPA.",
    "cgpa": 9.35,
    "passingYear": 2026,
    "score": 97,
    "resumeUrl": "/resumes/Muskan_Mittal_Resume.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CUDA",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Bioinformatics",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.35
      }
    ],
    "projects": [
      {
        "title": "GPU-Accelerated Genome Sequence Alignment Pipeline",
        "description": "Implementation of GPU-Accelerated Genome Sequence Alignment Pipeline using C++, CUDA, Python, Bioinformatics.",
        "skills": [
          "C++",
          "CUDA",
          "Python",
          "Bioinformatics"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using C++, Cloud APIs, Docker.",
        "skills": [
          "C++",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "CUDA"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-03",
    "name": "Aryan Tyagi",
    "email": "aryan.tyagi@dtu-delhi.edu",
    "phone": "+91-9876510043",
    "headline": "SE Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (SE) with active project portfolio and 8.9 CGPA.",
    "cgpa": 8.9,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Aryan_Tyagi_Resume.pdf",
    "skills": [
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Node.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Babel",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CLI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "SE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.9
      }
    ],
    "projects": [
      {
        "title": "AST-Based Automated Code Refactoring & Security Linter",
        "description": "Implementation of AST-Based Automated Code Refactoring & Security Linter using TypeScript, Node.js, Babel, CLI.",
        "skills": [
          "TypeScript",
          "Node.js",
          "Babel",
          "CLI"
        ],
        "url": "https://github.com"
      },
      {
        "title": "SE Applied Capstone Innovation",
        "description": "Implementation of SE Applied Capstone Innovation using TypeScript, Cloud APIs, Docker.",
        "skills": [
          "TypeScript",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "TypeScript",
          "Node.js"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-04",
    "name": "Simran Chopra",
    "email": "simran.chopra@dtu-delhi.edu",
    "phone": "+91-9876510044",
    "headline": "CSE Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (CSE) with active project portfolio and 9.2 CGPA.",
    "cgpa": 9.2,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Simran_Chopra_Resume.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "WebGL",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Three.js",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PostGIS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.2
      }
    ],
    "projects": [
      {
        "title": "3D Geospatial Point Cloud Spatial Indexing Engine",
        "description": "Implementation of 3D Geospatial Point Cloud Spatial Indexing Engine using C++, WebGL, Three.js, PostGIS.",
        "skills": [
          "C++",
          "WebGL",
          "Three.js",
          "PostGIS"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using C++, Cloud APIs, Docker.",
        "skills": [
          "C++",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "WebGL"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-05",
    "name": "Tushar Bhardwaj",
    "email": "tushar.bhardwaj@dtu-delhi.edu",
    "phone": "+91-9876510045",
    "headline": "AIML Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (AIML) with active project portfolio and 8.8 CGPA.",
    "cgpa": 8.8,
    "passingYear": 2026,
    "score": 92,
    "resumeUrl": "/resumes/Tushar_Bhardwaj_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "LangChain",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Neo4j",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "FastAPI",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.8
      }
    ],
    "projects": [
      {
        "title": "Enterprise Knowledge Graph RAG Search Engine",
        "description": "Implementation of Enterprise Knowledge Graph RAG Search Engine using Python, LangChain, Neo4j, FastAPI.",
        "skills": [
          "Python",
          "LangChain",
          "Neo4j",
          "FastAPI"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "LangChain"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-06",
    "name": "Akanksha Sethi",
    "email": "akanksha.sethi@dtu-delhi.edu",
    "phone": "+91-9876510046",
    "headline": "IT Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (IT) with active project portfolio and 9 CGPA.",
    "cgpa": 9,
    "passingYear": 2026,
    "score": 94,
    "resumeUrl": "/resumes/Akanksha_Sethi_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Terraform SDK",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "AWS",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Azure",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9
      }
    ],
    "projects": [
      {
        "title": "Declarative Multi-Cloud Infrastructure Synthesizer",
        "description": "Implementation of Declarative Multi-Cloud Infrastructure Synthesizer using Python, Terraform SDK, AWS, Azure.",
        "skills": [
          "Python",
          "Terraform SDK",
          "AWS",
          "Azure"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "Terraform SDK"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-07",
    "name": "Chirag Bansal",
    "email": "chirag.bansal@dtu-delhi.edu",
    "phone": "+91-9876510047",
    "headline": "SE Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (SE) with active project portfolio and 8.65 CGPA.",
    "cgpa": 8.65,
    "passingYear": 2026,
    "score": 90,
    "resumeUrl": "/resumes/Chirag_Bansal_Resume.pdf",
    "skills": [
      {
        "name": "Go",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Kubernetes",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Prometheus",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "SE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.65
      }
    ],
    "projects": [
      {
        "title": "Microservices Fault Injection & Chaos Testing Harness",
        "description": "Implementation of Microservices Fault Injection & Chaos Testing Harness using Go, Docker, Kubernetes, Prometheus.",
        "skills": [
          "Go",
          "Docker",
          "Kubernetes",
          "Prometheus"
        ],
        "url": "https://github.com"
      },
      {
        "title": "SE Applied Capstone Innovation",
        "description": "Implementation of SE Applied Capstone Innovation using Go, Cloud APIs, Docker.",
        "skills": [
          "Go",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Go",
          "Docker"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-08",
    "name": "Sanya Grover",
    "email": "sanya.grover@dtu-delhi.edu",
    "phone": "+91-9876510048",
    "headline": "AIML Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (AIML) with active project portfolio and 9.45 CGPA.",
    "cgpa": 9.45,
    "passingYear": 2026,
    "score": 98,
    "resumeUrl": "/resumes/Sanya_Grover_Resume.pdf",
    "skills": [
      {
        "name": "Python",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "PyTorch",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "OpenCV",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Transformers",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "AIML",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.45
      }
    ],
    "projects": [
      {
        "title": "Multimodal Video Emotion & Engagement Detection",
        "description": "Implementation of Multimodal Video Emotion & Engagement Detection using Python, PyTorch, OpenCV, Transformers.",
        "skills": [
          "Python",
          "PyTorch",
          "OpenCV",
          "Transformers"
        ],
        "url": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "description": "Implementation of AIML Applied Capstone Innovation using Python, Cloud APIs, Docker.",
        "skills": [
          "Python",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "Python",
          "PyTorch"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-09",
    "name": "Uday Aggarwal",
    "email": "uday.aggarwal@dtu-delhi.edu",
    "phone": "+91-9876510049",
    "headline": "CSE Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (CSE) with active project portfolio and 9.25 CGPA.",
    "cgpa": 9.25,
    "passingYear": 2026,
    "score": 96,
    "resumeUrl": "/resumes/Uday_Aggarwal_Resume.pdf",
    "skills": [
      {
        "name": "C++",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Assembly",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Operating Systems",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Linux",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "CSE",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 9.25
      }
    ],
    "projects": [
      {
        "title": "Lock-Free Memory Allocator for Concurrent Systems",
        "description": "Implementation of Lock-Free Memory Allocator for Concurrent Systems using C++, Assembly, Operating Systems, Linux.",
        "skills": [
          "C++",
          "Assembly",
          "Operating Systems",
          "Linux"
        ],
        "url": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "description": "Implementation of CSE Applied Capstone Innovation using C++, Cloud APIs, Docker.",
        "skills": [
          "C++",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "C++",
          "Assembly"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  },
  {
    "id": "STU-DTU-DELHI-10",
    "name": "Palak Sharma",
    "email": "palak.sharma@dtu-delhi.edu",
    "phone": "+91-9876510050",
    "headline": "IT Student · Delhi Technological University",
    "location": "Rohini, New Delhi, India",
    "aboutMe": "Verified campus placement candidate from Delhi Technological University (IT) with active project portfolio and 8.95 CGPA.",
    "cgpa": 8.95,
    "passingYear": 2026,
    "score": 93,
    "resumeUrl": "/resumes/Palak_Sharma_Resume.pdf",
    "skills": [
      {
        "name": "TypeScript",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Jest",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "Docker",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      },
      {
        "name": "CI/CD",
        "competency": 90,
        "verified": true,
        "lastAssessedAt": "2026-08-20"
      }
    ],
    "education": [
      {
        "institution": "Delhi Technological University",
        "degree": "B.Tech",
        "field": "IT",
        "startYear": 2022,
        "endYear": 2026,
        "cgpa": 8.95
      }
    ],
    "projects": [
      {
        "title": "Automated REST & GraphQL API Contract Verification Suite",
        "description": "Implementation of Automated REST & GraphQL API Contract Verification Suite using TypeScript, Jest, Docker, CI/CD.",
        "skills": [
          "TypeScript",
          "Jest",
          "Docker",
          "CI/CD"
        ],
        "url": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "description": "Implementation of IT Applied Capstone Innovation using TypeScript, Cloud APIs, Docker.",
        "skills": [
          "TypeScript",
          "Cloud APIs",
          "Docker"
        ],
        "url": "https://github.com"
      }
    ],
    "experience": [
      {
        "company": "Delhi Technological University Research Lab",
        "role": "Academic Engineering Researcher",
        "description": "Collaborated on departmental engineering innovation and laboratory testbed benchmarking.",
        "startDate": "2025-06",
        "endDate": "2025-08",
        "skills": [
          "TypeScript",
          "Jest"
        ]
      }
    ],
    "certifications": [
      {
        "name": "Delhi Technological University Certified Honours Scholar",
        "issuer": "Delhi Technological University",
        "date": "2026"
      },
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Delhi Technological University",
        "date": "2026"
      }
    ],
    "authorizedSections": [
      "all"
    ]
  }
];

// --- 50 Bridge Applications ---
export const bridgeApplications: Application[] = [
  {
    "id": "APP-NITW-IN-01",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-NITW-IN-01",
    "student_id": "STU-NITW-IN-01",
    "studentName": "Aarav Sharma",
    "email": "aarav.sharma@nitw-in.edu",
    "phone": "+91-9876510001",
    "cgpa": 8.85,
    "department": "CSE",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 88,
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Aarav_Sharma_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "E-Commerce Microservices Engine",
        "tech": "Python, FastAPI, Docker, PostgreSQL",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-02",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-NITW-IN-02",
    "student_id": "STU-NITW-IN-02",
    "studentName": "Diya Patel",
    "email": "diya.patel@nitw-in.edu",
    "phone": "+91-9876510002",
    "cgpa": 9.2,
    "department": "AIML",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 93,
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Diya_Patel_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "Computer Vision",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Brain MRI Tumor Segmentation with 3D U-Net",
        "tech": "Python, PyTorch, Computer Vision, FastAPI",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-03",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-NITW-IN-03",
    "student_id": "STU-NITW-IN-03",
    "studentName": "Rohan Verma",
    "email": "rohan.verma@nitw-in.edu",
    "phone": "+91-9876510003",
    "cgpa": 8.1,
    "department": "CSE",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "interview",
    "matchScore": 83,
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Rohan_Verma_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Java",
        "score": 90
      },
      {
        "name": "Spring Boot",
        "score": 90
      },
      {
        "name": "React",
        "score": 90
      },
      {
        "name": "MySQL",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Smart Hospital Patient Queue Management",
        "tech": "Java, Spring Boot, React, MySQL",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Java, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-04",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-NITW-IN-04",
    "student_id": "STU-NITW-IN-04",
    "studentName": "Karan Malhotra",
    "email": "karan.malhotra@nitw-in.edu",
    "phone": "+91-9876510004",
    "cgpa": 8.3,
    "department": "AIML",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 86,
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Karan_Malhotra_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "TensorFlow",
        "score": 90
      },
      {
        "name": "NLP",
        "score": 90
      },
      {
        "name": "BERT",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Cloud & AI Solutions Optimization Engine",
        "tech": "Python, TensorFlow, NLP, BERT",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-05",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-NITW-IN-05",
    "student_id": "STU-NITW-IN-05",
    "studentName": "Ananya Reddy",
    "email": "ananya.reddy@nitw-in.edu",
    "phone": "+91-9876510005",
    "cgpa": 8.95,
    "department": "IT",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 93,
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Ananya_Reddy_Resume.pdf",
    "matchingSkills": [
      {
        "name": "React",
        "score": 90
      },
      {
        "name": "Node.js",
        "score": 90
      },
      {
        "name": "MongoDB",
        "score": 90
      },
      {
        "name": "TypeScript",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Collaborative Agile Kanban Cloud Workspace",
        "tech": "React, Node.js, MongoDB, TypeScript",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "React, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-06",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-NITW-IN-06",
    "student_id": "STU-NITW-IN-06",
    "studentName": "Kavya Nair",
    "email": "kavya.nair@nitw-in.edu",
    "phone": "+91-9876510006",
    "cgpa": 8.7,
    "department": "ECE",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 92,
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Kavya_Nair_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Embedded C",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "IoT",
        "score": 90
      },
      {
        "name": "OpenCV",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Edge AI Thermal Surveillance Camera Network",
        "tech": "Embedded C, Python, IoT, OpenCV",
        "link": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "tech": "Embedded C, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-07",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-NITW-IN-07",
    "student_id": "STU-NITW-IN-07",
    "studentName": "Aditya Joshi",
    "email": "aditya.joshi@nitw-in.edu",
    "phone": "+91-9876510007",
    "cgpa": 9.1,
    "department": "CSE",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 91,
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Aditya_Joshi_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      },
      {
        "name": "Raft",
        "score": 90
      },
      {
        "name": "gRPC",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Distributed Key-Value Store with Raft Consensus",
        "tech": "Go, Docker, Raft, gRPC",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-08",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-NITW-IN-08",
    "student_id": "STU-NITW-IN-08",
    "studentName": "Pooja Hegde",
    "email": "pooja.hegde@nitw-in.edu",
    "phone": "+91-9876510008",
    "cgpa": 9.4,
    "department": "AIML",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 95,
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Pooja_Hegde_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Transformers",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Multilingual Transformer Conversational Chatbot",
        "tech": "Python, Transformers, FastAPI, PyTorch",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-09",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-NITW-IN-09",
    "student_id": "STU-NITW-IN-09",
    "studentName": "Siddharth Roy",
    "email": "siddharth.roy@nitw-in.edu",
    "phone": "+91-9876510009",
    "cgpa": 8.6,
    "department": "IT",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 88,
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Siddharth_Roy_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Node.js",
        "score": 90
      },
      {
        "name": "Express",
        "score": 90
      },
      {
        "name": "Redis",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Realtime Payment Clearing Gateway Sandbox",
        "tech": "Node.js, Express, Redis, PostgreSQL",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "Node.js, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITW-IN-10",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-NITW-IN-10",
    "student_id": "STU-NITW-IN-10",
    "studentName": "Meera Nambiar",
    "email": "meera.nambiar@nitw-in.edu",
    "phone": "+91-9876510010",
    "cgpa": 8.75,
    "department": "ECE",
    "campusName": "National Institute of Technology, Warangal",
    "campusLocation": "Warangal, Telangana, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 90,
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Meera_Nambiar_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "ROS2",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "LiDAR",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Autonomous Drone Flight Telemetry & Obstacle Avoidance",
        "tech": "C++, ROS2, Python, LiDAR",
        "link": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "tech": "C++, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-01",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-IITH-IN-01",
    "student_id": "STU-IITH-IN-01",
    "studentName": "Tarun Varma",
    "email": "tarun.varma@iith-in.edu",
    "phone": "+91-9876510011",
    "cgpa": 9.6,
    "department": "CSE",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 96,
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Tarun_Varma_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "CUDA",
        "score": 90
      },
      {
        "name": "LLVM",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Heterogeneous CPU-GPU Tensor Compiler",
        "tech": "C++, CUDA, LLVM, Python",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "C++, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-02",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-IITH-IN-02",
    "student_id": "STU-IITH-IN-02",
    "studentName": "Sneha Iyer",
    "email": "sneha.iyer@iith-in.edu",
    "phone": "+91-9876510012",
    "cgpa": 9.45,
    "department": "AI",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 95,
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Sneha_Iyer_Resume.pdf",
    "matchingSkills": [
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "Computer Vision",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Self-Supervised Vision Transformer for Satellite Imagery",
        "tech": "PyTorch, Computer Vision, Python, Docker",
        "link": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "tech": "PyTorch, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-03",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-IITH-IN-03",
    "student_id": "STU-IITH-IN-03",
    "studentName": "Vikramaditya Rao",
    "email": "vikramaditya.rao@iith-in.edu",
    "phone": "+91-9876510013",
    "cgpa": 9.15,
    "department": "CSE",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "interview",
    "matchScore": 93,
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Vikramaditya_Rao_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C",
        "score": 90
      },
      {
        "name": "eBPF",
        "score": 90
      },
      {
        "name": "Linux Kernel",
        "score": 90
      },
      {
        "name": "Rust",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "High-Throughput Linux Kernel eBPF Packet Filter",
        "tech": "C, eBPF, Linux Kernel, Rust",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "C, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-04",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-IITH-IN-04",
    "student_id": "STU-IITH-IN-04",
    "studentName": "Priya Deshmukh",
    "email": "priya.deshmukh@iith-in.edu",
    "phone": "+91-9876510014",
    "cgpa": 9.3,
    "department": "EE",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 96,
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Priya_Deshmukh_Resume.pdf",
    "matchingSkills": [
      {
        "name": "MATLAB",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "DSP",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "5G Open-RAN Beamforming Channel Simulator",
        "tech": "MATLAB, Python, C++, DSP",
        "link": "https://github.com"
      },
      {
        "title": "EE Applied Capstone Innovation",
        "tech": "MATLAB, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-05",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-IITH-IN-05",
    "student_id": "STU-IITH-IN-05",
    "studentName": "Harshvardhan Patil",
    "email": "harshvardhan.patil@iith-in.edu",
    "phone": "+91-9876510015",
    "cgpa": 9.05,
    "department": "AI",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 94,
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Harshvardhan_Patil_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "Diffusion Models",
        "score": 90
      },
      {
        "name": "CUDA",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Latent Diffusion Model for Super-Resolution",
        "tech": "Python, PyTorch, Diffusion Models, CUDA",
        "link": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-06",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-IITH-IN-06",
    "student_id": "STU-IITH-IN-06",
    "studentName": "Shreya Sen",
    "email": "shreya.sen@iith-in.edu",
    "phone": "+91-9876510016",
    "cgpa": 9.5,
    "department": "CSE",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 99,
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Shreya_Sen_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Rust",
        "score": 90
      },
      {
        "name": "ZK-SNARKs",
        "score": 90
      },
      {
        "name": "Solidity",
        "score": 90
      },
      {
        "name": "Go",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Zero-Knowledge Proof Smart Contract Verifier",
        "tech": "Rust, ZK-SNARKs, Solidity, Go",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Rust, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-07",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-IITH-IN-07",
    "student_id": "STU-IITH-IN-07",
    "studentName": "Ankit Agarwal",
    "email": "ankit.agarwal@iith-in.edu",
    "phone": "+91-9876510017",
    "cgpa": 8.9,
    "department": "EE",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 89,
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Ankit_Agarwal_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "gRPC",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Distributed Micro-Transactions Fault-Tolerant Ledger",
        "tech": "Go, gRPC, PostgreSQL, Docker",
        "link": "https://github.com"
      },
      {
        "title": "EE Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-08",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-IITH-IN-08",
    "student_id": "STU-IITH-IN-08",
    "studentName": "Nidhi Kulkarni",
    "email": "nidhi.kulkarni@iith-in.edu",
    "phone": "+91-9876510018",
    "cgpa": 9.25,
    "department": "AI",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 93,
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Nidhi_Kulkarni_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Verilog",
        "score": 90
      },
      {
        "name": "Vitis AI",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Edge Neural Network Acceleration on FPGA",
        "tech": "Verilog, Vitis AI, Python, PyTorch",
        "link": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "tech": "Verilog, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-09",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-IITH-IN-09",
    "student_id": "STU-IITH-IN-09",
    "studentName": "Devansh Singhal",
    "email": "devansh.singhal@iith-in.edu",
    "phone": "+91-9876510019",
    "cgpa": 9.35,
    "department": "CSE",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 95,
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Devansh_Singhal_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Vector DB",
        "score": 90
      },
      {
        "name": "Redis",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Semantic LLM Context Caching Engine",
        "tech": "Python, Vector DB, Redis, FastAPI",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-IITH-IN-10",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-IITH-IN-10",
    "student_id": "STU-IITH-IN-10",
    "studentName": "Riya Mukherjee",
    "email": "riya.mukherjee@iith-in.edu",
    "phone": "+91-9876510020",
    "cgpa": 9.1,
    "department": "AI",
    "campusName": "Indian Institute of Technology, Hyderabad",
    "campusLocation": "Kandi, Sangareddy, Telangana, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 94,
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Riya_Mukherjee_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "ROS2",
        "score": 90
      },
      {
        "name": "Point Clouds",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Autonomous Vehicle LiDAR Multi-Object Tracking",
        "tech": "Python, C++, ROS2, Point Clouds",
        "link": "https://github.com"
      },
      {
        "title": "AI Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-01",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-BITS-PILANI-01",
    "student_id": "STU-BITS-PILANI-01",
    "studentName": "Kabir Mehrotra",
    "email": "kabir.mehrotra@bits-pilani.edu",
    "phone": "+91-9876510021",
    "cgpa": 9.35,
    "department": "CS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 93,
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Kabir_Mehrotra_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "Lock-Free Queues",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Linux",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "High-Frequency Order Book Matching Engine",
        "tech": "C++, Lock-Free Queues, Python, Linux",
        "link": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "tech": "C++, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-02",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-BITS-PILANI-02",
    "student_id": "STU-BITS-PILANI-02",
    "studentName": "Tanvi Chawla",
    "email": "tanvi.chawla@bits-pilani.edu",
    "phone": "+91-9876510022",
    "cgpa": 8.9,
    "department": "CS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 90,
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Tanvi_Chawla_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "IPFS",
        "score": 90
      },
      {
        "name": "libp2p",
        "score": 90
      },
      {
        "name": "TypeScript",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Decentralized Peer-to-Peer Content Addressable Storage",
        "tech": "Go, IPFS, libp2p, TypeScript",
        "link": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-03",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-BITS-PILANI-03",
    "student_id": "STU-BITS-PILANI-03",
    "studentName": "Pranav Bajaj",
    "email": "pranav.bajaj@bits-pilani.edu",
    "phone": "+91-9876510023",
    "cgpa": 9.1,
    "department": "EEE",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "interview",
    "matchScore": 93,
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Pranav_Bajaj_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Embedded C",
        "score": 90
      },
      {
        "name": "CAN Bus",
        "score": 90
      },
      {
        "name": "MATLAB",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Battery Management System for Electric Vehicles",
        "tech": "Embedded C, CAN Bus, MATLAB, Python",
        "link": "https://github.com"
      },
      {
        "title": "EEE Applied Capstone Innovation",
        "tech": "Embedded C, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-04",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-BITS-PILANI-04",
    "student_id": "STU-BITS-PILANI-04",
    "studentName": "Ishaan Kapoor",
    "email": "ishaan.kapoor@bits-pilani.edu",
    "phone": "+91-9876510024",
    "cgpa": 9.5,
    "department": "CS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 98,
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Ishaan_Kapoor_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Rust",
        "score": 90
      },
      {
        "name": "AVX-512",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "C++",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Embedded Vector Database with SIMD Acceleration",
        "tech": "Rust, AVX-512, Python, C++",
        "link": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "tech": "Rust, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-05",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-BITS-PILANI-05",
    "student_id": "STU-BITS-PILANI-05",
    "studentName": "Rhea Bhatia",
    "email": "rhea.bhatia@bits-pilani.edu",
    "phone": "+91-9876510025",
    "cgpa": 9.2,
    "department": "DS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 96,
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Rhea_Bhatia_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Neo4j",
        "score": 90
      },
      {
        "name": "Kafka",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Realtime Financial Fraud Detection on Graph Streams",
        "tech": "Python, Neo4j, Kafka, PyTorch",
        "link": "https://github.com"
      },
      {
        "title": "DS Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-06",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-BITS-PILANI-06",
    "student_id": "STU-BITS-PILANI-06",
    "studentName": "Rishabh Jain",
    "email": "rishabh.jain@bits-pilani.edu",
    "phone": "+91-9876510026",
    "cgpa": 8.85,
    "department": "CS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 93,
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Rishabh_Jain_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Rust",
        "score": 90
      },
      {
        "name": "Wasm",
        "score": 90
      },
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Web Audio API",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "WebAssembly In-Browser Digital Audio Workstation",
        "tech": "Rust, Wasm, TypeScript, Web Audio API",
        "link": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "tech": "Rust, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-07",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-BITS-PILANI-07",
    "student_id": "STU-BITS-PILANI-07",
    "studentName": "Samaira Khurana",
    "email": "samaira.khurana@bits-pilani.edu",
    "phone": "+91-9876510027",
    "cgpa": 9,
    "department": "CS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 90,
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Samaira_Khurana_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Tree-sitter",
        "score": 90
      },
      {
        "name": "AST",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "AI-Powered Static Code Security Analysis Tool",
        "tech": "Python, Tree-sitter, AST, Docker",
        "link": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-08",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-BITS-PILANI-08",
    "student_id": "STU-BITS-PILANI-08",
    "studentName": "Yashwardhan Goel",
    "email": "yashwardhan.goel@bits-pilani.edu",
    "phone": "+91-9876510028",
    "cgpa": 8.75,
    "department": "EEE",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 88,
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Yashwardhan_Goel_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "TensorFlow",
        "score": 90
      },
      {
        "name": "Timeseries",
        "score": 90
      },
      {
        "name": "SQL",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Smart Grid Renewable Energy Forecasting with GRU",
        "tech": "Python, TensorFlow, Timeseries, SQL",
        "link": "https://github.com"
      },
      {
        "title": "EEE Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-09",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-BITS-PILANI-09",
    "student_id": "STU-BITS-PILANI-09",
    "studentName": "Avani Shah",
    "email": "avani.shah@bits-pilani.edu",
    "phone": "+91-9876510029",
    "cgpa": 9.4,
    "department": "CS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 96,
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Avani_Shah_Resume.pdf",
    "matchingSkills": [
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Node.js",
        "score": 90
      },
      {
        "name": "GraphQL",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Distributed GraphQL Federation Subgraph Gateway",
        "tech": "TypeScript, Node.js, GraphQL, Docker",
        "link": "https://github.com"
      },
      {
        "title": "CS Applied Capstone Innovation",
        "tech": "TypeScript, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-BITS-PILANI-10",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-BITS-PILANI-10",
    "student_id": "STU-BITS-PILANI-10",
    "studentName": "Madhav Rastogi",
    "email": "madhav.rastogi@bits-pilani.edu",
    "phone": "+91-9876510030",
    "cgpa": 9.15,
    "department": "DS",
    "campusName": "Birla Institute of Technology and Science, Pilani",
    "campusLocation": "Pilani, Rajasthan & Hyderabad Campus, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 94,
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Madhav_Rastogi_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Spacy",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Clinical Trial Patient Matching NLP Pipeline",
        "tech": "Python, Spacy, FastAPI, PostgreSQL",
        "link": "https://github.com"
      },
      {
        "title": "DS Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-01",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-NITK-IN-01",
    "student_id": "STU-NITK-IN-01",
    "studentName": "Varun Hegde",
    "email": "varun.hegde@nitk-in.edu",
    "phone": "+91-9876510031",
    "cgpa": 9.25,
    "department": "CSE",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 92,
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Varun_Hegde_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "FFmpeg",
        "score": 90
      },
      {
        "name": "Redis",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Realtime Distributed Video Transcoding CDN",
        "tech": "Go, FFmpeg, Redis, Docker",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-02",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-NITK-IN-02",
    "student_id": "STU-NITK-IN-02",
    "studentName": "Keerthi Bhat",
    "email": "keerthi.bhat@nitk-in.edu",
    "phone": "+91-9876510032",
    "cgpa": 9.4,
    "department": "IT",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 95,
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Keerthi_Bhat_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "Kubernetes Operator",
        "score": 90
      },
      {
        "name": "Prometheus",
        "score": 90
      },
      {
        "name": "Helm",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Cloud Native Multi-Cluster Observability Operator",
        "tech": "Go, Kubernetes Operator, Prometheus, Helm",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-03",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-NITK-IN-03",
    "student_id": "STU-NITK-IN-03",
    "studentName": "Gautam Kamath",
    "email": "gautam.kamath@nitk-in.edu",
    "phone": "+91-9876510033",
    "cgpa": 8.95,
    "department": "CSE",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "interview",
    "matchScore": 91,
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Gautam_Kamath_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Java",
        "score": 90
      },
      {
        "name": "SQL",
        "score": 90
      },
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "Algorithms",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Cost-Based Database Query Planner Optimizer",
        "tech": "Java, SQL, C++, Algorithms",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Java, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-04",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-NITK-IN-04",
    "student_id": "STU-NITK-IN-04",
    "studentName": "Sahana Shetty",
    "email": "sahana.shetty@nitk-in.edu",
    "phone": "+91-9876510034",
    "cgpa": 9.15,
    "department": "AIML",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 94,
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Sahana_Shetty_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Wav2Vec",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "Audio DSP",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "End-to-End Automatic Speech Recognition for Indic Languages",
        "tech": "Python, Wav2Vec, PyTorch, Audio DSP",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-05",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-NITK-IN-05",
    "student_id": "STU-NITK-IN-05",
    "studentName": "Akhil Prabhu",
    "email": "akhil.prabhu@nitk-in.edu",
    "phone": "+91-9876510035",
    "cgpa": 8.8,
    "department": "ECE",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 92,
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Akhil_Prabhu_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Signal Processing",
        "score": 90
      },
      {
        "name": "TensorFlow",
        "score": 90
      },
      {
        "name": "C++",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Marine Underwater Sonar Signal Classifier",
        "tech": "Python, Signal Processing, TensorFlow, C++",
        "link": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-06",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-NITK-IN-06",
    "student_id": "STU-NITK-IN-06",
    "studentName": "Divya Shenoy",
    "email": "divya.shenoy@nitk-in.edu",
    "phone": "+91-9876510036",
    "cgpa": 9.3,
    "department": "CSE",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 98,
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Divya_Shenoy_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Node.js",
        "score": 90
      },
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Redis",
        "score": 90
      },
      {
        "name": "PostgreSQL",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Enterprise Multi-Tenant OAuth2/OIDC Auth Server",
        "tech": "Node.js, TypeScript, Redis, PostgreSQL",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Node.js, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-07",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-NITK-IN-07",
    "student_id": "STU-NITK-IN-07",
    "studentName": "Manjunath Rao",
    "email": "manjunath.rao@nitk-in.edu",
    "phone": "+91-9876510037",
    "cgpa": 8.7,
    "department": "IT",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 87,
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Manjunath_Rao_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "BGP",
        "score": 90
      },
      {
        "name": "DNS",
        "score": 90
      },
      {
        "name": "Linux Networking",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Automated Global Anycast DNS Load Balancer",
        "tech": "Go, BGP, DNS, Linux Networking",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-08",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-NITK-IN-08",
    "student_id": "STU-NITK-IN-08",
    "studentName": "Deepa Nayak",
    "email": "deepa.nayak@nitk-in.edu",
    "phone": "+91-9876510038",
    "cgpa": 9.05,
    "department": "AIML",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 91,
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Deepa_Nayak_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Vision-Language Models",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "DICOM",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Automated Chest X-Ray Pathology Report Generator",
        "tech": "Python, Vision-Language Models, PyTorch, DICOM",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-09",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-NITK-IN-09",
    "student_id": "STU-NITK-IN-09",
    "studentName": "Praveen Pai",
    "email": "praveen.pai@nitk-in.edu",
    "phone": "+91-9876510039",
    "cgpa": 8.85,
    "department": "ECE",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 90,
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Praveen_Pai_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C",
        "score": 90
      },
      {
        "name": "TinyML",
        "score": 90
      },
      {
        "name": "ESP32",
        "score": 90
      },
      {
        "name": "TensorFlow Lite",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Industrial Vibration Anomaly Detection on TinyML",
        "tech": "C, TinyML, ESP32, TensorFlow Lite",
        "link": "https://github.com"
      },
      {
        "title": "ECE Applied Capstone Innovation",
        "tech": "C, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-NITK-IN-10",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-NITK-IN-10",
    "student_id": "STU-NITK-IN-10",
    "studentName": "Anusha Kudva",
    "email": "anusha.kudva@nitk-in.edu",
    "phone": "+91-9876510040",
    "cgpa": 9.5,
    "department": "CSE",
    "campusName": "National Institute of Technology, Surathkal",
    "campusLocation": "Mangalore, Karnataka, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 98,
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Anusha_Kudva_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Rust",
        "score": 90
      },
      {
        "name": "Linux Namespaces",
        "score": 90
      },
      {
        "name": "cgroups",
        "score": 90
      },
      {
        "name": "OCI",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Lightweight Container Isolation Runtime in Rust",
        "tech": "Rust, Linux Namespaces, cgroups, OCI",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Rust, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-01",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-DTU-DELHI-01",
    "student_id": "STU-DTU-DELHI-01",
    "studentName": "Raghav Gupta",
    "email": "raghav.gupta@dtu-delhi.edu",
    "phone": "+91-9876510041",
    "cgpa": 9.1,
    "department": "CSE",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 91,
    "appliedAt": "2026-08-12",
    "resumeUrl": "/resumes/Raghav_Gupta_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "AWS Lambda",
        "score": 90
      },
      {
        "name": "Kafka",
        "score": 90
      },
      {
        "name": "DynamoDB",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "High-Throughput Serverless Event Streaming Broker",
        "tech": "Go, AWS Lambda, Kafka, DynamoDB",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-02",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-DTU-DELHI-02",
    "student_id": "STU-DTU-DELHI-02",
    "studentName": "Muskan Mittal",
    "email": "muskan.mittal@dtu-delhi.edu",
    "phone": "+91-9876510042",
    "cgpa": 9.35,
    "department": "IT",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "shortlisted",
    "matchScore": 94,
    "appliedAt": "2026-08-13",
    "resumeUrl": "/resumes/Muskan_Mittal_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "CUDA",
        "score": 90
      },
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Bioinformatics",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "GPU-Accelerated Genome Sequence Alignment Pipeline",
        "tech": "C++, CUDA, Python, Bioinformatics",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "C++, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-03",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-DTU-DELHI-03",
    "student_id": "STU-DTU-DELHI-03",
    "studentName": "Aryan Tyagi",
    "email": "aryan.tyagi@dtu-delhi.edu",
    "phone": "+91-9876510043",
    "cgpa": 8.9,
    "department": "SE",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "interview",
    "matchScore": 91,
    "appliedAt": "2026-08-14",
    "resumeUrl": "/resumes/Aryan_Tyagi_Resume.pdf",
    "matchingSkills": [
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Node.js",
        "score": 90
      },
      {
        "name": "Babel",
        "score": 90
      },
      {
        "name": "CLI",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "AST-Based Automated Code Refactoring & Security Linter",
        "tech": "TypeScript, Node.js, Babel, CLI",
        "link": "https://github.com"
      },
      {
        "title": "SE Applied Capstone Innovation",
        "tech": "TypeScript, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-04",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-DTU-DELHI-04",
    "student_id": "STU-DTU-DELHI-04",
    "studentName": "Simran Chopra",
    "email": "simran.chopra@dtu-delhi.edu",
    "phone": "+91-9876510044",
    "cgpa": 9.2,
    "department": "CSE",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 95,
    "appliedAt": "2026-08-15",
    "resumeUrl": "/resumes/Simran_Chopra_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "WebGL",
        "score": 90
      },
      {
        "name": "Three.js",
        "score": 90
      },
      {
        "name": "PostGIS",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "3D Geospatial Point Cloud Spatial Indexing Engine",
        "tech": "C++, WebGL, Three.js, PostGIS",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "C++, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-05",
    "opportunityId": "j3",
    "oppId": "j3",
    "studentId": "STU-DTU-DELHI-05",
    "student_id": "STU-DTU-DELHI-05",
    "studentName": "Tushar Bhardwaj",
    "email": "tushar.bhardwaj@dtu-delhi.edu",
    "phone": "+91-9876510045",
    "cgpa": 8.8,
    "department": "AIML",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "AI/ML Research Engineer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 92,
    "appliedAt": "2026-08-16",
    "resumeUrl": "/resumes/Tushar_Bhardwaj_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "LangChain",
        "score": 90
      },
      {
        "name": "Neo4j",
        "score": 90
      },
      {
        "name": "FastAPI",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Enterprise Knowledge Graph RAG Search Engine",
        "tech": "Python, LangChain, Neo4j, FastAPI",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-06",
    "opportunityId": "j4",
    "oppId": "j4",
    "studentId": "STU-DTU-DELHI-06",
    "student_id": "STU-DTU-DELHI-06",
    "studentName": "Akanksha Sethi",
    "email": "akanksha.sethi@dtu-delhi.edu",
    "phone": "+91-9876510046",
    "cgpa": 9,
    "department": "IT",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Frontend Architecture Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 95,
    "appliedAt": "2026-08-17",
    "resumeUrl": "/resumes/Akanksha_Sethi_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "Terraform SDK",
        "score": 90
      },
      {
        "name": "AWS",
        "score": 90
      },
      {
        "name": "Azure",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Declarative Multi-Cloud Infrastructure Synthesizer",
        "tech": "Python, Terraform SDK, AWS, Azure",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-07",
    "opportunityId": "j5",
    "oppId": "j5",
    "studentId": "STU-DTU-DELHI-07",
    "student_id": "STU-DTU-DELHI-07",
    "studentName": "Chirag Bansal",
    "email": "chirag.bansal@dtu-delhi.edu",
    "phone": "+91-9876510047",
    "cgpa": 8.65,
    "department": "SE",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Cloud Infrastructure & DevOps Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 86,
    "appliedAt": "2026-08-18",
    "resumeUrl": "/resumes/Chirag_Bansal_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Go",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      },
      {
        "name": "Kubernetes",
        "score": 90
      },
      {
        "name": "Prometheus",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Microservices Fault Injection & Chaos Testing Harness",
        "tech": "Go, Docker, Kubernetes, Prometheus",
        "link": "https://github.com"
      },
      {
        "title": "SE Applied Capstone Innovation",
        "tech": "Go, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-08",
    "opportunityId": "j6",
    "oppId": "j6",
    "studentId": "STU-DTU-DELHI-08",
    "student_id": "STU-DTU-DELHI-08",
    "studentName": "Sanya Grover",
    "email": "sanya.grover@dtu-delhi.edu",
    "phone": "+91-9876510048",
    "cgpa": 9.45,
    "department": "AIML",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Backend Systems & Distributed Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 95,
    "appliedAt": "2026-08-19",
    "resumeUrl": "/resumes/Sanya_Grover_Resume.pdf",
    "matchingSkills": [
      {
        "name": "Python",
        "score": 90
      },
      {
        "name": "PyTorch",
        "score": 90
      },
      {
        "name": "OpenCV",
        "score": 90
      },
      {
        "name": "Transformers",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Multimodal Video Emotion & Engagement Detection",
        "tech": "Python, PyTorch, OpenCV, Transformers",
        "link": "https://github.com"
      },
      {
        "title": "AIML Applied Capstone Innovation",
        "tech": "Python, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-09",
    "opportunityId": "j1",
    "oppId": "j1",
    "studentId": "STU-DTU-DELHI-09",
    "student_id": "STU-DTU-DELHI-09",
    "studentName": "Uday Aggarwal",
    "email": "uday.aggarwal@dtu-delhi.edu",
    "phone": "+91-9876510049",
    "cgpa": 9.25,
    "department": "CSE",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Software Developer Intern",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 94,
    "appliedAt": "2026-08-20",
    "resumeUrl": "/resumes/Uday_Aggarwal_Resume.pdf",
    "matchingSkills": [
      {
        "name": "C++",
        "score": 90
      },
      {
        "name": "Assembly",
        "score": 90
      },
      {
        "name": "Operating Systems",
        "score": 90
      },
      {
        "name": "Linux",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Lock-Free Memory Allocator for Concurrent Systems",
        "tech": "C++, Assembly, Operating Systems, Linux",
        "link": "https://github.com"
      },
      {
        "title": "CSE Applied Capstone Innovation",
        "tech": "C++, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  },
  {
    "id": "APP-DTU-DELHI-10",
    "opportunityId": "j2",
    "oppId": "j2",
    "studentId": "STU-DTU-DELHI-10",
    "student_id": "STU-DTU-DELHI-10",
    "studentName": "Palak Sharma",
    "email": "palak.sharma@dtu-delhi.edu",
    "phone": "+91-9876510050",
    "cgpa": 8.95,
    "department": "IT",
    "campusName": "Delhi Technological University",
    "campusLocation": "Rohini, New Delhi, India",
    "jobTitle": "Data Analyst & BI Engineer",
    "companyName": "TechNova Inc.",
    "status": "applied",
    "matchScore": 92,
    "appliedAt": "2026-08-21",
    "resumeUrl": "/resumes/Palak_Sharma_Resume.pdf",
    "matchingSkills": [
      {
        "name": "TypeScript",
        "score": 90
      },
      {
        "name": "Jest",
        "score": 90
      },
      {
        "name": "Docker",
        "score": 90
      },
      {
        "name": "CI/CD",
        "score": 90
      }
    ],
    "source": "bridge",
    "projects": [
      {
        "title": "Automated REST & GraphQL API Contract Verification Suite",
        "tech": "TypeScript, Jest, Docker, CI/CD",
        "link": "https://github.com"
      },
      {
        "title": "IT Applied Capstone Innovation",
        "tech": "TypeScript, Cloud APIs, Docker",
        "link": "https://github.com"
      }
    ]
  }
];

export const demoDashboardStats: DashboardStats = {
  activeJobs: 6,
  activeInternships: 2,
  totalApplications: 100,
  shortlistedCandidates: 32,
  interviews: 16,
  hires: 8,
  topSkillsDemand: [
    { skill: 'Python', percentage: 88 },
    { skill: 'React', percentage: 76 },
    { skill: 'SQL', percentage: 74 },
    { skill: 'TypeScript', percentage: 70 },
    { skill: 'Docker', percentage: 65 },
    { skill: 'AWS', percentage: 60 },
    { skill: 'Kubernetes', percentage: 55 }
  ]
};

export function generateMatchResults(opportunityId: string): MatchResult[] {
  const oppApplications = [...demoApplications, ...bridgeApplications].filter(a => a.opportunityId === opportunityId);
  const allCandidatesList = [...demoCandidates, ...bridgeCandidates];

  return oppApplications
    .map(app => {
      const candidate = allCandidatesList.find(c => c.id === app.studentId);
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

      const explanation = matchedCount === totalRequired
        ? `Strong alignment with all ${totalRequired} required skills. Excellent fit for this engineering role.`
        : `Aligns with ${matchedCount} of ${totalRequired} required skills. Review core competencies.`;

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
