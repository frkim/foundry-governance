# Data governance

Last reviewed: **2026-09-16**.
Scope: enterprise inputs, grounding data, agent state, outputs, tool data, telemetry, and retained evidence.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; verify the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers and selected provider terms.
Recommendation: purpose-bound access, minimal data movement, explicit lifecycle ownership.
Limitations: storage, processing geography, retention, encryption, and deletion differ by model deployment, runtime, tool, and provider.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to all recommendations unless overridden.

## Microsoft capability

Foundry integrates with model, storage, search, state, and tool services whose access and retention controls are separately configured. A project is not a universal data container or a guarantee of independent storage. Record whether a capability uses service-managed storage, customer-provided resources, or external services.

Azure storage/search/database services provide service-specific authorization and encryption options. Support for customer-managed keys, private access, backups, audit logs, and deletion varies by integration. Azure RBAC access to Foundry does not establish row-, document-, or tenant-level permissions in a connected data source.

Model deployment types and providers have different processing-geography and data-handling terms. Resource location alone does not establish where inference is processed. Assess prompt/completion handling, service abuse monitoring, and optional stateful features separately; do not generalize one provider's assurances to all catalog models or tools.

The current deployment-type guidance describes Standard/Regional Provisioned processing within an Azure **geography**, not necessarily a single region; data zones are Microsoft-defined boundaries. Older privacy/PTU descriptions differ, so strict residency needs explicit confirmation rather than selecting the narrowest wording. “Not used for training” also does not mean “never retained.”

## Enterprise recommendation

Classify the **whole data path**, including derived embeddings, summaries, conversation memory, tool arguments/results, caches, and logs. Treat these as sensitive when they can reveal the underlying information. Classifications and retention intervals below are enterprise starting points, not Microsoft defaults or legal advice.

| Data class | Default AI use | Access and movement rule | Required approval |
| --- | --- | --- | --- |
| Public | Approved public material and outputs | Approved models/tools; integrity and licensing still checked | Workload owner |
| Internal | Routine internal productivity | Corporate identities, approved endpoints, no uncontrolled external tools | Workload and data owner |
| Confidential | Customer, employee, contract, or proprietary information | Minimize/redact; verified document authorization; controlled storage and egress | Data owner + security/privacy as applicable |
| Restricted / regulated | Special-category, legally restricted, credential, or high-consequence data | Dedicated required boundaries; approved geography and processing terms; exclude prohibited content | Data, security, compliance, and business risk owners |

Secrets, private keys, passwords, and bearer tokens must not be placed into model context. A tool should resolve its own credentials from a supported identity/secret mechanism outside prompts.

## Proposed enterprise policy

- **GOV-01 / GOV-04:** every dataset and derived store must have a data owner, purpose, classification, lawful/contractual basis where applicable, source lineage, residency rule, and lifecycle schedule.
- **GOV-03 / GOV-04:** enforce caller-authorized access before retrieving content; post-generation filtering alone is insufficient for tenant isolation.
- **GOV-04 / GOV-05:** approve sources, models, tools, and external MCP recipients before disclosing data; reapprove material changes in processing or retention.
- **GOV-04 / GOV-08:** minimize telemetry and redact sensitive content **before export**; content logging is opt-in, purpose-bound, restricted, and time-limited.
- **GOV-06:** treat retrieved documents and tool output as untrusted content, not permission to change identities, instructions, retention, or destinations.
- **GOV-10 / GOV-11:** retirement/deletion must cover copies and derived data, subject to legal hold and documented service limitations.
- **GOV-12:** restrictions arising from law or contract cannot be waived by an internal exception; escalate unresolved processing or deletion terms before release.

These are proposed enterprise policies; Microsoft services do not supply the organization's classification decisions or legal sign-off.

## Implementation

### 1. Maintain a data-flow and lifecycle register

Record actual resource IDs/locations, processing geography, owner, identity, tenant/document authorization, key custody, backup/replication, retention trigger, deletion mechanism, and evidence for each asset.

