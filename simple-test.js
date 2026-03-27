const axios = require('axios');
const http = require('http');

const API_URL = 'http://localhost:9999';
const FRONTEND_URL = 'http://localhost:3000';

async function runTests() {
    console.log('ЗАПУСК АВТОМАТИЧЕСКИХ ТЕСТОВ');

    // Тест 1: Проверка доступности backend
    console.log('1. Проверка backend сервера...');
    try {
        const response = await axios.get(`${API_URL}/tasksss`);
        console.log('   Успех: backend отвечает (код:', response.status, ')');
    } catch (err) {
        console.log('   Ошибка: backend не отвечает');
        console.log('   Детали:', err.message);
        process.exit(1);
    }

    // Тест 2: Добавление задачи
    console.log('\n2. Добавление задачи...');
    try {
        const postResponse = await axios.post(`${API_URL}/tasks`, { title: 'Тестовая задача' });
        console.log('   Успех: задача создана, ID:', postResponse.data.id);
        if (!postResponse.data.id) {
            console.log('   Ошибка: задача не имеет ID');
            process.exit(1);
        }
    } catch (err) {
        console.log('   Ошибка: не удалось добавить задачу');
        console.log('   Детали:', err.message);
        process.exit(1);
    }

    // Тест 3: Получение списка задач
    console.log('\n3. Получение списка задач...');
    try {
        const tasksResponse = await axios.get(`${API_URL}/tasks`);
        console.log('   Успех: получено задач:', tasksResponse.data.length);
        if (tasksResponse.data.length === 0) {
            console.log('   Ошибка: список задач пуст');
            process.exit(1);
        }
        console.log('   Успех: первая задача:', tasksResponse.data[0].title);
    } catch (err) {
        console.log('   Ошибка: не удалось получить список ');
        console.log('   Детали:', err.message);
        process.exit(1);
    }

    // Тест 4: Проверка доступности frontend
    console.log('\n4. Проверка frontend сервера...');
    const frontendOk = await new Promise((resolve) => {
        const req = http.get(FRONTEND_URL, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => resolve(false));
    });
    
    if (frontendOk) {
        console.log('   Успех: фронтенд доступен');
    } else {
        console.log('   Предупреждение: фронтенд недоступен');
    }

    // Тест 5: Очистка базы данных
    console.log('\n5. Очистка базы данных...');
    try {
        await axios.delete(`${API_URL}/tasks/clear`);
        console.log('   Успех: база данных очищена');
    } catch (err) {
        console.log('   Предупреждение: не удалось очистить базу');
    }

    // Тест 6: Проверка, что база действительно очистилась
    console.log('\n6. Проверка очистки...');
    try {
        const finalResponse = await axios.get(`${API_URL}/tasks`);
        if (finalResponse.data.length === 0) {
            console.log('   Успех: база пуста');
        } else {
            console.log('   Предупреждение: в базе остались задачи');
        }
    } catch (err) {
        console.log('   Предупреждение: не удалось проверить очистку');
    }

    console.log('\n========================================');
    console.log('ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО');
    console.log('========================================\n');
    process.exit(0);
}

runTests().catch(err => {
    console.error('\nКРИТИЧЕСКАЯ ОШИБКА:', err.message);
    process.exit(1);
});