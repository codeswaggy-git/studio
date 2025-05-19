
import { Badge } from "@/components/ui/badge";
import { Circle, AlertTriangle, OctagonAlert, ShieldQuestion } from "lucide-react";

interface RiskIndicatorProps {
  score: number | null | undefined;
}

export function RiskIndicator({ score }: RiskIndicatorProps) {
  if (score === null || score === undefined) {
    return (
      <Badge variant="outline" className="flex items-center gap-2 text-sm py-1 px-3">
        <ShieldQuestion className="h-4 w-4 text-muted-foreground" />
        <span>Not Assessed</span>
      </Badge>
    );
  }

  let riskLevel: "low" | "medium" | "high" = "low";
  let IconComponent = Circle;
  let colorClasses = "bg-green-500 text-green-50"; // Using Tailwind direct colors for simplicity in this specific component
  let text = "Low Risk";

  if (score > 70) {
    riskLevel = "high";
    IconComponent = OctagonAlert;
    colorClasses = "bg-red-500 text-red-50";
    text = "High Risk";
  } else if (score > 30) {
    riskLevel = "medium";
    IconComponent = AlertTriangle;
    colorClasses = "bg-yellow-500 text-yellow-50";
    text = "Medium Risk";
  }

  return (
    <Badge className={`flex items-center gap-2 text-sm py-1 px-3 border-none ${colorClasses}`}>
      <IconComponent className="h-4 w-4" />
      <span>{text} ({score})</span>
    </Badge>
  );
}