| Data asset | Storage / location to identify | Identity and authorization | Lifecycle decision |
| --- | --- | --- | --- |
| Source documents | System of record and staging/blob containers | Source-native user ACLs; dedicated ingestion identity | Preserve source schedule and propagate deletion/ACL changes |
| Parsed chunks and embeddings | Search/vector store plus metadata | Index-writer identity distinct from query reader; tenant/document filters | Rebuild/delete all derived records when source expires or permission changes |
| Prompts, messages, attachments | Application and runtime conversation stores | Per-user/tenant application checks; runtime storage identity | Explicit conversation expiry, attachment cleanup, user deletion handling |
| Hosted session files | Session-isolated compute and persistent `$HOME/files` | Hosted runtime identity and application file access rules | Files persist across idle periods; set explicit cleanup/retirement, not “delete when VM idles” |
| Hosted durable conversation history | Conversation store separate from session files | Verified conversation/user/tenant authorization | Deleting files does not establish conversation deletion |
| Hosted application state | Separate application state store | Application/runtime identity and key/namespace authorization | Inventory, expire, back up, and delete independently of session files and conversations |
| Agent memory and summaries | Runtime-managed or application-owned store | Namespace by authorized tenant/user/purpose | Bounded TTL and reset; prohibit unrelated cross-user memory |
| Tool inputs/results | Tool database, queues, provider logs, and caches | Per-tool operation rights and delegated context where required | Minimize payload; link retention to business purpose and external terms |
| Outputs and exports | Application DB, object store, email, or recipient system | Recipient and destination authorization before send | Apply classification/retention to generated artifacts and recipients |
| Evaluation datasets | Approved secured evaluation repository/store | Evaluator access; synthetic or de-identified data preferred | Version/consent record; delete disallowed source material and derived cases |
| Traces and application logs | Application Insights/Log Analytics or chosen sink | Separate operational and raw-content readers | Metadata baseline; short opt-in content TTL; pre-export redaction |
| Security/audit evidence | Access-restricted evidence/log store | SOC/auditor access, tamper controls as required | Retain approved duration; preserve legal hold and chain of custody |
| Backups, replicas, caches | Every service/region and external provider | Restricted restore/operator identities | Expiry and restore-time deletion reconciliation; no undeclared copies |

Do not write “stored in Foundry” where the true storage or service-managed retention boundary is unknown. Mark the gap and prevent restricted data onboarding until resolved.

Hosted session-per-VM isolation is a compute boundary, not proof of tenant authorization, retention compliance, or deletion. External-code/ephemeral agents have no persisted agent resource but may still create application logs, conversation state, files, tool records, and provider-held data; inventory those stores explicitly.

### 2. Define a measurable retention schedule

Example enterprise starting schedule, to be replaced by approved workload/legal requirements:

| Record | Starting retention | Enforcement / qualification |
| --- | --- | --- |
| Raw prompt/completion/tool content in telemetry | **Disabled by default**; approved diagnostics up to 7 days | Redact before export; access gate; automatic expiry; not the same as provider retention |
| Application conversation state | Up to 30 days after last activity where persistence is necessary | Application/runtime cleanup and deletion verification; shorter or no storage for sensitive cases |
| Operational metadata | 90 days searchable | Workspace/table policy plus export/archive inventory |
| Security and release evidence | 365 days, or approved legal/contractual schedule | Access-segmented retention; tamper protection where required; no blanket raw-content retention |
| Grounding indexes and caches | No longer than approved source validity and purpose | Event-driven delete/ACL updates plus periodic reconciliation; TTL alone may be too slow |
| Backups | Explicit service-specific recovery window | Track expiry and restricted restore; distinguish logical deletion from physical purge |

The schedule must state when the clock starts, whether deletion is logical or physical, who executes it, expected lag, legal-hold exceptions, and how completion is verified. Configuring one log workspace's retention does not delete application state, provider records, or exported archives.

### 3. Enforce RAG and tool data authorization

1. Ingest only approved sources with ownership, provenance, licensing, classification, and source ACL metadata.
2. Separate ingestion/write identities from retrieval/read identities; restrict who can change ACL metadata, indexing pipelines, or source trust.
3. Derive tenant/user filters from verified application identity, not model arguments. Enforce permitted documents before content enters context.
4. Test the selected search/vector connector's real ACL/filter behavior; do not infer security trimming from citations, index names, or private networking.
5. Include tenant, authorization scope/version, and data classification in cache keys where caching is permitted; prevent cross-user answers from shared semantic caches.
6. Propagate source deletions and access revocations to chunks, embeddings, memory, and caches within an approved maximum lag; block stale access where that cannot be guaranteed.
7. Apply output destination checks and disclosure rules to tool calls and exports. Authorized retrieval does not imply authorization to email the data externally.

