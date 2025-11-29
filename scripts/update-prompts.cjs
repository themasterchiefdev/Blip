const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_API_URL = 'https://api.github.com/repos/github/awesome-copilot/contents/prompts';
const OUTPUT_FILE = path.join(__dirname, '../src/data/community_prompts.json');
const USER_AGENT = 'Blip-App-Build-Script';

// Helper to make HTTPS requests
const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', (err) => reject(err));
    });
};

async function main() {
    console.log('🚀 Starting Community Prompts Update...');

    try {
        // 1. Fetch File List
        console.log('📦 Fetching file list from GitHub...');
        const listData = await fetchUrl(GITHUB_API_URL);
        const files = JSON.parse(listData);
        
        const promptFiles = files.filter(f => f.name.endsWith('.prompt.md'));
        console.log(`Found ${promptFiles.length} prompt files.`);

        const prompts = [];

        // 2. Fetch Content for each file
        for (const [index, file] of promptFiles.entries()) {
            process.stdout.write(`\r⬇️  Downloading ${index + 1}/${promptFiles.length}: ${file.name}...`);
            
            const rawContent = await fetchUrl(file.download_url);
            
            // Extract Title
            const h1Match = rawContent.match(/^#\s+(.+)$/m);
            const title = h1Match ? h1Match[1].trim() : file.name.replace(/-/g, ' ').replace('.prompt.md', '').replace(/\b\w/g, l => l.toUpperCase());
            
            // Clean Content (remove frontmatter)
            const content = rawContent.replace(/^---[\s\S]*?---\n/, '');

            prompts.push({
                id: `NET-${index + 1}`,
                title: title,
                tool: 'COMMUNITY',
                category: 'External',
                tags: ['GitHub', 'OpenSource'],
                content: content,
                original_url: file.html_url
            });
            
            // Be nice to the API
            await new Promise(resolve => setTimeout(resolve, 100)); 
        }

        console.log('\n✅ Download complete.');

        // 3. Save to JSON
        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prompts, null, 2));
        console.log(`💾 Saved ${prompts.length} prompts to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('\n❌ Error updating prompts:', error.message);
        process.exit(1);
    }
}

main();
