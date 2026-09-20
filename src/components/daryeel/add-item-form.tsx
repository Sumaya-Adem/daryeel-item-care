import { useRef, useState } from "react";
import { ArrowLeft, Camera, ChevronRight, FileText, ImagePlus, LockKeyhole, ShieldCheck, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDaryeel } from "@/lib/daryeel-store";
import { CATEGORIES, DEFAULT_VISIBILITY, type Category, type Item, type Visibility } from "@/lib/daryeel-types";
import { FormField, SelectField, StepHeading, TextAreaField } from "./ui-kit";

type Draft = {
  name: string;
  category: string;
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  price: string;
  seller: string;
  warrantyExpiry: string;
  notes: string;
  photo: string | null;
  visibility: Visibility;
};

const emptyDraft: Draft = {
  name: "",
  category: "",
  brand: "",
  model: "",
  serial: "",
  purchaseDate: "",
  price: "",
  seller: "",
  warrantyExpiry: "",
  notes: "",
  photo: null,
  visibility: { ...DEFAULT_VISIBILITY },
};

function draftFromItem(item: Item): Draft {
  return {
    name: item.name,
    category: item.category,
    brand: item.brand,
    model: item.model,
    serial: item.serial,
    purchaseDate: item.purchaseDate,
    price: item.price,
    seller: item.seller,
    warrantyExpiry: item.warrantyExpiry,
    notes: item.notes,
    photo: item.photo,
    visibility: { ...item.visibility },
  };
}

