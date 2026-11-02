"use client";

import { useState } from "react";

import { Slider } from "@/components/ds/slider";
import { Group, Labelled } from "../parts";

// The Figma draws 0%, 25%, 50%, 75% and 100% (Range: the pairs of these).
const POINTS = [0, 25, 50, 75, 100];
const PAIRS: [number, number][] = [
  [0, 100],
  [0, 25],
  [25, 50],
  [25, 75],
  [50, 100],
];

const TYPES = [
  { id: "slider", label: "Slider", value: [30] },
  { id: "range", label: "Range Slider", value: [20, 70] },
] as const;

const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover (proposed)" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "disabled", label: "Disabled (proposed)" },
] as const;

const force = (state: string) => (state === "hover" || state === "focus" ? state : undefined);
const percent = (v: number) => `${v}%`;
// The Figma's tooltip example reads "$300".
const money = (v: number) => `$${v * 10}`;

export function SliderSection() {
  const [volume, setVolume] = useState([40]);
  const [price, setPrice] = useState([20, 60]);

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Try it: drag a dot, or tab to it and use the arrow keys">
        <div className="flex flex-wrap items-end gap-x-space-48 gap-y-space-32 pt-space-32">
          <Labelled label="Slider, with the label row">
            <div className="w-slider-figma">
              <Slider label="Volume" value={volume} onValueChange={setVolume} format={percent} />
            </div>
          </Labelled>
          <Labelled label="Range Slider, with the tooltip">
            <div className="w-slider-figma">
              <Slider aria-label="Price" value={price} onValueChange={setPrice} format={money} tooltip />
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="Slider, the Figma's values (at 0 nothing is picked yet)">
        <div className="flex flex-wrap items-start gap-x-space-48 gap-y-space-24">
          {POINTS.map((p) => (
            <Labelled key={p} label={percent(p)}>
              <div className="w-slider-figma">
                <Slider label="Label" defaultValue={[p]} format={percent} />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Range Slider, the Figma's pairs (at both ends nothing is picked yet)">
        <div className="flex flex-wrap items-start gap-x-space-48 gap-y-space-24">
          {PAIRS.map((p) => (
            <Labelled key={p.join("-")} label={`${percent(p[0])} to ${percent(p[1])}`}>
              <div className="w-slider-figma">
                <Slider label="Label" defaultValue={p} format={percent} />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      {TYPES.map((t) => (
        <Group key={t.id} label={`${t.label}, the label row and the tooltip on and off`}>
          <div className="flex flex-wrap items-end gap-x-space-48 gap-y-space-32 pt-space-32">
            <Labelled label="Label row (36 tall)">
              <div className="w-slider-figma">
                <Slider label="Price" defaultValue={[...t.value]} format={money} />
              </div>
            </Labelled>
            <Labelled label="Label row with (Optional)">
              <div className="w-slider-figma">
                <Slider label="Price" optional defaultValue={[...t.value]} format={money} />
              </div>
            </Labelled>
            <Labelled label="No label row (16 tall)">
              <div className="w-slider-figma">
                <Slider aria-label="Price" defaultValue={[...t.value]} format={money} />
              </div>
            </Labelled>
            <Labelled label="Tooltip, 2X-Small Dark">
              <div className="w-slider-figma">
                <Slider aria-label="Price" defaultValue={[...t.value]} format={money} tooltip />
              </div>
            </Labelled>
          </div>
        </Group>
      ))}

      <Group label="Every state">
        <div className="flex flex-col gap-space-24">
          {[[50], [25, 75]].map((v) => (
            <div key={v.length} className="flex flex-wrap items-start gap-x-space-48 gap-y-space-24">
              {STATES.map((s) => (
                <Labelled key={s.id} label={`${v.length === 1 ? "Slider" : "Range Slider"}, ${s.label}`}>
                  <div className="w-slider-figma">
                    <Slider
                      label="Label"
                      optional
                      defaultValue={v}
                      format={percent}
                      disabled={s.id === "disabled"}
                      data-force={force(s.id)}
                    />
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
