"use client";

import { LinkButton } from "@/components/ds/link-button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VARIANTS = [
  { id: "gray", label: "Gray" },
  { id: "black", label: "Black" },
  { id: "primary", label: "Primary" },
  { id: "error", label: "Error" },
] as const;
const SIZES = [
  { id: "md", label: "Medium 20" },
  { id: "sm", label: "Small 16" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
] as const;
const UNDERLINES = [
  { on: false, label: "Underline Off" },
  { on: true, label: "Underline On" },
] as const;

const force = (state: string) => (state === "hover" || state === "focus" ? state : undefined);

export function LinkButtonSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {UNDERLINES.map((u) => (
        <Group key={u.label} label={`${u.label}, Medium 20, every style and state`}>
          <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
            {VARIANTS.map((variant) =>
              STATES.map((state) => (
                <Labelled key={`${variant.id}-${state.id}`} label={`${variant.label}, ${state.label}`}>
                  <LinkButton
                    variant={variant.id}
                    underline={u.on}
                    data-force={force(state.id)}
                    disabled={state.id === "disabled"}
                    leadingIcon={<ChevronLeftIcon />}
                    trailingIcon={<ChevronRightIcon />}
                  >
                    Reply
                  </LinkButton>
                </Labelled>
              )),
            )}
          </div>
        </Group>
      ))}

      <Group label="Modifiable, on a coloured fill: it takes the words' colour, white here">
        <div className="flex flex-col gap-space-16 rounded-corner-12 bg-primary-base p-space-16 text-static-white">
          {UNDERLINES.map((u) => (
            <div key={u.label} className="flex flex-wrap items-center gap-space-32">
              {STATES.map((state) => (
                <div key={state.id} className="flex flex-col items-start gap-space-6">
                  <LinkButton
                    variant="modifiable"
                    underline={u.on}
                    data-force={force(state.id)}
                    disabled={state.id === "disabled"}
                    leadingIcon={<ChevronLeftIcon />}
                    trailingIcon={<ChevronRightIcon />}
                  >
                    Reply
                  </LinkButton>
                  <span className="text-paragraph-xs">{`${u.label}, ${state.label}`}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Sizes, Primary">
        <div className="flex flex-wrap items-end gap-space-32">
          {SIZES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <div className="flex items-center gap-space-16">
                <LinkButton variant="primary" size={s.id}>
                  Reply
                </LinkButton>
                <LinkButton variant="primary" size={s.id} underline>
                  Reply
                </LinkButton>
                <LinkButton variant="primary" size={s.id} leadingIcon={<ChevronLeftIcon />}>
                  Back
                </LinkButton>
                <LinkButton variant="primary" size={s.id} trailingIcon={<ChevronRightIcon />}>
                  Next
                </LinkButton>
                <LinkButton variant="primary" size={s.id} leadingIcon={<ChevronLeftIcon />} trailingIcon={<ChevronRightIcon />}>
                  Reply
                </LinkButton>
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="As a link (an a with href) and in a sentence">
        <div className="flex flex-col items-start gap-space-12">
          <span className="text-paragraph-sm text-text-sub-600">
            Can&apos;t sign in?{" "}
            <LinkButton variant="primary" href="#link-button">
              Forgot password?
            </LinkButton>
          </span>
          <div className="flex items-center gap-space-16">
            <LinkButton variant="gray" size="sm" href="#link-button">
              Mark all as read
            </LinkButton>
            <LinkButton variant="gray" size="sm" href="#link-button" disabled>
              Mark all as read
            </LinkButton>
          </div>
        </div>
      </Group>
    </div>
  );
}
