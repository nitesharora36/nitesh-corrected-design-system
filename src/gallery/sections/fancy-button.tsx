"use client";

import { FancyButton } from "@/components/ds/fancy-button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const TONES = [
  { id: "neutral", label: "Neutral" },
  { id: "basic", label: "Basic" },
  { id: "primary", label: "Primary" },
  { id: "error", label: "Error (the Figma's Destructive)" },
] as const;
const SIZES = [
  { id: "md", label: "Medium 40" },
  { id: "sm", label: "Small 36" },
  { id: "xs", label: "X-Small 32" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
] as const;

export function FancyButtonSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Medium 40, every type and state">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
          {TONES.map((tone) =>
            STATES.map((state) => (
              <Labelled key={`${tone.id}-${state.id}`} label={`${tone.label}, ${state.label}`}>
                <FancyButton
                  tone={tone.id}
                  data-force={state.id === "hover" || state.id === "focus" ? state.id : undefined}
                  disabled={state.id === "disabled"}
                  leadingIcon={<ChevronLeftIcon />}
                  trailingIcon={<ChevronRightIcon />}
                >
                  Button
                </FancyButton>
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Sizes, every type">
        <div className="flex flex-col gap-space-16">
          {TONES.map((tone) => (
            <div key={tone.id} className="flex flex-wrap items-end gap-space-32">
              {SIZES.map((s) => (
                <Labelled key={s.id} label={`${tone.label}, ${s.label}`}>
                  <div className="flex items-center gap-space-12">
                    <FancyButton tone={tone.id} size={s.id}>
                      Save
                    </FancyButton>
                    <FancyButton tone={tone.id} size={s.id} leadingIcon={<ChevronLeftIcon />} trailingIcon={<ChevronRightIcon />}>
                      Save
                    </FancyButton>
                  </div>
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}
