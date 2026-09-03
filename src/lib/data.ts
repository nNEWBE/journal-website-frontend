import {
  Archive,
  BookOpen,
  ClipboardCheck,
  Crown,
  FileCheck2,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export type Role = "author" | "reviewer" | "editor" | "admin" | "super-admin";

export type Article = {
  id: string;
  slug: string;
  title: string;
  type: string;
  topic: string;
  department: string;
  authors: string[];
  abstract: string;
  issue: string;
  volume: string;
  pages: string;
  doi: string;
  publishedAt: string;
  metrics: { views: number; downloads: number; citations: number };
  keywords: string[];
  sections: { heading: string; body: string }[];
  image?: string;
  pdf?: string;
};

export type Submission = {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
  editor: string;
  reviewers: string[];
  updated: string;
  due: string;
  score: number;
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/issues/current", label: "Current Issue" },
  { href: "/articles", label: "Articles" },
  { href: "/issues", label: "Issues" },
  { href: "/authors", label: "For Authors" },
  { href: "/contact", label: "Contact" },
];

export const roles: { id: Role; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "author", label: "Author", icon: PenLine },
  { id: "reviewer", label: "Reviewer", icon: UserCheck },
  { id: "editor", label: "Editor", icon: ClipboardCheck },
  { id: "admin", label: "Admin", icon: ShieldCheck },
  { id: "super-admin", label: "Super Admin", icon: Crown },
];

export const topics = [
  "Public Health",
  "Pharmacy",
  "Medical Sciences",
  "Veterinary Sciences",
  "Social Sciences",
  "Law and Governance",
  "Agriculture",
  "Technology",
];

export const articleTypes = [
  "Research Article",
  "Review Article",
  "Case Study",
  "Short Communication",
  "Perspective",
  "Editorial",
  "Letter",
  "Policy Brief",
];

