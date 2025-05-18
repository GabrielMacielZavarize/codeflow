import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

export type ActivityAction = 'create' | 'update' | 'delete' | 'complete' | 'assign' | 'login' | 'logout';
export type ActivityEntity = 'task' | 'user' | 'team' | 'system';

export interface AuditActivity {
  id: string;
  userId: string;
  userEmail: string;
  timestamp: Date;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId?: string;
  details: string;
}

// Função para obter histórico de atividades
export const getActivities = async (limitCount: number = 50): Promise<AuditActivity[]> => {
  try {
    const activitiesCollection = collection(db, 'auditLogs');
    const q = query(
      activitiesCollection,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      } as AuditActivity;
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return [];
  }
};

// Função para registrar uma nova atividade
export const logActivity = async (
  userId: string,
  userEmail: string,
  action: ActivityAction,
  entity: ActivityEntity,
  entityId: string | undefined,
  details: string
): Promise<void> => {
  try {
    if (!userId || !userEmail) {
      console.error('Erro ao registrar atividade: userId ou userEmail não fornecidos');
      return;
    }

    const activityData = {
      userId,
      userEmail,
      timestamp: Timestamp.fromDate(new Date()),
      action,
      entity,
      details,
      ...(entityId && { entityId })
    };

    await addDoc(collection(db, 'auditLogs'), activityData);
    console.log('Atividade registrada com sucesso:', activityData);
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
  }
};
