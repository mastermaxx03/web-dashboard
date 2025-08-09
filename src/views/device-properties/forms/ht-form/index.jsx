// This file acts as the main "blueprint" for the HT form.
// Its only job is to import all the sections and assemble them.

import { section1Fields } from './section1';
import { section2Fields } from './section2';
import { section3Fields } from './section3';
import { section4Fields } from './section4';
import { section5Fields } from './section5';

// the final structure of our multi-step form here.
export const htFormSteps = [
  {
    label: 'Static & Default Settings',
    fields: section1Fields // Use the imported fields
  },
  {
    label: 'Frequency',
    fields: section2Fields // We will replace this with section2Fields later
  },
  {
    label: ' Load Current',
    fields: section3Fields
  },
  {
    label: 'Power',
    fields: section4Fields
  },
  {
    label: 'Energy',
    fields: section5Fields // This will be defined later
  }
];
