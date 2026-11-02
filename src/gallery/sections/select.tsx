"use client";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import { DropdownPanel, DropdownRow } from "@/components/ds/dropdown";
import { LinkButton } from "@/components/ds/link-button";
import {
  CompactSelect,
  InlineSelect,
  Select,
  SelectGroup,
  SelectHeading,
  SelectInputPicker,
  SelectItem,
  SelectSeparator,
  type CompactSelectType,
  type SelectProps,
  type SelectType,
} from "@/components/ds/select";
import { TextInput } from "@/components/ds/text-input";
import { CheckIcon, EyeIcon, GridIcon, ListIcon, LockIcon, MailIcon, SettingsIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

// Flags are emoji until flag artwork is added; a grey card stands in for a card brand's logo.
const flag = (f: string) => <span className="text-paragraph-sm">{f}</span>;
const card = <span className="size-full rounded-corner-4 bg-bg-soft-200" />;

const COUNTRIES = [
  { value: "us", label: "United States", flag: "🇺🇸", phone: "+1", currency: "USD" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧", phone: "+44", currency: "GBP" },
  { value: "de", label: "Germany", flag: "🇩🇪", phone: "+49", currency: "EUR" },
  { value: "in", label: "India", flag: "🇮🇳", phone: "+91", currency: "INR" },
];

const countryItems = (code?: "phone" | "currency") =>
  COUNTRIES.map((c) => (
    <SelectItem key={c.value} value={c.value} picture={flag(c.flag)} code={code ? c[code] : undefined}>
      {c.label}
    </SelectItem>
  ));

const ROLES = (
  <>
    <SelectItem value="viewer" picture={<EyeIcon />}>
      Viewer
    </SelectItem>
    <SelectItem value="editor" picture={<SettingsIcon />}>
      Editor
    </SelectItem>
    <SelectItem value="owner" picture={<LockIcon />} disabled>
      Owner
    </SelectItem>
  </>
);

/** Each type's rows and the value a filled field shows. */
const TYPES: { type: SelectType; label: string; placeholder: string; value: string; items: React.ReactNode }[] = [
  { type: "basic", label: "Basic", placeholder: "Select a role", value: "editor", items: ROLES },
  { type: "country", label: "Country", placeholder: "Select a country", value: "gb", items: countryItems() },
  {
    type: "avatar",
    label: "Avatar",
    placeholder: "Select a person",
    value: "maya",
    items: (
      <>
        <SelectItem value="maya" picture={<Avatar size="20" name="Maya Patel" />}>
          Maya Patel
        </SelectItem>
        <SelectItem value="lena" picture={<Avatar size="20" name="Lena Fischer" />}>
          Lena Fischer
        </SelectItem>
      </>
    ),
  },
  {
    type: "provider",
    label: "Provider",
    placeholder: "Select a card",
    value: "visa",
    items: (
      <>
        <SelectItem value="visa" picture={card}>
          Visa ending 4242
        </SelectItem>
        <SelectItem value="mastercard" picture={card}>
          Mastercard ending 0005
        </SelectItem>
      </>
    ),
  },
  {
    type: "brand",
    label: "Brand",
    placeholder: "Select an app",
    value: "slack",
    items: (
      <>
        <SelectItem value="slack" picture={<img src="/brand/slack.svg" alt="" />}>
          Slack
        </SelectItem>
        <SelectItem value="notion" picture={<img src="/brand/notion.svg" alt="" />}>
          Notion
        </SelectItem>
      </>
    ),
  },
  {
    type: "company",
    label: "Company",
    placeholder: "Select a company",
    value: "microsoft",
    items: (
      <SelectItem value="microsoft" picture={<img src="/brand/microsoft.svg" alt="" />}>
        Microsoft
      </SelectItem>
    ),
  },
];

const STATES: { id: string; label: string; props: Partial<SelectProps> }[] = [
  { id: "default", label: "Default", props: {} },
  { id: "hover", label: "Hover", props: { "data-force": "hover" } },
  { id: "focus", label: "Focus (open)", props: { "data-force": "focus" } },
  { id: "filled", label: "Filled", props: { defaultValue: "editor" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
  { id: "error", label: "Error", props: { error: true, defaultValue: "editor", hint: "Pick a role to continue." } },
  { id: "error-focus", label: "Error focused (ours)", props: { error: true, defaultValue: "editor", "data-force": "focus", hint: "Pick a role to continue." } },
];

const SIZES = [
  { id: "md", label: "Medium 40" },
  { id: "sm", label: "Small 36" },
  { id: "xs", label: "X-Small 32" },
] as const;

const COMPACT_TYPES: { type: CompactSelectType; label: string; placeholder?: React.ReactNode; value: string; items: React.ReactNode }[] = [
  {
    type: "icon",
    label: "Icon",
    placeholder: <GridIcon />,
    value: "list",
    items: (
      <>
        <SelectItem value="grid" picture={<GridIcon />}>
          Grid
        </SelectItem>
        <SelectItem value="list" picture={<ListIcon />}>
          List
        </SelectItem>
      </>
    ),
  },
  { type: "country", label: "Country", value: "de", items: countryItems() },
  {
    type: "basic",
    label: "Basic",
    placeholder: "12",
    value: "48",
    items: ["12", "24", "48"].map((n) => (
      <SelectItem key={n} value={n}>
        {n}
      </SelectItem>
    )),
  },
];

const COMPACT_STATES: { id: string; label: string; props: { "data-force"?: "hover" | "focus"; disabled?: boolean; error?: boolean; filled?: boolean } }[] = [
  { id: "placeholder", label: "Placeholder", props: {} },
  { id: "hover", label: "Hover", props: { "data-force": "hover" } },
  { id: "focus", label: "Focused (open)", props: { "data-force": "focus", filled: true } },
  { id: "filled", label: "Filled", props: { filled: true } },
  { id: "disabled", label: "Disabled", props: { disabled: true, filled: true } },
  { id: "error", label: "Error", props: { error: true, filled: true } },
  { id: "error-focus", label: "Error focused (ours)", props: { error: true, filled: true, "data-force": "focus" } },
];

const PICKER_STATES = [
  { id: "default", label: "Default", props: {} },
  { id: "hover", label: "Hover", props: { "data-force": "hover" as const } },
  { id: "active", label: "Active (open)", props: { "data-force": "active" as const } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
  { id: "focus", label: "Keyboard focus (ours)", props: { "data-force": "focus" as const } },
];

export function SelectSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: pick from each list">
        <div className="flex flex-wrap items-start gap-space-24">
          <div className="w-75">
            <Select label="Role" required icon={<UserIcon />} placeholder="Select a role" hint="What they can do in this workspace.">
              {ROLES}
            </Select>
          </div>
          <div className="w-75">
            <Select label="Country" type="country" placeholder="Select a country" defaultValue="us">
              <SelectGroup>
                <SelectHeading>Popular</SelectHeading>
                {countryItems().slice(0, 2)}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectHeading>Europe and Asia</SelectHeading>
                {countryItems().slice(2)}
              </SelectGroup>
            </Select>
          </div>
          <div className="w-75">
            <Select label="Assignee" type="avatar" placeholder="Select a person">
              {TYPES[2].items}
            </Select>
          </div>
        </div>
      </Group>

      <Group label="Medium 40, Basic, every state (label and hint on)">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <div className="w-75">
                <Select label="Role" icon={<UserIcon />} placeholder="Select a role" hint="What they can do in this workspace." {...s.props}>
                  {ROLES}
                </Select>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Sizes: empty, filled, and Provider (the same padding on every side)">
        <div className="grid grid-cols-[repeat(3,max-content)] gap-x-space-32 gap-y-space-16">
          {SIZES.map((size) => (
            <Labelled key={size.id} label={size.label}>
              <div className="flex w-75 flex-col gap-space-12">
                <Select size={size.id} icon={<UserIcon />} placeholder="Select a role" aria-label="Role">
                  {ROLES}
                </Select>
                <Select size={size.id} icon={<UserIcon />} defaultValue="editor" aria-label="Role">
                  {ROLES}
                </Select>
                <Select size={size.id} type="provider" defaultValue="visa" aria-label="Card">
                  {TYPES[3].items}
                </Select>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Types: the stand-in before a pick, filled, and disabled (pictures at 48%)">
        <div className="grid grid-cols-[repeat(3,max-content)] gap-x-space-32 gap-y-space-16">
          {TYPES.map((t) =>
            [
              { id: "empty", label: `${t.label}, before a pick`, props: {} },
              { id: "filled", label: `${t.label}, filled`, props: { defaultValue: t.value } },
              { id: "disabled", label: `${t.label}, disabled`, props: { defaultValue: t.value, disabled: true } },
            ].map((s) => (
              <Labelled key={`${t.type}-${s.id}`} label={s.label}>
                <div className="w-75">
                  <Select type={t.type} icon={<UserIcon />} placeholder={t.placeholder} aria-label={t.label} {...s.props}>
                    {t.items}
                  </Select>
                </div>
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Label, hint and badge on or off">
        <div className="flex flex-wrap items-start gap-space-32">
          <Labelled label="Label with optional, info and a link">
            <div className="w-75">
              <Select
                label="Role"
                optional
                info
                labelLink={
                  <LinkButton variant="primary" size="sm" underline>
                    What is this?
                  </LinkButton>
                }
                icon={<UserIcon />}
                placeholder="Select a role"
              >
                {ROLES}
              </Select>
            </div>
          </Labelled>
          <Labelled label="Hint off, label off">
            <div className="w-75">
              <Select icon={<UserIcon />} placeholder="Select a role" aria-label="Role">
                {ROLES}
              </Select>
            </div>
          </Labelled>
          <Labelled label="Badge">
            <div className="w-75">
              <Select icon={<UserIcon />} defaultValue="editor" aria-label="Role" badge={<Badge variant="lighter" color="blue">New</Badge>}>
                {ROLES}
              </Select>
            </div>
          </Labelled>
          <Labelled label="Picture off">
            <div className="w-75">
              <Select type="country" showPicture={false} defaultValue="in" aria-label="Country">
                {countryItems()}
              </Select>
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="The open list, still: 10 below the field, as wide, the Dropdown's Small rows, a check on the pick">
        <div className="flex w-75 flex-col gap-space-10">
          <Select type="country" defaultValue="gb" data-force="focus" aria-label="Country">
            {countryItems()}
          </Select>
          <DropdownPanel>
            {COUNTRIES.map((c) => (
              <DropdownRow
                key={c.value}
                type="country"
                picture={flag(c.flag)}
                label={c.label}
                data-force={c.value === "de" ? "hover" : undefined}
                rightIcon={c.value === "gb" ? <CheckIcon /> : undefined}
              />
            ))}
          </DropdownPanel>
        </div>
      </Group>

      <Group label="Compact Select, Medium 40, every type and state">
        <div className="grid grid-cols-[repeat(7,max-content)] gap-x-space-24 gap-y-space-16">
          {COMPACT_TYPES.map((t) =>
            COMPACT_STATES.map((s) => (
              <Labelled key={`${t.type}-${s.id}`} label={`${t.label}, ${s.label}`}>
                <CompactSelect
                  type={t.type}
                  aria-label={t.label}
                  placeholder={t.placeholder}
                  defaultValue={s.props.filled ? t.value : undefined}
                  disabled={s.props.disabled}
                  error={s.props.error}
                  data-force={s.props["data-force"]}
                >
                  {t.items}
                </CompactSelect>
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Compact Select sizes (the Pagination's per-page picker is Basic, X-Small)">
        <div className="flex flex-wrap items-end gap-space-32">
          {SIZES.map((size) => (
            <Labelled key={size.id} label={size.label}>
              <div className="flex items-center gap-space-12">
                {COMPACT_TYPES.map((t) => (
                  <CompactSelect key={t.type} type={t.type} size={size.id} aria-label={t.label} defaultValue={t.value}>
                    {t.items}
                  </CompactSelect>
                ))}
                <CompactSelect type="basic" size={size.id} aria-label="Per page" defaultValue="7">
                  {["7", "10", "20"].map((n) => (
                    <SelectItem key={n} value={n} code={`${n} / page`}>
                      {`${n} per page`}
                    </SelectItem>
                  ))}
                </CompactSelect>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Compact Select for Input, every state (on its own; the field gives its fill, edge and corner)">
        <div className="flex flex-wrap items-end gap-space-32">
          {PICKER_STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <SelectInputPicker aria-label="Currency" defaultValue="us" {...s.props}>
                {countryItems("currency")}
              </SelectInputPicker>
            </Labelled>
          ))}
          <Labelled label="Flag off">
            <SelectInputPicker aria-label="Currency" defaultValue="us" flag={false}>
              {countryItems("currency")}
            </SelectInputPicker>
          </Labelled>
        </div>
      </Group>

      <Group label="Compact Select for Input in the Text Input: Phone and Amount, every size">
        <div className="grid grid-cols-[repeat(3,max-content)] gap-x-space-32 gap-y-space-16">
          {SIZES.map((size) => (
            <Labelled key={size.id} label={size.label}>
              <div className="flex w-75 flex-col gap-space-12">
                <TextInput
                  size={size.id}
                  type="phone"
                  aria-label="Phone"
                  placeholder="(555) 000-0000"
                  picker={
                    <SelectInputPicker size={size.id} aria-label="Country code" defaultValue="us">
                      {countryItems("phone")}
                    </SelectInputPicker>
                  }
                />
                <TextInput
                  size={size.id}
                  type="amount"
                  aria-label="Amount"
                  currency="$"
                  placeholder="0.00"
                  picker={
                    <SelectInputPicker size={size.id} aria-label="Currency" defaultValue="us">
                      {countryItems("currency")}
                    </SelectInputPicker>
                  }
                />
              </div>
            </Labelled>
          ))}
          <Labelled label="Disabled (pass disabled to the picker too)">
            <div className="w-75">
              <TextInput
                type="phone"
                aria-label="Phone"
                placeholder="(555) 000-0000"
                disabled
                picker={
                  <SelectInputPicker aria-label="Country code" defaultValue="us" disabled>
                    {countryItems("phone")}
                  </SelectInputPicker>
                }
              />
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="Inline Select, Icon and Country, every state">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-space-32 gap-y-space-16">
          {(["icon", "country"] as const).map((type) =>
            PICKER_STATES.map((s) => (
              <Labelled key={`${type}-${s.id}`} label={`${type === "icon" ? "Icon" : "Country"}, ${s.label}`}>
                {type === "icon" ? (
                  <InlineSelect icon={<EyeIcon />} aria-label="Role" defaultValue="viewer" {...s.props}>
                    {ROLES}
                  </InlineSelect>
                ) : (
                  <InlineSelect type="country" aria-label="Currency" defaultValue="us" {...s.props}>
                    {countryItems("currency")}
                  </InlineSelect>
                )}
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Inline Select, row: a value in a settings row (the step drawer)">
        <div className="flex w-75 flex-col">
          <div className="flex h-space-32 items-center justify-between gap-space-12">
            <span className="text-paragraph-compact text-text-sub-600">Role</span>
            <InlineSelect row aria-label="Role" defaultValue="viewer">
              {ROLES}
            </InlineSelect>
          </div>
          <div className="flex h-space-32 items-center justify-between gap-space-12">
            <span className="text-paragraph-compact text-text-sub-600">Reviewer role</span>
            <InlineSelect row aria-label="Reviewer role" placeholder="Choose">
              {ROLES}
            </InlineSelect>
          </div>
        </div>
      </Group>

      <Group label="Inline Select in the Text Input's Dropdown type">
        <div className="w-75">
          <TextInput
            type="dropdown"
            leftIcon={<MailIcon />}
            placeholder="Add a teammate"
            aria-label="Teammate's email"
            picker={
              <InlineSelect icon={<EyeIcon />} aria-label="Role" defaultValue="viewer">
                {ROLES}
              </InlineSelect>
            }
          />
        </div>
      </Group>
    </div>
  );
}
