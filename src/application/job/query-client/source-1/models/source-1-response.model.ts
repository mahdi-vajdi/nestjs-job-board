export interface Source1ApiResponse {
  metadata: Metadata;
  jobs: Job[];
}

export interface Metadata {
  requestId: string;
  timestamp: string; // ISO Date string
}

export interface Job {
  jobId: string;
  title: string;
  details: JobDetails;
  company: Company;
  skills: string[];
  postedDate: string; // ISO Date string
}

export interface JobDetails {
  location: string;
  type: string;
  salaryRange: string;
}

export interface Company {
  name: string;
  industry: string;
}
