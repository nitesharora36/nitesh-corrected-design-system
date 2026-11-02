"use client";

import { Button } from "@/components/ds/button";
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const TONES = ["primary", "neutral", "error"] as const;
const VARIANTS = ["filled", "stroke", "lighter", "ghost"] as const;
const SIZES = [
  { id: "md", label: "Medium 40" },
  { id: "sm", label: "Small 36" },
  { id: "xs", label: "X-Small 32" },
  { id: "2xs", label: "2X-Small 28" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
] as const;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function ButtonSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {TONES.map((tone) => (
        <Group key={tone} label={`${cap(tone)}, Medium 40, every style and state`}>
          <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
            {VARIANTS.map((variant) =>
              STATES.map((state) => (
                <Labelled key={`${variant}-${state.id}`} label={`${cap(variant)}, ${state.label}`}>
                  <Button
                    tone={tone}
                    variant={variant}
                    data-force={state.id === "hover" || state.id === "focus" ? state.id : undefined}
                    disabled={state.id === "disabled"}
                    leadingIcon={<ChevronLeftIcon />}
                    trailingIcon={<ChevronRightIcon />}
                  >
                    Button
                  </Button>
                </Labelled>
              )),
            )}
          </div>
        </Group>
      ))}

      <Group label="Sizes, Primary Filled">
        <div className="flex flex-wrap items-end gap-space-32">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <div className="flex items-center gap-space-12">
                <Button size={s.id}>Button</Button>
                <Button size={s.id} leadingIcon={<ChevronLeftIcon />}>Button</Button>
                <Button size={s.id} leadingIcon={<ChevronLeftIcon />} trailingIcon={<ChevronRightIcon />}>Button</Button>
                <Button size={s.id} leadingIcon={<CopyIcon />} aria-label="Copy" />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Icon only, every style, Neutral">
        <div className="flex flex-wrap items-end gap-space-32">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <div className="flex items-center gap-space-12">
                {VARIANTS.map((variant) => (
                  <Button key={variant} tone="neutral" variant={variant} size={s.id} leadingIcon={<CopyIcon />} aria-label={`Copy, ${variant}`} />
                ))}
              </div>
            </Labelled>
          ))}
        </div>
      </Group>
    </div>
  );
}
