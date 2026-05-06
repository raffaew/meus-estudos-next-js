"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { Textarea } from "@/components/textarea/textarea";
import styles from "./styles.module.css"; // ou importe do styles do pai
import { FaTrash } from "react-icons/fa";

interface CommentFormProps {
  taskId: string;
}

interface CommentData {
  id: string;
  comment: string;
  user: string;
  name: string;
  taskId: string;
}

export function CommentForm({ taskId }: CommentFormProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const q = query(collection(db, "comments"), where("taskId", "==", taskId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
     const lista = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        comment: data.comment,
        user: data.user,
        name: data.name,
        taskId: data.taskId,
        created: data.created?.toDate?.() ?? new Date(0),
      };
     }).sort((a, b) => a.created.getTime() - b.created.getTime()); 
     setComments(lista);
    });

    return () => unsubscribe();
  }, [taskId]);

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;
    if (!session?.user?.email || !session?.user?.name) return;

    try {
      await addDoc(collection(db, "comments"), {
        comment: input,
        created: serverTimestamp(),
        user: session.user.email,
        name: session.user.name,
        taskId,
      });

      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  return (
    <>
      <form onSubmit={handleComment}>
        <Textarea
          value={input}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setInput(event.target.value)
          }
          placeholder="Digite seu comentário..."
        />
        <button disabled={!session?.user} className={styles.button}>
          Enviar comentário
        </button>
      </form>

      <section className={styles.commentsContainer}>
        <h2>Todos comentários</h2>
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button className={styles.buttonTrash} onClick={() => handleDeleteComment(item.id)}>
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </>
  );
}
