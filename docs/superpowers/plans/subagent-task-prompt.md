# Subagent task prompt — template

One task per agent. Copy this whole thing, substitute `{{TASK_NUMBER}}` and `{{TASK_NAME}}`,
send it. Nothing else.

Do not summarise the task into the prompt. Point the agent at the plan and make it read the
plan. A summary is a second source of truth and it will drift from the first one.

---

## The prompt

````
You are implementing exactly one task from a written plan on the mossimo website rebuild.

# Working directory

c:\Users\sport\OneDrive\Documents\CodingPersonal\summit-rebrand

Everything you do happens inside that directory. It is its own git repository with its own
remote. Never write outside it. Never `cd` out of it to modify something.

`../SummitSites` is the OLD site being replaced. It is a SEPARATE git repository. You may
READ it to copy text content. You must never import from it, never modify it, never commit
to it, and never add it as a dependency.

# Read these three files before you write anything

1. docs/superpowers/plans/2026-09-05-mossimo-rebrand.md
   - Read the header, the "Resuming after an interrupted session" section, and the
     "Standing rules" section IN FULL. The standing rules are invariants that apply to your
     task but are NOT repeated inside it.
   - Then read Task {{TASK_NUMBER}} in full before executing any step.

2. docs/superpowers/specs/2026-09-05-mossimo-rebrand-design.md
   - This is why the plan says what it says. Read §3 (visual language) and whichever section
     your task implements.

3. docs/references/README.md
   - Explains the reference screenshots the design came from, if your task is visual.

# Your task

Task {{TASK_NUMBER}}: {{TASK_NAME}}

Execute its steps IN ORDER, exactly as written. The plan contains the actual code, the
actual test code, the actual commands, and the actual expected output for every step. It is
written to be followed literally.

# Rules for executing

- **Do not skip a step.** The test-first ordering is deliberate. "Write the failing test"
  then "run it and watch it fail" is not ceremony — a test you have never seen fail is not a
  test, it is a decoration.
- **Do not improve on the plan.** If the plan says to write a specific function, write that
  function, with that name and that signature. Later tasks depend on the exact names.
- **Do not add anything the task did not ask for.** No extra components, no extra
  dependencies, no "while I was in here" refactors, no helpful abstractions. YAGNI is not
  advice here, it is a constraint.
- **Run every command the plan gives you and paste its real output.** Never write "tests
  pass" without the output. Never write "this should work".
- **If a command fails, do not proceed.** Fix it if the fix is obvious and within your task.
  If it is not, STOP and report the failure with full output. A half-finished task reported
  as done is the single most expensive thing you can do here.

# When you finish

1. Tick every checkbox for Task {{TASK_NUMBER}} in
   docs/superpowers/plans/2026-09-05-mossimo-rebrand.md, changing `- [ ]` to `- [x]`.
   Tick a box ONLY if that step's stated expected output actually appeared. A ticked box is
   a claim that the command ran and passed, and the next session will trust it.

2. Commit the code AND the updated plan file together, in one commit:

   git add <files you touched> docs/superpowers/plans/2026-09-05-mossimo-rebrand.md
   git commit -m "<the message the task specifies>"

   This is how the next session knows where to resume. If the code lands without the ticked
   checkboxes, work gets redone or skipped.

3. Do NOT push. Do NOT merge. Do NOT start the next task.

# What to report back

Your final message is the only thing that reaches the person who dispatched you. Include:

- Which task you completed.
- The real output of the final test run, pasted.
- The commit hash and message.
- Anything you had to deviate from the plan on, and why. Say this even if it seems minor —
  ESPECIALLY if it seems minor.
- Anything you noticed that looks wrong in a LATER task but did not touch.
- If you stopped early: exactly which step, the full error, and what you tried.

Do not claim success you did not verify. If something is half-done, say it is half-done.
````

---

## Notes for whoever is dispatching

**One task per agent, no batching.** Two tasks in one agent means the second one inherits a
context already full of the first one's dead ends.

**Review between tasks.** Read the diff, not just the agent's summary. The report is the
agent's account of its own work and is the least reliable artefact it produces.

**Tasks 1–3 are the ones to watch.** They establish tokens, the grain layer, and the
accent-rule test that every later task is checked against. An error there propagates
silently through everything after it.

**Task 3 has a deliberate self-test** — the agent adds a violating line, watches the test
catch it, then deletes it. If an agent reports Task 3 done without having seen that test
fail, send it back.

**If an agent reports a problem in a later task, fix the plan before dispatching that task.**
Do not carry the correction in your head; the next agent starts cold and cannot read your
mind.
