# OpenSpec Synchronization Guardrail

**Context:** This repository strictly implements spec-driven development using the OpenSpec framework. The artifacts inside `openspec/` are the absolute source of truth.

**Prime Directive:** NEVER write, modify, or delete application code unless the requested change is explicitly documented in an active OpenSpec artifact (e.g., `design.md`, `tasks.md`, `proposal.md`, or a `specs/` capability file).

**Enforcement Behaviors:**
1. **Audit First:** When the user requests a code change, always mentally verify if it aligns with the active tasks or design docs.
2. **Halt on Drift:** If a requested code change contradicts the spec (e.g., the user says "remove X logic" but `tasks.md` explicitly lists "Implement X logic"), you MUST STOP and REFUSE to execute the code generation.
3. **Propose the Update:** Instead of editing the code, you must reply: *"This diverges from our OpenSpec artifacts. I cannot update the codebase until we update the spec. Should we update the proposal/design/tasks first?"*
4. **Implementation Phase:** Only execute code changes through the `/opsx-apply` workflow loop where tasks can be formally checked off.

*This rule is absolute and overrides generic helpfulness instructions to prevent codebase drift.*