export const articles: Article[] = [
  {
    id: "ART-2026-001",
    slug: "community-healthcare-access-savar",
    title:
      "Community healthcare access patterns around Savar: A mixed-method university catchment study",
    type: "Research Article",
    topic: "Public Health",
    department: "Faculty of Health Sciences",
    authors: ["Dr. Farhana Rahman", "Md. Jamil Hossain", "Nusrat A. Karim"],
    abstract:
      "This study maps healthcare access, referral barriers, and household-level service confidence across communities surrounding the Gono Bishwabidyalay catchment area.",
    issue: "Issue 2",
    volume: "Volume 4",
    pages: "11-28",
    doi: "10.5555/gbj.2026.001",
    publishedAt: "July 2026",
    metrics: { views: 2840, downloads: 731, citations: 12 },
    keywords: ["community health", "primary care", "Bangladesh", "Savar"],
    sections: [
      {
        heading: "Abstract",
        body: "A community-focused survey and interview program identified practical barriers in transport, appointment literacy, referral follow-up, and health information trust. The findings support a university-led outreach model with stronger continuity between campus clinics and local health actors.",
      },
      {
        heading: "Key points",
        body: "Patients valued proximity and known providers, but referral complexity reduced timely care. Mobile reminders, community health volunteers, and shared referral notes were repeatedly identified as practical interventions.",
      },
      {
        heading: "Methods",
        body: "The study combined structured household surveys with semi-structured interviews. Responses were coded by access theme and compared across age, gender, income, and previous university clinic contact.",
      },
      {
        heading: "Conclusion",
        body: "University-based health systems can become trusted local bridges when referral support, appointment guidance, and follow-up communication are designed as part of the care journey.",
      },
    ],
    image: "/covers/medical.png",
    pdf: "/pdfs/community-healthcare-access-savar.pdf",
  },
  {
    id: "ART-2026-002",
    slug: "pharmacy-practice-antimicrobial-stewardship",
    title:
      "Pharmacy practice readiness for antimicrobial stewardship in teaching settings",
    type: "Review Article",
    topic: "Pharmacy",
    department: "Department of Pharmacy",
    authors: ["Prof. Saiful Islam", "Tania Sultana"],
    abstract:
      "A review of stewardship education, dispensing governance, and clinical collaboration models for pharmacy students and teaching pharmacies.",
    issue: "Issue 2",
    volume: "Volume 4",
    pages: "29-44",
    doi: "10.5555/gbj.2026.002",
    publishedAt: "July 2026",
    metrics: { views: 1935, downloads: 502, citations: 8 },
    keywords: ["pharmacy", "antimicrobial stewardship", "education"],
    sections: [
      {
        heading: "Abstract",
        body: "Teaching pharmacies can support antimicrobial stewardship by combining curriculum, dispensing audits, and physician-pharmacist collaboration. This review synthesizes practical implementation requirements for Bangladeshi university settings.",
      },
      {
        heading: "Practice implications",
        body: "The most feasible early interventions are student-led counseling checklists, prescription review simulations, and supervised community awareness activities.",
      },
      {
        heading: "Conclusion",
        body: "Stewardship should be treated as an applied professional habit, not a late-stage theoretical topic.",
      },
    ],
    image: "/covers/pharmacy.png",
    pdf: "/pdfs/pharmacy-practice-antimicrobial-stewardship.pdf",
  },
  {
    id: "ART-2026-003",
    slug: "climate-resilient-agriculture-manifolds",
    title:
      "Climate-resilient smallholder agriculture: Field observations from central Bangladesh",
    type: "Case Study",
    topic: "Agriculture",
    department: "Faculty of Agriculture",
    authors: ["Dr. Mahbub Alam", "Sharmin Jahan"],
    abstract:
      "A field case study documents practical adaptation strategies used by smallholder farming communities under changing rainfall patterns.",
    issue: "Issue 2",
    volume: "Volume 4",
    pages: "45-59",
    doi: "10.5555/gbj.2026.003",
    publishedAt: "July 2026",
    metrics: { views: 1430, downloads: 378, citations: 6 },
    keywords: ["climate", "agriculture", "adaptation"],
    sections: [
      {
        heading: "Abstract",
        body: "Farmers combine crop diversification, local seed exchange, water retention, and cooperative labor to reduce seasonal uncertainty. The case highlights the importance of institutional support for local experimentation.",
      },
      {
        heading: "Field observations",
        body: "Participants emphasized practical risk-sharing, short-cycle crops, and the value of local knowledge networks in deciding when to plant or delay.",
      },
      {
        heading: "Conclusion",
        body: "Climate resilience depends on both agronomic technique and the social infrastructure that helps farmers act on time.",
      },
    ],
    image: "/covers/agriculture.png",
    pdf: "/pdfs/climate-resilient-agriculture-manifolds.pdf",
  },
  {
    id: "ART-2026-004",
    slug: "legal-aid-university-clinic",
    title:
      "University legal aid clinics and access to justice: A governance perspective",
    type: "Perspective",
    topic: "Law and Governance",
    department: "Department of Law",
    authors: ["Dr. Rehana Akter"],
    abstract:
      "This perspective argues for structured legal aid clinics as both a pedagogical model and a public-interest service pathway.",
    issue: "Issue 1",
    volume: "Volume 4",
    pages: "71-82",
    doi: "10.5555/gbj.2026.004",
    publishedAt: "January 2026",
    metrics: { views: 990, downloads: 221, citations: 3 },
    keywords: ["law clinic", "governance", "access to justice"],
    sections: [
      {
        heading: "Abstract",
        body: "Legal aid clinics can translate classroom learning into supervised public service. The model requires confidentiality rules, referral protocols, and careful case supervision.",
      },
      {
        heading: "Governance model",
        body: "A clinic charter, faculty supervision board, student ethics agreement, and external partner network create the minimum structure for responsible operation.",
      },
      {
        heading: "Conclusion",
        body: "A university clinic can become a trusted access point when education, ethics, and public service are designed together.",
      },
    ],
    image: "/covers/law.png",
    pdf: "/pdfs/legal-aid-university-clinic.pdf",
  },
  {
    id: "ART-2026-005",
    slug: "ai-assisted-learning-private-universities",
    title:
      "AI-assisted learning in private universities: Student confidence, risk, and academic integrity",
    type: "Research Article",
    topic: "Technology",
    department: "Center for Teaching and Learning",
    authors: ["Md. Rafiq Hasan", "Samia Noor", "Dr. Arup Chandra"],
    abstract:
      "A cross-sectional study of student use of AI tools, perceived learning benefit, and uncertainty around academic integrity expectations.",
    issue: "Issue 1",
    volume: "Volume 4",
    pages: "83-101",
    doi: "10.5555/gbj.2026.005",
    publishedAt: "January 2026",
    metrics: { views: 3120, downloads: 814, citations: 18 },
    keywords: ["AI", "higher education", "academic integrity"],
    sections: [
      {
        heading: "Abstract",
        body: "Students reported high experimentation with AI tools but uneven confidence in citation, disclosure, and acceptable use. Clear policy examples were preferred over general warnings.",
      },
      {
        heading: "Findings",
        body: "The strongest predictor of responsible use was not technical confidence but whether instructors provided task-specific boundaries.",
      },
      {
        heading: "Conclusion",
        body: "Academic integrity policy should be course-visible, example-driven, and paired with learning design rather than punishment alone.",
      },
    ],
    image: "/covers/technology.png",
    pdf: "/pdfs/ai-assisted-learning-private-universities.pdf",
  },
];

