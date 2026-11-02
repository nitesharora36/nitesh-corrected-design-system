"use client";

import { useState } from "react";

import { Button } from "@/components/ds/button";
import { StepIndicator, StepMark, StepperDot } from "@/components/ds/step-indicator";
import { Group, Labelled } from "../parts";

const STEPS = ["Account", "Workspace", "Data", "Invite", "Review"];

/** Back and Next, to walk a stepper through its steps. */
function Walk({ step, setStep, count }: { step: number; setStep: (n: number) => void; count: number }) {
  return (
    <div className="flex gap-space-8">
      <Button tone="neutral" variant="stroke" size="xs" disabled={step <= 0} onClick={() => setStep(step - 1)}>
        Back
      </Button>
      <Button tone="neutral" variant="stroke" size="xs" disabled={step >= count - 1} onClick={() => setStep(step + 1)}>
        Next
      </Button>
    </div>
  );
}

export function StepIndicatorSection() {
  const [row, setRow] = useState(1);
  const [column, setColumn] = useState(1);
  const [dots, setDots] = useState(0);

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Horizontal, try it">
        <div className="flex flex-col items-start gap-space-16">
          <StepIndicator direction="horizontal" steps={STEPS.slice(0, 3)} current={row} aria-label="Sign-up" />
          <Walk step={row} setStep={setRow} count={3} />
        </div>
      </Group>

      <Group label="Horizontal, five steps">
        <StepIndicator direction="horizontal" steps={STEPS} current={2} aria-label="Workflow set-up" />
      </Group>

      <Group label="Vertical, try it">
        <div className="flex flex-col items-start gap-space-16">
          <StepIndicator direction="vertical" steps={STEPS} current={column} aria-label="Workflow set-up" className="w-step-indicator-vertical" />
          <Walk step={column} setStep={setColumn} count={STEPS.length} />
        </div>
      </Group>

      <Group label="Step mark">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Default, horizontal (edge)">
            <StepMark state="default" number={3} direction="horizontal" />
          </Labelled>
          <Labelled label="Default, vertical (card shadow)">
            <StepMark state="default" number={3} direction="vertical" />
          </Labelled>
          <Labelled label="Active">
            <StepMark state="active" number={2} />
          </Labelled>
          <Labelled label="Completed">
            <StepMark state="completed" number={1} />
          </Labelled>
        </div>
      </Group>

      <Group label="Stepper Dot, try it">
        <div className="flex flex-col items-start gap-space-16">
          <div className="flex flex-wrap items-end gap-space-32">
            <Labelled label="Small, 8 x 8, 10 apart">
              <StepperDot size="sm" current={dots} />
            </Labelled>
            <Labelled label="X-Small, 4 x 4, 6 apart">
              <StepperDot size="xs" current={dots} />
            </Labelled>
          </div>
          <Walk step={dots} setStep={setDots} count={3} />
        </div>
      </Group>
    </div>
  );
}
