/**
 * Prototype 3: Interactive RAG system with user question tool.
 * Removes survey context and adds interactive question functionality.
 */
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import * as readline from 'readline';
import { DATA } from './data.js';
import { OPENROUTER_API_KEY, MODEL, BASE_URL, PROMPT_TEXT } from './config.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// Tool to get page content
const getPageContentTool = tool(
  async ({ page_number, document_name }) => {
    const page = DATA.pages.find(
      p => p.page_number === page_number && p.document === document_name
    );
    if (page) {
      return `Page ${page_number} (from ${document_name}) content: ${page.contents}`;
    }
    return `Page ${page_number} from ${document_name} not found`;
  },
  {
    name: 'get_page_content',
    description: 'Get the full content of a specific page by page number from a specific document.',
    schema: z.object({
      page_number: z.number().describe('The page number to retrieve'),
      document_name: z.string().describe('The document name (e.g., "Hills.pdf")'),
    }),
  }
);

// Tool to ask user questions
const askUserQuestionTool = tool(
  async ({ question, options }) => {
    console.log(`\n${question}`);
    options.forEach((opt, i) => console.log(`${i + 1}. ${opt}`));
    const answer = await ask('\nYour choice(s): ');
    return answer;
  },
  {
    name: 'ask_user_question',
    description: 'Ask the user a multiple choice question and return their response.',
    schema: z.object({
      question: z.string().describe('The question to ask the user'),
      options: z.array(z.string()).describe('List of multiple choice options'),
    }),
  }
);

const tools = [getPageContentTool, askUserQuestionTool];

async function recommendInteractive(numRecommendations = 3) {
  const model = new ChatOpenAI({
    modelName: MODEL,
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: { baseURL: BASE_URL },
    temperature: 0.7,
  }).bindTools(tools);

  const productsList = DATA.products.map(p => `- ${p}`).join('\n');

  const systemPrompt = `You are a pet nutrition expert. Use your tools to research and provide ${numRecommendations} food recommendation(s).

INSTRUCTIONS:
- You can request up to 10 pages.
- Ask up to 8 questions to the user, but no more. Don't be annoying.
- Use ask_user_question to gather information about the pet owner's needs, preferences, and concerns
- Each recommendation's pros must be directly relevant to the user's responses
- You can use get_page_content(page_number, document_name) to get full content of specific pages from specific documents

${PROMPT_TEXT}

Respond with JSON in this format when you have gathered enough information:
{
  "recommendations": [
    { "food_name": "...", "pros_list": ["Pro 1: explanation", "Pro 2: explanation", ...] }
  ]
}`;

  const userMessage = `AVAILABLE PRODUCTS:
${productsList}

PAGE SUMMARIES:
${DATA.pageSummaries}

Please help me find the right food for my pet. Start by asking questions to understand my pet's needs.`;

  console.log('=== SYSTEM PROMPT ===');
  console.log(systemPrompt);
  console.log('=====================\n');

  let messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userMessage),
  ];

  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations) {
    iterations++;
    const response = await model.invoke(messages);
    messages.push(response);

    console.log('\n=== MODEL RESPONSE ===');
    if (response.content) {
      console.log('Content:', response.content.substring(0, 500));
    }
    console.log('Tool calls:', response.tool_calls?.length || 0);
    console.log('======================');

    if (!response.tool_calls || response.tool_calls.length === 0) {
      return response.content;
    }

    // Handle tool calls
    for (const toolCall of response.tool_calls) {
      console.log(`\nTool: ${toolCall.name}`);

      let result;
      if (toolCall.name === 'get_page_content') {
        result = await getPageContentTool.invoke(toolCall.args);
        console.log(`Result: ${result.substring(0, 100)}...`);
      } else if (toolCall.name === 'ask_user_question') {
        result = await askUserQuestionTool.invoke(toolCall.args);
        console.log(`User answered: ${result}`);
      }

      messages.push(new ToolMessage({
        tool_call_id: toolCall.id,
        content: result,
      }));
    }
  }

  return 'Max iterations reached';
}

async function main() {
  console.log('=== PROTOTYPE 3: Interactive RAG-Based Recommendation ===\n');
  console.log('Setting up interactive RAG system...\n');

  const result = await recommendInteractive();

  try {
    const parsed = JSON.parse(result.match(/\{[\s\S]*\}/)[0]);
    console.log('\n\nInteractive RAG-Enhanced Recommendations:');
    parsed.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.food_name}`);
      rec.pros_list.forEach(pro => console.log(`   ✓ ${pro}`));
      console.log();
    });
  } catch (e) {
    console.log('Could not parse structured response');
    console.log('Raw:', result);
  }

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
});
