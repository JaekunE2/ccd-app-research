# Research gates

Why: topics picked only for being feasible by a deadline tend to postpone the cheap checks that could refute them;
independent ground truth, strong baselines and pilot effect sizes then arrive late and shrink the claim.

These gates apply to every new project and every new topic. Where they conflict with §1 P1/P9 of the operating manual, they take precedence.

1. **Question first.** Before choosing a venue, write four things: the question, whose decision changes if you answer it, the contribution type (method / resource / negative result), and the result that would make you stop. Then check the 5 closest papers and record the real difference. If the difference is only a data swap or a renaming, do not start.
2. **Independent ground truth.**
   - Record where the ground truth comes from and the shared dependencies between generator, labeler and evaluator.
   - Do not start if the core result depends on human work that has not been secured, or on self-referential evaluation, such as the same model family or the same ICP judging itself.
   - Independent formula implementations, solver checks and public ground truth all count as independent.
3. **Baselines before the method.** First reproduce a simple strong baseline (uniform / random / rule / template, whichever applies) and the closest public method. Match their inputs, tuning and compute budget to the candidate method's.
4. **7-day pilot.**
   - Before the pilot, write down the practical effect size, the precision you need, the independent units (scene / source item / problem family / training seed, never cells or rollouts), and the sample plan.
   - Pass means the pre-set effect is met with a CI lower bound > 0 over at least 10 independent units, on data kept separate from the confirmation data.
   - One rescue redesign is allowed; after that, stop.
5. **Promotion.** An exploratory signal becomes a claim only through a new registration on data nobody has looked at. Existing verdicts are preserved. A change to a criterion or label is recorded as a new version.
6. **What counts as a result.**
   - A method needs an effect.
   - A resource needs a new evaluation capability and reproducibility: one command regenerates every main table.
   - A negative result must either rule out a meaningful effect or reproduce an important failure on independent data.
   - Every result is labelled `supported`, `refuted` or `inconclusive`. Never force `inconclusive` into `refuted`.
7. **Stopping.**
   - At most 2 formal LLM reviews per project: one at design, one on the final package.
   - Weak accept is never an investment gate or an exit gate.
   - After a failed pilot plus the one rescue, set `killed`, or `archived` for kept assets, and write FINAL.md. Do not write a paper first.
   - To close a project: write `research/FINAL.md`, set `state.gates_close` to `killed`, `archived` or `completed` (a finished package awaiting only the user's submit decision), then set `status=done`. The stop hook then waives the weak-accept review gate.
8. **Portfolio.**
   - At most 4 active projects at once, counting submission and revision work.
   - Before any submission, check the evidence, the venue's AI policy (disclose actual AI use), duplication with other papers, and the total human cost: upload, rebuttal, registration, travel, and service duties such as reviewing duties.
   - Plan the user only as a decision-maker. Never plan the user as a bulk labeler.
