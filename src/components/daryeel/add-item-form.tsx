import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  Eye,
  FileText,
  ImagePlus,
  LockKeyhole,
  ShieldCheck,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDaryeel } from "@/lib/daryeel-store";
import {
  CATEGORIES,
  DEFAULT_VISIBILITY,
  type Category,
  type Item,
  type Visibility,
} from "@/lib/daryeel-types";
import {
  DateField,
  FormField,
  Notice,
  SelectField,
  StepHeading,
  StepIndicator,
  TextAreaField,
  TopBack,
} from "./ui-kit";

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

const STEPS = ["Details", "Photo", "Purchase", "Privacy"];

const VISIBILITY_OPTIONS: [keyof Visibility, string, string][] = [
  ["itemName", "Item name", "Helps the finder identify what they found."],
  ["ownerName", "Owner name", "Your full name as shown on your profile."],
  ["contactNumber", "Contact number", "Needed for the Contact Owner button to work."],
  ["serialNumber", "Serial number", "Optional. Useful as proof of ownership."],
  ["warrantyStatus", "Warranty status", "Optional. Shows whether the warranty is valid."],
];

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

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 type-overline text-muted-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

export function AddItemForm({ editing }: { editing?: Item | undefined }) {
  const { go, addItem, updateItem, pushNotification } = useDaryeel();
  const isEdit = Boolean(editing);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(editing ? draftFromItem(editing) : emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const set =
    <K extends keyof Draft>(key: K) =>
    (value: Draft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

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
      // Editing must keep the item's lost/active status and its icon.
      icon: editing?.icon ?? ("box" as Item["icon"]),
      status: editing?.status ?? ("active" as Item["status"]),
      visibility: draft.visibility,
    };

    if (editing) {
      updateItem(editing.id, payload);
      toast.success("Item updated.");
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
    toast.success("Item created.");
    go("qr", { itemId: created.id });
  };

  const next = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step < STEPS.length) {
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

  const shared = VISIBILITY_OPTIONS.filter(([key]) => draft.visibility[key]).map(
    ([, label]) => label,
  );

  return (
    <div className="flex min-h-screen flex-col bg-card lg:min-h-[820px]">
      <TopBack
        title={isEdit ? "Edit item" : "Add new item"}
        subtitle={`Step ${step} of ${STEPS.length} · ${STEPS[step - 1]}`}
        onBack={back}
      />

      <div className="px-gutter pt-5">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      <form
        className="flex flex-1 flex-col"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          next();
        }}
      >
        <div className="flex-1 px-gutter py-6">
          {step === 1 ? (
            <>
              <StepHeading
                icon={<Tag />}
                title="Basic information"
                text="Details that help you identify this item."
              />
              <div className="space-y-7">
                <FieldGroup title="Item">
                  <FormField
                    label="Item name"
                    required
                    value={draft.name}
                    onChange={set("name")}
                    placeholder="e.g. Dell Latitude 5420"
                    error={errors.name}
                  />
                  <SelectField
                    label="Category"
                    required
                    value={draft.category}
                    onChange={set("category")}
                    options={CATEGORIES}
                    error={errors.category}
                  />
                </FieldGroup>
                <FieldGroup title="Product">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="Brand"
                      value={draft.brand}
                      onChange={set("brand")}
                      placeholder="Dell"
                    />
                    <FormField
                      label="Model"
                      value={draft.model}
                      onChange={set("model")}
                      placeholder="Latitude 5420"
                    />
                  </div>
                  <FormField
                    label="Serial number"
                    value={draft.serial}
                    onChange={set("serial")}
                    placeholder="Found on the label or in settings"
                  />
                  <DateField
                    label="Purchase date"
                    value={draft.purchaseDate}
                    onChange={set("purchaseDate")}
                  />
                </FieldGroup>
                <p className="type-caption text-muted-foreground">
                  Fields marked <span className="text-destructive">*</span> are required.
                </p>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <StepHeading
                icon={<Camera />}
                title="Item photo"
                text="A clear photo makes your item easy to recognize."
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-label="Choose a photo from your device"
                onChange={(event) => onPickFile(event.target.files?.[0])}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                tabIndex={-1}
                aria-label="Take a photo"
                onChange={(event) => onPickFile(event.target.files?.[0])}
              />
              {draft.photo ? (
                <div>
                  <img
                    src={draft.photo}
                    alt="Selected item preview"
                    className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
                  />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <ImagePlus /> Change photo
                    </Button>
                    <Button
                      type="button"
                      variant="destructive-outline"
                      onClick={() => {
                        set("photo")(null);
                        toast("Photo removed.");
                      }}
                    >
                      <Trash2 /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="grid min-h-56 w-full cursor-pointer place-items-center rounded-xl border-2 border-dashed border-input bg-surface-subtle p-8 text-center transition-colors hover:border-primary/40 hover:bg-info-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-card text-primary shadow-soft">
                        <ImagePlus className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="mt-3 block text-sm font-semibold">Add an item photo</span>
                      <span className="mt-1 block type-caption text-muted-foreground">
                        Use a well-lit photo that shows the whole item.
                      </span>
                    </span>
                  </button>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => cameraRef.current?.click()}
                    >
                      <Camera /> Take photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <ImagePlus /> Choose photo
                    </Button>
                  </div>
                </>
              )}
              <p className="mt-4 type-caption text-muted-foreground">
                Optional. Photo uploads aren't connected yet, so the photo is kept only until you
                refresh this page.
              </p>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <StepHeading
                icon={<FileText />}
                title="Purchase & warranty"
                text="Keep purchase and warranty details together."
              />
              <div className="space-y-7">
                <FieldGroup title="Purchase">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="Purchase price"
                      value={draft.price}
                      onChange={set("price")}
                      placeholder="$0.00"
                      inputMode="decimal"
                    />
                    <FormField
                      label="Seller"
                      value={draft.seller}
                      onChange={set("seller")}
                      placeholder="Store name"
                    />
                  </div>
                </FieldGroup>
                <FieldGroup title="Warranty">
                  <DateField
                    label="Warranty expiry"
                    value={draft.warrantyExpiry}
                    onChange={set("warrantyExpiry")}
                    hint="Leave empty if the item has no warranty."
                  />
                </FieldGroup>
                <FieldGroup title="Notes">
                  <TextAreaField
                    label="Private notes"
                    value={draft.notes}
                    onChange={set("notes")}
                    placeholder="e.g. where the receipt or spare key is kept"
                  />
                </FieldGroup>
              </div>
              <div className="mt-6">
                <Notice tone="neutral" icon={<LockKeyhole />}>
                  Price, seller and notes are private. They are never shown on the public page.
                </Notice>
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <StepHeading
                icon={<ShieldCheck />}
                title="QR visibility"
                text="Choose what people see when they scan this item's QR code."
              />
              <fieldset>
                <legend className="sr-only">Information shown on the public page</legend>
                <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {VISIBILITY_OPTIONS.map(([key, label, description]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-surface-subtle"
                    >
                      <Checkbox
                        className="mt-0.5"
                        checked={draft.visibility[key]}
                        onCheckedChange={(checked) =>
                          setDraft((prev) => ({
                            ...prev,
                            visibility: { ...prev.visibility, [key]: checked === true },
                          }))
                        }
                      />
                      <span>
                        <span className="block text-sm font-medium">{label}</span>
                        <span className="block type-caption text-muted-foreground">
                          {description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-5 space-y-3">
                <Notice tone="info" icon={<Eye />} title="Public page preview">
                  {shared.length > 0
                    ? shared.join(", ")
                    : "Nothing selected — the page will only show the item photo."}
                </Notice>
                <Notice tone="neutral" icon={<LockKeyhole />}>
                  Private notes, price, seller and documents are never shown publicly.
                </Notice>
              </div>
            </>
          ) : null}
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card/95 px-gutter py-4 backdrop-blur safe-bottom">
          {step > 1 ? (
            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={back}>
              <ArrowLeft /> Back
            </Button>
          ) : null}
          <Button type="submit" size="lg" className="flex-[2]">
            {step < STEPS.length ? "Continue" : isEdit ? "Save changes" : "Create item"}
            {step < STEPS.length ? <ChevronRight /> : null}
          </Button>
        </div>
      </form>
    </div>
  );
}
