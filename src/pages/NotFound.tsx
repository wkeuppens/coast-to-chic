import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 font-display text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline transition-colors"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
