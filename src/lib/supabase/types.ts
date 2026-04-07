/**
 * ClinOS Database Types
 * Auto-generated type definitions for all Supabase tables.
 * Run `pnpm supabase gen types` to regenerate after schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SeverityLevel = 'critical' | 'unstable' | 'stable' | 'unknown'
export type ClinicalMode   = 'er' | 'ward' | 'icu'
export type WorkflowStep   =
  | 'triage' | 'history' | 'examination' | 'investigations'
  | 'differentials' | 'diagnosis' | 'management' | 'documentation'
export type EncounterStatus = 'active' | 'completed' | 'abandoned'
export type UserRole = 'junior_doctor' | 'medical_student' | 'registrar' | 'consultant'

export interface Database {
  public: {
    Tables: {

      profiles: {
        Row: {
          id:         string
          full_name:  string | null
          role:       UserRole
          specialty:  string | null
          hospital:   string | null
          country:    string | null
          onboarded:  boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id:         string
          full_name?: string | null
          role?:      UserRole
          specialty?: string | null
          hospital?:  string | null
          country?:   string | null
          onboarded?: boolean
        }
        Update: {
          full_name?: string | null
          role?:      UserRole
          specialty?: string | null
          hospital?:  string | null
          country?:   string | null
          onboarded?: boolean
        }
      }

      encounters: {
        Row: {
          id:              string
          user_id:         string
          patient_age:     number | null
          patient_sex:     'male' | 'female' | 'other' | 'unknown' | null
          chief_complaint: string
          condition_key:   string
          mode:            ClinicalMode
          severity:        SeverityLevel
          critical_mode:   boolean
          current_step:    WorkflowStep
          status:          EncounterStatus
          created_at:      string
          completed_at:    string | null
          updated_at:      string
        }
        Insert: {
          id?:             string
          user_id:         string
          patient_age?:    number | null
          patient_sex?:    'male' | 'female' | 'other' | 'unknown' | null
          chief_complaint: string
          condition_key?:  string
          mode?:           ClinicalMode
          severity?:       SeverityLevel
          critical_mode?:  boolean
          current_step?:   WorkflowStep
          status?:         EncounterStatus
        }
        Update: {
          patient_age?:    number | null
          patient_sex?:    'male' | 'female' | 'other' | 'unknown' | null
          chief_complaint?: string
          condition_key?:  string
          mode?:           ClinicalMode
          severity?:       SeverityLevel
          critical_mode?:  boolean
          current_step?:   WorkflowStep
          status?:         EncounterStatus
          completed_at?:   string | null
        }
      }

      encounter_steps: {
        Row: {
          id:           string
          encounter_id: string
          step:         WorkflowStep
          data:         Json
          ai_output:    Json | null
          safety_flags: Json | null
          completed_at: string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          encounter_id:  string
          step:          WorkflowStep
          data?:         Json
          ai_output?:    Json | null
          safety_flags?: Json | null
          completed_at?: string | null
        }
        Update: {
          data?:         Json
          ai_output?:    Json | null
          safety_flags?: Json | null
          completed_at?: string | null
        }
      }

      calculator_results: {
        Row: {
          id:           string
          encounter_id: string
          calculator:   string
          inputs:       Json
          result:       Json
          created_at:   string
        }
        Insert: {
          id?:          string
          encounter_id: string
          calculator:   string
          inputs:       Json
          result:       Json
        }
        Update: never
      }

      encounter_audit_log: {
        Row: {
          id:           string
          encounter_id: string | null
          user_id:      string | null
          action:       string
          step:         string | null
          payload:      Json | null
          created_at:   string
        }
        Insert: {
          id?:           string
          encounter_id?: string | null
          user_id?:      string | null
          action:        string
          step?:         string | null
          payload?:      Json | null
        }
        Update: never
      }

      conditions: {
        Row: {
          key:          string
          display_name: string
          category:     string
          phase:        number
          active:       boolean
          guidelines:   string[]
          created_at:   string
        }
        Insert: never
        Update: never
      }
    }
  }
}
