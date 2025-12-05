import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Avatar,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  StopOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../stores';
import { Article } from '../../api/articles';
import { formatDate, getImageUrl } from '../../utils/helpers';
import { useDebounce } from '../../utils/hooks';
import styles from './ArticleList.module.css';

const { Option } = Select;
const { Search } = Input;

export const ArticleList: React.FC = observer(() => {
  const { articleStore, categoryStore } = useStores();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  useEffect(() => {
    categoryStore.fetchCategories();
    articleStore.fetchArticles();
  }, []);

  useEffect(() => {
    articleStore.setFilters({ keyword: debouncedKeyword });
    articleStore.fetchArticles();
  }, [debouncedKeyword]);

  const handleCreate = () => {
    navigate('/articles/new');
  };

  const handleEdit = (id: number) => {
    navigate(`/articles/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await articleStore.deleteArticle(id);
      message.success('文章已删除');
      articleStore.fetchArticles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await articleStore.publishArticle(id);
      message.success('文章已发布');
    } catch (error) {
      message.error('发布失败');
    }
  };

  const handleStatusFilter = (value: string) => {
    articleStore.setFilters({ status: value as any });
    articleStore.fetchArticles();
  };

  const handleCategoryFilter = (value: number | undefined) => {
    articleStore.setFilters({ category_id: value });
    articleStore.fetchArticles();
  };

  const handlePageChange = (page: number, pageSize: number) => {
    articleStore.fetchArticles({ page, limit: pageSize });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text: string, record: Article) => (
        <Space>
          {record.cover_image_id && (
            <Avatar
              shape="square"
              size={64}
              src={getImageUrl(record.cover_image_id)}
            />
          )}
          <a onClick={() => handleEdit(record.id)} className={styles.articleTitle}>
            {text}
          </a>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category_name',
      key: 'category',
      width: '12%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: '10%',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created',
      width: '15%',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'actions',
      width: '23%',
      render: (_: any, record: Article) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          {record.status === 'draft' ? (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<StopOutlined />}
              disabled
            >
              已发布
            </Button>
          )}
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              onChange={handleStatusFilter}
              allowClear
            >
              <Option value="">全部</Option>
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
            </Select>
            <Select
              placeholder="分类"
              style={{ width: 150 }}
              onChange={handleCategoryFilter}
              loading={categoryStore.loading}
              allowClear
            >
              {categoryStore.categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            <Search
              placeholder="搜索文章标题..."
              allowClear
              style={{ width: 250 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建文章
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={articleStore.articles}
        columns={columns}
        loading={articleStore.loading}
        rowKey="id"
        pagination={{
          current: articleStore.pagination.page,
          total: articleStore.pagination.total,
          pageSize: articleStore.pagination.limit,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 篇文章`,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
});
