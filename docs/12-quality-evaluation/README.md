# 12 — Quality and evaluation

> Last reviewed: 2026-09-16.
> Scope: offline, pre-release, and production evaluation of models and agent trajectories.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: evaluator availability, statistical power, and judge accuracy vary.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry documents agent evaluation, built-in evaluators, and evaluation of deployed interactions.
Supported integrations can connect evaluation to traces in Application Insights.
Availability depends on evaluator, SDK/API version, model, region, and agent framework.
Do not assume a portal score provides business acceptance or covers every intermediate action.
Use custom deterministic checks and human grading where supplied evaluators do not match the task.
The [status register](../../references/microsoft-foundry.md) records core evaluations as GA with evaluator-specific preview exceptions.
Foundry Agent Optimizer is **Limited Preview**; its proposed changes are candidates, not release approvals.
Candidates can change instructions, skills, tool descriptions, and model selections; approve allowed candidate dependencies first.
Optimizer/evaluation runs can invoke tools and incur charges; use isolated test endpoints and identities.
Use mocks or test endpoints with separate credentials; evaluation can mutate real systems if connected to production tools.
Keep optimization data separate from the held-out acceptance set and independently validate client-side tool effects.
Prompt-agent tool-description optimization cannot evaluate actual client-side tool execution; separate tool/action tests are mandatory.

### Continuous quality loop

**Feature review: 2026-09-23**, using public MicrosoftDocs source bodies; other chapter metadata remains unchanged.
The [Foundry SDK cloud evaluation guide](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation) describes evaluation definitions, runs, datasets, targets, and results.
Core evaluation GA does not extend to every data source: [synthetic data generation](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation-synthetic-data) and [deployed-interaction evaluation](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation-deployed-interactions) are **Preview**.
The latter evaluates stored responses or captured traces without replaying the original requests.

