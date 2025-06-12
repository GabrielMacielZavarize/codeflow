import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Trash2, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Report, generateReport, listReports, deleteReport, downloadReport } from '@/services/reportsService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Reports = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const reportsList = await listReports();
      setReports(reportsList);
      setFilteredReports(reportsList);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...reports];

    // Aplicar filtros
    if (selectedType !== 'all') {
      filtered = filtered.filter(report => report.type === selectedType);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredReports(filtered);
  }, [reports, selectedType, selectedStatus, sortOrder]);

  const handleDownload = async (report: Report) => {
    try {
      await downloadReport(report);
      toast.success('Relatório baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar relatório');
    }
  };

  const handleDelete = async (report: Report) => {
    try {
      await deleteReport(report);
      await loadReports();
      toast.success('Relatório excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir relatório');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsUploading(true);
    try {
      await generateReport(
        uploadFile,
        uploadTitle,
        uploadType,
        currentUser?.uid || '',
        currentUser?.displayName || 'Usuário'
      );
      await loadReports();
      setIsUploadDialogOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadType('daily');
      toast.success('Relatório enviado com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao enviar relatório');
      }
    } finally {
      setIsUploading(false);
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.general.loading}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-4 sm:py-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">{t.reports.title}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            {t.reports.description}
          </p>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 w-full sm:w-auto"
        >
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none hover:scale-105 transition-transform"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isMobile ? t.reports.generate : t.reports.generateReport}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Relatório</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar um novo relatório.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Relatório</Label>
                  <Input
                    id="title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Digite o título do relatório"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Relatório</Label>
                  <Select value={uploadType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setUploadType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tamanho máximo: 900KB
                  </p>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Enviando...' : 'Enviar Relatório'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Filtros */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px] hover:border-primary transition-colors">
            <SelectValue placeholder="Tipo de Relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[180px] hover:border-primary transition-colors">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[180px] hover:border-primary transition-colors"
            >
              Ordenar por Data
              {sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortOrder('asc')}>
              Mais Antigos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder('desc')}>
              Mais Recentes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Lista de Relatórios */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{t.reports.recentReports}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{report.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={`${getTypeColor(report.type)} transition-colors duration-300`}
                        >
                          {report.type === 'daily' ? t.reports.daily :
                            report.type === 'weekly' ? t.reports.weekly :
                              t.reports.monthly}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(report.status)} transition-colors duration-300`}
                        >
                          {report.status === 'completed' ? t.reports.completed :
                            t.reports.pending}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 sm:mt-0">
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {t.reports.createdBy}: {report.createdBy}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {t.reports.createdAt}: {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(report)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(report)}
                          className="hover:scale-110 transition-transform text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Reports;
