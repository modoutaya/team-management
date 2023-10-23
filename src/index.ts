import app  from './configuration/primaries/app';

(async() => {
    const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    app.listen(port, () => {
        console.info(`Server listening on port ${port}`);
    });
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
