---
title: GitHub Copilot's Free Ride Is Over
description: On June 1st, 2026, GitHub killed the flat-rate model and switched to pay-per-token billing. Here's what changed, why your budget vanishes faster than you expect, and how to optimize your workflow so you don't run out of credits mid-month.
publishDate: 2026-06-06T09:00:00+02:00
draft: false
tags:
  - github
  - ai
  - developer tools
  - opinion
---

June 1st, 2026 was not an ordinary Monday. It was the day GitHub shut down the AI "open bar" and turned on the cash register.

If you've recently noticed your code assistant responding with less enthusiasm — or flat-out blocking you with a "you've run out of credits" message — that wasn't your imagination. GitHub has executed one of the most dramatic changes in Copilot's history: it has abandoned the subscription model with unlimited "premium requests" and switched to a **token-based consumption billing system**.

Welcome to the Token Economy.

## What exactly changed?

Until May 2026, the model was simple: you paid a monthly subscription and got a fixed number of "premium requests" per month. If you ran out, the system would silently downgrade you to a cheaper model, but you kept working.

That no longer exists.

Everything is now measured in **GitHub AI Credits**, where 1 credit equals exactly $0.01 USD. Every time you interact with the chat, run an agent, or use the CLI, the system counts the input tokens, output tokens, and cached tokens for your chosen model, and deducts the corresponding credits.

And if you run out of credits, the assistant locks up. No silent degradation, no automatic fallback. Wall.

## Plans are now credit wallets

The base subscription prices haven't changed, but their nature has:

| Plan | Monthly credits | Price |
|---|---|---|
| Free | Limited | Free |
| Pro | 1,000 credits | $10/mo |
| Pro+ | 3,900 credits | $39/mo |
| Max | ~20,000 credits | $100/mo |
| Business | 1,900 per user | $19/mo/user |
| Enterprise | 3,900 per user | $39/mo/user |

*(Last checked 05/06/2026.)*

One important note for enterprise plans: credits are **pooled at the organizational level**. Light users offset heavy users. In theory, a fairer model for teams.

### A trap for annual subscribers: the new multipliers

If you're still on a legacy annual Copilot Pro or Pro+ plan, **you won't switch to token billing immediately**. You'll keep the "premium requests" (Premium Request Units) system until your subscription year expires. Good news so far.

The problem is that to offset the real cost of autonomous agents, GitHub has dramatically increased the consumption multipliers as of June 1st:

| Model | Previous multiplier | New multiplier |
|---|---|---|
| Claude Opus 4.8 | 7.5x | **27x** |
| Claude Opus 4.6 | 3x | **27x** |
| Claude Sonnet 4.6 | 1x | **9x** |
| GPT-5.4 | 1x | **6x** |
| GPT-5.4 mini | 0.33x | **6x** |
| GPT-5 mini | 0x | 0.33x |
| Claude Haiku 4.5 | — | 0.33x |
| Gemini 3 Flash | — | 0.33x |

*(Last checked 05/06/2026.)*

In practice: a work session with Opus 4.8 that previously consumed 7.5 requests now consumes 27. Same work. Same result. Four times more expensive.

One useful detail: if you use the **"Auto"** model selection mode, Copilot dynamically picks the model based on real-time system load. On legacy plans, this mode applies a **10% discount on the final multiplier**. Not a solution, but better than nothing.

## What's still free (and it matters more than you think)

Before panicking, there's good news GitHub hasn't communicated loudly enough:

**Code completions don't consume credits.** The inline suggestions that appear as you type and the Next Edit Suggestions remain unlimited and free across all paid plans.

**GPT-4.1 and GPT-5 mini are "included" models in the subscription.** They don't deduct from your monthly balance. For most everyday tasks — completing a function, refactoring something simple, explaining an error — they work perfectly well.

The golden rule that follows: **if a task can be solved in the editor or with an included model, using Opus or Sonnet for the same thing is wasted money**.

## The real cost: price per million tokens

Here's the table GitHub doesn't put front and center when you pick a model. Sorted from cheapest to most expensive on output, which is where the real spend hides:

| Model | Input | Cache | Output | Notes |
|---|---|---|---|---|
| GPT-5.4 nano | $0.20 | $0.02 | $1.25 | Most economical option |
| Gemini 3 Flash | $0.50 | $0.05 | $3.00 | — |
| **GPT-5 mini** | **$0.25** | **$0.025** | **$2.00** | **✓ Included in plan** |
| GPT-5.4 mini | $0.75 | $0.075 | $4.50 | — |
| Claude Haiku 4.5 | $1.00 | $0.10 | $5.00 | — |
| **GPT-4.1** | **$2.00** | **$0.50** | **$8.00** | **✓ Included in plan** |
| Gemini 2.5 Pro | $1.25 | $0.125 | $10.00 | — |
| Gemini 3.1 Pro | $2.00 | $0.20 | $12.00 | — |
| GPT-5.4 | $2.50 | $0.25 | $15.00 | — |
| Claude Sonnet 4.6 | $3.00 | $0.30 | $15.00 | — |
| Claude Opus 4.8 | $5.00 | $0.50 | $25.00 | Fast mode: $10/$50 input/output |

*(Prices in USD per million tokens. 1 AI Credit = $0.01 USD. Last checked 05/06/2026.)*

To make those numbers concrete: **Opus 4.8 costs 20x more on output than GPT-5.4 nano** to produce the same amount of text. Using Opus to rename a variable when you could use nano isn't a technical preference — it's a direct waste of your budget.

**Important note for Claude users**: Anthropic models carry an additional cache write cost ranging from $1.25 to $6.25 per million tokens depending on the model. It doesn't appear in the main pricing table, but it does get deducted from your balance. Keep this in mind if you use Sonnet or Opus heavily in long sessions.

## Why do credits disappear so fast?

This is the part that confuses most people — and it's a legitimate confusion, because GitHub explains it poorly.

### The "Reserved Output": the bill nobody told you about

You open a new chat, type "hello," and the meter already shows 30-40% usage. What happened?

It's not a bug. It's a design feature called **Reserved Output**. The system automatically reserves up to 40% of the context window (about 60,000 tokens on models with 192k windows) as a safety buffer for the response. The idea is that the AI never gets cut off mid-refactor.

Add to that:
- **System Instructions**: 2-3% of the window (system behavior rules)
- **Tool Definitions**: ~5% (agent tool schemas)

Result: before you write a single line of your own prompt, you've already consumed nearly half the useful window.

### Context Rot: the poison of long conversation history

Every time you reply in a chat, the system resends the entire history from the beginning. There's no persistent memory between messages — it's stateless by design. The longer the conversation, the more tokens you pay per message, even if what you're asking is completely new.

Beyond that, past 50-60% context window usage, models start suffering what's known as **lost-in-the-middle**: they ignore early instructions and prioritize the most recent messages. Quality drops, errors increase, and you end up paying more for worse answers.

### Tool Overload: the invisible MCP overhead

If you use MCP servers (the external tool protocol), every active tool injects its JSON schema into every model call. With 40 active tools, you're adding 10-15 KB of overhead per chat turn, even if you don't use any of those tools for that specific question.

## Community reaction: outrage and "bait-and-switch"

The reception on Reddit, Hacker News, and Discord was, at best, hostile. The most recurring themes:

**"Bait and Switch"**: GitHub (and Microsoft behind them) conditioned developers to a conversational, iterative programming style — the now-famous *vibe coding* — where the AI did the heavy lifting without apparent limits, then started charging for exactly that behavior.

**Evaporated budgets**: Many Pro+ users reported consuming 100% of their credits in one or two days of normal work. For those using agents intensively, no surprise. For those who thought $39/month was enough for "advanced use," it was.

**Education sector**: The pause on the GitHub Student Developer Pack left students without access to the tools they were learning with. The resentment in this community is especially high.

**401 errors before the change**: There were widespread authentication errors in "Auto" mode in the weeks before June 1st, even with credits available. The general suspicion is that GitHub applied hidden throttles to ease into the transition.

## How to survive without burning your budget

### Rule 1: "Plan expensive, execute cheap"

This is the most effective strategy for the new token economy. The mental model is simple:

1. **Planning phase**: use a top-tier model (Claude Opus 4.8, GPT-5.4) to create the technical plan, architecture document, `implementation.md`. You're paying for pure intelligence at the moment where the cost of mistakes is highest.
2. **Execution phase**: switch to a mini or nano model to implement the steps one by one. Mechanical tasks don't need the most expensive engine in the catalogue.

