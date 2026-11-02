"use client";

import { SegmentedControl, SegmentedControlItem } from "@/components/ds/segmented-control";
import { GridIcon, ListIcon, MoonIcon, SunIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const SIZES = [
  { id: "md", label: "Medium 36" },
  { id: "sm", label: "Small 28 (proposed, the sidebar's Chat and Canvas switch)" },
] as const;

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "active", label: "Active, picked" },
  { id: "disabled", label: "Disabled" },
] as const;

export function SegmentedControlSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {SIZES.map((size) => (
        <Group key={size.id} label={`${size.label}, try it`}>
          <div className="grid w-full max-w-sm gap-space-16">
            <Labelled label="Words">
              <SegmentedControl size={size.id} defaultValue="week" aria-label="Range">
                <SegmentedControlItem value="day">Day</SegmentedControlItem>
                <SegmentedControlItem value="week">Week</SegmentedControlItem>
                <SegmentedControlItem value="month">Month</SegmentedControlItem>
              </SegmentedControl>
            </Labelled>
            <Labelled label="Icon and word">
              <SegmentedControl size={size.id} defaultValue="light" aria-label="Theme">
                <SegmentedControlItem value="light" icon={<SunIcon />}>Light</SegmentedControlItem>
                <SegmentedControlItem value="dark" icon={<MoonIcon />}>Dark</SegmentedControlItem>
              </SegmentedControl>
            </Labelled>
            <Labelled label="Icon only">
              <SegmentedControl size={size.id} defaultValue="grid" aria-label="View">
                <SegmentedControlItem value="grid" icon={<GridIcon />} aria-label="Grid" />
                <SegmentedControlItem value="list" icon={<ListIcon />} aria-label="List" />
              </SegmentedControl>
            </Labelled>
          </div>
        </Group>
      ))}

      {SIZES.map((size) => (
        <Group key={size.id} label={`Segment states, ${size.label}`}>
          <div className="grid w-full max-w-sm gap-space-16">
            {STATES.map((s) => (
              <Labelled key={s.id} label={`${s.label}: the first segment`}>
                <SegmentedControl size={size.id} value={s.id === "active" ? "chat" : "canvas"} aria-label={`Segment, ${s.id}`}>
                  <SegmentedControlItem
                    value="chat"
                    data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}
                    disabled={s.id === "disabled"}
                  >
                    Chat
                  </SegmentedControlItem>
                  <SegmentedControlItem value="canvas">Canvas</SegmentedControlItem>
                </SegmentedControl>
              </Labelled>
            ))}
          </div>
        </Group>
      ))}
    </div>
  );
}
