# Worked design: permission-aware RAG knowledge assistant

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies throughout. This is a **worked design**, not deployable IaC or a tested implementation.
All inventory values and numerical acceptance targets are fictitious design inputs; no personal data or credentials are included.
Field names are planning labels, not Azure resource or API schema fields.

## Scenario and inventory

An engineering assistant answers questions about synthetic internal design manuals and cites authorized sources.
Some manuals are restricted to a specialist group; unauthorized content must never enter generation context.

| Planning field | Fictitious value |
| --- | --- |
| Workload / data owner | `design-rag-01` / Engineering Knowledge Team |
| Environment / classification | Evaluation design / Internal synthetic manuals |
| Foundry scopes | `design-knowledge-resource` / `design-knowledge-project` |
| Identity labels | `design-ingestion-writer`, `design-retrieval-reader` |
| Dataset / index labels | `design-manuals-set-a` / `design-manual-index-v1` |
| Access groups | `design-general-readers`, `design-specialist-readers` |
| Retention constraint | Approved source schedule also applies to derived chunks, embeddings, and caches |

## Concrete decisions

- Separate ingestion writes from runtime queries and keep ACL metadata with each retrievable unit.
- Resolve current caller entitlements before retrieval; a shared query identity is not sufficient authorization.
- Use one index only if authorization filtering and administrative isolation meet requirements; otherwise use approved dedicated data scopes.
- Start with read-only answers and citations; no tools may change source permissions or publish generated content automatically.

## Identity flow and controls

1. An ingestion identity reads only approved sources, classifies content, and writes versioned chunks with source/access metadata.
2. The application authenticates the user and resolves trusted current entitlements.
3. The retrieval layer applies mandatory access filters before returning context to the model; absent or invalid entitlement information denies retrieval.
4. Minimize authorized context and treat its instructions as untrusted; validate citations without revealing inaccessible source titles.
5. Propagate source revocation/deletion to indexes and caches, and recheck authorization before serving cached answers or conversation context.

## Acceptance evidence to collect

| Check | Proposed pass condition | Owner / evidence |
| --- | --- | --- |
| Retrieval authorization | General readers never receive specialist chunks, citations, or cached answers | Data owner / cross-role denial results |
| Revocation | Access changes invalidate affected retrieval and cached context within the approved 15-minute trial target | Data/operations owners / propagation trace |
| Grounding | At least 90 of 100 synthetic questions meet citation and support rubrics | Product owner / versioned evaluation |
| Failure behavior | Unavailable retrieval yields an explicit limitation, not fabricated source claims | App owner / outage evaluation |

## Rollback and kill switch

Disable retrieval and cached-answer serving for an affected corpus; stop ingestion if corruption or unauthorized access is suspected.
Quarantine suspect chunks and invalidate derived state before restoring a previous index snapshot.
Reconcile current source ACLs and deletions before rollback activation; an older index can reintroduce revoked content.

## Cost / quality tradeoff and next steps

Compare chunk size, retrieved-context count, ranking, and model choice against the same authorized-question set.
More context can improve coverage but raises token cost, latency, and disclosure impact; rejected or unsupported answers are preferable to unauthorized retrieval.
Follow [RAG architecture](../../architecture/reference-architectures/README.md#5-rag), [layered controls](../../architecture/decision-trees/README.md#11-foundry-guardrails-vs-application-controls), and the [governance chapter index](../../README.md).
Companion chapters: [data governance](../../docs/05-data-governance/README.md), [identity/access](../../docs/03-identity-access/README.md), [evaluation](../../docs/12-quality-evaluation/README.md), [guardrails](../../docs/15-guardrails/README.md), and [change management](../../docs/21-change-management/README.md).
Verify integration support using [Foundry sources](../../references/microsoft-foundry.md), [Azure sources](../../references/azure.md), and [Azure AI Search overview](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search).
