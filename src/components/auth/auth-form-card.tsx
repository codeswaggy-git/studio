
import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/layout/logo';

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormCard({ title, description, children, footer }: AuthFormCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem-3.5rem)] flex-col items-center justify-center p-4"> {/* Adjust height based on header */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
