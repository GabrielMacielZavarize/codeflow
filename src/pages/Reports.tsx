
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MonthlyTasksData, TasksByMemberData, getMonthlyTasksReport, getTasksByMemberReport, exportReport } from '../services/reportsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../contexts/LanguageContext';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

const Reports = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [monthlyData, setMonthlyData] = useState<MonthlyTasksData[]>([]);
  const [memberData, setMemberData] = useState<TasksByMemberData[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    const loadReportsData = async () => {
      setIsLoading(true);
      try {
        const [monthlyReportData, memberReportData] = await Promise.all([
          getMonthlyTasksReport(),
          getTasksByMemberReport()
        ]);
        
        setMonthlyData(monthlyReportData);
        setMemberData(memberReportData);
      } catch (error) {
        console.error('Erro ao carregar dados de relatórios:', error);
        toast({
          title: t.general.error,
          description: t.reports.exportError,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReportsData();
  }, [toast, t]);
  
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const success = await exportReport(exportFormat);
      
      if (success) {
        toast({
          title: t.general.success,
          description: t.reports.exported.replace('FORMAT', exportFormat.toUpperCase())
        });
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        title: t.general.error,
        description: t.reports.exportError,
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Configuração do gráfico de barras
  const barChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: t.navigation.tasks,
        data: monthlyData.map(item => item.tasks),
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1,
      }
    ],
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t.reports.monthlyTasks,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Configuração do gráfico de pizza
  const pieChartData = {
    labels: memberData.map(item => item.name),
    datasets: [
      {
        data: memberData.map(item => item.tasks),
        backgroundColor: memberData.map(item => item.color),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };
  
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t.reports.memberTasks,
      },
    },
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.reports.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.reports.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={exportFormat} onValueChange={(value: 'pdf' | 'csv') => setExportFormat(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} disabled={isExporting}>
            <FileText className="h-4 w-4 mr-2" />
            {isExporting ? t.reports.exporting : t.reports.export}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3 dark:text-gray-300">{t.reports.loading}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.reports.monthlyTasks}</CardTitle>
              <CardDescription>
                {t.reports.monthlyDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t.reports.memberTasks}</CardTitle>
              <CardDescription>
                {t.reports.memberDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
