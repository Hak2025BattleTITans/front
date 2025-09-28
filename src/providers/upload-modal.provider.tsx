import React, { createContext, useContext, useState, type ReactNode, } from 'react';
import {  Modal, } from 'antd';
import { FileUpload } from '@/features/files/file-upload';


interface UploadModalContextType {
    isUploadModalOpen: boolean;
    openUploadModal: () => void;
    closeUploadModal: () => void;
}

const UploadModalContext = createContext<UploadModalContextType | undefined>(undefined);

interface UploadModalProviderProps {
    children: ReactNode;
}

export const UploadModalProvider: React.FC<UploadModalProviderProps> = ({ children }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const openUploadModal = () => {
        setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
    };

    
    const handleUpload = () => {
        setTimeout(()=>{
            window.location.reload();
        }, 200)
        closeUploadModal();
    };

    return (
        <UploadModalContext.Provider value={{ isUploadModalOpen, openUploadModal, closeUploadModal }}>
            {children}

            <Modal
                title="Загрузка файла"
                open={isUploadModalOpen}
                onCancel={closeUploadModal}
                footer={null}
                width={520}
            >
                <FileUpload onFileUploaded={handleUpload}/>
            </Modal>
        </UploadModalContext.Provider>
    );
};

export const useUploadModal = () => {
    const context = useContext(UploadModalContext);

    if (context === undefined) {
        throw new Error('useUploadModal must be used within an UploadModalProvider');
    }

    return context;
};