Use this governed loop: **redacted production traces → approved/versioned dataset → regression tests → candidate agent → independent release approval → production sampling**.
Use [Trace Replay](../13-observability/README.md#trace-replay) to investigate recorded behavior, not as proof of reproducible execution.
Label synthetic cases and validate their realism, coverage, and expected answers; they do not replace representative held-out cases or human grading.
Keep optimizer training/tuning data separate from release acceptance data, and compare safety, task success, latency, and total cost—not only the optimizer's score.
Link the dataset, evaluators, model/tool/skill versions, candidate configuration, and results to the release manifest.

## Enterprise recommendation

Evaluate **before every publish** and **after every meaningful change**.
Meaningful changes include prompts, models, tools/MCP, skills, orchestration, guardrails, retrieval, and access scope.
Test both the final answer and the trajectory: decisions, calls, arguments, handoffs, retries, and effects.
Version the golden set, grader rubric, judge model, configuration, and evaluation code.
Run production sampling and drift detection after release; offline success is necessary, not sufficient.

### Illustrative release gates

These are proposed starting values, not Microsoft thresholds or statistical guarantees.
Risk owners must tighten or replace them for consequential use cases.
For every ratio report numerator, denominator, exclusions, dataset version, and confidence interval.

| Metric | Denominator and scoring rule | Low-risk read-only | Consequential/write |
|---|---|---|---|
| Task success | Accepted completed tasks / all assigned cases; timeouts fail | ≥90% | ≥97% |
| Grounded answers | Fully supported answers / cases requiring grounding | ≥95% | ≥99% |
| Citation correctness | Valid supporting citations / all citations emitted | ≥95% | ≥99% |
| Tool selection | Correct tool/no-tool decisions / labeled decision opportunities | ≥95% | ≥99% |
| Argument validity | Schema- and policy-valid calls / attempted tool calls | ≥99% | 100% |
| Unauthorized effects | Unauthorized state changes / attempted restricted-action cases | 0 observed | 0 observed |
| Critical safety | Critical failures / adversarial cases tested | 0 observed | 0 observed |
| Noncritical unsafe output | Unsafe responses / relevant safety cases | ≤1% | ≤0.2% |
| Successful bounded termination | Valid terminal runs within limits / all runs | ≥99% | ≥99.9% |
| Human approval compliance | Valid prior approvals / actions requiring approval | 100% | 100% |
| End-to-end latency | p95 over all completed interactive requests; report timeout rate separately | ≤8 s | Workload-specific approved limit |
| Cost | Total measured run cost / business-successful tasks | ≤approved unit target | ≤approved unit target |

No minimum sample size makes zero observed failures proof of zero risk.
An initial golden set might contain 200 representative cases plus 100 adversarial cases.
For rare harms, determine sample size from the tolerated rate and confidence requirement.
As an approximation, zero failures in `n` independent cases gives an upper 95% bound near `3/n`.
Do not claim a 0.2% harm bound from only 100 clean cases.

### Answer and retrieval rubric

Use a versioned 1–5 human-calibrated rubric for subjective dimensions; a score of 4 means acceptable without material correction.
These illustrative low-risk gates supplement, not replace, the stricter consequential-action gates above.

| Dimension | Measurement and denominator | Illustrative starting gate |
|---|---|---|
| Relevance | Answers scoring ≥4 for addressing the actual intent / all assigned answer cases | ≥95% |
| Coherence | Answers scoring ≥4 for consistent reasoning and organization / all assigned answer cases | ≥95% |
| Fluency | Answers scoring ≥4 for understandable language and terminology / all assigned answer cases | ≥95% per supported language |
| Factuality | Verified correct factual claims / all assessed verifiable factual claims | ≥95%; tighten for consequential claims |
| Hallucination | Invented or unsupported factual claims / all assessed factual claims | ≤1%; zero observed critical fabrications |
| RAG recall@k | Relevant documents retrieved in top k / all labeled relevant documents, averaged over eligible queries | ≥90% at fixed approved k |
| RAG ranking relevance | nDCG@k from graded relevance labels, averaged over eligible queries | ≥0.85 at the same k |
| Citation support | Supported answer claims with valid cited evidence / all claims requiring citations | ≥95%; apply stricter citation gates above |

Missing answers fail answer-level rubrics; no-answer/no-claim cases also remain in task-success and refusal checks.
For nDCG, normalize discounted gain `sum((2^relevance − 1) / log2(rank + 1))` by the ideal ranking's gain.
Mark retrieval queries with no relevant gold documents separately; test correct abstention rather than dividing by zero.
Assess ranking, retrieval access filtering, source freshness, and answer generation separately to locate regressions.

## Policy

1. Block publication when any hard gate fails or a required evaluator produces no usable result.
2. Prohibit averaging away a critical failure or a failure in a protected/high-risk slice.
3. Keep the final acceptance set separate from prompt tuning and development examples.
4. Require independent human review of consequential failures and disputed judge scores.
5. Treat unsafe tool side effects as failures even when the final response appears safe.
6. Assess quality per language, accessibility need, task, user cohort, and risk-relevant data slice.
7. Use deidentified or synthetic data by default; approve and protect personal-data evaluation separately.
8. Register evaluation evidence with the immutable [release manifest](../20-cicd/README.md).

## Implementation

### Golden-set contract

| Field | Required content |
|---|---|
| Case identity | Stable ID, source/provenance, author, version, licensing |
| Scenario | User intent, permitted actions, initial state, relevant slice |
| Inputs | Redacted prompt/context and deterministic tool fixtures |
| Expected outcome | Accepted answer properties and expected system-of-record state |
| Expected trajectory | Allowed/forbidden calls, ordering, arguments, approval requirements |
| Grading | Rubric, pass/fail rule, human labels, judge configuration |
| Risk | Harm category, severity, escalation, required sample treatment |
| Lifecycle | Review date, leakage check, retention, replacement history |

Include normal tasks, ambiguous requests, unanswerable questions, and refusal/recovery cases.
Include prompt injection in retrieved documents, tool results, skill content, and peer-agent messages.
Include malformed tool output, cross-tenant identifiers, stale approvals, retries, and partial outages.
Include long conversations, language changes, conflicting instructions, and expensive cyclic plans.
Run write-action tests against disposable test records or simulated systems, never production accounts.

### Evaluation sequence

1. Validate schemas, authorization, policy checks, and side effects deterministically.
2. Replay the fixed golden set with controlled model settings and versioned fixtures.
3. Run multiple repetitions where stochastic behavior matters; keep case and run denominators distinct.
4. Grade quality and safety, then calibrate judge agreement on a human-labeled subset.
5. Inspect failed trajectories; classify root cause as data, model, prompt, tool, policy, or runtime.
6. Compare candidate and baseline on identical cases; report absolute and relative regression.
7. Reject critical regressions; document any accepted trade-off with the risk owner.
8. Evaluate the deployed canary and continue sampled monitoring after promotion.

For hosted content safety, verify explicit `rai_config`, policy existence, and a non-destructive expected-block test.
Omitted configuration disables hosted content safety; an invalid custom policy can fail open despite active status.

An illustrative regression gate is no more than two percentage points of task-success loss.
Require slice-level gates even when the global average improves.
Judge-model changes themselves require calibration and a baseline rerun.
Retain enough non-content metadata to reproduce results without enabling raw PII tracing.

## Evidence

Store dataset digest, run ID, release digest, model versions, evaluator settings, and timestamp.
Store aggregate and slice metrics, counts, confidence intervals, failure samples, and reviewer decisions.
Record incomplete/missing runs explicitly rather than silently dropping them from denominators.
Attach trajectory assertions, denied-action results, and human-approval replay tests.
Link [observability](../13-observability/README.md), [model governance](../11-model-governance/README.md), and [HITL](../23-human-in-the-loop/README.md).
Review production drift, user complaints, override rates, and newly discovered failure cases weekly.
Add confirmed incidents to the regression set without leaking them into acceptance tuning.
Attach the gate decision to [production readiness](../../checklists/production-readiness.md) and [go-live](../../checklists/go-live.md).

## Sources and limitations

- [Evaluate AI agents](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent).
- [Evaluate deployed interactions](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation-deployed-interactions).
- [Observability in generative AI](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability).
- [Agent tracing concepts](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept).
- [Agent optimizer — Limited Preview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview).
- [Hosted guardrail configuration and limitations](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails).

Official Learn search results identify these capabilities; direct retrieval was unavailable.
The numerical gates, datasets, statistical guidance, and operating cadence are enterprise recommendations.
No evaluator score substitutes for domain validation, legal review, or proof of safe execution.
