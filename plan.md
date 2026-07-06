# Gono Bishwabidyalay Journal Management Website - UI and Frontend Plan

## 1. Project Goal

Build a modern journal management website for Gono Bishwabidyalay that supports both:

- A public academic journal website for readers, authors, reviewers, students, faculty, and external researchers.
- A manuscript management frontend for authors, reviewers, editors, section editors, and administrators.

The site should feel credible, calm, searchable, and publication-first. The best parts of the reference sites are their article discovery systems, issue archives, author guidance, article metadata, and clear publishing workflows. The GB version should keep those strengths while removing clutter such as ads, external commercial links, and overly dense menus.

## 2. Reference Sites Reviewed

### 2.1 Medical Journal of Australia

Reference: https://www.mja.com.au/

Important observed patterns:

- Strong top navigation with journal identity, login, publish-with-us, current issue, most recent, archive, topics, article types, podcasts, and related products.
- Search supports basic and advanced fields such as title, body, date range, article type, author surname, volume, page, and DOI.
- Homepage highlights featured/current articles, recent articles, article categories, conferences, podcasts, and footer resources.
- Current issue page groups articles by type such as Perspective, Consensus statement, Narrative review, Research, Research letter, Systematic review, and Correction.
- Article pages show article type, open access status, volume, issue, title, authors, correspondence, citation, DOI, publication date, PDF download, sharing actions, article tabs, topics, abstract sections, author information, references, and reader response/comment forms.
- Author area includes instructions, submission process, article types, editorial policies, open access information, manuscript guidelines, and reviewer instructions.
- Footer is broad and includes about, contact, editorial team, access policy, author links, advertising links, account/subscription links, privacy, disclaimer, copyright, social links, and acknowledgement text.

What to adapt:

- Advanced search with academic filters.
- Current issue and archive structure.
- Article detail metadata and PDF/download actions.
- Clear author and reviewer guidance.
- Public comment or response feature can be optional, moderated, and limited.

What to avoid:

- Too many topic links in a large dropdown.
- Advertisements.
- Multiple unrelated external product links.
- Overly long navigation menus on small screens.

### 2.2 AJGP - Australian Journal of General Practice

Reference: https://www1.racgp.org.au/ajgp/home

Important observed patterns:

- Left/top browse structure based on issues, article categories, topics, author resources, and about pages.
- Homepage strongly centers the current issue, with issue title, volume, month, theme, focus articles, and "also this month" article list.
- Issues page lists issues by volume, issue number, month, year, and theme, with pagination.
- Article categories are clear and compact, including Clinical, Case study, Editorial, Letters, Professional, Research, Viewpoint, Book review, and others.
- Topic tags provide quick topical browsing.
- Author guidelines are detailed and structured by manuscript category, including word limits, abstract requirements, references, figures/tables, key points, ethics requirements, patient consent, and peer review expectations.
- Article pages provide long-form readable article content, figures/tables, conclusion, key points, competing interests, AI declaration, provenance/peer review, funding, correspondence, references, download article action, and topic tags.

What to adapt:

- Issue-first homepage layout.
- Theme-based monthly/semester issue pages.
- Compact browse by article type and topic.
- Strong manuscript category requirements.
- Article page sections for key points, declarations, funding, peer review status, and references.

What to avoid:

- Sparse visual hierarchy in some list pages.
- Search experience that feels secondary.
- Article pages becoming too text-heavy without sticky navigation or reading tools.

## 3. Product Positioning

Suggested product name options:

- Gono Bishwabidyalay Journal
- GB Journal Portal
- Gono Bishwabidyalay Research Journal
- Journal of Gono Bishwabidyalay

Recommended positioning:

"A university journal platform for publishing, discovering, submitting, reviewing, and managing scholarly work from Gono Bishwabidyalay."

Primary audiences:

- Readers: students, faculty, researchers, alumni, and public visitors.
- Authors: faculty, students, external researchers.
- Reviewers: assigned peer reviewers and editorial board members.
- Editors: editor-in-chief, managing editors, section editors.
- Admins: journal office and system administrators.

Primary user goals:

- Find articles by issue, topic, department, author, article type, date, and keyword.
- Read article abstracts and full text.
- Download PDF files and citation metadata.
- Learn how to submit manuscripts.
- Submit and track manuscripts.
- Review assigned manuscripts.
- Make editorial decisions.
- Publish accepted articles into issues.

