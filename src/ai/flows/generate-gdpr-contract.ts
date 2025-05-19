// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview Generates a web development contract with GDPR-compliant clauses based on the client's location.
 *
 * - generateGdprContract - A function that generates the GDPR-compliant contract.
 * - GenerateGdprContractInput - The input type for the generateGdprContract function.
 * - GenerateGdprContractOutput - The return type for the generateGdprContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGdprContractInputSchema = z.object({
  clientLocation: z
    .string()
    .describe('The location of the client (e.g., country or region).'),
  webDevelopmentDetails: z
    .string()
    .describe('Details about the web development project.'),
});
export type GenerateGdprContractInput = z.infer<typeof GenerateGdprContractInputSchema>;

const GenerateGdprContractOutputSchema = z.object({
  contractText: z
    .string()
    .describe('The generated web development contract with GDPR clauses.'),
});
export type GenerateGdprContractOutput = z.infer<typeof GenerateGdprContractOutputSchema>;

export async function generateGdprContract(
  input: GenerateGdprContractInput
): Promise<GenerateGdprContractOutput> {
  return generateGdprContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGdprContractPrompt',
  input: {schema: GenerateGdprContractInputSchema},
  output: {schema: GenerateGdprContractOutputSchema},
  prompt: `You are a legal expert specializing in GDPR compliance for web development contracts.

  Based on the client's location, generate a web development contract that includes GDPR-compliant data clauses.

  Client Location: {{{clientLocation}}}
  Web Development Details: {{{webDevelopmentDetails}}}

  Include clauses related to:
  - Data processing agreement
  - Data security measures
  - User consent
  - Data breach notification
  - Rights of data subjects

  The contract should be comprehensive and legally sound.
  `,
});

const generateGdprContractFlow = ai.defineFlow(
  {
    name: 'generateGdprContractFlow',
    inputSchema: GenerateGdprContractInputSchema,
    outputSchema: GenerateGdprContractOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
