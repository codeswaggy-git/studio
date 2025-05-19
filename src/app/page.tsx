
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractRiskAssessment } from "@/components/features/contract-risk-assessment";
import { GdprContractGenerator } from "@/components/features/gdpr-contract-generator";
import { Logo } from "@/components/layout/logo";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ShieldCheck, AlertCircle } from "lucide-react";


export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // No automatic redirect, show welcome message instead
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] py-12">
        <Logo />
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to PactPilot
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Your AI co-pilot for navigating the complexities of contracts. Analyze risks, ensure compliance, and negotiate with confidence.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            <Card className="text-left shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertCircle className="text-primary"/>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>Identify potential legal risks in your contracts with AI-powered analysis.</CardDescription>
                </CardContent>
            </Card>
            <Card className="text-left shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/>GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>Generate GDPR-compliant clauses tailored to your client&apos;s location.</CardDescription>
                </CardContent>
            </Card>
            <Card className="text-left shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                        Market Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>(Coming Soon) Compare offers with real-time market data for better negotiation.</CardDescription>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">PactPilot Dashboard</h1>
        <p className="text-muted-foreground">Manage your contract analysis and generation tasks.</p>
      </div>
      <Tabs defaultValue="risk-assessment" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-background shadow-sm border">
          <TabsTrigger value="risk-assessment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <AlertCircle className="mr-2 h-4 w-4" /> Contract Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="gdpr-generator" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShieldCheck className="mr-2 h-4 w-4" /> GDPR Contract Generator
          </TabsTrigger>
        </TabsList>
        <TabsContent value="risk-assessment" className="mt-6">
          <ContractRiskAssessment />
        </TabsContent>
        <TabsContent value="gdpr-generator" className="mt-6">
          <GdprContractGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
