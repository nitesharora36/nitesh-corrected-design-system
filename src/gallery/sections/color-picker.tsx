"use client";

import { useState } from "react";

import {
  COLOR_DOTS,
  COLOR_FORMATS,
  ColorDots,
  ColorPicker,
  ColorSlider,
  ColorSpectrum,
  ColorValueField,
  colorDotLabel,
  type ColorFormat,
  type ColorValue,
  type ColorValueFieldProps,
} from "@/components/ds/color-picker";
import { DropdownPanel, DropdownRow } from "@/components/ds/dropdown";
import { CheckIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const DOT_STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "selected", label: "Selected" },
  { id: "disabled", label: "Disabled" },
] as const;

const FIELD_STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover (proposed)" },
  { id: "focus", label: "Focus (proposed)" },
  { id: "error", label: "Error (proposed)" },
  { id: "format-focus", label: "Format menu, Focus (proposed)" },
] as const;

const FORMAT_NAMES: Record<ColorFormat, string> = { hex: "Hex", rgb: "RGB", hsl: "HSL" };

/** The opacity, 0 to 100, as the two hex digits after the colour. */
const alphaHex = (alpha: number) => Math.round(alpha * 2.55).toString(16).padStart(2, "0");

/** The value field on its own, at the panel's 240, with its own format menu. */
function FieldDemo({
  colour,
  onColour,
  start = "hex",
  ...rest
}: { colour: ColorValue; onColour: (next: ColorValue) => void; start?: ColorFormat } & Pick<ColorValueFieldProps, "error" | "data-force">) {
  const [format, setFormat] = useState<ColorFormat>(start);
  return (
    <div className="w-color-picker-content">
      <ColorValueField
        hex={colour.hex}
        alpha={colour.alpha}
        format={format}
        onFormatChange={setFormat}
        onHexChange={(hex) => onColour({ ...colour, hex })}
        onAlphaChange={(alpha) => onColour({ ...colour, alpha })}
        {...rest}
      />
    </div>
  );
}

export function ColorPickerSection() {
  const [picked, setPicked] = useState<ColorValue>({ hex: "335CFF", alpha: 100 });
  const [shade, setShade] = useState({ s: 0.8, v: 0.7 });
  const [hue, setHue] = useState(228);
  const [alpha, setAlpha] = useState(60);
  const [fieldColour, setFieldColour] = useState<ColorValue>({ hex: "335CFF", alpha: 100 });

  return (
    <div className="flex flex-col gap-space-40">
      <div className="text-paragraph-xs text-text-soft-400">
        The spectrum, the rainbow, the opacity fade and the handles are the person&apos;s colour, the one place raw
        colours are drawn. The format menu (Hex, RGB, HSL) is the page&apos;s proposal; the Figma draws no menu. The
        eyedropper shows only in browsers that have one (Chrome and Edge). Yellow, Purple, Sky, Pink and Teal dots wait
        for their hues. No Disabled panel: the page asks Nitesh first.
      </div>

      <Group label="The picker: drag in the square and on the sliders, type a value, change the format, or pick a dot">
        <div className="flex flex-wrap items-start gap-space-24">
          <ColorPicker defaultValue={picked} onValueChange={setPicked} />
          <Labelled label={`Picked: ${picked.hex}, ${picked.alpha}%`}>
            <span
              className="ds-shadow block size-space-48 rounded-corner-8 edge-stroke-soft-200"
              style={{ backgroundColor: `#${picked.hex}${alphaHex(picked.alpha)}` }}
            />
          </Labelled>
        </div>
      </Group>

      <Group label="Starting in RGB, at 60% opacity">
        <ColorPicker defaultValue={{ hex: "E5484D", alpha: 60 }} defaultFormat="rgb" />
      </Group>

      <Group label="Color Spectrum on its own (232 x 232)">
        <div className="flex flex-wrap items-start gap-space-40">
          <Labelled label="Default (drag in it)">
            <div className="w-color-picker-spectrum">
              <ColorSpectrum hue={hue} saturation={shade.s} brightness={shade.v} onChange={(s, v) => setShade({ s, v })} />
            </div>
          </Labelled>
          <Labelled label="Handle, Focus (proposed)">
            <div className="w-color-picker-spectrum">
              <ColorSpectrum hue={hue} saturation={0.8} brightness={0.7} data-force="focus" />
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="Color Sliders on their own: Hue and Opacity">
        <div className="flex flex-wrap items-start gap-space-40">
          <Labelled label="Hue (moves the spectrum above)">
            <div className="w-color-picker-spectrum">
              <ColorSlider kind="hue" value={hue} onValueChange={setHue} color="335CFF" />
            </div>
          </Labelled>
          <Labelled label="Opacity">
            <div className="w-color-picker-spectrum">
              <ColorSlider kind="opacity" value={alpha} onValueChange={setAlpha} color="335CFF" />
            </div>
          </Labelled>
          <Labelled label="Hue, Focus (proposed)">
            <div className="w-color-picker-spectrum">
              <ColorSlider kind="hue" value={120} color="335CFF" data-force="focus" />
            </div>
          </Labelled>
          <Labelled label="Opacity, Focus (proposed)">
            <div className="w-color-picker-spectrum">
              <ColorSlider kind="opacity" value={60} color="335CFF" data-force="focus" />
            </div>
          </Labelled>
        </div>
      </Group>

      <Group label="The value field, every state (240, as in the panel; type in any of them)">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-16">
          {FIELD_STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <FieldDemo
                colour={fieldColour}
                onColour={setFieldColour}
                error={s.id === "error"}
                data-force={s.id === "hover" || s.id === "focus" || s.id === "format-focus" ? s.id : undefined}
              />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="The value field in each format (the menu changes it)">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-16">
          {COLOR_FORMATS.map((f) => (
            <Labelled key={f} label={FORMAT_NAMES[f]}>
              <FieldDemo colour={fieldColour} onColour={setFieldColour} start={f} />
            </Labelled>
          ))}
          <Labelled label="The format menu, open (drawn still)">
            <DropdownPanel width="content">
              {COLOR_FORMATS.map((f) => (
                <DropdownRow key={f} label={FORMAT_NAMES[f]} rightIcon={f === "hex" ? <CheckIcon /> : undefined} />
              ))}
            </DropdownPanel>
          </Labelled>
        </div>
      </Group>

      <Group label="Color Dots, every colour and state">
        <div className="flex flex-col gap-space-16">
          {DOT_STATES.map((s) => (
            <div key={s.id} className="flex flex-wrap items-start gap-space-24">
              {COLOR_DOTS.map((c) => (
                <Labelled key={c} label={`${colorDotLabel(c)}, ${s.label}`}>
                  <ColorDots
                    aria-label={`${colorDotLabel(c)}, ${s.label}`}
                    colors={[c]}
                    value={s.id === "selected" ? c : ""}
                    disabledColors={s.id === "disabled" ? [c] : undefined}
                    force={s.id === "hover" || s.id === "focus" ? { color: c, state: s.id } : undefined}
                  />
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Try it: a row of Color Dots on its own (arrow keys move between them)">
        <ColorDots aria-label="Label colour" defaultValue="blue" />
      </Group>
    </div>
  );
}
