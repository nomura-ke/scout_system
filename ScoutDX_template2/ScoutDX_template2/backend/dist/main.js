"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept',
    });
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen(port);
    console.log(`▼ バックエンドサーバーがポート${port}で起動しました！`);
    console.log(`APIのベースURL: http://localhost:${port}/api/scouts`);
}
bootstrap();
//# sourceMappingURL=main.js.map