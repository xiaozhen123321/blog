import React, { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { uploadImage } from '../../api/images';
import { getImageUrl } from '../../utils/helpers';
import styles from './ImageUpload.module.css';

interface Props {
  value?: number | null;
  onChange?: (imageId: number | null) => void;
}

export const ImageUpload: React.FC<Props> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    value ? getImageUrl(value) : null
  );

  const handleUpload = async (file: RcFile) => {
    setUploading(true);
    try {
      const response = await uploadImage(file);
      const imageId = response.data.id;
      const url = getImageUrl(imageId);

      setImageUrl(url);
      onChange?.(imageId);
      message.success('图片上传成功');
    } catch (error) {
      message.error('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    onChange?.(null);
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！');
      return false;
    }

    handleUpload(file);
    return false; // 阻止自动上传
  };

  return (
    <div className={styles.uploadWrapper}>
      {imageUrl ? (
        <div className={styles.preview}>
          <Image
            src={imageUrl}
            alt="Cover"
            className={styles.image}
            preview={{
              mask: <div>预览图片</div>,
            }}
          />
          <div className={styles.actions}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemove}
              size="small"
            >
              删除图片
            </Button>
          </div>
        </div>
      ) : (
        <Upload
          accept="image/*"
          beforeUpload={beforeUpload}
          showUploadList={false}
          disabled={uploading}
        >
          <Button
            icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? '上传中...' : '上传封面图'}
          </Button>
          <div className={styles.hint}>
            支持 JPG、PNG、GIF、WebP 格式，最大 5MB
          </div>
        </Upload>
      )}
    </div>
  );
};
