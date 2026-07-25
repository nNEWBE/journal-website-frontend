import { type Role } from "./data";

export interface User {
  email: string;
  name: string;
  role: Role;
  title: string;
  department?: string;
  avatar?: string;
}

export const DEMO_USERS: User[] = [
  {
    email: "superadmin@gonouniversity.edu.bd",
    name: "Prof. Dr. Laila Rahman",
    role: "super-admin",
    title: "Editor-in-Chief & Administrator",
    department: "Faculty of Health Sciences",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    email: "admin@gonouniversity.edu.bd",
    name: "Md. Jamil Hossain",
    role: "admin",
    title: "System Administrator",
    department: "Journal Operations",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    email: "editor@gonouniversity.edu.bd",
    name: "Prof. Saiful Islam",
    role: "editor",
    title: "Managing Editor",
    department: "Department of Pharmacy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    email: "reviewer@gonouniversity.edu.bd",
    name: "Dr. Salma Khatun",
    role: "reviewer",
    title: "Peer Reviewer",
    department: "Department of Microbiology",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
  },
  {
    email: "author@gonouniversity.edu.bd",
    name: "Ayesha Siddique",
    role: "author",
    title: "Researcher",
    department: "Department of Public Health",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
];

const SESSION_KEY = "gb_journal_user_session";

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    console.error("Failed to retrieve auth session", e);
    return null;
  }
}

export function setSession(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to store auth session", e);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("Failed to clear auth session", e);
  }
}

export function authenticate(email: string, password: string): User | null {
  if (password !== "demopass") return null;
  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (user) {
    setSession(user);
    return user;
  }
  return null;
}
