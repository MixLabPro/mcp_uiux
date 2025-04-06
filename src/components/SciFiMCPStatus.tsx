import React, { useState } from 'react';
import './SciFiMCPStatus.css'

import InputSchemaForm from './InputSchemaForm';

export const SciFiMCPStatus: React.FC<{
    serverInfo: any | null;
    loading: boolean;
    error: string | null;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
    notifications: any;
}> = ({ serverInfo, loading, error, tools, resources, resourceTemplates, prompts, notifications }) => {

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>(null);

    const handleItemSelect = (item: any) => {
        setSelectedItem(item);
        setFormData(null);
    };

    const handleFormComplete = (data: any) => {
        setFormData(data);
        setSelectedItem(null);
    };

    return (
        <div className="sci-fi-container">
            {/* 全息投影效果的标题 */}
            <div className="hologram-title">
                <h1>MCP 系统状态监控</h1>
                <div className="status-indicator">
                    {loading ? (
                        <span className="pulse loading">系统扫描中...</span>
                    ) : error ? (
                        <span className="pulse error">警告：系统异常</span>
                    ) : (
                        <span className="pulse active">系统在线 {serverInfo?.name && `- ${serverInfo.name}`}</span>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-panel">
                    <div className="error-icon">⚠</div>
                    <div className="error-message">{error}</div>
                </div>
            )}

            {Object.keys(notifications).length > 0 && <div className='module' style={{ margin: 20 }}>
                {
                    Object.keys(notifications).map((key, index) => (
                        <div key={index}>
                            {key}: {notifications[key]}
                        </div>
                    ))
                }
            </div>}
            {!loading && !error && (<div style={{ display: 'flex' }}>
                <div className="data-grid">
                    {/* 工具模块 */}
                    {tools.length > 0 && <div className="module">
                        <div className="module-header">
                            <span className="module-icon">⚡</span>
                            <h2>系统工具库</h2>
                            <span className="count">{tools.length}</span>
                        </div>
                        <div className="scrollable-content">
                            {tools.map((tool, index) => (
                                <div key={index} className="item"
                                    onClick={() => handleItemSelect(tool)}
                                >
                                    <span className="item-indicator"></span>
                                    {tool.name}
                                </div>
                            ))}
                        </div>
                    </div>}

                    {/* 资源模块 */}
                    {resources.length > 0 && <div className="module">
                        <div className="module-header">
                            <span className="module-icon">📦</span>
                            <h2>资源矩阵</h2>
                            <span className="count">{resources.length}</span>
                        </div>
                        <div className="scrollable-content">
                            {resources.map((resource, index) => (
                                <div key={index} className="item">
                                    <span className="item-indicator"></span>
                                    {decodeURIComponent(resource.uri)}
                                </div>
                            ))}
                        </div>
                    </div>}

                    {/* 提示模块 */}
                    {prompts.length > 0 && <div className="module">
                        <div className="module-header">
                            <span className="module-icon">💡</span>
                            <h2>AI 提示库</h2>
                            <span className="count">{prompts.length}</span>
                        </div>
                        <div className="scrollable-content">
                            {prompts.map((prompt, index) => (
                                <div key={index} className="item"
                                >
                                    <span className="item-indicator"></span>
                                    {prompt.name}
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
                {selectedItem && <div className='module' style={{}}>
                    <InputSchemaForm tool={selectedItem} onComplete={handleFormComplete} />
                </div>}
                {formData && <div className='module' style={{ margin: 20 }}>
                    <h4>数据</h4>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                </div>}
            </div>
            )}
        </div>
    );
};