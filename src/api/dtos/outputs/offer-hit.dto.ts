export interface OfferHitDTO {
  objectID: string;
  name: string;
  isNew: boolean;

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
