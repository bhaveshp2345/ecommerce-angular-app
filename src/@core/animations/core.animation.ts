import {
  trigger,
  transition,
  style,
  query,
  animate,
} from "@angular/animations";

// Animation: FadeIn
export const fadeIn = trigger("fadeIn", [
  transition("* <=> *", [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          left: 0,
          width: "100%",
          paddingRight: "2rem",
          paddingLeft: "2rem",
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      ":enter",
      [
        animate(
          "500ms ease",
          style({ opacity: 1, paddingRight: "2rem", paddingLeft: "2rem" })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
]);
