import { Sparkles, CheckCircle } from "lucide-react";

export default function RegisterHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 flex-col justify-center relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Join Our Learning Community
        </div>

        <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
          Transform Your Career with
          <span className="text-primary block">Expert-Led Courses</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Access premium courses, connect with industry experts, and advance
          your skills with our comprehensive learning platform trusted by
          professionals worldwide.
        </p>

        {/* Feature List */}
        <div className="space-y-4">
          {[
            "Interactive video lessons with real-world projects",
            "Personalized learning paths and progress tracking",
            "Direct access to industry mentors and experts",
            "Certificates recognized by top companies",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background"
                ></div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Join 50,000+ learners
              </p>
              <p className="text-xs text-muted-foreground">
                Average rating: 4.9/5 ⭐
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}