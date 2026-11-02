"use client";

import { useState } from "react";
import { addDays, format, startOfMonth, subMonths } from "date-fns";

import {
  DATE_PICKER_QUICK_PICKS,
  DatePicker,
  DatePickerDay,
  DatePickerMonthHeader,
  DatePickerPopover,
  DatePickerQuickPick,
  RangePicker,
  type DatePickerArrows,
  type DatePickerDayState,
  type DateRange,
} from "@/components/ds/date-picker";
import { TextInput } from "@/components/ds/text-input";
import { Group, Labelled } from "../parts";

const ARROWS: { id: DatePickerArrows; label: string }[] = [
  { id: "both", label: "Both arrows (the picker's)" },
  { id: "previous", label: "Previous only" },
  { id: "next", label: "Next only" },
  { id: "none", label: "No arrows" },
];

const DAY_STATES: { id: string; label: string; state: DatePickerDayState; force?: "hover" | "focus"; disabled?: boolean }[] = [
  { id: "default", label: "Default", state: "default" },
  { id: "hover", label: "Hover", state: "default", force: "hover" },
  { id: "focus", label: "Focus", state: "default", force: "focus" },
  { id: "selected", label: "Selected", state: "selected" },
  { id: "selected-focus", label: "Selected, focus", state: "selected", force: "focus" },
  { id: "disabled", label: "Disabled", state: "default", disabled: true },
];

const RANGE_STATES: { id: string; label: string; force?: "hover"; disabled?: boolean }[] = [
  { id: "in-range", label: "In range" },
  { id: "in-range-hover", label: "In range, hover", force: "hover" },
  { id: "in-range-disabled", label: "In range, disabled", disabled: true },
];

/** The Range Picker is wider than a narrow window: it scrolls sideways, with
 *  room around it so its shadow is not cut off. */
const SCROLL = "-mx-space-24 overflow-x-auto px-space-24 pb-space-40";

/** A field that opens the Date Picker under it (the page's proposal). */
function FieldExample() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  return (
    <DatePickerPopover
      open={open}
      onOpenChange={setOpen}
      anchor={
        <div className="w-date-picker-month">
          <TextInput
            type="date"
            label="Start date"
            placeholder="Pick a date"
            readOnly
            value={date ? format(date, "MMM d, yyyy") : ""}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") setOpen(true);
            }}
          />
        </div>
      }
    >
      <DatePicker
        defaultValue={date}
        onApply={(d) => {
          setDate(d);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </DatePickerPopover>
  );
}

