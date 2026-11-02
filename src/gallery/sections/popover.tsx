"use client";

import { useState } from "react";

import { Button } from "@/components/ds/button";
import { Popover, PopoverFooter, PopoverPanel, type PopoverTail } from "@/components/ds/popover";
import { InfoIcon, StarIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const TAILS: { id: PopoverTail; label: string }[] = [
  { id: "none", label: "No tail" },
  { id: "top-left", label: "Top left" },
  { id: "top-center", label: "Top centre" },
  { id: "top-right", label: "Top right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-center", label: "Bottom centre" },
  { id: "bottom-right", label: "Bottom right" },
  { id: "right-top", label: "Right top" },
  { id: "right", label: "Right" },
  { id: "right-bottom", label: "Right bottom" },
  { id: "left-top", label: "Left top" },
  { id: "left", label: "Left" },
  { id: "left-bottom", label: "Left bottom" },
];

const TITLE = "Your reports live here";
const TEXT = "Every report you save shows up in this list, newest first.";
const noop = () => {};

/** A product tour of four steps, opened from a button. */
function Tour() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const steps = ["Your reports live here", "Share with your team", "Set a schedule", "You are all set"];
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setStep(0);
      }}
      tail="top-left"
      close
      icon={<StarIcon />}
      title={steps[step]}
      description={TEXT}
      footer={
        <PopoverFooter
          type="stepper"
          current={step}
          count={steps.length}
          buttons={step === 0 ? 1 : 2}
          nextLabel={step === steps.length - 1 ? "Done" : "Next"}
          onBack={() => setStep((s) => Math.max(0, s - 1))}
          onNext={() => (step === steps.length - 1 ? setOpen(false) : setStep((s) => s + 1))}
        />
      }
    >
      <Button tone="neutral" variant="stroke" size="sm" leadingIcon={<InfoIcon />}>
        Start the tour
      </Button>
    </Popover>
  );
}

export function PopoverSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: open the tour (Escape or the close button closes it)">
        <div className="flex flex-wrap items-center gap-space-24 pb-space-48">
          <Tour />
          <Popover tail="bottom-center" title="New here?" description="Pick a template to start faster." close>
            <Button tone="neutral" variant="stroke" size="sm">
              Hint above
            </Button>
          </Popover>
          <Popover tail="left" title="Filters" description="Narrow the list by owner or date." close>
            <Button tone="neutral" variant="stroke" size="sm">
              Hint to the right
            </Button>
          </Popover>
        </div>
      </Group>

      <Group label="Every tail position (32 from the nearer corner; the tail adds 8 outside the box)">
        <div className="flex flex-wrap items-start gap-x-space-24 gap-y-space-16">
          {TAILS.map((t) => (
            <Labelled key={t.id} label={t.label}>
              <div className="p-space-12">
                <PopoverPanel tail={t.id} title={TITLE} description={TEXT} onClose={noop} />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Body: with the Key Icon, without it (32 clear of the close button), without the close button">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Icon and close">
            <PopoverPanel icon={<StarIcon />} title={TITLE} description={TEXT} onClose={noop} />
          </Labelled>
          <Labelled label="No icon">
            <PopoverPanel title={TITLE} description={TEXT} onClose={noop} />
          </Labelled>
          <Labelled label="No close button">
            <PopoverPanel icon={<StarIcon />} title={TITLE} description={TEXT} />
          </Labelled>
        </div>
      </Group>

      <Group label="Footer types, two buttons and one">
        <div className="grid grid-cols-[repeat(2,max-content)] gap-x-space-24 gap-y-space-16">
          {(["stepper", "text-stepper", "stretch"] as const).map((type) =>
            ([2, 1] as const).map((buttons) => (
              <Labelled key={`${type}-${buttons}`} label={`${type === "stepper" ? "Stepper" : type === "text-stepper" ? "Text Stepper" : "Stretch"}, ${buttons === 2 ? "two buttons" : "one button"}`}>
                <PopoverPanel
                  icon={<StarIcon />}
                  title={TITLE}
                  description={TEXT}
                  onClose={noop}
                  footer={<PopoverFooter type={type} current={0} count={4} buttons={buttons} />}
                />
              </Labelled>
            )),
          )}
        </div>
      </Group>
    </div>
  );
}
