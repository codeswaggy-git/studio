
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { runGenerateGdprContract } from "@/actions/contract-actions";
import type { GenerateGdprContractOutput } from "@/ai/flows/generate-gdpr-contract";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, FileSignature } from "lucide-react";

const formSchema = z.object({
  clientLocation: z.string().min(2, { message: "Client location must be at least 2 characters." }),
  webDevelopmentDetails: z.string().min(20, { message: "Project details must be at least 20 characters." }),
});

type GdprFormValues = z.infer<typeof formSchema>;

export function GdprContractGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<GenerateGdprContractOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<GdprFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientLocation: "",
      webDevelopmentDetails: "",
    },
  });

  async function onSubmit(values: GdprFormValues) {
    setIsLoading(true);
    setGeneratedContract(null);
    const response = await runGenerateGdprContract(values);
    setIsLoading(false);

    if (response.success && response.data) {
      setGeneratedContract(response.data);
      toast({
        title: "Contract Generated",
        description: "GDPR-compliant contract generated successfully.",
      });
    } else {
      toast({
        title: "Generation Failed",
        description: response.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShieldCheck className="h-7 w-7 text-primary" />
          GDPR Contract Generator
        </CardTitle>
        <CardDescription>
          Generate a web development contract with GDPR-compliant data clauses based on your client&apos;s location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="clientLocation" className="text-lg">Client Location (e.g., Country, Region)</FormLabel>
                  <FormControl>
                    <Input
                      id="clientLocation"
                      placeholder="e.g., Germany, California (USA)"
                      {...field}
                      disabled={isLoading}
                      className="shadow-sm focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webDevelopmentDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="webDevelopmentDetails" className="text-lg">Web Development Project Details</FormLabel>
                  <FormControl>
                    <Textarea
                      id="webDevelopmentDetails"
                      placeholder="Describe the scope of the web development project..."
                      className="min-h-[150px] rounded-md border shadow-sm focus:ring-2 focus:ring-primary"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader size="sm" className="mr-2" /> : <FileSignature className="mr-2 h-4 w-4"/>}
              Generate Contract
            </Button>
          </form>
        </Form>
      </CardContent>

      {isLoading && (
        <CardFooter className="flex justify-center py-6">
          <Loader size="lg" />
        </CardFooter>
      )}

      {generatedContract && (
        <CardFooter className="mt-6 flex flex-col items-start gap-4">
          <h3 className="text-xl font-semibold text-primary">Generated Contract Text</h3>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/50 shadow-inner">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {generatedContract.contractText}
            </pre>
          </ScrollArea>
           <Button
            onClick={() => {
              navigator.clipboard.writeText(generatedContract.contractText);
              toast({ title: "Copied!", description: "Contract text copied to clipboard." });
            }}
            variant="outline"
          >
            Copy Contract Text
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
