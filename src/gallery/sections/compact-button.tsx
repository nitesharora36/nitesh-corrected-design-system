"use client";

import { useState } from "react";

import { CompactButton } from "@/components/ds/compact-button";
import { CloseIcon, PinIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VARIANTS = [
  { id: "stroke", label: "Stroke" },
  { id: "ghost", label: "Ghost" },
  { id: "white", label: "White" },
] as const;
const SIZES = [
  { id: "lg", label: "Large 24" },
  { id: "md", label: "Medium 20" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "active", label: "Active" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
] as const;

const force = (state: string) => (state === "hover" || state === "focus" || state === "active" ? state : undefined);

export function CompactButtonSection() {
  const [pinned, setPinned] = useState(false);

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Large 24, every style and state">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-space-32 gap-y-space-16">
          {VARIANTS.map((variant) =>
            STATES.map((state) => (
              <Labelled key={`${variant.id}-${state.id}`} label={`${variant.label}, ${state.label}`}>
                <CompactButton
                  variant={variant.id}
                  data-force={force(state.id)}
                  disabled={state.id === "disabled"}
                  aria-label="Close"
                >
                  <CloseIcon />
                </CompactButton>
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Modifiable, on a coloured fill, every state">
        <div className="flex flex-wrap items-center gap-space-32 rounded-corner-12 bg-primary-base p-space-16 text-static-white">
          {STATES.map((state) => (
            <div key={state.id} className="flex flex-col items-start gap-space-6">
              <CompactButton
                variant="modifiable"
                data-force={force(state.id)}
                disabled={state.id === "disabled"}
                aria-label="Close"
              >
                <CloseIcon />
              </CompactButton>
              <span className="text-paragraph-xs">{state.label}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Sizes and Full Radius, every style">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
          {VARIANTS.map((variant) =>
            SIZES.map((s) =>
              [false, true].map((full) => (
                <Labelled
                  key={`${variant.id}-${s.id}-${full}`}
                  label={`${variant.label}, ${s.label}, Full Radius ${full ? "On" : "Off"}`}
                >
                  <CompactButton variant={variant.id} size={s.id} fullRadius={full} aria-label="Close">
                    <CloseIcon />
                  </CompactButton>
                </Labelled>
              )),
            ),
          )}
        </div>
      </Group>

      <Group label="Try it: a toggle that stays Active while on">
        <Labelled label={pinned ? "On" : "Off"}>
          <CompactButton variant="ghost" active={pinned} onClick={() => setPinned((p) => !p)} aria-label="Pin">
            <PinIcon />
          </CompactButton>
        </Labelled>
      </Group>
    </div>
  );
}
