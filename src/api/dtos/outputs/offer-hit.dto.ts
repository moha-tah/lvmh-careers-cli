export interface OfferHitDTO {
  objectID: string;
  name: string;
  publicationTimestamp: number;

  maison: string;
  city?: string;
  country?: string;

  function: string;
  salary: string | null;

  contract: string;
  requiredExperience: string;
  workingMode: string;
  fullTimePartTime: string;
}
