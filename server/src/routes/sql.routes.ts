import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    try {
        const { queryDescription } = req.body;
        const sqlQuery = await aiService.generateSQLQuery(queryDescription);
        res.json({ sqlQuery });
    } catch (error) {
        console.log(error);
        res.json({
            sqlQuery: 'Great question. I have not been trained on that. Ask me something else.'
        });
    }
});

router.post('/ask-database', async (req: Request, res: Response) => {
    try {
        const { queryDescription } = req.body;
        const response = await aiService.generateNaturalLanguageResponse(queryDescription);
        res.json({ response });
    } catch (error) {
        console.log(error);
        res.json({
            response: 'Great question. I have not been trained on that. Ask me something else.'
        });
    }
});

export const sqlRouter = router;