export interface ManuscriptTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  defaultTitle: string;
  initialHtml: string;
}

export const MANUSCRIPT_TEMPLATES: ManuscriptTemplate[] = [
  {
    id: "imrad",
    name: "Empirical Research Article (IMRaD)",
    badge: "Standard Peer-Review",
    description: "The gold standard scientific structure: Introduction, Materials & Methods, Results, and Discussion.",
    defaultTitle: "Investigation into Novel Therapeutic Interventions and Clinical Outcomes: An Empirical Study",
    initialHtml: `
<h1 style="text-align: center; font-family: 'Times New Roman', serif; font-size: 20pt; line-height: 1.3; margin-bottom: 12pt; font-weight: bold;">
  Investigation into Novel Therapeutic Interventions and Clinical Outcomes: An Empirical Study
</h1>

<p style="text-align: center; font-size: 11pt; color: #555; font-style: italic; margin-bottom: 24pt;">
  [Blinded for Peer Review — Author Details Withheld Pursuant to Double-Blind Policy]
</p>

<div style="border-top: 1.5pt solid #333; border-bottom: 1.5pt solid #333; padding: 14pt 0; margin-bottom: 24pt;">
  <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8pt;">
    Abstract
  </h2>
  <p style="font-size: 11pt; line-height: 1.6; text-align: justify; margin-bottom: 8pt;">
    <strong>Background &amp; Objective:</strong> Summarize the primary research question, clinical or theoretical hypothesis, and rationale for this investigation within current scholarly literature.<br/>
    <strong>Methods:</strong> Detail the study design, sample size (n = ...), demographic parameters, randomized appraisal protocols, and statistical software utilized for analysis.<br/>
    <strong>Results:</strong> State the core quantitative and qualitative findings, including statistically significant correlations (p &lt; 0.05, 95% CI), key effect sizes, and primary outcomes.<br/>
    <strong>Conclusions:</strong> Articulate the overarching scientific contribution, clinical or policy implications, and future directions for longitudinal verification.
  </p>
  <p style="font-size: 10.5pt; margin-top: 8pt;">
    <strong>Keywords:</strong> Clinical Epidemiology, Double-Blind Appraisal, Public Health Therapeutics, Empirical Methodology, Biostatistics
  </p>
</div>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  1. Introduction
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  The rapid emergence of complex multi-system pathologies has necessitated rigorous empirical investigation into novel intervention paradigms [1]. Contemporary literature highlights persistent challenges in achieving sustained therapeutic efficacy while minimizing adverse metabolic consequences [2]. While preliminary clinical trials have provided foundational insights, longitudinal evaluations across diverse demographic cohorts remain scarce.
</p>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  This investigation aims to address this critical knowledge gap by rigorously evaluating treatment protocols under standardized double-blind conditions. The specific objectives are threefold: (a) determine baseline response thresholds, (b) quantify biomarker changes over a 24-week intervention cycle, and (c) examine safety profiles across randomized patient subgroups.
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  2. Materials and Methods
</h2>
<h3 style="font-size: 12pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;">
  2.1 Study Design and Ethical Clearance
</h3>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  This prospective, randomized, double-blind controlled trial was conducted in accordance with the Declaration of Helsinki and approved by the Institutional Ethics Review Committee (Protocol Approval No. GB-ERC-2025-042). All participating subjects provided written informed consent prior to enrollment.
</p>

<h3 style="font-size: 12pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;">
  2.2 Sampling and Intervention Protocols
</h3>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  Participants were stratified based on baseline severity indices and randomly allocated (1:1) to either the active intervention group or the control comparator. Dosing schedules were strictly regulated, with continuous biometric telemetry recording physiological response metrics at standardized 48-hour intervals.
</p>

<h3 style="font-size: 12pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;">
  2.3 Statistical Analysis
</h3>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  Continuous variables are expressed as mean &plusmn; standard deviation (SD) or median with interquartile range (IQR). Between-group differences were evaluated using two-tailed Student's t-tests and multivariate analysis of variance (MANOVA). Statistical significance was defined at &alpha; = 0.05.
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  3. Results
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  A total of 180 subjects completed the full 24-week protocol without protocol deviations. The active cohort demonstrated a statistically significant improvement in primary response metrics compared to the comparator arm (48.6% vs. 21.4%, p &lt; 0.001).
</p>

<div style="margin: 20pt 0;">
  <p style="font-size: 10.5pt; font-weight: bold; margin-bottom: 4pt;">
    Table 1. Baseline Demographic and Clinical Characteristics of Study Cohort (N = 180)
  </p>
  <table style="width: 100%; border-collapse: collapse; font-size: 10.5pt; text-align: left;">
    <thead>
      <tr style="border-top: 1.5pt solid #000; border-bottom: 1pt solid #000;">
        <th style="padding: 6pt 8pt; font-weight: bold;">Parameter</th>
        <th style="padding: 6pt 8pt; font-weight: bold;">Control Arm (n = 90)</th>
        <th style="padding: 6pt 8pt; font-weight: bold;">Intervention Arm (n = 90)</th>
        <th style="padding: 6pt 8pt; font-weight: bold;">p-value</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 0.5pt solid #ddd;">
        <td style="padding: 6pt 8pt;">Age (years, mean &plusmn; SD)</td>
        <td style="padding: 6pt 8pt;">52.4 &plusmn; 8.1</td>
        <td style="padding: 6pt 8pt;">51.9 &plusmn; 7.8</td>
        <td style="padding: 6pt 8pt;">0.672</td>
      </tr>
      <tr style="border-bottom: 0.5pt solid #ddd;">
        <td style="padding: 6pt 8pt;">Female Sex (%)</td>
        <td style="padding: 6pt 8pt;">46 (51.1%)</td>
        <td style="padding: 6pt 8pt;">48 (53.3%)</td>
        <td style="padding: 6pt 8pt;">0.768</td>
      </tr>
      <tr style="border-bottom: 0.5pt solid #ddd;">
        <td style="padding: 6pt 8pt;">Baseline Biomarker Level (ng/mL)</td>
        <td style="padding: 6pt 8pt;">14.2 &plusmn; 3.6</td>
        <td style="padding: 6pt 8pt;">14.5 &plusmn; 3.9</td>
        <td style="padding: 6pt 8pt;">0.589</td>
      </tr>
      <tr style="border-bottom: 1.5pt solid #000;">
        <td style="padding: 6pt 8pt;">Week 24 Biomarker Level (ng/mL)</td>
        <td style="padding: 6pt 8pt;">13.8 &plusmn; 3.2</td>
        <td style="padding: 6pt 8pt;">7.4 &plusmn; 1.8</td>
        <td style="padding: 6pt 8pt;">&lt; 0.001</td>
      </tr>
    </tbody>
  </table>
  <p style="font-size: 9.5pt; color: #666; margin-top: 4pt; font-style: italic;">
    Note: Values represent mean &plusmn; standard deviation unless otherwise indicated. Evaluated via independent samples t-test.
  </p>
</div>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  4. Discussion
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  The findings of this empirical study substantiate the therapeutic viability of targeted intervention regimes within randomized clinical cohorts. The marked reduction in physiological biomarkers observed in the intervention arm aligns closely with prior mechanistic hypotheses proposed by Rahman et al. [3], while providing novel longitudinal confirmation over extended observational windows.
</p>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  Several strengths distinguish this investigation, including strict double-blind randomization, minimal attrition (3.2%), and comprehensive biomarker telemetry. However, certain limitations warrant consideration, notably the geographical confinement of participant recruitment to tertiary health centers in central Bangladesh. Future multi-center replications are recommended to confirm external generalizability.
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  5. Conclusion
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  In conclusion, the proposed intervention provides a statistically robust and clinically meaningful therapeutic alternative. Integrating these methodologies into standardized clinical pathways offers substantial potential to optimize patient outcomes and reduce overall healthcare burdens.
</p>

<div style="margin-top: 24pt; padding: 12pt; background-color: #fafafa; border: 1pt solid #eee;">
  <h3 style="font-size: 11pt; font-weight: bold; margin-bottom: 6pt;">Declarations</h3>
  <p style="font-size: 10pt; line-height: 1.6; margin-bottom: 4pt;"><strong>Ethics Approval:</strong> Approved by the Institutional Ethics Committee (Ref: GB-ERC-2025-042).</p>
  <p style="font-size: 10pt; line-height: 1.6; margin-bottom: 4pt;"><strong>Conflict of Interest:</strong> The authors declare no competing financial or academic interests.</p>
  <p style="font-size: 10pt; line-height: 1.6; margin-bottom: 4pt;"><strong>Data Availability:</strong> Anonymized datasets are available upon reasonable request from the corresponding author.</p>
</div>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 24pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  References
</h2>
<ol style="font-size: 10.5pt; line-height: 1.8; margin-left: 20pt;">
  <li>Smith, J. A., &amp; Johnson, B. K. (2024). Mechanistic pathways in contemporary clinical therapeutics. <em>Journal of Biomedical Science</em>, 42(3), 145–158. https://doi.org/10.1016/j.jbs.2024.01.012</li>
  <li>World Health Organization. (2023). <em>Global surveillance and clinical standards in non-communicable disease control</em>. WHO Guidelines Approved by the Guidelines Review Committee. Geneva.</li>
  <li>Rahman, L., Islam, S., &amp; Chowdhury, M. (2025). Clinical biomarker responses to double-blind therapeutic appraisal: A multicenter trial. <em>GB Journal of Research</em>, 12(1), 34–48.</li>
  <li>Chen, Y., &amp; Martinez, P. (2023). Randomized trial telemetry and patient compliance indices. <em>Lancet Digital Health</em>, 5(8), e512–e524.</li>
</ol>
`
  },
  {
    id: "review",
    name: "Systematic / Literature Review",
    badge: "Evidence Synthesis",
    description: "Structured PRISMA-compliant synthesis: Search Strategy, Inclusion Criteria, Thematic Extraction, and Appraisal.",
    defaultTitle: "Comprehensive Systematic Review on Evidence-Based Protocols and Methodological Advances",
    initialHtml: `
<h1 style="text-align: center; font-family: 'Times New Roman', serif; font-size: 20pt; line-height: 1.3; margin-bottom: 12pt; font-weight: bold;">
  Comprehensive Systematic Review on Evidence-Based Protocols and Methodological Advances
</h1>

<p style="text-align: center; font-size: 11pt; color: #555; font-style: italic; margin-bottom: 24pt;">
  [Blinded for Peer Review — Author Details Withheld Pursuant to Double-Blind Policy]
</p>

<div style="border-top: 1.5pt solid #333; border-bottom: 1.5pt solid #333; padding: 14pt 0; margin-bottom: 24pt;">
  <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8pt;">
    Abstract
  </h2>
  <p style="font-size: 11pt; line-height: 1.6; text-align: justify; margin-bottom: 8pt;">
    <strong>Rationale:</strong> Synthesizes recent scholarly discourse and identifies methodological discrepancies across published trials.<br/>
    <strong>Eligibility Criteria:</strong> Peer-reviewed studies published between 2018 and 2025 assessing primary empirical endpoints.<br/>
    <strong>Synthesis:</strong> Qualitative thematic categorization paired with risk-of-bias appraisals according to PRISMA guidelines.<br/>
    <strong>Conclusion:</strong> Identifies persistent methodological heterogeneity and proposes standardized reporting benchmarks.
  </p>
  <p style="font-size: 10.5pt; margin-top: 8pt;">
    <strong>Keywords:</strong> Systematic Review, PRISMA, Methodological Synthesis, Evidence-Based Appraisal
  </p>
</div>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  1. Introduction
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  Over the past decade, scholarly literature addressing standardized clinical interventions has expanded exponentially. However, differing outcome measures and variable sample sizes have produced conflicting consensus recommendations. This systematic review provides a rigorous, transparent synthesis of published trials to establish evidence-based guidelines.
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  2. Search Strategy and Selection Criteria
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  A systematic search of PubMed, Scopus, Web of Science, and Google Scholar was performed covering publications through December 2025. Search strings incorporated MeSH terms and boolean operators. Studies were independently screened by two blinded reviewers with inter-rater reliability evaluated via Cohen's kappa (&kappa; = 0.88).
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  3. Thematic Synthesis and Risk of Bias
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  From an initial pool of 1,420 records, 46 met full inclusion criteria. Thematic categorization revealed three distinct methodological clusters: (a) diagnostic accuracy metrics, (b) implementation fidelity, and (c) long-term prognostic stability. Risk of bias was appraised using the Cochrane RoB 2 tool.
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  4. Discussion and Future Recommendations
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  The evidence strongly indicates that methodological standardization significantly enhances reproducibility. Future studies should prioritize pre-registered protocols and open-access data deposition.
</p>

<h2 style="font-size: 14pt; font-weight: bold; margin-top: 24pt; margin-bottom: 10pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 4pt;">
  References
</h2>
<ol style="font-size: 10.5pt; line-height: 1.8; margin-left: 20pt;">
  <li>Page, M. J., et al. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. <em>BMJ</em>, 372, n71.</li>
  <li>Higgins, J. P., et al. (2019). Cochrane handbook for systematic reviews of interventions. <em>John Wiley &amp; Sons</em>.</li>
</ol>
`
  },
  {
    id: "case-report",
    name: "Case Report / Short Communication",
    badge: "Brief Report",
    description: "Concise scholarly structure: Abstract, Case Presentation / Brief Methods, Discussion, and Key Lessons.",
    defaultTitle: "Unusual Presentation and Clinical Management of Rare Pathological Phenotype: A Case Report",
    initialHtml: `
<h1 style="text-align: center; font-family: 'Times New Roman', serif; font-size: 18pt; line-height: 1.3; margin-bottom: 12pt; font-weight: bold;">
  Unusual Presentation and Clinical Management of Rare Pathological Phenotype: A Case Report
</h1>

<p style="text-align: center; font-size: 11pt; color: #555; font-style: italic; margin-bottom: 24pt;">
  [Blinded for Peer Review — Author Details Withheld Pursuant to Double-Blind Policy]
</p>

<div style="border-top: 1.5pt solid #333; border-bottom: 1.5pt solid #333; padding: 12pt 0; margin-bottom: 20pt;">
  <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-bottom: 6pt;">
    Abstract
  </h2>
  <p style="font-size: 11pt; line-height: 1.6; text-align: justify;">
    We present an atypical clinical manifestation observed at a tertiary referral center. Detailed diagnostic profiling, serial radiological evaluations, and multimodal therapeutic strategies are described. The report underscores critical diagnostic pitfalls and diagnostic indicators for practicing clinicians.
  </p>
  <p style="font-size: 10pt; margin-top: 6pt;">
    <strong>Keywords:</strong> Case Report, Clinical Diagnostic, Rare Phenotype, Therapeutic Protocol
  </p>
</div>

<h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 3pt;">
  1. Introduction &amp; Background
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  Uncommon clinical manifestations often challenge conventional diagnostic algorithms, resulting in delayed interventions and suboptimal patient prognoses. Reporting unusual presentations provides invaluable empirical insights for ongoing clinical practice.
</p>

<h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 3pt;">
  2. Case Presentation
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  A 47-year-old patient presented with acute non-specific symptomatology refractory to standard initial therapies. Comprehensive laboratory profiling revealed elevated inflammatory markers. Subsequent histological examination confirmed the diagnosis of an atypical variant.
</p>

<h2 style="font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 3pt;">
  3. Discussion &amp; Lessons Learned
</h2>
<p style="font-size: 12pt; line-height: 2.0; text-align: justify; text-indent: 0.5in; margin-bottom: 12pt;">
  This case illustrates the necessity of maintaining a high index of clinical suspicion when managing refractory conditions. Early multidisciplinary consultation and targeted biomarker profiling were pivotal in achieving complete clinical resolution.
</p>

<h2 style="font-size: 13pt; font-weight: bold; margin-top: 20pt; margin-bottom: 8pt; border-bottom: 0.75pt solid #ccc; padding-bottom: 3pt;">
  References
</h2>
<ol style="font-size: 10.5pt; line-height: 1.8; margin-left: 20pt;">
  <li>Gagnier, J. J., et al. (2013). The CARE guidelines: consensus-based clinical case reporting guideline development. <em>Annals of Internal Medicine</em>, 159(9), 640–645.</li>
</ol>
`
  }
];