export function DatePickerSection() {
  // Fixed months, so the page shows the same picture every time.
  const [single, setSingle] = useState<Date | undefined>(new Date(2026, 9, 14));
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2026, 9, 26), to: new Date(2026, 10, 6) });
  const [applied, setApplied] = useState<string>("");
  const [appliedRange, setAppliedRange] = useState<string>("");

  return (
    <div className="flex flex-col gap-space-40">
      <div className="text-paragraph-xs text-text-soft-400">
        The calendar is react-day-picker 8 with date-fns, drawn only with our tokens: its month header and day cells
        are ours. Today carries the Marked dot until it has its own look (the page&apos;s proposal).
      </div>

      <Group label="Date Picker: click a day, then Apply">
        <div className="flex flex-wrap items-start gap-space-24">
          <DatePicker
            value={single}
            onValueChange={setSingle}
            defaultMonth={new Date(2026, 9, 1)}
            marked={[new Date(2026, 9, 22)]}
            disabled={{ after: new Date(2026, 9, 28) }}
            onApply={(d) => setApplied(d ? `Applied ${format(d, "MMM d, yyyy")}` : "Applied nothing")}
            onCancel={() => setApplied("Cancelled")}
          />
          {applied && <span className="text-paragraph-xs text-text-soft-400">{applied}</span>}
        </div>
      </Group>

      <Group label="Range Picker: pick a first and a last day, or a quick pick">
        <div className={SCROLL}>
          <RangePicker
            value={range}
            onValueChange={setRange}
            defaultMonth={startOfMonth(new Date(2026, 9, 1))}
            marked={[new Date(2026, 10, 11)]}
            onApply={(r) =>
              setAppliedRange(
                r?.from ? `Applied ${format(r.from, "MMM d, yyyy")} to ${format(r.to ?? r.from, "MMM d, yyyy")}` : "Applied all time",
              )
            }
            onCancel={() => setAppliedRange("Cancelled")}
          />
        </div>
        {appliedRange && <span className="text-paragraph-xs text-text-soft-400">{appliedRange}</span>}
      </Group>

      <Group label="Opened from a field (the Text Input's Date type, the page's proposal)">
        <FieldExample />
      </Group>

      <Group label="Month header, every arrow setting">
        <div className="flex flex-wrap items-start gap-space-24">
          {ARROWS.map((a) => (
            <Labelled key={a.id} label={a.label}>
              <div className="w-date-picker-month p-date-picker-month-pad">
                <DatePickerMonthHeader arrows={a.id}>October 2026</DatePickerMonthHeader>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Day cells, every state, without and with the Marked dot">
        <div className="flex flex-col gap-space-16">
          {[false, true].map((marked) => (
            <div key={String(marked)} className="flex flex-wrap items-start gap-space-24">
              {DAY_STATES.map((s) => (
                <Labelled key={s.id} label={s.label}>
                  <DatePickerDay state={s.state} marked={marked} disabled={s.disabled} data-force={s.force}>
                    14
                  </DatePickerDay>
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Days in a range: the band behind them">
        <div className="flex flex-col gap-space-16">
          <div className="flex flex-wrap items-start gap-space-24">
            {RANGE_STATES.map((s) => (
              <Labelled key={s.id} label={s.label}>
                <div className="flex gap-date-picker-gap">
                  <DatePickerDay state="selected" band={{ from: true, to: false }}>
                    13
                  </DatePickerDay>
                  <DatePickerDay state="in-range" band={{ from: false, to: false }} data-force={s.force} disabled={s.disabled}>
                    14
                  </DatePickerDay>
                  <DatePickerDay state="selected" band={{ from: false, to: true }}>
                    15
                  </DatePickerDay>
                </div>
              </Labelled>
            ))}
          </div>
          <Labelled label="A range that starts mid-week and runs past Sunday (the page's proposal: corner 8 only at the band's ends)">
            <div className="flex flex-col gap-date-picker-gap">
              {[
                [5, 6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17, 18],
              ].map((week, row) => (
                <div key={row} className="flex gap-date-picker-gap">
                  {week.map((n, i) => {
                    const first = n === 8;
                    const last = n === 14;
                    const inside = n > 8 && n < 14;
                    const banded = first || last || inside;
                    return (
                      <DatePickerDay
                        key={n}
                        state={first || last ? "selected" : inside ? "in-range" : "default"}
                        band={banded ? { from: first || i === 0, to: last || i === 6 } : undefined}
                        disabled={n === 10}
                      >
                        {n}
                      </DatePickerDay>
                    );
                  })}
                </div>
              ))}
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="Quick picks (Period Range), every state">
        <div className="flex flex-wrap items-start gap-space-24">
          {[
            { id: "default", label: "Default" },
            { id: "hover", label: "Hover" },
            { id: "focus", label: "Focus" },
            { id: "active", label: "Active" },
          ].map((s) => (
            <Labelled key={s.id} label={s.label}>
              <div className="w-date-picker-picks px-date-picker-picks-x">
                <DatePickerQuickPick active={s.id === "active"} data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}>
                  {DATE_PICKER_QUICK_PICKS[1].label}
                </DatePickerQuickPick>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="A six-week month grows by one row (the page's proposal)">
        <DatePicker defaultMonth={new Date(2026, 7, 1)} footer={false} markToday={false} />
      </Group>

      <Group label="Days from the next month in a range keep the Disabled look, with the band behind them">
        <div className={SCROLL}>
          <RangePicker
            quickPicks={false}
            footer={false}
            markToday={false}
            defaultMonth={subMonths(new Date(2026, 10, 1), 1)}
            defaultValue={{ from: new Date(2026, 9, 28), to: addDays(new Date(2026, 10, 1), 3) }}
          />
        </div>
      </Group>
    </div>
  );
}
