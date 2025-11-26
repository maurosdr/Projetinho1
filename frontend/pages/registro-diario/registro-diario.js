// Registro Diário JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadRegistros();
});

function setupForm() {
    const form = document.getElementById('form-registro-diario');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/registro-diario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Registro adicionado com sucesso!');
                form.reset();
                setDefaultDates();
                loadRegistros();
            } else {
                showToast('Erro ao adicionar registro', 'error');
            }
        } catch (error) {
            showToast('Erro ao adicionar registro', 'error');
            console.error(error);
        }
    });
}

async function loadRegistros() {
    try {
        const response = await fetch(`${API_URL}/registro-diario`);
        const registros = await response.json();
        const lista = document.getElementById('lista-registro-diario');

        if (registros.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">Nenhum registro diário ainda</div>
                </div>
            `;
            return;
        }

        lista.innerHTML = registros.map(registro => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${formatDate(registro.data)}</div>
                    <button onclick="deleteRegistro(${registro.id})" class="btn btn-danger btn-small">Excluir</button>
                </div>
                <div class="item-body">
                    ${registro.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${registro.peso} kg</span></div>` : ''}
                    ${registro.pressao_arterial ? `<div class="item-field"><span class="item-field-label">Pressão:</span><span class="item-field-value">${registro.pressao_arterial}</span></div>` : ''}
                    ${registro.temperatura ? `<div class="item-field"><span class="item-field-label">Temperatura:</span><span class="item-field-value">${registro.temperatura}°C</span></div>` : ''}
                    ${registro.humor ? `<div class="item-field"><span class="item-field-label">Humor:</span><span class="item-field-value"><span class="badge badge-info">${registro.humor}</span></span></div>` : ''}
                    ${registro.nivel_energia ? `<div class="item-field"><span class="item-field-label">Energia:</span><span class="item-field-value">${registro.nivel_energia}/10</span></div>` : ''}
                    ${registro.horas_sono ? `<div class="item-field"><span class="item-field-label">Sono:</span><span class="item-field-value">${registro.horas_sono}h - ${registro.qualidade_sono || 'N/A'}</span></div>` : ''}
                    ${registro.sintomas ? `<div class="item-field"><span class="item-field-label">Sintomas:</span><span class="item-field-value">${registro.sintomas}</span></div>` : ''}
                    ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar registros:', error);
    }
}

async function deleteRegistro(id) {
    const deleted = await deleteItem('registro-diario', id);
    if (deleted) {
        loadRegistros();
    }
}
