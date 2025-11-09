import type { ReactNode } from "react";
import { GraduationCap, Users, Award, CheckCircle, Lock } from "lucide-react";

interface LoginLayoutProps {
  title: string;
  subtitle: string;
  leftTitle: string;
  leftHighlight: string;
  leftDescription: string;
  features: string[];
  children: ReactNode; // right side form
}

export default function LoginLayout({
  
  leftTitle,
  leftHighlight,
  leftDescription,
  features,
  children,
}: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>

      <div className="relative w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-border/50">
        {/* 🔹 Header */}
        <div className="bg-primary/5 border-b border-border/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-mono">
                  Blueboard Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Empowering learners & educators alike
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10K+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Verified Experts</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Main Body */}
        <div className="flex">
          {/* Left Section */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 flex-col justify-center relative overflow-hidden">
            <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                {leftTitle}
              </div>

              <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                Welcome Back,
                <span className="text-primary block">{leftHighlight}</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {leftDescription}
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section (Form) */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">{children}</div>
        </div>
      </div>
    </div>
  );
}

