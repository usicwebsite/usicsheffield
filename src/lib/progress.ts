// Define the structure of a step
export interface Step {
  id: string;
  title: string;
  sectionId: string;
}

// Define the structure of a section
export interface Section {
  id: string;
  title: string;
  steps: Step[];
}

// Get all steps from all sections
export function getAllSteps(sections: Section[]): Step[] {
  return sections.flatMap(section => section.steps);
}

// Get steps for a specific section
export function getStepsForSection(sections: Section[], sectionId: string): Step[] {
  const section = sections.find(s => s.id === sectionId);
  return section ? section.steps : [];
}

// Get the next step after the current one
export function getNextStep(sections: Section[], currentStepId: string): Step | null {
  const allSteps = getAllSteps(sections);
  const currentIndex = allSteps.findIndex(step => step.id === currentStepId);
  
  if (currentIndex === -1 || currentIndex === allSteps.length - 1) {
    return null;
  }
  
  return allSteps[currentIndex + 1];
}

// Get the previous step before the current one
export function getPrevStep(sections: Section[], currentStepId: string): Step | null {
  const allSteps = getAllSteps(sections);
  const currentIndex = allSteps.findIndex(step => step.id === currentStepId);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return allSteps[currentIndex - 1];
}

// Check if a step is completed
export function isStepCompleted(completedSteps: string[], stepId: string): boolean {
  return completedSteps.includes(stepId);
}

// Calculate progress percentage for a section
export function calculateSectionProgress(
  completedSteps: string[],
  section: Section
): number {
  if (section.steps.length === 0) return 0;
  
  const completedCount = section.steps.filter(step => 
    completedSteps.includes(step.id)
  ).length;
  
  return Math.round((completedCount / section.steps.length) * 100);
}

// Calculate overall progress
export function calculateOverallProgress(
  completedSteps: string[],
  sections: Section[]
): number {
  const allSteps = getAllSteps(sections);
  if (allSteps.length === 0) return 0;
  
  return Math.round((completedSteps.length / allSteps.length) * 100);
} 