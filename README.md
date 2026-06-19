[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/mixlabpro-mcp-uiux-badge.png)](https://mseep.ai/app/mixlabpro-mcp-uiux)

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

- [js直接使用tools](./example/index.js)

```javascript
const {
  prepareTools,
  callOpenAIFunctionAndProcessToolCalls
} = require('mcp-uiux/dist/MCPClient.js')

;(async () => {
  // 使用memory mcp测试
  // win  -  https://github.com/shadowcz007/aio_mcp_exe/releases/download/0.1/mcp_server_memory.exe
  // mac  -  https://github.com/shadowcz007/aio_mcp_exe/releases/download/0.1/mcp_server_memory

  const url = 'http://127.0.0.1:8080'

  let { mcpClient, tools, toolsFunctionCall, systemPrompts } =
    await prepareTools(url)

  const knowledgeExtractorPrompt = systemPrompts.find(
    s => s.name === 'knowledge_extractor'
  )

  const knowledgeTools = toolsFunctionCall.filter(t =>
    ['create_relations', 'create_entities'].includes(t.function.name)
  )

  console.log(knowledgeTools)
  console.log(
    '---------------',
    knowledgeExtractorPrompt?.systemPrompt,
    '---------------'
  )

  // 工具调用
  let toolsResult = await callOpenAIFunctionAndProcessToolCalls(
    knowledgeExtractorPrompt?.systemPrompt,
    `mixlab的AI编程训练营，助力每一位新时代的创作者。`,
    knowledgeTools,
    'Qwen/Qwen2.5-7B-Instruct', // 或其他支持 function calling 的模型
    'sk-', // 替换为你的 OpenAI API Key
    'https://api.siliconflow.cn/v1/chat/completions', 
    chunk => {
      console.log(chunk)
    }
  )

  console.log('#工具调用结果:', JSON.stringify(toolsResult, null, 2))

  for (const item of toolsResult) {
    let tool = tools.find(t => t.name == item.name)
    let result = await tool.execute(item.arguments)
    console.log('工具执行结果', item.name, result)
  }

  await mcpClient.disconnect()
})()

```

- [react](./example/src/App.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, useMCP, MCPStatus } from 'mcp-uiux';

const AppContent: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8080');
  const [resourcePath, setResourcePath] = useState('');
  const {
    connect,
    disconnect,
    loading,
    error,
    tools,
    toolsFunctionCall,//function格式的tool
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
        // 如果需要知识提取，可以参考 js直接使用tools
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

- UMD 使用方式

除了通过 npm 安装使用外，MCP UIUX 也支持通过 UMD 方式在浏览器中直接使用。通过 CDN 引入

```html
<!-- 引入 React 和 ReactDOM -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- 引入 MCP UIUX -->
<script src="https://unpkg.com/mcp-uiux@latest/dist/index.umd.min.js"></script>

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


- Next.js 使用
```
"use client";
import dynamic from 'next/dynamic'
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 使用动态导入延迟加载整个 mcp-uiux 库
const ExternalMCPProvider = dynamic(
  () => import('mcp-uiux').then(mod => mod.MCPProvider),
  { ssr: false }
)

// 定义 MCP 上下文类型
interface MCPContextType {
  connect: (address: string) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  tools: any[];
  prompts: any[];
}

// 创建上下文
const MCPContext = createContext<MCPContextType | undefined>(undefined);

// 自定义 Hook 用于访问 MCP 上下文
export function useMCPContext() {
  const context = useContext(MCPContext);
  if (context === undefined) {
    throw new Error("useMCPContext 必须在 MCPProvider 内部使用");
  }
  return context;
}

// 内部 MCP 连接组件
function MCPConnection({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [mcpAddress, setMcpAddress] = useState<string>("");
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 使用动态导入获取 mcp-uiux 库
  const [mcpModule, setMcpModule] = useState<any>(null);

  useEffect(() => {
    // 仅在客户端加载 MCP 相关功能
    if (typeof window !== 'undefined') {
      import('mcp-uiux').then(mod => {
        setMcpModule(mod);
      });
    }
  }, []);

  // 从本地存储加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem("systemConfig");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setMcpAddress(config.mcpAddress);
      } catch (error) {
        console.error("无法解析保存的配置:", error);
      }
    }
  }, []);

  // MCPConnectionEffect 组件，这是一个真正的 React 组件，可以在其中使用 Hooks
  const MCPConnectionEffect = React.useCallback(() => {
    // 在这个组件中使用 useMCP hook
    if (!mcpModule) return null;
    
    const { useMCP } = mcpModule;
    const mcpHook = useMCP();
    
    useEffect(() => {
      // 使用 mcpHook 的值更新外部组件的状态
      setLoading(mcpHook.loading || false);
      
      if (mcpHook.error) {
        setError(mcpHook.error);
        setIsConnected(false);
      }
      
      if (mcpHook.tools && mcpHook.tools.length > 0) {
        setTools(mcpHook.tools);
        setIsConnected(true);
      }
      
      if (mcpHook.prompts && mcpHook.prompts.length > 0) {
        setPrompts(mcpHook.prompts);
      }
      
      // 如果有 MCP 地址，尝试自动连接
      const connectToMCP = async () => {
        if (mcpAddress && !isConnected && mcpHook.connect) {
          try {
            setError(null);
            await mcpHook.connect(mcpAddress, '');
          } catch (err) {
            setError(err instanceof Error ? err.message : "连接失败");
            setIsConnected(false);
          }
        }
      };
      
      connectToMCP();
    }, [mcpHook]);
    
    return null;
  }, [mcpModule, mcpAddress, isConnected]);

  // 连接到 MCP
  const connect = async (address: string) => {
    if (!mcpModule) return;
    
    try {
      setError(null);
      setLoading(true);
      
      // 保存地址以便后续使用
      setMcpAddress(address);
      
      // 实际连接会在 MCPConnectionEffect 组件中处理
      // 这里只是设置了状态
    } catch (err) {
      setError(err instanceof Error ? err.message : "连接失败");
      setIsConnected(false);
      setLoading(false);
    }
  };

  // 断开连接
  const disconnect = () => {
    setIsConnected(false);
    setTools([]);
  };

  return (
    <MCPContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        isConnecting: loading,
        error,
        tools,
        prompts
      }}
    >
      {/* 渲染 MCPConnectionEffect 组件 */}
      {mcpModule && <MCPConnectionEffect />}
      {children}
    </MCPContext.Provider>
  );
}

// MCP 提供器组件
export function MCPProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // 确保组件只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ExternalMCPProvider>
      <MCPConnection>{children}</MCPConnection>
    </ExternalMCPProvider>
  );
}
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



