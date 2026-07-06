<div align="center">
  <img src="./public/gb-logo-official.png" alt="Gono Bishwabidyalay logo" width="92" />

  # Gono Bishwabidyalay Journal Management Portal

  A professional academic journal website and manuscript management prototype for Gono Bishwabidyalay.
</div>

## Overview

This project is a Next.js journal management website built for publishing, discovering, submitting, reviewing, and managing scholarly work. It uses demo data to showcase the full frontend experience for a university journal platform.

The public website is inspired by established medical and academic journal sites, with support for article discovery, current issue browsing, issue archives, author guidance, reviewer guidance, editorial board pages, publication policies, and article detail pages with academic metadata.

## Core Features

- Public journal homepage with current issue, featured article, article discovery, subject areas, journal metadata, and author resources.
- Article listing with search and filters by keyword, article type, topic, author, and issue metadata.
- Article detail pages with title, authors, abstract, sections, DOI, volume/issue data, keywords, metrics, PDF action, citation action, and sharing tools.
- Current issue page with table of contents and issue metadata.
- Issue archive page for browsing volumes, issues, publication dates, article counts, and themes.
- Author guidelines page with submission categories, checklist, policies, and manuscript requirements.
- Reviewer guidance page describing invitation, review, confidentiality, and recommendation workflows.
- Editorial board page with role, department, and expertise information.
- Policies page covering peer review, ethics, plagiarism, AI-use declarations, copyright, conflicts, and correction/retraction standards.
- Authentication demo with login/register style flows.
- Role-based dashboard experience for author, reviewer, editor, admin, and super admin roles.
- Manuscript submission wizard with article type, details, authors, files, declarations, and review steps.
- Demo manuscript queue with status advancement, reviewer assignment, activity log, and role-specific tools.

## User Roles

- **Visitor**: Browse articles, issues, policies, and public journal information.
- **Author**: Create submissions, upload files, manage declarations, and track manuscript status.
- **Reviewer**: Accept review invitations, inspect assigned manuscripts, and submit structured recommendations.
- **Editor**: Triage submissions, assign reviewers, review manuscript status, and prepare editorial decisions.
- **Admin**: Manage journal content, issues, policies, article types, topics, and homepage content.
- **Super Admin**: Oversee system-wide settings, role governance, audit activity, and journal office controls.

## Tech Stack

- **Framework**: Next.js App Router
- **Language**: TypeScript / TSX
- **Package Manager**: Bun
- **Styling**: Tailwind CSS v4 with CSS variables
- **Icons**: lucide-react
- **Fonts**: next/font with academic, UI, Bangla, and monospace font variables
- **Data**: Local demo data in `src/lib/data.ts`

## Important Paths

- `src/app/page.tsx` - public homepage
- `src/app/articles` - article listing and article detail routes
- `src/app/issues` - current issue and archive pages
- `src/app/dashboard` - role-based management workspace
- `src/app/dashboard/submissions/new` - manuscript submission wizard
- `src/components` - shared site, article, dashboard, and UI components
- `src/lib/data.ts` - demo articles, issues, submissions, roles, policies, and board data
- `public/gb-logo-official.png` - Gono Bishwabidyalay logo used by the site and README

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
bun run build
```

Run lint:

```bash
bun run lint
```

## Demo Notes

This is a frontend prototype. The manuscript workflows, user roles, article data, issue data, journal metadata, and dashboard actions are powered by local demo data and client-side state. Connect production APIs, authentication, file storage, email notifications, DOI services, and database persistence before real deployment.

## Project Goal

The goal is to provide Gono Bishwabidyalay with a polished journal platform that feels credible to readers, easy for authors to submit to, efficient for reviewers and editors, and manageable for journal administrators.
