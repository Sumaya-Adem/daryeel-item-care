import { useMemo, useState } from "react";
import { PackageOpen, Plus, Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDaryeel } from "@/lib/daryeel-store";
import { CATEGORIES, type ItemStatus } from "@/lib/daryeel-types";
import { cn } from "@/lib/utils";
import { ItemList } from "./item-card";
import { EmptyState, PageHeader } from "./ui-kit";

type StatusFilter = "all" | ItemStatus;

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "lost", label: "Lost" },
];

export function ItemsScreen() {
  const { items, go, nav } = useDaryeel();
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<StatusFilter>(
    nav.section === "lost" || nav.section === "active" ? nav.section : "all",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const inStatus = status === "all" || item.status === status;
      const matches =
        !text ||
        [item.name, item.brand, item.model, item.serial, item.category].some((field) =>
          field.toLowerCase().includes(text),
        );
      return inCategory && inStatus && matches;
    });
  }, [items, category, status, query]);

  const filtersActive = query.trim() !== "" || category !== "All" || status !== "all";
  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setStatus("all");
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="My Items"
        subtitle={`${items.length} belonging${items.length === 1 ? "" : "s"} registered`}
        action={
          <Button onClick={() => go("add")}>
            <Plus /> Add
          </Button>
        }
      />
      <div className="px-gutter">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            className="pl-10 pr-11 [&::-webkit-search-cancel-button]:appearance-none"
            placeholder="Search your belongings"
            aria-label="Search your belongings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            role="group"
            aria-label="Filter by status"
            className="inline-flex shrink-0 rounded-lg border border-border bg-muted p-0.5"
          >
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={status === option.id}
                onClick={() => setStatus(option.id)}
                className={cn(
                  "h-8 cursor-pointer rounded-md px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  status === option.id
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="-mx-gutter mt-3 flex gap-2 overflow-x-auto px-gutter pb-1"
          role="group"
          aria-label="Filter by category"
        >
          {["All", ...CATEGORIES].map((option) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              aria-pressed={category === option}
              onClick={() => setCategory(option)}
              className="shrink-0 rounded-full"
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex min-h-6 items-center justify-between gap-3">
          <p className="type-caption text-muted-foreground" aria-live="polite">
            {items.length === 0
              ? ""
              : `Showing ${filtered.length} of ${items.length} item${items.length === 1 ? "" : "s"}`}
          </p>
          {filtersActive && items.length > 0 ? (
            <Button variant="link" className="h-auto p-0 text-[13px]" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>

        <div className="mt-3">
          {items.length === 0 ? (
            <EmptyState
              icon={<PackageOpen />}
              title="No items yet"
              text="You haven't added any belongings yet. Add one to create its digital identity."
              action={
                <Button onClick={() => go("add")}>
                  <Plus /> Add your first item
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              tone="muted"
              icon={<SearchX />}
              title="No matching items"
              text="Nothing matches your search or filters. Try a different word, category or status."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ItemList items={filtered} onOpen={(item) => go("details", { itemId: item.id })} />
          )}
        </div>
      </div>
    </div>
  );
}
