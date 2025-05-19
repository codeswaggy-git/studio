'use server';

/**
 * @fileOverview Contract Risk Assessment AI agent.
 *
 * - assessContractRisk - A function that handles the contract risk assessment process.
 * - AssessContractRiskInput - The input type for the assessContractRisk function.
 * - AssessContractRiskOutput - The return type for the assessContractRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessContractRiskInputSchema = z.object({
  contractText: z
    .string()
    .describe('The contract text to assess, should be plain text or PDF text.'),
});
export type AssessContractRiskInput = z.infer<typeof AssessContractRiskInputSchema>;

const AssessContractRiskOutputSchema = z.object({
  riskScore: z
    .number()
    .describe('A risk score from 0 to 100, with 100 being the riskiest.'),
  riskyClauses: z
    .array(z.string())
    .describe('Specific clauses identified as potentially risky.'),
  suggestedReplacements: z
    .array(z.string())
    .describe('AI-suggested replacements for risky clauses.'),
  ab5Violation: z.boolean().describe('Whether the contract violates California AB-5 laws.'),
});
export type AssessContractRiskOutput = z.infer<typeof AssessContractRiskOutputSchema>;

export async function assessContractRisk(input: AssessContractRiskInput): Promise<AssessContractRiskOutput> {
  return assessContractRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessContractRiskPrompt',
  input: {schema: AssessContractRiskInputSchema},
  output: {schema: AssessContractRiskOutputSchema},
  prompt: `You are an AI-powered legal assistant specializing in contract risk assessment.

You will analyze the provided contract text and identify potential legal risks, especially concerning California AB-5 laws.

You will provide a risk score from 0 to 100, with 100 being the riskiest. You will also list specific clauses identified as risky and suggest safer alternatives.

Contract Text:
{{{contractText}}}

Output in JSON format:
{
  "riskScore": number,
  "riskyClauses": string[],
  "suggestedReplacements": string[],
  "ab5Violation": boolean
}
`,
});

const assessContractRiskFlow = ai.defineFlow(
  {
    name: 'assessContractRiskFlow',
    inputSchema: AssessContractRiskInputSchema,
    outputSchema: AssessContractRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
