"use client";

import { useState } from "react";
import { format } from "date-fns";

import { CheckboxLabel } from "@/components/ds/checkbox";
import { RangePicker, type DateRange } from "@/components/ds/date-picker";
import { ContentDivider } from "@/components/ds/content-divider";
import {
  FilterChoice,
  FilterChoices,
  FilterFooter,
  FilterHeader,
  FilterItem,
  FilterPanel,
  FilterSearchRow,
  HorizontalFilter,
  type FilterGroup,
} from "@/components/ds/filter";
import { LinkButton } from "@/components/ds/link-button";
import { RadioGroup, RadioLabel } from "@/components/ds/radio";
import { TextInput } from "@/components/ds/text-input";
import { ArrowUpIcon, CheckCircleIcon, GridIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VIEWS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expenses", label: "Expenses" },
];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount", label: "Amount" },
];

const clear = (
  <LinkButton variant="gray" size="md">
    Clear
  </LinkButton>
);

/** The panel's groups, as in the page's blocks. */
const GROUPS: FilterGroup[] = [
  {
    value: "direction",
    label: "Direction",
    icon: <ArrowUpIcon />,
    headerAction: clear,
    content: (
      <>
        <ContentDivider type="solid-text">Direction</ContentDivider>
        <RadioGroup defaultValue="incoming">
          <FilterChoices>
            <FilterChoice note="(Recipient)">
              <RadioLabel value="incoming" label="Incoming" />
            </FilterChoice>
            <FilterChoice note="(Sender)">
              <RadioLabel value="outgoing" label="Outgoing" />
            </FilterChoice>
            <FilterChoice>
              <RadioLabel value="both" label="Both" />
            </FilterChoice>
          </FilterChoices>
        </RadioGroup>
      </>
    ),
  },
  {
    value: "status",
    label: "Status",
    icon: <CheckCircleIcon />,
    headerAction: (
      <LinkButton variant="gray" size="md">
        Select All
      </LinkButton>
    ),
    search: { placeholder: "Search...", shortcut: "⌘F" },
    content: (
      <FilterChoices>
        <CheckboxLabel label="Completed" defaultChecked />
        <CheckboxLabel label="Pending" defaultChecked />
        <CheckboxLabel label="Failed" />
        <CheckboxLabel label="Refunded" />
      </FilterChoices>
    ),
  },
  {
    value: "amount",
    label: "Amount",
    icon: <GridIcon />,
    headerAction: clear,
    content: (
      <FilterChoices kind="fields">
        <TextInput size="sm" label="Minimum" placeholder="0.00" type="amount" currency="$" />
        <TextInput size="sm" label="Maximum" placeholder="0.00" type="amount" currency="$" />
      </FilterChoices>
    ),
  },
  { value: "members", label: "Members (ours: disabled)", icon: <UserIcon />, disabled: true, content: null },
];

function TableBar() {
  const [open, setOpen] = useState(false);
  return (
    <HorizontalFilter
      type="table"
      views={VIEWS}
      sortOptions={SORTS}
      filterOpen={open}
      onFilterOpenChange={setOpen}
      filterPanel={<FilterPanel groups={GROUPS} onApply={() => setOpen(false)} onClear={() => setOpen(false)} />}
    />
  );
}

/** The Calendar bar, try it: the date button opens the Range Picker under the
 *  bar, and Apply writes the range into the button. */
function CalendarBar() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2026, 0, 6), to: new Date(2026, 0, 12) });
  const words = range?.from ? `${format(range.from, "d MMM")} to ${format(range.to ?? range.from, "d MMM")}` : "Pick dates";
  return (
    <div className="flex flex-col gap-space-8">
      <HorizontalFilter type="calendar" datesLabel={words} onDates={() => setOpen((o) => !o)} />
      {open && (
        <div className="overflow-x-auto pb-space-16">
          <RangePicker
            defaultValue={range}
            defaultMonth={range?.from}
            onApply={(r) => {
              setRange(r);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export function FilterSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Horizontal Filter, Table (the Filter button opens the panel)">
        <TableBar />
      </Group>

      <Group label="Horizontal Filter, Calendar (the date button opens the Range Picker)">
        <CalendarBar />
      </Group>

      <Group label="Parts off: no Filter, no icon button, no Sort by">
        <HorizontalFilter type="table" views={VIEWS} filter={false} iconButton={false} sortBy={false} />
      </Group>

      <Group label="The filter panel: groups on the left, the header, search row, choices and footer on the right">
        <FilterPanel groups={GROUPS} defaultValue="status" />
      </Group>

      <Group label="Rows on the left, every state">
        <div className="flex flex-wrap items-start gap-space-24">
          {[
            { id: "default", label: "Default", props: {} },
            { id: "hover", label: "Hover", props: { "data-force": "hover" as const } },
            { id: "active", label: "Active", props: { active: true } },
            { id: "focus", label: "Keyboard focus (ours)", props: { "data-force": "focus" as const } },
            { id: "disabled", label: "Disabled (ours)", props: { disabled: true } },
          ].map((s) => (
            <Labelled key={s.id} label={s.label}>
              <div className="flex w-50 flex-col gap-space-8">
                <FilterItem icon={<CheckCircleIcon />} {...s.props}>
                  Status
                </FilterItem>
                <FilterItem {...s.props}>No icon</FilterItem>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Header, search row and footer on their own (472 wide)">
        <div className="ds-shadow [--ds-lift:var(--shadow-filter-panel)] flex w-118 flex-col overflow-hidden rounded-corner-20 bg-bg-white-0">
          <FilterHeader icon={<CheckCircleIcon />} title="Status" action={clear} />
          <FilterSearchRow shortcut="⌘F" aria-label="Search statuses" />
          <FilterChoices>
            <FilterChoice note="(Recipient)">
              <CheckboxLabel label="Incoming" defaultChecked />
            </FilterChoice>
          </FilterChoices>
          <FilterFooter />
        </div>
      </Group>
    </div>
  );
}
