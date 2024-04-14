#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let targetDir = process.argv[2];
if(targetDir === undefined) targetDir = ".";
let content = "";
// 무시할 파일 확장자 (TODO : cli로도 받아서 설정할 수 있게 하기)
const ignores = [".ico", ".bin", ".jpg", ".jpeg", ".png", ".webp"]
// 확장자 변경 테이블
const transExt = { ".js": ".jsx", ".ts": ".tsx" }
const yyymmdd = (new Date()).toISOString().split('T')[0];
const filename = "result_" + yyymmdd;
content += `# ${filename}\n\n\n\n\n\n`;

function traverseDir(dir, cwd) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        const isDirectory = fs.lstatSync(fullPath).isDirectory();
        if (isDirectory) {
            traverseDir(fullPath, cwd);
        }
        if(!isDirectory) {
            let ext = path.extname(fullPath);
            if(!ignores.includes(ext)) {
                if(transExt[ext]) ext = transExt[ext];
                // 옵시디언에서 찾을 수 있게 경로를 소제목으로 처리
                let fullPathMod = fullPath.replace(cwd, "").substring(1)
                fullPathMod = fullPathMod.replace(/\\/g, "/")
                fullPathMod = fullPathMod.replace("[", "\\[")
                content += `\n## ${fullPathMod}\n\n` + "```" + ext.replace("\.", "") + "\n";
                // content += `\n**${fullPath.replace(/\\/g, "/")}**\n\n` + "```" + ext.replace("\.", "") + "\n";
                content += fs.readFileSync(fullPath, 'utf-8');
                content += "\n```\n\n\n\n\n\n";
            }
        }
    });
}

const cwd = process.cwd()
traverseDir(cwd + "/" + targetDir, cwd);
fs.writeFileSync((cwd + "/" + filename + ".md"), content);
