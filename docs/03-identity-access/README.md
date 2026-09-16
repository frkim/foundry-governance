# Identity and access

Last reviewed: **2026-09-16**.
Scope: enterprise human, application, agent, tool, deployment, and emergency access.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; use the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers, not a service-wide GA/Preview assumption.
Recommendation: separate human administration, agent execution, and downstream authorization.
Limitations: role names, supported identity types, and data actions depend on the resource, runtime, connector, and API version.
Exceptions: [exception request](../../templates/exception-request.md); this metadata applies to every recommendation below unless overridden.

## Microsoft capability

Azure RBAC grants permissions at management-group, subscription, resource-group, resource, and supported child-resource scopes. Management-plane actions and data-plane actions are different: **Contributor does not automatically grant data access**. It may nevertheless change configuration or retrieve credentials where its actions allow, so effective privilege must include these indirect paths.

The current Foundry documentation maps a project developer to **Foundry User** (formerly **Azure AI User**) on the **project**, plus **Reader** on the parent Foundry resource for discovery. Do not replace that pair with subscription Contributor. Export the current role definition, including `Actions`, `DataActions`, and role-definition ID, when implementing; old role names may remain in existing assignments or automation.

**Foundry Agent Consumer** is the documented least-privilege role for endpoint-only callers. Project scope permits all agent endpoints in that project; agent scope permits the selected agent's endpoint only. Agent-scope assignments are evaluated for endpoint access, **not** broader management. The reviewed source directs use of Azure CLI for project/agent-scope Consumer assignments because the Azure portal currently offers account scope only.

Managed identities and workload identity federation avoid embedding long-lived application secrets where the target supports them. They do not confer permissions by themselves. Agent identity, project managed identity, user-delegated OAuth, and API-key authentication have different authorization and audit semantics.

Microsoft Entra Agent ID is an evolving, feature-specific capability, not a universal identity retrofit for every agent/tool. Require the source register's current status and a demonstrated identity-to-action audit path before relying on it for isolation; use supported workload identities where the required Agent ID combination is unverified.

Current new-model agents obtain a unique identity and endpoint at creation; hosted runtime identity differs from the project managed identity used for infrastructure. Legacy unpublished-project/publishing-time identity behavior is not the universal default. Recreating an agent requires explicit downstream grant migration; do not assume the planned in-place identity upgrade is available.

## Enterprise recommendation

Use groups for human roles, a separate federated deployment identity per environment, and a distinct workload identity per production trust boundary. Prefer a per-agent identity when supported; otherwise document the project identity's shared blast radius and isolate incompatible agents in separate projects/resources.

### Persona-to-permission starting matrix

These are **proposed mappings**, not Microsoft-mandated assignments. “Custom” means a reviewed role containing only required actions, with its definition stored as evidence.

