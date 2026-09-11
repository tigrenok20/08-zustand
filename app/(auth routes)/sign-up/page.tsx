"use client";

import css from "./SignUpPage.module.css";
import { useState } from "react";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { ApiError } from "@/lib/api/api";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((store) => store.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(
        formData,
      ) as unknown as RegisterRequest;
      const user = await register(formValues);
      if (user) {
        setUser(user);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Oops... some error",
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
