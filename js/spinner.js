class SpinnerManager {
    constructor(spinnerId) {
        this.spinner = document.getElementById(spinnerId);
        this.isVisible = false;
    }
    show() { // показать спиннер
        if (this.spinner) {
            this.spinner.classList.remove('hidden');
            this.isVisible = true;
        }
    }
    hide() { // скрыть спиннер
        if (this.spinner) {
            this.spinner.classList.add('hidden');
            this.isVisible = false;
        }
    }
    toggle() {
        if (this.isVisible) this.hide();
        else this.show();
    }
    showForDuration(duration) { // показать спиннер на заданное время
        this.show();
        setTimeout(() => this.hide(), duration);
    }
}
// const spinnerManager = new SpinnerManager('jsSpinner'); // Создаем экземпляр менеджера для спиннера

// Функция для использования с fetch запросами
// async function fetchWithSpinner(url, options = {}) {
//     spinnerManager.show();
//     try {
//         const response = await fetch(url, options);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Ошибка загрузки:', error);
//         throw error;
//     } finally {
//         spinnerManager.hide();
//     }
// }

// Пример использования с fetch
// async function loadData() {
//     try {
//         const data = await fetchWithSpinner('https://api.example.com/data');
//         console.log('Полученные данные:', data);
//     } catch (error) {
//         console.error('Не удалось загрузить данные');
//     }
// }
export default SpinnerManager;