"use client";

import { updateMe, UpdateMeRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const user = useAuthStore((store) => store.user);
  const setUser = useAuthStore((store) => store.setUser);
  const router = useRouter();

  const handleSave = async (formData: FormData) => {
    const updateMeRequest = {
      ...Object.fromEntries(formData),
      email: user!.email,
    } as unknown as UpdateMeRequest;
    const updatedUser = await updateMe(updateMeRequest);
    setUser(updatedUser);
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user!.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user!.username}
            />
          </div>

          <p>Email: {user!.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
