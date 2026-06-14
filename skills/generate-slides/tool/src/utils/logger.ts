export function logStep(stage: string, message: string): void {
  console.error(`[${stage}] ${message}`);
}

export function logProgress(current: number, total: number, label: string): void {
  console.error(`[${current}/${total}] ${label}`);
}
