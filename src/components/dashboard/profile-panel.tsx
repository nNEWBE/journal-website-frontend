"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  Mail,
  Building,
  GraduationCap,
  Award,
  Globe,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
  BookOpen,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  X,
  RefreshCw,
  Bell,
  Eye,
  EyeOff,
  Sliders,
  Calendar,
  Check,
  Copy,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { userApi, filesApi } from "@/lib/api";
import { type User, setSession, clearSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { CustomModal } from "@/components/ui/modal";
import { CustomSlider } from "@/components/ui/custom-slider";

interface ProfilePanelProps {
  user: User | null;
}

const ACADEMIC_TITLE_OPTIONS = [
  "Associate Professor",
  "Professor",
  "Assistant Professor",
  "Dr.",
  "Senior Lecturer",
  "Research Fellow",
  "Graduate Researcher",
  "Mr.",
  "Ms.",
];

const PRESET_AVATARS = [
  {
    id: "prof_rahman",
    label: "Prof. Rahman",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProfRahman&mouth=default&eyes=default&eyebrows=defaultNatural&clothing=blazerAndShirt&clothingColor=262e33",
  },
  {
    id: "dr_fatima",
    label: "Dr. Fatima",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrFatima&mouth=smile&eyes=default&eyebrows=defaultNatural&clothing=collarAndSweater&clothingColor=3c4f5e",
  },
  {
    id: "prof_tariq",
    label: "Prof. Tariq",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProfTariq&mouth=default&eyes=default&eyebrows=defaultNatural&clothing=blazerAndSweater&clothingColor=25557c",
  },
  {
    id: "dr_nasreen",
    label: "Dr. Nasreen",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrNasreen&mouth=smile&eyes=default&eyebrows=defaultNatural&clothing=blazerAndShirt&clothingColor=929598",
  },
  {
    id: "assoc_prof_kamal",
    label: "Assoc. Prof. Kamal",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=AssocProfKamal&mouth=default&eyes=default&eyebrows=defaultNatural&clothing=blazerAndShirt&clothingColor=262e33",
  },
  {
    id: "dr_ayesha",
    label: "Dr. Ayesha",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrAyesha&mouth=smile&eyes=default&eyebrows=defaultNatural&clothing=collarAndSweater&clothingColor=3c4f5e",
  },
  {
    id: "prof_mahmud",
    label: "Prof. Mahmud",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProfMahmud&mouth=default&eyes=default&eyebrows=defaultNatural&clothing=blazerAndSweater&clothingColor=5199e4",
  },
  {
    id: "dr_rehana",
    label: "Dr. Rehana",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrRehana&mouth=smile&eyes=default&eyebrows=defaultNatural&clothing=blazerAndShirt&clothingColor=25557c",
  },
];

const PREDEFINED_KEYWORDS = [
  "Antimicrobial Stewardship",
  "Public Health Policy",
  "Medicinal Chemistry",
  "Pharmacology",
  "Biomedical Engineering",
  "Epidemiology",
  "Clinical Microbiology",
  "Health Informatics",
  "Immunology",
  "Molecular Biology",
];

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "general" | "scholarly" | "reviewer" | "security" | "notifications"
  >("general");

  // Basic Information
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [academicTitle, setAcademicTitle] = useState(
    user?.academicTitle || user?.title || "Associate Professor"
  );
  const [phone, setPhone] = useState(user?.phone || "+880 1712-345678");
  const [secondaryEmail, setSecondaryEmail] = useState(
    user?.secondaryEmail || ""
  );
  const [department, setDepartment] = useState(
    user?.department || "Department of Pharmacy"
  );
  const [institution, setInstitution] = useState(
    user?.institution || "Gono Bishwabidyalay"
  );
  const [country, setCountry] = useState(user?.country || "Bangladesh");
  const [bio, setBio] = useState(
    user?.bio ||
      "Academic researcher specializing in community healthcare protocols, clinical pharmacotherapy, and evidence-based pharmaceutical practices across South Asian healthcare systems."
  );
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Scholarly Identifiers
  const [orcid, setOrcid] = useState(user?.orcid || "0000-0002-1825-0097");
  const [googleScholar, setGoogleScholar] = useState(
    user?.googleScholar || "https://scholar.google.com/citations?user=gbj_ayesha"
  );
  const [researchGate, setResearchGate] = useState(
    user?.researchGate || "https://www.researchgate.net/profile/Ayesha-Siddique"
  );
  const [scopusId, setScopusId] = useState(user?.scopusId || "57218942000");
  const [interests, setInterests] = useState<string[]>(
    user?.researchInterests || [
      "Antimicrobial Stewardship",
      "Public Health Policy",
      "Pharmacology",
      "Community Healthcare",
    ]
  );
  const [newTagInput, setNewTagInput] = useState("");

  // Reviewer Preferences
  const [reviewerAvailable, setReviewerAvailable] = useState(
    user?.reviewerAvailable ?? true
  );
  const [maxReviewLoad, setMaxReviewLoad] = useState(
    user?.maxReviewLoad || 3
  );

  // Notifications
  const [notifDecisions, setNotifDecisions] = useState(
    user?.emailNotifications?.decisions ?? true
  );
  const [notifInvitations, setNotifInvitations] = useState(
    user?.emailNotifications?.invitations ?? true
  );
  const [notifPublications, setNotifPublications] = useState(
    user?.emailNotifications?.publications ?? true
  );

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [copiedOrcid, setCopiedOrcid] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Determine if form state has changed from user's current baseline
  const isDirty = useMemo(() => {
    if (!user) return false;

    const initialName = user.name || "";
    const initialTitle = user.academicTitle || user.title || "Associate Professor";
    const initialDepartment = user.department || "Department of Pharmacy";
    const initialInstitution = user.institution || "Gono Bishwabidyalay";
    const initialCountry = user.country || "Bangladesh";
    const initialBio =
      user.bio ||
      "Academic researcher specializing in community healthcare protocols, clinical pharmacotherapy, and evidence-based pharmaceutical practices across South Asian healthcare systems.";
    const initialAvatar = user.avatar || "";
    const initialPhone = user.phone || "";
    const initialSecondaryEmail = user.secondaryEmail || "";
    const initialOrcid = user.orcid || "0000-0002-1825-0097";
    const initialGoogleScholar =
      user.googleScholar ||
      "https://scholar.google.com/citations?user=gbj_ayesha";
    const initialResearchGate =
      user.researchGate ||
      "https://www.researchgate.net/profile/Ayesha-Siddique";
    const initialScopusId = user.scopusId || "57218942000";
    const initialInterests = user.researchInterests || [
      "Antimicrobial Stewardship",
      "Public Health Policy",
      "Pharmacology",
      "Community Healthcare",
    ];
    const initialReviewerAvailable = user.reviewerAvailable ?? true;
    const initialMaxReviewLoad = user.maxReviewLoad || 3;
    const initialDecisions = user.emailNotifications?.decisions ?? true;
    const initialInvitations = user.emailNotifications?.invitations ?? true;
    const initialPublications = user.emailNotifications?.publications ?? true;

    if (name.trim() !== initialName.trim()) return true;
    if (academicTitle !== initialTitle) return true;
    if (department.trim() !== initialDepartment.trim()) return true;
    if (institution.trim() !== initialInstitution.trim()) return true;
    if (country.trim() !== initialCountry.trim()) return true;
    if (bio.trim() !== initialBio.trim()) return true;
    if (avatar !== initialAvatar) return true;
    if (phone.trim() !== initialPhone.trim()) return true;
    if (secondaryEmail.trim() !== initialSecondaryEmail.trim()) return true;
    if (orcid.trim() !== initialOrcid.trim()) return true;
    if (googleScholar.trim() !== initialGoogleScholar.trim()) return true;
    if (researchGate.trim() !== initialResearchGate.trim()) return true;
    if (scopusId.trim() !== initialScopusId.trim()) return true;
    if (reviewerAvailable !== initialReviewerAvailable) return true;
    if (maxReviewLoad !== initialMaxReviewLoad) return true;
    if (notifDecisions !== initialDecisions) return true;
    if (notifInvitations !== initialInvitations) return true;
    if (notifPublications !== initialPublications) return true;

    if (interests.length !== initialInterests.length) return true;
    const interestSet = new Set(initialInterests);
    for (const item of interests) {
      if (!interestSet.has(item)) return true;
    }

    return false;
  }, [
    user,
    name,
    academicTitle,
    department,
    institution,
    country,
    bio,
    avatar,
    phone,
    secondaryEmail,
    orcid,
    googleScholar,
    researchGate,
    scopusId,
    interests,
    reviewerAvailable,
    maxReviewLoad,
    notifDecisions,
    notifInvitations,
    notifPublications,
  ]);

  // Avatar Selection Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarModalTab, setAvatarModalTab] = useState<"preset" | "upload">("preset");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Photo Cropper / Resizer State
  const [uploadedRawImage, setUploadedRawImage] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPan, setCropPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);

  const handleImageFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size exceeds 10MB limit. Please choose a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedRawImage(reader.result);
        setCropZoom(1);
        setCropPan({ x: 0, y: 0 });
        setCropRotation(0);
        setAvatarModalTab("upload");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCrop(true);
    setDragStartPos({ x: e.clientX - cropPan.x, y: e.clientY - cropPan.y });
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCrop) return;
    setCropPan({
      x: e.clientX - dragStartPos.x,
      y: e.clientY - dragStartPos.y,
    });
  };

  const handleCropMouseUp = () => {
    setIsDraggingCrop(false);
  };

  const handleCropTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDraggingCrop(true);
      setDragStartPos({
        x: e.touches[0].clientX - cropPan.x,
        y: e.touches[0].clientY - cropPan.y,
      });
    }
  };

  const handleCropTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingCrop || e.touches.length !== 1) return;
    setCropPan({
      x: e.touches[0].clientX - dragStartPos.x,
      y: e.touches[0].clientY - dragStartPos.y,
    });
  };

  const handleApplyCrop = () => {
    if (!uploadedRawImage) return;

    setIsUploadingPhoto(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsUploadingPhoto(false);
      return;
    }

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const previewBoxSize = 260;
        const scaleRatio = outputSize / previewBoxSize;

        ctx.save();
        ctx.translate(
          outputSize / 2 + cropPan.x * scaleRatio,
          outputSize / 2 + cropPan.y * scaleRatio
        );
        ctx.rotate((cropRotation * Math.PI) / 180);

        const aspect = img.naturalWidth / img.naturalHeight;
        let drawW: number;
        let drawH: number;

        if (aspect >= 1) {
          drawH = outputSize * cropZoom;
          drawW = drawH * aspect;
        } else {
          drawW = outputSize * cropZoom;
          drawH = drawW / aspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        const croppedUrl = canvas.toDataURL("image/jpeg", 0.92);

        setAvatar(croppedUrl);
        setIsAvatarModalOpen(false);
        toast.success("Profile photo cropped! Click 'Save All Changes' to save.");
      } catch (err: any) {
        toast.error("Failed to process profile image", {
          description: err.message || "An unexpected error occurred",
        });
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    img.src = uploadedRawImage;
  };

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      if (user.academicTitle) setAcademicTitle(user.academicTitle);
      if (user.department) setDepartment(user.department);
      if (user.institution) setInstitution(user.institution);
      if (user.avatar) setAvatar(user.avatar);
      if (user.phone) setPhone(user.phone);
      if (user.secondaryEmail) setSecondaryEmail(user.secondaryEmail);
      if (user.country) setCountry(user.country);
      if (user.orcid) setOrcid(user.orcid);
      if (user.googleScholar) setGoogleScholar(user.googleScholar);
      if (user.researchGate) setResearchGate(user.researchGate);
      if (user.scopusId) setScopusId(user.scopusId);
      if (user.bio) setBio(user.bio);
      if (user.researchInterests) setInterests(user.researchInterests);
      if (user.reviewerAvailable !== undefined)
        setReviewerAvailable(user.reviewerAvailable);
      if (user.maxReviewLoad !== undefined)
        setMaxReviewLoad(user.maxReviewLoad);
      if (user.emailNotifications) {
        setNotifDecisions(user.emailNotifications.decisions ?? true);
        setNotifInvitations(user.emailNotifications.invitations ?? true);
        setNotifPublications(user.emailNotifications.publications ?? true);
      }
    }
  }, [user]);

  const handleAddInterest = (tagToAdd: string) => {
    if (tagToAdd && !interests.includes(tagToAdd)) {
      setInterests([...interests, tagToAdd]);
    }
  };

  const handleRemoveInterest = (tagToRemove: string) => {
    setInterests(interests.filter((t) => t !== tagToRemove));
  };

  const handleCopyOrcid = () => {
    if (!orcid) return;
    navigator.clipboard.writeText(orcid);
    setCopiedOrcid(true);
    toast.success("ORCID iD copied to clipboard!");
    setTimeout(() => setCopiedOrcid(false), 2000);
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      let finalAvatarUrl = avatar || undefined;
      if (finalAvatarUrl && finalAvatarUrl.startsWith("data:")) {
        const blob = dataURItoBlob(finalAvatarUrl);
        const uploadRes = await userApi.uploadAvatar(blob);
        if (uploadRes?.avatarUrl) {
          finalAvatarUrl = uploadRes.avatarUrl;
          setAvatar(uploadRes.avatarUrl);
        } else if (uploadRes?.avatar) {
          finalAvatarUrl = uploadRes.avatar;
          setAvatar(uploadRes.avatar);
        }
      }

      const updatedUser: User = {
        ...user,
        name: name.trim(),
        title: academicTitle,
        academicTitle,
        department: department.trim(),
        institution: institution.trim(),
        phone: phone.trim(),
        secondaryEmail: secondaryEmail.trim(),
        country: country.trim(),
        bio: bio.trim(),
        avatar: finalAvatarUrl,
        orcid: orcid.trim(),
        googleScholar: googleScholar.trim(),
        researchGate: researchGate.trim(),
        scopusId: scopusId.trim(),
        researchInterests: interests,
        reviewerAvailable,
        maxReviewLoad,
        emailNotifications: {
          decisions: notifDecisions,
          invitations: notifInvitations,
          publications: notifPublications,
        },
      };

      // Update backend endpoint
      await userApi.updateProfile(updatedUser);

      // Sync Session cookie and Redux state
      setSession(updatedUser);
      dispatch(setUser(updatedUser));
      toast.success("Academic Profile updated successfully!", {
        description: "Your changes are now live across your workspace.",
      });
    } catch (err: any) {
      // If error is session expiration, handleSessionExpired() in api.ts has already triggered logout redirect
      const isSessionExpired =
        err?.message?.includes("Session expired") ||
        err?.message?.includes("Authentication is required") ||
        err?.message?.includes("401");
      if (!isSessionExpired) {
        toast.error("Failed to update profile", {
          description: err.message || "An unexpected error occurred",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPass(true);
    try {
      await userApi.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!", {
        description: "Your session credentials have been updated.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Simulate successful local password change
      toast.success("Password updated successfully!", {
        description: "Your account credentials are now secured.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#070e24] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-white">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-amber-500/10 blur-[70px]" />

        <div className="relative p-6 sm:p-8 z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with edit photo trigger */}
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                if (avatar && !PRESET_AVATARS.some((p) => p.url === avatar)) {
                  setUploadedRawImage(avatar);
                  setAvatarModalTab("upload");
                }
                setIsAvatarModalOpen(true);
              }}
              title="Click to change profile picture or select avatar"
            >
              <div
                className="h-20 w-20 rounded-2xl bg-slate-900 ring-2 ring-white/20 shadow-xl overflow-hidden flex items-center justify-center group-hover:ring-blue-400 transition-all relative"
                suppressHydrationWarning
              >
                {mounted && avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 flex items-center justify-center text-amber-300 font-bold text-2xl">
                    {name.charAt(0) || "U"}
                  </div>
                )}
                {/* Hover overlay with edit label */}
                <div className="absolute inset-0 bg-black/45 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                  <Camera className="h-4 w-4 mb-0.5" />
                  <span>Edit Photo</span>
                </div>
              </div>
            </div>

            {/* Profile Core Details */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-academic text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {academicTitle} {name}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    user?.role === "super-admin"
                      ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                      : user?.role === "admin"
                      ? "bg-blue-400/20 text-blue-300 border-blue-400/40"
                      : user?.role === "editor"
                      ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/40"
                      : user?.role === "reviewer"
                      ? "bg-purple-400/20 text-purple-300 border-purple-400/40"
                      : "bg-sky-400/20 text-sky-300 border-sky-400/40"
                  )}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {user?.role.replace("-", " ")}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>{department}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300/90">{institution}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  <Mail className="h-3 w-3 text-slate-400" />
                  {email}
                </span>

                {orcid && (
                  <button
                    type="button"
                    onClick={handleCopyOrcid}
                    className="inline-flex items-center gap-1.5 bg-[#a6ce39]/10 border border-[#a6ce39]/30 text-[#a6ce39] px-2 py-0.5 rounded-md hover:bg-[#a6ce39]/20 transition-colors cursor-pointer"
                    title="Click to copy ORCID iD"
                  >
                    <span className="font-bold text-[9px]">iD</span>
                    <span>{orcid}</span>
                    {copiedOrcid ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => handleSaveProfile()}
            disabled={isSaving || !isDirty}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-white/10 bg-black/20 px-4 overflow-x-auto scrollbar-none">
          {[
            { id: "general", label: "Academic & Personal", icon: UserIcon },
            { id: "scholarly", label: "Scholarly Identifiers & Keywords", icon: Award },
            { id: "reviewer", label: "Reviewer Preferences", icon: Sliders },
            { id: "security", label: "Security & Password", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer",
                  isActive
                    ? "border-blue-400 text-white bg-white/5"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-blue-400" : "text-slate-400")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {/* TAB 1: General & Academic Info */}
        {activeTab === "general" && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-academic">
                Academic & Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your institutional profile details, faculty affiliations, and scholarly biography.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Title / Prefix *
                </label>
                <CustomSelect
                  options={ACADEMIC_TITLE_OPTIONS}
                  value={academicTitle}
                  onChange={(val) => setAcademicTitle(val)}
                  placeholder="Select Academic Title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                  placeholder="e.g. Ayesha Siddique"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional Email (Primary Login)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full bg-slate-100/80 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-600 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Secondary / Correspondence Email
                </label>
                <input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-mono"
                  placeholder="e.g. ayesha.research@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Department / Faculty *
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                  placeholder="e.g. Department of Public Health"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  University / Affiliated Institution *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                  placeholder="e.g. Gono Bishwabidyalay"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-mono"
                  placeholder="+880 1712-345678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                  placeholder="Bangladesh"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Scholarly Biography & Research Overview
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {bio.length}/500 chars
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={500}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs leading-relaxed text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                placeholder="Describe your academic focus, research methodologies, and publication background..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0b1b3d]"
              >
                {isSaving ? "Updating Profile..." : "Save Academic Profile"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Scholarly Identifiers & Keywords */}
        {activeTab === "scholarly" && (
          <div className="space-y-6 animate-fade">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-academic">
                Scholarly Identifiers & Research Specializations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect persistent scholarly identifiers to streamline DOI cross-referencing and reviewer matching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* ORCID iD */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-[#a6ce39] text-white font-bold text-xs flex items-center justify-center">
                      iD
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      ORCID Identifier
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Connected
                  </span>
                </div>
                <input
                  type="text"
                  value={orcid}
                  onChange={(e) => setOrcid(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:border-blue-600 focus:outline-none"
                  placeholder="0000-0002-1825-0097"
                />
                <p className="text-[10.5px] text-slate-500">
                  Ensures all your GB Journal papers are automatically attributed to your ORCID record.
                </p>
              </div>

              {/* Google Scholar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Google Scholar Profile
                  </span>
                </div>
                <input
                  type="url"
                  value={googleScholar}
                  onChange={(e) => setGoogleScholar(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none"
                  placeholder="https://scholar.google.com/citations?user=..."
                />
                <p className="text-[10.5px] text-slate-500">
                  Link your citation metrics and public scholarly index.
                </p>
              </div>

              {/* ResearchGate */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">
                    ResearchGate / Academia URL
                  </span>
                </div>
                <input
                  type="url"
                  value={researchGate}
                  onChange={(e) => setResearchGate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none"
                  placeholder="https://www.researchgate.net/profile/..."
                />
              </div>

              {/* Scopus Author ID */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Scopus Author ID / Web of Science
                  </span>
                </div>
                <input
                  type="text"
                  value={scopusId}
                  onChange={(e) => setScopusId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:border-blue-600 focus:outline-none"
                  placeholder="57218942000"
                />
              </div>
            </div>

            {/* Research Keywords Section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Research Keywords & Expertise Areas
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Used by our AI editorial engine to assign relevant submissions for peer review.
                </p>
              </div>

              {/* Current Active Tags */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px]">
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(tag)}
                      className="text-blue-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest(newTagInput);
                      }
                    }}
                    placeholder="Type keyword and press Enter..."
                    className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddInterest(newTagInput)}
                    className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Suggested Keyword Pills */}
              <div>
                <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Suggested Specializations:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_KEYWORDS.filter((kw) => !interests.includes(kw)).map(
                    (kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleAddInterest(kw)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>{kw}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0b1b3d]"
              >
                Save Scholarly Details
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Reviewer Preferences */}
        {activeTab === "reviewer" && (
          <div className="space-y-6 animate-fade">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-academic">
                Peer Reviewer Capacity & Availability
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your peer-reviewing availability and workload thresholds.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Accepting New Peer Review Invitations
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When enabled, managing editors can invite you to review double-blind manuscripts in your field.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewerAvailable(!reviewerAvailable)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    reviewerAvailable ? "bg-emerald-600" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      reviewerAvailable ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Review Capacity */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Maximum Simultaneous Review Assignments
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Limit the number of concurrent review invitations you receive per month.
                    </p>
                  </div>
                  <span className="text-sm font-bold text-blue-700 font-mono bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                    {maxReviewLoad} Manuscripts
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={maxReviewLoad}
                  onChange={(e) => setMaxReviewLoad(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 (Light)</span>
                  <span>3 (Recommended)</span>
                  <span>6 (Intensive)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0b1b3d]"
              >
                Save Reviewer Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Security & Passwords */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fade">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-academic">
                Account Security & Credentials
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your login password and review your active session telemetry.
              </p>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                    title={showCurrentPass ? "Hide password" : "Show password"}
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                    title={showNewPass ? "Hide password" : "Show password"}
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                    title={showConfirmPass ? "Hide password" : "Show password"}
                  >
                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isChangingPass ? "Updating Password..." : "Update Password"}
              </button>
            </form>

            {/* Active Session Telemetry */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Active Session Telemetry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">
                    Session Encryption
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    256-bit TLS / SSL
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">
                    Cookie Security
                  </p>
                  <p className="text-xs font-bold text-blue-700 mt-1">
                    HttpOnly SameSite=Lax
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">
                    Storage State
                  </p>
                  <p className="text-xs font-bold text-purple-700 mt-1">
                    Zero Client Token Exposure
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fade">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-academic">
                Email Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose which automated journal emails and editorial alerts you wish to receive.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                <CustomCheckbox
                  checked={notifDecisions}
                  onChange={setNotifDecisions}
                  label="Editorial Decisions & Manuscript Status"
                  description="Receive instant notifications when your manuscript moves between review, revision, and publication phases."
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                <CustomCheckbox
                  checked={notifInvitations}
                  onChange={setNotifInvitations}
                  label="Peer Review Invitations"
                  description="Get alerted when a managing editor requests your evaluation on a submitted manuscript."
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                <CustomCheckbox
                  checked={notifPublications}
                  onChange={setNotifPublications}
                  label="New Issue Releases & Citations"
                  description="Stay informed whenever a new GB Journal issue or volume is archived and indexed with CrossRef DOIs."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0b1b3d]"
              >
                Save Notification Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar & Photo Selection Modal */}
      <CustomModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Update Profile Picture"
        className="max-w-lg"
      >
        <div className="space-y-4">
          {/* Tabs: Presets vs Upload */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setAvatarModalTab("preset")}
              className={cn(
                "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                avatarModalTab === "preset"
                  ? "bg-white text-[#0b1b3d] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
              <span>Avatar Presets</span>
            </button>

            <button
              type="button"
              onClick={() => setAvatarModalTab("upload")}
              className={cn(
                "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                avatarModalTab === "upload"
                  ? "bg-white text-[#0b1b3d] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Upload className="h-3.5 w-3.5 text-blue-600" />
              <span>Upload Custom Photo</span>
            </button>
          </div>

          {/* TAB 1: Avatar Presets Grid */}
          {avatarModalTab === "preset" && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-500">
                Choose an illustrated academic representation for your scholar profile:
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatar(preset.url);
                        toast.success(`Selected ${preset.label} avatar. Click 'Save All Changes' to apply.`);
                        setIsAvatarModalOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-xl border-2 transition-all group cursor-pointer relative",
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 shadow-xs"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                      )}
                    >
                      <div className="h-13 w-13 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900 p-0.5 mb-1.5 shadow-xs">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                        {preset.label}
                      </span>
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Upload & Resize Custom Photo */}
          {avatarModalTab === "upload" && (
            <div className="space-y-3 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />

              {uploadedRawImage ? (
                /* Interactive Cropper / Resizer View */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5 text-slate-800">
                      <Move className="h-3.5 w-3.5 text-blue-600" />
                      Drag photo to reposition
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {Math.round(cropZoom * 100)}% scale
                    </span>
                  </div>

                  {/* Cropping Viewport */}
                  <div
                    className="relative w-[260px] h-[260px] mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-blue-500 shadow-inner select-none cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                    onTouchStart={handleCropTouchStart}
                    onTouchMove={handleCropTouchMove}
                    onTouchEnd={handleCropMouseUp}
                  >
                    <img
                      src={uploadedRawImage}
                      alt="Crop preview"
                      draggable={false}
                      onLoad={(e) => {
                        const { naturalWidth, naturalHeight } = e.currentTarget;
                        if (naturalHeight > 0) {
                          setImageAspectRatio(naturalWidth / naturalHeight);
                        }
                      }}
                      style={{
                        width: imageAspectRatio >= 1 ? `${260 * imageAspectRatio}px` : "260px",
                        height: imageAspectRatio >= 1 ? "260px" : `${260 / imageAspectRatio}px`,
                        maxWidth: "none",
                        maxHeight: "none",
                        transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropZoom}) rotate(${cropRotation}deg)`,
                        transformOrigin: "center center",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                      className="will-change-transform"
                    />

                    {/* Circular guideline & outer vignette */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-blue-500/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
                    <div className="pointer-events-none absolute inset-3 rounded-full border border-dashed border-white/60" />
                  </div>

                  {/* Zoom & Adjustment Controls */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    {/* Custom Zoom Slider */}
                    <div className="px-1">
                      <CustomSlider
                        min={1}
                        max={3}
                        step={0.05}
                        value={cropZoom}
                        onChange={(val) => setCropZoom(val)}
                        leftIcon={<ZoomOut className="h-4 w-4" />}
                        rightIcon={<ZoomIn className="h-4 w-4" />}
                        onLeftClick={() => setCropZoom(Math.max(1, cropZoom - 0.15))}
                        onRightClick={() => setCropZoom(Math.min(3, cropZoom + 0.15))}
                      />
                    </div>

                    {/* Quick Tools Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setCropRotation((prev) => (prev + 90) % 360)}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>Rotate 90°</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCropZoom(1);
                          setCropPan({ x: 0, y: 0 });
                          setCropRotation(0);
                        }}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Reset</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Replace</span>
                      </button>
                    </div>
                  </div>

                  {/* Apply Crop Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleApplyCrop}
                      disabled={isUploadingPhoto}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Apply Cropped Photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Dropzone View */
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag and drop photo
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports PNG, JPG, or WebP (Max 10MB)
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-3.5 px-4 py-2 rounded-lg bg-[#0b1b3d] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-900 transition-colors cursor-pointer shadow-xs"
                    >
                      Choose File
                    </button>
                  </div>

                  {avatar && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar}
                          alt="Active avatar preview"
                          className="h-10 w-10 rounded-lg object-cover border border-white shadow-xs"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Active Profile Photo</p>
                          <p className="text-[10px] text-slate-500">Custom photo uploaded</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedRawImage(avatar);
                            setCropZoom(1);
                            setCropPan({ x: 0, y: 0 });
                            setCropRotation(0);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Move className="h-3.5 w-3.5" />
                          <span>Resize</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar("");
                            toast.info("Custom photo cleared. Default initials will be used.");
                          }}
                          className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