## 4. Design Direction

### 4.1 Visual Personality

The website should feel:

- Academic but not old-fashioned.
- Trustworthy and official.
- Clean, readable, and accessible.
- University-branded, with subtle Bangladeshi identity where appropriate.
- Efficient for repeat academic users.

Avoid a marketing-style homepage. The first screen should immediately show that this is a functioning journal platform: current issue, article search, publish/submit action, and latest articles.

### 4.2 Color System

Use official Gono Bishwabidyalay brand colors if available. If brand colors are not finalized, start with this practical academic palette:

- Primary: deep university green, `#0F5132`
- Primary dark: `#083A24`
- Accent: muted red, `#B42318`
- Secondary accent: warm gold, `#C9972B`
- Background: off-white, `#F8FAF7`
- Surface: white, `#FFFFFF`
- Border: cool gray, `#D9E1DD`
- Text: charcoal, `#18211D`
- Muted text: `#66736C`
- Success: `#157347`
- Warning: `#B7791F`
- Danger: `#B42318`
- Info: `#2563EB`

Do not let the interface become one-note green. Use green for identity and navigation, red/gold sparingly for status, calls to action, issue labels, and highlights.

### 4.3 Typography

Recommended:

- Interface font: Geist Sans, Inter, or Noto Sans.
- Article reading font: Source Serif 4, Merriweather, or Georgia fallback.
- Monospace: Geist Mono for DOI, manuscript ID, ORCID, dates, and metadata.

Typography rules:

- Public article titles should be large, serious, and readable.
- Dashboard headings should be compact.
- Article body should use a comfortable measure, around 68 to 78 characters per line.
- Metadata should be visually quiet but easy to scan.
- Do not use oversized hero typography inside dashboards or management screens.

### 4.4 Layout Style

Public site:

- Header with university/journal identity.
- Main navigation under or beside logo.
- Search always accessible.
- Current issue and latest articles visible on the homepage.
- Article cards/list rows should prioritize article title, type, authors, date, DOI/status, and short summary.
- Topic chips and article-type labels should be compact.
- Footer should be structured but not bloated.

Dashboard:

- App-shell layout with left sidebar on desktop and sheet/drawer navigation on mobile.
- Top bar with search, notifications, profile menu, and current role.
- Tables for manuscripts, assignments, decisions, users, and issues.
- Detail pages should combine metadata panels, timeline, files, comments, and action buttons.

Card usage:

- Use cards for repeated articles, dashboard stats, manuscript rows, and modals.
- Do not put cards inside cards.
- Avoid decorative floating card sections on public pages.

## 5. Public Website Information Architecture

### 5.1 Main Navigation

Recommended top-level navigation:

- Home
- Current Issue
- Articles
- Issues
- Topics
- For Authors
- Editorial Board
- About
- Submit Manuscript
- Search
- Login

Mobile:

- Logo left.
- Search icon and menu icon right.
- Menu opens as a full-height sheet with grouped links.
- Submit Manuscript should remain prominent.

### 5.2 Home Page

Purpose:

Give visitors immediate access to current issue, search, latest publications, submission guidance, and journal credibility.

Sections:

1. Header/search band
   - Journal name.
   - One-line description.
   - Search input with filters button.
   - CTAs: Submit Manuscript, View Current Issue.

2. Current issue feature
   - Volume, issue, month/year.
   - Issue theme if applicable.
   - Cover image or university/journal visual.
   - Editor's note summary.
   - Link to all articles.

3. Featured articles
   - 3 to 5 selected articles.
   - Include type badge, title, authors, abstract excerpt, publication date.

4. Latest articles
   - Dense list for recently published articles.
   - Sort by publication date.
   - Include article status: Open Access, Online First, PDF available.

5. Browse by article type
   - Research Article
   - Review Article
   - Case Study
   - Short Communication
   - Perspective
   - Editorial
   - Letter
   - Conference Abstract

6. Browse by discipline/topic
   - Public Health
   - Pharmacy
   - Veterinary and Animal Sciences
   - Medical Sciences
   - Social Sciences
   - Law and Governance
   - Basic Sciences
   - Agriculture and Environment
   - Education
   - Technology and Data

7. Author guidance preview
   - Manuscript categories.
   - Submission checklist.
   - Ethics and plagiarism policy.
   - Peer review overview.