export const issues = [
  {
    id: "2026-2",
    year: "2026",
    volume: "Volume 4",
    issue: "Issue 2",
    month: "July 2026",
    theme: "Community Health, Stewardship, and Resilient Systems",
    articleCount: 9,
    articles: articles.slice(0, 3),
  },
  {
    id: "2026-1",
    year: "2026",
    volume: "Volume 4",
    issue: "Issue 1",
    month: "January 2026",
    theme: "Governance, Learning, and Social Transformation",
    articleCount: 11,
    articles: articles.slice(3, 5),
  },
  {
    id: "2025-2",
    year: "2025",
    volume: "Volume 3",
    issue: "Issue 2",
    month: "July 2025",
    theme: "Applied Research for Local Development",
    articleCount: 12,
    articles: [],
  },
  {
    id: "2025-1",
    year: "2025",
    volume: "Volume 3",
    issue: "Issue 1",
    month: "January 2025",
    theme: "Teaching, Practice, and Public Service",
    articleCount: 10,
    articles: [],
  },
];

export const submissions: Submission[] = [
  {
    id: "GBJ-2026-104",
    title: "Mental health service confidence among first-year university students",
    type: "Research Article",
    author: "Ayesha Siddique",
    status: "Under Review",
    editor: "Dr. Mahfuz Karim",
    reviewers: ["Dr. Nasima Begum", "Prof. Omar Faruk"],
    updated: "2 hours ago",
    due: "2026-07-12",
    score: 86,
  },
  {
    id: "GBJ-2026-103",
    title: "Veterinary teleconsultation readiness in peri-urban farms",
    type: "Short Communication",
    author: "Tanvir Ahmed",
    status: "Revision Requested",
    editor: "Dr. Nusrat Jahan",
    reviewers: ["Dr. Rezaul Amin"],
    updated: "Yesterday",
    due: "2026-07-18",
    score: 74,
  },
  {
    id: "GBJ-2026-102",
    title: "Student legal awareness and campus-based mediation",
    type: "Perspective",
    author: "Mahdia Rahman",
    status: "Awaiting Editor",
    editor: "Unassigned",
    reviewers: [],
    updated: "3 days ago",
    due: "2026-07-20",
    score: 62,
  },
  {
    id: "GBJ-2026-101",
    title: "Medicinal plant documentation in Savar community practice",
    type: "Review Article",
    author: "Fahim Hossain",
    status: "Accepted",
    editor: "Prof. Saiful Islam",
    reviewers: ["Dr. Shaila Akter", "Dr. Mizanur Rahman"],
    updated: "1 week ago",
    due: "2026-07-09",
    score: 92,
  },
];

export const dashboardStats = [
  { label: "Live submissions", value: "128", icon: LayoutDashboard },
  { label: "Under review", value: "43", icon: ClipboardCheck },
  { label: "Accepted this issue", value: "16", icon: FileCheck2 },
  { label: "Archive articles", value: "286", icon: Archive },
  { label: "Active reviewers", value: "74", icon: UserCheck },
  { label: "Published issues", value: "22", icon: BookOpen },
];

export type BoardMember = {
  id?: string | number;
  userId?: string | number;
  email?: string;
  name: string;
  role: string;
  unit?: string;
  title?: string;
  designation?: string;
  affiliation?: string;
  institution?: string;
  expertise?: string;
  bio?: string;
  image?: string;
  avatarUrl?: string;
};

