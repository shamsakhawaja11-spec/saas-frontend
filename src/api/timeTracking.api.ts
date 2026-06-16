import api from './axios';
import type{ TimeEntry, CreateTimeEntryDto, UpdateTimeEntryDto, TotalMinutes } from '../types/timeEntry.types';

export const timeTrackingApi = {

  create: async (payload: CreateTimeEntryDto): Promise<TimeEntry> => {
    const { data } = await api.post('/time-entries', payload);
    return data;
  },

  getByTask: async (taskId: string): Promise<TimeEntry[]> => {
    const { data } = await api.get(`/time-entries/task/${taskId}`);
    return data;
  },

  getMyEntries: async (): Promise<TimeEntry[]> => {
    const { data } = await api.get('/time-entries/my-entries');
    return data;
  },

  getMyTotal: async (): Promise<TotalMinutes> => {
    const { data } = await api.get('/time-entries/my-total');
    return data;
  },

  update: async (id: string, payload: UpdateTimeEntryDto): Promise<TimeEntry> => {
    const { data } = await api.put(`/time-entries/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/time-entries/${id}`);
  },

};