8. Journal news/notices
   - Call for papers.
   - Special issue announcements.
   - Reviewer invitation.
   - Publication schedule.

9. Footer
   - About journal.
   - Contact editorial office.
   - Author resources.
   - Reviewer resources.
   - Policies.
   - ISSN/eISSN when available.
   - University address.
   - Social links.

### 5.3 Articles Listing Page

Route:

- `/articles`

Core functionality:

- Keyword search.
- Filter by article type.
- Filter by topic/discipline.
- Filter by issue.
- Filter by author.
- Filter by publication year.
- Filter by open access / PDF available.
- Sort by newest, oldest, most viewed, article title.
- Pagination or infinite "Load more" with stable URLs.

UI pattern:

- Left filter sidebar on desktop.
- Collapsible filter sheet on mobile.
- Article rows, not overly large cards, for easy scanning.
- Active filter chips above results.
- Empty state with clear reset action.

Article result row should show:

- Article type badge.
- Title.
- Authors.
- Short excerpt.
- Journal citation.
- DOI.
- Publication date.
- Topic chips.
- PDF/download icon if available.

### 5.4 Advanced Search

Route:

- `/search`

Fields inspired by MJA:

- Title contains.
- Abstract/body contains.
- Author surname/name.
- Date range from/to.
- Article type.
- Topic/discipline.
- Volume.
- Issue.
- DOI.
- Keywords.

UX:

- Simple search first.
- Advanced filters hidden in expandable panel.
- Search results should preserve query in URL parameters.
- Include "Save search" only for logged-in users.

### 5.5 Current Issue Page

Route:

- `/issues/current`

Content:

- Issue title/theme.
- Volume, issue number, month/year.
- Cover/visual.
- Editorial message.
- Table of contents grouped by article type.
- Download full issue PDF, if supported.
- Previous/next issue navigation.

Grouping:

- Editorial
- Research Articles
- Review Articles
- Case Studies
- Short Communications
- Perspectives
- Letters
- Abstracts
- Corrections

### 5.6 Issue Archive

Routes:

- `/issues`
- `/issues/[year]`
- `/issues/[year]/[issue]`

Archive UI:

- Year tabs or year filter.
- List issues by volume, issue, date, theme, and article count.
- Pagination for older years.
- Optional cover thumbnails.

Issue row:

- Volume 3, Issue 2
- July 2026
- Theme: Public Health and Community Medicine
- 14 articles
- View issue

### 5.7 Article Detail Page

Route:

- `/articles/[slug]`

Top metadata:

- Article type.
- Open access status.
- Volume/issue.
- Title.
- Authors.
- Affiliations.
- Corresponding author.
- DOI.
- Published date.
- Accepted date, optional.
- Keywords/topics.
- Download PDF.
- Cite article.
- Share.

Reading layout:

- Main article column.
- Sticky right sidebar on desktop with:
  - In this article.
  - Download PDF.
  - Cite.
  - Metrics.
  - Related articles.
- On mobile, sidebar actions become a sticky bottom/action menu or compact buttons below title.

Article sections:

- Abstract.
- Key points.
- Introduction.
- Methods.
- Results.
- Discussion.
- Conclusion.
- Acknowledgements.
- Funding.
- Conflicts of interest.
- Ethics approval.
- AI declaration.
- Data availability.
- Author contributions.
- References.
- Supplementary files.

Reader tools:

- Font size toggle.
- Copy DOI.
- Copy citation.
- Download citation as BibTeX/RIS.
- Print view.
- Related articles.

Optional:

- Moderated public responses/comments.
- Article metrics: views, PDF downloads, citations if available.

### 5.8 For Authors Page

Route:

- `/authors`

Sections:

- Why publish with GB Journal.
- Manuscript categories.
- Submission checklist.
- Formatting requirements.
- Ethical requirements.
- Plagiarism policy.
- AI use policy.
- Peer review process.
- Publication fees policy.
- Copyright/license policy.
- After acceptance.
- Contact editorial office.
- Submit Manuscript CTA.

Manuscript category cards:

- Research Article
- Review Article
- Case Study
- Short Communication
- Perspective/Viewpoint
- Editorial
- Letter to Editor
- Conference Abstract

Each category should include:

- Description.
- Recommended structure.
- Abstract requirement.
- Suggested word limit.
- Reference limit.
- Figure/table limit.
- Required declarations.

### 5.9 Reviewer Guidelines Page

Route:

- `/reviewers`

Sections:

- Reviewer role.
- Confidentiality.
- Conflict of interest.
- Review criteria.
- Recommendation options.
- Review deadline.
- How to submit a review.
- Reviewer recognition/certificate.

### 5.10 Editorial Board Page

Route:

- `/editorial-board`

Content:

- Editor-in-chief.
- Managing editor.
- Section editors.
- Editorial advisory board.
- Review board, optional.

Member card:

- Name.
- Role.
- Department/institution.
- Research interests.
- ORCID/Google Scholar link, optional.
- Email visibility controlled by admin.

### 5.11 About Page

Route:

- `/about`

Sections:

- Journal mission.
- Scope.
- Publication frequency.
- Publisher: Gono Bishwabidyalay.
- ISSN/eISSN when available.
- Open access policy.
- Indexing information.
- Contact details.

### 5.12 Policies Page

Route:

- `/policies`

Policy sections:

- Editorial policy.
- Peer review policy.
- Publication ethics.
- Plagiarism policy.
- AI-assisted writing policy.
- Correction/retraction policy.
- Data availability.
- Conflict of interest.
- Copyright and licensing.
- Privacy policy.

## 6. Manuscript Management Frontend

### 6.1 User Roles

Visitor:

- Browse, search, read, download public articles.

Author:

- Create submission.
- Upload files.
- Add metadata and co-authors.
- Track manuscript status.
- Respond to revision requests.
- View decision letters.

Reviewer:

- View assigned manuscripts.
- Accept/decline review invitation.
- Download blinded files.
- Submit review form.
- Recommend decision.
- View completed reviews if allowed.

Editor:

- View submissions.
- Assign section editor/reviewers.
- Check manuscript metadata.
- Send decisions.
- Request revisions.
- Move accepted manuscripts toward publication.

Admin:

- Manage users, roles, article types, topics, issues, journal settings, homepage feature order, policies, and published content.

### 6.2 Authentication Pages

Routes:

- `/login`
- `/register`
- `/forgot-password`
- `/verify-email`

Login UI:

- Email/password.
- Role-neutral login.
- Remember me.
- Forgot password.
- Register as author.

Registration fields:

- Full name.
- Email.
- Password.
- Institution.
- Department.
- Country.
- ORCID, optional.
- Research interests, optional.

### 6.3 Author Dashboard

Route:

- `/dashboard/author`

Widgets:

- Active submissions.
- Awaiting author action.
- Under review.
- Accepted.
- Rejected/withdrawn.

Primary table columns:

- Manuscript ID.
- Title.
- Article type.
- Submitted date.
- Current status.
- Last activity.
- Action.

Actions:

- Start new submission.
- Continue draft.
- View submission.
- Upload revision.
- Message editor, if enabled.
- Withdraw manuscript, if allowed.

### 6.4 New Submission Wizard

Route:

- `/dashboard/submissions/new`

Use a stepper:

1. Article type
2. Manuscript details
3. Authors and affiliations
4. Files
5. Declarations
6. Review and submit

Step 1 - Article type:

- Select article category.
- Show category requirements.

Step 2 - Manuscript details:

- Title.
- Running title.
- Abstract.
- Keywords.
- Topic/discipline.
- Cover letter.

Step 3 - Authors:

- Add co-authors.
- Author order drag handle.
- Corresponding author selection.
- Affiliation fields.
- ORCID field.

Step 4 - Files:

- Manuscript file.
- Title page.
- Figures.
- Tables.
- Supplementary files.
- Ethics approval.
- Reporting checklist.

Step 5 - Declarations:

- Conflict of interest.
- Funding.
- Ethics approval.
- Patient consent, if applicable.
- Data availability.
- AI use declaration.
- Copyright/license agreement.

Step 6 - Review:

- Summary of all metadata.
- Missing field warnings.
- Final confirmation.
- Submit button.

UX requirements:

- Autosave drafts.
- Step validation.
- Save and exit.
- Progress indicator.
- File upload status.
- Clear error messages.

### 6.5 Manuscript Detail Page

Route:

- `/dashboard/submissions/[id]`

Sections:

- Status banner.
- Metadata summary.
- Files.
- Timeline.
- Editorial messages.
- Reviews and decisions, role-dependent.
- Revision history.
- Activity log.

Status examples:

- Draft
- Submitted
- Initial Check
- With Editor
- Reviewer Invitation
- Under Review
- Reviews Complete
- Revision Requested
- Revised Manuscript Submitted
- Accepted
- Copyediting
- Proofing
- Scheduled for Issue
- Published
- Rejected
- Withdrawn

### 6.6 Reviewer Dashboard

Route:

- `/dashboard/reviewer`

Widgets:

- Pending invitations.
- Reviews due soon.
- Completed reviews.

Review assignment row:

- Manuscript ID.
- Title.
- Article type.
- Invitation date.
- Due date.
- Status.
- Action.

Invitation flow:

- Accept review.
- Decline review with reason.
- Conflict of interest checkbox.

Review form:

- Confidential comments to editor.
- Comments to author.
- Ratings:
  - Originality.
  - Methodology.
  - Clarity.
  - Significance.
  - Ethical soundness.
- Recommendation:
  - Accept.
  - Minor revision.
  - Major revision.
  - Reject.
- Attach annotated file, optional.

### 6.7 Editor Dashboard

Route:

- `/dashboard/editor`

Widgets:

- New submissions.
- Awaiting reviewer assignment.
- Under review.
- Reviews overdue.
- Decisions pending.
- Accepted awaiting publication.

Main views:

- Submission queue.
- Reviewer assignment.
- Decision workspace.
- Issue builder.
- Published articles.

Submission queue filters:

- Status.
- Article type.
- Topic/discipline.
- Assigned editor.
- Date range.
- Search by title, author, ID.

Reviewer assignment:

- Search reviewer by expertise.
- See reviewer workload.
- Send invitation.
- Set due date.
- Track invitation status.

Decision workspace:

- Review summaries.
- Decision letter editor.
- Template snippets.
- Final decision buttons.

### 6.8 Admin Dashboard

Route:

- `/dashboard/admin`

Modules:

- Users and roles.
- Journal settings.
- Article types.
- Topics/disciplines.
- Issues and volumes.
- Homepage featured articles.
- Policies and static pages.
- Email templates.
- Submission form settings.
- Analytics.

Issue builder:

- Create volume and issue.
- Set issue title/theme.
- Add accepted articles.
- Reorder table of contents.
- Add cover image.
- Publish issue.

## 7. Frontend Route Plan for Next.js App Router

Recommended route structure:

```text
src/app/
  (public)/
    layout.tsx
    page.tsx
    articles/
      page.tsx
      [slug]/
        page.tsx
    issues/
      page.tsx
      current/
        page.tsx
      [year]/
        page.tsx
        [issue]/
          page.tsx
    topics/
      page.tsx
      [slug]/
        page.tsx
    authors/
      page.tsx
    reviewers/
      page.tsx
    editorial-board/
      page.tsx
    about/
      page.tsx
    policies/
      page.tsx
    search/
      page.tsx
  (auth)/
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx
  dashboard/
    layout.tsx
    page.tsx
    author/
      page.tsx
    reviewer/
      page.tsx
    editor/
      page.tsx
    admin/
      page.tsx
    submissions/
      new/
        page.tsx
      [id]/
        page.tsx
    reviews/
      [id]/
        page.tsx
    issues/
      page.tsx
      [id]/
        page.tsx
```

Use route groups to keep public, auth, and dashboard layouts separate.

## 8. Component Plan

### 8.1 Shared Public Components

- `SiteHeader`
- `MobileNavSheet`
- `JournalLogo`
- `SearchBar`
- `AdvancedSearchPanel`
- `ArticleCard`
- `ArticleListRow`
- `ArticleTypeBadge`
- `TopicChip`
- `IssueFeature`
- `IssueTableOfContents`
- `ArticleMetadata`
- `ArticleActions`
- `ArticleSidebarNav`
- `CitationDialog`
- `PdfDownloadButton`
- `AuthorList`
- `ReferenceList`
- `PolicySection`
- `SiteFooter`

### 8.2 Dashboard Components

