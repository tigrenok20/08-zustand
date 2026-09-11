"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNoteStore } from "@/lib/store/noteStore";
import { NoteTagValues, type NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api/clientApi";

type FormErrors = Partial<Record<"title" | "content" | "tag", string>>;

const validateForm = (values: {
  title: string;
  content: string;
  tag: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  } else if (values.title.trim().length < 3) {
    errors.title = "Name should contain at least 3 letters!";
  } else if (values.title.trim().length > 50) {
    errors.title = "Name should contain 50 letters max!";
  }

  if (values.content.trim().length > 500) {
    errors.content = "Name should contain 500 letters max!";
  }

  if (!NoteTagValues.includes(values.tag as NoteTag)) {
    errors.tag = "Please choose a valid note tag";
  }

  return errors;
};

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
    onError() {
      toast.error("Couldn't create the note");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "Todo");
    const nextErrors = validateForm({ title, content, tag });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    mutate({
      title,
      content,
      tag: tag as NoteTag,
    });
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const close = () => {
    router.back();
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={draft.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          rows={8}
          id="content"
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          name="tag"
          id="tag"
          defaultValue={draft.tag}
          onChange={handleChange}
          className={css.input}
        >
          {NoteTagValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={close}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating" : "Create note"}
        </button>
      </div>
    </form>
  );
}
