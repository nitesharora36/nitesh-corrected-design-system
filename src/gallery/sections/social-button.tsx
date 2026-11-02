"use client";

import { SocialButton, type SocialBrand } from "@/components/ds/social-button";
import { Group, Labelled } from "../parts";

const BRANDS: { id: SocialBrand; name: string }[] = [
  { id: "apple", name: "Apple" },
  { id: "x", name: "X" },
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "github", name: "GitHub" },
  { id: "dropbox", name: "Dropbox" },
];
const VARIANTS = [
  { id: "filled", label: "Filled" },
  { id: "stroke", label: "Stroke" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus" },
  { id: "disabled", label: "Disabled" },
] as const;

const force = (state: string) => (state === "hover" || state === "focus" ? state : undefined);

export function SocialButtonSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <div className="text-paragraph-xs text-text-soft-400">
        The logos are stand-in marks in each brand&apos;s colours, until the brands&apos; own artwork is added. On dark,
        Filled Apple and X take the Stroke look (the page&apos;s proposal).
      </div>

      {VARIANTS.map((variant) => (
        <Group key={variant.id} label={`${variant.label}, every brand and state`}>
          <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
            {BRANDS.map((brand) =>
              STATES.map((state) => (
                <Labelled key={`${brand.id}-${state.id}`} label={`${brand.name}, ${state.label}`}>
                  <SocialButton
                    brand={brand.id}
                    variant={variant.id}
                    data-force={force(state.id)}
                    disabled={state.id === "disabled"}
                  >
                    {`Continue with ${brand.name}`}
                  </SocialButton>
                </Labelled>
              )),
            )}
          </div>
        </Group>
      ))}

      <Group label="Icon only, every brand">
        <div className="flex flex-col gap-space-16">
          {VARIANTS.map((variant) => (
            <Labelled key={variant.id} label={variant.label}>
              <div className="flex flex-wrap items-center gap-space-12">
                {BRANDS.map((brand) => (
                  <SocialButton
                    key={brand.id}
                    brand={brand.id}
                    variant={variant.id}
                    aria-label={`Continue with ${brand.name}`}
                  />
                ))}
              </div>
            </Labelled>
          ))}
        </div>
      </Group>
    </div>
  );
}
