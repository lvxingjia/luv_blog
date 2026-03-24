export default {
  id: 7,
  title: 'RAG 问答机器人：LangChain + Streamlit + ChromaDB 本地实践',
  excerpt:
    '本文记录了我使用 LangChain、Streamlit 和 ChromaDB 本地向量数据库，从零搭建 RAG 问答机器人的完整过程。包含文档处理、MD5 去重、检索增强生成等技术要点。',
  date: '2026-03-24',
  category: '技术分享',
  readTime: '6分钟阅读',
  slug: 'rag-qa-bot-chromadb',
  content: `# RAG 问答机器人：LangChain + Streamlit + ChromaDB 本地实践

最近做了一个企业内部知识库问答项目，基于 RAG 架构，使用 ChromaDB 作为本地向量数据库，LangChain 做编排，Streamlit 搭建前端。数据完全本地化，保护隐私。以下是核心要点。

## 技术栈

| 组件 | 选型 | 理由 |
|------|------|------|
| 编排框架 | LangChain | 生态完善，RAG 链路成熟 |
| 前端 | Streamlit | Python 原生，快速开发 |
| 向量库 | ChromaDB | 轻量级、本地部署、免费 |
| LLM | 阿里云通义千问 / Ollama | 可选云端或本地 |
| Embedding | dashscope / HuggingFace | 支持中英文 |

## RAG 架构

\`\`\`
用户提问 → ChromaDB 检索 → LLM 生成答案
                ↑
知识文档 → 分块 → 向量化 → 存储
\`\`\`

## 核心实现

### 1. MD5 去重

\`\`\`python
import hashlib

def get_md5(text):
    return hashlib.md5(text.encode()).hexdigest()

class DedupChromaDB:
    def add_texts(self, texts):
        new_texts = [t for t in texts if get_md5(t) not in self.cache]
        # 只入库新文档
\`\`\`

### 2. 文档加载与分块

\`\`\`python
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

loader = DirectoryLoader('./docs', glob='**/*.md')
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_documents(docs)
\`\`\`

### 3. ChromaDB 入库

\`\`\`python
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

vector_store = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)
vector_store.persist()
\`\`\`

### 4. Streamlit 前端

\`\`\`python
import streamlit as st
from langchain.chains import RetrievalQA

@st.cache_resource
def init_qa():
    vector_store = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )
    llm = Tongyi(model="qwen-turbo")  # 或 Ollama
    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vector_store.as_retriever(k=4),
        return_source_documents=True
    )

# 对话界面
if prompt := st.chat_input("请输入问题"):
    response = qa_chain.invoke(prompt)
    st.write(response["result"])
    with st.expander("参考来源"):
        for doc in response["source_documents"]:
            st.caption(doc.page_content[:200])
\`\`\`

## 项目结构

\`\`\`
rag-project/
├── app.py           # Streamlit 主程序
├── ingest.py        # 入库脚本
├── chroma_db/       # 向量库存储
├── docs/            # 原始文档
└── requirements.txt
\`\`\`

## 运行命令

\`\`\`bash
pip install streamlit langchain chromadb sentence-transformers
python ingest.py      # 首次入库
streamlit run app.py  # 启动服务
\`\`\`

## 踩坑心得

1. **ChromaDB 持久化**：需指定 \`persist_directory\`，否则数据仅存内存
2. **MD5 去重**：避免重复入库导致向量库膨胀
3. **分块大小**：500 字符 + 50 重叠，平衡上下文完整性和检索精度
4. **缓存机制**：用 \`@st.cache_resource\` 缓存 LLM 实例，避免重复加载

## 总结

ChromaDB + LangChain + Streamlit 是搭建本地 RAG 问答系统的绝佳组合：轻量、免费、隐私安全。整套方案从文档入库到问答界面，代码量不到 200 行，非常适合快速验证和中小规模应用。`,
}
