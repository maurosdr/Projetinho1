// Funções comuns para todas as páginas
const API_URL = 'http://localhost:3000/api';

// Sistema de Notificações
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Formatar data para exibição
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Definir data padrão para hoje nos campos de data
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"][name="data"]').forEach(input => {
        if (!input.value) input.value = today;
    });
}

// Deletar item genérico
async function deleteItem(endpoint, id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Item removido com sucesso!');
            return true;
        } else {
            showToast('Erro ao remover item', 'error');
            return false;
        }
    } catch (error) {
        showToast('Erro ao remover item', 'error');
        console.error(error);
        return false;
    }
}

// Inicializar datas padrão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    setDefaultDates();
});