This strategy can reduce monthly consumption by 47-79% without sacrificing quality on important decisions.

### Rule 2: Context hygiene

- **Use `/clear` when switching subtasks** — not mid-bug-resolution. Clearing history in the middle of debugging makes the model lose the thread of prior decisions, which usually leads to worse answers and more retries (which also cost credits). The right moment is when you finish one task and start a different one.
- **Use `/compact` before the history becomes unmanageable**. Summarizes the conversation and resets the context window.
- **Attach only the necessary files**. Not the entire repository.
- **Create a `.copilotignore`** to exclude `node_modules`, binaries, build folders, and anything Copilot doesn't need to read.

### Rule 3: Prune your MCP tools

Disable MCP servers you're not actively using. Every inactive tool you have connected is token overhead on every call. Fewer active tools = lower base cost per turn.

### Rule 4: Go back to comments

Before the chat existed, Copilot worked like this: you wrote a comment describing what you needed, and autocomplete suggested the code. It still works exactly the same way, it's still free, and for many day-to-day tasks it's more than sufficient.

```python
# Parse the JWT token and return the user ID, raise ValueError if expired
def get_user_id_from_token(token: str) -> int:
```

That generates a complete suggestion without spending a single credit. It's not as interactive as the chat or as powerful as an agent, but for well-defined, concrete implementations it's a real alternative. The key is being specific in the comment: the more you detail the expected behavior, edge cases, and return type, the more useful the suggestion you get.

In a way, it's a return to the origins. And in the current token economy, that has far more value than it seemed six months ago.

### Rule 5: `#codebase` over `@workspace`

`#codebase` performs semantic searches across the project and can combine results with other sources (terminal, open files). `@workspace` isolates the model and doesn't support mixing tools. For most workflows, `#codebase` is more flexible and generally more efficient.

### Rule 6: Restrict your output format

Output tokens cost 4-8x more than input tokens. If you ask an open-ended question, the model will respond with an essay, and you'll pay for that essay at premium rates.

The solution is straightforward: explicitly tell it what format you want. Phrases like *"just the diff"*, *"just the function signature"*, or *"code only, no explanatory comments"* dramatically cut output without losing precision.

