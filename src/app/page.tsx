import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-48 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-center relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-gradient drop-shadow-sm">
            Learn. Build. Grow.
          </h1>
          <p className="max-w-[750px] mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            The premium developer ecosystem for modern software engineers. Master new technologies, read high-quality articles, and prepare for your next big interview.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/blog">
              <Button size="lg" className="w-full sm:w-auto font-bold text-lg px-8 bg-gradient-to-r from-primary to-orange-500 hover:from-primary hover:to-orange-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Explore Content
              </Button>
            </Link>
            <Link href="/roadmaps">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold text-lg px-8 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all hover:-translate-y-1">
                View Roadmaps
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section placeholder */}
      <section className="w-full py-24 relative">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-10 transform skew-y-3"></div>
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl font-extrabold mb-16 text-center text-slate-800 dark:text-slate-100">Featured Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Tech blocks */}
            {['React', 'Next.js', 'Spring Boot', 'PostgreSQL'].map((tech) => (
              <div key={tech} className="glass-card p-8 text-center group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-bold text-primary">{'</>'}</span>
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">{tech}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
