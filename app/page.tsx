import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Moon, LayoutDashboard, Copy, Terminal, BarChart3 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 lg:px-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="snap-start min-h-screen flex items-center justify-center px-6 lg:px-10 pt-16">
          <div className="mx-auto max-w-5xl text-center space-y-8 opacity-0 translate-y-8 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-pretty lg:leading-[1.1]">
              Drop-in feedback widget <br />
              <span className="text-primary">for your next idea</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Start collecting user insight in seconds. No complex setup. Just good, actionable feedback directly in your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-none shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo">
                 <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-none hover:bg-muted/50 transition-colors duration-300">
                  View Demo
                </Button>
              </Link>
            </div>
            
            <div className="pt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Open Source
                </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section id="demo" className="snap-start min-h-screen flex items-center justify-center bg-muted/30 px-6 lg:px-10 border-y relative overflow-hidden">
          <div className="mx-auto max-w-7xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="order-2 lg:order-1 space-y-8" style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s', opacity: 0, transform: 'translateY(2rem)' }}>
                <div className="rounded-none border bg-[#0d1117] text-white shadow-2xl transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  <div className="border-b border-gray-800 p-4 flex items-center justify-between bg-white/5">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">index.html</span>
                  </div>
                  <div className="p-6 sm:p-8 overflow-x-auto">
                    <pre className="text-sm sm:text-base font-mono leading-relaxed">
                      <code>
                        <span className="text-gray-500">&lt;!-- Add to &lt;body&gt; --&gt;</span>
                        <br />
                        <span className="text-[#ff7b72]">&lt;script</span>
                        <br />
                        <span className="pl-4 text-[#79c0ff]">src</span>=<span className="text-[#a5d6ff]">"https://feedbackpulse.com/widget.js"</span>
                        <br />
                        <span className="pl-4 text-[#79c0ff]">data-project-key</span>=<span className="text-[#a5d6ff]">"fp_your_api_key"</span>
                        <br />
                        <span className="text-[#ff7b72]">&gt;&lt;/script&gt;</span>
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-background p-4 rounded-none border shadow-sm hover:border-primary/50 transition-colors duration-300">
                      <Zap className="h-6 w-6 text-yellow-500 mb-2" />
                      <h3 className="font-semibold">Lightweight</h3>
                      <p className="text-sm text-muted-foreground">~2kb gzipped bundle.</p>
                   </div>
                   <div className="bg-background p-4 rounded-none border shadow-sm hover:border-primary/50 transition-colors duration-300">
                      <Moon className="h-6 w-6 text-purple-500 mb-2" />
                      <h3 className="font-semibold">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">Auto-adapts to theme.</p>
                   </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-6" style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s', opacity: 0, transform: 'translateY(2rem)' }}>
                  <div className="inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                    Developer First
                  </div>
                   <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                     Real code. <span className="text-muted-foreground block">Real easy.</span>
                   </h2>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     Copy the snippet. Paste it into your project. That's it. Your users can now report bugs, request features, and share love instantly. No npm install required (unless you want to).
                   </p>
                   
                   <div className="pt-4">
                        <div className="relative p-8 border rounded-none bg-background shadow-sm border-dashed max-w-md hover:border-primary/30 transition-colors duration-300">
                            <div className="absolute top-0 left-0 bg-muted px-3 py-1 text-xs font-mono rounded-br rounded-tl-none border-b border-r">Preview</div>
                            <div className="space-y-4 opacity-50 blur-[1px]">
                                <div className="h-4 w-3/4 bg-muted rounded-none"></div>
                                <div className="h-24 w-full bg-muted/50 rounded-none"></div>
                                <div className="h-4 w-1/2 bg-muted rounded-none"></div>
                            </div>
                            {/* Fake Widget Button */}
                            <div className="absolute -bottom-4 -right-4 shadow-xl">
                                <div className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-none cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                     <span className="font-semibold text-sm">Feedback</span>
                                </div>
                            </div>
                        </div>
                   </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Insight Section */}
         <section className="snap-start min-h-screen flex items-center justify-center px-6 lg:px-10">
            <div className="mx-auto max-w-7xl w-full">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="space-y-8" style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s', opacity: 0, transform: 'translateY(2rem)' }}>
                         <div className="inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                            Analytics
                          </div>
                         <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                            Insights directly <br/>
                            <span className="text-muted-foreground">in your dashboard.</span>
                         </h2>
                         <p className="text-lg text-muted-foreground">
                            Stop digging through emails. View all your user feedback in one clean, organized dashboard. Filter by type, sentiment, and project.
                        </p>
                        
                         <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-lg">
                                <div className="h-8 w-8 rounded-none bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
                                </div>
                                <span>Filter by Bug, Idea, or General feedback</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                                <div className="h-8 w-8 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                                </div>
                                <span>Built-in sentiment analysis</span>
                            </li>
                            <li className="flex items-center gap-3 text-lg">
                               <div className="h-8 w-8 rounded-none bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Terminal className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                                </div>
                                <span>Export data anytime</span>
                            </li>
                        </ul>
                        
                        <div className="pt-4">
                           <Link href="/dashboard">
                            <Button size="lg" variant="outline" className="h-12 px-8 rounded-none hover:bg-muted/50 transition-colors">
                                Get Started
                            </Button>
                        </Link>
                        </div>
                    </div>
                    
                    <div className="relative group perspective-1000" style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s', opacity: 0, transform: 'translateY(2rem)' }}>
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-linear-to-r from-primary/30 to-purple-600/30 rounded-none blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                        
                        <div className="relative rounded-none border bg-card shadow-2xl skew-y-1 rotate-1 group-hover:transform-none transition-all duration-700 ease-[cubic-bezier(0.25,0.4,0.25,1)] overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-tr from-background/80 via-background/50 to-transparent z-10 custom-overlay pointer-events-none"></div>
                            
                            <div className="p-3 border-b flex gap-2 bg-muted/40">
                                 <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                 <div className="h-3 w-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="p-8 space-y-6 bg-background h-[400px]">
                                 <div className="flex justify-between items-center mb-6">
                                    <div className="h-6 w-32 bg-muted rounded-none"></div>
                                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                                 </div>
                                 <div className="flex gap-4">
                                    <div className="h-32 w-1/3 bg-muted/30 rounded-none border border-dashed flex flex-col p-4 gap-2">
                                        <div className="h-4 w-8 bg-primary/20 rounded-none"></div>
                                        <div className="h-8 w-16 bg-muted rounded-none mt-auto"></div>
                                    </div>
                                    <div className="h-32 w-1/3 bg-muted/30 rounded-none border border-dashed flex flex-col p-4 gap-2">
                                        <div className="h-4 w-8 bg-primary/20 rounded-none"></div>
                                        <div className="h-8 w-16 bg-muted rounded-none mt-auto"></div>
                                    </div>
                                    <div className="h-32 w-1/3 bg-muted/30 rounded-none border border-dashed flex flex-col p-4 gap-2">
                                        <div className="h-4 w-8 bg-primary/20 rounded-none"></div>
                                        <div className="h-8 w-16 bg-muted rounded-none mt-auto"></div>
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                     <div key={i} className="h-16 w-full bg-card border rounded-none shadow-sm flex items-center px-4 gap-4">
                                         <div className="h-10 w-10 rounded-none bg-muted/50"></div>
                                         <div className="space-y-2 flex-1">
                                             <div className="h-3 w-1/3 bg-muted rounded-none"></div>
                                             <div className="h-2 w-2/3 bg-muted/50 rounded-none"></div>
                                         </div>
                                     </div>
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </section>
         
         <footer className="snap-start min-h-[50vh] flex flex-col items-center justify-center border-t bg-muted/20 px-6">
            <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 font-bold text-2xl">
                    <Logo />
                </div>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    The easiest way to collect feedback for your side-projects and startups.
                </p>
                <div className="flex justify-center gap-8 font-medium">
                    <Link href="#" className="hover:underline">Privacy</Link>
                    <Link href="#" className="hover:underline">Terms</Link>
                    <Link href="#" className="hover:underline">Twitter</Link>
                    <Link href="#" className="hover:underline">GitHub</Link>
                </div>
                 <p className="text-sm text-muted-foreground pt-8">
                    &copy; {new Date().getFullYear()} Feedback Pulse. All rights reserved.
                </p>
            </div>
         </footer>
      </main>
    </div>
  );
}
