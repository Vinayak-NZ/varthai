<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script>
(function () {
  const el = document.getElementById('phd-bar');
  if (!el) return;

  // Dummy data
  const data = [
    { label: 'A', value: 12 },
    { label: 'B', value: 35 },
    { label: 'C', value: 22 },
    { label: 'D', value: 44 },
    { label: 'E', value: 18 },
    { label: 'F', value: 29 }
  ];

  // --- Palette & colour scale ---
  const palette = ["#4739a2", "#46e7fd", "#e18b22", "#fefe62", "#d35fb7", "#009e73"];
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(palette);

  // Tooltip element (one per page)
  let tip = document.querySelector('.d3-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'd3-tip';
    tip.style.opacity = 0;
    document.body.appendChild(tip);
  }

  function render() {
    el.innerHTML = '';

    const width  = el.clientWidth || 600;
    const height = el.clientHeight || 320;

    const margin = { top: 16, right: 16, bottom: 40, left: 44 };
    const w = width  - margin.left - margin.right;
    const h = height - margin.top  - margin.bottom;

    const svg = d3.select(el).append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, w])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([h, 0]);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y).ticks(6));

    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('y', h)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', d => color(d.label))
      .on('mousemove', (event, d) => {
        tip.style.opacity = 1;
        tip.textContent = `${d.label}: ${d.value}`;
        tip.style.left = event.pageX + 'px';
        tip.style.top  = event.pageY + 'px';
      })
      .on('mouseleave', () => { tip.style.opacity = 0; })
      .on('mouseover', function(event, d){
        d3.select(this).attr('fill', d3.color(color(d.label)).darker(0.8));
      })
      .on('mouseout', function(event, d){
        d3.select(this).attr('fill', color(d.label));
      });

    bars.transition()
      .duration(600)
      .attr('y', d => y(d.value))
      .attr('height', d => h - y(d.value));
  }

  render();

  const ro = new ResizeObserver(render);
  ro.observe(el);

  const grid = document.querySelector('.phd-grid');
  if (grid) {
    new MutationObserver(render).observe(grid, { attributes: true, attributeFilter: ['class'] });
  }
})();
</script>