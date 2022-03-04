import { AnimationAction } from 'three';

export const setAnimationWeight = (action: AnimationAction, weight: number) => {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
};
