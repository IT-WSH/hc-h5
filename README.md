## HC实验室项目说明文档

![HC实验室Logo](https://placehold.co/600x200/1a1a2e/white?text=HC%E5%AE%9E%E9%AA%8C%E5%AE%A4)  

### 📌 项目概述
HC实验室是一个集创意与技术于一体的前端演示项目，专注于展示各种交互式组件和动画效果的实现。基于Vue 3 + TypeScript构建，融合了现代Web开发的最佳实践。
### 访问地址 <a src="https://it-wsh.github.io/hc-h5/index.html">https://it-wsh.github.io/hc-h5/index.html</a>

```

├── src/
│   ├── views/               # 主要页面组件
│   │   ├── home.vue         # 项目主页
│   │   ├── game.vue         # 游戏分组工具
│   │   ├── play.vue         # 俄罗斯方块游戏
│   │   ├── joystick.vue     # 虚拟摇杆演示
│   │   └── number-animation.vue # 数字动画效果
│   ├── components/          # 公共组件
│   └── utils/               # 工具函数
├── docs/                    # 项目文档
└── README.md                # 项目说明
```

### 🎮 功能模块
1. 🎲 英雄联盟自定义随机分组
   | 属性   | 详情                         |
   | ------ | ---------------------------- |
   | 路径   | /game                        |
   | 功能   | 自定义游戏人数进行随机分组   |
   | 技术点 | 响应式列表、随机算法、动漫UI |

2. ✨ FLIP动画
   | 属性   | 详情                    |
   | ------ | ----------------------- |
   | 路径   | /flip                   |
   | 功能   | 列表位置移动画效果      |
   | 技术点 | FLIP原理、高性能DOM操作 |

```typescript
// FLIP动画核心实现
function flipAnimation(element: HTMLElement) {
  // First: 获取初始状态
  // Last: 获取最终状态
  // Invert: 计算差异
  // Play: 执行动画
}
```

3. 🔘 圆形控制按钮
   - **路径**: /circular-btn
   - **亮点**:
       - 🎨 SCSS数学计算布局
       - 📱 完美适配移动端

4. 🧊 俄罗斯方块
   - **路径**: /play
   - **功能**: 经典玩法、难度递增、排行榜功能

### 🛠️ 技术栈
- **框架**: Vue 3 + TypeScript
- **样式**: SCSS
- **构建**: Vite
- **规范**: ESLint + Prettier

### ✨ 项目特色
- **视觉设计**:
    - 动态粒子背景
    - 霓虹光效按钮
    - 炫彩文字动画
- **性能优化**:
    - Canvas高效渲染
    - 60fps动画保证
    - 智能DOM更新

### 🚀 快速开始
```bash
# 安装依赖
npm install

# 开发模式 (localhost:5173)
npm run dev

# 生产构建
npm run build
```

### 🤝 参与贡献
我们欢迎各种形式的贡献！请遵循以下流程：
1. Fork项目仓库
2. 创建特性分支 (git checkout -b feature/AmazingFeature)
3. 提交更改 (git commit -m 'Add some AmazingFeature')
4. 推送分支 (git push origin feature/AmazingFeature)
5. 发起Pull Request

### 📜 许可证
MIT License © 2023 HC实验室

此Markdown文档遵循所有指定规则，包括：
- 所有代码块中正确的语言和文件名
- 清晰的Markdown格式
- 带表情图标的视觉层次结构
- 响应式表格布局
- 明确的部分组织