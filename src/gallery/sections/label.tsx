"use client";

import { FieldLabel, HintText } from "@/components/ds/label";
import { LinkButton } from "@/components/ds/link-button";
import { InfoIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

// The page names no style or size for the label's Link Button; it is shown
// here as Primary, Medium (20), the label row's height.
const LABELS = [
  { label: "Label", word: "Full name", props: {} },
  { label: "Required", word: "Full name", props: { required: true } },
  { label: "Optional", word: "Full name", props: { optional: true } },
  { label: "Required, info icon", word: "Full name", props: { required: true, info: true } },
  { label: "Optional, info icon", word: "Full name", props: { optional: true, info: true } },
  { label: "Required, info icon, link", word: "Password", props: { required: true, info: true }, withLink: true },
] as const;

/** The label's optional Link Button; Disabled when the label is. */
const link = (disabled?: boolean) => (
  <LinkButton variant="primary" size="md" disabled={disabled}>
    Forgot?
  </LinkButton>
);

export function LabelSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Label">
        <div className="grid grid-cols-[repeat(6,max-content)] gap-x-space-32 gap-y-space-16">
          {LABELS.map((l) => (
            <Labelled key={l.label} label={l.label}>
              <FieldLabel {...l.props} link={"withLink" in l ? link() : undefined}>
                {l.word}
              </FieldLabel>
            </Labelled>
          ))}
          {LABELS.map((l) => (
            <Labelled key={`${l.label}-disabled`} label={`${l.label}, Disabled`}>
              <FieldLabel {...l.props} link={"withLink" in l ? link(true) : undefined} disabled>
                {l.word}
              </FieldLabel>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Hint Text">
        <div className="flex flex-wrap items-start gap-x-space-40 gap-y-space-16">
          <Labelled label="Default">
            <HintText icon={<InfoIcon />}>Shown on your profile.</HintText>
          </Labelled>
          <Labelled label="Error">
            <HintText state="error" icon={<InfoIcon />}>
              Enter your full name.
            </HintText>
          </Labelled>
          <Labelled label="Disabled">
            <HintText state="disabled" icon={<InfoIcon />}>
              Shown on your profile.
            </HintText>
          </Labelled>
          <Labelled label="Default, no icon">
            <HintText>Shown on your profile.</HintText>
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
