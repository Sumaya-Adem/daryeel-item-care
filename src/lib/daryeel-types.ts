export type Category = "Electronics" | "Vehicles" | "Appliances" | "Documents" | "Other";

export const CATEGORIES: Category[] = ["Electronics", "Vehicles", "Appliances", "Documents", "Other"];

export type ItemStatus = "active" | "lost";

export interface Visibility {
  itemName: boolean;
  ownerName: boolean;
  contactNumber: boolean;
  serialNumber: boolean;
  warrantyStatus: boolean;
}

export interface Item {
  id: string;
  name: string;
  category: Category;
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  warrantyExpiry: string;
  price: string;
  seller: string;
  notes: string;
  photo: string | null;
  icon: "laptop" | "phone" | "car" | "document" | "box";
  status: ItemStatus;
  visibility: Visibility;
}

export interface AppNotification {
  id: string;
  title: string;
  text: string;
  tone: "teal" | "gold" | "red";
  icon: "warranty" | "lost" | "found" | "calendar" | "qr" | "car";
  unread: boolean;
  time: string;
}

export interface Owner {
  name: string;
  phone: string;
  email: string;
}

export const DEFAULT_VISIBILITY: Visibility = {
  itemName: true,
  ownerName: true,
  contactNumber: true,
  serialNumber: false,
  warrantyStatus: false,
};
