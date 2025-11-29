const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_API_URL = 'https://api.github.com/repos/github/awesome-copilot/contents/prompts';
const LOCAL_PROMPTS_FILE = path.join(__dirname, '../src/data/local_prompts.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/prompts.json');
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
    console.log('🚀 Starting Prompts Update...');

    try {
        // 1. Load Local Prompts
        console.log('📂 Loading local prompts...');
        let localPrompts = [];
        if (fs.existsSync(LOCAL_PROMPTS_FILE)) {
            localPrompts = JSON.parse(fs.readFileSync(LOCAL_PROMPTS_FILE, 'utf8'));
            // Add native source to local prompts
            localPrompts = localPrompts.map(p => ({ ...p, source: 'native' }));
            console.log(`✅ Loaded ${localPrompts.length} local prompts.`);
        } else {
            console.warn('⚠️ Local prompts file not found.');
        }

        // 2. Fetch File List from GitHub
        console.log('📦 Fetching file list from GitHub...');
        const listData = await fetchUrl(GITHUB_API_URL);
        const files = JSON.parse(listData);
        
        const promptFiles = files.filter(f => f.name.endsWith('.prompt.md'));
        console.log(`Found ${promptFiles.length} prompt files.`);

        const externalPrompts = [];

        // 3. Fetch Content for each file
        for (const [index, file] of promptFiles.entries()) {
            process.stdout.write(`\r⬇️  Downloading ${index + 1}/${promptFiles.length}: ${file.name}...`);
            
            const rawContent = await fetchUrl(file.download_url);
            
            // Extract Title
            const h1Match = rawContent.match(/^#\s+(.+)$/m);
            const title = h1Match ? h1Match[1].trim() : file.name.replace(/-/g, ' ').replace('.prompt.md', '').replace(/\b\w/g, l => l.toUpperCase());
            
            // Clean Content (remove frontmatter)
            const content = rawContent.replace(/^---[\s\S]*?---\n/, '');

            externalPrompts.push({
                id: `EXT-${index + 1}`,
                title: title,
                tool: 'GitHub Copilot', // As requested by user
                category: 'External',
                tags: ['GitHub', 'OpenSource'],
                source: 'awesome-copilot',
                content: content,
                original_url: file.html_url
            });
            
            // Be nice to the API
            await new Promise(resolve => setTimeout(resolve, 100)); 
        }

        console.log('\n✅ Download complete.');

        // 4. Merge and Save
        const allPrompts = [...localPrompts, ...externalPrompts];
        
        // Deduplicate by title (simple strategy)
        const uniquePrompts = Array.from(new Map(allPrompts.map(item => [item.title, item])).values());

        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniquePrompts, null, 2));
        console.log(`💾 Saved ${uniquePrompts.length} consolidated prompts to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('\n❌ Error updating prompts:', error.message);
        process.exit(1);
    }
}

main();