| Persona / identity | Technical role or permission | Narrowest practical scope | Constraint |
| --- | --- | --- | --- |
| Landing-zone administrator | Azure **Contributor** for infrastructure; access administration separately | Approved platform subscription/resource group | Eligible/time-bound production access; no routine runtime data grants |
| Foundry resource administrator | **Foundry Account Owner**, or narrower custom management role | Approved Foundry resource | Includes conditional assignment powers; manage as privileged, not a routine developer role |
| RBAC administrator | **Role Based Access Control Administrator**, with delegation conditions where supported | Approved resource group/resource | Independent of developer and release approval; no general subscription Owner |
| Project developer | **Foundry User** on project + **Reader** on parent Foundry resource | Named nonproduction project and its parent | Parent Reader is discovery, not permission to use all projects |
| Agent endpoint consumer | **Foundry Agent Consumer** | Individual agent endpoint, or project when all its agents are approved | Invocation only; no development/management permission; validate CLI assignment and denied other-agent access |
| Agent publisher / release identity | **Foundry Project Manager**, documented minimum for publishing | Foundry resource | Privileged release step: broader build/conditional assignment rights require review; not equivalent to project-only development |
| Production infrastructure pipeline | Custom deployer actions, or reviewed **Contributor** where necessary | Production deployment resources only | Federated identity; publishing and role assignment use separately reviewed permissions |
| Production agent operator | Custom start/stop/read operational actions supported by the runtime | Owned production agent/project | Do not substitute Foundry User without reviewing its broader modification rights |
| Agent runtime / project infrastructure identity | Required Foundry data actions; **Foundry User** only where the selected integration requires it, plus separate dependency roles | Documented project/resource scope; dedicated boundary if the required grant is broad | Distinct from endpoint caller and deployer; hosted agent runtime identity differs from project infrastructure identity |
| Model deployment manager | Custom deployment management actions | Approved Foundry resource/model deployments | No automatic grant to business data or production application secrets |
| RAG reader | **Storage Blob Data Reader**; **Search Index Data Reader** where applicable | Approved container; dedicated approved search service as needed | Enforce document/tenant authorization in retrieval; service-wide search permission is not document ACL enforcement |
| Ingestion pipeline | **Storage Blob Data Contributor**, **Search Index Data Contributor**, or narrower custom rights | Dedicated ingestion container/search boundary | Separate from agent reader; no ability to approve source trust or widen ACLs |
| Tool backend identity | Native application roles or service-specific data permissions | Required API operations, database/container, or resource | Must not reuse the gateway's broad administration identity |
| Secret-consuming workload | **Key Vault Secrets User**, or narrower supported access | Dedicated workload vault/required secrets | Only when identity-based backend authentication is unavailable; no secret administration |
| SOC analyst | **Monitoring Reader** and/or **Log Analytics Reader**, as required | Security telemetry resource/workspace | Restrict sensitive tables/content; metadata access does not justify all prompt access |
| Auditor / compliance reviewer | **Reader** plus approved read access to redacted evidence | In-scope resources and evidence store | No runtime invocation, write, approval, or raw-content access by default |
| Business/data/AI risk approver | Approval-application role, not Azure Owner | Approved workload/data/action class | Cannot self-approve own high-impact requests |
| Emergency operator | Eligible narrow containment role; separate emergency access arrangements | Named production resources and kill-switch service | Tested activation, immediate alert, incident-bound use, post-incident review |

**Foundry Owner** combines broad management/development and conditional assignment powers; it is not the default for the above personas. Getting-started resource-level Foundry User assignments are broader than the enterprise project-developer mapping. Where an operation lacks a desired fine-grained scope, use a dedicated dependency, authorization-enforcing service, or reviewed custom role; agent endpoint scope must not be generalized to management or data storage.

## Proposed enterprise policy

- **GOV-01 / GOV-03:** every human and nonhuman principal must have an owner, purpose, environment, permission boundary, and review/expiry rule.
- **GOV-02:** production and nonproduction must not share deployment credentials or privileged runtime identities. Cross-project access is explicitly granted and tested.
- **GOV-03:** no routine Owner, access-administrator, or shared administrator key for development or execution. Review parent, group, inherited, and credential-mediated grants.
- **GOV-03 / GOV-06:** authenticate both the calling workload/user and the downstream tool action; an authenticated agent is not entitled to act for every user.
- **GOV-06:** bind write approval to the verified requester, approver, target, arguments, expiry, and current authorization. The model cannot mint or modify approval.
- **GOV-10 / GOV-11:** grant deployment changes through approved pipelines; revoke execution and downstream rights during containment/retirement.
- **GOV-12:** Preview, shared-identity, and unsupported fine-grained authorization dependencies require explicit, time-limited approval with compensating controls.

These obligations are proposed enterprise policy. Microsoft RBAC availability does not establish organizational approval or compliance.

## Implementation

### 1. Map each identity hop

Record `caller → application → agent → gateway → tool → data`, with tenant, principal/object ID, token issuer, audience, authorization method, effective scope, and identity owner at each hop. Include background jobs, ingestion, model deployments, evaluation runners, and telemetry exporters.

