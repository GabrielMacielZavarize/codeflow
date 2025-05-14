import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, Users, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'completed';
  createdAt: string;
  createdBy: string;
  downloadUrl?: string;
}

const Reports = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        // Simular carregamento de relatórios
        const mockReports: Report[] = [
          {
            id: '1',
            title: 'Relatório Diário - 20/03/2024',
            type: 'daily',
            status: 'completed',
            createdAt: '2024-03-20',
            createdBy: 'Gabriel M.',
            downloadUrl: '#'
          },
          {
            id: '2',
            title: 'Relatório Semanal - Semana 12',
            type: 'weekly',
            status: 'completed',
            createdAt: '2024-03-19',
            createdBy: 'Pedro H.',
            downloadUrl: '#'
          },
          {
            id: '3',
            title: 'Relatório Mensal - Março/2024',
            type: 'monthly',
            status: 'pending',
            createdAt: '2024-03-18',
            createdBy: 'Maria S.'
          }
        ];
        setReports(mockReports);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        toast.error(t.reports.errorLoading);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [t.reports.errorLoading]);

  const handleDownload = (report: Report) => {
    if (report.downloadUrl) {
      // Removendo o toast de sucesso para evitar duplicação
      // O toast já é mostrado em outro lugar
    } else {
      toast.error(t.reports.downloadError);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'weekly':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'monthly':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.general.loading}</p>
        </div>
      </div>
    );
  }

  const completedReports = reports.filter(report => report.status === 'completed').length;
  const pendingReports = reports.filter(report => report.status === 'pending').length;
  const totalReports = reports.length;
  const completionRate = totalReports > 0 ? (completedReports / totalReports) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">{t.reports.title}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            {t.reports.description}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => {
            // Removendo o toast duplicado
            // O toast já é mostrado em outro lugar
          }} className="flex-1 sm:flex-none">
            <FileText className="h-4 w-4 mr-2" />
            {isMobile ? t.reports.generate : t.reports.generateReport}
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.reports.totalReports}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{totalReports}</h3>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.reports.completedReports}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{completedReports}</h3>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.reports.pendingReports}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{pendingReports}</h3>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.reports.teamMembers}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">5</h3>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{t.reports.overallProgress}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{t.reports.completionRate}</span>
              <span>{completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{t.reports.recentReports}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border dark:border-gray-800"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">{report.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className={getTypeColor(report.type)}>
                      {report.type === 'daily' ? t.reports.daily :
                        report.type === 'weekly' ? t.reports.weekly :
                          t.reports.monthly}
                    </Badge>
                    <Badge variant="secondary" className={getStatusColor(report.status)}>
                      {report.status === 'completed' ? t.reports.completed :
                        t.reports.pending}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t.reports.createdBy}: {report.createdBy}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t.reports.createdAt}: {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  {report.downloadUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(report)}
                      className="ml-2"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
