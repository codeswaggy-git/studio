
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { runContractRiskAssessment } from "@/actions/contract-actions";
import type { AssessContractRiskOutput } from "@/ai/flows/contract-risk-assessment";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiskIndicator } from "@/components/risk-indicator";
import { CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react";

const formSchema = z.object({
  contractText: z.string().min(50, { message: "Contract text must be at least 50 characters." }),
});

type ContractRiskFormValues = z.infer<typeof formSchema>;

export function ContractRiskAssessment() {
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessContractRiskOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ContractRiskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractText: "",
    },
  });

  async function onSubmit(values: ContractRiskFormValues) {
    setIsLoading(true);
    setAssessmentResult(null);
    const response = await runContractRiskAssessment({ contractText: values.contractText });
    setIsLoading(false);

    if (response.success && response.data) {
      setAssessmentResult(response.data);
      toast({
        title: "Assessment Complete",
        description: "Contract risk assessment finished successfully.",
      });
    } else {
      toast({
        title: "Assessment Failed",
        description: response.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-7 w-7 text-primary" />
          Contract Risk Assessment
        </CardTitle>
        <CardDescription>
          Paste your contract text below to analyze potential risks, especially concerning California AB-5 laws.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contractText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="contractText" className="text-lg">Contract Text</FormLabel>
                  <FormControl>
                    <Textarea
                      id="contractText"
                      placeholder="Paste the full text of your contract here..."
                      className="min-h-[200px] rounded-md border shadow-sm focus:ring-2 focus:ring-primary"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader size="sm" className="mr-2" /> : <AlertCircle className="mr-2 h-4 w-4" />}
              Analyze Contract
            </Button>
          </form>
        </Form>
      </CardContent>

      {isLoading && (
        <CardFooter className="flex justify-center py-6">
          <Loader size="lg" />
        </CardFooter>
      )}

      {assessmentResult && (
        <CardFooter className="mt-6 flex flex-col gap-6 items-start">
          <h3 className="text-xl font-semibold text-primary">Assessment Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskIndicator score={assessmentResult.riskScore} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">California AB-5 Violation</CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentResult.ab5Violation ? (
                  <Alert variant="destructive" className="flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    <AlertDescription>Potential AB-5 Violation Detected.</AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="flex items-center border-green-500 bg-green-50 text-green-700">
                     <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <AlertDescription>No obvious AB-5 Violation Detected.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {assessmentResult.riskyClauses && assessmentResult.riskyClauses.length > 0 && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Potentially Risky Clauses</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/50">
                  <ul className="list-disc space-y-2 pl-5">
                    {assessmentResult.riskyClauses.map((clause, index) => (
                      <li key={index} className="text-sm">{clause}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {assessmentResult.suggestedReplacements && assessmentResult.suggestedReplacements.length > 0 && (
             <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Suggested Replacements / Mitigations</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/50">
                  <ul className="list-disc space-y-2 pl-5">
                    {assessmentResult.suggestedReplacements.map((suggestion, index) => (
                      <li key={index} className="text-sm">{suggestion}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
