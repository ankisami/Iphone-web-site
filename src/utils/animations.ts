import gsap from "gsap";

import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap = (
  target: gsap.TweenTarget,
  animationProps: gsap.TweenVars,
  scrollProps: ScrollTrigger.Vars
) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target as Element,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline,
  rotationRef: React.RefObject<{ rotation: { y: number } }>,
  rotationState: number,
  firstTarget: gsap.TweenTarget,
  secondTarget: gsap.TweenTarget,
  animationProps: gsap.TweenVars
) => {
  if (rotationRef.current) {
    timeline.to(rotationRef.current.rotation, {
      y: rotationState,
      duration: 1,
      ease: "power2.inOut",
    });
  }

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
