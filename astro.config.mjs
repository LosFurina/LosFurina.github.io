// @ts-check

// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // 1. 确保 output 是 static（或者干脆不写这行，默认就是 static）
  output: 'static',

  // 2. 如果你是部署到 GitHub Pages (LosFurina.github.io)
  // 且你的项目不是在子路径下，site 应该如下配置：
  site: 'https://LosFurina.github.io',


  // 3. 检查这里！绝对不要有 adapter 这一项
  // adapter: ... <--- 如果有，请整行删掉
});
