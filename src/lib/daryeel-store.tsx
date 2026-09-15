import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { mockItemId, OWNER, sampleItems, sampleNotifications } from "./daryeel-data";
import type { AppNotification, Item, Owner } from "./daryeel-types";

export type Screen =
  | "splash"
  | "welcome"
  | "signup"
  | "login"
  | "forgot"
  | "home"
  | "items"
  | "add"
  | "edit"
  | "details"
  | "qr"
  | "public"
  | "lost"
  | "notifications"
  | "profile"
  | "profile-section"
  | "empty";

export interface NavState {
  screen: Screen;
  itemId?: string;
  section?: string;
}

interface StoreValue {
  owner: Owner;
  items: Item[];
  notifications: AppNotification[];
  nav: NavState;
  go: (screen: Screen, options?: { itemId?: string; section?: string }) => void;
  selectedItem: Item | undefined;
  addItem: (item: Omit<Item, "id">) => Item;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  setStatus: (id: string, status: Item["status"]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  pushNotification: (n: Omit<AppNotification, "id" | "unread" | "time">) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function DaryeelStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications);
  const [nav, setNav] = useState<NavState>({ screen: "home" });

  const go = useCallback<StoreValue["go"]>((screen, options) => {
    setNav({ screen, itemId: options?.itemId, section: options?.section });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const pushNotification = useCallback<StoreValue["pushNotification"]>((n) => {
    setNotifications((list) => [
      { ...n, id: `n-${Date.now()}-${Math.random().toString(16).slice(2)}`, unread: true, time: "Just now" },
      ...list,
    ]);
  }, []);

  const addItem = useCallback<StoreValue["addItem"]>((item) => {
    const created: Item = { ...item, id: mockItemId() };
    setItems((list) => [created, ...list]);
    return created;
  }, []);

  const updateItem = useCallback<StoreValue["updateItem"]>((id, patch) => {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const deleteItem = useCallback<StoreValue["deleteItem"]>((id) => {
    setItems((list) => list.filter((item) => item.id !== id));
  }, []);

  const setStatus = useCallback<StoreValue["setStatus"]>(
    (id, status) => {
      setItems((list) => list.map((item) => (item.id === id ? { ...item, status } : item)));
      const target = items.find((item) => item.id === id);
      pushNotification(
        status === "lost"
          ? {
              title: "Item marked as Lost",
              text: `${target?.name ?? "Your item"} public page now shows the lost notice.`,
              tone: "red",
              icon: "lost",
            }
          : {
              title: "Item marked as Found",
              text: `${target?.name ?? "Your item"} is active again.`,
              tone: "teal",
              icon: "found",
            },
      );
    },
    [items, pushNotification],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      owner: OWNER,
      items,
      notifications,
      nav,
      go,
      selectedItem: items.find((item) => item.id === nav.itemId),
      addItem,
      updateItem,
      deleteItem,
      setStatus,
      markRead,
      markAllRead,
      unreadCount: notifications.filter((n) => n.unread).length,
      pushNotification,
    }),
    [items, notifications, nav, go, addItem, updateItem, deleteItem, setStatus, markRead, markAllRead, pushNotification],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDaryeel() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useDaryeel must be used inside DaryeelStoreProvider");
  return value;
}
