// This file acts as the main "blueprint" for the HT form.
// Its only job is to import all the sections and assemble them.

import { section1Fields } from './section1';

// the final structure of our multi-step form here.
export const htFormSteps = [
  {
    label: 'Static & Default Settings',
    fields: section1Fields // Use the imported fields
  },
  {
    label: 'Frequency',
    fields: [] // We will replace this with section2Fields later
  },
  {
    label: ' Load Current',
    fields: []
  },
  {
    label: 'Section 4',
    fields: []
  },
  {
    label: 'Section 5',
    fields: []
  }
];
