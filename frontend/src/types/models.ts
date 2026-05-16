export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CourseDto = {
  id: string;
  name: string;
  description: string;
  duration: string;
  requirements: string;
  slots: number;
  status: string;
};

export type ApplicationDto = {
  id: string;
  fullName: string;
  age: number;
  cpf: string;
  discordTag: string;
  discordUserId: string | null;
  email: string;
  phone: string;
  city: string;
  state: string;
  desiredCourse: string;
  experience: string | null;
  motivation: string;
  acceptedTerms: boolean;
  status: ApplicationStatus;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course?: CourseDto;
};

export type AdminStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byCourse: { courseId: string; title: string; count: number }[];
  latest: ApplicationDto[];
};

export type Paginated<T> = { items: T[]; total: number; page: number; pageSize: number };

export type AdminLogRow = {
  id: string;
  action: string;
  targetId: string | null;
  createdAt: string;
  admin: { id: string; username: string } | null;
};
