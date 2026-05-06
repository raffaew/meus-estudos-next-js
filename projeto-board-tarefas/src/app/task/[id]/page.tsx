import { redirect } from "next/navigation";
import styles from "./styles.module.css";
import { adminDb } from "@/services/firebaseAdmin";
import { CommentForm } from "@/components/commentForm/commentForm";


interface TaskPageProps {
  params: Promise<{ id: string }>; // ← Promise no Next.js 15
}

interface TaskData {
  tarefa: string;
  public: boolean;
  created: string;
  user: string;
  taskId: string;
}

async function getTask(id: string): Promise<TaskData | null> {
  const docRef = adminDb.collection("tarefas").doc(id);
  const snapshot = await docRef.get();

  // Documento não existe ou não é público → redireciona
  if (!snapshot.exists || !snapshot.data()?.public) {
    return null;
  }

  const data = snapshot.data()!;
  const miliseconds = data.created?.seconds * 1000;

  return {
    tarefa: data.tarefa,
    public: data.public,
    created: new Date(miliseconds).toLocaleDateString("pt-BR"),
    user: data.user,
    taskId: id,
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTask(id);
  if (!task) {
    redirect("/");
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{task.tarefa}</p>
        </article>

        <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>
        <CommentForm taskId={task.taskId} />
      </section>
      </main>
      
    </div>
  );
}