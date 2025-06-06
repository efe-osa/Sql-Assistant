"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
var togetherai_1 = require("@langchain/community/llms/togetherai");
var prompts_1 = require("@langchain/core/prompts");
var output_parsers_1 = require("@langchain/core/output_parsers");
var runnables_1 = require("@langchain/core/runnables");
var logger_1 = require("../utils/logger");
var database_1 = require("../config/database");
var config_1 = __importDefault(require("../config"));

var AIService = (function () {
    function AIService() {
        var _this = this;

        _classCallCheck(this, AIService);

        this.llm = new togetherai_1.TogetherAI({
            apiKey: config_1["default"].TOGETHER_API_KEY,
            modelName: config_1["default"].TOGETHER_MODEL_NAME
        });
        this.sqlQueryPrompt = prompts_1.PromptTemplate.fromTemplate("Based on the table schema below, write an exact SQL query that would answer the user's question. Return only the SQL and nothing else:\n    {schema}\n\n    Question: {question}\n    SQL Query:");
        this.sqlQueryGeneratorChain = runnables_1.RunnableSequence.from([runnables_1.RunnablePassthrough.assign({ schema: function schema() {
                return regeneratorRuntime.async(function schema$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            context$3$0.next = 2;
                            return regeneratorRuntime.awrap(database_1.db.getTableInfo());

                        case 2:
                            return context$3$0.abrupt("return", context$3$0.sent);

                        case 3:
                        case "end":
                            return context$3$0.stop();
                    }
                }, null, _this);
            } }), this.sqlQueryPrompt, this.llm.withConfig({
            configurable: {
                stop: ['```sql'],
                start: ['```']
            }
        }), new output_parsers_1.StringOutputParser()]);
    }

    // Generate SQL Query

    _createClass(AIService, [{
        key: "generateSQLQuery",
        value: function generateSQLQuery(userPrompt) {
            var chainResult, sqlQuery;
            return regeneratorRuntime.async(function generateSQLQuery$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.prev = 0;
                        context$2$0.next = 3;
                        return regeneratorRuntime.awrap(this.sqlQueryGeneratorChain.invoke({
                            question: userPrompt
                        }));

                    case 3:
                        chainResult = context$2$0.sent;

                        console.log('chainResult:>>>>', chainResult);
                        sqlQuery = chainResult.trim();

                        logger_1.logger.info('Generated SQL Query:', sqlQuery);
                        return context$2$0.abrupt("return", sqlQuery);

                    case 10:
                        context$2$0.prev = 10;
                        context$2$0.t0 = context$2$0["catch"](0);

                        logger_1.logger.error('Error generating sql query:', context$2$0.t0);
                        throw context$2$0.t0;

                    case 14:
                    case "end":
                        return context$2$0.stop();
                }
            }, null, this, [[0, 10]]);
        }
    }, {
        key: "generateNaturalLanguageResponse",
        value: function generateNaturalLanguageResponse(queryDescription) {
            var finalResponsePrompt, fullChain, finalResponse;
            return regeneratorRuntime.async(function generateNaturalLanguageResponse$(context$2$0) {
                var _this2 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        finalResponsePrompt = prompts_1.PromptTemplate.fromTemplate("Based on the table schema below, question, sql query, and sql response, write a natural language response:\n    {schema}\n\n    Question: {question}\n    SQL Query: {query}\n    SQL Response: {response}");
                        fullChain = runnables_1.RunnableSequence.from([runnables_1.RunnablePassthrough.assign({
                            query: this.sqlQueryGeneratorChain
                        }), {
                            schema: function schema() {
                                return regeneratorRuntime.async(function schema$(context$3$0) {
                                    while (1) switch (context$3$0.prev = context$3$0.next) {
                                        case 0:
                                            return context$3$0.abrupt("return", database_1.db.getTableInfo());

                                        case 1:
                                        case "end":
                                            return context$3$0.stop();
                                    }
                                }, null, _this2);
                            },
                            question: function question(input) {
                                return input.question;
                            },
                            query: function query(input) {
                                return input.query;
                            },
                            response: function response(input) {
                                return database_1.db.run(input.query);
                            }
                        }, finalResponsePrompt, this.llm]);
                        context$2$0.next = 4;
                        return regeneratorRuntime.awrap(fullChain.invoke({
                            question: queryDescription + "?"
                        }));

                    case 4:
                        finalResponse = context$2$0.sent;
                        return context$2$0.abrupt("return", finalResponse);

                    case 6:
                    case "end":
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }]);

    return AIService;
})();

exports.aiService = new AIService();
//# sourceMappingURL=ai.service.js.map