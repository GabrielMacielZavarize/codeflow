import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.unauthorized.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t.unauthorized.description}
                    </p>
                    <div className="space-y-4">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="w-full"
                        >
                            {t.unauthorized.backToDashboard}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="w-full"
                        >
                            {t.unauthorized.goBack}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized; 