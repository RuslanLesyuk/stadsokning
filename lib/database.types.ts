export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      billing_subscriptions: {
        Row: {
          billing_interval: string
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          grace_until: string | null
          id: string
          last_invoice_id: string | null
          last_invoice_status: string | null
          last_payment_failed_at: string | null
          plan: string
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_interval?: string
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          grace_until?: string | null
          id?: string
          last_invoice_id?: string | null
          last_invoice_status?: string | null
          last_payment_failed_at?: string | null
          plan?: string
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_interval?: string
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          grace_until?: string | null
          id?: string
          last_invoice_id?: string | null
          last_invoice_status?: string | null
          last_payment_failed_at?: string | null
          plan?: string
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_transactions: {
        Row: {
          amount_minor: number | null
          created_at: string
          currency: string
          id: string
          kind: string
          metadata: Json
          paid_at: string | null
          reference_id: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_event_id: string | null
          stripe_invoice_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_minor?: number | null
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          metadata?: Json
          paid_at?: string | null
          reference_id?: string | null
          status: string
          stripe_checkout_session_id?: string | null
          stripe_event_id?: string | null
          stripe_invoice_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_minor?: number | null
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          metadata?: Json
          paid_at?: string | null
          reference_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_event_id?: string | null
          stripe_invoice_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      billing_webhook_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string
          event_type: string
          livemode: boolean
          processed_at: string | null
          status: string
          stripe_created_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id: string
          event_type: string
          livemode?: boolean
          processed_at?: string | null
          status?: string
          stripe_created_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string
          event_type?: string
          livemode?: boolean
          processed_at?: string | null
          status?: string
          stripe_created_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          catalog_source: string
          city: string | null
          claimed_at: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          directory_quality_score: number
          email: string | null
          faq: Json
          founded_year: number | null
          gallery_urls: string[]
          hourly_rate: number | null
          id: string
          languages: string[]
          logo_url: string | null
          minimum_order: number | null
          name: string
          normalized_city: string | null
          normalized_company_name: string | null
          normalized_email: string | null
          normalized_phone: string | null
          organization_number: string | null
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          rating: number | null
          rut_available: boolean
          service_areas: string[]
          service_types: string[]
          services: string | null
          slug: string
          updated_at: string
          verified: boolean | null
          website: string | null
          website_domain: string | null
          working_hours: Json
        }
        Insert: {
          address?: string | null
          catalog_source?: string
          city?: string | null
          claimed_at?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          directory_quality_score?: number
          email?: string | null
          faq?: Json
          founded_year?: number | null
          gallery_urls?: string[]
          hourly_rate?: number | null
          id?: string
          languages?: string[]
          logo_url?: string | null
          minimum_order?: number | null
          name: string
          normalized_city?: string | null
          normalized_company_name?: string | null
          normalized_email?: string | null
          normalized_phone?: string | null
          organization_number?: string | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          rut_available?: boolean
          service_areas?: string[]
          service_types?: string[]
          services?: string | null
          slug: string
          updated_at?: string
          verified?: boolean | null
          website?: string | null
          website_domain?: string | null
          working_hours?: Json
        }
        Update: {
          address?: string | null
          catalog_source?: string
          city?: string | null
          claimed_at?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          directory_quality_score?: number
          email?: string | null
          faq?: Json
          founded_year?: number | null
          gallery_urls?: string[]
          hourly_rate?: number | null
          id?: string
          languages?: string[]
          logo_url?: string | null
          minimum_order?: number | null
          name?: string
          normalized_city?: string | null
          normalized_company_name?: string | null
          normalized_email?: string | null
          normalized_phone?: string | null
          organization_number?: string | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          rut_available?: boolean
          service_areas?: string[]
          service_types?: string[]
          services?: string | null
          slug?: string
          updated_at?: string
          verified?: boolean | null
          website?: string | null
          website_domain?: string | null
          working_hours?: Json
        }
        Relationships: []
      }
      company_booking_activity: {
        Row: {
          actor_id: string | null
          booking_id: string
          created_at: string
          event_type: string
          from_status: string | null
          id: string
          metadata: Json
          occurrence_id: string | null
          to_status: string | null
        }
        Insert: {
          actor_id?: string | null
          booking_id: string
          created_at?: string
          event_type: string
          from_status?: string | null
          id?: string
          metadata?: Json
          occurrence_id?: string | null
          to_status?: string | null
        }
        Update: {
          actor_id?: string | null
          booking_id?: string
          created_at?: string
          event_type?: string
          from_status?: string | null
          id?: string
          metadata?: Json
          occurrence_id?: string | null
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_booking_activity_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "company_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_booking_activity_occurrence_id_fkey"
            columns: ["occurrence_id"]
            isOneToOne: false
            referencedRelation: "company_booking_occurrences"
            referencedColumns: ["id"]
          },
        ]
      }
      company_booking_occurrences: {
        Row: {
          booking_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          company_id: string
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          id: string
          price: number | null
          scheduled_end: string
          scheduled_start: string
          sequence_no: number
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_id: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          price?: number | null
          scheduled_end: string
          scheduled_start: string
          sequence_no: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_id?: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          price?: number | null
          scheduled_end?: string
          scheduled_start?: string
          sequence_no?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_booking_occurrences_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "company_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_booking_occurrences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_booking_settings: {
        Row: {
          auto_confirm: boolean
          booking_enabled: boolean
          buffer_minutes: number
          company_id: string
          created_at: string
          default_duration_minutes: number
          id: string
          max_days_ahead: number
          min_notice_hours: number
          recurring_enabled: boolean
          timezone: string
          updated_at: string
        }
        Insert: {
          auto_confirm?: boolean
          booking_enabled?: boolean
          buffer_minutes?: number
          company_id: string
          created_at?: string
          default_duration_minutes?: number
          id?: string
          max_days_ahead?: number
          min_notice_hours?: number
          recurring_enabled?: boolean
          timezone?: string
          updated_at?: string
        }
        Update: {
          auto_confirm?: boolean
          booking_enabled?: boolean
          buffer_minutes?: number
          company_id?: string
          created_at?: string
          default_duration_minutes?: number
          id?: string
          max_days_ahead?: number
          min_notice_hours?: number
          recurring_enabled?: boolean
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_booking_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_bookings: {
        Row: {
          address: string
          agreed_price: number | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          city: string
          company_id: string
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          crm_customer_id: string | null
          currency: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_notes: string | null
          customer_phone: string | null
          declined_at: string | null
          duration_minutes: number
          estimated_price: number | null
          frequency: string
          id: string
          paid_at: string | null
          payment_amount: number | null
          payment_required: boolean
          payment_status: string
          platform_fee_amount: number | null
          platform_fee_percent: number | null
          postal_code: string | null
          preferred_time: string
          quote_request_id: string | null
          refunded_at: string | null
          rut_requested: boolean
          service_type: string
          source: string
          source_url: string | null
          start_date: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          address: string
          agreed_price?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          city: string
          company_id: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          crm_customer_id?: string | null
          currency?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_notes?: string | null
          customer_phone?: string | null
          declined_at?: string | null
          duration_minutes?: number
          estimated_price?: number | null
          frequency?: string
          id?: string
          paid_at?: string | null
          payment_amount?: number | null
          payment_required?: boolean
          payment_status?: string
          platform_fee_amount?: number | null
          platform_fee_percent?: number | null
          postal_code?: string | null
          preferred_time: string
          quote_request_id?: string | null
          refunded_at?: string | null
          rut_requested?: boolean
          service_type: string
          source?: string
          source_url?: string | null
          start_date: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          address?: string
          agreed_price?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          city?: string
          company_id?: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          crm_customer_id?: string | null
          currency?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string | null
          declined_at?: string | null
          duration_minutes?: number
          estimated_price?: number | null
          frequency?: string
          id?: string
          paid_at?: string | null
          payment_amount?: number | null
          payment_required?: boolean
          payment_status?: string
          platform_fee_amount?: number | null
          platform_fee_percent?: number | null
          postal_code?: string | null
          preferred_time?: string
          quote_request_id?: string | null
          refunded_at?: string | null
          rut_requested?: boolean
          service_type?: string
          source?: string
          source_url?: string | null
          start_date?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bookings_crm_customer_id_fkey"
            columns: ["crm_customer_id"]
            isOneToOne: false
            referencedRelation: "company_crm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_bookings_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "company_quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      company_claim_audit: {
        Row: {
          action: string
          actor_id: string | null
          claim_id: string
          company_id: string
          created_at: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          claim_id: string
          company_id: string
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          claim_id?: string
          company_id?: string
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_claim_audit_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "company_claim_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_claim_audit_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_claim_requests: {
        Row: {
          admin_note: string | null
          business_email: string | null
          business_email_domain: string | null
          business_phone: string | null
          cancelled_at: string | null
          company_domain: string | null
          company_id: string
          created_at: string
          email_domain_match: boolean
          evidence_paths: string[]
          id: string
          locale: string
          message: string | null
          requested_info_at: string | null
          resubmitted_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          business_email?: string | null
          business_email_domain?: string | null
          business_phone?: string | null
          cancelled_at?: string | null
          company_domain?: string | null
          company_id: string
          created_at?: string
          email_domain_match?: boolean
          evidence_paths?: string[]
          id?: string
          locale?: string
          message?: string | null
          requested_info_at?: string | null
          resubmitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          business_email?: string | null
          business_email_domain?: string | null
          business_phone?: string | null
          cancelled_at?: string | null
          company_domain?: string | null
          company_id?: string
          created_at?: string
          email_domain_match?: boolean
          evidence_paths?: string[]
          id?: string
          locale?: string
          message?: string | null
          requested_info_at?: string | null
          resubmitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_claim_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_crm_customer_activity: {
        Row: {
          actor_id: string | null
          company_id: string
          created_at: string
          crm_customer_id: string
          event_type: string
          id: string
          metadata: Json
        }
        Insert: {
          actor_id?: string | null
          company_id: string
          created_at?: string
          crm_customer_id: string
          event_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          actor_id?: string | null
          company_id?: string
          created_at?: string
          crm_customer_id?: string
          event_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "company_crm_customer_activity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_crm_customer_activity_crm_customer_id_fkey"
            columns: ["crm_customer_id"]
            isOneToOne: false
            referencedRelation: "company_crm_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      company_crm_customers: {
        Row: {
          city: string | null
          company_id: string
          created_at: string
          customer_name: string
          email: string
          first_seen_at: string
          follow_up_at: string | null
          id: string
          last_activity_at: string
          last_seen_at: string
          lifecycle_stage: string
          normalized_email: string
          owner_notes: string | null
          phone: string | null
          tags: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          company_id: string
          created_at?: string
          customer_name: string
          email: string
          first_seen_at?: string
          follow_up_at?: string | null
          id?: string
          last_activity_at?: string
          last_seen_at?: string
          lifecycle_stage?: string
          normalized_email: string
          owner_notes?: string | null
          phone?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          company_id?: string
          created_at?: string
          customer_name?: string
          email?: string
          first_seen_at?: string
          follow_up_at?: string | null
          id?: string
          last_activity_at?: string
          last_seen_at?: string
          lifecycle_stage?: string
          normalized_email?: string
          owner_notes?: string | null
          phone?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_crm_customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          created_count: number
          duplicate_count: number
          error_message: string | null
          failed_count: number
          file_name: string
          file_type: string
          id: string
          invalid_count: number
          source: string
          status: string
          total_rows: number
          updated_at: string
          updated_count: number
          uploaded_by: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_count?: number
          duplicate_count?: number
          error_message?: string | null
          failed_count?: number
          file_name: string
          file_type: string
          id?: string
          invalid_count?: number
          source: string
          status?: string
          total_rows?: number
          updated_at?: string
          updated_count?: number
          uploaded_by?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_count?: number
          duplicate_count?: number
          error_message?: string | null
          failed_count?: number
          file_name?: string
          file_type?: string
          id?: string
          invalid_count?: number
          source?: string
          status?: string
          total_rows?: number
          updated_at?: string
          updated_count?: number
          uploaded_by?: string | null
        }
        Relationships: []
      }
      company_leads: {
        Row: {
          address: string | null
          catalog_company_id: string | null
          catalog_publication_status: string
          catalog_publish_error: string | null
          catalog_published_at: string | null
          city: string | null
          company_name: string
          created_at: string
          data_quality_score: number
          email: string | null
          email_checked_at: string | null
          email_scan_error: string | null
          email_scan_status: string
          email_source: string | null
          email_source_url: string | null
          id: string
          import_batch_id: string | null
          import_fingerprint: string | null
          import_row_number: number | null
          import_updated_at: string | null
          invite_count: number
          invited_at: string | null
          last_invited_at: string | null
          normalized_city: string | null
          normalized_company_name: string | null
          normalized_email: string | null
          normalized_phone: string | null
          notes: string | null
          organization_number: string | null
          phone: string | null
          postal_code: string | null
          registered: boolean
          registered_user_id: string | null
          source: string | null
          status: string
          updated_at: string
          website: string | null
          website_domain: string | null
        }
        Insert: {
          address?: string | null
          catalog_company_id?: string | null
          catalog_publication_status?: string
          catalog_publish_error?: string | null
          catalog_published_at?: string | null
          city?: string | null
          company_name: string
          created_at?: string
          data_quality_score?: number
          email?: string | null
          email_checked_at?: string | null
          email_scan_error?: string | null
          email_scan_status?: string
          email_source?: string | null
          email_source_url?: string | null
          id?: string
          import_batch_id?: string | null
          import_fingerprint?: string | null
          import_row_number?: number | null
          import_updated_at?: string | null
          invite_count?: number
          invited_at?: string | null
          last_invited_at?: string | null
          normalized_city?: string | null
          normalized_company_name?: string | null
          normalized_email?: string | null
          normalized_phone?: string | null
          notes?: string | null
          organization_number?: string | null
          phone?: string | null
          postal_code?: string | null
          registered?: boolean
          registered_user_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          website?: string | null
          website_domain?: string | null
        }
        Update: {
          address?: string | null
          catalog_company_id?: string | null
          catalog_publication_status?: string
          catalog_publish_error?: string | null
          catalog_published_at?: string | null
          city?: string | null
          company_name?: string
          created_at?: string
          data_quality_score?: number
          email?: string | null
          email_checked_at?: string | null
          email_scan_error?: string | null
          email_scan_status?: string
          email_source?: string | null
          email_source_url?: string | null
          id?: string
          import_batch_id?: string | null
          import_fingerprint?: string | null
          import_row_number?: number | null
          import_updated_at?: string | null
          invite_count?: number
          invited_at?: string | null
          last_invited_at?: string | null
          normalized_city?: string | null
          normalized_company_name?: string | null
          normalized_email?: string | null
          normalized_phone?: string | null
          notes?: string | null
          organization_number?: string | null
          phone?: string | null
          postal_code?: string | null
          registered?: boolean
          registered_user_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          website?: string | null
          website_domain?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_leads_catalog_company_id_fkey"
            columns: ["catalog_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_leads_import_batch_id_fkey"
            columns: ["import_batch_id"]
            isOneToOne: false
            referencedRelation: "company_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      company_quote_request_activity: {
        Row: {
          actor_id: string | null
          created_at: string
          event_type: string
          from_status: string | null
          id: string
          metadata: Json
          quote_request_id: string
          to_status: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event_type: string
          from_status?: string | null
          id?: string
          metadata?: Json
          quote_request_id: string
          to_status?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event_type?: string
          from_status?: string | null
          id?: string
          metadata?: Json
          quote_request_id?: string
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_quote_request_activity_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "company_quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      company_quote_requests: {
        Row: {
          city: string | null
          company_id: string
          created_at: string
          crm_customer_id: string | null
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          estimated_value: number | null
          first_viewed_at: string | null
          follow_up_at: string | null
          id: string
          is_paid: boolean
          last_activity_at: string
          lead_access: string
          lead_price: number | null
          lead_score: number | null
          lead_type: string
          lost_reason: string | null
          message: string
          metadata: Json
          owner_notes: string | null
          paid_at: string | null
          preferred_date: string | null
          priority: string
          purchased_by: string | null
          quoted_value: number | null
          service_type: string | null
          source: string
          source_site_id: string | null
          source_url: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          unlocked_at: string | null
          updated_at: string
          user_id: string | null
          viewed_by: string | null
        }
        Insert: {
          city?: string | null
          company_id: string
          created_at?: string
          crm_customer_id?: string | null
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          estimated_value?: number | null
          first_viewed_at?: string | null
          follow_up_at?: string | null
          id?: string
          is_paid?: boolean
          last_activity_at?: string
          lead_access?: string
          lead_price?: number | null
          lead_score?: number | null
          lead_type?: string
          lost_reason?: string | null
          message: string
          metadata?: Json
          owner_notes?: string | null
          paid_at?: string | null
          preferred_date?: string | null
          priority?: string
          purchased_by?: string | null
          quoted_value?: number | null
          service_type?: string | null
          source?: string
          source_site_id?: string | null
          source_url?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string | null
          viewed_by?: string | null
        }
        Update: {
          city?: string | null
          company_id?: string
          created_at?: string
          crm_customer_id?: string | null
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          estimated_value?: number | null
          first_viewed_at?: string | null
          follow_up_at?: string | null
          id?: string
          is_paid?: boolean
          last_activity_at?: string
          lead_access?: string
          lead_price?: number | null
          lead_score?: number | null
          lead_type?: string
          lost_reason?: string | null
          message?: string
          metadata?: Json
          owner_notes?: string | null
          paid_at?: string | null
          preferred_date?: string | null
          priority?: string
          purchased_by?: string | null
          quoted_value?: number | null
          service_type?: string | null
          source?: string
          source_site_id?: string | null
          source_url?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string | null
          viewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_quote_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_quote_requests_crm_customer_id_fkey"
            columns: ["crm_customer_id"]
            isOneToOne: false
            referencedRelation: "company_crm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_quote_requests_source_site_id_fkey"
            columns: ["source_site_id"]
            isOneToOne: false
            referencedRelation: "company_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      company_sites: {
        Row: {
          company_id: string
          content: Json
          created_at: string
          custom_domain: string | null
          default_locale: string
          domain_status: string
          enabled_locales: string[]
          id: string
          primary_color: string
          published_at: string | null
          remove_clean_jobs_branding: boolean
          secondary_color: string
          section_settings: Json
          seo_settings: Json
          site_slug: string
          social_links: Json
          status: string
          template: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content?: Json
          created_at?: string
          custom_domain?: string | null
          default_locale?: string
          domain_status?: string
          enabled_locales?: string[]
          id?: string
          primary_color?: string
          published_at?: string | null
          remove_clean_jobs_branding?: boolean
          secondary_color?: string
          section_settings?: Json
          seo_settings?: Json
          site_slug: string
          social_links?: Json
          status?: string
          template?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: Json
          created_at?: string
          custom_domain?: string | null
          default_locale?: string
          domain_status?: string
          enabled_locales?: string[]
          id?: string
          primary_color?: string
          published_at?: string | null
          remove_clean_jobs_branding?: boolean
          secondary_color?: string
          section_settings?: Json
          seo_settings?: Json
          site_slug?: string
          social_links?: Json
          status?: string
          template?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_sites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_activity: {
        Row: {
          actor_id: string | null
          created_at: string
          event_type: string
          id: string
          job_id: string
          metadata: Json
          new_status: string | null
          old_status: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          job_id: string
          metadata?: Json
          new_status?: string | null
          old_status?: string | null
          type?: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          job_id?: string
          metadata?: Json
          new_status?: string | null
          old_status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_activity_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_activity_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_id: string
          available_from: string | null
          created_at: string
          estimated_hours: number | null
          fixed_price: number | null
          hourly_rate: number | null
          id: string
          job_id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          available_from?: string | null
          created_at?: string
          estimated_hours?: number | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          job_id: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          available_from?: string | null
          created_at?: string
          estimated_hours?: number | null
          fixed_price?: number | null
          hourly_rate?: number | null
          id?: string
          job_id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_chat_reads: {
        Row: {
          created_at: string
          job_id: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_chat_reads_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_reports: {
        Row: {
          created_at: string
          id: string
          job_id: string
          message: string | null
          reason: string
          reporter_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          message?: string | null
          reason: string
          reporter_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          message?: string | null
          reason?: string
          reporter_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_reports_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          address: string | null
          assigned_to: string | null
          budget: number | null
          city: string | null
          created_at: string | null
          created_by: string
          description: string | null
          featured_until: string | null
          id: string
          is_featured: boolean
          job_type: string
          property_type: string
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          title: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          budget?: number | null
          city?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean
          job_type: string
          property_type: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          title: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          budget?: number | null
          city?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean
          job_type?: string
          property_type?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          content: string | null
          created_at: string
          id: string
          job_id: string
          read_at: string | null
          read_by: string | null
          sender_id: string
        }
        Insert: {
          body: string
          content?: string | null
          created_at?: string
          id?: string
          job_id: string
          read_at?: string | null
          read_by?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          content?: string | null
          created_at?: string
          id?: string
          job_id?: string
          read_at?: string | null
          read_by?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          application_id: string | null
          created_at: string
          dedupe_key: string | null
          entity_id: string | null
          entity_type: string | null
          href: string | null
          id: string
          is_read: boolean
          job_id: string | null
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          application_id?: string | null
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          href?: string | null
          id?: string
          is_read?: boolean
          job_id?: string | null
          message?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          application_id?: string | null
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          href?: string | null
          id?: string
          is_read?: boolean
          job_id?: string | null
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_email_preferences: {
        Row: {
          created_at: string
          email_normalized: string
          opted_out_at: string | null
          unsubscribe_token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_normalized: string
          opted_out_at?: string | null
          unsubscribe_token?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_normalized?: string
          opted_out_at?: string | null
          unsubscribe_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bankid_provider: string | null
          bankid_verified: boolean
          bankid_verified_at: string | null
          billing_grace_until: string | null
          bio: string | null
          city: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_premium: boolean
          phone: string | null
          premium_override_until: string | null
          premium_source: string
          premium_updated_at: string
          stripe_billing_interval: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          stripe_subscription_status: string | null
          subscription_ends_at: string | null
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          bankid_provider?: string | null
          bankid_verified?: boolean
          bankid_verified_at?: string | null
          billing_grace_until?: string | null
          bio?: string | null
          city?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_premium?: boolean
          phone?: string | null
          premium_override_until?: string | null
          premium_source?: string
          premium_updated_at?: string
          stripe_billing_interval?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          subscription_ends_at?: string | null
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          bankid_provider?: string | null
          bankid_verified?: boolean
          bankid_verified_at?: string | null
          billing_grace_until?: string | null
          bio?: string | null
          city?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_premium?: boolean
          phone?: string | null
          premium_override_until?: string | null
          premium_source?: string
          premium_updated_at?: string
          stripe_billing_interval?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          subscription_ends_at?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          job_id: string | null
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          job_id?: string | null
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          job_id?: string | null
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      security_rate_limits: {
        Row: {
          action: string
          hits: number
          key_hash: string
          updated_at: string
          window_start: string
        }
        Insert: {
          action: string
          hits?: number
          key_hash: string
          updated_at?: string
          window_start: string
        }
        Update: {
          action?: string
          hits?: number
          key_hash?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      service_profiles: {
        Row: {
          city: string
          company_name: string
          created_at: string | null
          description: string | null
          email: string | null
          gallery_urls: string[] | null
          hourly_rate: number | null
          id: string
          languages: string[] | null
          logo_url: string | null
          minimum_order: number | null
          phone: string | null
          rut_available: boolean | null
          service_areas: string[] | null
          service_types: string[] | null
          slug: string
          user_id: string | null
          verified: boolean | null
          website: string | null
          working_hours: Json | null
        }
        Insert: {
          city: string
          company_name: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          gallery_urls?: string[] | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          minimum_order?: number | null
          phone?: string | null
          rut_available?: boolean | null
          service_areas?: string[] | null
          service_types?: string[] | null
          slug: string
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
          working_hours?: Json | null
        }
        Update: {
          city?: string
          company_name?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          gallery_urls?: string[] | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          minimum_order?: number | null
          phone?: string | null
          rut_available?: boolean | null
          service_areas?: string[] | null
          service_types?: string[] | null
          slug?: string
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_job_application: {
        Args: { p_application_id: string }
        Returns: Json
      }
      approve_company_claim: {
        Args: { claim_request_id: string; reviewer_user_id: string }
        Returns: undefined
      }
      company_catalog_slug_base: {
        Args: { city_name: string; company_name: string }
        Returns: string
      }
      company_catalog_slug_part: { Args: { value: string }; Returns: string }
      company_import_quality_score: {
        Args: {
          city_name: string
          domain_name: string
          email_address: string
          org_number: string
          phone_number: string
          postal: string
          street_address: string
        }
        Returns: number
      }
      consume_security_rate_limit: {
        Args: {
          p_action: string
          p_key_hash: string
          p_limit: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      get_company_dashboard_metrics: {
        Args: { p_company_id: string; p_now?: string }
        Returns: Json
      }
      get_company_directory_facets: { Args: never; Returns: Json }
      get_header_snapshot: { Args: never; Returns: Json }
      import_company_leads_batch: {
        Args: { p_batch_id: string; p_rows: Json }
        Returns: Json
      }
      normalize_company_import_domain: {
        Args: { value: string }
        Returns: string
      }
      normalize_company_import_email: {
        Args: { value: string }
        Returns: string
      }
      normalize_company_import_org_number: {
        Args: { value: string }
        Returns: string
      }
      normalize_company_import_phone: {
        Args: { value: string }
        Returns: string
      }
      normalize_company_import_text: {
        Args: { value: string }
        Returns: string
      }
      publish_company_leads_batch: {
        Args: {
          p_import_batch_id?: string
          p_limit?: number
          p_min_quality?: number
        }
        Returns: Json
      }
      reject_company_claim: {
        Args: {
          claim_request_id: string
          rejection_note: string
          reviewer_user_id: string
        }
        Returns: undefined
      }
      reject_job_application: {
        Args: { p_application_id: string }
        Returns: Json
      }
      request_more_info_company_claim: {
        Args: {
          claim_request_id: string
          request_note: string
          reviewer_user_id: string
        }
        Returns: undefined
      }
      search_company_directory: {
        Args: {
          p_city?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_sort?: string
          p_status?: string
        }
        Returns: Json
      }
      upsert_company_crm_customer: {
        Args: {
          p_city: string
          p_company_id: string
          p_customer_name: string
          p_email: string
          p_lifecycle_stage: string
          p_phone: string
          p_seen_at: string
          p_user_id: string
        }
        Returns: string
      }
      user_has_premium: { Args: { target_user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
