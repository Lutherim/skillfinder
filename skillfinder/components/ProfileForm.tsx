import { Field, TextArea } from "@/components/Field";
import { readForm } from "@/lib/utils";
import type { Profile, ProfileUpdate } from "@/lib/types";

export const ProfileForm = ({ profile, onSave }: { profile: Profile; onSave: (v: ProfileUpdate) => Promise<void> }) => (
  <form
    className="card space-y-3"
    onSubmit={(e) => {
      const { values: v } = readForm(e);
      onSave(profile.role === "artisan"
        ? { full_name: v.full_name, trade: v.trade, city: v.city, bio: v.bio }
        : { full_name: v.full_name, city: v.city });
    }}
  >
    <Field label="Full name" name="full_name" defaultValue={profile.full_name} required />
    <Field label="City" name="city" defaultValue={profile.city ?? ""} />
    {profile.role === "artisan" && (
      <>
        <Field label="Trade (e.g. Plumber)" name="trade" defaultValue={profile.trade ?? ""} />
        <TextArea label="About you" name="bio" defaultValue={profile.bio ?? ""} />
      </>
    )}
    <button className="btn">Save profile</button>
  </form>
);
