"use client";

import { useState } from "react";

import { ButtonGroup, ButtonGroupItem } from "@/components/ds/button-group";
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, DeleteIcon, GridIcon, PinIcon, StarIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const SIZES = [
  { id: "sm", label: "Small 36" },
  { id: "xs", label: "X-Small 32" },
  { id: "2xs", label: "2X-Small 24" },
] as const;

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "active", label: "Active" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
] as const;

const WORDS = ["Overview", "Members", "Billing", "Usage", "Settings", "Logs"];
const VIEWS = ["Day", "Week", "Month"];

export function ButtonGroupSection() {
  const [view, setView] = useState("Week");

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Every item state, each size (the middle item)">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-space-32 gap-y-space-16">
          {SIZES.map((s) =>
            STATES.map((state) => (
              <Labelled key={`${s.id}-${state.id}`} label={`${s.label}, ${state.label}`}>
                <ButtonGroup size={s.id} aria-label={`${state.label} item`}>
                  <ButtonGroupItem>Day</ButtonGroupItem>
                  <ButtonGroupItem
                    active={state.id === "active"}
                    data-force={state.id === "hover" || state.id === "focus" ? state.id : undefined}
                    disabled={state.id === "disabled"}
                  >
                    Week
                  </ButtonGroupItem>
                  <ButtonGroupItem>Month</ButtonGroupItem>
                </ButtonGroup>
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Focus on an end item, each size">
        <div className="flex flex-wrap items-end gap-space-32">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <ButtonGroup size={s.id} aria-label="Focus on the first item">
                <ButtonGroupItem data-force="focus">Day</ButtonGroupItem>
                <ButtonGroupItem>Week</ButtonGroupItem>
                <ButtonGroupItem>Month</ButtonGroupItem>
              </ButtonGroup>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Items, 2 to 6, Small 36">
        <div className="flex flex-col gap-space-16">
          {[2, 3, 4, 5, 6].map((n) => (
            <Labelled key={n} label={`${n} items`}>
              <ButtonGroup aria-label={`${n} items`}>
                {WORDS.slice(0, n).map((word) => (
                  <ButtonGroupItem key={word}>{word}</ButtonGroupItem>
                ))}
              </ButtonGroup>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Item content, each size: a word, an icon before, after, both, one icon alone">
        <div className="flex flex-col gap-space-16">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <ButtonGroup size={s.id} aria-label="Item content">
                <ButtonGroupItem>Overview</ButtonGroupItem>
                <ButtonGroupItem leadingIcon={<GridIcon />}>Grid</ButtonGroupItem>
                <ButtonGroupItem trailingIcon={<ChevronRightIcon />}>Next</ButtonGroupItem>
                <ButtonGroupItem leadingIcon={<ChevronLeftIcon />} trailingIcon={<ChevronRightIcon />}>
                  Week
                </ButtonGroupItem>
                <ButtonGroupItem leadingIcon={<CopyIcon />} aria-label="Copy" />
              </ButtonGroup>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Icons alone, a toolbar, each size">
        <div className="flex flex-wrap items-end gap-space-32">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <ButtonGroup size={s.id} aria-label="Toolbar">
                <ButtonGroupItem leadingIcon={<CopyIcon />} aria-label="Copy" />
                <ButtonGroupItem leadingIcon={<PinIcon />} aria-label="Pin" />
                <ButtonGroupItem leadingIcon={<StarIcon />} aria-label="Star" />
                <ButtonGroupItem leadingIcon={<DeleteIcon />} aria-label="Delete" />
              </ButtonGroup>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Two disabled items side by side: only the line between them goes">
        <ButtonGroup aria-label="Disabled items">
          <ButtonGroupItem>Overview</ButtonGroupItem>
          <ButtonGroupItem disabled>Members</ButtonGroupItem>
          <ButtonGroupItem disabled>Billing</ButtonGroupItem>
          <ButtonGroupItem>Usage</ButtonGroupItem>
        </ButtonGroup>
      </Group>

      <Group label="Try it: pick a view">
        <ButtonGroup aria-label="View">
          {VIEWS.map((v) => (
            <ButtonGroupItem key={v} active={view === v} onClick={() => setView(v)}>
              {v}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      </Group>
    </div>
  );
}
