import * as React from 'react';

export const SkillPanel = () => {
  return (
    <div className="skill-panel">
      <button className="skill-btn" onKeyDown={(e) => console.log(e)}>
        skill 1
      </button>
      <button className="skill-btn">skill 2</button>
      <button className="skill-btn">skill 3</button>
    </div>
  );
};
