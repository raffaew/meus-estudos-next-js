// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import styles from "./styles.module.css";
import { TaskForm } from "@/components/taskForm/taskForm";
import { TaskList } from "@/components/taskList/taskList";

export const metadata = {
  title: "Meu painel de tarefas",
};

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  // busca inicial no servidor
  const snapshot = await getDocs(
    query(
      collection(db, "tarefas"),
      where("user", "==", session.user.email),
      orderBy("created", "desc")
    )
  );

  const initialTasks: TaskProps[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    tarefa: doc.data().tarefa,
    created: doc.data().created,
    user: doc.data().user,
    public: doc.data().public,
  }));

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <TaskForm userEmail={session.user.email!} />
          </div>
        </section>
        <TaskList
          userEmail={session.user.email!}
          initialTasks={initialTasks} // ← dados iniciais do servidor
        />
      </main>
    </div>
  );
}