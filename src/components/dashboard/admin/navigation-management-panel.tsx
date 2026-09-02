"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  RotateCcw,
  Link2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Layers,
  ArrowUpRight,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Database,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { navigationApi } from "@/lib/api";
import {
  useNavigation,
  NavItem,
  NavSubItem,
  defaultMainNav,
  NAV_ICONS_MAP,
  getNavIcon,
  broadcastNavUpdate,
} from "@/components/header/nav-data";
import { CustomModal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export function NavigationManagementPanel() {
  const { navItems, setNavItems, resetNavItems } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isSavingDb, setIsSavingDb] = useState(false);

  // Expanded items state in tree
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "nav-about": true,
    "nav-issues": true,
    "nav-authors": true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Load from backend DB
  const loadFromDb = async () => {
    try {
      setLoading(true);
      const data = await navigationApi.getAllAdmin();
      if (Array.isArray(data) && data.length > 0) {
        setNavItems(data);
      }
    } catch (err: any) {
      console.warn("Using current navigation state:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFromDb();
  }, []);

  // Save changes to database
  const persistToDatabase = async (nextItems: NavItem[], successMsg?: string) => {
    setNavItems(nextItems);
    try {
      setIsSavingDb(true);
      const saved = await navigationApi.saveBulk(nextItems);
      if (Array.isArray(saved) && saved.length > 0) {
        setNavItems(saved);
        broadcastNavUpdate(saved);
      }
      if (successMsg) {
        toast.success(successMsg);
      }
    } catch (err: any) {
      toast.error("Failed to save changes to database", {
        description: err.message,
      });
    } finally {
      setIsSavingDb(false);
    }
  };

  // -------------------------------------------------------------
  // Top-Level Nav Item Modal State
  // -------------------------------------------------------------
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);

  const [formItemLabel, setFormItemLabel] = useState("");
  const [formItemHref, setFormItemHref] = useState("");
  const [formHasDropdown, setFormHasDropdown] = useState(false);
  const [formDropdownHeader, setFormDropdownHeader] = useState("");
  const [formFooterLabel, setFormFooterLabel] = useState("");
  const [formFooterHref, setFormFooterHref] = useState("");
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(false);
  const [formItemEnabled, setFormItemEnabled] = useState(true);

  // -------------------------------------------------------------
  // Sub-Item Modal State
  // -------------------------------------------------------------
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [parentNavKey, setParentNavKey] = useState<string | null>(null);
  const [editingSubItem, setEditingSubItem] = useState<NavSubItem | null>(null);

  const [formSubLabel, setFormSubLabel] = useState("");
  const [formSubHref, setFormSubHref] = useState("");
  const [formSubDesc, setFormSubDesc] = useState("");
  const [formSubIconName, setFormSubIconName] = useState("BookOpen");
  const [formSubEnabled, setFormSubEnabled] = useState(true);
  const [iconSearch, setIconSearch] = useState("");

  // -------------------------------------------------------------
  // Delete & Reset Modals
  // -------------------------------------------------------------
  const [itemToDelete, setItemToDelete] = useState<{
    parentKey?: string;
    subKey?: string;
    topKey?: string;
    name: string;
  } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // -------------------------------------------------------------
  // Stats
  // -------------------------------------------------------------
  const stats = useMemo(() => {
    const totalTop = navItems.length;
    const activeTop = navItems.filter((i) => i.enabled !== false).length;
    const dropdownCount = navItems.filter((i) => i.dropdown && i.dropdown.length > 0).length;
    const directCount = totalTop - dropdownCount;
    let totalSubs = 0;
    navItems.forEach((i) => {
      if (i.dropdown) totalSubs += i.dropdown.length;
    });
    return { totalTop, activeTop, dropdownCount, directCount, totalSubs };
  }, [navItems]);

  // -------------------------------------------------------------
  // Handlers for Top-Level Item Modal
  // -------------------------------------------------------------
  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setFormItemLabel("");
    setFormItemHref("/");
    setFormHasDropdown(false);
    setFormDropdownHeader("");
    setFormFooterLabel("");
    setFormFooterHref("");
    setFormOpenInNewTab(false);
    setFormItemEnabled(true);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: NavItem) => {
    setEditingItem(item);
    setFormItemLabel(item.label);
    setFormItemHref(item.href);
    setFormHasDropdown(Boolean(item.dropdown && item.dropdown.length > 0));
    setFormDropdownHeader(item.dropdownHeader || "");
    setFormFooterLabel(item.footerLabel || "");
    setFormFooterHref(item.footerHref || "");
    setFormOpenInNewTab(Boolean(item.openInNewTab));
    setFormItemEnabled(item.enabled !== false);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItemLabel.trim() || !formItemHref.trim()) {
      toast.error("Label and Link URL are required.");
      return;
    }

    if (editingItem) {
      // Update existing
      const updated = navItems.map((item) => {
        const matches = (editingItem.id && item.id === editingItem.id) || (editingItem.clientId && item.clientId === editingItem.clientId) || item.label === editingItem.label;
        if (matches) {
          return {
            ...item,
            label: formItemLabel.trim(),
            href: formItemHref.trim(),
            openInNewTab: formOpenInNewTab,
            enabled: formItemEnabled,
            dropdownHeader: formHasDropdown ? formDropdownHeader.trim() || undefined : undefined,
            footerLabel: formHasDropdown ? formFooterLabel.trim() || undefined : undefined,
            footerHref: formHasDropdown ? formFooterHref.trim() || undefined : undefined,
            dropdown: formHasDropdown ? item.dropdown || [] : undefined,
          };
        }
        return item;
      });
      await persistToDatabase(updated, `Saved "${formItemLabel}" to database`);
    } else {
      // Create new
      const newItemId = `nav-${Date.now()}`;
      const newItem: NavItem = {
        clientId: newItemId,
        label: formItemLabel.trim(),
        href: formItemHref.trim(),
        openInNewTab: formOpenInNewTab,
        enabled: formItemEnabled,
        dropdownHeader: formHasDropdown ? formDropdownHeader.trim() || undefined : undefined,
        footerLabel: formHasDropdown ? formFooterLabel.trim() || undefined : undefined,
        footerHref: formHasDropdown ? formFooterHref.trim() || undefined : undefined,
        dropdown: formHasDropdown ? [] : undefined,
      };
      const updated = [...navItems, newItem];
      setExpandedIds((prev) => ({ ...prev, [newItemId]: true }));
      await persistToDatabase(updated, `Created and saved "${formItemLabel}" to database`);
    }
    setIsItemModalOpen(false);
  };

  // -------------------------------------------------------------
  // Handlers for Sub-Item Modal
  // -------------------------------------------------------------
  const handleOpenAddSubItem = (parentKey: string) => {
    setParentNavKey(parentKey);
    setEditingSubItem(null);
    setFormSubLabel("");
    setFormSubHref("/");
    setFormSubDesc("");
    setFormSubIconName("BookOpen");
    setFormSubEnabled(true);
    setIconSearch("");
    setIsSubModalOpen(true);
  };

  const handleOpenEditSubItem = (parentKey: string, sub: NavSubItem) => {
    setParentNavKey(parentKey);
    setEditingSubItem(sub);
    setFormSubLabel(sub.label);
    setFormSubHref(sub.href);
    setFormSubDesc(sub.description || "");
    setFormSubIconName(sub.iconName || "BookOpen");
    setFormSubEnabled(sub.enabled !== false);
    setIconSearch("");
    setIsSubModalOpen(true);
  };

  const handleSaveSubItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentNavKey) return;
    if (!formSubLabel.trim() || !formSubHref.trim()) {
      toast.error("Sub-item label and URL are required.");
      return;
    }

    const updated = navItems.map((item) => {
      const isParent = item.id?.toString() === parentNavKey || item.clientId === parentNavKey || item.label === parentNavKey;
      if (isParent) {
        const currentDropdown = item.dropdown || [];
        if (editingSubItem) {
          // Update sub-item
          const nextSubs = currentDropdown.map((s) => {
            const isTarget = (editingSubItem.id && s.id === editingSubItem.id) || (editingSubItem.clientId && s.clientId === editingSubItem.clientId) || s.label === editingSubItem.label;
            if (isTarget) {
              return {
                ...s,
                label: formSubLabel.trim(),
                href: formSubHref.trim(),
                description: formSubDesc.trim(),
                iconName: formSubIconName,
                enabled: formSubEnabled,
              };
            }
            return s;
          });
          return { ...item, dropdown: nextSubs };
        } else {
          // Add new sub-item
          const newSub: NavSubItem = {
            clientId: `sub-${Date.now()}`,
            label: formSubLabel.trim(),
            href: formSubHref.trim(),
            description: formSubDesc.trim(),
            iconName: formSubIconName,
            enabled: formSubEnabled,
          };
          return { ...item, dropdown: [...currentDropdown, newSub] };
        }
      }
      return item;
    });

    await persistToDatabase(
      updated,
      editingSubItem
        ? `Saved sub-link "${formSubLabel}" to database`
        : `Added and saved "${formSubLabel}" to database`
    );
    setIsSubModalOpen(false);
  };

  // -------------------------------------------------------------
  // Item Reordering
  // -------------------------------------------------------------
  const handleMoveItem = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= navItems.length) return;

    const copy = [...navItems];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    await persistToDatabase(copy, `Reordered "${moved.label}" ${direction}`);
  };

  const handleMoveSubItem = async (
    parentIdx: number,
    subIdx: number,
    direction: "up" | "down"
  ) => {
    const parent = navItems[parentIdx];
    if (!parent || !parent.dropdown) return;
    const targetIdx = direction === "up" ? subIdx - 1 : subIdx + 1;
    if (targetIdx < 0 || targetIdx >= parent.dropdown.length) return;

    const subCopy = [...parent.dropdown];
    const [movedSub] = subCopy.splice(subIdx, 1);
    subCopy.splice(targetIdx, 0, movedSub);

    const updated = [...navItems];
    updated[parentIdx] = { ...parent, dropdown: subCopy };
    await persistToDatabase(updated, `Reordered "${movedSub.label}" ${direction}`);
  };

  // -------------------------------------------------------------
  // Toggle Visibility
  // -------------------------------------------------------------
  const handleToggleItemVisibility = async (itemKey: string) => {
    const updated = navItems.map((item) => {
      const match = item.id?.toString() === itemKey || item.clientId === itemKey || item.label === itemKey;
      if (match) {
        const nextState = item.enabled === false ? true : false;
        return { ...item, enabled: nextState };
      }
      return item;
    });
    await persistToDatabase(updated, "Updated link visibility in database");
  };

  const handleToggleSubVisibility = async (parentKey: string, subKey: string) => {
    const updated = navItems.map((item) => {
      const matchParent = item.id?.toString() === parentKey || item.clientId === parentKey || item.label === parentKey;
      if (matchParent && item.dropdown) {
        const nextSubs = item.dropdown.map((s) => {
          const matchSub = s.id?.toString() === subKey || s.clientId === subKey || s.label === subKey;
          if (matchSub) {
            const nextState = s.enabled === false ? true : false;
            return { ...s, enabled: nextState };
          }
          return s;
        });
        return { ...item, dropdown: nextSubs };
      }
      return item;
    });
    await persistToDatabase(updated, "Updated sub-link visibility in database");
  };

  // -------------------------------------------------------------
  // Confirm Delete
  // -------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.topKey) {
      const updated = navItems.filter((i) => {
        return !(i.id?.toString() === itemToDelete.topKey || i.clientId === itemToDelete.topKey || i.label === itemToDelete.topKey);
      });
      await persistToDatabase(updated, `Deleted "${itemToDelete.name}" from database`);
    } else if (itemToDelete.parentKey && itemToDelete.subKey) {
      const updated = navItems.map((i) => {
        const matchParent = i.id?.toString() === itemToDelete.parentKey || i.clientId === itemToDelete.parentKey || i.label === itemToDelete.parentKey;
        if (matchParent && i.dropdown) {
          return {
            ...i,
            dropdown: i.dropdown.filter((s) => {
              return !(s.id?.toString() === itemToDelete.subKey || s.clientId === itemToDelete.subKey || s.label === itemToDelete.subKey);
            }),
          };
        }
        return i;
      });
      await persistToDatabase(updated, `Deleted sub-item "${itemToDelete.name}" from database`);
    }
    setItemToDelete(null);
  };

  // -------------------------------------------------------------
  // Confirm Reset Defaults
  // -------------------------------------------------------------
  const handleConfirmReset = async () => {
    setIsResetConfirmOpen(false);
    try {
      setIsSavingDb(true);
      await resetNavItems();
      toast.success("Database navigation reset to standard GB Journal defaults!");
    } catch (err: any) {
      toast.error("Failed to reset database navigation", { description: err.message });
    } finally {
      setIsSavingDb(false);
    }
  };

  // Available Icons filtered by search
  const iconKeys = useMemo(() => {
    const all = Object.keys(NAV_ICONS_MAP);
    if (!iconSearch.trim()) return all;
    return all.filter((k) => k.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [iconSearch]);

  return (
    <div className="space-y-6">
      {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[color:var(--color-gb-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 font-sans flex items-center gap-1">
              <Database className="h-3 w-3" />
              PostgreSQL Database Sync
            </span>
            {isSavingDb && (
              <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-1 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving to DB...
              </span>
            )}
          </div>
          <h2 className="text-lg font-black text-[color:var(--color-gb-ink)] font-academic tracking-tight mt-1">
            Navigation & Menu Architecture
          </h2>
          <p className="text-xs text-[color:var(--color-gb-muted)]">
            Add, edit, delete, reorder, and configure public top-level menu items, dropdown categories, and links in the database.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => loadFromDb()}
            disabled={loading || isSavingDb}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Reload from backend database"
          >
            <RotateCcw className={cn("h-3.5 w-3.5 text-slate-500", loading && "animate-spin text-blue-600")} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            title="Reset database to default GB Journal navigation"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenCreateItem}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Nav Item
          </button>
        </div>
      </div>

      {/* ── Overview Metric Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl border bg-blue-50/90 border-blue-200/80 text-blue-600 flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200/80">
              {stats.activeTop} Active
            </span>
          </div>
          <p className="text-2xl font-black text-[color:var(--color-gb-ink)] font-academic">
            {stats.totalTop}
          </p>
          <p className="text-[11px] font-semibold text-[color:var(--color-gb-muted)] mt-0.5">
            Top-Level Links (DB)
          </p>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl border bg-amber-50/90 border-amber-200/80 text-amber-600 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200/80">
              Mega Dropdowns
            </span>
          </div>
          <p className="text-2xl font-black text-[color:var(--color-gb-ink)] font-academic">
            {stats.dropdownCount}
          </p>
          <p className="text-[11px] font-semibold text-[color:var(--color-gb-muted)] mt-0.5">
            Dropdown Menus
          </p>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl border bg-purple-50/90 border-purple-200/80 text-purple-600 flex items-center justify-center">
              <FolderTree className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200/80">
              Sub-Items
            </span>
          </div>
          <p className="text-2xl font-black text-[color:var(--color-gb-ink)] font-academic">
            {stats.totalSubs}
          </p>
          <p className="text-[11px] font-semibold text-[color:var(--color-gb-muted)] mt-0.5">
            Sub-Links & Categories
          </p>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl border bg-emerald-50/90 border-emerald-200/80 text-emerald-600 flex items-center justify-center">
              <Link2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200/80">
              Direct Route
            </span>
          </div>
          <p className="text-2xl font-black text-[color:var(--color-gb-ink)] font-academic">
            {stats.directCount}
          </p>
          <p className="text-[11px] font-semibold text-[color:var(--color-gb-muted)] mt-0.5">
            Single Click Links
          </p>
        </div>
      </div>

      {/* ── Live Interactive Menu Hierarchy ─────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-[color:var(--color-gb-ink)]">
              Menu Items Sequence & Hierarchy
            </h3>
            <span className="text-xs text-slate-400">
              (Order is saved to database and matched left-to-right on public header)
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {navItems.map((item, index) => {
            const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
            const itemKey = item.id?.toString() || item.clientId || item.label;
            const isExpanded = Boolean(expandedIds[itemKey]);
            const isHidden = item.enabled === false;

            return (
              <div
                key={itemKey}
                className={cn(
                  "rounded-xl border bg-white shadow-2xs transition-all overflow-hidden",
                  isHidden
                    ? "border-slate-200/80 bg-slate-50/60 opacity-60"
                    : "border-[color:var(--color-gb-border)] hover:border-slate-300"
                )}
              >
                {/* Top Row Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-3.5 gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Expand/Collapse Chevron if dropdown */}
                    {hasDropdown ? (
                      <button
                        onClick={() => toggleExpand(itemKey)}
                        className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Link2 className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* Order Index */}
                    <span className="font-mono text-[11px] font-black text-slate-400 w-5">
                      #{index + 1}
                    </span>

                    {/* Label & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[color:var(--color-gb-ink)]">
                          {item.label}
                        </h4>
                        {hasDropdown ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            Dropdown · {item.dropdown!.length} links
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Direct Link
                          </span>
                        )}
                        {item.openInNewTab && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <ExternalLink className="h-2.5 w-2.5" /> New Tab
                          </span>
                        )}
                        {isHidden && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        Target: <strong className="text-slate-700">{item.href}</strong>
                        {item.dropdownHeader && ` · Kicker: "${item.dropdownHeader}"`}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1 self-end md:self-center shrink-0">
                    {/* Reorder Buttons */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 mr-1">
                      <button
                        onClick={() => handleMoveItem(index, "up")}
                        disabled={index === 0 || isSavingDb}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Left / Up"
                      >
                        <MoveUp className="h-3.5 w-3.5" />
                      </button>
                      <div className="w-[1px] h-4 bg-slate-200" />
                      <button
                        onClick={() => handleMoveItem(index, "down")}
                        disabled={index === navItems.length - 1 || isSavingDb}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Right / Down"
                      >
                        <MoveDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleToggleItemVisibility(itemKey)}
                      disabled={isSavingDb}
                      className={cn(
                        "p-2 rounded-lg border transition-colors cursor-pointer",
                        isHidden
                          ? "bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700"
                          : "bg-white border-slate-200 text-emerald-600 hover:bg-emerald-50"
                      )}
                      title={isHidden ? "Click to show on navbar" : "Click to hide from navbar"}
                    >
                      {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>

                    {/* Edit Top Item */}
                    <button
                      onClick={() => handleOpenEditItem(item)}
                      disabled={isSavingDb}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-[color:var(--color-gb-blue)] hover:border-blue-200 transition-colors cursor-pointer"
                      title="Edit Nav Item"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>

                    {/* Add Sub-Link */}
                    <button
                      onClick={() => handleOpenAddSubItem(itemKey)}
                      disabled={isSavingDb}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 text-xs font-bold text-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue)] hover:text-white transition-all cursor-pointer"
                      title="Add sub-link inside this menu"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Sub-link</span>
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() =>
                        setItemToDelete({
                          topKey: itemKey,
                          name: item.label,
                        })
                      }
                      disabled={isSavingDb}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete Nav Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Items List (if dropdown) */}
                {hasDropdown && isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-3 pl-8 sm:pl-12 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1">
                      <span>Dropdown Links ({item.dropdown!.length})</span>
                      {item.footerHref && (
                        <span className="text-[11px] font-normal text-blue-600">
                          Footer action: &quot;{item.footerLabel || "View all"}&quot; → {item.footerHref}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {item.dropdown!.map((sub, subIdx) => {
                        const SubIcon = getNavIcon(sub.iconName);
                        const subKey = sub.id?.toString() || sub.clientId || sub.label;
                        const isSubHidden = sub.enabled === false;

                        return (
                          <div
                            key={subKey}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-lg border bg-white transition-all",
                              isSubHidden
                                ? "border-slate-200 bg-slate-50/80 opacity-60"
                                : "border-slate-200/90 hover:border-blue-300"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Sub Icon */}
                              <div className="h-8 w-8 rounded-lg bg-[#0b1b3d] text-white flex items-center justify-center shrink-0">
                                <SubIcon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">
                                    {sub.label}
                                  </span>
                                  <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                                    {sub.href}
                                  </span>
                                  {isSubHidden && (
                                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                                      Hidden
                                    </span>
                                  )}
                                </div>
                                {sub.description && (
                                  <p className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Sub Actions */}
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {/* Sub Reorder */}
                              <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                                <button
                                  onClick={() =>
                                    handleMoveSubItem(index, subIdx, "up")
                                  }
                                  disabled={subIdx === 0 || isSavingDb}
                                  className="p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <MoveUp className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleMoveSubItem(index, subIdx, "down")
                                  }
                                  disabled={subIdx === item.dropdown!.length - 1 || isSavingDb}
                                  className="p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <MoveDown className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Toggle Sub Visibility */}
                              <button
                                onClick={() =>
                                  handleToggleSubVisibility(itemKey, subKey)
                                }
                                disabled={isSavingDb}
                                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                                title={isSubHidden ? "Show sub-item" : "Hide sub-item"}
                              >
                                {isSubHidden ? (
                                  <EyeOff className="h-3 w-3 text-slate-400" />
                                ) : (
                                  <Eye className="h-3 w-3 text-emerald-600" />
                                )}
                              </button>

                              {/* Edit Sub */}
                              <button
                                onClick={() => handleOpenEditSubItem(itemKey, sub)}
                                disabled={isSavingDb}
                                className="p-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[color:var(--color-gb-blue)] cursor-pointer"
                                title="Edit Sub-Link"
                              >
                                <Edit className="h-3 w-3" />
                              </button>

                              {/* Delete Sub */}
                              <button
                                onClick={() =>
                                  setItemToDelete({
                                    parentKey: itemKey,
                                    subKey: subKey,
                                    name: sub.label,
                                  })
                                }
                                disabled={isSavingDb}
                                className="p-1.5 rounded-md border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Delete Sub-Link"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Add / Edit Nav Item Modal ───────────────────────────── */}
      <CustomModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItem ? "Edit Navigation Menu Item" : "Create Top-Level Menu Item"}
      >
        <form onSubmit={handleSaveItem} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Menu Item Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formItemLabel}
              onChange={(e) => setFormItemLabel(e.target.value)}
              placeholder="e.g. About & Governance, Conferences, Resources"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Destination URL / Route Path <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formItemHref}
              onChange={(e) => setFormItemHref(e.target.value)}
              placeholder="e.g. /about, /conferences, https://..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formHasDropdown}
                onChange={(e) => setFormHasDropdown(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[color:var(--color-gb-blue)] focus:ring-0"
              />
              <span>Enable Mega Dropdown Menu</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formOpenInNewTab}
                onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[color:var(--color-gb-blue)] focus:ring-0"
              />
              <span>Open in New Tab</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formItemEnabled}
                onChange={(e) => setFormItemEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[color:var(--color-gb-blue)] focus:ring-0"
              />
              <span>Published / Visible</span>
            </label>
          </div>

          {/* Conditional Dropdown settings */}
          {formHasDropdown && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-3 mt-3">
              <h5 className="text-xs font-bold text-[#1e40af] flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Dropdown Header & Footer Settings
              </h5>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Dropdown Header / Category Kicker Text
                </label>
                <input
                  type="text"
                  value={formDropdownHeader}
                  onChange={(e) => setFormDropdownHeader(e.target.value)}
                  placeholder="e.g. Learn about our institution, leadership & ethics"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Footer Action Label
                  </label>
                  <input
                    type="text"
                    value={formFooterLabel}
                    onChange={(e) => setFormFooterLabel(e.target.value)}
                    placeholder="e.g. View full journal overview"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Footer Action URL
                  </label>
                  <input
                    type="text"
                    value={formFooterHref}
                    onChange={(e) => setFormFooterHref(e.target.value)}
                    placeholder="e.g. /about"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsItemModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingDb}
              className="rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSavingDb && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingItem ? "Save to Database" : "Create Nav Item"}</span>
            </button>
          </div>
        </form>
      </CustomModal>

      {/* ── Add / Edit Sub-Item Modal ─────────────────────────── */}
      <CustomModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        title={editingSubItem ? "Edit Dropdown Link" : "Add Link to Dropdown"}
      >
        <form onSubmit={handleSaveSubItem} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Link Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formSubLabel}
                onChange={(e) => setFormSubLabel(e.target.value)}
                placeholder="e.g. Editorial Board"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Destination URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formSubHref}
                onChange={(e) => setFormSubHref(e.target.value)}
                placeholder="e.g. /editorial-board"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description / Subtitle
            </label>
            <input
              type="text"
              value={formSubDesc}
              onChange={(e) => setFormSubDesc(e.target.value)}
              placeholder="e.g. Academic leadership & discipline chairs"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)]"
            />
          </div>

          {/* Visual Icon Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Choose Link Icon
              </label>
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-2 py-0.5 border border-slate-200">
                <Search className="h-3 w-3 text-slate-400" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Filter icons…"
                  className="w-20 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
              {iconKeys.map((k) => {
                const IconComp = NAV_ICONS_MAP[k];
                const isSelected = formSubIconName === k;

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFormSubIconName(k)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#0b1b3d] text-white border-[#0b1b3d] shadow-xs scale-105"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-200"
                    )}
                    title={k}
                  >
                    <IconComp className="h-4 w-4 mb-0.5" />
                    <span className="text-[9px] font-mono truncate w-full">
                      {k}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formSubEnabled}
                onChange={(e) => setFormSubEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[color:var(--color-gb-blue)] focus:ring-0"
              />
              <span>Published / Visible in dropdown</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsSubModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingDb}
              className="rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSavingDb && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingSubItem ? "Save Sub-Link to DB" : "Add Sub-Link to DB"}</span>
            </button>
          </div>
        </form>
      </CustomModal>

      {/* ── Confirm Delete Modal ────────────────────────────────── */}
      <CustomModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Confirm Removal"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Are you sure you want to delete this menu link?</p>
              <p className="mt-1 text-rose-700">
                You are removing &quot;<strong>{itemToDelete?.name}</strong>&quot;. This will immediately update the database and public site header.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setItemToDelete(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isSavingDb}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSavingDb && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </CustomModal>

      {/* ── Confirm Reset Defaults Modal ────────────────────────── */}
      <CustomModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Navigation to Defaults"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Restore default GB Journal navigation in database?</p>
              <p className="mt-1 text-amber-800">
                This will wipe and reseed the PostgreSQL database back to the standard institutional configuration.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              disabled={isSavingDb}
              className="rounded-xl bg-[color:var(--color-gb-blue)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSavingDb && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Restore Database Defaults</span>
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
