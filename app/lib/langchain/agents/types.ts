export interface NewsletterState {
  topic: string;
  docs: any[];
  draft: string;
  hallucinationScore: number;
  approved: boolean;
}