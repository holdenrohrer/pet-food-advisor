// Survey definitions for Health Goals and Medical surveys

export const HEALTH_GOALS_SURVEY = {
  // Initial question
  animalType: {
    question: "What kind of animal do you have?",
    options: ["Cat", "Dog"],
    maxSelect: 1
  },

  // Base questions by animal
  catBase: [
    { id: "lifeStage", question: "What is your cat's life stage?", options: ["Kitten (under 1 year)", "Adult (1-7 years)", "Senior (7+ years)"], maxSelect: 1 },
    { id: "foodFormat", question: "What food format do you prefer?", options: ["Dry", "Wet", "No Preference"], maxSelect: 1 },
    { id: "indoorOutdoor", question: "Is your cat an indoor or outdoor cat?", options: ["Indoor", "Outdoor", "Both"], maxSelect: 1 }
  ],

  dogBase: [
    { id: "lifeStage", question: "What is your dog's life stage?", options: ["Puppy (under 1 year)", "Adult (1-7 years)", "Senior (7+ years)"], maxSelect: 1 },
    { id: "foodFormat", question: "What food format do you prefer?", options: ["Dry", "Wet", "No Preference"], maxSelect: 1 }
  ],

  // Health goals selection
  healthGoals: {
    question: "Which health goals are you interested in? (Select up to 3)",
    options: ["Digestive Support", "Skin & Coat Health", "Joint Support", "Weight Management", "Immune Support", "Muscle Support", "Dental Health", "Calming & Stress Reduction"],
    maxSelect: 3
  },

  // Follow-up questions by health goal (CAT)
  catFollowups: {
    "Digestive Support": { question: "What type of digestive support does your cat need? (Select up to 2)", options: ["Sensitive digestion or food tolerance", "Hairball and fiber-focused support", "Prebiotic gut balance", "Senior digestion needs", "No Preference"], maxSelect: 2 },
    "Skin & Coat Health": { question: "What kind of skin or coat support does your cat need?", options: ["Omega-rich coat shine", "Itchy or sensitive skin", "Dull or flaky coat", "No Preference"], maxSelect: 1 },
    "Weight Management": { question: "What kind of weight management are you targeting? (Select up to 2)", options: ["Weight loss / calorie control", "Indoor or low-activity lifestyle", "Muscle preservation during weight loss", "Neutered or post-surgery support", "No Preference"], maxSelect: 2 },
    "Joint Support": { question: "What type of joint support are you looking for?", options: ["Cartilage and joint care", "No Preference"], maxSelect: 1 },
    "Immune Support": { question: "What kind of immune support do you want to prioritize?", options: ["Antioxidant defense and daily immunity", "Fortified or sensitive immune needs", "Recovery or long-term defense", "No Preference"], maxSelect: 1 },
    "Muscle Support": { question: "What kind of muscle support does your cat need?", options: ["Aging and muscle preservation", "Lean body and tone", "Active or recovering muscle health", "No Preference"], maxSelect: 1 },
    "Dental Health": { question: "What type of dental care are you looking for?", options: ["Tartar and plaque control", "Textured kibble or crunchy cleansing", "Fresh breath support", "No Preference"], maxSelect: 1 },
    "Calming & Stress Reduction": { question: "What kind of calming support does your cat need?", options: ["General calming and behavior balance", "Stress-related behavior (indoor lifestyle, anxiety)", "No Preference"], maxSelect: 1 }
  },

  // Follow-up questions by health goal (DOG)
  dogFollowups: {
    "Digestive Support": { question: "What type of digestive need are you concerned about? (Select up to 3)", options: ["Sensitive stomach", "Fiber-driven support", "Small breed digestion", "Aging-related digestion", "Prebiotic/probiotic balance", "No Preference"], maxSelect: 3 },
    "Skin & Coat Health": { question: "What kind of support does your dog need? (Select up to 2)", options: ["Omega-rich for coat shine", "Itchy or sensitive skin", "Dull coat or dryness", "Seasonal support", "No Preference"], maxSelect: 2 },
    "Weight Management": { question: "What type of support are you looking for? (Select up to 2)", options: ["Weight loss / calorie control", "Indoor lifestyle support", "Appetite regulation", "Post-neutering weight support", "No Preference"], maxSelect: 2 },
    "Joint Support": { question: "What kind of joint support do you prefer? (Select up to 2)", options: ["Glucosamine / chondroitin support", "Fish oil or omega-3s", "Aging support", "Breed-specific joint needs", "No Preference"], maxSelect: 2 },
    "Muscle Support": { question: "What kind of support are you looking for? (Select up to 2)", options: ["High protein performance", "Muscle retention (aging dogs)", "Nutrient-dense sources", "No Preference"], maxSelect: 2 },
    "Immune Support": { question: "What kind of support are you prioritizing? (Select up to 2)", options: ["General wellness & immunity", "Senior immune care", "Post-illness recovery support", "No Preference"], maxSelect: 2 },
    "Dental Health": { question: "What kind of dental support does your dog need? (Select up to 2)", options: ["Tartar reduction", "Crunchy kibble cleansing", "Breath freshening", "No Preference"], maxSelect: 2 },
    "Calming & Stress Reduction": { question: "What type of calming support is important to you?", options: ["Anxiety and behavioral calming", "Travel or noise sensitivity", "Long-term nervous system support", "No Preference"], maxSelect: 1 }
  }
};