The community popularized an MCP called **caveman** that forces models like Claude to respond ultra-concisely — only what's strictly essential — with reported output reductions of 65-75%. For Copilot specifically there's already an adapted version: [caveman-copilot](https://github.com/Mijutra/caveman-copilot). It's not an official tool, but worth exploring for heavy long-session users.

### Rule 7: Raise reasoning effort before switching models

When a cheap model gets stuck on a problem, the instinct is to jump straight to Opus or the most powerful option available. That instinct costs money.

Before switching models, raise the **reasoning effort** parameter (or `thinking_level`) of your current model to *High* or *Max*. The model will think more before responding, consuming more internal tokens, but it'll still be much cheaper than multiplying the base cost by jumping to the Opus tier.

The distinction to internalize: **raise reasoning effort when the problem is about logic; switch models only when the problem is about raw capability**. These are different things, and treating them the same way is the source of a lot of unnecessary spending.

### Rule 8: Put your `copilot-instructions.md` on a diet

The `.github/copilot-instructions.md` file is sent as input tokens on absolutely every conversation turn. If your team has been accumulating style guides, architecture conventions, and internal documentation there, you're paying to resend all that text in every single message anyone writes.

The tactic is to keep that global file under 20 lines with high-impact directives, and move specific rules to `.instructions.md` files inside concrete subfolders — for example `.github/instructions/frontend.instructions.md` — with an `applyTo` field that tells Copilot when to inject them. That way you only pay those tokens when they're actually relevant.

A warning: this segmentation works well when subtasks are clean. If in the same chat session you're constantly jumping between frontend and backend files, the instruction context shifts every turn and that can invalidate the token cache — especially on Anthropic models, which are more sensitive to abrupt context changes. Folder-based segmentation is a tool, not a silver bullet: use it in focused sessions.

### Rule 9: Use the CLI for deterministic data, not the agent

Letting an agent navigate your repository to extract information you could get with a terminal command is one of the biggest token wastes out there. The agent will make multiple calls, make intermediate errors, correct them — and you'll pay for all that reasoning.

If `gh pr diff`, `kubectl get ... -o json`, or a direct database query can give you the data deterministically, run it yourself and pass the clean result to the model. You cut tokens and eliminate non-determinism from the process.

An additional warning if you use subagents: periodically check Copilot's diagnostic logs. There have been reported cases where a subagent configured to use a `mini` model ends up running on the base model without any interface notification. Your "cheap execution" may be an expensive illusion.

### Rule 10: Close the tabs you don't need

Copilot automatically injects snippets from files you have open in the editor to give the AI context. Useful when those files are relevant to your task. A token vampire when they're not.

If you're solving a specific problem, close everything unrelated to that task. Three to five active tabs is the reasonable limit. Every extra open file is implicit context you pay for in every message even if you didn't ask for it.

## Impact on development teams

This is the point that concerns me most, and the one least talked about.

Many teams have built their planning for the past few months assuming Copilot would be available as they knew it: frictionless, with no visible ceiling, as a natural extension of the workflow. Those velocity estimates, those AI-assisted sprints, that capacity promised to the business — all of that was calculated with a Copilot that no longer exists.

**The problem isn't just money, it's predictability.** A team that has calibrated its delivery cadence assuming constant AI assistance now has a new variable in the equation: how many credits are left mid-sprint? Who's consuming them? With which model?

Think about it concretely: a feature that used to be estimated at two weeks got re-estimated at two or three days with unrestricted Copilot. That estimate is now on the roadmap, committed to the business, maybe even in a contract. Now, if credits run out mid-development or the team starts rationing them to avoid running dry before month-end, that task needs its original timeline back. Estimates go up. Commitments can't go up as easily.

Some concrete effects already appearing:

**Friction between profiles.** On Business and Enterprise plans, credits are a shared pool. One developer using agents intensively with Opus can drain the whole team's quota. The uncomfortable conversation about who's consuming what has already started on several forums.

**Slower onboarding.** New or junior developers tend to use the chat more to understand code, explore the codebase, or generate basic scaffolding. They're exactly the profile that consumes the most tokens and generates the least immediate return per credit. With limited credits, AI-assisted onboarding — one of Copilot's strongest selling points for teams — becomes costly to sustain.

**Code reviews with double cost.** Copilot's automatic code reviews on Pull Requests now consume both AI credits and GitHub Actions minutes. A PR with active automatic review has a cost many teams hadn't budgeted for.

**The "flow state" disrupted.** Before, a developer could iterate with the AI without thinking about cost. Now there's a background voice asking "is this worth spending credits on?". That cognitive friction is small but constant, and it breaks exactly the kind of concentration that makes AI-assisted work productive.

And to make all of this even harder: **the Copilot usage dashboard doesn't update in real time**. Consumption data has a lag of hours, sometimes more than a day. That means you could be burning credits at an unsustainable rate right now and not know until tomorrow. For a team trying to manage a shared budget mid-sprint, it's like driving while only looking in the rear-view mirror.

If you lead a team, the immediate imperative is to revisit the plans made assuming full Copilot availability, establish budgets by profile or team, and decide which automated workflows genuinely justify the use of premium models. Not as a cost-cutting exercise, but as a conscious decision that wasn't made before because it wasn't necessary.

## Conclusion

The era of "free" AI is over. It's no surprise — it was unsustainable. Top-tier models have real operational costs, and someone had to pay for them eventually.

What is legitimately criticable is how the transition was executed: opaque communication, multiplier changes that retroactively hit annual subscribers, and a lack of native tools to monitor consumption in real time.

The good news is that with a bit of discipline, the new model is manageable. Autocomplete is still free. Included models are more capable than most people give them credit for. And the routing strategy — plan with the expensive model, execute with the cheap one — is a habit that improves not just costs but the quality of the work itself.

The question is no longer "how many requests do I have left?" but "am I using the right model for this specific task?". That's, honestly, a much smarter question.

There's an argument GitHub hasn't bothered to make, but which has some merit: the old model encouraged the most careless vibe coding. Asking the AI for 500 lines of code, discarding them because they didn't work, and asking again. That cycle was possible because it was free. The new system, painful as the transition is, forces you to think before you type, to scope the problem, to choose the right tool. In some ways, it's a return to conscious software engineering — just this time with a bill as the motivator.
