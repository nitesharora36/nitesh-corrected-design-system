"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { Dropdown, DropdownContent, DropdownRow, DropdownTrigger } from "@/components/ds/dropdown";
import { fieldLookVariants, useFieldLook } from "@/components/ds/text-input";
import { CheckIcon, ChevronDownIcon, EyedropperIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Color Picker, built from
 * design-system/components/color-picker.md (Nitesh's Figma "Color Picker
 * [1.1]" 4456:115795, "Color Spectrum [1.1]" 4456:115425, "Color Sliders
 * [1.1]" 4415:53671 and "Color Dots [1.1]" 3365:22464).
 *
 * ColorPicker      the panel: the spectrum, the hue and opacity sliders, the
 *                  value field and the recommended colours. defaultValue
 *                  ({ hex: "335CFF", alpha: 100 }), onValueChange,
 *                  recommended (the dots), defaultFormat hex | rgb | hsl
 * ColorSpectrum    the square for shade and brightness. hue, saturation,
 *                  brightness, onChange
 * ColorSlider      kind hue | opacity, value, onValueChange, color (the handle's fill)
 * ColorValueField  the format menu (Hex, RGB, HSL, a Dropdown) over the field:
 *                  eyedropper, value, opacity. hex, alpha, format,
 *                  onFormatChange, onHexChange, onAlphaChange, error
 * ColorDots        a row of Color Dots to pick from (Radix radio group).
 *                  colors, value, onValueChange, onPick (with the dot's colour)
 *
 * The spectrum, the hue track, the opacity fade and the handles show the
 * person's colour, not tokens: they are the one place raw colours are drawn
 * (as hsl() and the picked hex, inline), from the colour being picked. The
 * Color Dots are the state tokens; Yellow, Purple, Sky, Pink and Teal wait
 * for their hues. Proposals the page makes (Open), built: every handle's edge
 * is static/white; keyboard focus shows the Neutral ring on the dots and the
 * handles; the value field takes the Text Input's looks (Error when the value
 * is not a colour); the format menu offers Hex, RGB and HSL. The eyedropper
 * shows only where the browser has one. Every part takes data-force for the
 * Components page. Sizes are the tokens in styles/sizes/color-picker.css.
 */

// ---- Colour sums (the person's colour, not a token) ----

type Rgb = [number, number, number];
export type ColorValue = { hex: string; alpha: number };
export type ColorFormat = "hex" | "rgb" | "hsl";

function hsvToRgb(h: number, s: number, v: number): Rgb {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)].map((c) => Math.round(c * 255)) as Rgb;
}

function rgbToHsv([r, g, b]: Rgb): { h: number; s: number; v: number } {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const d = max - Math.min(rr, gg, bb);
  let h = 0;
  if (d) h = max === rr ? ((gg - bb) / d) % 6 : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)].map((c) => Math.round(c * 255)) as Rgb;
}

function rgbToHsl(rgb: Rgb): { h: number; s: number; l: number } {
  const { h, s: sv, v } = rgbToHsv(rgb);
  const l = v * (1 - sv / 2);
  return { h, s: l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l };
}

const toHex = (rgb: Rgb) => rgb.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();