export function AddItemForm({ editing }: { editing?: Item | undefined }) {
  const { go, addItem, updateItem, pushNotification } = useDaryeel();
  const isEdit = Boolean(editing);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(editing ? draftFromItem(editing) : emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));

  const validateStepOne = () => {
    const next: Partial<Record<keyof Draft, string>> = {};
    if (draft.name.trim().length < 2) next.name = "Item name is required.";
    if (!draft.category) next.category = "Choose a category.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    set("photo")(url);
    toast.success("Photo added.");
  };

  const save = () => {
    const payload = {
      name: draft.name.trim(),
      category: (draft.category || "Other") as Category,
      brand: draft.brand.trim(),
      model: draft.model.trim(),
      serial: draft.serial.trim(),
      purchaseDate: draft.purchaseDate.trim(),
      warrantyExpiry: draft.warrantyExpiry.trim(),
      price: draft.price.trim(),
      seller: draft.seller.trim(),
      notes: draft.notes.trim(),
      photo: draft.photo,
      icon: "box" as Item["icon"],
      status: "active" as Item["status"],
      visibility: draft.visibility,
    };

    if (editing) {
      updateItem(editing.id, payload);
      toast.success("Item updated successfully.");
      go("details", { itemId: editing.id });
      return;
    }

    const created = addItem(payload);
    pushNotification({
      title: "New item added",
      text: `${created.name} now has the item ID ${created.id}.`,
      tone: "teal",
      icon: "qr",
    });
    toast.success("Item created successfully.");
    go("qr", { itemId: created.id });
  };

  const next = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    save();
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
    else if (editing) go("details", { itemId: editing.id });
    else go("home");
  };

  return (
    <div className="min-h-screen bg-card lg:min-h-[820px]">
      <div className="flex items-center gap-3 px-5 pt-6">
        <Button variant="ghost" size="icon" onClick={back} aria-label="Go back">
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-xl font-extrabold">{isEdit ? "Edit Item" : "Add New Item"}</h2>
          <p className="text-xs text-muted-foreground">Step {step} of 4</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2 px-5" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step} aria-label="Form progress">
        {[1, 2, 3, 4].map((value) => (
          <div key={value} className={`h-1.5 flex-1 rounded-full ${value <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <div className="px-5 py-7">
        {step === 1 ? (
          <>
            <StepHeading icon={<Tag />} title="Basic Information" text="Add the details that help you identify this item." />
            <div className="space-y-4">
              <FormField label="Item Name" required value={draft.name} onChange={set("name")} placeholder="e.g. Dell Latitude 5420" error={errors.name} />
              <SelectField label="Category" required value={draft.category} onChange={set("category")} options={CATEGORIES} error={errors.category} />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Brand" value={draft.brand} onChange={set("brand")} placeholder="Dell" />
                <FormField label="Model" value={draft.model} onChange={set("model")} placeholder="Latitude 5420" />
              </div>
              <FormField label="Serial Number" value={draft.serial} onChange={set("serial")} placeholder="Enter serial number" />
              <FormField label="Purchase Date" value={draft.purchaseDate} onChange={set("purchaseDate")} placeholder="DD / MM / YYYY" />
              <p className="text-xs text-muted-foreground">Fields marked with * are required.</p>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <StepHeading icon={<Camera />} title="Item Photo" text="A clear photo makes your item easy to recognize." />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Choose a photo from your device"
              onChange={(event) => onPickFile(event.target.files?.[0])}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              aria-label="Take a photo"
              onChange={(event) => onPickFile(event.target.files?.[0])}
            />
            {draft.photo ? (
              <div>
                <img src={draft.photo} alt="Selected item preview" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    <ImagePlus /> Change Photo
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => {
                      set("photo")(null);
                      toast("Photo removed.");
                    }}
                  >
                    <Trash2 /> Remove Photo
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid min-h-64 place-items-center rounded-2xl border-2 border-dashed border-input bg-surface-subtle p-8 text-center">
                  <div>
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
                      <ImagePlus />
                    </div>
                    <p className="mt-4 font-bold">Add an item photo</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Use a well-lit photo showing the whole item. Photos stay on your device.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => cameraRef.current?.click()}>
                    <Camera /> Take Photo
                  </Button>
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    <ImagePlus /> Choose Photo
                  </Button>
                </div>
              </>
            )}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <StepHeading icon={<FileText />} title="Additional Information" text="Keep purchase and warranty details together." />
            <div className="space-y-4">
              <FormField label="Purchase Price" value={draft.price} onChange={set("price")} placeholder="$ 0.00" />
              <FormField label="Seller" value={draft.seller} onChange={set("seller")} placeholder="Store or seller name" />
              <FormField label="Warranty Expiry" value={draft.warrantyExpiry} onChange={set("warrantyExpiry")} placeholder="DD / MM / YYYY" />
              <TextAreaField label="Private Notes" value={draft.notes} onChange={set("notes")} placeholder="Notes only you can see..." />
            </div>
            <div className="mt-5 flex gap-3 rounded-xl bg-surface-subtle p-4 text-xs leading-5 text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>These details stay private and are never shown on the public page.</p>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <StepHeading icon={<ShieldCheck />} title="QR Visibility" text="What should people see when they scan your QR?" />
            <div className="overflow-hidden rounded-2xl border border-border">
              {(
                [
                  ["itemName", "Item Name", false],
                  ["ownerName", "Owner Name", false],
                  ["contactNumber", "Contact Number", false],
                  ["serialNumber", "Serial Number", true],
                  ["warrantyStatus", "Warranty Status", true],
                ] as [keyof Visibility, string, boolean][]
              ).map(([key, label, optional], index) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center justify-between p-4 ${index ? "border-t border-border" : ""}`}
                >
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    {optional ? <span className="text-[11px] text-muted-foreground">Optional</span> : null}
                  </span>
                  <Checkbox
                    checked={draft.visibility[key]}
                    aria-label={`Show ${label} on the public page`}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({ ...prev, visibility: { ...prev.visibility, [key]: checked === true } }))
                    }
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex gap-3 rounded-xl bg-info-soft p-4 text-xs leading-5 text-secondary-foreground">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Private notes, price, receipts, and documents are never shown publicly.</p>
            </div>
          </>
        ) : null}
      </div>

      <div className="sticky bottom-0 mt-2 border-t border-border bg-card p-5">
        <Button className="w-full" size="lg" onClick={next}>
          {step < 4 ? "Continue" : isEdit ? "Save Changes" : "Create Item"}
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
