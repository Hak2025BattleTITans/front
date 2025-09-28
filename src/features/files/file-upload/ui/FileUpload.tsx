import axiosBase from '@/config/axios';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, } from 'antd';
import type { RcFile } from 'antd/es/upload';
import clsx from 'clsx';
import React, { useState } from 'react';

interface Props {
    className?: string;
    onFileUploaded?: () => void
}

const { Dragger } = Upload;

export const FileUpload: React.FC<Props> = ({ className, onFileUploaded }) => {
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        try {
            if (fileList.length === 0) {
                message.warning('Выберите файл для загрузки');
                return;
            }

            setLoading(true);

            const formData = new FormData();
            formData.append('file', fileList[0]);

            await axiosBase.post('/files/upload', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    "Accept": "application/json",
                }
            });

            //await axiosBase.post('/data/import-csv');

            message.success('Файл успешно загружен');
            setFileList([]);
            onFileUploaded?.();
        } catch (err) {
            message.error(`${fileList[0].name} не удалось загрузить`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={clsx(className)}>
            <Dragger
                accept=".xls,.xlsx,.csv"
                beforeUpload={(file) => {
                    setFileList([file]);
                    return false;
                }}
                fileList={fileList}
                onRemove={() => setFileList([])}
            >
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                    Выберите файл или перетащите его в эту область
                </p>
            </Dragger>

            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                size='large'
                loading={loading}
                style={{ marginTop: 16, width: '100%' }}
            >
                Загрузить
            </Button>
        </div>
    );
};