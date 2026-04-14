const dados = [
        { ano: "2020", total: 101 },
        { ano: "2021", total: 25 },
        { ano: "2022", total: 20 },
        { ano: "2023", total: 45 },
        { ano: "2024", total: 60 },
        { ano: "2025", total: 54},
    ];

//Grafico de barras com o D3
function criarGrafico(title, data, target){
    d3.select(target).selectAll("*").remove();
    //tamanhos da janela do svg
    const largura = 400;
    const altura = 300;
    const larguraBarra = 50;
    const espacoEntreBarras = 10;
    //seleciona elemento do html e cria o elemento do svg

    const svg = d3.select(target)
        .append("svg")
        .attr("width", largura)
        .attr("height", altura + 25) 
        .style("background", "transparent");
    //Cria retangulos dentro do svg criado antes

    svg.selectAll("rect")
        .data(data)//conecta os dados ao d3
        .enter()
        .append("rect") 
        .attr("class", "bar")
        .attr("fill", 'var(--accent-color)')
        .attr("x", (d,i) => i * (larguraBarra + espacoEntreBarras))
        .attr("width", larguraBarra)
        .attr("y", altura)     
        .attr("height", 0)     
        .transition()          
        .duration(1000)       
        .delay((d, i) => i * 100) 
        .attr("y", d => altura - d.total) 
        .attr("height", d => d.total);

    //valor para cada barra
    svg.selectAll(".label-valor") 
        .data(data)
        .enter()
        .append("text")
        .text(d => d.total)
        .attr("x", (d,i) => i * (larguraBarra + espacoEntreBarras) + larguraBarra/2)
        .attr("y", d => altura - d.total - 5)
        .attr("text-anchor", "middle") 
        .attr("fill", 'var(--text-color)')
        .style("font-size", "12px")
        .style("opacity", 0)
        .transition()
        .delay(1200) 
        .style("opacity", 1);

    //Legenda de cada barra
    svg.selectAll(".label-ano")
        .data(dados)
        .enter()
        .append("text")
        .text(d => d.ano)
        .attr("x", (d,i) => i * (larguraBarra + espacoEntreBarras) + larguraBarra/2)
        .attr("y", altura + 25)
        .attr("text-anchor", "middle")
        .attr("fill", 'var(--accent-color)')
        .style("font-size", "14px")
        .style("font-weight", "bold");

    //Titulo do grafico
    svg.append("text")
    .attr("class", "h2")
    .attr("x", '50%')               
    .attr("y", 30)                        
    .attr("text-anchor", "middle")       
    .attr("fill", "var(--text-color)")                
    .style("font-size", "25px")           
    .style("font-weight", "bold")
    .text(title);
}


// Gráfico(Donut Chart) com o D3
function criarDonutChart(title, data, target) {
    d3.select(target).selectAll("*").remove();
    const largura = 500;
    const altura = 350;
    const margem = 40;
    

    const raioExterno = Math.min(largura, altura) / 2 - margem;
    const raioInterno = raioExterno * 0.65; 
    
    const svg = d3.select(target)
        .append("svg")
        .attr("width", largura)
        .attr("height", altura + 30)
        .style("background", "transparent")
        .append("g")
        .attr("transform", `translate(${largura / 2}, ${(altura / 2) + 20})`);
    
    const coresModernas = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5"];
    const cores = d3.scaleOrdinal()
        .domain(data.map(d => d.ano))
        .range(coresModernas);

    // Configurar o Pie com espaçamento entre as fatias (padAngle)
    const pie = d3.pie()
        .value(d => d.total)
        .sort(null)
        .padAngle(0.05); // Espaçamento elegante entre as fatias


    // Gerador de arcos para as labels (texto) mais para fora
    const arcLabels = d3.arc()
        .innerRadius(raioExterno * 1.2)
        .outerRadius(raioExterno * 1.2);
    
    const arc = d3.arc()
        .innerRadius(raioInterno)
        .outerRadius(raioExterno)
        .cornerRadius(10);


    // Adicionar as fatias
    const fatias = svg.selectAll("fatias")
        .data(pie(data))
        .enter()
        .append("g");

    // Desenhar os caminhos (fatias) com animação suave
    fatias.append("path")
        .attr("fill", d => cores(d.data.ano))
        // Sombra leve para dar profundidade
        .style("filter", "drop-shadow(2px 4px 6px rgba(0,0,0,0.1))") 
        .transition()
        .duration(1200)
        .attrTween("d", function(d) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function(t) {
                return arc(i(t));
            };
        });

    // Adicionar os valores/anos por fora do gráfico ligando com as fatias
    fatias.append("text")
        .html(d => `<tspan font-weight="bold">${d.data.ano}</tspan>: ${d.data.total}`)
        .attr("transform", d => `translate(${arcLabels.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("fill", 'var(--text-color, #555)')
        .style("font-size", "13px")
        .style("opacity", 0)
        .transition()
        .delay(1200)
        .duration(600)
        .style("opacity", 1);

    // Calcular o total para colocar no centro do Donut
    const valorTotal = d3.sum(data, d => d.total);

    // Texto no Centro do Donut (Valor Total)
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -5)
        .attr("fill", "var(--text-color, #333)")
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .text(valorTotal)
        .transition()
        .delay(1000)
        .duration(800)
        .style("opacity", 1);

    // Texto no Centro do Donut
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("fill", "var(--text-color, #777)")
        .style("font-size", "14px")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "2px")
        .style("opacity", 0)
        .text("Total")
        .transition()
        .delay(1200)
        .duration(800)
        .style("opacity", 1);

    // Título do Gráfico
    svg.append("text")
        .attr("class", "h2")
        .attr("x", 0)               
        .attr("y", - (altura / 2) + 5)                        
        .attr("text-anchor", "middle")       
        .attr("fill", "var(--text-color, #333)")                
        .style("font-size", "22px")           
        .style("font-weight", "bold")
        .text(title);
}
//Funçao que vai executar as funçoes de criaçao dos graficos 
function mostrarGrafico(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            criarGrafico("Investigações Concluídas", dados, '#grafico-barras')
            criarDonutChart("Investigações com Parceiros", dados, '#grafico-donut')
        }
    })
}
//Cria um objeto de observer que vai executar a função mostrarGrafico
const observer = new IntersectionObserver(mostrarGrafico);
//Seleciona o elemento do html que o observer vai ficar a espera que apareça na tela
const elementoAlvo = document.querySelector('#graficos-holder');

observer.observe(elementoAlvo)

