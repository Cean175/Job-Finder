export interface Job {
    id: string;
    title: string;
    company: string;
    salary: string;
    jobType?: string;
    workModel?: string;
    seniority?: string;
    location: string;
    
  }
  
  export interface Application {
    id: string;
    jobId: string;
    name: string;
    email: string;
    phone: string;
    coverLetter: string;
    appliedAt: Date;
  }
  
  export type RootStackParamList = {
    Home: undefined;
    SavedJobs: { savedJobs: string[]; jobs: Job[] };
  };