| Authorization pattern | Use | Required protection |
| --- | --- | --- |
| Application-only managed/workload identity | Scheduled jobs or explicitly application-owned operations | Restrict backend entitlement; carry separately verified business tenant/user context when necessary |
| User-delegated OAuth | Tools acting with the signed-in user's consent and rights | Validate issuer/audience/scopes; enforce target-user authorization; handle expired/revoked consent |
| Shared project/agent credential | Connector lacks safer supported identity | Dedicated boundary, secret store, rotation, inventory, and explicit data-owner acceptance |
| Gateway backend identity | Gateway authenticates to downstream API | Inbound caller authorization remains separate; prevent the gateway becoming a confused deputy |

Do not forward bearer tokens to arbitrary tools or treat an unverified `userId` argument as delegation. An OAuth sign-in success is not proof that downstream APIs enforce the intended tenant or object permissions.

### 2. Provision and review

1. Resolve exact current built-in role definitions and supported assignment scopes; store IDs rather than relying on display names alone.
2. Assign through enterprise groups and IaC. Apply PIM/Conditional Access to eligible human scenarios, with approval, expiry, MFA, and privileged-session controls as supported.
3. For workload federation, bind trusted issuer, subject, and audience to the intended repository/environment; prevent untrusted branches from using production identities.
4. Grant independent storage/search/database and tool permissions. Foundry access is not a substitute for these service-specific grants.
5. Disable local/key authentication where the selected service supports it and compatibility is verified. Otherwise constrain who can list/use keys and rotate them on personnel/incident changes.
6. Review production privileged access monthly and all runtime entitlements quarterly as enterprise starting intervals; reassess immediately after scope, tool, owner, or classification changes.

Human MFA policy does not automatically protect managed identities or service principals. Apply the controls available for each identity type, plus narrow grants, network restrictions, credential hygiene, and monitoring.

### 3. Prove effective isolation

- Use two projects and two business tenants to show allowed own-data access and denied other-project/tenant access.
- Repeat checks as developer, pipeline, runtime, operator, and auditor, including direct SDK/API calls rather than only portal navigation.
- Examine inherited assignments: a broad parent allow is **not narrowed** by a more restrictive project role. Remove the broad grant or redesign the boundary.
- Attempt to list credentials, alter role assignments, access raw telemetry, and invoke an unapproved model/tool. Verify denial at the real enforcement point.
- Revoke an identity/session/grant and measure containment delay, including token lifetime, permission propagation, cached credentials, queued jobs, and live tool sessions.

### 4. Emergency access and kill switches

Publish named platform and workload on-call authorities. Maintain independent switches for caller admission, agent scheduling, tool authorization, model routing, and downstream credentials. A portal “stop” action alone may not cancel queued or already executing writes.

Emergency access uses the established enterprise emergency-account process, not credentials placed in a prompt or repository. Log activation and all containment actions; reconcile in-flight business transactions before restoring access.

## Evidence

Keep the persona/role matrix, principal inventory, role-definition snapshots, effective assignment exports, group membership/PIM review, federation bindings, and data/tool consent decisions. Attach negative-access results, approval replay denial, revocation timing, and emergency exercise records to the [security review](../../checklists/security-review.md).

Evidence identifies release, identity, resource scope, timestamp, expected outcome, observed outcome, reviewer, and residual gaps. Retain redacted events, not access tokens or secrets. Map records primarily to **GOV-01, GOV-02, GOV-03, GOV-06, GOV-10, GOV-11, GOV-12**.

## Sources

- [Foundry role-based access control](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry).
- [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview) and [built-in roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles).
- [Managed identities overview](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview).
- [Foundry MCP authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication).
- [Agent identity](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity) and [Agent Application identity migration](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/migrate-agent-applications).
- Feature status and verification notes: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md).

## Limitations and unresolved decisions

Role availability and display names evolve; verify the deployment tenant rather than inventing a generic “agent administrator” built-in role. Project scope is not a deny boundary against inherited access. Some tools use shared credentials, and some operations require coarser resource-level permissions.

Identity revocation may not immediately invalidate every active token or operation. Pair revocation with admission and backend controls. RBAC, OAuth, PIM, and Agent ID do not by themselves provide transaction approval, document-level authorization, or complete action attribution.
