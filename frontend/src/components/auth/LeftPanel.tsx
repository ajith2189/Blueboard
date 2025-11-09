import { CheckCircle, Lock } from "lucide-react";

interface LeftPanelProps {
  variant: "user" | "tutor" | "admin";
}

export default function LeftPanel({ variant }: LeftPanelProps) {
  const titles = {
    user: "Welcome Back to Your Learning Journey",
    tutor: "Empower Students with Your Knowledge",
    admin: "Manage Platform Securely and Efficiently",
  };

  const features =
    variant === "user"
      ? [
          "Resume your courses exactly where you left off",
          "Access your personalized learning dashboard",
          "Connect with your mentors and peers",
          "Track your progress and achievements",
        ]
      : variant === "tutor"
      ? [
          "Manage your classes and schedules easily",
          "Monitor student performance in real-time",
          "Access teaching resources and analytics",
          "Grow your tutor profile visibility",
        ]
      : [
          "Monitor platform statistics and users",
          "Manage courses and approvals",
          "Ensure data privacy and security",
          "Control access across all roles",
        ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 flex-col justify-center relative overflow-hidden">
      <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Lock className="w-4 h-4" />
          Secure Access Portal
        </div>

        <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
          {titles[variant].split(" ").slice(0, -3).join(" ")}{" "}
          <span className="text-primary block">
            {titles[variant].split(" ").slice(-3).join(" ")}
          </span>
        </h2>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
