import { redirect } from "next/navigation";
import styles from "./styles.module.css";
import { adminDb } from "@/services/firebaseAdmin";

interface TaskPageProps {
  params: Promise<{ id: string }>; // ← Promise no Next.js 15
}

// Tipagem da tarefa
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

  // Se não encontrou ou não é público, redireciona
  if (!task) {
    redirect("/");
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <p>{task.tarefa}</p>
        <p>Criado em: {task.created}</p>
        <p>Usuário: {task.user}</p>
      </main>
    </div>
  );
}