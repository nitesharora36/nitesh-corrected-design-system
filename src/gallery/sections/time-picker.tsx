"use client";

import { useState } from "react";

import { TextInput } from "@/components/ds/text-input";
import {
  DurationChip,
  StatusChip,
  TimeItem,
  TimeList,
  TimePicker,
  TimePickerPopover,
  splitTime,
  timesBetween,
  type TimeStatus,
} from "@/components/ds/time-picker";
import { ClockIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled" },
] as const;

const STATUSES: { id: TimeStatus; label: string }[] = [
  { id: "available", label: "Available" },
  { id: "busy", label: "Busy" },
  { id: "in-meeting", label: "In-meeting" },
  { id: "offline", label: "Offline" },
];

/** The chips' states, with the picked look under the pointer (page, Open:
 *  "a picked chip keeps its picked look on hover"). */
const CHIP_STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "active", label: "Active" },
  { id: "active-hover", label: "Active, hover" },
  { id: "disabled", label: "Disabled" },
] as const;

const force = (state: string) => (state.endsWith("hover") ? "hover" : state === "focus" ? "focus" : undefined);
const picked = (state: string) => state.startsWith("active");

/** "09:30 AM", for the field and the notes beside the pickers. */
const words = (minutes: number) => {
  const t = splitTime(minutes);
  return `${t.digits} ${t.period}`;
};

/** Example lengths; the Figma's example shows "30 min" chips, the fifth cut
 *  off at the edge, so the row scrolls sideways. */
const DURATIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hour", minutes: 60 },
  { label: "2 hours", minutes: 120 },
];

const MORNING = timesBetween(9 * 60, 12 * 60, 30).map((t) => (t.from === 10 * 60 ? { ...t, disabled: true } : t));
const SLOTS = [9, 10, 11, 12].map((h) => ({ from: h * 60, to: h * 60 + 30 }));

/** A field that opens the Time Picker under it (the Blocks frames show the
 *  list under a field; page, "In code": it opens in a popover). */
function FieldExample() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<number>();
  return (
    <TimePickerPopover
      open={open}
      onOpenChange={setOpen}
      anchor={
        <div className="w-time-picker">
          <TextInput
            label="Start time"
            placeholder="Pick a time"
            leftIcon={<ClockIcon />}
            readOnly
            value={time != null ? words(time) : ""}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") setOpen(true);
            }}
          />
        </div>
      }
    >
      <TimePicker
        defaultValue={time ?? 9 * 60}
        onApply={(p) => {
          setTime(p.time);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </TimePickerPopover>
  );
}

export function TimePickerSection() {
  const [time, setTime] = useState<number | undefined>(9 * 60 + 30);
  const [said, setSaid] = useState("");
  const [from, setFrom] = useState<number | undefined>(9 * 60);
  const [to, setTo] = useState<number | undefined>(11 * 60);
  const [status, setStatus] = useState<TimeStatus>("available");
  const [duration, setDuration] = useState(30);

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="The picker: pick a time and a length, then Apply">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="With durations (the Figma's example)">
            <TimePicker
              value={time}
              onValueChange={setTime}
              durations={DURATIONS}
              defaultDuration={30}
              onApply={(p) => setSaid(p.time != null ? `Applied ${words(p.time)}, ${p.duration ?? 0} min` : "Applied nothing")}
              onCancel={() => setSaid("Cancelled")}
              onClose={() => setSaid("Closed")}
            />
          </Labelled>
          <Labelled label="No durations row, when no length can be picked">
            <TimePicker
              defaultValue={14 * 60}
              onApply={(p) => setSaid(p.time != null ? `Applied ${words(p.time)}` : "Applied nothing")}
              onCancel={() => setSaid("Cancelled")}
              onClose={() => setSaid("Closed")}
            />
          </Labelled>
          {said && <span className="text-paragraph-xs text-text-soft-400">{said}</span>}
        </div>
      </Group>

      <Group label="Opened from a field: click it, pick, Apply">
        <FieldExample />
      </Group>

      <Group label="Time item, every state">
        <div className="flex flex-col gap-space-16">
          {[
            { id: "one", label: "One time", to: undefined, tick: "right" as const },
            { id: "slot-right", label: "A slot, tick right", to: 10 * 60, tick: "right" as const },
            { id: "slot-center", label: "A slot, tick centre", to: 10 * 60, tick: "center" as const },
          ].map((row) => (
            <div key={row.id} role="listbox" aria-label={row.label} className="flex flex-wrap items-start gap-space-24">
              {STATES.map((s) => (
                <Labelled key={s.id} label={`${row.label}, ${s.label}`}>
                  <div className="w-time-picker-list p-time-picker-list-pad">
                    <TimeItem
                      from={9 * 60 + 30}
                      to={row.to}
                      tick={row.tick}
                      active={s.id === "active"}
                      disabled={s.id === "disabled"}
                      tabIndex={s.id === "focus" ? 0 : -1}
                      data-force={force(s.id)}
                    />
                  </div>
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Duration chip, every state">
        <div className="flex flex-wrap items-start gap-space-24">
          {CHIP_STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <DurationChip active={picked(s.id)} disabled={s.id === "disabled"} data-force={force(s.id)}>
                30 min
              </DurationChip>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Status chip, every type and state">
        <div className="grid grid-cols-[repeat(6,max-content)] gap-x-space-32 gap-y-space-16">
          {STATUSES.map((t) =>
            CHIP_STATES.map((s) => (
              <Labelled key={`${t.id}-${s.id}`} label={`${t.label}, ${s.label.replace("Active", "Selected")}`}>
                <StatusChip status={t.id} selected={picked(s.id)} disabled={s.id === "disabled"} data-force={force(s.id)} />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Try them: status chips and duration chips pick one">
        <div className="flex flex-col gap-space-12">
          <div role="group" aria-label="Status" className="flex flex-wrap gap-space-8">
            {STATUSES.map((t) => (
              <StatusChip key={t.id} status={t.id} selected={status === t.id} onClick={() => setStatus(t.id)} />
            ))}
          </div>
          <div role="group" aria-label="Duration" className="flex flex-wrap gap-space-8">
            {DURATIONS.map((d) => (
              <DurationChip key={d.minutes} active={duration === d.minutes} onClick={() => setDuration(d.minutes)}>
                {d.label}
              </DurationChip>
            ))}
          </div>
        </div>
      </Group>

      <Group label="Lists on their own (from the Figma's Blocks): a from and a to list, and slots with the tick in the centre">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="From (10:00 AM cannot be picked)">
            <div className="w-time-picker-list">
              <TimeList aria-label="From" options={MORNING} value={from} onValueChange={setFrom} />
            </div>
          </Labelled>
          <Labelled label="To">
            <div className="w-time-picker-list">
              <TimeList aria-label="To" options={timesBetween(10 * 60, 13 * 60, 30)} value={to} onValueChange={setTo} />
            </div>
          </Labelled>
          <Labelled label="Slots, tick centre">
            <div className="w-time-picker-list">
              <TimeList aria-label="Slot" options={SLOTS} defaultValue={10 * 60} tick="center" />
            </div>
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
