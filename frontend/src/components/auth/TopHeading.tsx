// src/components/auth/AuthHeader.tsx
import { BookOpen, Users, Award } from "lucide-react";

export default function TopHeading() {
  return (
    <div className="bg-primary/5 border-b border-border/50 px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-mono">
              Blueboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Professional E-Learning Platform
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>50K+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Industry Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
