"use client";

import { useState } from "react";

import { LinkButton } from "@/components/ds/link-button";
import {
  RatingBar,
  RatingBarArea,
  RatingCell,
  RatingItem,
  RatingReview,
  type RatingBarType,
  type RatingLook,
  type RatingType,
} from "@/components/ds/rating";
import { Group, Labelled } from "../parts";

const TYPES: { id: RatingType; label: string }[] = [
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
];
const LOOKS: { id: RatingLook; label: string }[] = [
  { id: "empty-line", label: "Empty Line" },
  { id: "empty-filled", label: "Empty Filled" },
  { id: "half", label: "Half" },
  { id: "full", label: "Full" },
];
const BAR_TYPES: { id: RatingBarType; label: string }[] = [
  { id: "emoji", label: "Emoji" },
  { id: "number", label: "Number" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
];
const ALIGNS = [
  { id: "only", label: "Only Ratings" },
  { id: "vertical", label: "Vertical" },
  { id: "horizontal", label: "Horizontal" },
] as const;
const SCORES = [0, 1, 2.5, 4, 5];

const reviews = (
  <LinkButton href="#rating" variant="gray" size="md" underline>
    18 reviews
  </LinkButton>
);

export function RatingSection() {
  const [cell, setCell] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number | undefined>>({});

  return (
    <div className="flex flex-col gap-space-40">
      <div className="text-paragraph-xs text-text-soft-400">
        The filled star waits for Yellow (state/away, not in the palette yet): until then it uses state/warning/base,
        our Amber. The star and heart are Hugeicons&apos; shapes, filled for Empty Filled, Half and Full; the emojis are
        the system&apos;s. Both wait on Nitesh (the page&apos;s Open). Built as the page proposes: a score fills every
        star or heart up to it, Hover fills up to the pointer, focus shows the Neutral ring, and the writing box takes
        the Text Area&apos;s states. No Disabled look (the page asks whether one is needed).
      </div>

      <Group label="Rating Item, every type and look, 20 and the cell's 32">
        <div className="flex flex-col gap-space-16">
          {TYPES.map((t) => (
            <div key={t.id} className="flex flex-wrap items-end gap-space-24">
              {LOOKS.map((l) => (
                <Labelled key={l.id} label={`${t.label}, ${l.label}`}>
                  <div className="flex items-end gap-space-8">
                    <RatingItem type={t.id} look={l.id} />
                    <RatingItem type={t.id} look={l.id} size="lg" />
                  </div>
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Rating & Review, every type and alignment, words and link on">
        <div className="grid grid-cols-[repeat(3,max-content)] items-start gap-x-space-40 gap-y-space-24">
          {TYPES.map((t) =>
            ALIGNS.map((a) => (
              <Labelled key={`${t.id}-${a.id}`} label={`${t.label}, ${a.label}`}>
                <RatingReview type={t.id} value={4.5} align={a.id} words="4.5 ∙ 5.2K Ratings" link={reviews} />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Rating & Review, words or link alone">
        <div className="flex flex-wrap items-start gap-space-40">
          <Labelled label="Horizontal, words only">
            <RatingReview value={4.5} align="horizontal" words="4.5 ∙ 5.2K Ratings" />
          </Labelled>
          <Labelled label="Horizontal, link only">
            <RatingReview value={4.5} align="horizontal" link={reviews} />
          </Labelled>
          <Labelled label="Vertical, words only">
            <RatingReview value={4.5} align="vertical" words="4.5 ∙ 5.2K Ratings" />
          </Labelled>
          <Labelled label="Vertical, link only">
            <RatingReview type="heart" value={4.5} align="vertical" link={reviews} />
          </Labelled>
        </div>
      </Group>

      <Group label="Rating & Review, Only Ratings, scores (the read-only rating a table cell shows)">
        <div className="flex flex-wrap items-start gap-space-32">
          {SCORES.map((s) => (
            <Labelled key={s} label={`${s} of 5`}>
              <RatingReview value={s} />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Rating Cell, every type and state (click the last one)">
        <div className="flex flex-col gap-space-16">
          {TYPES.map((t) => (
            <div key={t.id} className="flex flex-wrap items-start gap-space-24">
              <Labelled label={`${t.label}, Default`}>
                <RatingCell type={t.id} aria-label={`Rate with a ${t.id}`} />
              </Labelled>
              <Labelled label={`${t.label}, Hover`}>
                <RatingCell type={t.id} data-force="hover" aria-label={`Rate with a ${t.id}`} />
              </Labelled>
              <Labelled label={`${t.label}, Focus (proposed)`}>
                <RatingCell type={t.id} data-force="focus" aria-label={`Rate with a ${t.id}`} />
              </Labelled>
              <Labelled label={`${t.label}, Selected`}>
                <RatingCell type={t.id} selected aria-label={`Rate with a ${t.id}`} />
              </Labelled>
              <Labelled label="Try it">
                <RatingCell
                  type={t.id}
                  selected={!!cell[t.id]}
                  onClick={() => setCell((c) => ({ ...c, [t.id]: !c[t.id] }))}
                  aria-label={`Rate with a ${t.id}`}
                />
              </Labelled>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Rating Bar, every type and cell state (the last one in each row can be clicked)">
        <div className="flex flex-col gap-space-16">
          {BAR_TYPES.map((t) => (
            <div key={t.id} className="flex flex-wrap items-start gap-space-24">
              <Labelled label={`${t.label}, none picked`}>
                <div className="w-rating-figma">
                  <RatingBar type={t.id} aria-label={`${t.label} rating`} />
                </div>
              </Labelled>
              <Labelled label={`${t.label}, Hover on the third`}>
                <div className="w-rating-figma">
                  <RatingBar type={t.id} hoverValue={3} aria-label={`${t.label} rating`} />
                </div>
              </Labelled>
              <Labelled label={`${t.label}, Focus on the third (proposed)`}>
                <div className="w-rating-figma">
                  <RatingBar type={t.id} focusValue={3} aria-label={`${t.label} rating`} />
                </div>
              </Labelled>
              <Labelled label={`${t.label}, 3 picked`}>
                <div className="w-rating-figma">
                  <RatingBar type={t.id} defaultValue={3} aria-label={`${t.label} rating`} />
                </div>
              </Labelled>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Try it: Rating Bar Area, every type (pick a score, then write why)">
        <div className="flex flex-wrap items-start gap-space-24">
          {BAR_TYPES.map((t) => (
            <Labelled key={t.id} label={`${t.label}${scores[t.id] ? `, ${scores[t.id]} picked` : ""}`}>
              <div className="w-rating-figma">
                <RatingBarArea
                  type={t.id}
                  value={scores[t.id]}
                  onValueChange={(v) => setScores((s) => ({ ...s, [t.id]: v }))}
                  aria-label={`${t.label} rating`}
                />
              </div>
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Rating Bar Area, the writing box in the Text Area's states (proposed)">
        <div className="flex flex-wrap items-start gap-space-24">
          <Labelled label="Default">
            <div className="w-rating-figma">
              <RatingBarArea defaultValue={4} aria-label="Star rating" />
            </div>
          </Labelled>
          <Labelled label="Hover">
            <div className="w-rating-figma">
              <RatingBarArea defaultValue={4} data-force="hover" aria-label="Star rating" />
            </div>
          </Labelled>
          <Labelled label="Focus">
            <div className="w-rating-figma">
              <RatingBarArea defaultValue={4} data-force="focus" aria-label="Star rating" />
            </div>
          </Labelled>
          <Labelled label="Filled">
            <div className="w-rating-figma">
              <RatingBarArea defaultValue={4} defaultText="Clear answer, and the sources were right." aria-label="Star rating" />
            </div>
          </Labelled>
          <Labelled label="Error">
            <div className="w-rating-figma">
              <RatingBarArea defaultValue={4} error defaultText="Clear answer, and the sources were right." aria-label="Star rating" />
            </div>
          </Labelled>
          <Labelled label="Error, focused">
            <div className="w-rating-figma">
              <RatingBarArea defaultValue={4} error data-force="focus" defaultText="Clear answer, and the sources were right." aria-label="Star rating" />
            </div>
          </Labelled>
          <Labelled label="With a limit (type to see the count)">
            <div className="w-rating-figma">
              <RatingBarArea type="number" defaultValue={4} limit={200} aria-label="Number rating" />
            </div>
          </Labelled>
          <Labelled label="Over the limit">
            <div className="w-rating-figma">
              <RatingBarArea type="number" defaultValue={2} limit={20} defaultText="The answer missed the second question." aria-label="Number rating" />
            </div>
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