/** "335CFF" or "35F", with or without its leading hash, to its three channels; null when it is not a hex. */
function parseHex(text: string): Rgb | null {
  const t = text.trim().replace(/^#/, "");
  const full = /^[0-9a-f]{3}$/i.test(t) ? t.replace(/./g, (c) => c + c) : t;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

/** Three numbers in the text ("51, 92, 255" or "228 100% 60%"); null when there are not three. */
const threeNumbers = (text: string) => {
  const n = text.match(/\d+(\.\d+)?/g)?.map(Number);
  return n && n.length === 3 ? n : null;
};

/** What the value part shows in each format, and how it reads back. */
const FORMATS: Record<ColorFormat, { label: string; show: (rgb: Rgb) => string; read: (text: string) => Rgb | null }> = {
  hex: { label: "Hex", show: toHex, read: parseHex },
  rgb: {
    label: "RGB",
    show: (rgb) => rgb.join(", "),
    read: (text) => {
      const n = threeNumbers(text);
      return n && n.every((c) => c <= 255) ? (n.map(Math.round) as Rgb) : null;
    },
  },
  hsl: {
    label: "HSL",
    show: (rgb) => {
      const { h, s, l } = rgbToHsl(rgb);
      return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    },
    read: (text) => {
      const n = threeNumbers(text);
      return n && n[0] <= 360 && n[1] <= 100 && n[2] <= 100 ? hslToRgb(n[0], n[1] / 100, n[2] / 100) : null;
    },
  },
};
export const COLOR_FORMATS: ColorFormat[] = ["hex", "rgb", "hsl"];

/** A computed CSS colour (what the browser reports for a token) to its channels. */
function parseComputed(color: string): Rgb | null {
  const n = color.match(/[\d.]+/g);
  return n && n.length >= 3 ? (n.slice(0, 3).map((x) => Math.round(Number(x))) as Rgb) : null;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** A gradient from the person's colours, for an inline style. */
const gradient = (direction: string, stops: string[]) => `linear-gradient(${[direction, ...stops].join(", ")})`;

/** The full rainbow, red to red: the person's colour scale, not a token. */
const HUE_TRACK = gradient(
  "to right",
  [0, 60, 120, 180, 240, 300, 360].map((h) => `hsl(${h} 100% 50%)`),
);

/** A handle: the picked colour in a 16 circle, a 2px static/white edge inside. */
const handle =
  "ds-shadow absolute size-color-picker-handle rounded-color-picker-handle outline-none [--ds-edge:var(--shadow-color-picker-handle-edge)]";

// ---- Color Spectrum ----

export type ColorSpectrumProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** 0 to 360. */
  hue: number;
  /** 0 to 1, left to right. */
  saturation: number;
  /** 0 to 1. The black fade covers only the lower part of the square
   *  (148 of 232), so the top of the square is full brightness. */
  brightness: number;
  onChange?: (saturation: number, brightness: number) => void;
  /** Shows the handle's focus on the Components page. */
  "data-force"?: "focus";
};

export function ColorSpectrum({ hue, saturation, brightness, onChange, className, "data-force": force, ...props }: ColorSpectrumProps) {
  const box = React.useRef<HTMLDivElement>(null);
  const fade = React.useRef<HTMLSpanElement>(null);
  // The fade's share of the height, read from the tokens once drawn.
  const [ratio, setRatio] = React.useState(1);
  const [top, setTop] = React.useState<number>();
  React.useLayoutEffect(() => {
    const b = box.current;
    const f = fade.current;
    if (b && f && b.clientHeight) setRatio(f.offsetHeight / b.clientHeight);
  }, []);

  const zone = 1 - ratio; // the top part, full brightness
  const brightnessAt = (t: number) => (t <= zone ? 1 : 1 - (t - zone) / ratio);
  const topFor = (v: number) => (v >= 1 ? 0 : zone + (1 - v) * ratio);
  // Keep where the handle was put while it still gives this brightness.
  const shownTop = top != null && Math.abs(brightnessAt(top) - brightness) < 0.005 ? top : topFor(brightness);
  const colour = toHex(hsvToRgb(hue, saturation, brightness));

  const put = (x: number, t: number) => {
    setTop(t);
    onChange?.(clamp01(x), brightnessAt(clamp01(t)));
  };
  const fromPointer = (e: { clientX: number; clientY: number }) => {
    const r = box.current?.getBoundingClientRect();
    if (r) put((e.clientX - r.left) / r.width, clamp01((e.clientY - r.top) / r.height));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    (e.currentTarget.querySelector("[role=slider]") as HTMLElement | null)?.focus({ preventScroll: true });
    fromPointer(e);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    put(saturation + m[0], clamp01(shownTop + m[1]));
  };

  return (
    <div
      ref={box}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && fromPointer(e)}
      className={cn("relative h-color-picker-spectrum w-full shrink-0 cursor-crosshair touch-none select-none", className)}
      {...props}
    >
      {/* The picked hue, fading to white on the left and to black at the bottom. */}
      <div className="absolute inset-space-0 overflow-hidden rounded-color-picker-spectrum" style={{ backgroundColor: `hsl(${hue} 100% 50%)` }}>
        <span className="absolute inset-space-0 bg-(image:--color-picker-spectrum-white-fade)" />
        <span ref={fade} className="absolute inset-x-space-0 bottom-space-0 h-color-picker-spectrum-fade bg-(image:--color-picker-spectrum-black-fade)" />
      </div>
      <span
        role="slider"
        tabIndex={0}
        aria-label="Shade and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(saturation * 100)}
        aria-valuetext={`Shade ${Math.round(saturation * 100)}%, brightness ${Math.round(brightness * 100)}%`}
        data-force={force}
        onKeyDown={onKeyDown}
        className={cn(handle, "-mt-color-picker-handle-half -ml-color-picker-handle-half ds-focus:ring-focus-neutral")}
        style={{ left: `${saturation * 100}%`, top: `${shownTop * 100}%`, backgroundColor: `#${colour}` }}
      />
    </div>
  );
}

// ---- Color Sliders ----

export type ColorSliderProps = {
  kind: "hue" | "opacity";
  /** Hue 0 to 360, opacity 0 to 100. */
  value: number;
  onValueChange?: (value: number) => void;
  /** The picked colour as a hex ("335CFF"): the handle's fill, and the opacity fade's end. */
  color: string;
  "aria-label"?: string;
  "data-force"?: "focus";
  className?: string;
};

export function ColorSlider({ kind, value, onValueChange, color, className, "aria-label": label, "data-force": force }: ColorSliderProps) {
  return (
    <SliderPrimitive.Root
      value={[value]}
      onValueChange={([v]) => onValueChange?.(v)}
      min={0}
      max={kind === "hue" ? 360 : 100}
      step={1}
      className={cn("relative flex h-color-picker-slider w-full shrink-0 touch-none select-none items-center", className)}
    >
      {kind === "hue" ? (
        <SliderPrimitive.Track
          className="relative h-color-picker-track w-full grow overflow-hidden rounded-color-picker-track"
          style={{ backgroundImage: HUE_TRACK }}
        />
      ) : (
        // The checkerboard on white (the Figma's typed-in white as static/white), under a fade to the picked colour.
        <SliderPrimitive.Track className="relative h-color-picker-track w-full grow overflow-hidden rounded-color-picker-track bg-static-white bg-(image:--color-picker-checker) bg-size-(--color-picker-checker-tile)">
          <span aria-hidden className="absolute inset-space-0" style={{ backgroundImage: gradient("to right", ["transparent", `#${color}`]) }} />
        </SliderPrimitive.Track>
      )}
      {/* The thumb takes no room, so the handle's centre sits on the value, as on the Slider. */}
      <SliderPrimitive.Thumb
        aria-label={label ?? (kind === "hue" ? "Hue" : "Opacity")}
        data-force={force}
        className="group/handle relative block size-space-0 outline-none"
      >
        <span
          aria-hidden
          className={cn(handle, "-top-color-picker-handle-half -left-color-picker-handle-half cursor-grab [--ds-lift:var(--shadow-color-picker-handle)] group-ds-focus/handle:ring-focus-neutral")}
          style={{ backgroundColor: `#${color}` }}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
}

// ---- Color Dots ----

export type ColorDotColor = "gray" | "blue" | "orange" | "red" | "green";

/** Each dot is its state token's base. Written out so Tailwind sees them. */
const DOT: Record<ColorDotColor, { label: string; colour: string }> = {
  gray: { label: "Gray", colour: "text-state-faded-base" },
  blue: { label: "Blue", colour: "text-state-information-base" },
  orange: { label: "Orange", colour: "text-state-warning-base" },
  red: { label: "Red", colour: "text-state-error-base" },
  green: { label: "Green", colour: "text-state-success-base" },
};

export const COLOR_DOTS: ColorDotColor[] = ["gray", "blue", "orange", "red", "green"];
export const colorDotLabel = (c: ColorDotColor) => DOT[c].label;

export type ColorDotsProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "onValueChange" | "value" | "defaultValue"> & {
  colors?: ColorDotColor[];
  value?: ColorDotColor | "";
  defaultValue?: ColorDotColor;
  onValueChange?: (color: ColorDotColor) => void;
  /** Called with the dot's colour as it is drawn now (its token in this theme). */
  onPick?: (color: ColorDotColor, hex: string) => void;
  /** Dots that cannot be picked. */
  disabledColors?: ColorDotColor[];
  /** Shows a state on one dot (the Components page). */
  force?: { color: ColorDotColor; state: "hover" | "focus" };
};

export function ColorDots({ colors = COLOR_DOTS, value, defaultValue, onValueChange, onPick, disabledColors, force, className, ...props }: ColorDotsProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v as ColorDotColor)}
      orientation="horizontal"
      className={cn("flex flex-wrap gap-color-picker-dots-gap", className)}
      {...props}
    >
      {colors.map((c) => (
        <RadioGroupPrimitive.Item
          key={c}
          value={c}
          aria-label={DOT[c].label}
          disabled={disabledColors?.includes(c)}
          data-force={force?.color === c ? force.state : undefined}
          onClick={(e) => {
            const rgb = parseComputed(getComputedStyle(e.currentTarget).color);
            if (rgb) onPick?.(c, toHex(rgb));
          }}
          className={cn(
            "ds-shadow flex size-color-picker-dot-space shrink-0 cursor-pointer items-center justify-center rounded-color-picker-dot outline-none",
            "ds-focus:ring-focus-neutral disabled:cursor-not-allowed disabled:text-bg-soft-200",
            // Hover shrinks the dot to 14; a picked dot keeps its 16.
            "ds-hover:data-[state=unchecked]:*:size-color-picker-dot-hover",
            "data-[state=checked]:*:ds-shadow data-[state=checked]:*:[--ds-lift:var(--shadow-color-picker-dot-selected)]",
            DOT[c].colour,
          )}
        >
          <span aria-hidden className="size-color-picker-dot rounded-color-picker-dot bg-current transition-[width,height] duration-150" />
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

// ---- The value field ----

type EyeDropperResult = { sRGBHex: string };
type EyeDropperCtor = new () => { open: () => Promise<EyeDropperResult> };

/** The browser's EyeDropper, where it has one (only some browsers do). */
function useEyeDropper() {
  const [ctor, setCtor] = React.useState<EyeDropperCtor>();
  React.useEffect(() => {
    const found = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
    if (found) setCtor(() => found);
  }, []);
  return ctor;
}

/** The format menu: the format's name in label-sm and a 20 down arrow, 2
 *  apart, opening a Dropdown with Hex, RGB and HSL (the page's proposal; the
 *  Figma draws no menu). Keyboard focus: the Neutral ring. */
function FormatMenu({ format, onFormatChange, force }: { format: ColorFormat; onFormatChange?: (f: ColorFormat) => void; force?: "focus" }) {
  return (
    <Dropdown>
      <DropdownTrigger
        aria-label={`Colour format, ${FORMATS[format].label}`}
        data-force={force}
        className="ds-shadow flex cursor-pointer items-center gap-color-picker-format-gap self-start rounded-color-picker-format text-label-sm text-text-strong-950 outline-none ds-focus:ring-focus-neutral"
      >
        {FORMATS[format].label}
        <span aria-hidden className="flex text-icon-soft-400 [&_svg]:size-color-picker-format-icon">
          <ChevronDownIcon />
        </span>
      </DropdownTrigger>
      <DropdownContent width="content">
        <DropdownMenuPrimitive.RadioGroup value={format} onValueChange={(v) => onFormatChange?.(v as ColorFormat)}>
          {COLOR_FORMATS.map((f) => (
            <DropdownMenuPrimitive.RadioItem key={f} value={f} asChild>
              {/* A Dropdown Item, Small; the picked one has the check, as in a Select. */}
              <DropdownRow
                label={FORMATS[f].label}
                rightIcon={
                  <DropdownMenuPrimitive.ItemIndicator>
                    <CheckIcon />
                  </DropdownMenuPrimitive.ItemIndicator>
                }
              />
            </DropdownMenuPrimitive.RadioItem>
          ))}
        </DropdownMenuPrimitive.RadioGroup>
      </DropdownContent>
    </Dropdown>
  );
}

export type ColorValueFieldProps = {
  /** The picked colour as a hex, "335CFF". */
  hex: string;
  /** 0 to 100. */
  alpha: number;
  format?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  /** A colour typed in (in any format) or picked with the eyedropper, as a hex. */
  onHexChange?: (hex: string) => void;
  onAlphaChange?: (alpha: number) => void;
  /** Shows the Error look (it also shows on its own when the typed value is not a colour). */
  error?: boolean;
  /** Shows a state on the Components page: the field's hover or focus, or the format menu's focus. */
  "data-force"?: "hover" | "focus" | "format-focus";
  className?: string;
};

/** The format menu, 4 above the field: eyedropper (32), value (fills the
 *  space) and opacity (56), a 1px line between. The field is the Text
 *  Input's X-Small without its shadow, with its looks. */
export function ColorValueField({
  hex,
  alpha,
  format = "hex",
  onFormatChange,
  onHexChange,
  onAlphaChange,
  error,
  className,
  "data-force": force,
}: ColorValueFieldProps) {
  const eyeDropper = useEyeDropper();
  // What is being typed, kept while the colour is still the one it gave.
  const [draft, setDraft] = React.useState<{ text: string; forHex: string; bad: boolean }>();
  const [alphaDraft, setAlphaDraft] = React.useState<string>();
  const rgb = parseHex(hex) ?? [0, 0, 0];
  const live = draft?.forHex === hex ? draft : undefined;
  const shown = live?.text ?? FORMATS[format].show(rgb);
  const fieldForce = force === "hover" || force === "focus" ? force : undefined;
  const { look, setHasFocus } = useFieldLook({ error: error || live?.bad, force: fieldForce, value: shown });

  return (
    <div className={cn("flex w-full flex-col gap-color-picker-format-below", className)}>
      <FormatMenu
        format={format}
        onFormatChange={(f) => {
          setDraft(undefined);
          onFormatChange?.(f);
        }}
        force={force === "format-focus" ? "focus" : undefined}
      />
      <div
        data-force={fieldForce === "hover" ? "hover" : undefined}
        onFocus={() => setHasFocus(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHasFocus(false);
        }}
        // The Text Input's looks, without its shadow (page, "The value field").
        className={cn("group/field flex h-color-picker-field w-full items-stretch rounded-color-picker-field", fieldLookVariants({ look }), "lift-none")}
      >
        {eyeDropper && (
          <button
            type="button"
            aria-label="Pick a colour from the screen"
            onClick={async () => {
              try {
                const picked = parseHex((await new eyeDropper().open()).sRGBHex);
                if (picked) {
                  setDraft(undefined);
                  onHexChange?.(toHex(picked));
                }
              } catch {
                // The person closed the eyedropper.
              }
            }}
            // Focus shows on the whole field (the Text Input's Focus), as for the two inputs.
            className="ds-shadow flex w-color-picker-eyedropper shrink-0 cursor-pointer items-center justify-center p-color-picker-eyedropper-pad text-icon-sub-600 outline-none [--ds-edge:var(--shadow-color-picker-line-right)] [&_svg]:size-color-picker-eyedropper-icon"
          >
            <EyedropperIcon />
          </button>
        )}
        <input
          aria-label={`${FORMATS[format].label} value`}
          aria-invalid={look === "error" || look === "error-focus" || undefined}
          spellCheck={false}
          autoComplete="off"
          value={shown}
          onChange={(e) => {
            const text = format === "hex" ? e.target.value.replace(/^#/, "").toUpperCase() : e.target.value;
            const read = FORMATS[format].read(text);
            const next = read ? toHex(read) : hex;
            setDraft({ text, forHex: next, bad: false });
            if (read && next !== hex) onHexChange?.(next);
          }}
          onBlur={() => {
            if (!live) return;
            // A colour: show it written the format's way. Not a colour: the Error look, until it is.
            if (FORMATS[format].read(live.text)) setDraft(undefined);
            else setDraft({ ...live, bad: true });
          }}
          className="ds-shadow min-w-0 flex-1 bg-transparent px-color-picker-value-x py-color-picker-value-y text-paragraph-sm text-text-strong-950 outline-none [--ds-edge:var(--shadow-color-picker-line-right)]"
        />
        <input
          aria-label="Opacity"
          inputMode="numeric"
          autoComplete="off"
          value={alphaDraft ?? `${alpha}%`}
          onChange={(e) => {
            setAlphaDraft(e.target.value);
            const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
            if (!Number.isNaN(n)) onAlphaChange?.(Math.min(100, Math.max(0, n)));
          }}
          onBlur={() => setAlphaDraft(undefined)}
          className="w-color-picker-opacity shrink-0 bg-transparent px-color-picker-value-x py-color-picker-value-y text-paragraph-sm text-text-sub-600 outline-none"
        />
      </div>
    </div>
  );
}

// ---- Color Picker ----

export type ColorPickerProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The colour to start from: its hex ("335CFF") and opacity (0 to 100). */
  defaultValue?: ColorValue;
  onValueChange?: (value: ColorValue) => void;
  /** The dots under "Recommended Colors". */
  recommended?: ColorDotColor[];
  /** The format the value field starts in. */
  defaultFormat?: ColorFormat;
};

export function ColorPicker({ defaultValue, onValueChange, recommended = COLOR_DOTS, defaultFormat = "hex", className, ...props }: ColorPickerProps) {
  const [hsva, setHsva] = React.useState(() => {
    const rgb = defaultValue ? parseHex(defaultValue.hex) : null;
    // The Figma's example, 335CFF, at full opacity.
    return rgb ? { ...rgbToHsv(rgb), a: defaultValue?.alpha ?? 100 } : { h: 228, s: 0.8, v: 1, a: defaultValue?.alpha ?? 100 };
  });
  const [dot, setDot] = React.useState<ColorDotColor | "">("");
  const [format, setFormat] = React.useState<ColorFormat>(defaultFormat);

  const hex = toHex(hsvToRgb(hsva.h, hsva.s, hsva.v));

  const change = (next: Partial<typeof hsva>, keepDot = false) => {
    const merged = { ...hsva, ...next };
    setHsva(merged);
    if (!keepDot) setDot("");
    onValueChange?.({ hex: toHex(hsvToRgb(merged.h, merged.s, merged.v)), alpha: merged.a });
  };
  const fromRgb = (rgb: Rgb, keepDot = false) => {
    const next = rgbToHsv(rgb);
    // A grey has no hue: keep the one on the slider.
    change(next.s === 0 ? { s: 0, v: next.v } : next, keepDot);
  };

  return (
    <div
      className={cn(
        "ds-shadow flex w-color-picker shrink-0 flex-col rounded-color-picker bg-bg-white-0 edge-stroke-soft-200 [--ds-lift:var(--shadow-color-picker-panel)]",
        className,
      )}
      {...props}
    >
      <div className="ds-shadow flex flex-col gap-color-picker-top-gap p-color-picker-pad [--ds-edge:var(--shadow-color-picker-line-bottom)]">
        <ColorSpectrum hue={hsva.h} saturation={hsva.s} brightness={hsva.v} onChange={(s, v) => change({ s, v })} />
        <ColorSlider kind="hue" value={Math.round(hsva.h)} onValueChange={(h) => change({ h })} color={hex} />
        <ColorSlider kind="opacity" value={hsva.a} onValueChange={(a) => change({ a }, true)} color={hex} />
        <ColorValueField
          hex={hex}
          alpha={hsva.a}
          format={format}
          onFormatChange={setFormat}
          onHexChange={(h) => {
            const rgb = parseHex(h);
            if (rgb) fromRgb(rgb);
          }}
          onAlphaChange={(a) => change({ a }, true)}
        />
      </div>

      <div className="flex flex-col gap-color-picker-bottom-gap p-color-picker-pad">
        <span className="text-paragraph-xs text-text-sub-600">Recommended Colors</span>
        <ColorDots
          aria-label="Recommended colors"
          colors={recommended}
          value={dot}
          onValueChange={setDot}
          onPick={(c, h) => {
            const rgb = parseHex(h);
            if (rgb) fromRgb(rgb, true);
            setDot(c);
          }}
        />
      </div>
    </div>
  );
}
