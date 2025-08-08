export interface ExternalJob {
  details: JobDetails;
  location: JobLocation;
  employer: JobEmployer;
  compensation: JobCompensation;
  requirements: JobRequirements;
}

export interface JobDetails {
  id: string;
  positionTitle: string;
  type: string;
  datePosted: Date;
  remote: boolean | null;
}

export interface JobLocation {
  city: string;
  state: string;
}

export interface JobEmployer {
  name: string;
  industry: string | null;
  website: string | null;
}

export interface JobCompensation {
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
}

export interface JobRequirements {
  skills: string[];
  experience: number | null;
}
