export interface Source2ApiResponse {
  status: string;
  data: JobsData;
}

export interface JobsData {
  jobsList: Record<string, JobItem>;
}

export interface JobItem {
  position: string;
  location: Location;
  compensation: Compensation;
  employer: Employer;
  requirements: Requirements;
  datePosted: string; // Date string e.g '2025-07-28'
}

export interface Location {
  city: string;
  state: string;
  remote: boolean;
}

export interface Compensation {
  min: number;
  max: number;
  currency: string; // could be enum like 'USD' | 'EUR'
}

export interface Employer {
  companyName: string;
  website: string;
}

export interface Requirements {
  experience: number; // in years
  technologies: string[];
}