- `DashboardShell`
- `DashboardSidebar`
- `DashboardTopbar`
- `RoleSwitcher`
- `StatusBadge`
- `MetricCard`
- `DataTable`
- `FilterToolbar`
- `SubmissionStepper`
- `FileUploadDropzone`
- `AuthorEditor`
- `DeclarationForm`
- `Timeline`
- `ReviewForm`
- `DecisionPanel`
- `ReviewerPicker`
- `IssueBuilder`
- `NotificationMenu`

### 8.3 UI Library Recommendation

Use:

- shadcn/ui for Button, Input, Textarea, Select, Dialog, Sheet, Tabs, Table, Badge, Card, DropdownMenu, Separator, Skeleton, Alert, Form.
- lucide-react for icons.
- Tailwind CSS for layout and theme tokens.
- React Hook Form plus Zod for complex forms.
- TanStack Table for dashboard tables.
- Optional: SWR or TanStack Query for client-side dashboard data.

## 9. Data Objects Needed by the Frontend

Article:

- id
- slug
- title
- abstract
- articleType
- authors
- affiliations
- correspondingAuthor
- doi
- volume
- issue
- publishedAt
- acceptedAt
- pages
- keywords
- topics
- pdfUrl
- fullTextHtml
- references
- declarations
- metrics
- relatedArticles

Issue:

- id
- year
- volume
- issueNumber
- month
- title
- theme
- coverImage
- description
- publishedAt
- articles

Submission:

- id
- title
- articleType
- abstract
- keywords
- authors
- files
- declarations
- status
- submittedAt
- updatedAt
- assignedEditor
- reviewers
- timeline
- decision

User:

- id
- name
- email
- role
- institution
- department
- country
- orcid
- expertise
- avatar
- status

## 10. Frontend State and Interaction Plan

Public pages:

- Prefer Server Components for article lists, issue pages, and article pages.
- Use URL search params for filters and search queries.
- Use Client Components only for interactive filters, dialogs, mobile nav, citation copy, font size controls, and dashboards.

Dashboard:

- Use client components for forms, tables, file upload, reviewer assignment, and stepper flows.
- Keep filter state in URL where possible.
- Autosave submission drafts every 20 to 30 seconds after changes.
- Use optimistic UI for small updates like marking notifications read or saving draft sections.

Search:

- Simple search should work from the header.
- Advanced search should redirect to `/search` with query params.
- Results should be bookmarkable and shareable.

Forms:

- Use inline validation.
- Show required fields clearly.
- Prevent final submission until all required steps pass.
- Keep destructive actions inside confirmation dialogs.

## 11. Responsive Behavior

Desktop:

- Public pages use a max-width content container.
- Article pages use main reading column plus sticky sidebar.
- Dashboard uses sidebar plus data-dense tables.

Tablet:

- Navigation collapses some links into menu.
- Article sidebar moves below metadata or becomes sticky top anchor bar.
- Dashboard tables become horizontally scrollable if needed.

Mobile:

- Header uses logo, search icon, menu icon.
- Public article cards become compact vertical rows.
- Filters open in a sheet.
- Article action buttons wrap cleanly.
- Dashboard uses bottom-friendly action buttons and stacked detail panels.
- Submission wizard steps become a compact progress indicator.

## 12. Accessibility Plan

- Semantic headings in correct order.
- Keyboard accessible menus, dialogs, tabs, and filters.
- Visible focus states.
- High contrast text and badges.
- Form labels must be explicit, not placeholder-only.
- Tables should have proper headers and captions when needed.
- Article pages should support print view.
- Images require useful alt text.
- PDF links should include file type and size when known.
- Avoid hover-only controls.

## 13. SEO and Metadata Plan

Public pages need:

- Dynamic title and description.
- Open Graph metadata.
- Canonical URLs.
- Article schema.org metadata.
- Breadcrumbs.
- Sitemap.
- RSS feed for latest articles.
- Robots-safe public article URLs.

Article metadata should include:

- Title.
- Authors.
- Abstract.
- DOI.
- Published date.
- Modified date.
- Journal name.
- Volume and issue.
- Keywords.

## 14. Performance Plan

- Use Next.js App Router with Server Components for public content.
- Use `next/image` for cover images, author photos, and article figures.
- Use `next/font` for fonts.
- Avoid shipping dashboard JavaScript to public article pages.
- Paginate article lists.
- Cache public issue/article queries.
- Stream dashboard panels with loading skeletons.
- Lazy load heavy dashboard modules such as rich text editor, file uploader, and issue builder.

