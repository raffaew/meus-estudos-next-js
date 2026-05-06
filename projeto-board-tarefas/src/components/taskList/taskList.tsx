"use client";
import { db } from "@/services/firebaseConnection";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

interface TaskListProps {
  userEmail: string;
  initialTasks: TaskProps[];
}

export function TaskList({ userEmail, initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);

  useEffect(() => {
    const tarefasRef = collection(db, "tarefas");
    const q = query(
      tarefasRef,
      orderBy("created", "desc"),
      where("user", "==", userEmail),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          tarefa: data.tarefa,
          created: data.created,
          user: data.user,
          public: data.public,
        };
      });
      setTasks(lista);
    });

    return () => unsubscribe(); // ← fecha a conexão ao desmontar o componente
  }, [userEmail]);

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`,
    );
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  return (
    <>
      <section className={styles.taskContainer}>
        <h1>Minhas tarefas</h1>

        {tasks.map((item) => (
          <article key={item.id} className={styles.task}>
            {item.public && (
              <div className={styles.tagContainer}>
                <label className={styles.tag}>PUBLICO</label>
                <button
                  className={styles.shareButton}
                  onClick={() => handleShare(item.id)}
                >
                  <FiShare2 size={22} color="#3183ff" />
                </button>
              </div>
            )}

            <div className={styles.taskContent}>
              {item.public ? (
                <Link href={`/task/${item.id}`}>
                  <p>{item.tarefa}</p>
                </Link>
              ) : (
                <p>{item.tarefa}</p>
              )}

              <button
                className={styles.trashButton}
                onClick={() => handleDeleteTask(item.id)}
              >
                <FaTrash size={24} color="#ea3140" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
