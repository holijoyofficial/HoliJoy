
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  "public": {
          Tables: {
            "animator_private": {
                  Row: {
                    "animator_id": string,"created_at": string,"updated_at": string,"whatsapp_phone": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "animator_id": string,"created_at"?: string,"updated_at"?: string,"whatsapp_phone"?: string | null
                  }
                  Update: {
                    "animator_id"?: string,"created_at"?: string,"updated_at"?: string,"whatsapp_phone"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "animator_private_animator_id_fkey"
      columns: ["animator_id"]
isOneToOne: true
      referencedRelation: "animators"
      referencedColumns: ["id"]
    }
                  ]
                },"animator_scores": {
                  Row: {
                    "animator_id": string,"ranking_score": number | null,"rating_avg": number | null,"rating_count": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "animator_id": string,"ranking_score"?: number | null,"rating_avg"?: number | null,"rating_count"?: number,"updated_at"?: string
                  }
                  Update: {
                    "animator_id"?: string,"ranking_score"?: number | null,"rating_avg"?: number | null,"rating_count"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "animator_scores_animator_id_fkey"
      columns: ["animator_id"]
isOneToOne: true
      referencedRelation: "animators"
      referencedColumns: ["id"]
    }
                  ]
                },"animators": {
                  Row: {
                    "available_from": string | null,"available_to": string | null,"bio": string | null,"birth_year": number | null,"boost_until": string | null,"branches": (Database["public"]['Enums']["branch"])[],"city": string | null,"created_at": string,"experience_years": number | null,"id": string,"instagram_url": string | null,"languages": NonNullable<Json>,"profile_id": string,"qr_code": string,"seeking_job": boolean,"showreel_media_id": string | null,"slug": string,"tiktok_url": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "available_from"?: string | null,"available_to"?: string | null,"bio"?: string | null,"birth_year"?: number | null,"boost_until"?: string | null,"branches"?: (Database["public"]['Enums']["branch"])[],"city"?: string | null,"created_at"?: string,"experience_years"?: number | null,"id"?: string,"instagram_url"?: string | null,"languages"?: NonNullable<Json>,"profile_id": string,"qr_code"?: string,"seeking_job"?: boolean,"showreel_media_id"?: string | null,"slug": string,"tiktok_url"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "available_from"?: string | null,"available_to"?: string | null,"bio"?: string | null,"birth_year"?: number | null,"boost_until"?: string | null,"branches"?: (Database["public"]['Enums']["branch"])[],"city"?: string | null,"created_at"?: string,"experience_years"?: number | null,"id"?: string,"instagram_url"?: string | null,"languages"?: NonNullable<Json>,"profile_id"?: string,"qr_code"?: string,"seeking_job"?: boolean,"showreel_media_id"?: string | null,"slug"?: string,"tiktok_url"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "animators_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "animators_showreel_fk"
      columns: ["showreel_media_id"]
isOneToOne: false
      referencedRelation: "media"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_log": {
                  Row: {
                    "action": string,"actor_profile_id": string | null,"created_at": string,"id": string,"meta": NonNullable<Json>,"reason": string | null,"target_id": string | null,"target_type": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_profile_id"?: string | null,"created_at"?: string,"id"?: string,"meta"?: NonNullable<Json>,"reason"?: string | null,"target_id"?: string | null,"target_type"?: string | null
                  }
                  Update: {
                    "action"?: string,"actor_profile_id"?: string | null,"created_at"?: string,"id"?: string,"meta"?: NonNullable<Json>,"reason"?: string | null,"target_id"?: string | null,"target_type"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_log_actor_profile_id_fkey"
      columns: ["actor_profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"boosts": {
                  Row: {
                    "amount": number | null,"animator_id": string,"created_at": string,"currency": string | null,"ends_at": string,"id": string,"note": string | null,"payment_reference": string | null,"recorded_by": string | null,"source": string,"starts_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount"?: number | null,"animator_id": string,"created_at"?: string,"currency"?: string | null,"ends_at": string,"id"?: string,"note"?: string | null,"payment_reference"?: string | null,"recorded_by"?: string | null,"source": string,"starts_at": string
                  }
                  Update: {
                    "amount"?: number | null,"animator_id"?: string,"created_at"?: string,"currency"?: string | null,"ends_at"?: string,"id"?: string,"note"?: string | null,"payment_reference"?: string | null,"recorded_by"?: string | null,"source"?: string,"starts_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "boosts_animator_id_fkey"
      columns: ["animator_id"]
isOneToOne: false
      referencedRelation: "animators"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "boosts_recorded_by_fkey"
      columns: ["recorded_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"contact_clicks": {
                  Row: {
                    "channel": string,"created_at": string,"from_profile_id": string | null,"id": string,"target_id": string,"target_type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "channel": string,"created_at"?: string,"from_profile_id"?: string | null,"id"?: string,"target_id": string,"target_type": string
                  }
                  Update: {
                    "channel"?: string,"created_at"?: string,"from_profile_id"?: string | null,"id"?: string,"target_id"?: string,"target_type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "contact_clicks_from_profile_id_fkey"
      columns: ["from_profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"employments": {
                  Row: {
                    "animator_id": string,"created_at": string,"decided_at": string | null,"decided_by": string | null,"end_date": string | null,"hotel_id": string,"id": string,"role": Database["public"]['Enums']["branch"],"season": number,"start_date": string | null,"status": Database["public"]['Enums']["employment_status"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "animator_id": string,"created_at"?: string,"decided_at"?: string | null,"decided_by"?: string | null,"end_date"?: string | null,"hotel_id": string,"id"?: string,"role": Database["public"]['Enums']["branch"],"season": number,"start_date"?: string | null,"status"?: Database["public"]['Enums']["employment_status"],"updated_at"?: string
                  }
                  Update: {
                    "animator_id"?: string,"created_at"?: string,"decided_at"?: string | null,"decided_by"?: string | null,"end_date"?: string | null,"hotel_id"?: string,"id"?: string,"role"?: Database["public"]['Enums']["branch"],"season"?: number,"start_date"?: string | null,"status"?: Database["public"]['Enums']["employment_status"],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "employments_animator_id_fkey"
      columns: ["animator_id"]
isOneToOne: false
      referencedRelation: "animators"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "employments_decided_by_fkey"
      columns: ["decided_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "employments_hotel_id_fkey"
      columns: ["hotel_id"]
isOneToOne: false
      referencedRelation: "hotels"
      referencedColumns: ["id"]
    }
                  ]
                },"hotel_members": {
                  Row: {
                    "created_at": string,"hotel_id": string,"id": string,"profile_id": string,"role": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"hotel_id": string,"id"?: string,"profile_id": string,"role"?: string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"hotel_id"?: string,"id"?: string,"profile_id"?: string,"role"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "hotel_members_hotel_id_fkey"
      columns: ["hotel_id"]
isOneToOne: false
      referencedRelation: "hotels"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "hotel_members_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"hotel_private": {
                  Row: {
                    "created_at": string,"hotel_id": string,"updated_at": string,"whatsapp_phone": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"hotel_id": string,"updated_at"?: string,"whatsapp_phone"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"hotel_id"?: string,"updated_at"?: string,"whatsapp_phone"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "hotel_private_hotel_id_fkey"
      columns: ["hotel_id"]
isOneToOne: true
      referencedRelation: "hotels"
      referencedColumns: ["id"]
    }
                  ]
                },"hotels": {
                  Row: {
                    "address": string | null,"booking_url": string | null,"concepts": (string)[],"created_at": string,"featured_until": string | null,"hiring": NonNullable<Json>,"id": string,"lat": number | null,"lng": number | null,"name": string,"perks": NonNullable<Json>,"program": NonNullable<Json>,"region_id": string | null,"slug": string,"stars": number | null,"updated_at": string,"verification_status": Database["public"]['Enums']["verification_status"],"website_url": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"booking_url"?: string | null,"concepts"?: (string)[],"created_at"?: string,"featured_until"?: string | null,"hiring"?: NonNullable<Json>,"id"?: string,"lat"?: number | null,"lng"?: number | null,"name": string,"perks"?: NonNullable<Json>,"program"?: NonNullable<Json>,"region_id"?: string | null,"slug": string,"stars"?: number | null,"updated_at"?: string,"verification_status"?: Database["public"]['Enums']["verification_status"],"website_url"?: string | null
                  }
                  Update: {
                    "address"?: string | null,"booking_url"?: string | null,"concepts"?: (string)[],"created_at"?: string,"featured_until"?: string | null,"hiring"?: NonNullable<Json>,"id"?: string,"lat"?: number | null,"lng"?: number | null,"name"?: string,"perks"?: NonNullable<Json>,"program"?: NonNullable<Json>,"region_id"?: string | null,"slug"?: string,"stars"?: number | null,"updated_at"?: string,"verification_status"?: Database["public"]['Enums']["verification_status"],"website_url"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "hotels_region_id_fkey"
      columns: ["region_id"]
isOneToOne: false
      referencedRelation: "regions"
      referencedColumns: ["id"]
    }
                  ]
                },"media": {
                  Row: {
                    "animator_id": string,"created_at": string,"duration_s": number | null,"height": number | null,"id": string,"kind": Database["public"]['Enums']["media_kind"],"position": number,"r2_key": string,"status": string,"updated_at": string,"width": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "animator_id": string,"created_at"?: string,"duration_s"?: number | null,"height"?: number | null,"id"?: string,"kind": Database["public"]['Enums']["media_kind"],"position"?: number,"r2_key": string,"status"?: string,"updated_at"?: string,"width"?: number | null
                  }
                  Update: {
                    "animator_id"?: string,"created_at"?: string,"duration_s"?: number | null,"height"?: number | null,"id"?: string,"kind"?: Database["public"]['Enums']["media_kind"],"position"?: number,"r2_key"?: string,"status"?: string,"updated_at"?: string,"width"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "media_animator_id_fkey"
      columns: ["animator_id"]
isOneToOne: false
      referencedRelation: "animators"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "created_at": string,"emailed_at": string | null,"id": string,"payload": NonNullable<Json>,"profile_id": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"emailed_at"?: string | null,"id"?: string,"payload"?: NonNullable<Json>,"profile_id": string,"type": string
                  }
                  Update: {
                    "created_at"?: string,"emailed_at"?: string | null,"id"?: string,"payload"?: NonNullable<Json>,"profile_id"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"outbound_clicks": {
                  Row: {
                    "created_at": string,"hotel_id": string,"id": string,"session_hash": string | null,"source": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"hotel_id": string,"id"?: string,"session_hash"?: string | null,"source": string
                  }
                  Update: {
                    "created_at"?: string,"hotel_id"?: string,"id"?: string,"session_hash"?: string | null,"source"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "outbound_clicks_hotel_id_fkey"
      columns: ["hotel_id"]
isOneToOne: false
      referencedRelation: "hotels"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"banned_at": string | null,"created_at": string,"display_name": string,"id": string,"locale": Database["public"]['Enums']["app_locale"],"role": Database["public"]['Enums']["user_role"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"banned_at"?: string | null,"created_at"?: string,"display_name"?: string,"id": string,"locale"?: Database["public"]['Enums']["app_locale"],"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Update: {
                    "avatar_url"?: string | null,"banned_at"?: string | null,"created_at"?: string,"display_name"?: string,"id"?: string,"locale"?: Database["public"]['Enums']["app_locale"],"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"regions": {
                  Row: {
                    "city": string,"created_at": string,"id": string,"name_en": string,"name_ru": string,"name_tr": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "city": string,"created_at"?: string,"id"?: string,"name_en": string,"name_ru": string,"name_tr": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "city"?: string,"created_at"?: string,"id"?: string,"name_en"?: string,"name_ru"?: string,"name_tr"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"reports": {
                  Row: {
                    "created_at": string,"id": string,"reason": string,"reporter_profile_id": string | null,"resolved_by": string | null,"status": string,"target_id": string,"target_type": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"reason": string,"reporter_profile_id"?: string | null,"resolved_by"?: string | null,"status"?: string,"target_id": string,"target_type": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"reason"?: string,"reporter_profile_id"?: string | null,"resolved_by"?: string | null,"status"?: string,"target_id"?: string,"target_type"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reports_reporter_profile_id_fkey"
      columns: ["reporter_profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_resolved_by_fkey"
      columns: ["resolved_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"review_private": {
                  Row: {
                    "created_at": string,"guest_email": string,"guest_last_name": string,"review_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"guest_email": string,"guest_last_name": string,"review_id": string
                  }
                  Update: {
                    "created_at"?: string,"guest_email"?: string,"guest_last_name"?: string,"review_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "review_private_review_id_fkey"
      columns: ["review_id"]
isOneToOne: true
      referencedRelation: "reviews"
      referencedColumns: ["id"]
    }
                  ]
                },"reviews": {
                  Row: {
                    "animator_id": string,"body": string,"created_at": string,"guest_country": string,"guest_first_name": string,"guest_last_initial": string,"hotel_id": string | null,"id": string,"locale": Database["public"]['Enums']["app_locale"],"rating": number,"reply_at": string | null,"reply_body": string | null,"source": string,"status": Database["public"]['Enums']["content_status"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "animator_id": string,"body"?: string,"created_at"?: string,"guest_country": string,"guest_first_name": string,"guest_last_initial": string,"hotel_id"?: string | null,"id"?: string,"locale"?: Database["public"]['Enums']["app_locale"],"rating": number,"reply_at"?: string | null,"reply_body"?: string | null,"source"?: string,"status"?: Database["public"]['Enums']["content_status"],"updated_at"?: string
                  }
                  Update: {
                    "animator_id"?: string,"body"?: string,"created_at"?: string,"guest_country"?: string,"guest_first_name"?: string,"guest_last_initial"?: string,"hotel_id"?: string | null,"id"?: string,"locale"?: Database["public"]['Enums']["app_locale"],"rating"?: number,"reply_at"?: string | null,"reply_body"?: string | null,"source"?: string,"status"?: Database["public"]['Enums']["content_status"],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reviews_animator_id_fkey"
      columns: ["animator_id"]
isOneToOne: false
      referencedRelation: "animators"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_hotel_id_fkey"
      columns: ["hotel_id"]
isOneToOne: false
      referencedRelation: "hotels"
      referencedColumns: ["id"]
    }
                  ]
                },"verifications": {
                  Row: {
                    "created_at": string,"files": (string)[],"files_deleted_at": string | null,"id": string,"reason": string | null,"reviewed_at": string | null,"reviewed_by": string | null,"status": Database["public"]['Enums']["verification_status"],"subject_id": string,"subject_type": string,"submitted_by": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"files"?: (string)[],"files_deleted_at"?: string | null,"id"?: string,"reason"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["verification_status"],"subject_id": string,"subject_type": string,"submitted_by"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"files"?: (string)[],"files_deleted_at"?: string | null,"id"?: string,"reason"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["verification_status"],"subject_id"?: string,"subject_type"?: string,"submitted_by"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "verifications_reviewed_by_fkey"
      columns: ["reviewed_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "verifications_submitted_by_fkey"
      columns: ["submitted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "submit_review":
{ Args: { "p_animator_id": string,"p_body": string,"p_cooldown_days"?: number,"p_country": string,"p_email": string,"p_first_name": string,"p_last_name": string,"p_locale"?: Database["public"]['Enums']["app_locale"],"p_rating": number,"p_source"?: string }; Returns: string
                           }
          }
          Enums: {
            "app_locale": "tr"|"en"|"ru","branch": "chief"|"mini_club"|"show"|"dance"|"fitness"|"sports"|"dj"|"theatre"|"host"|"tech","content_status": "visible"|"hidden"|"removed","employment_status": "pending"|"active"|"rejected"|"ended","media_kind": "photo"|"video","user_role": "animator"|"hotel_staff"|"moderator"|"super_admin","verification_status": "unverified"|"pending"|"approved"|"rejected"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "app_locale": ["tr", "en", "ru"],"branch": ["chief", "mini_club", "show", "dance", "fitness", "sports", "dj", "theatre", "host", "tech"],"content_status": ["visible", "hidden", "removed"],"employment_status": ["pending", "active", "rejected", "ended"],"media_kind": ["photo", "video"],"user_role": ["animator", "hotel_staff", "moderator", "super_admin"],"verification_status": ["unverified", "pending", "approved", "rejected"]
          }
        }
} as const
