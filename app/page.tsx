"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Users, Lock } from "lucide-react";
import { redirect } from "next/navigation";

export default function LandingPage() {
  redirect("/auth/login");
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-foreground">
                Design Inventory
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-foreground/70 hover:text-foreground transition"
              >
                Sign In
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <p className="text-sm font-medium text-primary">
              Studio Asset Management Made Simple
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            Manage Your Design Studio Inventory with Ease
          </h1>
          <p className="text-xl text-foreground/60 mb-8 text-balance max-w-2xl mx-auto">
            Streamline equipment tracking, manage requests, and keep your team
            organized. All-in-one inventory management for creative studios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Everything you need to manage your studio inventory efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-time Tracking",
                description:
                  "Monitor equipment availability and status in real-time across your studio.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Streamline requests and approvals with role-based access control.",
              },
              {
                icon: Lock,
                title: "Secure & Private",
                description:
                  "Enterprise-grade security with row-level access controls.",
              },
              {
                icon: CheckCircle2,
                title: "Easy Management",
                description:
                  "Intuitive interface for adding, editing, and organizing inventory.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border/40 bg-card hover:border-border transition"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-primary/5 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Join design studios using our platform to streamline operations and
            improve team collaboration.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 sm:px-6 lg:px-8 py-12 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-foreground">
                Design Inventory Hub
              </span>
            </div>
            <p className="text-foreground/60 text-sm">
              Streamline your studio operations with smart inventory management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
