import { Link } from "react-router-dom";

export function AuthLogo() {
  return (
    <Link to="/signin" className="flex flex-col items-center gap-3 group">
      <div className="rounded-2xl border border-border/40 bg-card p-3 shadow-sm transition-shadow group-hover:shadow-md">
        <img
          src="/banner-logo.svg"
          alt="CampusConnect"
          className="h-20 w-auto sm:h-24"
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground tracking-tight">
        CampusConnect
      </span>
    </Link>
  );
}
