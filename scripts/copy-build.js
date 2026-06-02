// ============================================
// 构建后处理：将前端构建产物复制到 server/public/
// ============================================
const fs = require('fs');
const path = require('path');

const clientDist = path.join(__dirname, '..', 'client', 'dist');
const serverPublic = path.join(__dirname, '..', 'server', 'public');

// 清理旧的public目录
if (fs.existsSync(serverPublic)) {
  fs.rmSync(serverPublic, { recursive: true });
}

// 递归复制
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(clientDist, serverPublic);
console.log(`✅ Built frontend copied to: ${serverPublic}`);
