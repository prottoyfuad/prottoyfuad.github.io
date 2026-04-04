import type { TemplateVars } from './types';

// Replace {{KEY}} placeholders in a template string with values from vars.
export function fill(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in vars ? vars[key] : match
  );
}
