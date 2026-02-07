/**
 * Prototype 2: RAG system with page summaries and content lookup.
 * Uses page summaries for context and tool to fetch full page content.
 */
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { DATA } from './data.js';
import { OPENROUTER_API_KEY, MODEL, BASE_URL, PROMPT_TEXT } from './config.js';

const DEMO_SURVEY = [
  { question: "What kind of animal do you have?", answers: ["dog"] },
  { question: "Has your pet been diagnosed with a medical condition?", answers: ["Yes"] },
  { question: "Which of the following best describes your dog's condition?", answers: ["Bladder and Urination Issues"] },
  { question: "What type of urinary issue is your dog experiencing?", answers: ["Struvite Crystals or Stones"] },
  { question: "Does your dog have any of the following clinical needs?", answers: ["Prone to Weight Gain"] },
  { question: "Does your dog have any additional nutritional needs?", answers: ["Promote Urine Dilution"] },
  { question: "Are you interested in urinary-support treats?", answers: ["Yes"] }
];

function surveyToText(survey) {
  return survey.map(r => `Q: ${r.question}\nA: ${r.answers.join(', ')}`).join('\n\n');
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

async function recommendWithRag(surveyResponses, numRecommendations = 5) {
  const model = new ChatOpenAI({
    modelName: MODEL,
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: { baseURL: BASE_URL },
    temperature: 0.7,
  }).bindTools([getPageContentTool]);

  const productsList = DATA.products.map(p => `- ${p}`).join('\n');
  const surveyText = surveyToText(surveyResponses);

  const systemPrompt = `You are a pet nutrition expert. Use your tools to research and provide ${numRecommendations} food recommendation(s).

INSTRUCTIONS:
- USE NO MORE THAN 5 TOOL CALLS. THE PROGRAM WILL EXIT IF YOU USE MORE THAN 5 TOOL CALLS.
- Each recommendation's pros must be directly relevant to the pet owner's specific survey responses
- Focus on how each recommended food addresses their stated needs, preferences, and concerns
- You can use get_page_content(page_number, document_name) to get full content of specific pages from specific documents

${PROMPT_TEXT}

Respond with JSON in this format:
{
  "recommendations": [
    { "food_name": "...", "pros_list": ["Pro 1: explanation", "Pro 2: explanation", ...] }
  ]
}`;

  const userMessage = `AVAILABLE PRODUCTS:
${productsList}

PAGE SUMMARIES:
${DATA.pageSummaries}

Pet Owner Survey:
${surveyText}

Based on this pet owner's survey responses, research and provide ${numRecommendations} structured food recommendation(s).`;

  console.log('=== SYSTEM PROMPT ===');
  console.log(systemPrompt);
  console.log('=====================\n');

  console.log('=== USER MESSAGE ===');
  console.log(userMessage.substring(0, 2000) + '...[truncated]');
  console.log('====================\n');

  let messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userMessage),
  ];

  let toolCalls = 0;
  const maxToolCalls = 5;

  while (toolCalls < maxToolCalls) {
    const response = await model.invoke(messages);
    messages.push(response);

    console.log('=== MODEL RESPONSE ===');
    console.log('Content:', response.content || '(no content)');
    console.log('Tool calls:', response.tool_calls?.length || 0);
    console.log('======================\n');

    if (!response.tool_calls || response.tool_calls.length === 0) {
      return response.content;
    }

    // Handle tool calls
    for (const toolCall of response.tool_calls) {
      console.log(`Tool call: ${toolCall.name}(${JSON.stringify(toolCall.args)})`);
      const result = await getPageContentTool.invoke(toolCall.args);
      console.log(`Result: ${result.substring(0, 200)}...`);
      console.log();

      messages.push(new ToolMessage({
        tool_call_id: toolCall.id,
        content: result,
      }));
      toolCalls++;
    }
  }

  // Final call after tools
  const finalResponse = await model.invoke(messages);
  return finalResponse.content;
}

async function main() {
  console.log('=== PROTOTYPE 2: RAG-Based Recommendation ===\n');

  console.log('Survey Responses:');
  DEMO_SURVEY.forEach(r => console.log(`  ${r.question}: ${r.answers.join(', ')}`));
  console.log();

  console.log('Setting up RAG system...\n');
  const result = await recommendWithRag(DEMO_SURVEY);

  try {
    const parsed = JSON.parse(result.match(/\{[\s\S]*\}/)[0]);
    console.log('\nRAG-Enhanced Recommendations:');
    parsed.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.food_name}`);
      rec.pros_list.forEach(pro => console.log(`   ✓ ${pro}`));
      console.log();
    });
  } catch (e) {
    console.log('Could not parse structured response');
    console.log('Raw:', result);
  }
}

main().catch(console.error);
