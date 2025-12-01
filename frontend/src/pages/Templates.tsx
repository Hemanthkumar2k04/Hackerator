import { Navbar } from '@/components/Navbar';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { Layers, BrainCircuit, ShoppingBag, PenTool } from 'lucide-react';
import { DotBackground } from '@/components/ui/dot-background';

const cards = [
  {
    title: "Full Stack App",
    icon: <Layers className="w-12 h-12 text-neutral-400 transition-colors duration-300 group-hover:text-indigo-500 group-hover:scale-110" />,
    link: "#",
    description: (
      <>
        A complete full stack application template featuring a React frontend, Node.js backend, and PostgreSQL database. <br /> <br />
        Includes authentication, API setup, and database schema management. Perfect for building robust web applications from scratch.
      </>
    ),
  },
  {
    title: "ML Project",
    icon: <BrainCircuit className="w-12 h-12 text-neutral-400 transition-colors duration-300 group-hover:text-emerald-500 group-hover:scale-110" />,
    link: "#",
    description: (
      <>
        Kickstart your Machine Learning journey with this comprehensive template. <br /> <br />
        Pre-configured with Python, Scikit-learn, and Jupyter Notebooks. Ideal for data analysis, model training, and experimentation.
      </>
    ),
  },
  {
    title: "E-commerce Store",
    icon: <ShoppingBag className="w-12 h-12 text-neutral-400 transition-colors duration-300 group-hover:text-orange-500 group-hover:scale-110" />,
    link: "#",
    description: (
      <>
        Launch your online store with this modern E-commerce template. <br /> <br />
        Built with Next.js for performance, Stripe for secure payments, and Tailwind CSS for styling. Includes product pages, cart functionality, and checkout.
      </>
    ),
  },
  {
    title: "Blog Platform",
    icon: <PenTool className="w-12 h-12 text-neutral-400 transition-colors duration-300 group-hover:text-pink-500 group-hover:scale-110" />,
    link: "#",
    description: (
      <>
        A minimalist blog platform designed for writers. <br /> <br />
        Features Markdown support for easy writing and SEO optimization to help your content reach a wider audience.
      </>
    ),
  },
];

export function TemplatesPage() {
  return (
    <DotBackground className="min-h-screen h-auto justify-start">
      <Navbar variant="auth" />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Choose a Template</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Kickstart your project with one of our pre-built templates.
          </p>
        </div>
        
        <HoverEffect items={cards} />
      </main>
    </DotBackground>
  );
}
