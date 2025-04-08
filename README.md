# MCP UIUX

Use and manage MCP with elegance and precision.

MCP UIUX 是一个 React 组件库，专门用于实现模型上下文协议(Model Context Protocol)中的工具(Tools)、提示(Prompts)和资源(Resources)管理。它提供了直观的界面来连接和展示 MCP 服务器的状态和数据。

[在线使用](https://shadowcz007.github.io/mcp_uiux/)

[关注 https://codenow.wiki/ 获得更多](https://codenow.wiki/)


![1744007468429](https://github.com/user-attachments/assets/ae64c933-7f27-49f0-a60e-f550093d3e0b)


## 主要功能

- Tools 工具管理：集成和调用 MCP 服务器提供的各类工具
- Prompts 提示管理：创建和维护 AI 提示模板
- Resources 资源管理：处理和展示各类资源数据
- 实时连接：与 MCP 服务器保持实时数据同步
- 科幻界面：提供现代化的用户交互体验

## 安装
```bash
npm install mcp-uiux
```

## 功能特点

- 实时连接 MCP 服务器
- 展示系统工具库状态
- 显示资源矩阵信息
- 管理 AI 提示库
- 科幻风格的 UI 界面
- 支持错误处理和加载状态

## 使用示例

```typescript
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, useMCP, MCPStatus } from 'mcp-uiux';

const AppContent: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8080');
  const [resourcePath, setResourcePath] = useState('');
  const {
    connect,
    loading,
    error,
    tools,
    resources,
    resourceTemplates,
    prompts
  } = useMCP();

  useEffect(() => {
    connect(serverUrl, resourcePath);
  }, [serverUrl, resourcePath]);

  return (
  <div>
      <button onClick={()=>{
        // 工具调用
        tools[0].excute({});
    }}></button>

     <MCPStatus
        serverUrl={serverUrl}
      />
  </div>
  );
};

const App: React.FC = () => {
  return (
    <MCPProvider>
      <AppContent />
    </MCPProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```


```typescript
import React from 'react';
import { MCPProvider, useMCP } from 'mcp-uiux';

const App = () => {
  const {
    connect,
    loading,
    error,
    tools,
    resources,
    resourceTemplates,
    prompts
  } = useMCP();

  useEffect(() => {
    // 连接到 MCP 服务器
    connect('http://localhost:8080', '');
  }, []);

  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>错误：{error}</div>}
      
      <div>
        <h3>工具列表 ({tools.length})</h3>
        <ul>
          {tools.map((tool, index) => (
            <li key={index}>{tool.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 使用 MCPProvider 包装应用
const Root = () => {
  return (
    <MCPProvider>
      <App />
    </MCPProvider>
  );
};

export default Root;
```

## 配置参数

- `serverUrl`: MCP 服务器地址，默认为 `http://localhost:8080`
- `resourcePath`: 资源路径过滤器，默认为空字符串 `""`

## 配套服务器

本组件库可以与 [Memory MCP Server](https://github.com/shadowcz007/memory_mcp) 配合使用。

## 完整示例

参考示例代码：[example](./example)

## API 参考

### useMCP Hook

返回值：
- `connect`: 连接服务器的函数
- `loading`: 加载状态
- `error`: 错误信息
- `tools`: 工具列表
- `resources`: 资源列表
- `resourceTemplates`: 资源模板
- `prompts`: AI 提示列表

### SciFiMCPStatus 组件

科幻风格的状态展示组件，包含：
- 系统状态监控
- 工具库展示
- 资源矩阵
- AI 提示库

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## UMD 使用方式

除了通过 npm 安装使用外，MCP UIUX 也支持通过 UMD 方式在浏览器中直接使用：

### 通过 CDN 引入

```html
<!-- 引入 React 和 ReactDOM -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- 引入 MCP UIUX -->
<script src="https://unpkg.com/mcp-uiux@latest/dist/index.umd.min.js"></script>
```

### 基本使用

```html
<script>
  // 使用全局变量 MCPUIUX
  const { MCPProvider, useMCP, MCPStatus } = MCPUIUX;
  
  // 在你的 React 组件中使用
  const App = () => {
    return (
      <MCPProvider>
        {/* 你的应用内容 */}
      </MCPProvider>
    );
  };
</script>
```

完整示例请参考 [umd-example.html](./example/umd-example.html)



