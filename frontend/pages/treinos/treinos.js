// Treinos JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadTreinos();
});

function setupForm() {
    const form = document.getElementById('form-treinos');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/treinos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Treino adicionado com sucesso!');
                form.reset();
                setDefaultDates();
                loadTreinos();
            } else {
                showToast('Erro ao adicionar treino', 'error');
            }
        } catch (error) {
            showToast('Erro ao adicionar treino', 'error');
            console.error(error);
        }
    });
}

async function loadTreinos() {
    try {
        const response = await fetch(`${API_URL}/treinos`);
        const treinos = await response.json();
        const lista = document.getElementById('lista-treinos');

        if (treinos.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💪</div>
                    <div class="empty-state-text">Nenhum treino registrado ainda</div>
                </div>
            `;
            return;
        }

        lista.innerHTML = treinos.map(treino => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${treino.exercicio}</div>
                        <div class="item-date">${formatDate(treino.data)}</div>
                    </div>
                    <button onclick="deleteTreino(${treino.id})" class="btn btn-danger btn-small">Excluir</button>
                </div>
                <div class="item-body">
                    ${treino.tipo ? `<div class="item-field"><span class="item-field-label">Tipo:</span><span class="item-field-value"><span class="badge badge-info">${treino.tipo}</span></span></div>` : ''}
                    ${treino.series ? `<div class="item-field"><span class="item-field-label">Séries:</span><span class="item-field-value">${treino.series}x${treino.repeticoes || '?'}</span></div>` : ''}
                    ${treino.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${treino.peso} kg</span></div>` : ''}
                    ${treino.duracao ? `<div class="item-field"><span class="item-field-label">Duração:</span><span class="item-field-value">${treino.duracao} min</span></div>` : ''}
                    ${treino.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${treino.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar treinos:', error);
    }
}

async function deleteTreino(id) {
    const deleted = await deleteItem('treinos', id);
    if (deleted) {
        loadTreinos();
    }
}
