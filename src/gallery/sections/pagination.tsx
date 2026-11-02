"use client";

import { Pagination, PaginationCell, PaginationGap } from "@/components/ds/pagination";
import { CompactSelect, SelectItem } from "@/components/ds/select";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VARIANTS = [
  { id: "basic", label: "Basic" },
  { id: "full-radius", label: "Full Radius" },
  { id: "group", label: "Group" },
] as const;

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "selected", label: "Selected (proposed fill)" },
  { id: "disabled", label: "Disabled" },
] as const;

type StateId = (typeof STATES)[number]["id"];
const cellState = (s: StateId) => ({
  "data-force": s === "hover" || s === "focus" ? s : undefined,
  selected: s === "selected",
  disabled: s === "disabled",
});

// The per-page picker: the Compact Select, Basic, X-Small 32 (select.md).
const perPage = (label: string) => (
  <CompactSelect type="basic" size="xs" aria-label={`Rows per page, ${label}`} defaultValue="7">
    {[7, 10, 20, 50].map((n) => (
      <SelectItem key={n} value={String(n)} code={`${n} / page`}>
        {n} per page
      </SelectItem>
    ))}
  </CompactSelect>
);

export function PaginationSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {VARIANTS.map((v) => (
        <Group key={v.id} label={`${v.label}, try it`}>
          <div className="flex flex-col gap-space-16">
            <Pagination variant={v.id} defaultPage={2} pageCount={16} perPage={perPage(v.label)} />
            <Pagination variant={v.id} defaultPage={8} pageCount={16} summary={false} aria-label={`Pagination, ${v.label}, the middle`} />
          </div>
        </Group>
      ))}

      {VARIANTS.map((v) => (
        <Group key={v.id} label={`Cell states, ${v.label}`}>
          <div className="flex flex-wrap items-end gap-space-32">
            {STATES.map((s) =>
              v.id === "group" ? (
                // In the Group the cell sits between two others, so its dividers show.
                <Labelled key={s.id} label={s.label}>
                  <div className="flex">
                    <PaginationCell variant="group" aria-label="Previous page">
                      <ChevronLeftIcon />
                    </PaginationCell>
                    <PaginationCell variant="group" aria-label="Page 3" {...cellState(s.id)}>
                      3
                    </PaginationCell>
                    <PaginationCell variant="group" aria-label="Page 4">
                      4
                    </PaginationCell>
                  </div>
                </Labelled>
              ) : (
                <Labelled key={s.id} label={s.label}>
                  <PaginationCell variant={v.id} aria-label="Page 3" {...cellState(s.id)}>
                    3
                  </PaginationCell>
                </Labelled>
              ),
            )}
            <Labelled label="Gap">
              {v.id === "group" ? (
                <div className="flex">
                  <PaginationCell variant="group" aria-label="Page 1">
                    1
                  </PaginationCell>
                  <PaginationGap variant="group" />
                  <PaginationCell variant="group" aria-label="Page 16">
                    16
                  </PaginationCell>
                </div>
              ) : (
                <PaginationGap variant={v.id} />
              )}
            </Labelled>
          </div>
        </Group>
      ))}
    </div>
  );
}
