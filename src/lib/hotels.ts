import "server-only";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// The hotel the logged-in hotel staff member belongs to, with its team.
export async function getMyHotel() {
  const user = await getCurrentUser();
  if (!user || user.role !== "hotel_staff") return null;

  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("hotel_members")
    .select("role, hotels(id, slug, name, stars, verification_status, regions(name_tr, name_en, name_ru))")
    .eq("profile_id", user.id)
    .maybeSingle();
  const hotel = membership?.hotels;
  if (!hotel) return { user, hotel: null, team: [] };

  const { data: team } = await supabase
    .from("employments")
    .select("id, role, season, status, animators(slug, profiles(display_name))")
    .eq("hotel_id", hotel.id)
    .in("status", ["active", "pending"])
    .order("created_at", { ascending: false });

  return {
    user,
    memberRole: membership.role,
    hotel,
    team: (team ?? []).map((e) => ({
      id: e.id,
      role: e.role,
      season: e.season,
      status: e.status,
      slug: e.animators?.slug ?? "",
      name: e.animators?.profiles?.display_name ?? "",
    })),
  };
}
