import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Card, message } from 'antd';
import { SaveOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { useStores } from '../../stores';
import { RichTextEditor } from '../../components/RichTextEditor/RichTextEditor';
import { ImageUpload } from '../../components/ImageUpload/ImageUpload';
import { CreateArticleDto } from '../../api/articles';
import styles from './ArticleForm.module.css';

const { Option } = Select;
const { TextArea } = Input;

export const ArticleForm: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { articleStore, categoryStore } = useStores();
  const [form] = Form.useForm();

  useEffect(() => {
    categoryStore.fetchCategories();

    if (isEditMode && id) {
      articleStore.fetchArticleById(Number(id));
    }

    return () => {
      articleStore.clearCurrentArticle();
    };
  }, [id]);

  useEffect(() => {
    if (isEditMode && articleStore.currentArticle) {
      form.setFieldsValue({
        title: articleStore.currentArticle.title,
        content: articleStore.currentArticle.content,
        summary: articleStore.currentArticle.summary,
        category_id: articleStore.currentArticle.category_id,
        cover_image_id: articleStore.currentArticle.cover_image_id,
      });
    }
  }, [articleStore.currentArticle, form]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      const values = await form.validateFields();
      const data: CreateArticleDto = {
        ...values,
        status,
      };

      if (isEditMode && id) {
        await articleStore.updateArticle(Number(id), data);
        message.success('文章更新成功');
      } else {
        await articleStore.createArticle(data);
        message.success('文章创建成功');
      }

      navigate('/articles');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    navigate('/articles');
  };

  return (
    <div className={styles.container}>
      <Card
        title={isEditMode ? '编辑文章' : '创建文章'}
        extra={
          <Button icon={<CloseOutlined />} onClick={handleCancel}>
            取消
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'draft',
          }}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[
              { required: true, message: '请输入文章标题' },
              { max: 255, message: '标题不能超过255个字符' },
            ]}
          >
            <Input placeholder="请输入文章标题" size="large" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category_id"
            rules={[{ required: true, message: '请选择文章分类' }]}
          >
            <Select
              placeholder="请选择文章分类"
              size="large"
              loading={categoryStore.loading}
            >
              {categoryStore.categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面图片" name="cover_image_id">
            <ImageUpload />
          </Form.Item>

          <Form.Item
            label="文章摘要"
            name="summary"
            extra="可选，如果不填写将自动从内容中提取"
          >
            <TextArea
              rows={3}
              placeholder="请输入文章摘要"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="文章内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <RichTextEditor />
          </Form.Item>

          <Form.Item>
            <Space size="large">
              <Button size="large" onClick={handleCancel}>
                取消
              </Button>
              <Button
                size="large"
                icon={<SaveOutlined />}
                loading={articleStore.loading}
                onClick={() => handleSubmit('draft')}
              >
                保存为草稿
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                loading={articleStore.loading}
                onClick={() => handleSubmit('published')}
              >
                {isEditMode ? '更新并发布' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});
