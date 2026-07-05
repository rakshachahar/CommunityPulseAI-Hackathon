import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-primary/20 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" x2="9.01" y1="9" y2="9" />
          <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Area Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-[500px]">
        Looks like this sector isn't on our grid. The issue you're looking for may have been resolved or the URL is incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Return to Base
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            View Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}