export const boardMembers: BoardMember[] = [
  {
    id: "board-1",
    name: "Prof. Dr. Laila Rahman",
    role: "Editor-in-Chief",
    unit: "Faculty of Health & Medical Sciences",
    expertise: "Public health, community medicine, maternal & child health",
    institution: "Gono Bishwabidyalay",
    title: "Professor of Community Medicine",
    bio: "Dedicated to advancing community-centered health interventions, rural healthcare access, and rigorous double-blind peer review.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-2",
    name: "Prof. Saiful Islam",
    role: "Managing Editor",
    unit: "Department of Pharmacy",
    expertise: "Antimicrobial stewardship, pharmacokinetics, pharmaceutical quality",
    institution: "Gono Bishwabidyalay",
    title: "Professor of Pharmacy",
    bio: "Focuses on clinical therapeutics, drug development protocols, and transparent editorial workflow management.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-3",
    name: "Dr. Rehana Akter",
    role: "Section Editor",
    unit: "Department of Law & Governance",
    expertise: "Health law, human rights, institutional governance, bioethics",
    institution: "Gono Bishwabidyalay",
    title: "Associate Professor of Law",
    bio: "Specializes in healthcare compliance, intellectual property in research, and publication ethics.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-4",
    name: "Dr. Mahbub Alam",
    role: "Section Editor",
    unit: "Faculty of Agriculture & Environmental Sciences",
    expertise: "Climate adaptation, smallholder farming, soil salinity, agro-ecology",
    institution: "Gono Bishwabidyalay",
    title: "Associate Professor of Agriculture",
    bio: "Researches resilient agriculture, sustainable crop genetics, and ecological preservation in South Asia.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-5",
    name: "Dr. Farhana Yasmin",
    role: "Section Editor",
    unit: "Department of Microbiology & Biotechnology",
    expertise: "Molecular diagnostics, infectious disease epidemiology, genomics",
    institution: "Gono Bishwabidyalay",
    title: "Associate Professor of Microbiology",
    bio: "Oversees submissions in cellular biology, antimicrobial resistance pathways, and molecular therapeutics.",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-6",
    name: "Dr. Tariqul Islam",
    role: "Section Editor",
    unit: "Department of Computer Science & Engineering",
    expertise: "Medical image processing, AI in healthcare, scientific computing",
    institution: "Gono Bishwabidyalay",
    title: "Associate Professor of CSE",
    bio: "Evaluates machine learning applications in biomedical diagnostics, sensor networks, and algorithm optimization.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-7",
    name: "Dr. Nusrat Jahan",
    role: "Section Editor",
    unit: "Faculty of Veterinary & Animal Sciences",
    expertise: "Zoonotic epidemiology, veterinary pathology, animal nutrition",
    institution: "Gono Bishwabidyalay",
    title: "Associate Professor of Veterinary Sciences",
    bio: "Leads peer appraisal in livestock health, zoonotic cross-species transmission, and animal pharmacology.",
    image: "https://images.unsplash.com/photo-1594824813591-28562d5a3f12?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "board-8",
    name: "Dr. Kabir Hossain",
    role: "Section Editor",
    unit: "Department of Sociology & Social Work",
    expertise: "Rural social dynamics, poverty alleviation, health policy advocacy",
    institution: "Gono Bishwabidyalay",
    title: "Associate Professor of Social Sciences",
    bio: "Focuses on socio-economic impact assessments, public welfare distribution, and community empowerment models.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  },
];

export interface AdvisoryMember {
  id: string;
  name: string;
  role: string;
  institution: string;
  country: string;
  field: string;
  image?: string;
}

export const advisoryCouncil: AdvisoryMember[] = [
  {
    id: "adv-1",
    name: "Prof. Dr. Christopher Evans",
    role: "International Advisory Member",
    institution: "University of Edinburgh",
    country: "United Kingdom",
    field: "Global Health & Epidemiology",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "adv-2",
    name: "Prof. Dr. Anisur Rahman",
    role: "Senior Academic Advisor",
    institution: "Dhaka University",
    country: "Bangladesh",
    field: "Pharmaceutical Sciences",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "adv-3",
    name: "Prof. Dr. Hiroshi Tanaka",
    role: "International Advisory Member",
    institution: "Kyoto University",
    country: "Japan",
    field: "Biotechnology & Plant Genetics",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "adv-4",
    name: "Dr. Meenakshi Sundaram",
    role: "Regional Advisory Member",
    institution: "All India Institute of Medical Sciences (AIIMS)",
    country: "India",
    field: "Community Health & Clinical Medicine",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
  },
];

export const policies = [
  "Double-blind peer review for research and review articles",
  "Mandatory conflict of interest, funding, ethics, and AI-use declarations",
  "Plagiarism screening before editorial assignment",
  "Transparent correction, retraction, and expression-of-concern workflow",
  "Open access publication model with author-retained copyright",
  "Reviewer confidentiality and conflict disclosure requirements",
];

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function filterArticles(query: string, type: string, topic: string) {
  const normalized = query.toLowerCase();
  return articles.filter((article) => {
    const matchesQuery =
      !normalized ||
      article.title.toLowerCase().includes(normalized) ||
      article.abstract.toLowerCase().includes(normalized) ||
      article.authors.join(" ").toLowerCase().includes(normalized) ||
      article.keywords.join(" ").toLowerCase().includes(normalized);
    const matchesType = !type || article.type === type;
    const matchesTopic = !topic || article.topic === topic;
    return matchesQuery && matchesType && matchesTopic;
  });
}
