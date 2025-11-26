// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboardStats();
    await loadRecentActivity();
});

async function loadDashboardStats() {
    try {
        // Carregar contagens de cada tipo
        const [registros, exames, treinos, metas] = await Promise.all([
            fetch(`${API_URL}/registro-diario`).then(r => r.json()),
            fetch(`${API_URL}/exames`).then(r => r.json()),
            fetch(`${API_URL}/treinos`).then(r => r.json()),
            fetch(`${API_URL}/metas`).then(r => r.json())
        ]);

        document.getElementById('total-registros').textContent = registros.length;
        document.getElementById('total-exames').textContent = exames.length;
        document.getElementById('total-treinos').textContent = treinos.length;

        // Contar apenas metas em andamento
        const metasAtivas = metas.filter(m => m.status === 'em_andamento').length;
        document.getElementById('total-metas').textContent = metasAtivas;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

async function loadRecentActivity() {
    try {
        // Carregar atividades recentes de diferentes tipos
        const [registros, exames, treinos] = await Promise.all([
            fetch(`${API_URL}/registro-diario`).then(r => r.json()),
            fetch(`${API_URL}/exames`).then(r => r.json()),
            fetch(`${API_URL}/treinos`).then(r => r.json())
        ]);

        // Combinar e ordenar por data (últimos 5)
        let activities = [];

        registros.slice(0, 3).forEach(r => {
            activities.push({
                type: 'Registro Diário',
                date: r.data,
                description: `Peso: ${r.peso || 'N/A'} kg, Humor: ${r.humor || 'N/A'}`,
                icon: '📋'
            });
        });

        exames.slice(0, 2).forEach(e => {
            activities.push({
                type: 'Exame',
                date: e.data_exame,
                description: e.titulo,
                icon: '🔬'
            });
        });

        treinos.slice(0, 2).forEach(t => {
            activities.push({
                type: 'Treino',
                date: t.data,
                description: `${t.exercicio} - ${t.series}x${t.repeticoes}`,
                icon: '💪'
            });
        });

        const container = document.getElementById('recent-activity');

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-text">Nenhuma atividade recente</div>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <span style="font-size: 1.5rem; margin-right: 10px;">${activity.icon}</span>
                        <span class="item-title">${activity.type}</span>
                    </div>
                    <span class="item-date">${formatDate(activity.date)}</span>
                </div>
                <div class="item-body">
                    <p>${activity.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar atividade recente:', error);
    }
}
