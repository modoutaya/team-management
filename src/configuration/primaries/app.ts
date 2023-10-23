import express from 'express';
import teamRouter from '../../adapters/primaries/REST/teams';
import memberRouter from '../../adapters/primaries/REST/member';

const app = express();

app.use(express.json());

app.use('/api/teams', teamRouter);
app.use('/api/members', memberRouter);

export default app;
