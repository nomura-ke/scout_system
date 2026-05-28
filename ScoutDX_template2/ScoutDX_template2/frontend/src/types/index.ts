export interface ScoutEntity {
  id?: string
  createdAt?: string
  creator: string
  title: string
  body: string
  status?: ScoutStatus
}

export interface GeneratedScoutSample {
  body: string
}

export type ScoutStatus = 'DRAFT' | 'APPROVED' | 'REMANDED'

export type UserRole = 'SCOUT_USER' | 'SALES_LEADER'

export interface LoginRequest {
  userId: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: string
}
