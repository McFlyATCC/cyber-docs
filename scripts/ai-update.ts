/**
 * AI-Assisted Documentation Update Script
 * 
 * Usage:
 *   npx tsx scripts/ai-update.ts <file-path> [--context "additional context"]
 * 
 * Example:
 *   npx tsx scripts/ai-update.ts src/pages/kql-queries.astro --context "KQL now supports new 'scan' operator"
 * 
 * Prerequisites:
 *   - Set ANTHROPIC_API_KEY environment variable
 *   - npm install @anthropic-ai/sdk tsx
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
  console.error('Set it with: export ANTHROPIC_API_KEY=your-key-here');
  process.exit(1);
}

interface UpdateSuggestion {
  analysis: string;
  suggestedChanges: string[];
  updatedContent?: string;
}

async function analyzeAndSuggestUpdates(
  filePath: string,
  additionalContext?: string
): Promise<UpdateSuggestion> {
  const client = new Anthropic();
  
  // Read the file
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  console.log(`\n📄 Analyzing: ${fileName}`);
  console.log(`   Path: ${absolutePath}`);
  if (additionalContext) {
    console.log(`   Context: ${additionalContext}`);
  }
  console.log('\n⏳ Sending to Claude for analysis...\n');
  
  const systemPrompt = `You are a technical documentation expert specializing in cybersecurity and Microsoft Sentinel. 
Your task is to review documentation and suggest improvements.

Guidelines:
- Focus on accuracy, clarity, and completeness
- Identify outdated information based on your knowledge
- Suggest improvements to code examples and queries
- Maintain the existing tone and structure
- Preserve Astro component syntax and frontmatter
- Be specific about what should change and why`;

  const userPrompt = `Please review this documentation file and suggest updates.

File: ${fileName}
${additionalContext ? `\nAdditional context about recent changes: ${additionalContext}` : ''}

Current content:
\`\`\`
${content}
\`\`\`

Please provide:

1. **Analysis**: What aspects of this documentation might need updating? Are there any issues with accuracy, clarity, or completeness?

2. **Suggested Changes**: A bullet list of specific changes you recommend, with explanations.

3. **Priority**: Rate each suggestion as High/Medium/Low priority.

Format your response clearly with these sections.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ],
    system: systemPrompt
  });

  const responseText = response.content[0].type === 'text' 
    ? response.content[0].text 
    : '';

  return {
    analysis: responseText,
    suggestedChanges: []
  };
}

async function generateUpdatedContent(
  filePath: string,
  instructions: string
): Promise<string> {
  const client = new Anthropic();
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  console.log(`\n✏️  Generating updated content based on instructions...\n`);
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: `Update this documentation file according to these instructions:

Instructions: ${instructions}

Current file (${fileName}):
\`\`\`
${content}
\`\`\`

Provide the complete updated file content. Preserve all Astro syntax, frontmatter, and component imports.
Only output the file content, no explanations.`
      }
    ]
  });

  return response.content[0].type === 'text' 
    ? response.content[0].text 
    : '';
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
AI Documentation Update Assistant
==================================

Usage:
  npx tsx scripts/ai-update.ts <file-path> [options]

Options:
  --context "text"    Additional context about changes to consider
  --apply "text"      Generate updated content based on instructions
  --output <file>     Write updated content to file (use with --apply)

Examples:
  # Analyze a file for potential updates
  npx tsx scripts/ai-update.ts src/pages/kql-queries.astro

  # Analyze with context about recent changes
  npx tsx scripts/ai-update.ts src/pages/kql-queries.astro --context "KQL added new scan operator in 2024"

  # Generate updated content
  npx tsx scripts/ai-update.ts src/pages/kql-queries.astro --apply "Add a section about the new scan operator" --output updated.astro
`);
    process.exit(0);
  }
  
  const filePath = args[0];
  let context: string | undefined;
  let applyInstructions: string | undefined;
  let outputFile: string | undefined;
  
  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--context' && args[i + 1]) {
      context = args[i + 1];
      i++;
    } else if (args[i] === '--apply' && args[i + 1]) {
      applyInstructions = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    }
  }
  
  try {
    if (applyInstructions) {
      // Generate updated content
      const updatedContent = await generateUpdatedContent(filePath, applyInstructions);
      
      if (outputFile) {
        fs.writeFileSync(outputFile, updatedContent);
        console.log(`✅ Updated content written to: ${outputFile}`);
      } else {
        console.log('\n--- Updated Content ---\n');
        console.log(updatedContent);
        console.log('\n--- End ---\n');
        console.log('💡 Use --output <file> to save to a file');
      }
    } else {
      // Analyze and suggest
      const result = await analyzeAndSuggestUpdates(filePath, context);
      
      console.log('═'.repeat(60));
      console.log('📋 ANALYSIS RESULTS');
      console.log('═'.repeat(60));
      console.log(result.analysis);
      console.log('═'.repeat(60));
      console.log('\n💡 To apply changes, use:');
      console.log(`   npx tsx scripts/ai-update.ts ${filePath} --apply "your instructions here"\n`);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
