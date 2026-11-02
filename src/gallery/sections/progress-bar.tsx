"use client";

import * as React from "react";

import { Button } from "@/components/ds/button";
import {
  CircularProgressBar,
  ProgressBar,
  ProgressBarLabel,
  ProgressBarLink,
  type CircularProgressSize,
  type ProgressColor,
} from "@/components/ds/progress-bar";
import { Group, Labelled } from "../parts";

const VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const COLORS: { id: ProgressColor; label: string }[] = [
  { id: "blue", label: "Blue" },
  { id: "red", label: "Red" },
  { id: "orange", label: "Orange" },
  { id: "green", label: "Green" },
];
const CIRCLE_SIZES: CircularProgressSize[] = ["80", "72", "64", "56", "48"];
const CIRCLE_VALUES = [0, 25, 50, 75, 100];

export function ProgressBarSection() {
  const [value, setValue] = React.useState(40);
  const step = (by: number) => setValue((v) => Math.min(100, Math.max(0, v + by)));

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="The bar, 0% to 100% (0% is Empty), Blue, 320 wide">
        <div className="grid max-w-3xl grid-cols-2 gap-x-space-32 gap-y-space-16">
          {VALUES.map((v) => (
            <Labelled key={v} label={`${v}%`}>
              <div className="w-full max-w-xs">
                <ProgressBar value={v} aria-label={`Upload, ${v}%`} />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Colours of the filled part, at 80%">
        <div className="grid max-w-3xl grid-cols-2 gap-x-space-32 gap-y-space-16">
          {COLORS.map((c) => (
            <Labelled key={c.id} label={c.label}>
              <div className="w-full max-w-xs">
                <ProgressBar value={80} color={c.id} aria-label={`Storage, ${c.label}`} />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Progress Bar Label: On Top, On Top with the bottom line, On Right">
        <div className="flex flex-col gap-space-24">
          <Labelled label="On Top (32)">
            <ProgressBarLabel className="w-xs max-w-full" title="Storage" value={80} />
          </Labelled>
          <Labelled label="On Top, with the bottom line (54)">
            <ProgressBarLabel
              className="w-xs max-w-full"
              title="Storage"
              value={90}
              valueText="9 of 10"
              link={<ProgressBarLink>Upgrade</ProgressBarLink>}
              note="for unlimited storage."
            />
          </Labelled>
          <Labelled label="On Right (16)">
            <ProgressBarLabel className="w-xs max-w-full" type="right" title="Storage" value={80} />
          </Labelled>
        </div>
      </Group>

      <Group label="Circular Progress Bar, every size, 0% to 100%">
        <div className="flex flex-col gap-space-16">
          {CIRCLE_SIZES.map((size) => (
            <div key={size} className="flex flex-wrap items-end gap-space-24">
              {CIRCLE_VALUES.map((v) => (
                <Labelled key={v} label={`${size}, ${v}%`}>
                  <CircularProgressBar size={size} value={v} aria-label={`Profile complete, ${v}%`} />
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Try it: change the value">
        <div className="flex flex-wrap items-center gap-space-24">
          <ProgressBarLabel className="w-xs max-w-full" title="Upload" value={value} />
          <CircularProgressBar size="64" value={value} aria-label="Upload" />
          <div className="flex gap-space-8">
            <Button tone="neutral" variant="stroke" size="xs" onClick={() => step(-10)}>
              Less
            </Button>
            <Button tone="neutral" variant="stroke" size="xs" onClick={() => step(10)}>
              More
            </Button>
          </div>
        </div>
      </Group>
    </div>
  );
}
