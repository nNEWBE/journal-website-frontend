import {
  AlertCircle, Archive, ArrowUpRight, Award, BadgeCheck, BarChart3, BookOpen, Bookmark, Brain,
  Briefcase, Building, Building2, Calendar, CalendarDays, Check, CheckCircle2, ClipboardCheck,
  ClipboardList, Clock, Cog, Compass, Cpu, Download, ExternalLink, Eye, Feather, FileCheck,
  FileCheck2, FileQuestion, FileSearch, FileText, Flame, FlaskConical, FolderOpen, Gavel, Globe,
  Globe2, GraduationCap, Hash, HeartPulse, HelpCircle, Home, Info, Landmark, Layers, Library, Link2,
  List, Lock, LockKeyhole, LockOpen, Mail, MapPin, MessageSquare, MessageSquareText,
  MessageSquareWarning, Newspaper, PawPrint, PenLine, Phone, Pill, Quote, Scale, Search, SearchCheck,
  Send, Share2, Shield, ShieldCheck, ShieldPlus, Sliders, Sprout, Star, Stethoscope, Tag, Timer,
  TrendingUp, UploadCloud, User, UserCheck, Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons an admin can reference by name from CMS meta (e.g. `"icon": "ShieldCheck"`).
 * Components should always pass a fallback so unknown names keep the original icon.
 */
export const CMS_ICONS: Record<string, LucideIcon> = {
  AlertCircle, Archive, ArrowUpRight, Award, BadgeCheck, BarChart3, BookOpen, Bookmark, Brain,
  Briefcase, Building, Building2, Calendar, CalendarDays, Check, CheckCircle2, ClipboardCheck,
  ClipboardList, Clock, Cog, Compass, Cpu, Download, ExternalLink, Eye, Feather, FileCheck,
  FileCheck2, FileQuestion, FileSearch, FileText, Flame, FlaskConical, FolderOpen, Gavel, Globe,
  Globe2, GraduationCap, Hash, HeartPulse, HelpCircle, Home, Info, Landmark, Layers, Library, Link2,
  List, Lock, LockKeyhole, LockOpen, Mail, MapPin, MessageSquare, MessageSquareText,
  MessageSquareWarning, Newspaper, PawPrint, PenLine, Phone, Pill, Quote, Scale, Search, SearchCheck,
  Send, Share2, Shield, ShieldCheck, ShieldPlus, Sliders, Sprout, Star, Stethoscope, Tag, Timer,
  TrendingUp, UploadCloud, User, UserCheck, Users,
};

export const CMS_ICON_NAMES = Object.keys(CMS_ICONS).sort();

export function cmsIcon(name: unknown, fallback: LucideIcon): LucideIcon {
  return (typeof name === "string" && CMS_ICONS[name]) || fallback;
}
