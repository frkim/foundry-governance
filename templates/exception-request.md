# Time-limited governance exception request

| Document metadata | Value |
|---|---|
| Template owner | Enterprise AI Governance Lead |
| Scope / status | Enterprise **proposed draft baseline** pending organizational ratification; a submitted form is not approval |
| Experience | Microsoft Foundry resource/project, new experience unless explicitly stated otherwise |
| Last reviewed | 2026-09-16 |
| Capability status | Verify relevant capability limits against feature-specific official references; unknown support is **verification-required** and not automatically eligible for exception |
| Evidence / exceptions | Named Exception Owner maintains the restricted record. [Policy exception rules](../governance/policies/README.md#exceptions) apply; all recommendations inherit this metadata's scope, status and exceptions unless overridden |

Use one record for a precisely bounded risk decision. No self-approval, implicit renewal or blanket waiver. Exceptions cannot authorize violation of applicable law, binding contracts, mandatory residency restrictions or other non-waivable obligations; Legal/Compliance decides eligibility. Missing evidence/approval is a **hold**. A failed technical control remains failed even when an eligible exception permits a scoped release.

## 1. Identification and exact scope

| Field | Value to complete |
|---|---|
| `exception_id`, title, requested status | `<unique ID; draft/requested/approved/active/expired/revoked/closed>` |
| Requester / change author | `<name, role and contact>` |
| Exception Owner / backup | `<person accountable for compensating controls, monitoring and remediation>` |
| `owner_business`, `owner_technical`, `owner_operations` | `<named accountable service owners and on-call>` |
| `cost_center`, `budget_owner` | `<affected allocation and funded remediation authority>` |
| `agent_id`, `component_id`, `deployment_id`, `version` | `<exact workload/dependency/deployment and immutable versions/digests; list every permitted instance>` |
| `environment`, `region`, `processing_geography`, `storage_geography` | `<only covered environments/routes/geographies; exclude all others explicitly>` |
| `risk_classification`, `data_classification`, affected users/tenants | `<risk assessment, data classes, population and transaction bounds>` |
| `dependency_ids`, identity principals and `permission_scopes` | `<affected models/tools/MCP/skills/providers, authn/authz grants; no credentials>` |
| `control_ids` / exact unmet requirement | `<GOV IDs, policy/baseline version, specific check; no “all controls” exception>` |
| Scope exclusions / maximum exposure | `<excluded tasks/data/users; numeric duration, volume, spend and transaction limits>` |
| Requested start / `expires_at` / `next_review_due_at` | `<explicit ISO 8601 UTC timestamps; finite expiry and review before expiry>` |

## 2. Justification, obligations and residual risk

| Field | Value to complete |
|---|---|
| Business necessity / alternatives considered | `<why needed; compliant alternative, reduced scope, delay or retirement; cost/impact of each>` |
| Root cause / failed or missing evidence | `<test/configuration finding, exact version and evidence URI; capability limitation source/date if relevant>` |
| Risk scenario | `<threat/event, affected data/actions/people, likelihood and impact before compensation>` |
| Compliance / contractual eligibility | `<applicable obligations, restrictions, qualified Legal/Privacy/Compliance decision and independent authority>` |
| Residual risk after compensation | `<remaining exposure, uncertainty, quantitative bounds where possible and why acceptable temporarily>` |
| Authentication/authorization and data impact | `<changed trust boundaries or scopes, redaction/retention/access effects; server-side checks retained>` |
| Related incidents / previous exceptions | `<history, prior expiry and renewal count; repeated exceptions require escalated review>` |

## 3. Compensating controls and operational acceptance

| Unmet GOV requirement / risk | Compensating measure and enforcement point | Named owner | Test / evidence URI and timestamp | Monitoring threshold / cadence / responder | Failure → containment action |
|---|---|---|---|---|---|
| `<specific failed requirement>` | `<preventive/detective/corrective alternative with limited scope>` | `<name>` | `<proof measure works on covered version>` | `<numeric trigger, frequency and on-call>` | `<disable/restrict/rollback with deadline>` |

| Required operating decision | Value to complete |
|---|---|
| Data/log retention and evidence protection | `<numeric retention periods, redaction, access, deletion/holds and evidence custodian>` |
| Quality/evaluation acceptance | `<dataset/run/version, thresholds, residual failures and independent evaluation reviewer; no hidden regressions>` |
| SLO / SOC / on-call | `<numeric objectives and window; alert delivery evidence, response authority and support acceptance>` |
| Budget / execution limits | `<currency/period, funded remediation, request/token/concurrency/transaction caps and enforcement tests>` |
| Release / rollback plan | `<exact immutable approved artifact/routes, pipeline gates, rollback steps, measured recovery and irreversible side-effect handling>` |
| Kill switch / automatic and manual triggers | `<named operator, tested enforcement points, in-flight/queued action limits; compensation failure, budget breach, incident or expiry>` |
| Expiry behavior for running workloads | `<preapproved suspend/restrict/rollback plan, operator and execution time; stop new releases relying on expired exception>` |

## 4. Remediation and verification plan

| Milestone / deliverable | Named owner | Funded dependency | Due UTC | Acceptance test / evidence | Independent verifier / result |
|---|---|---|---|---|---|
| `<restore specific control>` | `<name>` | `<team/budget/provider>` | `<before expiry>` | `<measurable pass criterion>` | `<name/status>` |

Material scope, model/tool/MCP/schema/skill, permission, data, geography, threat or compensating-control changes require re-review before relying on this exception. Shorten the review interval for high risk. Proposed default: at least monthly and before expiry; there is no automatic extension while remediation is pending.

## 5. Independent decision

The requester/change author must not act as their own risk approver. Record separate Business Risk Owner and Control/Risk Authority decisions; add Data, Privacy, Legal, IAM, Security, Operations and FinOps authorities where affected. List conflicts of interest and alternate approvers.

| Required authority | Named approver / role | Independent of requester? | Decision / conditions | Evidence / signed UTC | Approved scope / expiry |
|---|---|---|---|---|---|
| Business Risk Owner | `<name>` | `<yes; conflict check>` | `<approve/reject/hold>` | `<URI/time>` | `<exact scope/time>` |
| Control/Risk Authority | `<name>` | `<yes; conflict check>` | `<approve/reject/hold>` | `<URI/time>` | `<exact scope/time>` |
| Affected specialist authority | `<name or n/a with independently approved reason>` | `<yes>` | `<approve/reject/hold>` | `<URI/time>` | `<conditions>` |

- [ ] Eligibility, limited scope, tested compensation, remediation funding, finite expiry and independent approvals are complete.
- [ ] Inventory, [control](../governance/controls/README.md) record and release manifest reference this exception ID and precise conditions.
- [ ] Operations accepts monitoring, rollback/containment and expiry behavior before activation.

**Activation record:** `<release owner, actual start UTC, covered deployment/version, approval_id, evidence URI>`.

## 6. Re-review, expiry, revocation and closure

| Review date / trigger | Owner / independent reviewer | Evidence and compensation effectiveness | Decision / required action | Next review / expiry |
|---|---|---|---|---|
| `<scheduled/change/incident/expiry>` | `<names>` | `<URI and current scope>` | `<continue within scope/revoke/close/new request>` | `<UTC>` |

- [ ] At expiry/revocation, new releases depending on the exception stop and the approved running-workload containment/rollback plan is executed; record operator, UTC and verification evidence.
- [ ] Renewal, if eligible, is a **new independent decision** with current evidence, revised residual risk and explicit new expiry before further reliance; preserve history.
- [ ] Closure verifies the original requirement is met, temporary permissions/configurations are removed, inventory is updated and evidence retained under the approved schedule.

**Closure:** `<Control Owner, independent verifier, remediation/retest URI, closure UTC, ongoing owner and next review>`.

**Sources:** [Microsoft Foundry](../references/microsoft-foundry.md), [Azure](../references/azure.md), [policy lifecycle](../governance/policies/README.md), [standards](../governance/standards/README.md), [go-live](../checklists/go-live.md).
