const App = require("./app");  

async function main() {
    const app = new App(3006);
    await app.listen();
}

main();