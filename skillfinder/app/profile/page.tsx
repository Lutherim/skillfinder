"use client";
import { useState } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services/ProfileService";
import { errorMessage } from "@/lib/utils";

const ProfilePage = () => {
  const { setProfile } = useAuth();
  const [msg, setMsg] = useState("");

  return (
    <RequireAuth>
      {(profile) => (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">My profile</h1>
          <ProfileForm
            profile={profile}
            onSave={async (changes) => {
              try {
                setProfile(await profileService.update(profile.id, changes));
                setMsg("Profile saved");
              } catch (e) {
                setMsg(errorMessage(e));
              }
            }}
          />
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      )}
    </RequireAuth>
  );
};

export default ProfilePage;
