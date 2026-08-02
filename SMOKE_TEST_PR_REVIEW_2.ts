// Scratch file for pr-review-fixer retest (Task 7.3).
// See plans/in-progress/2026-07-10__claude-governance-gap-round-4/checklist.md.
// Deleted and this PR closed once the retest completes.

export function sumFirstN(items: number[], n: number): number {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += items[i];
  }
  return total;
}
