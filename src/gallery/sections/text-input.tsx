"use client";

import { InlineSelect, SelectInputPicker, SelectItem } from "@/components/ds/select";
import { TextInput, type TextInputProps } from "@/components/ds/text-input";
import { CopyIcon, EyeIcon, InfoIcon, LockIcon, MailIcon, SettingsIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const SIZES = [
  { id: "md", label: "Medium 40" },
  { id: "sm", label: "Small 36" },
  { id: "xs", label: "X-Small 32" },
] as const;

const STATES: { id: string; label: string; props: Partial<TextInputProps> }[] = [
  { id: "placeholder", label: "Placeholder", props: {} },
  { id: "hover", label: "Hover", props: { "data-force": "hover" } },
  { id: "focus", label: "Focus", props: { "data-force": "focus", defaultValue: "Maya Patel" } },
  { id: "filled", label: "Filled", props: { defaultValue: "Maya Patel" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
  { id: "error", label: "Error", props: { error: true, defaultValue: "Maya" } },
  { id: "error-focus", label: "Error focused (ours)", props: { error: true, "data-force": "focus", defaultValue: "Maya" } },
];

// The card brand's logo is a picture, passed in; a grey box stands in here.
const LOGO = <span className="size-full bg-bg-soft-200" />;

type Size = (typeof SIZES)[number]["id"];

// Phone and Amount take the Compact Select for Input, Dropdown the Inline
// Select (select.md). Flags are emoji until flag artwork is added.
const flag = (f: string) => <span className="text-paragraph-sm">{f}</span>;
const COUNTRIES = [
  { value: "us", label: "United States", flag: "🇺🇸", phone: "+1", currency: "USD" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧", phone: "+44", currency: "GBP" },
  { value: "de", label: "Germany", flag: "🇩🇪", phone: "+49", currency: "EUR" },
  { value: "in", label: "India", flag: "🇮🇳", phone: "+91", currency: "INR" },
];
const countryItems = (code: "phone" | "currency") =>
  COUNTRIES.map((c) => (
    <SelectItem key={c.value} value={c.value} picture={flag(c.flag)} code={c[code]}>
      {c.label}
    </SelectItem>
  ));

/** The picker a type takes, at the field's size and with its disabled. */
type Picker = (size: Size, disabled?: boolean) => React.ReactNode;
const phonePicker: Picker = (size, disabled) => (
  <SelectInputPicker size={size} aria-label="Country code" defaultValue="us" disabled={disabled}>
    {countryItems("phone")}
  </SelectInputPicker>
);
const currencyPicker: Picker = (size, disabled) => (
  <SelectInputPicker size={size} aria-label="Currency" defaultValue="us" disabled={disabled}>
    {countryItems("currency")}
  </SelectInputPicker>
);
const rolePicker: Picker = (_size, disabled) => (
  <InlineSelect icon={<EyeIcon />} aria-label="Role" defaultValue="viewer" disabled={disabled}>
    <SelectItem value="viewer" picture={<EyeIcon />}>
      Viewer
    </SelectItem>
    <SelectItem value="editor" picture={<SettingsIcon />}>
      Editor
    </SelectItem>
    <SelectItem value="owner" picture={<LockIcon />} disabled>
      Owner
    </SelectItem>
  </InlineSelect>
);

const TYPES: { label: string; props: Partial<TextInputProps>; picker?: Picker }[] = [
  { label: "Basic", props: { leftIcon: <UserIcon />, placeholder: "Enter your name" } },
  { label: "Basic, right icon", props: { leftIcon: <UserIcon />, rightIcon: <InfoIcon />, placeholder: "Enter your name" } },
  { label: "Email", props: { type: "email", placeholder: "name@company.com" } },
  { label: "Phone", props: { type: "phone", placeholder: "(555) 000-0000" }, picker: phonePicker },
  { label: "Card (the logo is a slot)", props: { type: "card", placeholder: "0000 0000 0000 0000", cardLogo: LOGO } },
  { label: "Website", props: { type: "website", placeholder: "www.example.com" } },
  { label: "Amount", props: { type: "amount", currency: "$", placeholder: "0.00" }, picker: currencyPicker },
  { label: "Date", props: { type: "date", placeholder: "Pick a date" } },
  { label: "Search", props: { type: "search", placeholder: "Search", shortcut: "⌘K" } },
  { label: "Password", props: { type: "password", placeholder: "Enter your password", defaultValue: "Neutrino26" } },
  { label: "Button", props: { type: "button", defaultValue: "neutrino.ai/invite/8bit", action: { icon: <CopyIcon />, label: "Copy link" } } },
  { label: "Dropdown", props: { type: "dropdown", leftIcon: <MailIcon />, placeholder: "Add a teammate" }, picker: rolePicker },
  { label: "Emoji", props: { type: "emoji", placeholder: "Set a status" } },
];

const DIVIDED = TYPES.filter((t) => ["phone", "website", "amount", "button"].includes(t.props.type ?? ""));

export function TextInputSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Medium 40, every state, with label and hint">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <TextInput
                className="w-75"
                label="Full name"
                required
                hint={s.props.error ? "Enter your full name." : "Shown on your profile."}
                leftIcon={<UserIcon />}
                placeholder="Enter your name"
                {...s.props}
              />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Sizes, every state">
        <div className="grid grid-cols-[repeat(3,max-content)] gap-x-space-32 gap-y-space-16">
          {STATES.map((s) =>
            SIZES.map((size) => (
              <Labelled key={`${s.id}-${size.id}`} label={`${size.label}, ${s.label}`}>
                <TextInput
                  className="w-75"
                  size={size.id}
                  leftIcon={<UserIcon />}
                  rightIcon={<InfoIcon />}
                  placeholder="Enter your name"
                  aria-label={`Full name, ${size.label}, ${s.label}`}
                  {...s.props}
                />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Label, hint and icons">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Optional, info icon">
            <TextInput className="w-75" label="Company" optional info placeholder="8bit" />
          </Labelled>
          <Labelled label="Hint without an icon">
            <TextInput className="w-75" label="Company" hint="Shown on invoices." hintIcon={null} placeholder="8bit" />
          </Labelled>
          <Labelled label="No label, no hint, no icons">
            <TextInput className="w-75" placeholder="Enter your name" aria-label="Full name" />
          </Labelled>
          <Labelled label="Right icon only">
            <TextInput className="w-75" rightIcon={<InfoIcon />} placeholder="Enter your name" aria-label="Full name" />
          </Labelled>
        </div>
      </Group>

      <Group label="Types, Medium 40">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          {TYPES.map((t) => (
            <Labelled key={t.label} label={t.label}>
              <TextInput className="w-75" aria-label={t.label} picker={t.picker?.("md")} {...t.props} />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Divided types, Small 36 and X-Small 32">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
          {SIZES.slice(1).map((size) =>
            DIVIDED.map((t) => (
              <Labelled key={`${size.id}-${t.label}`} label={`${t.label}, ${size.label}`}>
                <TextInput className="w-75" size={size.id} aria-label={t.label} picker={t.picker?.(size.id)} {...t.props} />
              </Labelled>
            )),
          )}
        </div>
      </Group>
    </div>
  );
}
