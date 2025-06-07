import { TogetherAI } from '@langchain/community/llms/togetherai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { logger } from '../utils/logger';
import { db } from '../config/database';
import config from '../config';

class AIService {
    private llm: TogetherAI;
    private sqlQueryPrompt: PromptTemplate;
    private sqlQueryGeneratorChain: RunnableSequence;

    constructor() {
        this.llm = new TogetherAI({
            apiKey: config.TOGETHER_API_KEY,
            modelName: config.TOGETHER_MODEL_NAME
        });

        this.sqlQueryPrompt = PromptTemplate.fromTemplate(
            "Act as a SQL expert. Based on the table schema below, write an exact SQL query that would answer the user's question. Return only the SQL query and nothing else:\n    {schema}\n\n    Question: {question}\n    SQL Query:"
        );

        this.sqlQueryGeneratorChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                schema: async () => await db.getTableInfo()
            }),
            this.sqlQueryPrompt,
            this.llm.withConfig({
                configurable: {
                    start: ['```sql'],
                    stop: ['```']
                }
            }),
            new StringOutputParser()
        ]);
    }

    async generateSQLQuery(userPrompt: string): Promise<string> {
        try {
            const chainResult = await this.sqlQueryGeneratorChain.invoke({
                question: userPrompt,
            });

            console.log('chainResult:>>>>', chainResult);
            const sqlQuery = chainResult.trim();

            logger.info('Generated SQL Query:', sqlQuery);
            return sqlQuery;
        } catch (error) {
            logger.error('Error generating sql query:', error);
            throw error;
        }
    }

    async generateNaturalLanguageResponse(queryDescription: string): Promise<string> {
        const finalResponsePrompt = PromptTemplate.fromTemplate(
            "Act as a SQL expert. Based on the table schema below, question, sql query, and sql response, write a natural language response:\n    {schema}\n\n    Question: {question}\n    SQL Query: {query}\n    SQL Response: {response}"
        );

        const fullChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                query: this.sqlQueryGeneratorChain
            }),
            {
                schema: async () => await db.getTableInfo(),
                question: (input: { question: string }) => input.question,
                query: (input: { query: string }) => input.query,
                response: async (input: { query: string }) => await db.run(input.query)
            },
            finalResponsePrompt,
            this.llm,
            new StringOutputParser()
        ]);

        const finalResponse = await fullChain.invoke({
            question: queryDescription + "?"
        });

        console.log("", finalResponse)
        return finalResponse.trim();
    }
}

export const aiService = new AIService();