## 15. Content Management Plan

Admin-editable content:

- Homepage featured articles.
- Current issue highlight.
- Journal notices.
- Author guidelines.
- Reviewer guidelines.
- Policies.
- Editorial board.
- Topics.
- Article types.
- Static footer links.

Publishing flow:

1. Accepted submission moves to copyediting.
2. Editor/admin creates article page draft.
3. Article metadata and PDF are attached.
4. Article is assigned to issue or marked Online First.
5. Article is previewed.
6. Article is published.
7. Search index and sitemap update.

## 16. Suggested MVP Scope

MVP public site:

- Home.
- Articles listing.
- Article detail.
- Current issue.
- Issue archive.
- Search.
- For Authors.
- Editorial Board.
- About.
- Login/register.

MVP management:

- Author registration/login.
- New submission wizard.
- Author submission tracking.
- Editor submission queue.
- Reviewer assignment mock or basic flow.
- Reviewer dashboard and review form.
- Admin issue/article publishing basics.

MVP can use mock data first, then connect backend APIs later.

## 17. Future Enhancements

- DOI integration.
- ORCID login/linking.
- Crossref citation export.
- Google Scholar optimized metadata.
- Plagiarism report upload/integration.
- Reviewer certificates.
- Email notification system.
- Public article metrics.
- Full issue PDF generation.
- Multilingual summaries in Bangla and English.
- Department-level journal sections.
- Conference abstract supplements.
- Special issue workflows.
- Moderated reader responses.

## 18. Recommended Build Sequence

Phase 1 - Design system and public shell:

- Configure Next.js, Tailwind, shadcn/ui, fonts, colors, layout tokens.
- Build public header, footer, article cards, badges, topic chips, search bar.

Phase 2 - Public journal pages:

- Home.
- Articles.
- Article detail.
- Current issue.
- Issues archive.
- Search.
- Author guidelines.

Phase 3 - Authentication and dashboards:

- Login/register pages.
- Dashboard shell.
- Role-based landing pages.

Phase 4 - Submission workflow:

- Submission wizard.
- Draft autosave UI.
- File upload UI.
- Submission detail/timeline.

Phase 5 - Review and editorial workflow:

- Reviewer invitation and review form.
- Editor queue.
- Reviewer assignment.
- Decision panel.

Phase 6 - Admin publishing:

- Article management.
- Issue builder.
- Static page/policy management.
- Homepage feature management.

Phase 7 - Polish:

- Accessibility pass.
- Mobile QA.
- Empty/loading/error states.
- SEO metadata.
- Performance review.

## 19. Page-Level UI Notes

Home:

- Lead with current issue, search, and latest scholarship.
- Keep submit button visible.
- Avoid a giant decorative hero.

Article detail:

- Make the reading experience excellent.
- Use sticky in-page navigation.
- Keep PDF, cite, and share actions visible but not distracting.

Search:

- Make advanced search useful for academics.
- Filters must be easy to reset.

Dashboard:

- Dense, quiet, operational.
- Prioritize status, deadlines, and next action.
- Tables should be scannable.

Submission wizard:

- Make authors feel guided.
- Show requirements before they upload.
- Autosave and validate step by step.

Reviewer flow:

- Make deadlines and conflict checks clear.
- Separate comments to author from confidential comments to editor.

Editor flow:

- Give editors fast triage tools.
- Show manuscript timeline and review state clearly.

## 20. Success Criteria

The finished frontend should allow a user to:

- Find a recent article in under 30 seconds.
- Browse issues by year and theme.
- Understand manuscript submission requirements without contacting the office.
- Submit a manuscript through a guided flow.
- Track manuscript status from dashboard.
- Complete a reviewer assignment.
- Let an editor assign reviewers and issue a decision.
- Publish an accepted article into an issue.
- Use the site comfortably on mobile.

## 21. Key Implementation Reminders for Next.js

- Use App Router route groups for public, auth, and dashboard sections.
- Keep public article/issue pages as Server Components when possible.
- Push `"use client"` only into interactive components.
- Use URL search params for article filters.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` for important route segments.
- Use `next/image` and `next/font`.
- Validate all complex forms with Zod.
- Keep role authorization checked server-side too; do not rely only on client-side route hiding.
- Use accessible shadcn/ui primitives for dialogs, sheets, tabs, tables, and forms.

