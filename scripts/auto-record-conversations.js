/**
 * 自动记录对话脚本 v3
 * 从 OpenClaw 所有会话中读取最新消息并推送到知识库
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const SESSIONS_DIR = path.join(process.env.USERPROFILE || 'C:\\Users\\Administrator', '.openclaw', 'agents', 'main', 'sessions');
const KNOWLEDGE_API = process.env.KNOWLEDGE_API || 'http://localhost:3000';
const STATE_FILE = path.join(__dirname, 'auto-record-state.json');

// 获取所有会话文件
function getAllSessionFiles() {
  try {
    const files = fs.readdirSync(SESSIONS_DIR);
    return files
      .filter(f => f.endsWith('.jsonl') && !f.includes('.reset.') && !f.includes('.deleted.'))
      .map(f => path.join(SESSIONS_DIR, f))
      .sort((a, b) => {
        const statA = fs.statSync(a);
        const statB = fs.statSync(b);
        return statB.mtimeMs - statA.mtimeMs;
      });
  } catch (e) {
    console.error('读取会话目录失败:', e.message);
    return [];
  }
}

// 解析消息内容
function extractContent(msg) {
  try {
    if (msg.content && Array.isArray(msg.content)) {
      // 新格式: content 是数组
      return msg.content.map(c => c.text || c.content || '').join('');
    }
    return msg.content || msg.text || '';
  } catch (e) {
    return '';
  }
}

// 读取会话消息
function getSessionMessages(sessionFile) {
  try {
    const content = fs.readFileSync(sessionFile, 'utf8');
    const lines = content.trim().split('\n');
    const messages = [];
    const fileName = path.basename(sessionFile);
    
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        // 只处理 type: "message" 的行
        if (entry.type === 'message' && entry.message) {
          const msg = entry.message;
          const role = msg.role;
          if (role === 'user' || role === 'assistant') {
            const text = extractContent(msg);
            if (text && text.length > 2) {
              messages.push({
                role: role,
                content: text,
                session: fileName,
                timestamp: entry.timestamp
              });
            }
          }
        }
      } catch (e) {
        // 跳过无效行
      }
    }
    
    return messages;
  } catch (e) {
    return [];
  }
}

// 读取上次记录的状态
function getLastState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  return { processedMessageIds: {} };
}

// 保存状态
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// 发送到知识库API
function sendToKnowledgeAPI(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ messages });
    
    const url = new URL('/api/v1/memory/auto-record', KNOWLEDGE_API);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('=== 自动记录对话 v3 ===');
  
  const sessionFiles = getAllSessionFiles();
  if (sessionFiles.length === 0) {
    console.log('未找到会话文件');
    return;
  }
  
  console.log(`找到 ${sessionFiles.length} 个会话文件`);
  
  let allMessages = [];
  for (const file of sessionFiles) {
    const messages = getSessionMessages(file);
    allMessages = allMessages.concat(messages);
  }
  
  // 按时间排序
  allMessages.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
  
  // 只处理最近的消息
  allMessages = allMessages.slice(-100);
  
  if (allMessages.length === 0) {
    console.log('没有消息');
    return;
  }
  
  console.log(`共 ${allMessages.length} 条消息`);
  
  const lastState = getLastState();
  const processed = lastState.processedMessageIds || {};
  
  // 过滤出新消息 (用 session + timestamp + role 作为唯一标识)
  const newMessages = allMessages.filter(msg => {
    const key = `${msg.session}:${msg.timestamp}:${msg.role}`;
    return !processed[key];
  });
  
  if (newMessages.length === 0) {
    console.log('没有新消息');
    return;
  }
  
  console.log(`发现 ${newMessages.length} 条新消息`);
  
  // 打印预览
  newMessages.slice(0, 3).forEach((msg, i) => {
    const preview = msg.content.substring(0, 60).replace(/\n/g, ' ');
    console.log(`  ${i+1}. [${msg.role}] ${preview}...`);
  });
  
  try {
    const result = await sendToKnowledgeAPI(newMessages);
    console.log('✓ 记录成功:', result.data?.recorded || 0, '条');
    
    // 更新状态
    for (const msg of allMessages) {
      const key = `${msg.session}:${msg.timestamp}:${msg.role}`;
      processed[key] = true;
    }
    
    saveState({
      processedMessageIds: processed,
      lastRun: new Date().toISOString()
    });
  } catch (e) {
    console.error('✗ 记录失败:', e.message);
  }
}

main();