Treat retrieval quality and retrieval authorization as separate gates. A grounded answer can still disclose another tenant's document.

### 4. Minimize and protect data

Redact/tokenize unnecessary personal data before model/tool use, and preserve only fields needed for the task. Keep reversible token mappings in a separately authorized service. Pseudonymized data remains sensitive where re-identification is possible.

Review encryption at rest/in transit and customer-managed-key support for each storage and runtime dependency. Document key ownership, rotation, recovery, and revocation impact. A key configuration on one resource does not establish coverage for external tools, telemetry, or all service-managed state.

For uploads and ingestion, constrain file type/size, scan using approved enterprise controls, quarantine untrusted content, and review embedded instructions or links. Protect provenance metadata from ordinary document authors and model output.

### Sensitive trace-content migration

Foundry's access-protected `AppGenAIContent` table is **Preview** and provides access protection, **not redaction**. At this review date, sensitive content is also written to ordinary tables until the documented **2026-09-30** default routing change, unless early migration is enabled. Verify the actual setting and routing with a safe fixture.

Inventory protected and ordinary tables, exports, archives, and historical copies. Changing routing does not erase history. Apply reader restrictions, numeric retention/deletion schedules, legal holds, and pre-export redaction to every copy; update queries and alerts after migration. Preview agent memory likewise needs explicit user/tenant/purpose isolation and expiry, not trust based on persistence alone.

### 5. Handle deletion, incidents, and retirement

- Identify affected subjects/tenants/source IDs and all derived copies through lineage, without copying sensitive data into incident tickets.
- Stop unauthorized ingestion/retrieval/export; revoke tool grants or disable routes as needed.
- Delete or restrict source copies, chunks, indexes, conversation state, memory, outputs, caches, queues, and exported logs according to the approved schedule.
- Preserve legally required evidence in restricted custody; record holds and expiry separately from normal retention.
- Reconcile backup restores so deleted records/ACLs are not silently reintroduced. Obtain provider confirmation where deletion relies on external services.
- Verify absence of access and scheduled ingestion after retirement; archive ownership, disposition, and residual service-retention limitations.

## Evidence

Provide the data-flow/lifecycle register, classification and processing approvals, provider terms/deployment-type review, identity/ACL mapping, retention configuration, pre-export redaction samples, and key/backup ownership. Include cross-user/tenant denial, permission-change propagation, cache isolation, and deletion/restore exercise results.

Link [agent registration](../../templates/agent-registration.md), [security review](../../checklists/security-review.md), and [compliance mapping](../24-compliance/README.md) to evidence for **GOV-01, GOV-03, GOV-04, GOV-05, GOV-06, GOV-08, GOV-11, GOV-12**. Record unresolved storage/provider gaps, not a generic “data compliant” declaration.

## Sources

- [Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/) and [model data, privacy, and security](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy).
- [Azure AI Search security overview](https://learn.microsoft.com/en-us/azure/search/search-security-overview).
- [Azure Storage security guide](https://learn.microsoft.com/en-us/azure/storage/blobs/security-recommendations).
- [Azure Monitor log data retention](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure).
- [Sensitive trace-content migration](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/traces-sensitive-content) and [model deployment types](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types).
- [Hosted agents: identity, sessions, and state](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents).
- Feature/provider verification: [Foundry register](../../references/microsoft-foundry.md), [Azure register](../../references/azure.md).

## Limitations and unresolved decisions

No universal zero-retention, customer-managed-key, residency, or immediate-deletion guarantee applies across Foundry and external tools. Confirm terms for the exact model deployment, optional stateful feature, agent runtime, and processor; evaluate service abuse-monitoring retention separately from application logs.

This repository supplies neither a legal determination nor an implemented deletion/ACL pipeline. Unknown derived storage, unsupported security trimming, or unverified processing geography is a release gap, not a policy exception automatically accepted by using a Microsoft service.
