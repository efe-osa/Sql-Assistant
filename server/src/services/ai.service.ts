import { TogetherAI } from '@langchain/community/llms/togetherai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { logger } from '../utils/logger';
import { databaseManager } from './database.service';
import config from '../config';

class AIService {
    private static instance: AIService;
    private llm!: TogetherAI;
    private sqlQueryPrompt!: PromptTemplate;
    private naturalLanguagePrompt!: PromptTemplate;
    private sqlQueryGeneratorChain!: RunnableSequence;
    private schemaCache: Map<string, string> = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    private constructor() {
        this.initializeLLM();
        this.initializePrompts();
        this.initializeChains();
    }

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private initializeLLM(): void {
        this.llm = new TogetherAI({
            apiKey: config.TOGETHER_API_KEY,
            modelName: config.TOGETHER_MODEL_NAME,
            temperature: 0.1, // Lower temperature for more consistent SQL queries
            maxTokens: 1000
        });
    }

    private initializePrompts(): void {
        this.sqlQueryPrompt = PromptTemplate.fromTemplate(
            `You are a SQL expert. Using the provided table schemas, generate an exact SQL query to answer the user's question.
            Consider the table names mentioned in the question and return ONLY the SQL query without any explanations or markdown formatting.

            Table Schemas:
            {schema}

            Question: {question}
            SQL Query:`
        );

        this.naturalLanguagePrompt = PromptTemplate.fromTemplate(
            `You are a SQL expert. Using the provided information, generate a concise and clear natural language response.

            Table Schemas:
            {schema}

            Question: {question}
            SQL Query: {query}
            SQL Response: {response}

            Response:`
        );
    }

    private initializeChains(): void {
        this.sqlQueryGeneratorChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                schema: async () => await this.getCachedSchema()
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

    private async getCachedSchema(): Promise<string> {
        const cacheKey = 'default_schema';
        const cachedSchema = this.schemaCache.get(cacheKey);

        if (cachedSchema) {
            return cachedSchema;
        }

        try {
            const schema = await databaseManager.getDefaultConnection().sqlDb.getTableInfo();
            this.schemaCache.set(cacheKey, schema);

            // Clear cache after TTL
            setTimeout(() => {
                this.schemaCache.delete(cacheKey);
            }, this.CACHE_TTL);

            return schema;
        } catch (error) {
            logger.error('Error fetching schema:', error);
            throw new Error('Failed to fetch database schema');
        }
    }

    private sanitizeQuery(query: string): string {
        return query.replace(/```(sql)?/gi, '').trim();
    }

    async generateSQLQuery(userPrompt: string): Promise<string> {
        try {
            const chainResult = await this.sqlQueryGeneratorChain.invoke({
                question: userPrompt,
            });

            const sqlQuery = this.sanitizeQuery(chainResult);
            logger.info('Generated SQL Query:', sqlQuery);
            return sqlQuery;
        } catch (error) {
            logger.error('Error generating SQL query:', error);
            throw new Error('Failed to generate SQL query. Please try again with a different question.');
        }
    }

    async generateNaturalLanguageResponse(queryDescription: string): Promise<string> {
        try {
            const fullChain = RunnableSequence.from([
                RunnablePassthrough.assign({
                    query: this.sqlQueryGeneratorChain
                }),
                {
                    schema: async () => await this.getCachedSchema(),
                    question: (input: { question: string }) => input.question,
                    query: (input: { query: string }) => this.sanitizeQuery(input.query),
                    response: async (input: { query: string }) => {
                        try {
                            return await databaseManager.getDefaultConnection().sqlDb.run(input.query);
                        } catch (error) {
                            logger.error('Error executing SQL query:', error);
                            throw new Error('Failed to execute SQL query');
                        }
                    }
                },
                this.naturalLanguagePrompt,
                this.llm,
                new StringOutputParser()
            ]);

            const finalResponse = await fullChain.invoke({
                question: queryDescription.endsWith('?') ? queryDescription : `${queryDescription}?`
            });

            return finalResponse.trim();
        } catch (error) {
            logger.error('Error generating natural language response:', error);
            throw new Error('Failed to generate response. Please try again with a different question.');
        }
    }
}

export const aiService = AIService.getInstance();