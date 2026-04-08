# TransBiolab — Dataset Evaluation Website

PLRealsense 透明物体数据集评测结果展示页面。包含 SAM3 分割和 FoundationPose 6D 位姿估计的定量/定性评测对比。

## 📁 目录结构

```
.
├── index.html          # 主页面
├── style.css           # 样式表
├── app.js              # 交互逻辑
├── rgb/                # 原始 RGB 图像 (20张)
├── sam3/               # SAM3 分割可视化 (20张)
├── fp_gt/              # FoundationPose GT 3D bbox (20张)
├── fp_pred/            # FoundationPose 预测 3D bbox (20张)
├── deploy.sh           # GitHub Pages 部署脚本
├── pack.sh             # 打包脚本
└── README.md           # 本文件
```

## 🖥️ 本地预览

```bash
# 方法1: Python HTTP 服务器
python3 -m http.server 8765
# 访问 http://localhost:8765

# 方法2: 直接双击 index.html（图片可能因跨域限制无法显示）
```

## 🚀 部署到 GitHub Pages

```bash
# 确保已配置好 SSH key 并有仓库推送权限
chmod +x deploy.sh
./deploy.sh
```

部署后首次需要在 GitHub 仓库 Settings → Pages 中启用:
- Source: `Deploy from a branch`
- Branch: `main` / `(root)`

网站地址: https://dualtransparency.github.io/TransBiolab/

## 📦 打包分享

```bash
chmod +x pack.sh
./pack.sh
# 生成 TransBiolab_website_YYYYMMDD.tar.gz
```

## ✏️ 修改指南

### 修改文字内容
编辑 `index.html`，所有文本和数据表格都在 HTML 中。

### 修改样式
编辑 `style.css`，颜色变量在 `:root` 中定义:
- `--accent-sam3`: SAM3 的紫色主题
- `--accent-fp`: FoundationPose 的蓝色主题

### 添加/替换图片
- 图片命名格式: `{序号}_{场景ID}_f{帧号}.png`
- 例: `01_000013_f000102.png`
- 放入对应目录 (`rgb/`, `sam3/`, `fp_gt/`, `fp_pred/`)
- 在 `app.js` 的 `FRAMES` 数组中更新帧列表

### 添加新场景
在 `app.js` 顶部的 `FRAMES` 数组中添加新条目:
```javascript
{ id: '21', scene: '000015', frame: '002234', vp: 'VP06' },
```

## 📊 数据来源

- **SAM3 评测**: `eval_sam3_plrealsense.py` → `summary.json`
- **FoundationPose 评测**: `eval_batch_plrealsense.py` → `results_summary.json`
- **可视化图**: 之前生成的对比图 (`vis_web/` 子目录)
