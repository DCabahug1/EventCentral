import { Review } from "../types";
import Anthropic from "@anthropic-ai/sdk";

const buildPrompt = (reviews: Review[]) => {
  return `You will be summarizing a list of reviews for an event. Here are the reviews:

<reviews>
${reviews.map((review) => `Review ${review.id}: ${review.content}`).join("\n\n")}
</reviews>

Your task is to create a summary of these reviews following these requirements:

- Write the summary as a single paragraph
- Keep the summary to 100 words or fewer
- Write the summary in the same language as the reviews
- Capture the main themes, sentiments, and key points mentioned across the reviews
- Bold 3 to 5 key words or short phrases that capture the most important sentiments or themes by wrapping them in double asterisks, like **great atmosphere**
- Output ONLY the summary text itself, with no additional commentary, labels, or XML tags

Begin your response with the summary directly.`;
};

export const generateReviewSummary = async (
  reviews: Review[],
): Promise<string | null | Error> => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: buildPrompt(reviews),
            },
          ],
        },
      ],
    });

    const result =
      response.content[0]?.type === "text" ? response.content[0].text : null;
    return result as string | null;
  } catch (error) {
    return new Error("Failed to generate review summary") as Error;
  }
};
