export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts: number,
  delayMs: number,
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      const delay = delayMs * Math.pow(2, i);
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  Retry ${i + 1}/${attempts} after ${delay}ms: ${message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}
