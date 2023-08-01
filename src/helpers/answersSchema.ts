import { z } from 'zod';

export const messageCompletionSchema = z.object({
  title: z
    .string()
    .describe('title based on the question and answer, in one sentence'),
  answer: z.string().describe("answer to the user's question"),
  tags: z.string().describe('3 or 4 tags based on the question and answer'),
});
