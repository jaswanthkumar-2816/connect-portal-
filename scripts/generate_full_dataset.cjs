const fs = require('fs');
const path = require('path');

// ==========================================
// 1. GENERATE 50 HIERO CANDIDATES & APPS
// ==========================================
const hieroNames = [
  { name: 'Aisha Patel', inst: 'IIT Bombay', dept: 'Computer Science & Engineering', role: 'Full Stack & AI Engineer', skills: ['Python', 'React', 'SQL', 'Git', 'AWS', 'Docker'], cgpa: 9.4 },
  { name: 'Vikram Singh', inst: 'IIT Delhi', dept: 'Artificial Intelligence & ML', role: 'Machine Learning Research Engineer', skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL'], cgpa: 9.2 },
  { name: 'Sneha Reddy', inst: 'BITS Pilani', dept: 'Computer Science', role: 'Frontend & UI Architecture Engineer', skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'TailwindCSS'], cgpa: 9.1 },
  { name: 'Rahul Sharma', inst: 'IIT Madras', dept: 'Computer Science & Engineering', role: 'Distributed Systems Architect', skills: ['Go', 'Python', 'Kubernetes', 'gRPC', 'PostgreSQL'], cgpa: 8.8 },
  { name: 'Ananya Verma', inst: 'IIIT Hyderabad', dept: 'Computer Science', role: 'Backend & Cloud Infrastructure Engineer', skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'TypeScript'], cgpa: 9.0 },
  { name: 'Rohan Gupta', inst: 'DTU Delhi', dept: 'Information Technology', role: 'Cloud Platform & DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform'], cgpa: 8.7 },
  { name: 'Meera Iyer', inst: 'NIT Trichy', dept: 'Computer Science', role: 'Full Stack MERN Lead', skills: ['React', 'Node.js', 'SQL', 'Git', 'Python', 'GraphQL'], cgpa: 8.9 },
  { name: 'Karthik Menon', inst: 'IIT Roorkee', dept: 'Computer Science & Engineering', role: 'High Performance Backend Developer', skills: ['Python', 'C++', 'SQL', 'Git', 'PostgreSQL'], cgpa: 9.3 },
  { name: 'Nisha Agarwal', inst: 'IISc Bangalore', dept: 'Artificial Intelligence', role: 'Data Engineering & Analytics Specialist', skills: ['Python', 'SQL', 'AWS', 'Airflow', 'Spark'], cgpa: 9.5 },
  { name: 'Arjun Nair', inst: 'IIT Kharagpur', dept: 'Computer Science', role: 'Computer Vision & Deep Learning Specialist', skills: ['Python', 'PyTorch', 'Computer Vision', 'TensorFlow', 'Docker'], cgpa: 9.6 },
  { name: 'Tanvi Deshmukh', inst: 'COEP Pune', dept: 'Computer Engineering', role: 'Frontend Lead & Accessibility Champion', skills: ['React', 'TypeScript', 'CSS', 'Git', 'TailwindCSS'], cgpa: 8.6 },
  { name: 'Siddharth Rao', inst: 'Manipal Institute', dept: 'Computer Science', role: 'Open Source Systems Developer', skills: ['Python', 'React', 'Git', 'Docker', 'Linux'], cgpa: 8.5 },
  { name: 'Pooja Hegde', inst: 'IIT Guwahati', dept: 'Data Science & AI', role: 'NLP & LLM Applications Engineer', skills: ['Python', 'NLP', 'Transformers', 'FastAPI', 'PyTorch'], cgpa: 9.1 },
  { name: 'Varun Kulkarni', inst: 'NIT Surathkal', dept: 'Information Technology', role: 'Cybersecurity & Cloud Security Analyst', skills: ['Linux', 'Python', 'Cryptography', 'Docker', 'Bash'], cgpa: 8.9 },
  { name: 'Shreya Sen', inst: 'Jadavpur University', dept: 'Computer Science', role: 'Distributed Database Systems Engineer', skills: ['Java', 'Go', 'Distributed Systems', 'SQL', 'Kafka'], cgpa: 9.0 },
  { name: 'Aditya Joshi', inst: 'IIT Kanpur', dept: 'Computer Science', role: 'Compilers & Low-level Systems Engineer', skills: ['C++', 'Rust', 'LLVM', 'Linux', 'Assembly'], cgpa: 9.4 },
  { name: 'Divya Pillai', inst: 'NIT Calicut', dept: 'Computer Science', role: 'Mobile & Cross-Platform UI Specialist', skills: ['React Native', 'Flutter', 'TypeScript', 'Firebase'], cgpa: 8.7 },
  { name: 'Nikhil Bansal', inst: 'NSUT Delhi', dept: 'Computer Engineering', role: 'Full Stack Python & Microservices Dev', skills: ['Python', 'Django', 'React', 'Docker', 'PostgreSQL'], cgpa: 8.8 },
  { name: 'Keerthi Bhat', inst: 'RVCE Bangalore', dept: 'Information Science', role: 'Cloud Infrastructure Automation Dev', skills: ['AWS', 'Terraform', 'Kubernetes', 'Python', 'CI/CD'], cgpa: 8.6 },
  { name: 'Harshvardhan Reddy', inst: 'IIT Hyderabad', dept: 'Computer Science', role: 'High Performance Computing Specialist', skills: ['C++', 'CUDA', 'OpenMP', 'MPI', 'Python'], cgpa: 9.2 },
  { name: 'Riya Mukherjee', inst: 'IIIT Allahabad', dept: 'Information Technology', role: 'Information Security & Cryptography Dev', skills: ['Python', 'C', 'Security Protocols', 'Linux', 'Docker'], cgpa: 9.0 },
  { name: 'Devansh Singhal', inst: 'DTU Delhi', dept: 'Computer Science', role: 'Big Data Processing & ETL Specialist', skills: ['Python', 'Spark', 'Kafka', 'SQL', 'Scala'], cgpa: 8.7 },
  { name: 'Ankit Agarwal', inst: 'IIT BHU Varanasi', dept: 'Computer Science', role: 'Reinforcement Learning Engineer', skills: ['Python', 'PyTorch', 'Reinforcement Learning', 'NumPy'], cgpa: 9.3 },
  { name: 'Nidhi Kulkarni', inst: 'VJTI Mumbai', dept: 'Computer Engineering', role: 'Enterprise Microservices Engineer', skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'], cgpa: 8.9 },
  { name: 'Tarun Varma', inst: 'IIT Indore', dept: 'Computer Science', role: 'Quantum Algorithms & Core DSA Specialist', skills: ['Python', 'C++', 'Algorithms', 'Linear Algebra'], cgpa: 9.1 },
  { name: 'Priya Deshmukh', inst: 'Cummins College Pune', dept: 'Information Technology', role: 'Robotics Perception & Vision Engineer', skills: ['Python', 'OpenCV', 'ROS', 'PyTorch', 'C++'], cgpa: 8.8 },
  { name: 'Kabir Mehrotra', inst: 'BITS Pilani Goa', dept: 'Computer Science', role: 'Decentralized Systems & Smart Contracts Dev', skills: ['Solidity', 'Go', 'Rust', 'TypeScript', 'Node.js'], cgpa: 8.9 },
  { name: 'Tanvi Chawla', inst: 'Thapar University', dept: 'Computer Engineering', role: 'Modern Web & React Ecosystem Engineer', skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'TailwindCSS'], cgpa: 8.5 },
  { name: 'Pranav Bajaj', inst: 'PEC Chandigarh', dept: 'Computer Science', role: 'Cloud Architecture & Reliability Engineer', skills: ['AWS', 'GCP', 'Kubernetes', 'Go', 'Prometheus'], cgpa: 8.7 },
  { name: 'Ishaan Kapoor', inst: 'BITS Hyderabad', dept: 'Computer Science', role: 'Edge Computing & IoT Systems Dev', skills: ['Embedded C', 'Python', 'MQTT', 'Docker', 'Linux'], cgpa: 9.0 },
  { name: 'Rhea Bhatia', inst: 'IGDTUW Delhi', dept: 'Computer Science', role: 'AI Ethics & Data Science Specialist', skills: ['Python', 'R', 'Machine Learning', 'Pandas', 'SQL'], cgpa: 9.2 },
  { name: 'Rishabh Jain', inst: 'IIIT Bangalore', dept: 'Information Technology', role: 'Information Retrieval & Vector Search Dev', skills: ['Python', 'Elasticsearch', 'FastAPI', 'Redis', 'Docker'], cgpa: 9.4 },
  { name: 'Samaira Khurana', inst: 'Ashoka University', dept: 'Computer Science', role: 'Computational Linguistics & NLP Researcher', skills: ['Python', 'PyTorch', 'NLP', 'Transformers', 'FastAPI'], cgpa: 8.8 },
  { name: 'Yashwardhan Goel', inst: 'IIT Gandhinagar', dept: 'Computer Science', role: 'Autonomous Systems & Navigation Dev', skills: ['C++', 'Python', 'ROS2', 'Control Systems', 'LiDAR'], cgpa: 9.1 },
  { name: 'Avani Shah', inst: 'DAIICT Gandhinagar', dept: 'Information & Comm Tech', role: 'Communications & Realtime Streaming Dev', skills: ['WebRTC', 'Go', 'Node.js', 'WebSockets', 'React'], cgpa: 8.9 },
  { name: 'Madhav Rastogi', inst: 'IIT Ropar', dept: 'Computer Science', role: 'Kernel & Operating Systems Engineer', skills: ['C', 'Rust', 'Linux Kernel', 'File Systems', 'Git'], cgpa: 9.3 },
  { name: 'Raghav Gupta', inst: 'DTU Delhi', dept: 'Software Engineering', role: 'Serverless Cloud Architect', skills: ['AWS Lambda', 'Node.js', 'Python', 'DynamoDB', 'Terraform'], cgpa: 8.6 },
  { name: 'Muskan Mittal', inst: 'IIIT Delhi', dept: 'Computer Science & Bio', role: 'Computational Biology & AI Researcher', skills: ['Python', 'Biopython', 'PyTorch', 'R', 'Data Analysis'], cgpa: 9.4 },
  { name: 'Aryan Tyagi', inst: 'IIT Patna', dept: 'Computer Science', role: 'Distributed Consensus & Fault Tolerance Dev', skills: ['Go', 'Raft', 'gRPC', 'Distributed Systems', 'Docker'], cgpa: 9.0 },
  { name: 'Simran Chopra', inst: 'UIET Chandigarh', dept: 'Computer Science', role: 'Modern UI/UX & WebGL Graphics Engineer', skills: ['Three.js', 'React', 'TypeScript', 'GLSL', 'CSS'], cgpa: 8.7 },
  { name: 'Tushar Bhardwaj', inst: 'NIT Warangal', dept: 'Computer Science', role: 'Applied ML & Graph Neural Network Dev', skills: ['Python', 'PyTorch Geometric', 'NetworkX', 'SQL'], cgpa: 9.2 },
  { name: 'Akanksha Sethi', inst: 'NIT Kurukshetra', dept: 'Information Technology', role: 'Full Stack Node/Go Engineer', skills: ['Go', 'Node.js', 'React', 'MongoDB', 'Docker'], cgpa: 8.8 },
  { name: 'Chirag Bansal', inst: 'Jamia Millia Islamia', dept: 'Computer Engineering', role: 'DevSecOps & Automated CI/CD Specialist', skills: ['Jenkins', 'GitHub Actions', 'SonarQube', 'Docker', 'AWS'], cgpa: 8.5 },
  { name: 'Sanya Grover', inst: 'Bennett University', dept: 'Computer Science', role: 'Generative AI & LLM Pipelines Dev', skills: ['LangChain', 'LlamaIndex', 'Python', 'HuggingFace', 'FastAPI'], cgpa: 9.1 },
  { name: 'Uday Aggarwal', inst: 'MSRIT Bangalore', dept: 'Computer Science', role: 'High Throughput Backend Systems (Rust/C++)', skills: ['Rust', 'C++', 'Async I/O', 'PostgreSQL', 'Docker'], cgpa: 9.0 },
  { name: 'Palak Sharma', inst: 'LNMIIT Jaipur', dept: 'Communication & CS', role: 'Cloud Native Observability Specialist', skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Kubernetes', 'Go'], cgpa: 8.7 },
  { name: 'Sahil Narang', inst: 'IIIT Gwalior', dept: 'Information Technology', role: 'Distributed Stream Processing Specialist', skills: ['Apache Flink', 'Kafka', 'Java', 'Python', 'Redis'], cgpa: 8.9 },
  { name: 'Lavanya Sundaram', inst: 'PSG Tech Coimbatore', dept: 'Computer Science', role: 'Deep Learning Model Optimization Lead', skills: ['TensorRT', 'ONNX', 'PyTorch', 'Quantization', 'Python'], cgpa: 9.3 },
  { name: 'Mohit Choudhary', inst: 'IIT Mandi', dept: 'Computer Science', role: 'Applied Cryptography & Privacy Systems Dev', skills: ['Rust', 'Zero-Knowledge Proofs', 'Cryptography', 'Python'], cgpa: 9.2 },
  { name: 'Jaswanth Kumar', inst: 'IIT Madras', dept: 'Computer Science & AI', role: 'AI Career & Skill Gateway Lead Architect', skills: ['Python', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'], cgpa: 9.7 }
];

const jobs = [
  { id: 'j1', title: 'Software Developer Intern', dept: 'Engineering' },
  { id: 'j2', title: 'Data Analyst & BI Engineer', dept: 'Data Science' },
  { id: 'j3', title: 'AI/ML Research Engineer Intern', dept: 'AI Research' },
  { id: 'j4', title: 'Frontend Architecture Engineer', dept: 'Frontend Architecture' },
  { id: 'j5', title: 'Cloud Infrastructure & DevOps Engineer', dept: 'Infrastructure' },
  { id: 'j6', title: 'Backend Systems & Distributed Engineer', dept: 'Core Platform' }
];

const statuses = ['shortlisted', 'applied', 'interview', 'selected', 'under-review'];

const hieroCandidates = hieroNames.map((item, idx) => {
  const id = `s${idx + 1}`;
  const job = jobs[idx % jobs.length];
  return {
    id,
    name: item.name,
    email: `${item.name.toLowerCase().replace(/\s+/g, '.')}@hiero.ai`,
    phone: `+91 98${Math.floor(10000000 + idx * 1793)}`,
    headline: `${item.role} | HIERO Skill Verified`,
    location: `${item.inst.split(' ')[0] === 'IIT' ? item.inst.split(' ')[1] : 'Bangalore'}, India`,
    aboutMe: `High-caliber ${item.role} from ${item.inst} specializing in modern software architecture, robust engineering practices, and verified production delivery.`,
    cgpa: item.cgpa,
    passingYear: 2026,
    score: Math.min(99, Math.floor(item.cgpa * 10) + (idx % 5)),
    resumeUrl: `/resumes/${item.name.replace(/\s+/g, '_')}_Resume_Master.pdf`,
    skills: item.skills.map((s, si) => ({
      name: s,
      competency: Math.max(75, 96 - si * 3),
      verified: true,
      lastAssessedAt: '2026-08-20'
    })),
    education: [
      {
        institution: item.inst,
        degree: 'B.Tech',
        field: item.dept,
        startYear: 2022,
        endYear: 2026,
        cgpa: item.cgpa
      }
    ],
    projects: [
      {
        title: `${item.skills[0]} High-Throughput Service Engine`,
        description: `Architected and benchmarked production microservice with ${item.skills[1]} and sub-50ms latency SLAs.`,
        skills: [item.skills[0], item.skills[1], 'Docker', 'PostgreSQL'],
        url: 'https://github.com'
      },
      {
        title: `Automated ${item.role.split(' ')[0]} Intelligence Platform`,
        description: `Designed and deployed end-to-end verified workflow engine utilizing modern API design and caching layers.`,
        skills: [item.skills[2] || 'SQL', item.skills[0], 'FastAPI', 'Redis'],
        url: 'https://github.com'
      }
    ],
    experience: [
      {
        company: 'TechNova AI Systems',
        role: `${item.role.split(' ')[0]} Engineering Intern`,
        description: `Developed reactive modules, micro-services, and automated testing suites reducing error rate by 35%.`,
        startDate: '2025-05',
        endDate: '2025-08',
        skills: [item.skills[0], item.skills[1]]
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025-11' },
      { name: 'HIERO Verified Specialist', issuer: 'HIERO Talent Platform', date: '2026-02' }
    ],
    authorizedSections: ['all']
  };
});

const hieroApplications = hieroCandidates.map((c, idx) => {
  const job = jobs[idx % jobs.length];
  const st = statuses[idx % statuses.length];
  return {
    id: `a${idx + 1}`,
    opportunityId: job.id,
    studentId: c.id,
    companyId: 'c1',
    companyName: 'TechNova Inc.',
    studentName: c.name,
    email: c.email,
    phone: c.phone,
    cgpa: c.cgpa,
    department: c.education[0].field,
    campusName: c.education[0].institution,
    campusLocation: c.location,
    jobTitle: job.title,
    matchScore: c.score,
    status: st,
    appliedAt: `2026-08-${String(10 + (idx % 20)).padStart(2, '0')}`,
    resumeUrl: c.resumeUrl,
    matchingSkills: c.skills.slice(0, 4).map(s => ({ name: s.name, score: s.competency })),
    source: 'hiero'
  };
});

// ==========================================
// 2. GENERATE 5 BRIDGE COLLEGES & 50 STUDENTS
// ==========================================
const bridgeColleges = [
  {
    id: 'NITW-IN',
    name: 'National Institute of Technology, Warangal',
    code: 'NITW-IN',
    location: 'Warangal, Telangana, India',
    tier: 'Tier-1 Premier Autonomous Institution',
    currentBatch: '2022-2026',
    departments: [
      { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 140 },
      { id: 'AIML', name: 'Artificial Intelligence & Machine Learning', code: 'AIML', totalStudents: 75 },
      { id: 'IT', name: 'Information Technology', code: 'IT', totalStudents: 80 },
      { id: 'ECE', name: 'Electronics & Communication Engineering', code: 'ECE', totalStudents: 120 },
      { id: 'MECH', name: 'Mechanical Engineering', code: 'MECH', totalStudents: 90 }
    ],
    coordinators: [
      { id: 'COORD-01', name: 'Dr. Ramesh Kulkarni', email: 'ramesh.tpo@college.edu', dept: 'Head of Placement' }
    ]
  },
  {
    id: 'IITH-IN',
    name: 'Indian Institute of Technology, Hyderabad',
    code: 'IITH-IN',
    location: 'Kandi, Sangareddy, Telangana, India',
    tier: 'Institute of National Importance (Tier-1)',
    currentBatch: '2022-2026',
    departments: [
      { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 120 },
      { id: 'AI', name: 'Department of Artificial Intelligence', code: 'AI', totalStudents: 60 },
      { id: 'EE', name: 'Electrical Engineering', code: 'EE', totalStudents: 90 }
    ],
    coordinators: [
      { id: 'COORD-02', name: 'Prof. S. Rajagopalan', email: 'rajagopalan.tpo@iith.ac.in', dept: 'Dean of Industrial Relations' }
    ]
  },
  {
    id: 'BITS-PILANI',
    name: 'Birla Institute of Technology and Science, Pilani',
    code: 'BITS-PILANI',
    location: 'Pilani, Rajasthan & Hyderabad Campus, India',
    tier: 'Premier Deemed University & Institution of Eminence',
    currentBatch: '2022-2026',
    departments: [
      { id: 'CS', name: 'Computer Science', code: 'CS', totalStudents: 180 },
      { id: 'EEE', name: 'Electrical & Electronics', code: 'EEE', totalStudents: 150 },
      { id: 'DS', name: 'Data Science & FinTech', code: 'DS', totalStudents: 85 }
    ],
    coordinators: [
      { id: 'COORD-03', name: 'Dr. Manish Kumar', email: 'manish.tpo@pilani.bits-pilani.ac.in', dept: 'Chief Placement Officer' }
    ]
  },
  {
    id: 'NITK-IN',
    name: 'National Institute of Technology, Surathkal',
    code: 'NITK-IN',
    location: 'Mangalore, Karnataka, India',
    tier: 'Institute of National Importance (Tier-1)',
    currentBatch: '2022-2026',
    departments: [
      { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 135 },
      { id: 'IT', name: 'Information Technology', code: 'IT', totalStudents: 85 },
      { id: 'AIML', name: 'Artificial Intelligence', code: 'AIML', totalStudents: 65 }
    ],
    coordinators: [
      { id: 'COORD-04', name: 'Dr. Vijayendra Kumar', email: 'vijayendra.tpo@nitk.edu.in', dept: 'Head, Career Development Centre' }
    ]
  },
  {
    id: 'DTU-DELHI',
    name: 'Delhi Technological University',
    code: 'DTU-DELHI',
    location: 'Rohini, New Delhi, India',
    tier: 'Premier State Technical University',
    currentBatch: '2022-2026',
    departments: [
      { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 220 },
      { id: 'IT', name: 'Information Technology', code: 'IT', totalStudents: 140 },
      { id: 'SE', name: 'Software Engineering', code: 'SE', totalStudents: 110 }
    ],
    coordinators: [
      { id: 'COORD-05', name: 'Prof. Rajesh Rohilla', email: 'rajesh.tpo@dtu.ac.in', dept: 'Head, Training & Placement' }
    ]
  }
];

const collegeStudentNames = {
  'NITW-IN': [
    { name: 'Aarav Sharma', dept: 'CSE', cgpa: 8.85, proj: 'E-Commerce Microservices Engine', skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL'] },
    { name: 'Diya Patel', dept: 'AIML', cgpa: 9.20, proj: 'Brain MRI Tumor Segmentation with 3D U-Net', skills: ['Python', 'PyTorch', 'Computer Vision', 'FastAPI'] },
    { name: 'Rohan Verma', dept: 'CSE', cgpa: 8.10, proj: 'Smart Hospital Patient Queue Management', skills: ['Java', 'Spring Boot', 'React', 'MySQL'] },
    { name: 'Karan Malhotra', dept: 'AIML', cgpa: 8.30, proj: 'Cloud & AI Solutions Optimization Engine', skills: ['Python', 'TensorFlow', 'NLP', 'BERT'] },
    { name: 'Ananya Reddy', dept: 'IT', cgpa: 8.95, proj: 'Collaborative Agile Kanban Cloud Workspace', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'] },
    { name: 'Kavya Nair', dept: 'ECE', cgpa: 8.70, proj: 'Edge AI Thermal Surveillance Camera Network', skills: ['Embedded C', 'Python', 'IoT', 'OpenCV'] },
    { name: 'Aditya Joshi', dept: 'CSE', cgpa: 9.10, proj: 'Distributed Key-Value Store with Raft Consensus', skills: ['Go', 'Docker', 'Raft', 'gRPC'] },
    { name: 'Pooja Hegde', dept: 'AIML', cgpa: 9.40, proj: 'Multilingual Transformer Conversational Chatbot', skills: ['Python', 'Transformers', 'FastAPI', 'PyTorch'] },
    { name: 'Siddharth Roy', dept: 'IT', cgpa: 8.60, proj: 'Realtime Payment Clearing Gateway Sandbox', skills: ['Node.js', 'Express', 'Redis', 'PostgreSQL'] },
    { name: 'Meera Nambiar', dept: 'ECE', cgpa: 8.75, proj: 'Autonomous Drone Flight Telemetry & Obstacle Avoidance', skills: ['C++', 'ROS2', 'Python', 'LiDAR'] }
  ],
  'IITH-IN': [
    { name: 'Tarun Varma', dept: 'CSE', cgpa: 9.60, proj: 'Heterogeneous CPU-GPU Tensor Compiler', skills: ['C++', 'CUDA', 'LLVM', 'Python'] },
    { name: 'Sneha Iyer', dept: 'AI', cgpa: 9.45, proj: 'Self-Supervised Vision Transformer for Satellite Imagery', skills: ['PyTorch', 'Computer Vision', 'Python', 'Docker'] },
    { name: 'Vikramaditya Rao', dept: 'CSE', cgpa: 9.15, proj: 'High-Throughput Linux Kernel eBPF Packet Filter', skills: ['C', 'eBPF', 'Linux Kernel', 'Rust'] },
    { name: 'Priya Deshmukh', dept: 'EE', cgpa: 9.30, proj: '5G Open-RAN Beamforming Channel Simulator', skills: ['MATLAB', 'Python', 'C++', 'DSP'] },
    { name: 'Harshvardhan Patil', dept: 'AI', cgpa: 9.05, proj: 'Latent Diffusion Model for Super-Resolution', skills: ['Python', 'PyTorch', 'Diffusion Models', 'CUDA'] },
    { name: 'Shreya Sen', dept: 'CSE', cgpa: 9.50, proj: 'Zero-Knowledge Proof Smart Contract Verifier', skills: ['Rust', 'ZK-SNARKs', 'Solidity', 'Go'] },
    { name: 'Ankit Agarwal', dept: 'EE', cgpa: 8.90, proj: 'Distributed Micro-Transactions Fault-Tolerant Ledger', skills: ['Go', 'gRPC', 'PostgreSQL', 'Docker'] },
    { name: 'Nidhi Kulkarni', dept: 'AI', cgpa: 9.25, proj: 'Edge Neural Network Acceleration on FPGA', skills: ['Verilog', 'Vitis AI', 'Python', 'PyTorch'] },
    { name: 'Devansh Singhal', dept: 'CSE', cgpa: 9.35, proj: 'Semantic LLM Context Caching Engine', skills: ['Python', 'Vector DB', 'Redis', 'FastAPI'] },
    { name: 'Riya Mukherjee', dept: 'AI', cgpa: 9.10, proj: 'Autonomous Vehicle LiDAR Multi-Object Tracking', skills: ['Python', 'C++', 'ROS2', 'Point Clouds'] }
  ],
  'BITS-PILANI': [
    { name: 'Kabir Mehrotra', dept: 'CS', cgpa: 9.35, proj: 'High-Frequency Order Book Matching Engine', skills: ['C++', 'Lock-Free Queues', 'Python', 'Linux'] },
    { name: 'Tanvi Chawla', dept: 'CS', cgpa: 8.90, proj: 'Decentralized Peer-to-Peer Content Addressable Storage', skills: ['Go', 'IPFS', 'libp2p', 'TypeScript'] },
    { name: 'Pranav Bajaj', dept: 'EEE', cgpa: 9.10, proj: 'Battery Management System for Electric Vehicles', skills: ['Embedded C', 'CAN Bus', 'MATLAB', 'Python'] },
    { name: 'Ishaan Kapoor', dept: 'CS', cgpa: 9.50, proj: 'Embedded Vector Database with SIMD Acceleration', skills: ['Rust', 'AVX-512', 'Python', 'C++'] },
    { name: 'Rhea Bhatia', dept: 'DS', cgpa: 9.20, proj: 'Realtime Financial Fraud Detection on Graph Streams', skills: ['Python', 'Neo4j', 'Kafka', 'PyTorch'] },
    { name: 'Rishabh Jain', dept: 'CS', cgpa: 8.85, proj: 'WebAssembly In-Browser Digital Audio Workstation', skills: ['Rust', 'Wasm', 'TypeScript', 'Web Audio API'] },
    { name: 'Samaira Khurana', dept: 'CS', cgpa: 9.00, proj: 'AI-Powered Static Code Security Analysis Tool', skills: ['Python', 'Tree-sitter', 'AST', 'Docker'] },
    { name: 'Yashwardhan Goel', dept: 'EEE', cgpa: 8.75, proj: 'Smart Grid Renewable Energy Forecasting with GRU', skills: ['Python', 'TensorFlow', 'Timeseries', 'SQL'] },
    { name: 'Avani Shah', dept: 'CS', cgpa: 9.40, proj: 'Distributed GraphQL Federation Subgraph Gateway', skills: ['TypeScript', 'Node.js', 'GraphQL', 'Docker'] },
    { name: 'Madhav Rastogi', dept: 'DS', cgpa: 9.15, proj: 'Clinical Trial Patient Matching NLP Pipeline', skills: ['Python', 'Spacy', 'FastAPI', 'PostgreSQL'] }
  ],
  'NITK-IN': [
    { name: 'Varun Hegde', dept: 'CSE', cgpa: 9.25, proj: 'Realtime Distributed Video Transcoding CDN', skills: ['Go', 'FFmpeg', 'Redis', 'Docker'] },
    { name: 'Keerthi Bhat', dept: 'IT', cgpa: 9.40, proj: 'Cloud Native Multi-Cluster Observability Operator', skills: ['Go', 'Kubernetes Operator', 'Prometheus', 'Helm'] },
    { name: 'Gautam Kamath', dept: 'CSE', cgpa: 8.95, proj: 'Cost-Based Database Query Planner Optimizer', skills: ['Java', 'SQL', 'C++', 'Algorithms'] },
    { name: 'Sahana Shetty', dept: 'AIML', cgpa: 9.15, proj: 'End-to-End Automatic Speech Recognition for Indic Languages', skills: ['Python', 'Wav2Vec', 'PyTorch', 'Audio DSP'] },
    { name: 'Akhil Prabhu', dept: 'ECE', cgpa: 8.80, proj: 'Marine Underwater Sonar Signal Classifier', skills: ['Python', 'Signal Processing', 'TensorFlow', 'C++'] },
    { name: 'Divya Shenoy', dept: 'CSE', cgpa: 9.30, proj: 'Enterprise Multi-Tenant OAuth2/OIDC Auth Server', skills: ['Node.js', 'TypeScript', 'Redis', 'PostgreSQL'] },
    { name: 'Manjunath Rao', dept: 'IT', cgpa: 8.70, proj: 'Automated Global Anycast DNS Load Balancer', skills: ['Go', 'BGP', 'DNS', 'Linux Networking'] },
    { name: 'Deepa Nayak', dept: 'AIML', cgpa: 9.05, proj: 'Automated Chest X-Ray Pathology Report Generator', skills: ['Python', 'Vision-Language Models', 'PyTorch', 'DICOM'] },
    { name: 'Praveen Pai', dept: 'ECE', cgpa: 8.85, proj: 'Industrial Vibration Anomaly Detection on TinyML', skills: ['C', 'TinyML', 'ESP32', 'TensorFlow Lite'] },
    { name: 'Anusha Kudva', dept: 'CSE', cgpa: 9.50, proj: 'Lightweight Container Isolation Runtime in Rust', skills: ['Rust', 'Linux Namespaces', 'cgroups', 'OCI'] }
  ],
  'DTU-DELHI': [
    { name: 'Raghav Gupta', dept: 'CSE', cgpa: 9.10, proj: 'High-Throughput Serverless Event Streaming Broker', skills: ['Go', 'AWS Lambda', 'Kafka', 'DynamoDB'] },
    { name: 'Muskan Mittal', dept: 'IT', cgpa: 9.35, proj: 'GPU-Accelerated Genome Sequence Alignment Pipeline', skills: ['C++', 'CUDA', 'Python', 'Bioinformatics'] },
    { name: 'Aryan Tyagi', dept: 'SE', cgpa: 8.90, proj: 'AST-Based Automated Code Refactoring & Security Linter', skills: ['TypeScript', 'Node.js', 'Babel', 'CLI'] },
    { name: 'Simran Chopra', dept: 'CSE', cgpa: 9.20, proj: '3D Geospatial Point Cloud Spatial Indexing Engine', skills: ['C++', 'WebGL', 'Three.js', 'PostGIS'] },
    { name: 'Tushar Bhardwaj', dept: 'AIML', cgpa: 8.80, proj: 'Enterprise Knowledge Graph RAG Search Engine', skills: ['Python', 'LangChain', 'Neo4j', 'FastAPI'] },
    { name: 'Akanksha Sethi', dept: 'IT', cgpa: 9.00, proj: 'Declarative Multi-Cloud Infrastructure Synthesizer', skills: ['Python', 'Terraform SDK', 'AWS', 'Azure'] },
    { name: 'Chirag Bansal', dept: 'SE', cgpa: 8.65, proj: 'Microservices Fault Injection & Chaos Testing Harness', skills: ['Go', 'Docker', 'Kubernetes', 'Prometheus'] },
    { name: 'Sanya Grover', dept: 'AIML', cgpa: 9.45, proj: 'Multimodal Video Emotion & Engagement Detection', skills: ['Python', 'PyTorch', 'OpenCV', 'Transformers'] },
    { name: 'Uday Aggarwal', dept: 'CSE', cgpa: 9.25, proj: 'Lock-Free Memory Allocator for Concurrent Systems', skills: ['C++', 'Assembly', 'Operating Systems', 'Linux'] },
    { name: 'Palak Sharma', dept: 'IT', cgpa: 8.95, proj: 'Automated REST & GraphQL API Contract Verification Suite', skills: ['TypeScript', 'Jest', 'Docker', 'CI/CD'] }
  ]
};

let allBridgeStudents = [];
let allBridgeApps = [];
let globalStuIdx = 1;

bridgeColleges.forEach(college => {
  const studentsList = collegeStudentNames[college.id] || [];
  college.totalStudents = studentsList.length;
  college.totalApplications = studentsList.length;

  studentsList.forEach((s, sIdx) => {
    const studentId = `STU-${college.id}-${String(sIdx + 1).padStart(2, '0')}`;
    const appId = `APP-${college.id}-${String(sIdx + 1).padStart(2, '0')}`;
    const job = jobs[(globalStuIdx - 1) % jobs.length];

    const studentObj = {
      id: studentId,
      regNo: `2022${s.dept}${String(10 + sIdx).padStart(3, '0')}`,
      name: s.name,
      department: s.dept,
      academicYear: '2022-2026',
      cgpa: s.cgpa,
      email: `${s.name.toLowerCase().replace(/\s+/g, '.')}@${college.id.toLowerCase()}.edu`,
      phone: `+91-98765${String(10000 + globalStuIdx)}`,
      skills: s.skills,
      projectCount: 2,
      projects: [
        { title: s.proj, tech: s.skills.join(', '), link: 'https://github.com' },
        { title: `${s.dept} Applied Capstone Innovation`, tech: `${s.skills[0]}, Cloud APIs, Docker`, link: 'https://github.com' }
      ],
      certifications: [`${college.name} Certified Honours Scholar`, 'AWS Cloud Practitioner'],
      resumeUrl: `/resumes/${s.name.replace(/\s+/g, '_')}_Resume.pdf`,
      placementStatus: sIdx === 0 ? 'Placed' : 'Active',
      verificationStatus: 'Verified',
      avatar: s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      campusCode: college.code,
      campusName: college.name,
      campusLocation: college.location
    };

    allBridgeStudents.push(studentObj);

    const appObj = {
      id: appId,
      opportunityId: job.id,
      oppId: job.id,
      studentId: studentId,
      student_id: studentId,
      studentName: s.name,
      email: studentObj.email,
      phone: studentObj.phone,
      cgpa: s.cgpa,
      department: s.dept,
      campusName: college.name,
      campusLocation: college.location,
      jobTitle: job.title,
      companyName: 'TechNova Inc.',
      status: (sIdx === 0 || sIdx === 1) ? 'shortlisted' : sIdx === 2 ? 'interview' : 'applied',
      matchScore: Math.min(99, Math.floor(s.cgpa * 10) + (sIdx % 6)),
      appliedAt: `2026-08-${String(12 + (sIdx % 15)).padStart(2, '0')}`,
      resumeUrl: studentObj.resumeUrl,
      matchingSkills: s.skills.map(sk => ({ name: sk, score: 90 })),
      source: 'bridge',
      projects: studentObj.projects
    };

    allBridgeApps.push(appObj);
    globalStuIdx++;
  });
});

// Output bridge-database.json
const bridgeDbPath = path.join(__dirname, '../../Bidge-Portal/backend/data/bridge-database.json');
const bridgeDbData = {
  colleges: bridgeColleges,
  college: bridgeColleges[0],
  students: allBridgeStudents,
  opportunities: jobs.map(j => ({
    id: j.id,
    title: j.title,
    company: 'TechNova Inc.',
    location: 'Bangalore / Hybrid',
    ctc: '₹25,00,000 PA',
    minCGPA: 8.0,
    academicYear: '2022-2026',
    requiredSkills: ['Python', 'SQL', 'React', 'Docker'],
    preferredSkills: ['Kubernetes', 'Cloud'],
    state: 'ACTIVE'
  })),
  applications: allBridgeApps
};

fs.writeFileSync(bridgeDbPath, JSON.stringify(bridgeDbData, null, 2), 'utf-8');
console.log('✅ Updated bridge-database.json');

// Write generated data to demo.ts
const demoTsContent = `// ============================================================
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
export const demoCandidates: Candidate[] = ${JSON.stringify(hieroCandidates, null, 2)};

// --- 50 HIERO Applications ---
export const demoApplications: Application[] = ${JSON.stringify(hieroApplications, null, 2)};

// --- 50 Bridge Students mapped to Candidate format ---
export const bridgeCandidates: Candidate[] = ${JSON.stringify(
  allBridgeStudents.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    headline: `${s.department} Student · ${s.campusName}`,
    location: s.campusLocation,
    aboutMe: `Verified campus placement candidate from ${s.campusName} (${s.department}) with active project portfolio and ${s.cgpa} CGPA.`,
    cgpa: s.cgpa,
    passingYear: 2026,
    score: Math.min(99, Math.floor(s.cgpa * 10) + 4),
    resumeUrl: s.resumeUrl,
    skills: s.skills.map(sk => ({
      name: sk,
      competency: 90,
      verified: true,
      lastAssessedAt: '2026-08-20'
    })),
    education: [
      {
        institution: s.campusName,
        degree: 'B.Tech',
        field: s.department,
        startYear: 2022,
        endYear: 2026,
        cgpa: s.cgpa
      }
    ],
    projects: s.projects.map(p => ({
      title: p.title,
      description: `Implementation of ${p.title} using ${p.tech}.`,
      skills: p.tech.split(',').map(t => t.trim()),
      url: p.link
    })),
    experience: [
      {
        company: s.campusName + ' Research Lab',
        role: 'Academic Engineering Researcher',
        description: 'Collaborated on departmental engineering innovation and laboratory testbed benchmarking.',
        startDate: '2025-06',
        endDate: '2025-08',
        skills: s.skills.slice(0, 2)
      }
    ],
    certifications: s.certifications.map(c => ({
      name: c,
      issuer: s.campusName,
      date: '2026'
    })),
    authorizedSections: ['all']
  })),
  null,
  2
)};

// --- 50 Bridge Applications ---
export const bridgeApplications: Application[] = ${JSON.stringify(allBridgeApps, null, 2)};

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
      const strengths = skillMatches.filter(s => s.score >= 80).map(s => \`\${s.name} (\${s.score}%)\`);
      const gaps = skillMatches.filter(s => s.score < 60).map(s => \`\${s.name} (\${s.score}%)\`);

      const explanation = matchedCount === totalRequired
        ? \`Strong alignment with all \${totalRequired} required skills. Excellent fit for this engineering role.\`
        : \`Aligns with \${matchedCount} of \${totalRequired} required skills. Review core competencies.\`;

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
`;

const demoTsPath = path.join(__dirname, '../src/data/demo.ts');
fs.writeFileSync(demoTsPath, demoTsContent, 'utf-8');
console.log('✅ Updated demo.ts with 50 HIERO candidates & 50 Bridge students');
