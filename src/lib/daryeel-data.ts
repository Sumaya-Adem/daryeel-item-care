import belongingsImage from "@/assets/daryeel-belongings.jpg";
import { DEFAULT_VISIBILITY, type AppNotification, type Item, type Owner } from "./daryeel-types";

export const OWNER: Owner = {
  name: "Ahmed Ali",
  phone: "+252 63 000 0000",
  email: "ahmed@example.com",
};

export const sampleItems: Item[] = [
  {
    id: "DY-4K71QP",
    name: "Dell Latitude 5420",
    category: "Electronics",
    brand: "Dell",
    model: "Latitude 5420",
    serial: "DL-5420-AX91",
    purchaseDate: "12 March 2026",
    warrantyExpiry: "12 March 2027",
    price: "$840",
    seller: "Tech Point",
    notes: "Work laptop — charger in desk drawer",
    photo: belongingsImage,
    icon: "laptop",
    status: "active",
    visibility: { ...DEFAULT_VISIBILITY },
  },
  {
    id: "DY-2M55RB",
    name: "iPhone 14 Pro",
    category: "Electronics",
    brand: "Apple",
    model: "A2890",
    serial: "IP-14P-7741",
    purchaseDate: "02 January 2026",
    warrantyExpiry: "02 January 2027",
    price: "$1,050",
    seller: "Mobile World",
    notes: "Personal phone",
    photo: null,
    icon: "phone",
    status: "active",
    visibility: { ...DEFAULT_VISIBILITY },
  },
  {
    id: "DY-9T32VC",
    name: "Toyota Corolla",
    category: "Vehicles",
    brand: "Toyota",
    model: "Corolla 2018",
    serial: "VIN-JTD-88192",
    purchaseDate: "20 June 2024",
    warrantyExpiry: "",
    price: "$9,400",
    seller: "City Motors",
    notes: "Spare key kept at home",
    photo: null,
    icon: "car",
    status: "lost",
    visibility: { ...DEFAULT_VISIBILITY },
  },
  {
    id: "DY-6B18LD",
    name: "Property Documents",
    category: "Documents",
    brand: "—",
    model: "—",
    serial: "DOC-2026-114",
    purchaseDate: "08 February 2026",
    warrantyExpiry: "",
    price: "",
    seller: "",
    notes: "Kept in the home safe",
    photo: null,
    icon: "document",
    status: "active",
    visibility: { ...DEFAULT_VISIBILITY, contactNumber: true, serialNumber: false },
  },
];

export const sampleNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Warranty expires in 7 days",
    text: "Dell Latitude 5420 needs your attention.",
    tone: "gold",
    icon: "warranty",
    unread: true,
    time: "Today",
  },
  {
    id: "n2",
    title: "Your item was marked Lost",
    text: "Toyota Corolla public page is now updated.",
    tone: "red",
    icon: "lost",
    unread: true,
    time: "Today",
  },
  {
    id: "n3",
    title: "Warranty expires in 30 days",
    text: "iPhone 14 Pro warranty is ending soon.",
    tone: "gold",
    icon: "calendar",
    unread: false,
    time: "Yesterday",
  },
  {
    id: "n4",
    title: "Car maintenance is due",
    text: "Scheduled maintenance is due this week.",
    tone: "teal",
    icon: "car",
    unread: false,
    time: "2 days ago",
  },
  {
    id: "n5",
    title: "QR settings were updated",
    text: "Your public information choices were saved.",
    tone: "teal",
    icon: "qr",
    unread: false,
    time: "3 days ago",
  },
];

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

export function mockItemId() {
  let code = "";
  for (let i = 0; i < 6; i += 1) code += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  return `DY-${code}`;
}
