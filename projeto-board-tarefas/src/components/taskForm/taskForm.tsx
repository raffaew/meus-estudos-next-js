"use client";
import { ChangeEvent, useState } from "react"; // remove FormEvent
import { Textarea } from "../textarea/textarea";
import styles from "./styles.module.css";
import { createTask } from "@/services/saveTask";

interface TaskFormProps {
  userEmail: string;
}

export function TaskForm({ userEmail }: TaskFormProps) {
  const [input, setInput] = useState<string>("");
  const [publicTask, setPublicTask] = useState<boolean>(false);

  async function handleRegisterTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (input === "") return;

    try {
      await createTask({
        tarefa: input,
        created: new Date(),
        user: userEmail,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  return (
    <form onSubmit={handleRegisterTask}>
      <Textarea
        placeholder="Digite qual sua tarefa..."
        value={input}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setInput(event.target.value)
        }
      />
      <div className={styles.checkboxArea}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={publicTask}
          onChange={handleChangePublic}
        />
        <label>Deixar tarefa publica?</label>
      </div>

      <button className={styles.button} type="submit">
        Registrar
      </button>
    </form>
  );
}
