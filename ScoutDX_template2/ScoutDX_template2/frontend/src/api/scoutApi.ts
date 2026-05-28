import type { GeneratedScoutSample, LoginRequest, LoginResponse, ScoutEntity, UserRole } from '../types'
import { apiClient } from './client'

export async function fetchScouts(): Promise<ScoutEntity[]> {
  const { data } = await apiClient.get<ScoutEntity[]>('/api/scouts')
  return data
}

export async function createScout(payload: ScoutEntity): Promise<ScoutEntity> {
  const { data } = await apiClient.post<ScoutEntity>('/api/scouts', payload)
  return data
}

export async function approveScout(id: string): Promise<ScoutEntity> {
  const { data } = await apiClient.patch<ScoutEntity>(`/api/approvals/${id}/approve`)
  return data
}

export async function remandScout(id: string): Promise<ScoutEntity> {
  const { data } = await apiClient.patch<ScoutEntity>(`/api/approvals/${id}/remand`)
  return data
}

export async function generateScoutBody(): Promise<GeneratedScoutSample> {
  const { data } = await apiClient.get<GeneratedScoutSample>('/api/scouts/generate')
  return data
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', payload)
  return data
}

export async function selectRole(role: UserRole): Promise<{ role: UserRole }> {
  const { data } = await apiClient.post<{ role: UserRole }>('/api/auth/role', { role })
  return data
}
