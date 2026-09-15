import { useEffect, useMemo, useState } from "react";
import { PackageOpen, Plus, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDaryeel } from "@/lib/daryeel-store";
import { CATEGORIES } from "@/lib/daryeel-types";
import { ItemList } from "./item-card";
import { EmptyState, ListSkeleton, PageHeader } from "./ui-kit";

export function ItemsScreen() {
  const { items, go } = useDaryeel();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const matches =
        !text ||
        [item.name, item.brand, item.model, item.serial, item.category].some((field) =>
          field.toLowerCase().includes(text),
        );
      return inCategory && matches;
    });
  }, [items, category, query]);

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="My Items"
        action={
          <Button size="icon" onClick={() => go("add")} aria-label="Add item">
            <Plus />
          </Button>
        }
      />
      <div className="px-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-[13px] bg-card pl-11"
            placeholder="Search your belongings..."
            aria-label="Search your belongings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2" role="group" aria-label="Filter by category">
          {["All", ...CATEGORIES].map((option) => (
            <Button
              key={option}
              variant={category === option ? "default" : "outline"}
              aria-pressed={category === option}
              onClick={() => setCategory(option)}
              className="h-9 shrink-0 rounded-full px-4 text-xs"
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="mt-5">
          {loading ? (
            <ListSkeleton />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<PackageOpen />}
              title="No Items Yet"
              text="You haven't added any belongings yet."
              action={
                <Button onClick={() => go("add")}>
                  <Plus /> Add Your First Item
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              tone="muted"
              icon={<SearchX />}
              title="No results"
              text="No belongings match your search or filter. Try a different word or category."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
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
