/**
 * Prototype 1: Simple product recommendation using model's internal knowledge.
 * Collects all product names from parsed data and relies on LLM knowledge for recommendations.
 */
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { DATA } from './data.js';
import { OPENROUTER_API_KEY, MODEL, BASE_URL, PROMPT_TEXT } from './config.js';

// Demo survey (same as Python version)
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

async function recommendPetFood(surveyResponses, numRecommendations = 5) {
  const model = new ChatOpenAI({
    modelName: MODEL,
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: { baseURL: BASE_URL },
    temperature: 0.7,
  });

  const productsList = DATA.products.map(p => `- ${p}`).join('\n');
  const surveyText = surveyToText(surveyResponses);

  const messageContent = `You are a pet nutrition expert. Based on the pet owner's survey responses,
recommend the ${numRecommendations} most suitable food(s) from the available product list.
Use your knowledge of pet nutrition to match their needs with the right products.

Available Products:
${productsList}

Pet Owner Survey:
${surveyText}

Please recommend the top ${numRecommendations} food(s) from the list above with detailed pros for each.

${PROMPT_TEXT}

Respond with JSON in this format:
{
  "recommendations": [
    { "food_name": "...", "pros_list": ["Pro 1: explanation", "Pro 2: explanation", ...] }
  ]
}`;

  console.log('=== SENDING TO MODEL ===');
  console.log(messageContent);
  console.log('========================\n');

  const response = await model.invoke([new HumanMessage(messageContent)]);

  console.log('=== MODEL RESPONSE ===');
  console.log(response.content);
  console.log('======================\n');

  return response.content;
}

async function main() {
  console.log('=== PROTOTYPE 1: Simple Product Recommendation ===\n');

  console.log('Survey Responses:');
  DEMO_SURVEY.forEach(r => console.log(`  ${r.question}: ${r.answers.join(', ')}`));
  console.log();

  console.log('Generating recommendation...\n');
  const result = await recommendPetFood(DEMO_SURVEY);

  try {
    const parsed = JSON.parse(result.match(/\{[\s\S]*\}/)[0]);
    console.log('\nRecommendations:');
    parsed.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.food_name}`);
      rec.pros_list.forEach(pro => console.log(`   ✓ ${pro}`));
      console.log();
    });
  } catch (e) {
    console.log('Could not parse structured response');
  }
}

main().catch(console.error);
