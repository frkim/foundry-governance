# 16 — Skills

> Last reviewed: 2026-09-16.
> Scope: reusable agent instructions, skill packages, dependencies, and execution permissions.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: native skills are documented as preview; packaging and execution vary by runtime.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry documents skills as reusable agent assets, with a preview-specific authoring and usage surface.
Skill content can guide behavior and reference supporting resources.
A skill is not an identity, authorization grant, model, or independently trusted execution boundary.
Do not confuse reusable instructions with a tool API, MCP server, or framework plugin.
Native support, package format, runtime behavior, and version selection require feature-level validation.
Toolbox-based skill discovery can involve MCP resources; tool-only MCP support does not prove skill compatibility.
Validate discovery, resource reads, authorization, and gateway transport separately before adoption.

| Asset | Primary role | Approval must cover |
|---|---|---|
| Skill instructions | Reusable task guidance and procedures | Behavioral change, unsafe instructions, sensitive content |
| Supporting files | Examples, templates, reference material | Classification, license, freshness, prompt injection |
| Executable helper | Code invoked by an approved runtime/tool | Supply chain, sandbox, egress, identity, side effects |
| Tool/MCP dependency | External capability used by the skill | Endpoint, schema, authorization, versions, data transfer |
| Agent attachment | Makes a skill available to an agent | Intended use, authority, compatibility, evaluation |

## Enterprise recommendation

Treat every skill as a governed software-and-content package.
Publish from a reviewed enterprise registry with an accountable owner and immutable release identity.
Start with narrow, read-only skills before enabling state-changing helper code.
Prefer reusable procedures with explicit prerequisites, boundaries, and refusal conditions.
Do not grant a skill access merely because it came from a marketplace or shared repository.

### Minimum package contract

| Field | Proposed requirement |
|---|---|
| Identity | Stable skill ID, semantic version, artifact digest |
| Ownership | Business owner, technical maintainer, escalation contact |
| Purpose | Supported tasks, excluded tasks, expected inputs/outputs |
| Source | Repository commit, author/reviewer, provenance, license |
| Data | Allowed classification, prohibited data, retention implications |
| Dependencies | Models, tools, MCP servers, packages, reference data |
| Permissions | Required scopes and egress; read/write clearly separated |
| Runtime | Supported agent types/framework versions and execution constraints |
| Quality | Golden-set cases, trajectory tests, known failure modes |
| Lifecycle | Review date, expiry, replacement, deprecation notice |

A compatible file format is not evidence of a safe or supported runtime.

## Policy

1. Review skill text and executable content before attaching to any production agent.
2. Pin approved versions/digests; prohibit silent tracking of mutable “latest” or default versions.
3. Evaluate the consuming agent after every meaningful skill or dependency change.
4. Deny undeclared network destinations, tools, package installation, and filesystem access.
5. Keep secrets and personal records out of skill packages and examples.
6. Treat instructions in third-party skills and reference files as untrusted until approved.
7. Do not let skills override higher-priority enterprise policies, access controls, or approval requirements.
8. Require [HITL](../23-human-in-the-loop/README.md) for consequential actions regardless of skill wording.
9. Withdraw compromised skills and notify every registered consumer.
10. Record preview approval and a portable fallback when native skills are used in production.

## Implementation

### Promotion workflow

1. Author in a reviewed repository with a clear task boundary and license.
2. Enumerate all instructions, code, files, dependencies, and intended tool calls.
3. Review for injection, misleading authority, exfiltration, excessive privilege, and data leakage.
4. Test in an isolated environment with synthetic data and restricted egress.
5. Run package-level tests and [agent-level evaluation](../12-quality-evaluation/README.md).
6. Approve an immutable artifact and record the supported consumer matrix.
7. Attach through [CI/CD](../20-cicd/README.md), not an untracked production edit.
8. Monitor use, failure, cost, and unexpected actions by skill ID/version.

### Example: case-summary skill

| Decision | Baseline |
|---|---|
| Input | Authorized case text with unnecessary identifiers removed |
| Output | Summary, source references, uncertainty, proposed next step |
| Allowed tools | Read case and approved knowledge retrieval only |
| Forbidden actions | Send email, close case, export attachments, change account |
| Budget | At most two retrieval calls and one summary attempt before safe escalation |
| Approval | Not needed for a draft; required for separate state-changing action |
| Failure | Explain missing evidence and route to a human |

These limits illustrate a bounded skill, not a universal native configuration.
Enforce them in the application/tool layer; instruction text alone is insufficient.
Test attempts to hide an email send inside an apparently read-only helper.
Test malicious retrieved content instructing the agent to replace or download another skill.

### Updating and revoking

Classify edits by behavioral impact, not file extension or line count.
A one-line instruction can change authority more than a large documentation revision.
Use [change management](../21-change-management/README.md) for scope, permission, or dependency changes.
Before revocation, query the [inventory dependency graph](../25-ai-inventory/README.md).
Disable affected attachments/routes, invalidate cached packages, and publish a replacement when available.
Reevaluate dependent agents before resuming execution.
If a runtime follows mutable skill defaults, wrap deployment with digest verification or reject that production pattern.
Do not assume removing a registry entry removes already loaded or cached content.

## Evidence

Retain package manifest, content digest, provenance, license, review, and approval.
Attach negative tests for undeclared tool use, egress, privilege escalation, and hidden instructions.
Record each consuming agent/release and the exact skill version it uses.
Store evaluation reports and revocation drill results.
Track adoption and failures by skill version without capturing raw sensitive inputs.
Use [sharing](../17-sharing/README.md) for the consumer contract.
Apply the [control catalog](../../governance/controls/README.md) to both content and executable dependencies.
Include skill dependencies in [security review](../../checklists/security-review.md) and [agent registration](../../templates/agent-registration.md).

## Sources and limitations

- [Use skills with Foundry agents — preview](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/skills).
- [Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- [Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/).
- [Toolbox and shared capability overview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview).

Official Learn search results identify the skills preview; direct page retrieval was unavailable.
Registry workflow, package contract, digest enforcement, and revocation procedures are enterprise recommendations.
Verify native version semantics and code-execution behavior rather than assuming this policy is built in.
