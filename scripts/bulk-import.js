/**
 * 批量导入知识文件
 * 支持格式: .txt, .md, .json, .csv, .html
 * 
 * 使用方法:
 *   node scripts/bulk-import.js <文件夹路径> [source名称]
 * 
 * 示例:
 *   node scripts/bulk-import.js ./knowledge-files my-docs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const API_BASE = process.env.API_URL || 'http://localhost:3000';

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.json', '.csv', '.html', '.xml', '.text'];

// 读取文件内容
function readFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 对于不同格式，提取纯文本
  if (ext === '.html' || ext === '.xml') {
    return extractTextFromHTML(content);
  }
  
  return content;
}

// 从HTML提取纯文本
function extractTextFromHTML(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 解析JSON文件
function parseJSONFile(content, fileName) {
  try {
    const data = JSON.parse(content);
    // 如果是数组，提取每项的content字段
    if (Array.isArray(data)) {
      return data.map(item => item.content || item.text || item.description || JSON.stringify(item)).join('\n');
    }
    // 如果是对象，提取可能的文本字段
    return data.content || data.text || data.description || JSON.stringify(data);
  } catch {
    return content;
  }
}

// 解析CSV文件
function parseCSVFile(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length <= 1) return content;
  
  // 简单处理：返回前几列的内容
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    return cols.slice(0, 3).join(' - '); // 取前3列
  }).join('\n');
}

// 调用API添加知识
async function addKnowledge(text, source, fileName) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      content: text.substring(0, 10000), // 限制长度
      source: source,
      tags: [path.extname(fileName).slice(1).toUpperCase()],
      type: 'DOCUMENT'
    });

    const url = new URL(`${API_BASE}/api/v1/knowledge/entries`);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch {
          resolve({ success: false, error: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 扫描文件夹
function scanDirectory(dirPath) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath); // 递归扫描子目录
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walk(dirPath);
  return files;
}

// 主函数
async function main() {
  const dirPath = process.argv[2];
  const source = process.argv[3] || 'bulk-import';
  
  if (!dirPath) {
    console.log('用法: node scripts/bulk-import.js <文件夹路径> [source名称]');
    console.log('示例: node scripts/bulk-import.js ./docs my-knowledge');
    process.exit(1);
  }
  
  if (!fs.existsSync(dirPath)) {
    console.error(`错误: 目录不存在: ${dirPath}`);
    process.exit(1);
  }
  
  console.log(`🔍 扫描目录: ${dirPath}`);
  console.log(`📊 来源标签: ${source}`);
  console.log('');
  
  const files = scanDirectory(dirPath);
  console.log(`📁 找到 ${files.length} 个支持的文件\n`);
  
  if (files.length === 0) {
    console.log('没有找到支持的文件 (支持: .txt, .md, .json, .csv, .html)');
    process.exit(0);
  }
  
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = path.basename(file);
    const relativePath = path.relative(dirPath, file);
    
    process.stdout.write(`[${i + 1}/${files.length}] 导入: ${relativePath}... `);
    
    try {
      let content = readFile(file);
      const ext = path.extname(file).toLowerCase();
      
      // 处理不同格式
      if (ext === '.json') {
        content = parseJSONFile(content, fileName);
      } else if (ext === '.csv') {
        content = parseCSVFile(content);
      }
      
      // 跳过空内容
      if (!content || content.trim().length < 5) {
        console.log('⏭️ 跳过 (内容为空)');
        continue;
      }
      
      const result = await addKnowledge(content, source, fileName);
      
      if (result.success) {
        console.log('✅');
        success++;
      } else {
        console.log(`❌ ${result.error?.message || '失败'}`);
        failed++;
      }
      
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
    
    // 避免请求过快
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 导入完成!`);
  console.log(`   ✅ 成功: ${success}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(`   📁 总计: ${files.length}`);
}

main().catch(console.error);