export const MEDICAL_SURVEY = {
  // Initial questions
  animalType: {
    question: "What kind of animal do you have?",
    options: ["Cat", "Dog"],
    maxSelect: 1
  },

  weight: {
    question: "What is the weight of your pet? (in lbs)",
    type: "number",
    min: 1,
    max: 200
  },

  // Condition categories
  dogConditions: {
    question: "Which of the following best describes your dog's condition?",
    options: ["Bladder and Urination Issues", "Kidney Disease and Kidney Support", "Weight Management", "Digestive Support", "Skin and Coat Support", "Vital Organ Support", "General Health and Management", "Diabetes Support", "Food Sensitivities"],
    maxSelect: 1
  },

  catConditions: {
    question: "Which of the following best describes your cat's condition?",
    options: ["Bladder and Urination Issues", "Kidney Disease and Kidney Support", "Weight Management", "Digestive Support", "Vital Organ Support", "General Health and Management", "Skin and Food Sensitivities", "Diabetes Support"],
    maxSelect: 1
  },

  // Condition-specific follow-ups (DOG)
  dogFollowups: {
    "Bladder and Urination Issues": [
      { id: "urinaryType", question: "What type of urinary issue is your dog experiencing?", options: ["Struvite Crystals or Stones", "Calcium Oxalate Crystals/Stones", "Cystine, Urate, or Purine-Related Stones", "General Urinary Support", "Weight Management + Urinary Health", "Food Allergies + Urinary Health"], maxSelect: 1 },
      { id: "clinicalNeeds", question: "Does your dog have any additional clinical needs?", options: ["Prone to Weight Gain", "History of Food Allergies or Sensitivities", "Senior Dog (10+ years)", "No additional clinical needs"], maxSelect: 2 },
      { id: "nutritionalNeeds", question: "Does your dog have any additional nutritional needs?", options: ["Promote Urine Dilution", "Appetite or Satiety Control", "No preference"], maxSelect: 1 },
      { id: "treats", question: "Are you interested in urinary-support treats?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Kidney Disease and Kidney Support": [
      { id: "ckdStage", question: "What is the CKD IRIS stage of your dog?", options: ["Stage 1 (without proteinuria)", "Stages 2 to 4 (with or without proteinuria)"], maxSelect: 1 },
      { id: "tubeFed", question: "Is the dog being tube fed?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "hypoallergenic", question: "Does your dog need a hypoallergenic diet?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "mobility", question: "Does your dog need joint and mobility support?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Weight Management": [
      { id: "weightGoal", question: "What is your dog's primary weight-related goal?", options: ["Needs to lose weight", "Tends to overeat or beg for food", "Has completed weight loss and needs to maintain", "Needs joint support during weight loss", "Has diabetes or needs blood sugar support"], maxSelect: 1 },
      { id: "healthConditions", question: "Are there any other weight-related health concerns? (Health Conditions)", options: ["My dog struggles with chronic overeating", "My dog needs long-term weight maintenance support", "My dog has joint problems or mobility issues", "There are no other health concerns"], maxSelect: 2 },
      { id: "nutritionalFeatures", question: "Are there any other weight-related health concerns? (Nutritional Features)", options: ["High fiber to help feel full", "High protein to preserve lean muscle", "Low-calorie formula", "L-carnitine to support fat metabolism", "There are no additional concerns or features"], maxSelect: 2 }
    ],
    "Digestive Support": [
      { id: "giStrategy", question: "What kind of nutritional strategy is your vet using to support your dog's GI health?", options: ["Assisted feeding/Recovery", "Vomiting and/or diarrhea", "Fat restriction/pancreatitis", "General gastrointestinal health", "Constipation"], maxSelect: 1 },
      { id: "age", question: "Is your dog a puppy or an adult?", options: ["Puppy", "Adult"], maxSelect: 1 },
      { id: "acuteChronic", question: "Is the problem acute or chronic?", options: ["Acute", "Chronic"], maxSelect: 1 },
      { id: "fiberProtein", question: "Is hydrolyzed protein or increased fiber needed?", options: ["Yes, increased fiber", "Yes, hydrolyzed protein", "No, I don't need either"], maxSelect: 1 },
      { id: "dermatologic", question: "Is there a need to treat dermatologic problem and/or nutrient intolerance?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "overweight", question: "Is the dog overweight?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Skin and Coat Support": [
      { id: "eliminationDiet", question: "Has the dog been placed on an elimination diet?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "weightTendency", question: "Does the dog have a tendency to gain weight?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "ckdProteinuria", question: "Does the dog have CKD or proteinuria?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "crystals", question: "Does the dog have struvite or calcium oxalate crystals?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "puppy", question: "Is the dog less than a year of age or a puppy?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Vital Organ Support": [
      { id: "organCondition", question: "What type of vital organ condition is your dog experiencing?", options: ["Liver disease or hepatic conditions", "Requires low-copper or easily digestible liver diet", "Joint and mobility issues", "Early-stage heart disease or cardiac concerns"], maxSelect: 1 },
      { id: "additionalNeeds", question: "Are there any additional needs?", options: ["My dog has kidney issues", "My dog is overweight or overeats", "My dog has food allergies or intolerances", "None of the above are needed"], maxSelect: 2 }
    ],
    "General Health and Management": [
      { id: "generalSupport", question: "What kind of general support does your dog need?", options: ["Pill Assist / Medication Support", "Dental Care", "Senior Support", "Mobility / Joint Support", "Stress & Behavioral Support"], maxSelect: 1 }
    ],
    "Diabetes Support": [
      { id: "diabetesManagement", question: "How is your dog's diabetes being managed?", options: ["Diet only", "Diet + insulin", "Newly diagnosed"], maxSelect: 1 }
    ],
    "Food Sensitivities": [
      { id: "age", question: "Is your dog a puppy or an adult?", options: ["Puppy", "Adult"], maxSelect: 1 },
      { id: "proteinType", question: "Do you want hydrolyzed, novel protein/vegetarian or ultra-extensively hydrolyzed?", options: ["Hydrolyzed protein", "Novel protein / Vegetarian / Selected Protein", "Ultra-extensively hydrolyzed"], maxSelect: 1 },
      { id: "vegetarian", question: "Do you prefer a vegetarian diet?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "currentProtein", question: "Is your dog currently eating rabbit, duck or whitefish?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "proteinExposure", question: "Has your dog had regular exposure to rabbit, duck or whitefish?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "proteinSelect", question: "Please select one protein option", options: ["Duck", "Rabbit", "Whitefish"], maxSelect: 1 },
      { id: "hydrolyzedStrategy", question: "Please select Hydrolyzed Protein strategy", options: ["Urinary disease", "Weight control / want satiety", "Good weight but tends to gain", "Small dog (less than 20 lbs)", "High energy, needs to gain weight", "Prefers wet food", "No other concerns"], maxSelect: 1 }
    ]
  },

  // Condition-specific follow-ups (CAT)
  catFollowups: {
    "Bladder and Urination Issues": [
      { id: "urinaryType", question: "What urinary concern are you trying to manage?", options: ["Struvite Crystals", "Calcium Oxalate or Mixed Crystals", "Chronic or Recurrent Urinary Issues", "Stress-Related Urinary Symptoms", "Senior Cat Urinary Support", "Urinary Issues + Food Sensitivities"], maxSelect: 1 },
      { id: "clinicalGoals", question: "What are your top clinical goals, nutritional goals or preferences? (Select up to 2)", options: ["My cat is overweight or gains easily", "My cat is stressed or anxious", "My cat has food sensitivities or allergies", "My cat is a senior (7+ years)", "My cat needs help promoting urine dilution", "None of the above"], maxSelect: 2 },
      { id: "treats", question: "Are you interested in urinary-support treats?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Kidney Disease and Kidney Support": [
      { id: "ckdStage", question: "What is the CKD IRIS stage of your cat?", options: ["Stage 1 (without proteinuria)", "Stages 2 to 4 (with or without proteinuria)"], maxSelect: 1 },
      { id: "tubeFed", question: "Is the cat being tube fed?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "hypoallergenic", question: "Does your cat need a hypoallergenic diet?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Weight Management": [
      { id: "weightGoal", question: "What is the primary weight-related health goal?", options: ["Needs to lose weight / is overweight", "Overweight and gastrointestinal issues", "Overweight and urinary disease", "Overweight and food allergy/sensitivity", "Overweight and stressed/anxious"], maxSelect: 1 },
      { id: "aggressive", question: "Is aggressive weight loss needed?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Digestive Support": [
      { id: "giStrategy", question: "What kind of nutritional strategy is your vet using for cat's GI health?", options: ["Constipation", "Hairball management", "Recovery/Assisted feeding", "Vomiting and/or diarrhea"], maxSelect: 1 },
      { id: "age", question: "Is your cat a kitten or an adult?", options: ["Kitten", "Adult"], maxSelect: 1 },
      { id: "tubeFed", question: "Is tube feeding required?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "acuteChronic", question: "Is the problem acute or chronic?", options: ["Acute", "Chronic"], maxSelect: 1 },
      { id: "overweight", question: "Is your cat overweight?", options: ["Overweight", "Ideal weight/Underweight"], maxSelect: 1 },
      { id: "allergy", question: "Does your cat have concurrent skin allergy or food allergy?", options: ["Yes", "No"], maxSelect: 1 }
    ],
    "Vital Organ Support": [
      { id: "organCondition", question: "What condition is your vet helping you manage?", options: ["Liver Disease or Hepatic Encephalopathy", "Needs Help Recovering or Being Syringe Fed"], maxSelect: 1 }
    ],
    "General Health and Management": [
      { id: "generalSupport", question: "What general health or recovery support does your cat need?", options: ["Dental issues", "Recovery from illness, surgery, or weight loss", "Mobility issues"], maxSelect: 1 }
    ],
    "Skin and Food Sensitivities": [
      { id: "sensitivityType", question: "What type of sensitivity are you trying to manage?", options: ["Dermatologic Sensitivity", "Gastrointestinal Sensitivity"], maxSelect: 1 },
      { id: "failedTrials", question: "Has your cat failed previous trial / elimination diets?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "dietType", question: "Is a hydrolyzed diet preferred or a novel protein diet?", options: ["Hydrolyzed diet", "Novel protein diet"], maxSelect: 1 },
      { id: "weightControl", question: "Does your cat tend to overeat or need weight control?", options: ["Yes", "No"], maxSelect: 1 },
      { id: "proteinSource", question: "Which protein source would your cat like to try?", options: ["Rabbit", "Duck"], maxSelect: 1 }
    ],
    "Diabetes Support": [
      { id: "diabetesManagement", question: "How is your cat's diabetes being managed?", options: ["Diet only", "Diet + insulin", "Newly diagnosed"], maxSelect: 1 }
    ]
  }
};
